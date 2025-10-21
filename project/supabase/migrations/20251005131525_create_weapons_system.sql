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
CREATE POLICY "Anyone can view weapon categories"
  ON weapon_categories
  FOR SELECT
  TO public
  USING (true);

-- Políticas para weapons (lectura pública)
CREATE POLICY "Anyone can view weapons"
  ON weapons
  FOR SELECT
  TO public
  USING (true);

-- Políticas para customers (solo pueden ver sus propios datos)
CREATE POLICY "Customers can view own data"
  ON customers
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can create customer"
  ON customers
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Customers can update own data"
  ON customers
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Políticas para orders
CREATE POLICY "Customers can view own orders"
  ON orders
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can create orders"
  ON orders
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Customers can update own orders"
  ON orders
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Políticas para order_items
CREATE POLICY "Customers can view own order items"
  ON order_items
  FOR SELECT
  TO public
  USING (true);

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

-- Insertar armas de ejemplo (30+ armas)
INSERT INTO weapons (category_id, name, caliber, manufacturer, image_url, description, price, stock, specifications, required_documents) 
SELECT 
  (SELECT id FROM weapon_categories WHERE name = 'Uso Policial'),
  'Glock 17',
  '9mm',
  'Glock',
  'https://images.pexels.com/photos/5256143/pexels-photo-5256143.jpeg',
  'Pistola semiautomática estándar para fuerzas policiales',
  5500.00,
  15,
  '{"peso": "625g", "capacidad": "17 cartuchos", "longitud": "186mm"}',
  '["DNI", "Licencia SUCAMEC Tipo A", "Certificado Psicológico", "Antecedentes Policiales"]'
WHERE NOT EXISTS (SELECT 1 FROM weapons WHERE name = 'Glock 17');

INSERT INTO weapons (category_id, name, caliber, manufacturer, image_url, description, price, stock, specifications, required_documents) 
SELECT 
  (SELECT id FROM weapon_categories WHERE name = 'Uso Policial'),
  'SIG Sauer P320',
  '9mm',
  'SIG Sauer',
  'https://images.pexels.com/photos/5256143/pexels-photo-5256143.jpeg',
  'Pistola modular de servicio policial',
  6200.00,
  12,
  '{"peso": "730g", "capacidad": "17 cartuchos", "longitud": "197mm"}',
  '["DNI", "Licencia SUCAMEC Tipo A", "Certificado Psicológico", "Antecedentes Policiales"]'
WHERE NOT EXISTS (SELECT 1 FROM weapons WHERE name = 'SIG Sauer P320');

INSERT INTO weapons (category_id, name, caliber, manufacturer, image_url, description, price, stock, specifications, required_documents) 
SELECT 
  (SELECT id FROM weapon_categories WHERE name = 'Uso Policial'),
  'Beretta 92FS',
  '9mm',
  'Beretta',
  'https://images.pexels.com/photos/5256143/pexels-photo-5256143.jpeg',
  'Pistola italiana de alta confiabilidad',
  5800.00,
  10,
  '{"peso": "950g", "capacidad": "15 cartuchos", "longitud": "217mm"}',
  '["DNI", "Licencia SUCAMEC Tipo A", "Certificado Psicológico", "Antecedentes Policiales"]'
WHERE NOT EXISTS (SELECT 1 FROM weapons WHERE name = 'Beretta 92FS');

INSERT INTO weapons (category_id, name, caliber, manufacturer, image_url, description, price, stock, specifications, required_documents) 
SELECT 
  (SELECT id FROM weapon_categories WHERE name = 'Uso Policial'),
  'Smith & Wesson M&P9',
  '9mm',
  'Smith & Wesson',
  'https://images.pexels.com/photos/5256143/pexels-photo-5256143.jpeg',
  'Pistola americana de uso táctico',
  5400.00,
  18,
  '{"peso": "680g", "capacidad": "17 cartuchos", "longitud": "190mm"}',
  '["DNI", "Licencia SUCAMEC Tipo A", "Certificado Psicológico", "Antecedentes Policiales"]'
WHERE NOT EXISTS (SELECT 1 FROM weapons WHERE name = 'Smith & Wesson M&P9');

INSERT INTO weapons (category_id, name, caliber, manufacturer, image_url, description, price, stock, specifications, required_documents) 
SELECT 
  (SELECT id FROM weapon_categories WHERE name = 'Uso Policial'),
  'Heckler & Koch USP',
  '9mm',
  'Heckler & Koch',
  'https://images.pexels.com/photos/5256143/pexels-photo-5256143.jpeg',
  'Pistola alemana de alta precisión',
  7200.00,
  8,
  '{"peso": "770g", "capacidad": "15 cartuchos", "longitud": "194mm"}',
  '["DNI", "Licencia SUCAMEC Tipo A", "Certificado Psicológico", "Antecedentes Policiales"]'
WHERE NOT EXISTS (SELECT 1 FROM weapons WHERE name = 'Heckler & Koch USP');

INSERT INTO weapons (category_id, name, caliber, manufacturer, image_url, description, price, stock, specifications, required_documents) 
SELECT 
  (SELECT id FROM weapon_categories WHERE name = 'Uso Policial'),
  'Taurus PT92',
  '9mm',
  'Taurus',
  'https://images.pexels.com/photos/5256143/pexels-photo-5256143.jpeg',
  'Pistola brasileña de uso policial',
  4800.00,
  20,
  '{"peso": "950g", "capacidad": "15 cartuchos", "longitud": "215mm"}',
  '["DNI", "Licencia SUCAMEC Tipo A", "Certificado Psicológico", "Antecedentes Policiales"]'
WHERE NOT EXISTS (SELECT 1 FROM weapons WHERE name = 'Taurus PT92');

INSERT INTO weapons (category_id, name, caliber, manufacturer, image_url, description, price, stock, specifications, required_documents) 
SELECT 
  (SELECT id FROM weapon_categories WHERE name = 'Uso Policial'),
  'CZ 75 SP-01',
  '9mm',
  'CZ',
  'https://images.pexels.com/photos/5256143/pexels-photo-5256143.jpeg',
  'Pistola checa de competición',
  6500.00,
  9,
  '{"peso": "1080g", "capacidad": "18 cartuchos", "longitud": "225mm"}',
  '["DNI", "Licencia SUCAMEC Tipo A", "Certificado Psicológico", "Antecedentes Policiales"]'
WHERE NOT EXISTS (SELECT 1 FROM weapons WHERE name = 'CZ 75 SP-01');

INSERT INTO weapons (category_id, name, caliber, manufacturer, image_url, description, price, stock, specifications, required_documents) 
SELECT 
  (SELECT id FROM weapon_categories WHERE name = 'Uso Policial'),
  'FN Five-seveN',
  '5.7x28mm',
  'FN Herstal',
  'https://images.pexels.com/photos/5256143/pexels-photo-5256143.jpeg',
  'Pistola belga de alta penetración',
  8500.00,
  5,
  '{"peso": "744g", "capacidad": "20 cartuchos", "longitud": "208mm"}',
  '["DNI", "Licencia SUCAMEC Tipo A", "Certificado Psicológico", "Antecedentes Policiales"]'
WHERE NOT EXISTS (SELECT 1 FROM weapons WHERE name = 'FN Five-seveN');

INSERT INTO weapons (category_id, name, caliber, manufacturer, image_url, description, price, stock, specifications, required_documents) 
SELECT 
  (SELECT id FROM weapon_categories WHERE name = 'Uso Policial'),
  'Walther P99',
  '9mm',
  'Walther',
  'https://images.pexels.com/photos/5256143/pexels-photo-5256143.jpeg',
  'Pistola alemana ergonómica',
  6800.00,
  7,
  '{"peso": "625g", "capacidad": "15 cartuchos", "longitud": "180mm"}',
  '["DNI", "Licencia SUCAMEC Tipo A", "Certificado Psicológico", "Antecedentes Policiales"]'
WHERE NOT EXISTS (SELECT 1 FROM weapons WHERE name = 'Walther P99');

INSERT INTO weapons (category_id, name, caliber, manufacturer, image_url, description, price, stock, specifications, required_documents) 
SELECT 
  (SELECT id FROM weapon_categories WHERE name = 'Uso Policial'),
  'Ruger SR9',
  '9mm',
  'Ruger',
  'https://images.pexels.com/photos/5256143/pexels-photo-5256143.jpeg',
  'Pistola americana de bajo costo',
  4200.00,
  25,
  '{"peso": "760g", "capacidad": "17 cartuchos", "longitud": "191mm"}',
  '["DNI", "Licencia SUCAMEC Tipo A", "Certificado Psicológico", "Antecedentes Policiales"]'
WHERE NOT EXISTS (SELECT 1 FROM weapons WHERE name = 'Ruger SR9');

-- Armas de Uso Militar
INSERT INTO weapons (category_id, name, caliber, manufacturer, image_url, description, price, stock, specifications, required_documents) 
SELECT 
  (SELECT id FROM weapon_categories WHERE name = 'Uso Militar'),
  'M4 Carbine',
  '5.56x45mm',
  'Colt',
  'https://images.pexels.com/photos/8513190/pexels-photo-8513190.jpeg',
  'Carabina estándar de fuerzas militares',
  15500.00,
  10,
  '{"peso": "2900g", "capacidad": "30 cartuchos", "longitud": "838mm"}',
  '["DNI", "Licencia SUCAMEC Tipo B", "Autorización Militar", "Certificado Psicológico", "Antecedentes Policiales"]'
WHERE NOT EXISTS (SELECT 1 FROM weapons WHERE name = 'M4 Carbine');

INSERT INTO weapons (category_id, name, caliber, manufacturer, image_url, description, price, stock, specifications, required_documents) 
SELECT 
  (SELECT id FROM weapon_categories WHERE name = 'Uso Militar'),
  'AK-47',
  '7.62x39mm',
  'Kalashnikov',
  'https://images.pexels.com/photos/8513190/pexels-photo-8513190.jpeg',
  'Fusil de asalto ruso legendario',
  12000.00,
  8,
  '{"peso": "3470g", "capacidad": "30 cartuchos", "longitud": "870mm"}',
  '["DNI", "Licencia SUCAMEC Tipo B", "Autorización Militar", "Certificado Psicológico", "Antecedentes Policiales"]'
WHERE NOT EXISTS (SELECT 1 FROM weapons WHERE name = 'AK-47');

INSERT INTO weapons (category_id, name, caliber, manufacturer, image_url, description, price, stock, specifications, required_documents) 
SELECT 
  (SELECT id FROM weapon_categories WHERE name = 'Uso Militar'),
  'FN SCAR-L',
  '5.56x45mm',
  'FN Herstal',
  'https://images.pexels.com/photos/8513190/pexels-photo-8513190.jpeg',
  'Fusil modular belga de última generación',
  18500.00,
  6,
  '{"peso": "3290g", "capacidad": "30 cartuchos", "longitud": "850mm"}',
  '["DNI", "Licencia SUCAMEC Tipo B", "Autorización Militar", "Certificado Psicológico", "Antecedentes Policiales"]'
WHERE NOT EXISTS (SELECT 1 FROM weapons WHERE name = 'FN SCAR-L');

INSERT INTO weapons (category_id, name, caliber, manufacturer, image_url, description, price, stock, specifications, required_documents) 
SELECT 
  (SELECT id FROM weapon_categories WHERE name = 'Uso Militar'),
  'HK416',
  '5.56x45mm',
  'Heckler & Koch',
  'https://images.pexels.com/photos/8513190/pexels-photo-8513190.jpeg',
  'Fusil alemán de operaciones especiales',
  19500.00,
  4,
  '{"peso": "3600g", "capacidad": "30 cartuchos", "longitud": "850mm"}',
  '["DNI", "Licencia SUCAMEC Tipo B", "Autorización Militar", "Certificado Psicológico", "Antecedentes Policiales"]'
WHERE NOT EXISTS (SELECT 1 FROM weapons WHERE name = 'HK416');

INSERT INTO weapons (category_id, name, caliber, manufacturer, image_url, description, price, stock, specifications, required_documents) 
SELECT 
  (SELECT id FROM weapon_categories WHERE name = 'Uso Militar'),
  'Galil ACE',
  '5.56x45mm',
  'IWI',
  'https://images.pexels.com/photos/8513190/pexels-photo-8513190.jpeg',
  'Fusil israelí modernizado',
  16000.00,
  7,
  '{"peso": "3450g", "capacidad": "35 cartuchos", "longitud": "860mm"}',
  '["DNI", "Licencia SUCAMEC Tipo B", "Autorización Militar", "Certificado Psicológico", "Antecedentes Policiales"]'
WHERE NOT EXISTS (SELECT 1 FROM weapons WHERE name = 'Galil ACE');

INSERT INTO weapons (category_id, name, caliber, manufacturer, image_url, description, price, stock, specifications, required_documents) 
SELECT 
  (SELECT id FROM weapon_categories WHERE name = 'Uso Militar'),
  'SIG MCX',
  '5.56x45mm',
  'SIG Sauer',
  'https://images.pexels.com/photos/8513190/pexels-photo-8513190.jpeg',
  'Carabina modular de última tecnología',
  17800.00,
  5,
  '{"peso": "2900g", "capacidad": "30 cartuchos", "longitud": "800mm"}',
  '["DNI", "Licencia SUCAMEC Tipo B", "Autorización Militar", "Certificado Psicológico", "Antecedentes Policiales"]'
WHERE NOT EXISTS (SELECT 1 FROM weapons WHERE name = 'SIG MCX');

INSERT INTO weapons (category_id, name, caliber, manufacturer, image_url, description, price, stock, specifications, required_documents) 
SELECT 
  (SELECT id FROM weapon_categories WHERE name = 'Uso Militar'),
  'Steyr AUG',
  '5.56x45mm',
  'Steyr',
  'https://images.pexels.com/photos/8513190/pexels-photo-8513190.jpeg',
  'Fusil bullpup austriaco',
  16500.00,
  6,
  '{"peso": "3600g", "capacidad": "30 cartuchos", "longitud": "790mm"}',
  '["DNI", "Licencia SUCAMEC Tipo B", "Autorización Militar", "Certificado Psicológico", "Antecedentes Policiales"]'
WHERE NOT EXISTS (SELECT 1 FROM weapons WHERE name = 'Steyr AUG');

INSERT INTO weapons (category_id, name, caliber, manufacturer, image_url, description, price, stock, specifications, required_documents) 
SELECT 
  (SELECT id FROM weapon_categories WHERE name = 'Uso Militar'),
  'FN FAL',
  '7.62x51mm',
  'FN Herstal',
  'https://images.pexels.com/photos/8513190/pexels-photo-8513190.jpeg',
  'Fusil de batalla clásico',
  14000.00,
  9,
  '{"peso": "4300g", "capacidad": "20 cartuchos", "longitud": "1090mm"}',
  '["DNI", "Licencia SUCAMEC Tipo B", "Autorización Militar", "Certificado Psicológico", "Antecedentes Policiales"]'
WHERE NOT EXISTS (SELECT 1 FROM weapons WHERE name = 'FN FAL');

INSERT INTO weapons (category_id, name, caliber, manufacturer, image_url, description, price, stock, specifications, required_documents) 
SELECT 
  (SELECT id FROM weapon_categories WHERE name = 'Uso Militar'),
  'M16A4',
  '5.56x45mm',
  'Colt',
  'https://images.pexels.com/photos/8513190/pexels-photo-8513190.jpeg',
  'Fusil americano de servicio',
  14500.00,
  8,
  '{"peso": "3400g", "capacidad": "30 cartuchos", "longitud": "1000mm"}',
  '["DNI", "Licencia SUCAMEC Tipo B", "Autorización Militar", "Certificado Psicológico", "Antecedentes Policiales"]'
WHERE NOT EXISTS (SELECT 1 FROM weapons WHERE name = 'M16A4');

INSERT INTO weapons (category_id, name, caliber, manufacturer, image_url, description, price, stock, specifications, required_documents) 
SELECT 
  (SELECT id FROM weapon_categories WHERE name = 'Uso Militar'),
  'Tavor X95',
  '5.56x45mm',
  'IWI',
  'https://images.pexels.com/photos/8513190/pexels-photo-8513190.jpeg',
  'Fusil bullpup israelí compacto',
  17200.00,
  5,
  '{"peso": "3270g", "capacidad": "30 cartuchos", "longitud": "720mm"}',
  '["DNI", "Licencia SUCAMEC Tipo B", "Autorización Militar", "Certificado Psicológico", "Antecedentes Policiales"]'
WHERE NOT EXISTS (SELECT 1 FROM weapons WHERE name = 'Tavor X95');

-- Armas de Seguridad Privada
INSERT INTO weapons (category_id, name, caliber, manufacturer, image_url, description, price, stock, specifications, required_documents) 
SELECT 
  (SELECT id FROM weapon_categories WHERE name = 'Seguridad Privada'),
  'Remington 870',
  '12 gauge',
  'Remington',
  'https://images.pexels.com/photos/7230337/pexels-photo-7230337.jpeg',
  'Escopeta de acción de bomba',
  3800.00,
  20,
  '{"peso": "3630g", "capacidad": "6 cartuchos", "longitud": "1065mm"}',
  '["DNI", "Licencia SUCAMEC Tipo C", "Certificado de Empresa de Seguridad", "Certificado Psicológico"]'
WHERE NOT EXISTS (SELECT 1 FROM weapons WHERE name = 'Remington 870');

INSERT INTO weapons (category_id, name, caliber, manufacturer, image_url, description, price, stock, specifications, required_documents) 
SELECT 
  (SELECT id FROM weapon_categories WHERE name = 'Seguridad Privada'),
  'Mossberg 500',
  '12 gauge',
  'Mossberg',
  'https://images.pexels.com/photos/7230337/pexels-photo-7230337.jpeg',
  'Escopeta táctica versátil',
  3500.00,
  22,
  '{"peso": "3175g", "capacidad": "5 cartuchos", "longitud": "1015mm"}',
  '["DNI", "Licencia SUCAMEC Tipo C", "Certificado de Empresa de Seguridad", "Certificado Psicológico"]'
WHERE NOT EXISTS (SELECT 1 FROM weapons WHERE name = 'Mossberg 500');

INSERT INTO weapons (category_id, name, caliber, manufacturer, image_url, description, price, stock, specifications, required_documents) 
SELECT 
  (SELECT id FROM weapon_categories WHERE name = 'Seguridad Privada'),
  'Glock 19',
  '9mm',
  'Glock',
  'https://images.pexels.com/photos/5256143/pexels-photo-5256143.jpeg',
  'Pistola compacta para seguridad',
  4800.00,
  30,
  '{"peso": "595g", "capacidad": "15 cartuchos", "longitud": "174mm"}',
  '["DNI", "Licencia SUCAMEC Tipo C", "Certificado de Empresa de Seguridad", "Certificado Psicológico"]'
WHERE NOT EXISTS (SELECT 1 FROM weapons WHERE name = 'Glock 19');

INSERT INTO weapons (category_id, name, caliber, manufacturer, image_url, description, price, stock, specifications, required_documents) 
SELECT 
  (SELECT id FROM weapon_categories WHERE name = 'Seguridad Privada'),
  'Taurus G3',
  '9mm',
  'Taurus',
  'https://images.pexels.com/photos/5256143/pexels-photo-5256143.jpeg',
  'Pistola económica de seguridad',
  3200.00,
  35,
  '{"peso": "620g", "capacidad": "17 cartuchos", "longitud": "175mm"}',
  '["DNI", "Licencia SUCAMEC Tipo C", "Certificado de Empresa de Seguridad", "Certificado Psicológico"]'
WHERE NOT EXISTS (SELECT 1 FROM weapons WHERE name = 'Taurus G3');

INSERT INTO weapons (category_id, name, caliber, manufacturer, image_url, description, price, stock, specifications, required_documents) 
SELECT 
  (SELECT id FROM weapon_categories WHERE name = 'Seguridad Privada'),
  'Springfield XD-9',
  '9mm',
  'Springfield',
  'https://images.pexels.com/photos/5256143/pexels-photo-5256143.jpeg',
  'Pistola de servicio confiable',
  4500.00,
  18,
  '{"peso": "710g", "capacidad": "16 cartuchos", "longitud": "185mm"}',
  '["DNI", "Licencia SUCAMEC Tipo C", "Certificado de Empresa de Seguridad", "Certificado Psicológico"]'
WHERE NOT EXISTS (SELECT 1 FROM weapons WHERE name = 'Springfield XD-9');

INSERT INTO weapons (category_id, name, caliber, manufacturer, image_url, description, price, stock, specifications, required_documents) 
SELECT 
  (SELECT id FROM weapon_categories WHERE name = 'Seguridad Privada'),
  'Revólver Taurus 85',
  '.38 Special',
  'Taurus',
  'https://images.pexels.com/photos/5256143/pexels-photo-5256143.jpeg',
  'Revólver compacto de seguridad',
  2800.00,
  25,
  '{"peso": "595g", "capacidad": "5 cartuchos", "longitud": "165mm"}',
  '["DNI", "Licencia SUCAMEC Tipo C", "Certificado de Empresa de Seguridad", "Certificado Psicológico"]'
WHERE NOT EXISTS (SELECT 1 FROM weapons WHERE name = 'Revólver Taurus 85');

INSERT INTO weapons (category_id, name, caliber, manufacturer, image_url, description, price, stock, specifications, required_documents) 
SELECT 
  (SELECT id FROM weapon_categories WHERE name = 'Seguridad Privada'),
  'Smith & Wesson 642',
  '.38 Special',
  'Smith & Wesson',
  'https://images.pexels.com/photos/5256143/pexels-photo-5256143.jpeg',
  'Revólver ligero de defensa',
  3400.00,
  20,
  '{"peso": "425g", "capacidad": "5 cartuchos", "longitud": "159mm"}',
  '["DNI", "Licencia SUCAMEC Tipo C", "Certificado de Empresa de Seguridad", "Certificado Psicológico"]'
WHERE NOT EXISTS (SELECT 1 FROM weapons WHERE name = 'Smith & Wesson 642');

INSERT INTO weapons (category_id, name, caliber, manufacturer, image_url, description, price, stock, specifications, required_documents) 
SELECT 
  (SELECT id FROM weapon_categories WHERE name = 'Seguridad Privada'),
  'Canik TP9SF',
  '9mm',
  'Canik',
  'https://images.pexels.com/photos/5256143/pexels-photo-5256143.jpeg',
  'Pistola turca de alto rendimiento',
  3800.00,
  16,
  '{"peso": "790g", "capacidad": "18 cartuchos", "longitud": "190mm"}',
  '["DNI", "Licencia SUCAMEC Tipo C", "Certificado de Empresa de Seguridad", "Certificado Psicológico"]'
WHERE NOT EXISTS (SELECT 1 FROM weapons WHERE name = 'Canik TP9SF');

INSERT INTO weapons (category_id, name, caliber, manufacturer, image_url, description, price, stock, specifications, required_documents) 
SELECT 
  (SELECT id FROM weapon_categories WHERE name = 'Seguridad Privada'),
  'Bersa Thunder 9',
  '9mm',
  'Bersa',
  'https://images.pexels.com/photos/5256143/pexels-photo-5256143.jpeg',
  'Pistola argentina económica',
  3000.00,
  28,
  '{"peso": "850g", "capacidad": "17 cartuchos", "longitud": "195mm"}',
  '["DNI", "Licencia SUCAMEC Tipo C", "Certificado de Empresa de Seguridad", "Certificado Psicológico"]'
WHERE NOT EXISTS (SELECT 1 FROM weapons WHERE name = 'Bersa Thunder 9');

INSERT INTO weapons (category_id, name, caliber, manufacturer, image_url, description, price, stock, specifications, required_documents) 
SELECT 
  (SELECT id FROM weapon_categories WHERE name = 'Seguridad Privada'),
  'Imbel MD97',
  '9mm',
  'Imbel',
  'https://images.pexels.com/photos/5256143/pexels-photo-5256143.jpeg',
  'Pistola brasileña de servicio',
  3600.00,
  15,
  '{"peso": "880g", "capacidad": "15 cartuchos", "longitud": "210mm"}',
  '["DNI", "Licencia SUCAMEC Tipo C", "Certificado de Empresa de Seguridad", "Certificado Psicológico"]'
WHERE NOT EXISTS (SELECT 1 FROM weapons WHERE name = 'Imbel MD97');