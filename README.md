# LO QUIERO! 

Catálogo web completo con panel de administración, carrito, favoritos, descuentos y pedidos por WhatsApp — conectado a Supabase.

Estructura **plana** — todos los archivos en una sola carpeta, ideal para subir directo a GitHub vía el navegador (sin subcarpetas).

## Archivos

| Archivo | Descripción |
|---------|-------------|
| `index.html` | Catálogo principal (lo que ve el cliente) — carrito/favoritos embebidos |
| `admin.html` | Estructura HTML del panel de administración (`/admin.html`) |
| `script_admin.js` | Toda la lógica del panel admin (auth, CRUD, Storage) |
| `styles.css` | Estilos del catálogo |
| `style_admin.css` | Estilos del panel admin |
| `schema.sql` | Base de datos completa para Supabase (tablas + RLS + Storage) |
| `vercel.json` | Configuración de deploy y headers de seguridad |

## Stack

- **Frontend:** HTML / CSS / JavaScript puro
- **Backend:** [Supabase](https://supabase.com) (PostgreSQL + Auth + Storage, gratis)
- **Hosting:** [Vercel](https://vercel.com) (HTTPS gratis, dominio editable)
- **Excel:** Exportación CSV + integración con Google Sheets vía Make.com

## Características

### Catálogo (`index.html`)
- Búsqueda con previsualización en vivo (overlay en mobile)
- Categorías y filtros en desplegables, sin sidebar
- Carrusel de banners destacados
- Carrito con cantidades, variantes y código de descuento
- Favoritos persistentes
- Comentarios privados → WhatsApp
- Botón "Encargar" → registra el pedido en la base de datos y abre WhatsApp
- Vista de detalle de producto en dos columnas con galería + favorito sobre la imagen
- Cierre del detalle deslizando hacia abajo en mobile
- 100% responsive (mobile-first con bottom nav)

### Panel admin (`admin.html` + `script_admin.js`)
- **Login con una sola contraseña** (sin campo de email visible) — validada de forma segura contra Supabase Auth con hash bcrypt
- Bloqueo automático tras 5 intentos fallidos (15 min)
- Dashboard con estadísticas en tiempo real
- CRUD completo de productos: fotos (subidas a Supabase Storage), variantes, precios, stock, destacados
- Gestión de categorías, banners, secciones del home, anuncios
- Códigos de descuento con usos y mínimos de compra
- Historial de pedidos generados desde el catálogo, con cambio de estado
- Exportación a CSV/Excel
- Configuración general (WhatsApp, Instagram, nombre del sitio, cambio de contraseña) — se refleja automáticamente en el catálogo público

## Inicio rápido

Ver [`SETUP.md`](SETUP.md) para la guía completa paso a paso (Supabase, Storage, GitHub, Vercel, dominio propio, Excel).

## Modo demo

Sin configurar Supabase, tanto el catálogo como el admin funcionan con datos de ejemplo en memoria — ideal para mostrar el diseño y probar todos los flujos antes de conectar la base real.

## Licencia

Proyecto privado — Tomas, 2025.
