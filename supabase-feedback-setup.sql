-- Script para crear la tabla de feedback en Supabase
-- Ejecuta este script en el SQL Editor de Supabase

-- Crear la tabla de feedback
CREATE TABLE IF NOT EXISTS feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  rating INTEGER NOT NULL CHECK (rating >= 0 AND rating <= 5),
  comment TEXT,
  category TEXT NOT NULL CHECK (category IN ('UI/UX', 'Features', 'Performance', 'General')),
  user_email TEXT,
  user_name TEXT,
  client_name TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved')),
  admin_response TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(status);
CREATE INDEX IF NOT EXISTS idx_feedback_category ON feedback(category);
CREATE INDEX IF NOT EXISTS idx_feedback_rating ON feedback(rating);
CREATE INDEX IF NOT EXISTS idx_feedback_user_email ON feedback(user_email);

-- Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear trigger para actualizar updated_at
CREATE TRIGGER update_feedback_updated_at 
    BEFORE UPDATE ON feedback 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Configurar RLS (Row Level Security) si es necesario
-- ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Crear políticas de RLS (opcional - descomenta si necesitas seguridad adicional)
-- Política para permitir inserción de feedback
-- CREATE POLICY "Users can insert feedback" ON feedback
--   FOR INSERT WITH CHECK (true);

-- Política para permitir lectura de feedback (solo para admins)
-- CREATE POLICY "Admins can read all feedback" ON feedback
--   FOR SELECT USING (auth.jwt() ->> 'email' LIKE '%@tapi.la' OR auth.jwt() ->> 'email' LIKE '%@auntap.com');

-- Política para permitir actualización de feedback (solo para admins)
-- CREATE POLICY "Admins can update feedback" ON feedback
--   FOR UPDATE USING (auth.jwt() ->> 'email' LIKE '%@tapi.la' OR auth.jwt() ->> 'email' LIKE '%@auntap.com');

-- Insertar algunos datos de ejemplo (opcional)
INSERT INTO feedback (rating, comment, category, user_email, user_name, client_name, status) VALUES
(5, 'Excelente portal, muy fácil de usar y con información muy útil', 'UI/UX', 'usuario1@ejemplo.com', 'Juan Pérez', 'Banco Central', 'pending'),
(4, 'Me gustaría ver más gráficos de comparación entre períodos', 'Features', 'usuario2@ejemplo.com', 'María García', 'FinTech Solutions', 'reviewed'),
(3, 'El portal funciona bien pero a veces es lento al cargar los datos', 'Performance', 'usuario3@ejemplo.com', 'Carlos López', 'Corporativo XYZ', 'pending'),
(5, 'Perfecto para nuestro análisis diario, muy completo', 'General', 'usuario4@ejemplo.com', 'Ana Rodríguez', 'Banco Central', 'resolved');

-- Verificar que la tabla se creó correctamente
SELECT 
  table_name, 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'feedback' 
ORDER BY ordinal_position;
