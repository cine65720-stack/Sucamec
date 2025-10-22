# Instrucciones para Inicializar la Base de Datos

## Paso 1: Acceder a Supabase

1. Ve a https://supabase.com y accede a tu proyecto
2. Tu proyecto ID es: `pbzoqfxbgcgrlddehscaq`
3. La URL de tu proyecto es: `https://pbzoqfxbgcgrlddehscaq.supabase.co`

## Paso 2: Abrir el Editor SQL

1. En el menú lateral izquierdo, haz clic en "SQL Editor"
2. Haz clic en "+ New query" para crear una nueva consulta

## Paso 3: Ejecutar el Script de Inicialización

1. Abre el archivo `init_database.sql` que se encuentra en la carpeta del proyecto
2. Copia **todo** el contenido del archivo
3. Pega el contenido en el editor SQL de Supabase
4. Haz clic en el botón "Run" (Ejecutar) en la esquina inferior derecha

⚠️ **IMPORTANTE**: El script puede tardar unos segundos en ejecutarse completamente. Espera a que termine.

## Paso 4: Verificar la Instalación

Ejecuta esta consulta para verificar que todo se instaló correctamente:

```sql
-- Verificar que las tablas fueron creadas
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Verificar que hay categorías
SELECT * FROM weapon_categories;

-- Verificar que hay armas
SELECT COUNT(*) as total_weapons FROM weapons;

-- Verificar que hay usuarios admin
SELECT username, role, full_name FROM admin_users;
```

Deberías ver:
- 8 tablas creadas (weapon_categories, weapons, customers, orders, order_items, admin_users, order_documents, order_validations)
- 3 categorías de armas
- 15 armas en el catálogo
- 2 usuarios administradores (admin y logistic)

## Paso 5: Verificar las Credenciales

Las credenciales ya están configuradas en los archivos `.env`:

**Archivo: `/project/project/.env`**
```
VITE_SUPABASE_URL=https://pbzoqfxbgcgrlddehscaq.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBiem9xZnhiZ2NncmxkZWhzY2FxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxMjQ5MjUsImV4cCI6MjA3NDcwMDkyNX0.m0Zv_3HkqXh5zxOPzpQ8FZ9EsF3TqBOjXaHh8hqLVxo
```

**Archivo: `/project/admin/.env`**
```
VITE_SUPABASE_URL=https://pbzoqfxbgcgrlddehscaq.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBiem9xZnhiZ2NncmxkZWhzY2FxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxMjQ5MjUsImV4cCI6MjA3NDcwMDkyNX0.m0Zv_3HkqXh5zxOPzpQ8FZ9EsF3TqBOjXaHh8hqLVxo
```

## Paso 6: Iniciar las Aplicaciones

Una vez que la base de datos esté inicializada:

### Aplicación de Cliente
```bash
cd project
npm install
npm run dev
```
Abre: http://localhost:5173

### Aplicación de Administración
```bash
cd admin
npm install
npm run dev
```
Abre: http://localhost:5174

## Credenciales de Login (Admin)

Para acceder a la aplicación de administración:

- **Administrador (valida documentos)**
  - Usuario: `admin`
  - Contraseña: `admin123`

- **Logístico (verifica stock)**
  - Usuario: `logistic`
  - Contraseña: `admin123`

## Solución de Problemas

### Error: "relation does not exist"
- Verifica que ejecutaste completamente el script `init_database.sql`
- Ve al SQL Editor en Supabase y ejecuta nuevamente el script

### Error de conexión
- Verifica que las credenciales en los archivos `.env` sean correctas
- Asegúrate de que tu proyecto de Supabase esté activo

### No se cargan las armas
- Ejecuta en SQL Editor:
  ```sql
  SELECT COUNT(*) FROM weapons;
  ```
- Si devuelve 0, ejecuta nuevamente la sección de INSERT del script

### Problemas con permisos
- Verifica que las políticas RLS estén activas
- Ejecuta:
  ```sql
  SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public';
  ```

## ¿Necesitas Ayuda?

Si después de seguir estos pasos aún tienes problemas:

1. Verifica los logs de consola del navegador (F12 > Console)
2. Verifica los logs de la aplicación en la terminal
3. Revisa la sección "Logs" en Supabase para ver errores del servidor

---

**Nota**: El script SQL es idempotente, lo que significa que puedes ejecutarlo múltiples veces sin problemas. Si algo sale mal, simplemente ejecuta el script nuevamente.
