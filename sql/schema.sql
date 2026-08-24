-- ============================================
-- INVENTORY LOGBOOK SYSTEM - SCHEMA
-- ============================================

DROP TABLE IF EXISTS stock_issuances CASCADE;
DROP TABLE IF EXISTS stock_transactions CASCADE;
DROP TABLE IF EXISTS inventory CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. USERS
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('admin', 'manager', 'staff')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. CATEGORIES
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. PRODUCTS
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    sku VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    unit_price DECIMAL(12,2) DEFAULT 0,
    cost_price DECIMAL(12,2) DEFAULT 0,
    reorder_level INTEGER DEFAULT 10,
    unit VARCHAR(50) DEFAULT 'pcs',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. INVENTORY
CREATE TABLE inventory (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 0 NOT NULL,
    location VARCHAR(100) DEFAULT 'Main Warehouse',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, location)
);

-- 5. STOCK TRANSACTIONS - NEW: logbook fields added
CREATE TABLE stock_transactions (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    type VARCHAR(20) CHECK (type IN ('in', 'out', 'adjustment')) NOT NULL,
    quantity INTEGER NOT NULL,
    previous_stock INTEGER NOT NULL,
    new_stock INTEGER NOT NULL,
    reason TEXT,
    reference VARCHAR(255),
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    logbook_name VARCHAR(255),
    document_no VARCHAR(100),
    logbook_code VARCHAR(100)
);

-- 6. STOCK ISSUANCES (Stock Out)
CREATE TABLE stock_issuances (
    id SERIAL PRIMARY KEY,
    transaction_id INTEGER REFERENCES stock_transactions(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    quantity_out INTEGER NOT NULL,
    receiver_name VARCHAR(255) NOT NULL,
    receiver_department VARCHAR(255) NOT NULL,
    issue_purpose TEXT,
    issuer_name VARCHAR(255) NOT NULL,
    issuer_signature VARCHAR(255) NOT NULL,
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    logbook_name VARCHAR(255) NOT NULL,
    document_no VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_inventory_product ON inventory(product_id);
CREATE INDEX idx_transactions_product ON stock_transactions(product_id);
CREATE INDEX idx_transactions_type ON stock_transactions(type);
CREATE INDEX idx_transactions_date ON stock_transactions(created_at);
CREATE INDEX idx_issuances_date ON stock_issuances(issue_date);
CREATE INDEX idx_issuances_dept ON stock_issuances(receiver_department);
CREATE INDEX idx_issuances_doc ON stock_issuances(document_no);

-- ADMIN USER
INSERT INTO users (email, password_hash, name, role) VALUES
('saddam@logbook.com', '$2b$10$lLY0UWapAVarTwJLL3TeXuVUDLZIy2XecsiuZtoucJNz5TBUGLuuu', 'Saddam', 'admin');