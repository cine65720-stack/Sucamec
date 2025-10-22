# Sistema Completo SUCAMEC - Guía de Uso

## Descripción General

Sistema completo de contratación y administración de armamento SUCAMEC con dos aplicaciones integradas:

1. **Aplicación de Cliente** - Para solicitar armas y cargar documentos
2. **Aplicación de Administración** - Para validar solicitudes (documentos y stock)

---

## 🚀 Inicio Rápido

### Aplicación de Cliente
```bash
cd project
npm install
npm run dev
```
**URL:** http://localhost:5173

### Aplicación de Administración
```bash
cd admin
npm install
npm run dev
```
**URL:** http://localhost:5174

---

## 📋 Funcionalidades Implementadas

### APLICACIÓN DE CLIENTE

#### 1. Catálogo de Armas
- ✅ 15 armas precargadas en 3 categorías:
  - Uso Policial (5 armas)
  - Uso Militar (5 armas)
  - Seguridad Privada (5 armas)
- ✅ Filtros por categoría
- ✅ Vista de detalles con especificaciones técnicas
- ✅ Información de stock en tiempo real
- ✅ Precios y descripciones

#### 2. Carrito de Compras
- ✅ Agregar/quitar armas
- ✅ Ajustar cantidades
- ✅ Validación de stock disponible
- ✅ Cálculo automático de totales
- ✅ Persistencia durante la sesión

#### 3. Sistema de Checkout
- ✅ Formulario de datos del cliente:
  - Nombre completo
  - DNI (validación de 8 dígitos)
  - Email (validación de formato)
  - Teléfono (9 dígitos)
  - Dirección
  - Notas adicionales

- ✅ Carga de documentos requeridos:
  - Sistema inteligente que detecta documentos necesarios según armas seleccionadas
  - Validación de que todos los documentos estén cargados
  - Soporte para PDF, JPG, PNG

- ✅ Generación de número de orden único
- ✅ Confirmación de pedido
- ✅ Creación automática de registros en base de datos

#### 4. Seguimiento de Pedidos
- ✅ Búsqueda por DNI o número de orden
- ✅ Vista de estado actual del pedido
- ✅ Detalle de armas solicitadas
- ✅ Estado de validaciones (documentos y stock)

#### 5. Secciones Informativas
- ✅ Hero section con llamada a la acción
- ✅ Requisitos y documentación necesaria
- ✅ Información de contacto
- ✅ Footer con enlaces útiles

---

### APLICACIÓN DE ADMINISTRACIÓN

#### 1. Sistema de Login
- ✅ Dos roles de usuario:
  - **Administrador** (usuario: `admin`, contraseña: `admin123`)
    - Valida documentos
  - **Logístico** (usuario: `logistic`, contraseña: `admin123`)
    - Verifica stock

#### 2. Dashboard Principal
- ✅ Estadísticas en tiempo real:
  - Total de solicitudes
  - Solicitudes pendientes
  - Solicitudes validadas

- ✅ Filtros inteligentes:
  - Todas las solicitudes
  - Solo pendientes (según rol)
  - Solo validadas (según rol)

#### 3. Lista de Solicitudes
- ✅ Vista general de todas las órdenes
- ✅ Información resumida:
  - Número de orden
  - Datos del cliente
  - Cantidad de armas
  - Monto total
  - Estado de validaciones
- ✅ Indicadores visuales de estado
- ✅ Click para ver detalles

#### 4. Detalle de Solicitud (Modal)

**Tab 1: Información General**
- ✅ Datos completos del cliente
- ✅ Lista detallada de armas solicitadas
- ✅ Subtotales y total
- ✅ Estado de validaciones (documentos y stock)

**Tab 2: Documentos (Rol Administrador)**
- ✅ Lista de documentos requeridos
- ✅ Verificación visual de documentos cargados vs faltantes
- ✅ Indicadores de estado (cargado/faltante)
- ✅ Acceso para ver cada documento
- ✅ Botones para aprobar/rechazar con notas

**Tab 3: Verificación de Stock (Rol Logístico)**
- ✅ Lista de armas con cantidades solicitadas
- ✅ Comparación de stock disponible vs solicitado
- ✅ Indicadores visuales de disponibilidad
- ✅ Información detallada de cada arma
- ✅ Botones para aprobar/rechazar con notas

#### 5. Sistema de Validación
- ✅ Aprobación/rechazo independiente por rol
- ✅ Campo de notas opcional para cada validación
- ✅ Actualización automática de estado de orden
- ✅ Registro de historial de validaciones
- ✅ Trazabilidad completa (quién validó y cuándo)

#### 6. Lógica de Estados
- ✅ Orden inicia como "pendiente"
- ✅ Si alguna validación es rechazada → orden pasa a "rechazado"
- ✅ Si ambas validaciones son aprobadas → orden pasa a "aprobado"
- ✅ Actualización automática en tiempo real

---

## 🗄️ Base de Datos

### Tablas Implementadas

#### Catálogo
- `weapon_categories` - Categorías de armas
- `weapons` - Catálogo completo con precios, stock y documentos requeridos

#### Clientes y Órdenes
- `customers` - Información de clientes
- `orders` - Solicitudes de compra con estados de validación
- `order_items` - Detalle de armas por orden
- `order_documents` - Documentos cargados

#### Administración
- `admin_users` - Usuarios del sistema administrativo
- `order_validations` - Historial de todas las validaciones

### Campos Importantes de `orders`
- `status` - Estado del pedido (pendiente/aprobado/rechazado)
- `documents_validated` - Boolean si documentos fueron aprobados
- `stock_validated` - Boolean si stock fue verificado
- `documents_validator_id` - ID del admin que validó documentos
- `stock_validator_id` - ID del admin que validó stock

---

## 🔄 Flujo Completo de Trabajo

### Paso 1: Cliente Crea Solicitud
1. Cliente navega el catálogo de armas
2. Agrega armas de interés al carrito
3. Procede al checkout
4. Completa formulario con datos personales
5. Sistema detecta documentos necesarios según armas seleccionadas
6. Cliente carga todos los documentos requeridos
7. Confirma y envía solicitud
8. Recibe número de orden único

### Paso 2: Validación de Documentos (Administrador)
1. Admin inicia sesión con usuario `admin`
2. Ve lista de solicitudes pendientes
3. Selecciona una solicitud para revisar
4. Revisa tab "Documentos"
5. Verifica que todos los documentos requeridos estén presentes
6. Verifica que documentos sean válidos
7. Aprueba o rechaza con notas opcionales
8. Sistema actualiza estado de validación

### Paso 3: Verificación de Stock (Logístico)
1. Logístico inicia sesión con usuario `logistic`
2. Ve lista de solicitudes pendientes de stock
3. Selecciona una solicitud para revisar
4. Revisa tab "Verificación de Stock"
5. Verifica que hay stock suficiente para cada arma
6. Aprueba o rechaza con notas opcionales
7. Sistema actualiza estado de validación

### Paso 4: Resultado Final
- **Si ambas validaciones aprueban**: Orden pasa a estado "aprobado"
- **Si alguna rechaza**: Orden pasa a estado "rechazado"
- Cliente puede consultar estado final en "Mis Pedidos"

---

## 🎨 Características de Diseño

### Diseño Profesional
- ✅ Interfaz moderna y limpia
- ✅ Responsive design (móvil, tablet, desktop)
- ✅ Colores institucionales coherentes
- ✅ Iconografía clara y consistente
- ✅ Feedback visual en todas las acciones

### Experiencia de Usuario
- ✅ Navegación intuitiva
- ✅ Mensajes de confirmación
- ✅ Validaciones en tiempo real
- ✅ Estados de carga visibles
- ✅ Mensajes de error claros

---

## 📝 Documentos Requeridos por Categoría

### Uso Policial
- DNI
- Licencia SUCAMEC Tipo A
- Certificado Psicológico
- Antecedentes Policiales

### Uso Militar
- DNI
- Licencia SUCAMEC Tipo B
- Autorización Militar
- Certificado Psicológico
- Antecedentes Policiales

### Seguridad Privada
- DNI
- Licencia SUCAMEC Tipo C
- Certificado de Empresa de Seguridad
- Certificado Psicológico

---

## 🔒 Seguridad Implementada

### Row Level Security (RLS)
- ✅ Todas las tablas tienen RLS habilitado
- ✅ Políticas restrictivas por defecto
- ✅ Acceso controlado según contexto

### Validaciones
- ✅ Validación de DNI (8 dígitos)
- ✅ Validación de teléfono (9 dígitos)
- ✅ Validación de formato de email
- ✅ Validación de documentos requeridos
- ✅ Validación de stock disponible

---

## 🧪 Datos de Prueba

### Cuentas de Administración
```
Administrador:
- Usuario: admin
- Contraseña: admin123
- Función: Validar documentos

Logístico:
- Usuario: logistic
- Contraseña: admin123
- Función: Verificar stock
```

### Catálogo de Armas
- 15 armas precargadas con stock
- Precios desde S/ 3,200 hasta S/ 19,500
- Stock variado para pruebas (4 a 35 unidades)

---

## ✅ Estado del Proyecto

### Completado al 100%
✅ Base de datos con todas las tablas y relaciones
✅ Aplicación de cliente completamente funcional
✅ Aplicación de administración completamente funcional
✅ Sistema de validaciones con dos roles
✅ Gestión de documentos
✅ Verificación de stock
✅ Actualización automática de estados
✅ Interfaz responsive
✅ Catálogo de armas precargado

### Listo para Usar
- Ambas aplicaciones compiladas sin errores
- Base de datos poblada con datos de prueba
- Documentación completa
- Sistema totalmente operativo

---

## 🚀 Comandos Útiles

### Desarrollo
```bash
# Cliente
cd project && npm run dev

# Admin
cd admin && npm run dev
```

### Producción
```bash
# Cliente
cd project && npm run build

# Admin
cd admin && npm run build
```

### Ver archivos dist
```bash
# Cliente
cd project/dist

# Admin
cd admin/dist
```

---

## 📞 Soporte

Para cualquier duda o problema:
1. Revisa esta documentación
2. Verifica la consola del navegador para errores
3. Revisa los logs de la base de datos Supabase

---

**Desarrollado con:**
- React + TypeScript
- Vite
- Tailwind CSS
- Supabase
- Lucide Icons
