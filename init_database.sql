-- =====================================================
-- SISTEMA SUCAMEC - INICIALIZACIÓN COMPLETA DE BASE DE DATOS
-- =====================================================

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
  documents_validated boolean DEFAULT false,
  stock_validated boolean DEFAULT false,
  documents_validator_id uuid,
  stock_validator_id uuid,
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

-- Crear tabla de usuarios administradores
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  role text NOT NULL CHECK (role IN ('administrator', 'logistic')),
  full_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Crear tabla de documentos de orden
CREATE TABLE IF NOT EXISTS order_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  document_type text NOT NULL,
  file_url text NOT NULL,
  file_name text NOT NULL,
  uploaded_at timestamptz DEFAULT now()
);

-- Crear tabla de validaciones de orden
CREATE TABLE IF NOT EXISTS order_validations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  admin_user_id uuid NOT NULL REFERENCES admin_users(id),
  validation_type text NOT NULL CHECK (validation_type IN ('documents', 'stock')),
  status text NOT NULL CHECK (status IN ('approved', 'rejected')),
  notes text,
  validated_at timestamptz DEFAULT now()
);

-- Agregar referencias de foreign keys a orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS documents_validator_id uuid REFERENCES admin_users(id);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS stock_validator_id uuid REFERENCES admin_users(id);

-- Habilitar RLS en todas las tablas
ALTER TABLE weapon_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE weapons ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_validations ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLÍTICAS RLS
-- =====================================================

-- Políticas para weapon_categories
DROP POLICY IF EXISTS "Anyone can view weapon categories" ON weapon_categories;
CREATE POLICY "Anyone can view weapon categories"
  ON weapon_categories FOR SELECT TO public USING (true);

-- Políticas para weapons
DROP POLICY IF EXISTS "Anyone can view weapons" ON weapons;
CREATE POLICY "Anyone can view weapons"
  ON weapons FOR SELECT TO public USING (true);

-- Políticas para customers
DROP POLICY IF EXISTS "Customers can view own data" ON customers;
CREATE POLICY "Customers can view own data"
  ON customers FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Anyone can create customer" ON customers;
CREATE POLICY "Anyone can create customer"
  ON customers FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "Customers can update own data" ON customers;
CREATE POLICY "Customers can update own data"
  ON customers FOR UPDATE TO public USING (true) WITH CHECK (true);

-- Políticas para orders
DROP POLICY IF EXISTS "Customers can view own orders" ON orders;
CREATE POLICY "Customers can view own orders"
  ON orders FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Anyone can create orders" ON orders;
CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "Customers can update own orders" ON orders;
CREATE POLICY "Customers can update own orders"
  ON orders FOR UPDATE TO public USING (true) WITH CHECK (true);

-- Políticas para order_items
DROP POLICY IF EXISTS "Customers can view own order items" ON order_items;
CREATE POLICY "Customers can view own order items"
  ON order_items FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Anyone can create order items" ON order_items;
CREATE POLICY "Anyone can create order items"
  ON order_items FOR INSERT TO public WITH CHECK (true);

-- Políticas para admin_users
DROP POLICY IF EXISTS "Admins can view all admin users" ON admin_users;
CREATE POLICY "Admins can view all admin users"
  ON admin_users FOR SELECT TO public USING (true);

-- Políticas para order_documents
DROP POLICY IF EXISTS "Anyone can view order documents" ON order_documents;
CREATE POLICY "Anyone can view order documents"
  ON order_documents FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Anyone can insert order documents" ON order_documents;
CREATE POLICY "Anyone can insert order documents"
  ON order_documents FOR INSERT TO public WITH CHECK (true);

-- Políticas para order_validations
DROP POLICY IF EXISTS "Anyone can view validations" ON order_validations;
CREATE POLICY "Anyone can view validations"
  ON order_validations FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Anyone can insert validations" ON order_validations;
CREATE POLICY "Anyone can insert validations"
  ON order_validations FOR INSERT TO public WITH CHECK (true);

-- =====================================================
-- ÍNDICES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_weapons_category ON weapons(category_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_customers_dni ON customers(dni);
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);
CREATE INDEX IF NOT EXISTS idx_order_documents_order ON order_documents(order_id);
CREATE INDEX IF NOT EXISTS idx_order_validations_order ON order_validations(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_documents_validated ON orders(documents_validated);
CREATE INDEX IF NOT EXISTS idx_orders_stock_validated ON orders(stock_validated);

-- =====================================================
-- DATOS INICIALES
-- =====================================================

-- Insertar categorías
INSERT INTO weapon_categories (name, description) VALUES
  ('Uso Policial', 'Armamento autorizado para uso de fuerzas policiales'),
  ('Uso Militar', 'Armamento autorizado para uso de fuerzas militares'),
  ('Seguridad Privada', 'Armamento autorizado para empresas de seguridad privada')
ON CONFLICT DO NOTHING;

-- Insertar usuarios administradores (password: admin123)
INSERT INTO admin_users (username, password_hash, role, full_name) VALUES
  ('admin', 'admin123', 'administrator', 'Administrador Principal'),
  ('logistic', 'admin123', 'logistic', 'Coordinador Logístico')
ON CONFLICT (username) DO NOTHING;

-- Insertar armas - Uso Policial
INSERT INTO weapons (category_id, name, caliber, manufacturer, image_url, description, price, stock, specifications, required_documents)
SELECT
  (SELECT id FROM weapon_categories WHERE name = 'Uso Policial'),
  'Glock 17', '9mm', 'Glock',
  'https://images.pexels.com/photos/5256143/pexels-photo-5256143.jpeg',
  'Pistola semiautomática estándar para fuerzas policiales',
  5500.00, 15,
  '{"peso": "625g", "capacidad": "17 cartuchos", "longitud": "186mm"}'::jsonb,
  '["DNI", "Licencia SUCAMEC Tipo A", "Certificado Psicológico", "Antecedentes Policiales"]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM weapons WHERE name = 'Glock 17');

INSERT INTO weapons (category_id, name, caliber, manufacturer, image_url, description, price, stock, specifications, required_documents)
SELECT
  (SELECT id FROM weapon_categories WHERE name = 'Uso Policial'),
  'SIG Sauer P320', '9mm', 'SIG Sauer',
  'https://images.pexels.com/photos/5256143/pexels-photo-5256143.jpeg',
  'Pistola modular de servicio policial',
  6200.00, 12,
  '{"peso": "730g", "capacidad": "17 cartuchos", "longitud": "197mm"}'::jsonb,
  '["DNI", "Licencia SUCAMEC Tipo A", "Certificado Psicológico", "Antecedentes Policiales"]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM weapons WHERE name = 'SIG Sauer P320');

INSERT INTO weapons (category_id, name, caliber, manufacturer, image_url, description, price, stock, specifications, required_documents)
SELECT
  (SELECT id FROM weapon_categories WHERE name = 'Uso Policial'),
  'Beretta 92FS', '9mm', 'Beretta',
  'https://images.pexels.com/photos/5256143/pexels-photo-5256143.jpeg',
  'Pistola italiana de alta confiabilidad',
  5800.00, 10,
  '{"peso": "950g", "capacidad": "15 cartuchos", "longitud": "217mm"}'::jsonb,
  '["DNI", "Licencia SUCAMEC Tipo A", "Certificado Psicológico", "Antecedentes Policiales"]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM weapons WHERE name = 'Beretta 92FS');

INSERT INTO weapons (category_id, name, caliber, manufacturer, image_url, description, price, stock, specifications, required_documents)
SELECT
  (SELECT id FROM weapon_categories WHERE name = 'Uso Policial'),
  'Smith & Wesson M&P9', '9mm', 'Smith & Wesson',
  'https://images.pexels.com/photos/5256143/pexels-photo-5256143.jpeg',
  'Pistola americana de uso táctico',
  5400.00, 18,
  '{"peso": "680g", "capacidad": "17 cartuchos", "longitud": "190mm"}'::jsonb,
  '["DNI", "Licencia SUCAMEC Tipo A", "Certificado Psicológico", "Antecedentes Policiales"]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM weapons WHERE name = 'Smith & Wesson M&P9');

INSERT INTO weapons (category_id, name, caliber, manufacturer, image_url, description, price, stock, specifications, required_documents)
SELECT
  (SELECT id FROM weapon_categories WHERE name = 'Uso Policial'),
  'Heckler & Koch USP', '9mm', 'Heckler & Koch',
  'https://images.pexels.com/photos/5256143/pexels-photo-5256143.jpeg',
  'Pistola alemana de alta precisión',
  7200.00, 8,
  '{"peso": "770g", "capacidad": "15 cartuchos", "longitud": "194mm"}'::jsonb,
  '["DNI", "Licencia SUCAMEC Tipo A", "Certificado Psicológico", "Antecedentes Policiales"]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM weapons WHERE name = 'Heckler & Koch USP');

-- Insertar armas - Uso Militar
INSERT INTO weapons (category_id, name, caliber, manufacturer, image_url, description, price, stock, specifications, required_documents)
SELECT
  (SELECT id FROM weapon_categories WHERE name = 'Uso Militar'),
  'M4 Carbine', '5.56x45mm', 'Colt',
  'https://images.pexels.com/photos/8513190/pexels-photo-8513190.jpeg',
  'Carabina estándar de fuerzas militares',
  15500.00, 10,
  '{"peso": "2900g", "capacidad": "30 cartuchos", "longitud": "838mm"}'::jsonb,
  '["DNI", "Licencia SUCAMEC Tipo B", "Autorización Militar", "Certificado Psicológico", "Antecedentes Policiales"]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM weapons WHERE name = 'M4 Carbine');

INSERT INTO weapons (category_id, name, caliber, manufacturer, image_url, description, price, stock, specifications, required_documents)
SELECT
  (SELECT id FROM weapon_categories WHERE name = 'Uso Militar'),
  'AK-47', '7.62x39mm', 'Kalashnikov',
  'https://images.pexels.com/photos/8513190/pexels-photo-8513190.jpeg',
  'Fusil de asalto ruso legendario',
  12000.00, 8,
  '{"peso": "3470g", "capacidad": "30 cartuchos", "longitud": "870mm"}'::jsonb,
  '["DNI", "Licencia SUCAMEC Tipo B", "Autorización Militar", "Certificado Psicológico", "Antecedentes Policiales"]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM weapons WHERE name = 'AK-47');

INSERT INTO weapons (category_id, name, caliber, manufacturer, image_url, description, price, stock, specifications, required_documents)
SELECT
  (SELECT id FROM weapon_categories WHERE name = 'Uso Militar'),
  'FN SCAR-L', '5.56x45mm', 'FN Herstal',
  'https://images.pexels.com/photos/8513190/pexels-photo-8513190.jpeg',
  'Fusil modular belga de última generación',
  18500.00, 6,
  '{"peso": "3290g", "capacidad": "30 cartuchos", "longitud": "850mm"}'::jsonb,
  '["DNI", "Licencia SUCAMEC Tipo B", "Autorización Militar", "Certificado Psicológico", "Antecedentes Policiales"]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM weapons WHERE name = 'FN SCAR-L');

INSERT INTO weapons (category_id, name, caliber, manufacturer, image_url, description, price, stock, specifications, required_documents)
SELECT
  (SELECT id FROM weapon_categories WHERE name = 'Uso Militar'),
  'HK416', '5.56x45mm', 'Heckler & Koch',
  'https://images.pexels.com/photos/8513190/pexels-photo-8513190.jpeg',
  'Fusil alemán de operaciones especiales',
  19500.00, 4,
  '{"peso": "3600g", "capacidad": "30 cartuchos", "longitud": "850mm"}'::jsonb,
  '["DNI", "Licencia SUCAMEC Tipo B", "Autorización Militar", "Certificado Psicológico", "Antecedentes Policiales"]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM weapons WHERE name = 'HK416');

INSERT INTO weapons (category_id, name, caliber, manufacturer, image_url, description, price, stock, specifications, required_documents)
SELECT
  (SELECT id FROM weapon_categories WHERE name = 'Uso Militar'),
  'Galil ACE', '5.56x45mm', 'IWI',
  'https://images.pexels.com/photos/8513190/pexels-photo-8513190.jpeg',
  'Fusil israelí modernizado',
  16000.00, 7,
  '{"peso": "3450g", "capacidad": "35 cartuchos", "longitud": "860mm"}'::jsonb,
  '["DNI", "Licencia SUCAMEC Tipo B", "Autorización Militar", "Certificado Psicológico", "Antecedentes Policiales"]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM weapons WHERE name = 'Galil ACE');

-- Insertar armas - Seguridad Privada
INSERT INTO weapons (category_id, name, caliber, manufacturer, image_url, description, price, stock, specifications, required_documents)
SELECT
  (SELECT id FROM weapon_categories WHERE name = 'Seguridad Privada'),
  'Remington 870', '12 gauge', 'Remington',
  'https://images.pexels.com/photos/7230337/pexels-photo-7230337.jpeg',
  'Escopeta de acción de bomba',
  3800.00, 20,
  '{"peso": "3630g", "capacidad": "6 cartuchos", "longitud": "1065mm"}'::jsonb,
  '["DNI", "Licencia SUCAMEC Tipo C", "Certificado de Empresa de Seguridad", "Certificado Psicológico"]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM weapons WHERE name = 'Remington 870');

INSERT INTO weapons (category_id, name, caliber, manufacturer, image_url, description, price, stock, specifications, required_documents)
SELECT
  (SELECT id FROM weapon_categories WHERE name = 'Seguridad Privada'),
  'Mossberg 500', '12 gauge', 'Mossberg',
  'https://images.pexels.com/photos/7230337/pexels-photo-7230337.jpeg',
  'Escopeta táctica versátil',
  3500.00, 22,
  '{"peso": "3175g", "capacidad": "5 cartuchos", "longitud": "1015mm"}'::jsonb,
  '["DNI", "Licencia SUCAMEC Tipo C", "Certificado de Empresa de Seguridad", "Certificado Psicológico"]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM weapons WHERE name = 'Mossberg 500');

INSERT INTO weapons (category_id, name, caliber, manufacturer, image_url, description, price, stock, specifications, required_documents)
SELECT
  (SELECT id FROM weapon_categories WHERE name = 'Seguridad Privada'),
  'Glock 19', '9mm', 'Glock',
  'https://images.pexels.com/photos/5256143/pexels-photo-5256143.jpeg',
  'Pistola compacta para seguridad',
  4800.00, 30,
  '{"peso": "595g", "capacidad": "15 cartuchos", "longitud": "174mm"}'::jsonb,
  '["DNI", "Licencia SUCAMEC Tipo C", "Certificado de Empresa de Seguridad", "Certificado Psicológico"]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM weapons WHERE name = 'Glock 19');

INSERT INTO weapons (category_id, name, caliber, manufacturer, image_url, description, price, stock, specifications, required_documents)
SELECT
  (SELECT id FROM weapon_categories WHERE name = 'Seguridad Privada'),
  'Taurus G3', '9mm', 'Taurus',
  'https://images.pexels.com/photos/5256143/pexels-photo-5256143.jpeg',
  'Pistola económica de seguridad',
  3200.00, 35,
  '{"peso": "620g", "capacidad": "17 cartuchos", "longitud": "175mm"}'::jsonb,
  '["DNI", "Licencia SUCAMEC Tipo C", "Certificado de Empresa de Seguridad", "Certificado Psicológico"]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM weapons WHERE name = 'Taurus G3');

INSERT INTO weapons (category_id, name, caliber, manufacturer, image_url, description, price, stock, specifications, required_documents)
SELECT
  (SELECT id FROM weapon_categories WHERE name = 'Seguridad Privada'),
  'Springfield XD-9', '9mm', 'Springfield',
  'https://images.pexels.com/photos/5256143/pexels-photo-5256143.jpeg',
  'Pistola de servicio confiable',
  4500.00, 18,
  '{"peso": "710g", "capacidad": "16 cartuchos", "longitud": "185mm"}'::jsonb,
  '["DNI", "Licencia SUCAMEC Tipo C", "Certificado de Empresa de Seguridad", "Certificado Psicológico"]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM weapons WHERE name = 'Springfield XD-9');
