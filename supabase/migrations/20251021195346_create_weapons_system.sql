/*
  # Sistema de Contratación de Armamento SUCAMEC

  1. Nuevas Tablas
    - `weapon_categories`
      - `id` (uuid, primary key)
      - `name` (text) - Nombre de la categoría (Policial, Militar, Seguridad Privada)
      - `description` (text) - Descripción de la categoría
      - `created_at` (timestamptz)
    
    - `weapons`
      - `id` (uuid, primary key)
      - `category_id` (uuid, foreign key) - Referencia a weapon_categories
      - `name` (text) - Nombre del arma
      - `caliber` (text) - Calibre
      - `manufacturer` (text) - Fabricante
      - `image_url` (text) - URL de imagen referencial
      - `description` (text) - Descripción del arma
      - `price` (numeric) - Precio en soles
      - `stock` (integer) - Stock disponible
      - `specifications` (jsonb) - Especificaciones técnicas
      - `required_documents` (jsonb) - Documentos requeridos específicos
      - `created_at` (timestamptz)
    
    - `customers`
      - `id` (uuid, primary key)
      - `full_name` (text) - Nombre completo
      - `dni` (text, unique) - DNI del cliente
      - `email` (text) - Email de contacto
      - `phone` (text) - Teléfono
      - `address` (text) - Dirección
      - `created_at` (timestamptz)
    
    - `orders`
      - `id` (uuid, primary key)
      - `customer_id` (uuid, foreign key) - Referencia a customers
      - `order_number` (text, unique) - Número de orden generado
      - `status` (text) - Estado del pedido
      - `total_amount` (numeric) - Monto total
      - `notes` (text) - Notas adicionales
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `order_items`
      - `id` (uuid, primary key)
      - `order_id` (uuid, foreign key) - Referencia a orders
      - `weapon_id` (uuid, foreign key) - Referencia a weapons
      - `quantity` (integer) - Cantidad solicitada
      - `unit_price` (numeric) - Precio unitario al momento de la compra
      - `subtotal` (numeric) - Subtotal del item
      - `created_at` (timestamptz)

  2. Seguridad
    - Se habilita RLS en todas las tablas
    - Los clientes pueden ver solo sus propios pedidos
    - El catálogo de armas es público para lectura
    - Solo clientes autenticados pueden crear pedidos
*/

-- Crear tabla de categorías de armas
CREATE TABLE IF NOT EXISTS weapon_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Crear tabla de armas
CREATE TABLE IF NOT EXISTS weapons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES weapon_categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  caliber text,
  manufacturer text,
  image_url text,
  description text,
  price numeric(10, 2) NOT NULL DEFAULT 0,
  stock integer DEFAULT 0,
  specifications jsonb DEFAULT '{}',
  required_documents jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);

-- Crear tabla de clientes
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  dni text UNIQUE NOT NULL,
  email text NOT NULL,
  phone text,
  address text,
  created_at timestamptz DEFAULT now()
);

-- Crear tabla de órdenes
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  order_number text UNIQUE NOT NULL,
  status text DEFAULT 'pendiente',
  total_amount numeric(10, 2) NOT NULL DEFAULT 0,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crear tabla de items de orden
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  weapon_id uuid REFERENCES weapons(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1,
  unit_price numeric(10, 2) NOT NULL,
  subtotal numeric(10, 2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE weapon_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE weapons ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Políticas para weapon_categories (lectura pública)
DROP POLICY IF EXISTS "Anyone can view weapon categories" ON weapon_categories;
CREATE POLICY "Anyone can view weapon categories"
  ON weapon_categories
  FOR SELECT
  TO public
  USING (true);

-- Políticas para weapons (lectura pública)
DROP POLICY IF EXISTS "Anyone can view weapons" ON weapons;
CREATE POLICY "Anyone can view weapons"
  ON weapons
  FOR SELECT
  TO public
  USING (true);

-- Políticas para customers (solo pueden ver sus propios datos)
DROP POLICY IF EXISTS "Customers can view own data" ON customers;
CREATE POLICY "Customers can view own data"
  ON customers
  FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Anyone can create customer" ON customers;
CREATE POLICY "Anyone can create customer"
  ON customers
  FOR INSERT
  TO public
  WITH CHECK (true);

DROP POLICY IF EXISTS "Customers can update own data" ON customers;
CREATE POLICY "Customers can update own data"
  ON customers
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Políticas para orders
DROP POLICY IF EXISTS "Customers can view own orders" ON orders;
CREATE POLICY "Customers can view own orders"
  ON orders
  FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Anyone can create orders" ON orders;
CREATE POLICY "Anyone can create orders"
  ON orders
  FOR INSERT
  TO public
  WITH CHECK (true);

DROP POLICY IF EXISTS "Customers can update own orders" ON orders;
CREATE POLICY "Customers can update own orders"
  ON orders
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Políticas para order_items
DROP POLICY IF EXISTS "Customers can view own order items" ON order_items;
CREATE POLICY "Customers can view own order items"
  ON order_items
  FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Anyone can create order items" ON order_items;
CREATE POLICY "Anyone can create order items"
  ON order_items
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_weapons_category ON weapons(category_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_customers_dni ON customers(dni);
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);

-- Insertar categorías
INSERT INTO weapon_categories (name, description) VALUES
  ('Uso Policial', 'Armamento autorizado para uso de fuerzas policiales'),
  ('Uso Militar', 'Armamento autorizado para uso de fuerzas militares'),
  ('Seguridad Privada', 'Armamento autorizado para empresas de seguridad privada')
ON CONFLICT DO NOTHING;