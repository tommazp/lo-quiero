# 🛍️ LO QUIERO! — Guía de instalación completa

## Estructura del proyecto (todo en una sola carpeta)

```
lo-quiero/
├── index.html         ← Catálogo principal (carrito/favoritos embebidos)
├── admin.html          ← Panel de administración (estructura HTML)
├── styles.css          ← Estilos del catálogo
├── script_admin.js     ← Toda la lógica del panel admin
├── style_admin.css     ← Estilos del panel admin
├── schema.sql           ← Base de datos completa (ejecutar en Supabase)
├── vercel.json          ← Configuración de deploy
├── README.md
└── SETUP.md             ← Esta guía
```

Todo está en la raíz a propósito — así podés subir cada archivo individualmente desde la interfaz web de GitHub sin problemas de carpetas ni rutas rotas.

---

## PASO 1 — Crear proyecto en Supabase (gratis)

1. Andá a **https://supabase.com** y creá una cuenta
2. Creá un nuevo proyecto (región: South America si está disponible) y guardá la contraseña de base de datos
3. Esperá ~2 minutos a que termine de aprovisionarse
4. Andá a **SQL Editor → New query**, pegá todo el contenido de `schema.sql` y ejecutá (**Run**)
5. Deberías ver "Success. No rows returned" — esto crea todas las tablas, políticas de seguridad y categorías de ejemplo

### Obtener las credenciales del proyecto
- Andá a **Settings → API**
- Copiá:
  - **Project URL** → la vas a pegar en `SUPABASE_URL`
  - **anon public key** → la vas a pegar en `SUPABASE_KEY` / `SUPABASE_ANON_KEY`

---

## PASO 2 — Crear el usuario administrador (contraseña segura)

El panel admin usa **una sola contraseña** — no hay campo de email visible para quien lo usa. Por dentro, esa contraseña se valida contra **Supabase Auth** (hash bcrypt, gestionado 100% por Supabase, nunca guardado en texto plano en ningún archivo).

1. En Supabase, andá a **Authentication → Users → Add user → Create new user**
2. Email: `admin@loquiero.com` (este valor es fijo, ya está en el código — no hace falta que lo escribas en ningún lado del sitio)
3. Password: elegí la contraseña que va a usar la persona que administra el catálogo
4. Activá **Auto Confirm User**
5. Guardar

> 💡 Para cambiar la contraseña más adelante, no hace falta volver a Supabase: se puede hacer desde **Configuración** dentro del propio panel admin.

---

## PASO 3 — Bucket de imágenes (Supabase Storage)

1. Andá a **Storage → New bucket**
2. Nombre exacto: `product-images`
3. Activá **Public bucket**
4. Andá a **Storage → product-images → Policies → New policy → For full customization**

**Policy 1 — Lectura pública**
- Policy name: `public_read_images`
- Allowed operation: marcá solo **SELECT**
- Target roles: dejar vacío
- Policy definition:
  ```sql
  bucket_id = 'product-images'
  ```

**Policy 2 — Solo el admin sube/edita/borra**
- Policy name: `admin_write_images`
- Allowed operation: marcá **INSERT**, **UPDATE** y **DELETE**
- Target roles: `authenticated`
- Policy definition:
  ```sql
  bucket_id = 'product-images' AND auth.role() = 'authenticated'
  ```

(El archivo `schema.sql` incluye estos mismos pasos comentados al final, por si los necesitás de referencia rápida.)

---

## PASO 4 — Configurar las credenciales en el código

**En `index.html`**, buscá dentro del `<script type="module">` (cerca del final del archivo):

```javascript
const SUPABASE_URL      = 'https://TU_PROYECTO.supabase.co';
const SUPABASE_ANON_KEY = 'TU_ANON_KEY';
```

Reemplazá ambos valores por los tuyos.

**En `script_admin.js`**, al principio del archivo:

```javascript
const SUPABASE_URL = 'https://TU_PROYECTO.supabase.co';
const SUPABASE_KEY = 'TU_ANON_KEY';
```

Mismos valores, mismo reemplazo.

> Mientras estos valores sigan diciendo `TU_PROYECTO` / `TU_ANON_KEY`, tanto el catálogo como el admin funcionan automáticamente en **modo demo** (datos de ejemplo en memoria, sin conexión real) — ideal para probar el diseño antes de conectar todo.

---

## PASO 5 — Subir a GitHub (archivo por archivo, vía navegador)

1. Entrá a **github.com → New repository** (público o privado)
2. **Add file → Upload files**
3. Arrastrá todos los archivos de la carpeta a la vez
4. Como todo está en la raíz sin subcarpetas, no hay conflictos de nombres ni rutas rotas
5. Commit changes

---

## PASO 6 — Deploy en Vercel (HTTPS gratis)

1. Andá a **vercel.com**, creá cuenta con GitHub
2. **New Project → Import** tu repositorio
3. Vercel detecta automáticamente que es un sitio estático
4. **Deploy**

Tu sitio queda en `https://tu-proyecto.vercel.app`:
- Catálogo: `https://tu-proyecto.vercel.app/`
- Admin: `https://tu-proyecto.vercel.app/admin.html`

### Dominio propio
En Vercel → Settings → Domains → agregá tu dominio y seguí las instrucciones de DNS. HTTPS se emite y renueva automáticamente.

---

## PASO 7 — Conectar a Google Sheets (Excel automático)

1. Cuenta gratis en **make.com**
2. **Create scenario** → trigger: módulo Supabase, "Watch Rows" en tabla `orders`, evento INSERT
3. Acción: módulo **Google Sheets → Add a Row**
4. Mapeá los campos que quieras ver: `order_number`, `total`, `created_at`, `status`
5. Activá el escenario

Cada vez que un cliente complete un pedido por WhatsApp desde el catálogo, el pedido también se guarda automáticamente en la tabla `orders` de Supabase — y desde ahí se refleja en tu planilla.

---

## Cómo funciona la seguridad del login

- La contraseña jamás se escribe en el código ni en ningún archivo del repositorio
- Se valida con `supabase.auth.signInWithPassword()`, usando hash bcrypt gestionado enteramente por Supabase
- **Bloqueo automático** tras 5 intentos fallidos, por 15 minutos (con cuenta regresiva visible)
- El estado de sesión vive en `sessionStorage` — se cierra solo al cerrar la pestaña/navegador, o manualmente con el botón "Salir"
- Todas las tablas tienen **Row Level Security**: el público solo puede leer datos activos; solo un usuario autenticado (el admin logueado) puede crear, editar o borrar
- `admin.html` incluye `<meta name="robots" content="noindex, nofollow">` para que Google no lo indexe

---

## Cómo se conecta todo (admin → catálogo → base de datos)

- El panel admin (`admin.html` + `script_admin.js`) lee y escribe directamente en las tablas de Supabase: `products`, `categories`, `carousels`, `sections`, `announcements`, `discount_codes`, `orders`, `site_config`
- El catálogo público (`index.html`) lee esas mismas tablas (solo lo activo/público) y, cuando alguien hace un pedido por WhatsApp, **registra el pedido en la tabla `orders`** antes de abrir WhatsApp — así aparece automáticamente en la sección "Pedidos" del admin
- Las imágenes que subís desde el admin van al bucket `product-images` de Supabase Storage y se guardan como URL pública en el array `images` de cada producto
- Cambiar el número de WhatsApp o el nombre del sitio desde **Configuración** en el admin actualiza `site_config`, y el catálogo lo lee automáticamente al cargar (sin tocar código)

---

## MODO DEMO (sin Supabase)

Mientras las credenciales sigan siendo el placeholder, **tanto el catálogo como el admin funcionan igual** con datos de ejemplo guardados solo en memoria (se pierden al recargar la página). Perfecto para mostrar el diseño y probar todos los flujos antes de conectar la base real. La contraseña en modo demo es `Salchipapa` (definida en `script_admin.js` como `DEMO_PASS`, solo se usa cuando Supabase no está configurado).

---

## DATOS IMPORTANTES

| Campo | Valor |
|-------|-------|
| WhatsApp por defecto | 5493445440326 (editable desde Configuración) |
| Panel admin | `/admin.html` |
| Contraseña demo (sin Supabase) | `Salchipapa` |
| Email fijo de Supabase Auth | `admin@loquiero.com` |
| Bucket de Storage | `product-images` |

---

## Personalización de marca (para futuros clientes)

1. `styles.css` y `style_admin.css` → variables `:root` (colores, fuentes)
2. `index.html` → logo, nombre, links de contacto
3. `schema.sql` → limpiar el `INSERT INTO categories` de ejemplo y cargar las categorías reales antes de ejecutar
4. Repetir pasos 1-6 con un proyecto de Supabase nuevo para cada cliente

---

*Proyecto desarrollado por Tomas — LO QUIERO! v2.0 (admin completamente funcional, login solo con contraseña, conectado a Supabase)*
