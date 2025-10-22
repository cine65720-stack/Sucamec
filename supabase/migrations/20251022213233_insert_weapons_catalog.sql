/*
  # Insert Weapons Catalog Data

  1. Purpose
    - Insert complete catalog of weapons across all categories
    - Includes pricing, stock levels, and required documents
    
  2. Categories
    - Uso Policial (10 weapons)
    - Uso Militar (10 weapons)  
    - Seguridad Privada (10 weapons)
    
  3. Notes
    - All weapons include required documents configuration
    - Stock levels are set for testing purposes
    - Prices are in Peruvian Soles (S/)
*/

-- Insert weapons for Police Use
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
  '{"peso": "625g", "capacidad": "17 cartuchos", "longitud": "186mm"}'::jsonb,
  '["DNI", "Licencia SUCAMEC Tipo A", "Certificado Psicológico", "Antecedentes Policiales"]'::jsonb
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
  '{"peso": "730g", "capacidad": "17 cartuchos", "longitud": "197mm"}'::jsonb,
  '["DNI", "Licencia SUCAMEC Tipo A", "Certificado Psicológico", "Antecedentes Policiales"]'::jsonb
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
  '{"peso": "950g", "capacidad": "15 cartuchos", "longitud": "217mm"}'::jsonb,
  '["DNI", "Licencia SUCAMEC Tipo A", "Certificado Psicológico", "Antecedentes Policiales"]'::jsonb
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
  '{"peso": "680g", "capacidad": "17 cartuchos", "longitud": "190mm"}'::jsonb,
  '["DNI", "Licencia SUCAMEC Tipo A", "Certificado Psicológico", "Antecedentes Policiales"]'::jsonb
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
  '{"peso": "770g", "capacidad": "15 cartuchos", "longitud": "194mm"}'::jsonb,
  '["DNI", "Licencia SUCAMEC Tipo A", "Certificado Psicológico", "Antecedentes Policiales"]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM weapons WHERE name = 'Heckler & Koch USP');

-- Insert weapons for Military Use
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
  '{"peso": "2900g", "capacidad": "30 cartuchos", "longitud": "838mm"}'::jsonb,
  '["DNI", "Licencia SUCAMEC Tipo B", "Autorización Militar", "Certificado Psicológico", "Antecedentes Policiales"]'::jsonb
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
  '{"peso": "3470g", "capacidad": "30 cartuchos", "longitud": "870mm"}'::jsonb,
  '["DNI", "Licencia SUCAMEC Tipo B", "Autorización Militar", "Certificado Psicológico", "Antecedentes Policiales"]'::jsonb
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
  '{"peso": "3290g", "capacidad": "30 cartuchos", "longitud": "850mm"}'::jsonb,
  '["DNI", "Licencia SUCAMEC Tipo B", "Autorización Militar", "Certificado Psicológico", "Antecedentes Policiales"]'::jsonb
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
  '{"peso": "3600g", "capacidad": "30 cartuchos", "longitud": "850mm"}'::jsonb,
  '["DNI", "Licencia SUCAMEC Tipo B", "Autorización Militar", "Certificado Psicológico", "Antecedentes Policiales"]'::jsonb
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
  '{"peso": "3450g", "capacidad": "35 cartuchos", "longitud": "860mm"}'::jsonb,
  '["DNI", "Licencia SUCAMEC Tipo B", "Autorización Militar", "Certificado Psicológico", "Antecedentes Policiales"]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM weapons WHERE name = 'Galil ACE');

-- Insert weapons for Private Security
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
  '{"peso": "3630g", "capacidad": "6 cartuchos", "longitud": "1065mm"}'::jsonb,
  '["DNI", "Licencia SUCAMEC Tipo C", "Certificado de Empresa de Seguridad", "Certificado Psicológico"]'::jsonb
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
  '{"peso": "3175g", "capacidad": "5 cartuchos", "longitud": "1015mm"}'::jsonb,
  '["DNI", "Licencia SUCAMEC Tipo C", "Certificado de Empresa de Seguridad", "Certificado Psicológico"]'::jsonb
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
  '{"peso": "595g", "capacidad": "15 cartuchos", "longitud": "174mm"}'::jsonb,
  '["DNI", "Licencia SUCAMEC Tipo C", "Certificado de Empresa de Seguridad", "Certificado Psicológico"]'::jsonb
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
  '{"peso": "620g", "capacidad": "17 cartuchos", "longitud": "175mm"}'::jsonb,
  '["DNI", "Licencia SUCAMEC Tipo C", "Certificado de Empresa de Seguridad", "Certificado Psicológico"]'::jsonb
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
  '{"peso": "710g", "capacidad": "16 cartuchos", "longitud": "185mm"}'::jsonb,
  '["DNI", "Licencia SUCAMEC Tipo C", "Certificado de Empresa de Seguridad", "Certificado Psicológico"]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM weapons WHERE name = 'Springfield XD-9');