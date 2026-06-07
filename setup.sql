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

-- 4. Tabla de shoutbox (chat Neocities)
CREATE TABLE IF NOT EXISTS public.shouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Políticas de acceso (RLS)
-- Se dropean primero para que el script sea re-ejecutable
ALTER TABLE public.entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read" ON public.entries;
CREATE POLICY "Allow public read" ON public.entries
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert" ON public.entries;
CREATE POLICY "Allow public insert" ON public.entries
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update" ON public.entries;
CREATE POLICY "Allow public update" ON public.entries
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public delete" ON public.entries;
CREATE POLICY "Allow public delete" ON public.entries
  FOR DELETE USING (true);

-- Settings también legible públicamente (el frontend la compara)
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read settings" ON public.settings;
CREATE POLICY "Allow public read settings" ON public.settings
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert settings" ON public.settings;
CREATE POLICY "Allow public insert settings" ON public.settings
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update settings" ON public.settings;
CREATE POLICY "Allow public update settings" ON public.settings
  FOR UPDATE USING (true);

-- 6. Shoutbox acceso público
ALTER TABLE public.shouts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read shouts" ON public.shouts;
CREATE POLICY "Allow public read shouts" ON public.shouts
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert shouts" ON public.shouts;
CREATE POLICY "Allow public insert shouts" ON public.shouts
  FOR INSERT WITH CHECK (true);
