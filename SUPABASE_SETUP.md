# Configuración de Supabase Magic Link

## Pasos para configurar la autenticación con Magic Link

### 1. Crear un proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea una nueva cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Anota la URL y la clave anónima del proyecto

### 2. Configurar las variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
```

### 3. Configurar la autenticación en Supabase

1. Ve a la sección "Authentication" en tu dashboard de Supabase
2. En "Settings" > "Auth", habilita "Email auth"
3. En "Settings" > "Auth" > "URL Configuration", configura:
   - Site URL: `http://localhost:3001` (para desarrollo)
   - Redirect URLs: `http://localhost:3001/auth/callback`

### 4. Configurar el servicio de email (opcional)

Para usar un servicio de email personalizado:
1. Ve a "Settings" > "Auth" > "SMTP Settings"
2. Configura tu proveedor de email (Gmail, SendGrid, etc.)

### 5. Probar la funcionalidad

1. Ejecuta `npm run dev`
2. Ve a `http://localhost:3001`
3. Ingresa tu email
4. Revisa tu bandeja de entrada para el enlace mágico
5. Haz clic en el enlace para autenticarte

## Características implementadas

- ✅ Autenticación con Magic Link
- ✅ Página de callback para procesar el enlace
- ✅ Protección de rutas
- ✅ Hook personalizado para manejar la autenticación
- ✅ Componente de logout
- ✅ Redirección automática después de la autenticación

## Estructura de archivos

```
components/
  auth/
    magic-link-auth.tsx    # Componente de login con Magic Link
    protected-route.tsx     # Componente para proteger rutas
hooks/
  use-auth.ts             # Hook para manejar la autenticación
lib/
  supabase.ts             # Configuración del cliente de Supabase
app/
  auth/
    callback/
      page.tsx            # Página de callback para Magic Link
```

## Notas importantes

- El Magic Link expira después de 1 hora por defecto
- Los usuarios pueden cerrar sesión desde el botón en el header
- Las rutas están protegidas automáticamente
- El sistema redirige a usuarios no autenticados a la página de login 