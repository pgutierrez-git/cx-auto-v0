# 🎯 Sistema de Feedback - Configuración

## ✅ Funcionalidades Implementadas

### 1. **Widget de Feedback Flotante**
- Botón flotante en la esquina inferior derecha
- Formulario con calificación de estrellas (1-5)
- Categorías: UI/UX, Features, Performance, General
- Campo de comentario opcional
- Validación de formulario
- Estados de carga y éxito

### 2. **Almacenamiento en Supabase**
- Tabla `feedback` con todos los campos necesarios
- Índices optimizados para consultas rápidas
- Triggers para actualización automática de timestamps
- Soporte para RLS (Row Level Security)

### 3. **Portal de Administración**
- Vista de todos los feedback recibidos
- Filtros por rating, categoría y búsqueda de texto
- Estados: Pendiente, Revisado, Resuelto
- Acciones para marcar como revisado/resuelto
- Estadísticas de feedback

## 🚀 Configuración

### Paso 1: Configurar Supabase

1. Ve a tu proyecto de Supabase
2. Abre el **SQL Editor**
3. Copia y pega el contenido de `supabase-feedback-setup.sql`
4. Ejecuta el script

### Paso 2: Verificar Variables de Entorno

Asegúrate de que tienes estas variables en tu `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
```

### Paso 3: Probar el Sistema

1. **Inicia el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

2. **Accede al portal:**
   - Portal principal: `http://localhost:3000`
   - Portal admin: `http://localhost:3000/admin`

3. **Prueba el feedback:**
   - Haz clic en el botón flotante de feedback
   - Completa el formulario y envía
   - Verifica que aparece en el portal de administración

## 📊 Estructura de la Base de Datos

### Tabla `feedback`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | Identificador único |
| `rating` | INTEGER | Calificación (0-5) |
| `comment` | TEXT | Comentario del usuario |
| `category` | TEXT | Categoría del feedback |
| `user_email` | TEXT | Email del usuario |
| `user_name` | TEXT | Nombre del usuario |
| `client_name` | TEXT | Nombre del cliente |
| `status` | TEXT | Estado (pending/reviewed/resolved) |
| `admin_response` | TEXT | Respuesta del administrador |
| `created_at` | TIMESTAMP | Fecha de creación |
| `updated_at` | TIMESTAMP | Fecha de última actualización |

## 🔧 Funciones Disponibles

### Para Usuarios
- `submitFeedback()` - Enviar feedback
- `FeedbackWidget` - Componente de interfaz

### Para Administradores
- `getFeedback()` - Obtener todos los feedback
- `getFeedbackStats()` - Obtener estadísticas
- `updateFeedbackStatus()` - Actualizar estado

## 🎨 Personalización

### Cambiar Colores del Widget
Edita `components/feedback-widget.tsx`:

```tsx
// Cambiar color principal
className="rounded-full w-14 h-14 bg-purple-600 hover:bg-purple-700"

// Cambiar a azul
className="rounded-full w-14 h-14 bg-blue-600 hover:bg-blue-700"
```

### Agregar Nuevas Categorías
1. Edita `lib/feedback.ts` - tipos TypeScript
2. Edita `components/feedback-widget.tsx` - opciones del select
3. Actualiza la base de datos si es necesario

### Modificar Validaciones
Edita la función `handleSubmit` en `components/feedback-widget.tsx`:

```tsx
const handleSubmit = async () => {
  // Agregar validaciones personalizadas aquí
  if (rating === 0 && !feedback.trim()) {
    toast.error('Tu mensaje personalizado aquí')
    return
  }
  // ... resto del código
}
```

## 🐛 Solución de Problemas

### Error: "Cannot find name 'getFeedback'"
- Verifica que las importaciones estén correctas en `app/admin/admin-portal.tsx`
- Asegúrate de que `lib/feedback.ts` existe

### Error: "Table 'feedback' does not exist"
- Ejecuta el script SQL en Supabase
- Verifica que la tabla se creó correctamente

### Widget no aparece
- Verifica que `FeedbackWidget` está importado en `app/page.tsx`
- Revisa la consola del navegador para errores

### No se guardan los datos
- Verifica las variables de entorno de Supabase
- Revisa los logs de Supabase para errores de permisos

## 📈 Próximas Mejoras

- [ ] Notificaciones por email cuando se recibe feedback
- [ ] Dashboard con gráficos de feedback
- [ ] Sistema de respuestas automáticas
- [ ] Exportación de feedback a CSV/Excel
- [ ] Integración con sistemas de tickets
- [ ] Análisis de sentimientos del feedback

## 🤝 Contribución

Para agregar nuevas funcionalidades:

1. Crea una nueva rama
2. Implementa la funcionalidad
3. Actualiza la documentación
4. Crea un pull request

---

¡El sistema de feedback está listo para usar! 🎉
