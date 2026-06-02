-- ============================================================
-- Setup de tablas para "Me acuerdo de..."
-- Ejecutar en Supabase: SQL Editor → New query → Run
-- ============================================================

-- 1. Tabla de recuerdos
CREATE TABLE IF NOT EXISTS public.entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  entry_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Tabla de configuración (contraseña)
CREATE TABLE IF NOT EXISTS public.settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- 3. Insertar contraseña de desbloqueo
INSERT INTO public.settings (key, value)
VALUES ('password', 'papoi')
ON CONFLICT (key) DO NOTHING;

-- 4. Políticas de acceso (RLS)
-- Permite lectura pública (modo lectura sin contraseña)
ALTER TABLE public.entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON public.entries
  FOR SELECT USING (true);

-- Permite escritura pública (gestionada desde el frontend tras desbloqueo)
-- Nota: en un sitio estático la anon key es pública, así que esto permite
-- insert/update/delete a cualquiera que use el frontend. Es aceptable para
-- un regalo íntimo donde la "cerradura" es simbólica.
CREATE POLICY "Allow public insert" ON public.entries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update" ON public.entries
  FOR UPDATE USING (true);

CREATE POLICY "Allow public delete" ON public.entries
  FOR DELETE USING (true);

-- Settings también legible públicamente (el frontend la compara)
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read settings" ON public.settings
  FOR SELECT USING (true);
