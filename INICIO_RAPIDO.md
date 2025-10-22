# 🚀 INICIO RÁPIDO - Sistema SUCAMEC

## ⚠️ PASO CRÍTICO: Inicializar Base de Datos

**ANTES DE INICIAR LAS APLICACIONES**, debes ejecutar el script SQL en Supabase:

### 1. Inicializar la Base de Datos (OBLIGATORIO)

1. Ve a https://supabase.com/dashboard/project/pbzoqfxbgcgrlddehscaq
2. Click en "SQL Editor" en el menú lateral
3. Click en "+ New query"
4. Copia TODO el contenido del archivo `init_database.sql`
5. Pega en el editor y click en "Run"
6. Espera a que termine (puede tardar 10-20 segundos)

**Verificación**: Ejecuta esto para confirmar que funcionó:
```sql
SELECT COUNT(*) as total FROM weapons;
```
Debe devolver: **15**

---

## 📦 Instalación y Ejecución

### Aplicación de Cliente

```bash
# Ir a la carpeta
cd project

# Instalar dependencias (primera vez)
npm install

# Iniciar aplicación
npm run dev
```

**URL**: http://localhost:5173

---

### Aplicación de Administración

```bash
# Ir a la carpeta
cd admin

# Instalar dependencias (primera vez)
npm install

# Iniciar aplicación
npm run dev
```

**URL**: http://localhost:5174

**Credenciales**:
- Admin: `admin` / `admin123` (valida documentos)
- Logístico: `logistic` / `admin123` (verifica stock)

---

## ✅ Verificación Rápida

### 1. Verificar Base de Datos
En Supabase SQL Editor:
```sql
-- Debe mostrar 8 tablas
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public';

-- Debe mostrar 15 armas
SELECT COUNT(*) FROM weapons;

-- Debe mostrar 2 usuarios
SELECT * FROM admin_users;
```

### 2. Verificar Aplicación de Cliente
1. Abre http://localhost:5173
2. Debes ver el catálogo con 15 armas
3. Intenta agregar una al carrito
4. Verifica que el carrito funcione

### 3. Verificar Aplicación Admin
1. Abre http://localhost:5174
2. Inicia sesión con `admin` / `admin123`
3. Debes ver el dashboard (aunque esté vacío)

---

## 🔧 Solución de Problemas Comunes

### "No se cargan las armas"
➡️ **Causa**: No ejecutaste el script SQL
➡️ **Solución**: Ve a la sección "Inicializar Base de Datos" arriba

### "Error de conexión a Supabase"
➡️ **Causa**: Credenciales incorrectas o proyecto inactivo
➡️ **Solución**:
1. Verifica que tu proyecto Supabase esté activo
2. Revisa los archivos `.env` en `project/` y `admin/`

### "npm: command not found"
➡️ **Causa**: Node.js no está instalado
➡️ **Solución**: Instala Node.js 18+ desde https://nodejs.org

### "El puerto 5173 ya está en uso"
➡️ **Solución**:
```bash
# Matar proceso en el puerto
npx kill-port 5173
# O usar otro puerto
npm run dev -- --port 5174
```

---

## 📝 Flujo de Prueba Completo

### 1. Crear una Solicitud (Cliente)
1. Ve a http://localhost:5173
2. Navega el catálogo de armas
3. Agrega 2-3 armas al carrito
4. Click en el carrito (icono superior derecho)
5. Click en "Proceder al Checkout"
6. Llena el formulario:
   - Nombre: "Juan Pérez"
   - DNI: "12345678"
   - Email: "juan@example.com"
   - Teléfono: "987654321"
   - Dirección: "Av. Principal 123"
7. Carga los documentos requeridos (cualquier PDF/imagen)
8. Click en "Registrar Pedido"
9. **Guarda el número de orden que aparece**

### 2. Validar Documentos (Admin)
1. Ve a http://localhost:5174
2. Login con `admin` / `admin123`
3. Verás la solicitud en la lista
4. Click en la solicitud
5. Ve a la pestaña "Documentos"
6. Verifica que los documentos estén cargados
7. Click en "Aprobar"
8. Cierra el modal

### 3. Verificar Stock (Logístico)
1. Cierra sesión del admin
2. Login con `logistic` / `admin123`
3. Verás la misma solicitud
4. Click en la solicitud
5. Ve a la pestaña "Verificación de Stock"
6. Verifica que hay stock suficiente
7. Click en "Aprobar"
8. Cierra el modal

### 4. Verificar Estado Final (Cliente)
1. Ve a http://localhost:5173
2. Scroll hasta "Mis Pedidos"
3. Busca por tu DNI: "12345678"
4. Debes ver tu orden con estado "aprobado" ✅

---

## 📂 Estructura de Archivos Importantes

```
project/
├── init_database.sql          ⭐ Script SQL para inicializar DB
├── INSTRUCCIONES_DB.md        📖 Guía detallada de base de datos
├── GUIA_COMPLETA.md          📖 Documentación completa del sistema
├── INICIO_RAPIDO.md          📖 Esta guía
├── .env                       🔐 Credenciales principales
├── project/                   🌐 Aplicación de Cliente
│   ├── .env                  🔐 Credenciales del cliente
│   ├── src/
│   └── package.json
└── admin/                     👤 Aplicación de Administración
    ├── .env                  🔐 Credenciales del admin
    ├── src/
    └── package.json
```

---

## 🎯 Próximos Pasos

1. ✅ Ejecutar `init_database.sql` en Supabase
2. ✅ Instalar dependencias (`npm install` en ambas carpetas)
3. ✅ Iniciar ambas aplicaciones
4. ✅ Hacer una prueba completa del flujo
5. 📖 Leer `GUIA_COMPLETA.md` para detalles avanzados

---

## 📞 ¿Necesitas Más Ayuda?

- **Documentación completa**: Lee `GUIA_COMPLETA.md`
- **Problemas con DB**: Lee `INSTRUCCIONES_DB.md`
- **Logs del navegador**: Presiona F12 > Console
- **Logs de Supabase**: Ve a tu proyecto > Logs

---

**Nota Importante**: Este sistema requiere que ambas aplicaciones estén corriendo simultáneamente (cliente + admin) para probar el flujo completo.
