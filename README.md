# Sistema SUCAMEC - Contratación y Administración de Armamento

Este proyecto consta de dos aplicaciones:

## 1. Aplicación de Cliente (project/)
Aplicación web para clientes que desean solicitar armas. Permite ver el catálogo, agregar al carrito y crear solicitudes con documentos.

### Iniciar Aplicación de Cliente
```bash
cd project
npm install
npm run dev
```

La aplicación estará disponible en: http://localhost:5173

## 2. Aplicación de Administración (admin/)
Sistema de administración para validar solicitudes con dos roles de usuario:

### Roles de Usuario

**Administrador**
- Usuario: `admin`
- Contraseña: `admin123`
- Función: Valida que todos los documentos requeridos estén presentes y sean correctos

**Logístico**
- Usuario: `logistic`
- Contraseña: `admin123`
- Función: Verifica que haya stock disponible para las armas solicitadas

### Iniciar Aplicación de Administración
```bash
cd admin
npm install
npm run dev
```

La aplicación estará disponible en: http://localhost:5174

## Base de Datos

Ambas aplicaciones comparten la misma base de datos Supabase configurada en el archivo `.env`

### Tablas Principales:
- `weapons` - Catálogo de armas
- `customers` - Información de clientes
- `orders` - Solicitudes de compra
- `order_items` - Detalle de armas por orden
- `order_documents` - Documentos cargados por orden
- `admin_users` - Usuarios administradores
- `order_validations` - Historial de validaciones

## Flujo de Trabajo

1. **Cliente**: Navega el catálogo, agrega armas al carrito y completa el checkout con sus datos y documentos
2. **Administrador**: Revisa la solicitud y valida que todos los documentos requeridos estén presentes
3. **Logístico**: Verifica que haya stock suficiente para todas las armas solicitadas
4. **Sistema**: Una vez ambas validaciones estén aprobadas, la orden cambia a estado "aprobado"
5. Si alguna validación es rechazada, la orden cambia a estado "rechazado"

## Características

### Aplicación de Cliente
- Catálogo de armas con filtros por categoría
- Carrito de compras
- Sistema de checkout con validación de documentos
- Seguimiento de órdenes

### Aplicación de Administración
- Dashboard con estadísticas
- Lista de solicitudes con filtros (Todas, Pendientes, Validadas)
- Vista detallada de cada solicitud con tabs:
  - Información General
  - Documentos (para administrador)
  - Verificación de Stock (para logístico)
- Sistema de aprobación/rechazo con notas
- Indicadores visuales de estado de validación

## Tecnologías Utilizadas
- React + TypeScript
- Vite
- Tailwind CSS
- Supabase (Base de datos y autenticación)
