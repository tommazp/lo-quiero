# 🛍️ LO QUIERO! — Guía de instalación completa

## Estructura del proyecto

```
lo-quiero/
├── public/
│   ├── index.html          ← Catálogo principal
│   ├── css/
│   │   └── styles.css
│   └── js/
│       ├── store.js        ← Carrito y favoritos
│       ├── icons.js        ← Íconos SVG
│       └── supabase.js     ← Cliente Supabase
├── admin/
│   ├── index.html          ← Panel de administración
│   └── css/
│       └── admin.css
├── supabase/
│   └── schema.sql          ← Base de datos completa
├── vercel.json             ← Configuración de deploy
└── docs/
    └── SETUP.md            ← Esta guía
```

---

## PASO 1 — Crear proyecto en Supabase (gratis)

1. Andá a **https://supabase.com** y creá una cuenta
2. Creá un nuevo proyecto (región: South America si está disponible)
3. Esperá que termine de configurarse (~2 minutos)
4. Andá a **SQL Editor** y pegá todo el contenido de `supabase/schema.sql`
5. Ejecutá el script (botón **Run**)

### Obtener las credenciales
- Andá a **Settings → API**
- Copiá:
  - **Project URL** → va en `SUPABASE_URL`
  - **anon public key** → va en `SUPABASE_ANON_KEY`

---

## PASO 2 — Crear el usuario administrador en Supabase

1. Andá a **Authentication → Users**
2. Hacé clic en **Add user → Create new user**
3. Email: `admin@loquiero.com`
4. Password: `Salchipapa` (o la que quieras — podés cambiarla desde el panel)
5. ✅ Auto Confirm User: activado

> ⚠️ La contraseña NUNCA se guarda en el código. Vive en Supabase Auth con hash bcrypt. Solo se puede ver/cambiar desde Supabase o desde el panel de admin.

---

## PASO 3 — Configurar las credenciales en el código

En `public/index.html` buscá estas líneas y reemplazá:

```javascript
const SUPABASE_URL      = 'https://TU_PROYECTO.supabase.co';
const SUPABASE_ANON_KEY = 'TU_ANON_KEY';
```

En `admin/index.html` hacé lo mismo:

```javascript
const SUPABASE_URL      = 'https://TU_PROYECTO.supabase.co';
const SUPABASE_ANON_KEY = 'TU_ANON_KEY';
```

---

## PASO 4 — Subir imágenes (Supabase Storage)

1. En Supabase → **Storage → New bucket**
2. Nombre: `product-images`
3. ✅ Public bucket: activado
4. En la sección de políticas agregá:
   ```sql
   -- Lectura pública
   CREATE POLICY "public_read" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
   -- Solo admins autenticados pueden subir
   CREATE POLICY "auth_upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');
   ```

---

## PASO 5 — Deploy en Vercel (HTTPS gratis)

### Opción A: Desde GitHub (recomendado)
1. Creá un repositorio en **github.com** (público o privado)
2. Subí todos los archivos del proyecto
3. Andá a **vercel.com** y creá una cuenta (gratis con GitHub)
4. Hacé clic en **New Project → Import from GitHub**
5. Seleccioná tu repositorio
6. Vercel detecta automáticamente el `vercel.json`
7. Hacé clic en **Deploy**

¡Listo! Tu sitio queda en `https://lo-quiero.vercel.app`

### Cambiar el dominio
- En Vercel → Settings → Domains → agregá tu dominio propio (ej: `loquiero.com.ar`)
- Configurá el DNS según las instrucciones de Vercel

### Opción B: Vercel CLI
```bash
npm i -g vercel
cd lo-quiero
vercel
```

---

## PASO 6 — Conectar a Google Sheets (Excel automático)

1. En Supabase → **Database → Webhooks**
2. Creá un webhook para la tabla `orders` (evento: INSERT)
3. URL del webhook: usá **Make.com** o **Zapier** (gratis) para conectar Supabase → Google Sheets

### Con Make.com (gratis):
1. Creá un escenario: **Supabase → Google Sheets**
2. Trigger: nuevo registro en `orders`
3. Action: agregar fila en tu hoja de cálculo
4. Mapeá los campos: order_number, items, total, created_at

---

## DATOS IMPORTANTES

| Campo | Valor |
|-------|-------|
| WhatsApp | 5493445440326 |
| Panel admin | `/admin/` |
| Contraseña inicial | `Salchipapa` |
| Email Supabase Auth | `admin@loquiero.com` |

---

## MODO DEMO (sin Supabase)

Si abrís los archivos HTML directamente en el navegador sin configurar Supabase, el sitio funciona en **modo demo** con datos de ejemplo. Perfecto para mostrar el diseño al cliente.

---

## Cambiar el número de WhatsApp

En `public/js/store.js`:
```javascript
const WA_NUMBER = '5493445440326'; // ← Cambiá este número
```

En `public/index.html`, también actualizá los links del footer.

---

## Seguridad

- ✅ La contraseña del admin usa **bcrypt** via Supabase Auth
- ✅ Bloqueo automático tras 5 intentos fallidos (15 minutos)
- ✅ Row Level Security en Supabase: el público solo puede leer
- ✅ El panel admin tiene `noindex` (Google no lo indexa)
- ✅ Headers de seguridad via `vercel.json`
- ✅ HTTPS automático con Vercel

---

## Personalización de marca (para futuros clientes)

Para adaptar este catálogo a otra empresa:
1. `public/css/styles.css` → cambiar las variables `:root` (colores, fuentes)
2. `public/index.html` → cambiar logo, nombre, links de contacto
3. `public/js/store.js` → cambiar `WA_NUMBER`
4. `supabase/schema.sql` → limpiar los datos de seed y cargar los nuevos

---

*Proyecto desarrollado por Tomas — LO QUIERO! v1.0*
