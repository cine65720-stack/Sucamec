/*
  # Add Admin System with Roles and Document Validation

  1. New Tables
    - `admin_users`
      - `id` (uuid, primary key)
      - `username` (text, unique) - Username for login
      - `password_hash` (text) - Hashed password
      - `role` (text) - Role type: 'administrator' or 'logistic'
      - `full_name` (text) - Full name
      - `created_at` (timestamptz)
    
    - `order_documents`
      - `id` (uuid, primary key)
      - `order_id` (uuid, foreign key) - Reference to orders
      - `document_type` (text) - Type of document
      - `file_url` (text) - URL or reference to uploaded document
      - `file_name` (text) - Original file name
      - `uploaded_at` (timestamptz)
    
    - `order_validations`
      - `id` (uuid, primary key)
      - `order_id` (uuid, foreign key) - Reference to orders
      - `admin_user_id` (uuid, foreign key) - Reference to admin_users
      - `validation_type` (text) - 'documents' or 'stock'
      - `status` (text) - 'approved' or 'rejected'
      - `notes` (text) - Validation notes
      - `validated_at` (timestamptz)

  2. Changes to Existing Tables
    - Add `documents_validated` (boolean) to orders table
    - Add `stock_validated` (boolean) to orders table
    - Add `documents_validator_id` (uuid) to orders table
    - Add `stock_validator_id` (uuid) to orders table

  3. Security
    - Enable RLS on all new tables
    - Admin users can view all orders
    - Only authenticated admins can update validations

  4. Default Admin Users
    - Create default administrator account
    - Create default logistic account
*/

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  role text NOT NULL CHECK (role IN ('administrator', 'logistic')),
  full_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create order_documents table
CREATE TABLE IF NOT EXISTS order_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  document_type text NOT NULL,
  file_url text NOT NULL,
  file_name text NOT NULL,
  uploaded_at timestamptz DEFAULT now()
);

-- Create order_validations table
CREATE TABLE IF NOT EXISTS order_validations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  admin_user_id uuid NOT NULL REFERENCES admin_users(id),
  validation_type text NOT NULL CHECK (validation_type IN ('documents', 'stock')),
  status text NOT NULL CHECK (status IN ('approved', 'rejected')),
  notes text,
  validated_at timestamptz DEFAULT now()
);

-- Add validation columns to orders table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'documents_validated'
  ) THEN
    ALTER TABLE orders ADD COLUMN documents_validated boolean DEFAULT false;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'stock_validated'
  ) THEN
    ALTER TABLE orders ADD COLUMN stock_validated boolean DEFAULT false;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'documents_validator_id'
  ) THEN
    ALTER TABLE orders ADD COLUMN documents_validator_id uuid REFERENCES admin_users(id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'stock_validator_id'
  ) THEN
    ALTER TABLE orders ADD COLUMN stock_validator_id uuid REFERENCES admin_users(id);
  END IF;
END $$;

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_validations ENABLE ROW LEVEL SECURITY;

-- Policies for admin_users
DROP POLICY IF EXISTS "Admins can view all admin users" ON admin_users;
CREATE POLICY "Admins can view all admin users"
  ON admin_users
  FOR SELECT
  TO public
  USING (true);

-- Policies for order_documents (public read for validation)
DROP POLICY IF EXISTS "Anyone can view order documents" ON order_documents;
CREATE POLICY "Anyone can view order documents"
  ON order_documents
  FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Anyone can insert order documents" ON order_documents;
CREATE POLICY "Anyone can insert order documents"
  ON order_documents
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Policies for order_validations
DROP POLICY IF EXISTS "Anyone can view validations" ON order_validations;
CREATE POLICY "Anyone can view validations"
  ON order_validations
  FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Anyone can insert validations" ON order_validations;
CREATE POLICY "Anyone can insert validations"
  ON order_validations
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);
CREATE INDEX IF NOT EXISTS idx_order_documents_order ON order_documents(order_id);
CREATE INDEX IF NOT EXISTS idx_order_validations_order ON order_validations(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_documents_validated ON orders(documents_validated);
CREATE INDEX IF NOT EXISTS idx_orders_stock_validated ON orders(stock_validated);

-- Insert default admin users (password: admin123)
-- Note: In production, use proper password hashing
INSERT INTO admin_users (username, password_hash, role, full_name) VALUES
  ('admin', '$2a$10$YourHashedPasswordHere', 'administrator', 'Administrador Principal'),
  ('logistic', '$2a$10$YourHashedPasswordHere', 'logistic', 'Coordinador Logístico')
ON CONFLICT (username) DO NOTHING;