
export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  description: string | null;
}

export interface Product {
  id: number;
  sku: string;
  name: string;
  description: string | null;
  category_id: number | null;
  category_name?: string;
  unit_price: number;
  cost_price: number;
  reorder_level: number;
  unit: string;
  is_active: boolean;
  created_at: string;
}

export interface StockIssuance {
  id: number;
  transaction_id: number;
  product_id: number;
  product_name?: string;
  product_sku?: string;
  quantity_out: number;
  receiver_name: string;
  receiver_department: string;
  issue_purpose: string | null;
  issuer_name: string;
  issuer_signature: string;
  issue_date: string;
  logbook_name: string;
  document_no: string;
  created_at: string;
}

export interface DashboardStats {
  total_products: number;
  total_stock_value: number;
  low_stock_count: number;
  total_issuances: number;
  stock_in_month: number;
  stock_out_month: number;
}