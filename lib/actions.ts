// "use server";
"use server";

import { revalidatePath } from "next/cache";
import pool from "./db";
import { requireAuth } from "./auth";
import type { DashboardStats } from "@/types";

// ============================================
// AUTH ACTIONS
// ============================================

export async function getUserProfile() {
  const user = await requireAuth();
  const result = await pool.query(
    "SELECT id, email, name, role, created_at FROM users WHERE id = $1",
    [user.id]
  );
  return result.rows[0] || null;
}

// ============================================
// DASHBOARD STATS
// ============================================

export async function getDashboardStats(): Promise<DashboardStats> {
  await requireAuth();

  const totalProducts = await pool.query("SELECT COUNT(*) FROM products WHERE is_active = true");
  const stockValue = await pool.query(`
    SELECT COALESCE(SUM(i.quantity * p.cost_price), 0) as value 
    FROM inventory i 
    JOIN products p ON i.product_id = p.id
  `);
  const lowStock = await pool.query(`
    SELECT COUNT(*) FROM inventory i 
    JOIN products p ON i.product_id = p.id 
    WHERE i.quantity <= p.reorder_level
  `);
  const totalIssuances = await pool.query("SELECT COUNT(*) FROM stock_issuances");
  const stockInMonth = await pool.query(`
    SELECT COALESCE(SUM(quantity), 0) FROM stock_transactions 
    WHERE type = 'in' AND created_at >= DATE_TRUNC('month', CURRENT_DATE)
  `);
  const stockOutMonth = await pool.query(`
    SELECT COALESCE(SUM(quantity), 0) FROM stock_transactions 
    WHERE type = 'out' AND created_at >= DATE_TRUNC('month', CURRENT_DATE)
  `);

  return {
    total_products: parseInt(totalProducts.rows[0].count),
    total_stock_value: parseFloat(stockValue.rows[0].value),
    low_stock_count: parseInt(lowStock.rows[0].count),
    total_issuances: parseInt(totalIssuances.rows[0].count),
    stock_in_month: parseInt(stockInMonth.rows[0].coalesce),
    stock_out_month: parseInt(stockOutMonth.rows[0].coalesce),
  };
}

export async function getLowStockItems() {
  await requireAuth();
  const result = await pool.query(`
    SELECT p.id, p.sku, p.name, p.reorder_level, i.quantity, p.unit,
           (p.reorder_level - i.quantity) as shortage
    FROM products p
    JOIN inventory i ON p.id = i.product_id
    WHERE i.quantity <= p.reorder_level AND p.is_active = true
    ORDER BY shortage DESC
    LIMIT 10
  `);
  return result.rows;
}

export async function getRecentTransactions(limit = 10) {
  await requireAuth();
  const result = await pool.query(`
    SELECT t.*, p.name as product_name, p.sku as product_sku, u.name as created_by_name
    FROM stock_transactions t
    JOIN products p ON t.product_id = p.id
    LEFT JOIN users u ON t.created_by = u.id
    ORDER BY t.created_at DESC
    LIMIT $1
  `, [limit]);
  return result.rows;
}

// ============================================
// CATEGORY ACTIONS
// ============================================

export async function getCategories() {
  await requireAuth();
  const result = await pool.query("SELECT * FROM categories ORDER BY name");
  return result.rows;
}

// ============================================
// PRODUCT ACTIONS
// ============================================

export async function getProducts(search?: string, categoryId?: number) {
  await requireAuth();
  let query = `
    SELECT p.*, c.name as category_name, COALESCE(i.quantity, 0) as current_stock
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN inventory i ON p.id = i.product_id
    WHERE p.is_active = true
  `;
  const params: (string | number)[] = [];

  if (search) {
    query += ` AND (p.name ILIKE $${params.length + 1} OR p.sku ILIKE $${params.length + 1})`;
    params.push(`%${search}%`);
  }
  if (categoryId) {
    query += ` AND p.category_id = $${params.length + 1}`;
    params.push(categoryId);
  }

  query += " ORDER BY p.created_at DESC";
  const result = await pool.query(query, params);
  return result.rows;
}

export async function getProductById(id: number) {
  await requireAuth();
  const result = await pool.query(`
    SELECT p.*, c.name as category_name, COALESCE(i.quantity, 0) as current_stock
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN inventory i ON p.id = i.product_id
    WHERE p.id = $1
  `, [id]);
  return result.rows[0] || null;
}

export async function createProduct(data: {
  sku: string;
  name: string;
  description: string;
  category_id: number | null;
  unit_price: number;
  cost_price: number;
  reorder_level: number;
  unit: string;
  initial_stock: number;
}) {
  const user = await requireAuth();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const productResult = await client.query(`
      INSERT INTO products (sku, name, description, category_id, unit_price, cost_price, reorder_level, unit)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *
    `, [data.sku, data.name, data.description || null, data.category_id, data.unit_price, data.cost_price, data.reorder_level, data.unit]);

    const product = productResult.rows[0];

    await client.query(`
      INSERT INTO inventory (product_id, quantity, location)
      VALUES ($1, $2, 'Main Warehouse')
    `, [product.id, data.initial_stock || 0]);

    if (data.initial_stock > 0) {
      await client.query(`
        INSERT INTO stock_transactions (product_id, type, quantity, previous_stock, new_stock, reason, created_by)
        VALUES ($1, 'in', $2, 0, $2, 'Initial stock', $3)
      `, [product.id, data.initial_stock, user.id]);
    }

    await client.query("COMMIT");
    revalidatePath("/products");
    return { success: true, product };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function updateProduct(id: number, data: {
  sku: string;
  name: string;
  description: string;
  category_id: number | null;
  unit_price: number;
  cost_price: number;
  reorder_level: number;
  unit: string;
}) {
  await requireAuth();
  const result = await pool.query(`
    UPDATE products 
    SET sku = $1, name = $2, description = $3, category_id = $4, 
        unit_price = $5, cost_price = $6, reorder_level = $7, unit = $8
    WHERE id = $9 RETURNING *
  `, [data.sku, data.name, data.description || null, data.category_id, data.unit_price, data.cost_price, data.reorder_level, data.unit, id]);

  revalidatePath("/products");
  revalidatePath(`/products/${id}`);
  return { success: true, product: result.rows[0] };
}

export async function deleteProduct(id: number) {
  await requireAuth();
  await pool.query("UPDATE products SET is_active = false WHERE id = $1", [id]);
  revalidatePath("/products");
  return { success: true };
}

// ============================================
// STOCK IN ACTION
// ============================================

export async function stockIn(data: {
  product_id: number;
  quantity: number;
  reason: string;
  reference: string;
  logbook_name?: string;
  document_no?: string;
  logbook_code?: string;
}) {
  const user = await requireAuth();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const invResult = await client.query(
      "SELECT quantity FROM inventory WHERE product_id = $1",
      [data.product_id]
    );
    const previousStock = invResult.rows[0]?.quantity || 0;
    const newStock = previousStock + data.quantity;

    await client.query(`
      INSERT INTO inventory (product_id, quantity, location)
      VALUES ($1, $2, 'Main Warehouse')
      ON CONFLICT (product_id, location) 
      DO UPDATE SET quantity = $2, updated_at = CURRENT_TIMESTAMP
    `, [data.product_id, newStock]);

    await client.query(`
      INSERT INTO stock_transactions (product_id, type, quantity, previous_stock, new_stock, reason, reference, created_by, logbook_name, document_no, logbook_code)
      VALUES ($1, 'in', $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `, [data.product_id, data.quantity, previousStock, newStock, data.reason, data.reference || null, user.id, data.logbook_name || null, data.document_no || null, data.logbook_code || null]);

    await client.query("COMMIT");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

// ============================================
// STOCK OUT / ISSUANCE ACTION
// ============================================

// export async function stockOut(data: {
//   product_id: number;
//   quantity: number;
//   receiver_name: string;
//   receiver_department: string;
//   issue_purpose: string;
//   issuer_name: string;
//   issuer_signature: string;
//   issue_date: string;
//   logbook_name: string;
//   document_no: string;
// }) {
//   const user = await requireAuth();
//   const client = await pool.connect();

//   try {
//     await client.query("BEGIN");

//     const invResult = await client.query(
//       "SELECT quantity FROM inventory WHERE product_id = $1",
//       [data.product_id]
//     );
//     const previousStock = invResult.rows[0]?.quantity || 0;

//     if (previousStock < data.quantity) {
//       throw new Error(`Insufficient stock. Available: ${previousStock}, Requested: ${data.quantity}`);
//     }

//     const newStock = previousStock - data.quantity;

//     await client.query(`
//       INSERT INTO inventory (product_id, quantity, location)
//       VALUES ($1, $2, 'Main Warehouse')
//       ON CONFLICT (product_id, location) 
//       DO UPDATE SET quantity = $2, updated_at = CURRENT_TIMESTAMP
//     `, [data.product_id, newStock]);

//     const transResult = await client.query(`
//       INSERT INTO stock_transactions (product_id, type, quantity, previous_stock, new_stock, reason, created_by)
//       VALUES ($1, 'out', $2, $3, $4, $5, $6) RETURNING id
//     `, [data.product_id, data.quantity, previousStock, newStock, 
//         `Issued to ${data.receiver_name} (${data.receiver_department}) - Doc: ${data.document_no}`, user.id]);

//     const transactionId = transResult.rows[0].id;

//     await client.query(`
//       INSERT INTO stock_issuances (transaction_id, product_id, quantity_out, receiver_name, receiver_department, 
//                                    issue_purpose, issuer_name, issuer_signature, issue_date, logbook_name, document_no)
//       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
//     `, [transactionId, data.product_id, data.quantity, data.receiver_name, data.receiver_department,
//         data.issue_purpose || null, data.issuer_name, data.issuer_signature, data.issue_date,
//         data.logbook_name, data.document_no]);

//     await client.query("COMMIT");
//     revalidatePath("/stock-out");
//     revalidatePath("/reports");
//     revalidatePath("/");
//     return { success: true, transactionId };
//   } catch (error) {
//     await client.query("ROLLBACK");
//     throw error;
//   } finally {
//     client.release();
//   }
// }


export async function stockOut(data: {
  product_id: number;
  quantity: number;
  receiver_name: string;
  receiver_department: string;
  issue_purpose: string;
  issuer_name: string;
  issuer_signature: string;
  issue_date: string;
  logbook_name?: string;
  document_no?: string;
}) {
  const user = await requireAuth();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const invResult = await client.query(
      "SELECT quantity FROM inventory WHERE product_id = $1",
      [data.product_id]
    );
    const previousStock = invResult.rows[0]?.quantity || 0;

    if (previousStock < data.quantity) {
      throw new Error(`Insufficient stock. Available: ${previousStock}, Requested: ${data.quantity}`);
    }

    const newStock = previousStock - data.quantity;

    // Auto-generate Document No: ISS-2026-0001
    const year = new Date().getFullYear();
    const lastDocResult = await client.query(
      `SELECT document_no FROM stock_issuances 
       WHERE document_no LIKE $1 
       ORDER BY id DESC LIMIT 1`,
      [`ISS-${year}-%`]
    );

    let nextNum = 1;
    if (lastDocResult.rows.length > 0 && lastDocResult.rows[0].document_no) {
      const parts = lastDocResult.rows[0].document_no.split('-');
      const lastNum = parseInt(parts[2]);
      if (!isNaN(lastNum)) nextNum = lastNum + 1;
    }
    const documentNo = data.document_no || `ISS-${year}-${String(nextNum).padStart(4, '0')}`;

    await client.query(`
      INSERT INTO inventory (product_id, quantity, location)
      VALUES ($1, $2, 'Main Warehouse')
      ON CONFLICT (product_id, location) 
      DO UPDATE SET quantity = $2, updated_at = CURRENT_TIMESTAMP
    `, [data.product_id, newStock]);

    const transResult = await client.query(`
      INSERT INTO stock_transactions (product_id, type, quantity, previous_stock, new_stock, reason, created_by)
      VALUES ($1, 'out', $2, $3, $4, $5, $6) RETURNING id
    `, [data.product_id, data.quantity, previousStock, newStock, 
        `Issued to ${data.receiver_name} (${data.receiver_department}) - Doc: ${documentNo}`, user.id]);

    const transactionId = transResult.rows[0].id;

    await client.query(`
      INSERT INTO stock_issuances (transaction_id, product_id, quantity_out, receiver_name, receiver_department, 
                                   issue_purpose, issuer_name, issuer_signature, issue_date, logbook_name, document_no)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    `, [transactionId, data.product_id, data.quantity, data.receiver_name, data.receiver_department,
        data.issue_purpose || null, data.issuer_name, data.issuer_signature, data.issue_date,
        data.logbook_name || 'Stock Out Logbook', documentNo]);

    await client.query("COMMIT");
    revalidatePath("/stock-out");
    revalidatePath("/reports");
    revalidatePath("/");
    return { success: true, transactionId, document_no: documentNo };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}








// ============================================
// STOCK ADJUSTMENT
// ============================================

export async function stockAdjustment(data: {
  product_id: number;
  new_quantity: number;
  reason: string;
}) {
  const user = await requireAuth();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const invResult = await client.query(
      "SELECT quantity FROM inventory WHERE product_id = $1",
      [data.product_id]
    );
    const previousStock = invResult.rows[0]?.quantity || 0;
    const diff = data.new_quantity - previousStock;

    await client.query(`
      INSERT INTO inventory (product_id, quantity, location)
      VALUES ($1, $2, 'Main Warehouse')
      ON CONFLICT (product_id, location) 
      DO UPDATE SET quantity = $2, updated_at = CURRENT_TIMESTAMP
    `, [data.product_id, data.new_quantity]);

    await client.query(`
      INSERT INTO stock_transactions (product_id, type, quantity, previous_stock, new_stock, reason, created_by)
      VALUES ($1, 'adjustment', $2, $3, $4, $5, $6)
    `, [data.product_id, Math.abs(diff), previousStock, data.new_quantity, data.reason, user.id]);

    await client.query("COMMIT");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

// ============================================
// TRANSACTIONS / HISTORY
// ============================================

export async function getTransactions(filters?: {
  type?: string;
  productId?: number;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}) {
  await requireAuth();

  let query = `
    SELECT t.*, p.name as product_name, p.sku as product_sku, u.name as created_by_name
    FROM stock_transactions t
    JOIN products p ON t.product_id = p.id
    LEFT JOIN users u ON t.created_by = u.id
    WHERE 1=1
  `;
  const params: (string | number)[] = [];

  if (filters?.type) {
    query += ` AND t.type = $${params.length + 1}`;
    params.push(filters.type);
  }
  if (filters?.productId) {
    query += ` AND t.product_id = $${params.length + 1}`;
    params.push(filters.productId);
  }
  if (filters?.startDate) {
    query += ` AND t.created_at >= $${params.length + 1}`;
    params.push(filters.startDate);
  }
  if (filters?.endDate) {
    query += ` AND t.created_at <= $${params.length + 1}`;
    params.push(filters.endDate + " 23:59:59");
  }

  query += " ORDER BY t.created_at DESC";

  if (filters?.limit) {
    query += ` LIMIT $${params.length + 1}`;
    params.push(filters.limit);
    if (filters.offset !== undefined) {
      query += ` OFFSET $${params.length + 1}`;
      params.push(filters.offset);
    }
  }

  const result = await pool.query(query, params);
  return result.rows;
}

// ============================================
// ISSUANCE REPORT
// ============================================

// export async function getIssuanceReport(filters?: {
//   startDate?: string;
//   endDate?: string;
//   department?: string;
//   productId?: number;
// }) {
//   await requireAuth();

//   let query = `
//     SELECT si.*, p.name as product_name, p.sku as product_sku, p.unit,
//            t.previous_stock, t.new_stock, t.created_at as transaction_date
//     FROM stock_issuances si
//     JOIN products p ON si.product_id = p.id
//     JOIN stock_transactions t ON si.transaction_id = t.id
//     WHERE 1=1
//   `;
//   const params: (string | number)[] = [];

//   if (filters?.startDate) {
//     query += ` AND si.issue_date >= $${params.length + 1}`;
//     params.push(filters.startDate);
//   }
//   if (filters?.endDate) {
//     query += ` AND si.issue_date <= $${params.length + 1}`;
//     params.push(filters.endDate);
//   }
//   if (filters?.department) {
//     query += ` AND si.receiver_department = $${params.length + 1}`;
//     params.push(filters.department);
//   }
//   if (filters?.productId) {
//     query += ` AND si.product_id = $${params.length + 1}`;
//     params.push(filters.productId);
//   }

//   query += " ORDER BY si.issue_date DESC, si.created_at DESC";

//   const result = await pool.query(query, params);
//   return result.rows;
// }

export async function getIssuanceReport(filters?: {
  startDate?: string;
  endDate?: string;
  department?: string;
  productId?: number;
  documentNo?: string;
}) {
  await requireAuth();

  let query = `
    SELECT si.*, p.name as product_name, p.sku as product_sku, p.unit,
           t.previous_stock, t.new_stock, t.created_at as transaction_date
    FROM stock_issuances si
    JOIN products p ON si.product_id = p.id
    JOIN stock_transactions t ON si.transaction_id = t.id
    WHERE 1=1
  `;
  const params: (string | number)[] = [];

  if (filters?.startDate) {
    query += ` AND si.issue_date >= $${params.length + 1}`;
    params.push(filters.startDate);
  }
  if (filters?.endDate) {
    query += ` AND si.issue_date <= $${params.length + 1}`;
    params.push(filters.endDate);
  }
  if (filters?.department) {
    query += ` AND si.receiver_department = $${params.length + 1}`;
    params.push(filters.department);
  }
  if (filters?.productId) {
    query += ` AND si.product_id = $${params.length + 1}`;
    params.push(filters.productId);
  }
  if (filters?.documentNo) {
    query += ` AND si.document_no ILIKE $${params.length + 1}`;
    params.push(`%${filters.documentNo}%`);
  }

  query += " ORDER BY si.issue_date DESC, si.created_at DESC";

  const result = await pool.query(query, params);
  return result.rows;
}










export async function getDepartments() {
  await requireAuth();
  const result = await pool.query(
    "SELECT DISTINCT receiver_department as value, receiver_department as label FROM stock_issuances ORDER BY receiver_department"
  );
  return result.rows;
}

// ============================================
// INVENTORY OVERVIEW
// ============================================

export async function getInventoryOverview() {
  await requireAuth();
  const result = await pool.query(`
    SELECT p.id, p.sku, p.name, p.unit, p.reorder_level,
           COALESCE(i.quantity, 0) as current_stock,
           p.cost_price,
           (COALESCE(i.quantity, 0) * p.cost_price) as stock_value,
           CASE WHEN COALESCE(i.quantity, 0) <= p.reorder_level THEN true ELSE false END as is_low
    FROM products p
    LEFT JOIN inventory i ON p.id = i.product_id
    WHERE p.is_active = true
    ORDER BY p.name
  `);
  return result.rows;
}

// ============================================
// AUTOCOMPLETE HELPERS (Stock In)
// ============================================

export async function getLogbookNames() {
  await requireAuth();
  const result = await pool.query(`
    SELECT DISTINCT logbook_name as value FROM stock_transactions 
    WHERE logbook_name IS NOT NULL AND logbook_name != ''
    ORDER BY logbook_name
  `);
  return result.rows.map(r => r.value);
}

export async function getDocumentNumbers() {
  await requireAuth();
  const result = await pool.query(`
    SELECT DISTINCT document_no as value FROM stock_transactions 
    WHERE document_no IS NOT NULL AND document_no != ''
    ORDER BY document_no
  `);
  return result.rows.map(r => r.value);
}

export async function searchProductsByCode(query: string) {
  await requireAuth();
  const result = await pool.query(`
    SELECT p.*, c.name as category_name, COALESCE(i.quantity, 0) as current_stock
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN inventory i ON p.id = i.product_id
    WHERE p.is_active = true AND (p.sku ILIKE $1 OR p.name ILIKE $1)
    ORDER BY p.sku
    LIMIT 10
  `, [`%${query}%`]);
  return result.rows;
}

export async function getProductNames() {
  await requireAuth();
  const result = await pool.query(`
    SELECT DISTINCT name as value FROM products 
    WHERE name IS NOT NULL AND name != ''
    ORDER BY name
  `);
  return result.rows.map(r => r.value);
}

export async function getProductDescriptions() {
  await requireAuth();
  const result = await pool.query(`
    SELECT DISTINCT description as value FROM products 
    WHERE description IS NOT NULL AND description != ''
    ORDER BY description
  `);
  return result.rows.map(r => r.value);
}


// export async function getStockInReport(filters?: {
//   startDate?: string;
//   endDate?: string;
//   productId?: number;
// }) {
//   await requireAuth();

//   let query = `
//     SELECT t.*, p.name as product_name, p.sku as product_sku, p.unit,
//            u.name as created_by_name
//     FROM stock_transactions t
//     JOIN products p ON t.product_id = p.id
//     LEFT JOIN users u ON t.created_by = u.id
//     WHERE t.type = 'in'
//   `;
//   const params: (string | number)[] = [];

//   if (filters?.startDate) {
//     query += ` AND t.created_at >= $${params.length + 1}`;
//     params.push(filters.startDate);
//   }
//   if (filters?.endDate) {
//     query += ` AND t.created_at <= $${params.length + 1}`;
//     params.push(filters.endDate + " 23:59:59");
//   }
//   if (filters?.productId) {
//     query += ` AND t.product_id = $${params.length + 1}`;
//     params.push(filters.productId);
//   }

//   query += " ORDER BY t.created_at DESC";

//   const result = await pool.query(query, params);
//   return result.rows;
// }



export async function getStockInReport(filters?: {
  startDate?: string;
  endDate?: string;
  productId?: number;
  documentNo?: string;
}) {
  await requireAuth();

  let query = `
    SELECT 
      t.id,
      t.product_id,
      t.type,
      t.quantity,
      t.previous_stock,
      t.new_stock,
      t.reason,
      t.reference,
      t.document_no,
      t.logbook_name,
      t.logbook_code,
      t.created_at,
      json_build_object(
        'id', p.id,
        'name', p.name,
        'sku', p.sku,
        'description', p.description,
        'unit', p.unit
      ) as product,
      u.name as created_by_name
    FROM stock_transactions t
    JOIN products p ON t.product_id = p.id
    LEFT JOIN users u ON t.created_by = u.id
    WHERE t.type = 'in'
  `;
  const params: (string | number)[] = [];

  if (filters?.startDate) {
    query += ` AND DATE(t.created_at) >= $${params.length + 1}`;
    params.push(filters.startDate);
  }
  if (filters?.endDate) {
    query += ` AND DATE(t.created_at) <= $${params.length + 1}`;
    params.push(filters.endDate);
  }
  if (filters?.productId) {
    query += ` AND t.product_id = $${params.length + 1}`;
    params.push(filters.productId);
  }
  if (filters?.documentNo) {
    query += ` AND p.description ILIKE $${params.length + 1}`;
    params.push(`%${filters.documentNo}%`);
  }

  query += " ORDER BY t.created_at DESC";

  const result = await pool.query(query, params);
  return result.rows;
}