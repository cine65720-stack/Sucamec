/*
  # Add Document Management System

  1. Changes to Existing Tables
    - Add `required_documents` column to `weapons` table
      - JSONB array containing required document types for each weapon
      
  2. New Tables
    - `order_documents`
      - `id` (uuid, primary key)
      - `order_id` (uuid, foreign key to orders)
      - `document_type` (text) - Type of document (e.g., "DNI", "Licencia de Armas", etc.)
      - `file_url` (text) - URL or reference to uploaded document
      - `file_name` (text) - Original file name
      - `uploaded_at` (timestamptz)
      
  3. Security
    - Enable RLS on `order_documents` table
    - Add policies for authenticated users to manage their documents
    
  4. Important Notes
    - Each weapon can specify which documents are required
    - System will collect unique documents across all weapons in cart
    - Documents are stored per order
    - Uses weapon type/name patterns to assign documents
*/

-- Add required_documents column to weapons table if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'weapons' AND column_name = 'required_documents'
  ) THEN
    ALTER TABLE weapons ADD COLUMN required_documents JSONB DEFAULT '[]'::jsonb;
  END IF;
END $$;

-- Create order_documents table
CREATE TABLE IF NOT EXISTS order_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  document_type text NOT NULL,
  file_url text NOT NULL,
  file_name text NOT NULL,
  uploaded_at timestamptz DEFAULT now()
);

-- Enable RLS on order_documents
ALTER TABLE order_documents ENABLE ROW LEVEL SECURITY;

-- Policies for order_documents
DROP POLICY IF EXISTS "Users can view documents for their orders" ON order_documents;
CREATE POLICY "Users can view documents for their orders"
  ON order_documents
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      JOIN customers ON orders.customer_id = customers.id
      WHERE orders.id = order_documents.order_id
    )
  );

DROP POLICY IF EXISTS "Users can insert documents for their orders" ON order_documents;
CREATE POLICY "Users can insert documents for their orders"
  ON order_documents
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      JOIN customers ON orders.customer_id = customers.id
      WHERE orders.id = order_documents.order_id
    )
  );

-- Update weapons with required documents based on weapon types
-- Pistolas (Glock, SIG, Beretta, etc.)
UPDATE weapons SET required_documents = '["DNI", "Certificado de Antecedentes Penales", "Certificado de Salud Mental", "Licencia de Uso de Armas"]'::jsonb
WHERE LOWER(name) LIKE '%glock%' 
   OR LOWER(name) LIKE '%sig%'
   OR LOWER(name) LIKE '%beretta%'
   OR LOWER(name) LIKE '%smith & wesson%'
   OR LOWER(name) LIKE '%h&k%'
   OR LOWER(name) LIKE '%cz 75%'
   OR LOWER(name) LIKE '%fn five%'
   OR LOWER(name) LIKE '%walther%'
   OR LOWER(name) LIKE '%ruger sr%'
   OR LOWER(name) LIKE '%springfield%'
   OR LOWER(name) LIKE '%canik%'
   OR LOWER(name) LIKE '%bersa%'
   OR LOWER(name) LIKE '%imbel%'
   OR LOWER(name) LIKE '%taurus pt%'
   OR LOWER(name) LIKE '%taurus g%'
   OR LOWER(name) LIKE '%fn 509%';

-- Revólveres
UPDATE weapons SET required_documents = '["DNI", "Certificado de Antecedentes Penales", "Certificado de Salud Mental", "Licencia de Uso de Armas", "Certificado de Capacitación"]'::jsonb
WHERE LOWER(name) LIKE '%revólver%'
   OR LOWER(name) LIKE '%ruger lcr%';

-- Rifles (AR, AK, etc.)
UPDATE weapons SET required_documents = '["DNI", "Certificado de Antecedentes Penales", "Certificado de Salud Mental", "Licencia de Uso de Armas", "Certificado de Entrenamiento Militar", "Autorización Especial SUCAMEC"]'::jsonb
WHERE LOWER(name) LIKE '%m4%'
   OR LOWER(name) LIKE '%ar-15%'
   OR LOWER(name) LIKE '%m16%'
   OR LOWER(name) LIKE '%ak-%'
   OR LOWER(name) LIKE '%scar%'
   OR LOWER(name) LIKE '%hk416%'
   OR LOWER(name) LIKE '%g36%'
   OR LOWER(name) LIKE '%galil%'
   OR LOWER(name) LIKE '%mcx%'
   OR LOWER(name) LIKE '%steyr%'
   OR LOWER(name) LIKE '%tavor%'
   OR LOWER(name) LIKE '%fal%';

-- Escopetas
UPDATE weapons SET required_documents = '["DNI", "Certificado de Antecedentes Penales", "Certificado de Salud Mental", "Licencia de Uso de Armas"]'::jsonb
WHERE LOWER(name) LIKE '%remington%'
   OR LOWER(name) LIKE '%mossberg%'
   OR LOWER(name) LIKE '%benelli%';

-- Subametralladoras
UPDATE weapons SET required_documents = '["DNI", "Certificado de Antecedentes Penales", "Certificado de Salud Mental", "Licencia de Uso de Armas", "Certificado de Entrenamiento Militar", "Autorización Especial SUCAMEC"]'::jsonb
WHERE LOWER(name) LIKE '%mp5%'
   OR LOWER(name) LIKE '%uzi%'
   OR LOWER(name) LIKE '%mp7%';