-- Inventory items for portal + storefront (run as DB owner)
CREATE TABLE IF NOT EXISTS inventory_items (
  id BIGSERIAL PRIMARY KEY,
  sku VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(200) NOT NULL UNIQUE,
  product_name VARCHAR(255) NOT NULL,
  short_description TEXT NOT NULL,
  long_description TEXT NOT NULL,
  color VARCHAR(100) NOT NULL,
  size VARCHAR(200) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
  image_urls TEXT[] NOT NULL DEFAULT '{}',
  created_by_employee_id VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inventory_items_created_by
  ON inventory_items (created_by_employee_id);

-- If the table was created by another role (e.g. postgres), the app user must own it
-- for migrations, indexes, and runtime CREATE from the backend. Run as superuser or
-- current table owner; replace sri_porcelain_user if your DB user differs.
ALTER TABLE IF EXISTS inventory_items OWNER TO sri_porcelain_user;
ALTER SEQUENCE IF EXISTS inventory_items_id_seq OWNER TO sri_porcelain_user;
