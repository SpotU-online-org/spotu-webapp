-- ============================================================================
-- SpotU — Marketplace de Publicidad
-- Migración inicial: esquema completo de la base de datos
-- ============================================================================

-- ============================================================================
-- 1. EXTENSIONES
-- ============================================================================

-- Habilitamos la extensión para generar UUIDs (necesaria para gen_random_uuid)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 2. FUNCIONES AUXILIARES
-- ============================================================================

-- Función que actualiza automáticamente el campo updated_at en cada UPDATE
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función que crea automáticamente un perfil cuando un usuario se registra
-- Se usa como trigger en auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, email_contact)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', NEW.raw_user_meta_data ->> 'full_name', split_part(NEW.email, '@', 1)),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 3. TABLAS
-- ============================================================================

-- --------------------------------------------------------------------------
-- 3.1 profiles — Extiende auth.users con datos del perfil público
-- Cada usuario tiene exactamente un perfil con su tipo de cuenta
-- --------------------------------------------------------------------------
CREATE TABLE public.profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  type            TEXT NOT NULL DEFAULT 'advertiser'
                    CHECK (type IN ('advertiser', 'space_owner', 'agency')),
  display_name    TEXT NOT NULL,
  company_name    TEXT,
  avatar_url      TEXT,
  bio             TEXT,
  website         TEXT,
  phone           TEXT,
  whatsapp        TEXT,
  email_contact   TEXT,
  city            TEXT,
  state           TEXT,
  country         TEXT DEFAULT 'CO',
  is_verified     BOOLEAN DEFAULT FALSE,
  plan            TEXT DEFAULT 'free'
                    CHECK (plan IN ('free', 'pro', 'agency')),
  stripe_customer_id          TEXT,
  first_listing_published_at  TIMESTAMPTZ,  -- Para rastrear el trial gratuito de 30 días
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.profiles IS 'Perfiles de usuario — extiende auth.users con datos públicos del marketplace';
COMMENT ON COLUMN public.profiles.type IS 'Tipo de cuenta: anunciante, dueño de espacio, o agencia';
COMMENT ON COLUMN public.profiles.first_listing_published_at IS 'Fecha de primera publicación — se usa para calcular el periodo de prueba de 30 días';

-- --------------------------------------------------------------------------
-- 3.2 listings — Publicaciones del marketplace (espacios, solicitudes, servicios)
-- Es la tabla central del marketplace de 3 lados
-- --------------------------------------------------------------------------
CREATE TABLE public.listings (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type              TEXT NOT NULL
                      CHECK (type IN ('want_to_advertise', 'have_space', 'offer_service')),
  title             TEXT NOT NULL,
  description       TEXT NOT NULL,

  -- Tipo de espacio publicitario (para listings de tipo have_space y want_to_advertise)
  space_type        TEXT
                      CHECK (space_type IN (
                        'billboard', 'led_screen', 'sports_venue',
                        'social_media', 'website', 'app',
                        'print', 'radio', 'podcast', 'other'
                      )),
  space_medium      TEXT
                      CHECK (space_medium IN ('physical', 'digital')),

  -- Campos para agencias (tipo offer_service)
  services          TEXT[],       -- Servicios que ofrece la agencia
  specializations   TEXT[],       -- Especializaciones de la agencia

  -- ---- Ubicación ----
  -- Ubicación física del espacio O ubicación deseada por el anunciante
  location_city     TEXT,
  location_state    TEXT,
  location_country  TEXT DEFAULT 'CO',
  location_address  TEXT,         -- Dirección específica para espacios físicos
  location_lat      DECIMAL,      -- Latitud para futuras funciones de mapa
  location_lng      DECIMAL,      -- Longitud para futuras funciones de mapa
  is_remote         BOOLEAN DEFAULT FALSE,  -- TRUE para espacios digitales sin ubicación física

  -- Áreas de cobertura (para agencias: mercados donde operan; para anunciantes: ubicaciones deseadas)
  coverage_areas    TEXT[],

  -- Ubicación propia del anunciante (diferente de la ubicación del espacio que busca)
  company_city      TEXT,
  company_state     TEXT,
  company_country   TEXT,

  -- ---- Precios ----
  price_min         DECIMAL,
  price_max         DECIMAL,
  price_currency    TEXT DEFAULT 'USD',
  price_period      TEXT
                      CHECK (price_period IN ('day', 'week', 'month', 'campaign')),
  price_text        TEXT,         -- Texto libre para describir el precio (ej: "Desde $500/mes")

  -- ---- Detalles adicionales ----
  audience_size     TEXT,         -- Tamaño de audiencia (texto libre)
  availability      TEXT,         -- Disponibilidad (texto libre)
  industry          TEXT,         -- Industria o sector

  -- ---- Contacto directo ----
  whatsapp          TEXT,
  email_contact     TEXT,
  website_url       TEXT,

  -- ---- Multimedia ----
  images            TEXT[],       -- URLs de imágenes en Supabase Storage

  -- ---- Estado y métricas ----
  status            TEXT DEFAULT 'active'
                      CHECK (status IN ('draft', 'active', 'paused', 'expired')),
  is_featured       BOOLEAN DEFAULT FALSE,
  views_count       INTEGER DEFAULT 0,
  contacts_count    INTEGER DEFAULT 0,

  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.listings IS 'Publicaciones del marketplace — espacios publicitarios, solicitudes de anunciantes, y servicios de agencias';
COMMENT ON COLUMN public.listings.type IS 'want_to_advertise = busca espacio, have_space = ofrece espacio, offer_service = agencia ofrece servicio';
COMMENT ON COLUMN public.listings.coverage_areas IS 'Áreas de cobertura: para agencias los mercados donde operan, para anunciantes las ubicaciones deseadas';

-- --------------------------------------------------------------------------
-- 3.3 listing_views — Rastreo de vistas únicas por IP
-- Permite contar vistas sin duplicar por visitante
-- --------------------------------------------------------------------------
CREATE TABLE public.listing_views (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id  UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  viewer_id   UUID REFERENCES public.profiles(id) ON DELETE SET NULL,  -- NULL para visitantes anónimos
  viewer_ip   TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),

  -- Evitar conteo duplicado: máximo una vista por IP por listing
  UNIQUE (listing_id, viewer_ip)
);

COMMENT ON TABLE public.listing_views IS 'Rastreo de vistas únicas por listing — una vista por IP para evitar duplicados';

-- --------------------------------------------------------------------------
-- 3.4 listing_contacts — Rastreo de clics en botones de contacto
-- Cada clic en WhatsApp o email se registra aquí
-- --------------------------------------------------------------------------
CREATE TABLE public.listing_contacts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id      UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  contact_method  TEXT NOT NULL
                    CHECK (contact_method IN ('whatsapp', 'email')),
  contactor_ip    TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.listing_contacts IS 'Rastreo de clics en contacto (WhatsApp/email) — stats básicas para dueños de listings';

-- --------------------------------------------------------------------------
-- 3.5 favorites — Listings guardados por los usuarios
-- --------------------------------------------------------------------------
CREATE TABLE public.favorites (
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  listing_id  UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),

  PRIMARY KEY (user_id, listing_id)
);

COMMENT ON TABLE public.favorites IS 'Listings guardados/favoritos por cada usuario';

-- ============================================================================
-- 4. TRIGGERS DE updated_at
-- Se disparan en cada UPDATE para mantener el campo actualizado
-- ============================================================================

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_listings_updated_at
  BEFORE UPDATE ON public.listings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- 5. TRIGGER DE AUTO-CREACIÓN DE PERFIL
-- Cuando un usuario se registra en auth, se crea automáticamente su perfil
-- ============================================================================

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 6. ÍNDICES
-- Optimizan las consultas más frecuentes del marketplace
-- ============================================================================

-- Profiles
CREATE INDEX idx_profiles_type ON public.profiles(type);
CREATE INDEX idx_profiles_city ON public.profiles(city);
CREATE INDEX idx_profiles_country ON public.profiles(country);
CREATE INDEX idx_profiles_plan ON public.profiles(plan);

-- Listings — índices principales para búsqueda y filtrado
CREATE INDEX idx_listings_user_id ON public.listings(user_id);
CREATE INDEX idx_listings_type ON public.listings(type);
CREATE INDEX idx_listings_status ON public.listings(status);
CREATE INDEX idx_listings_space_type ON public.listings(space_type);
CREATE INDEX idx_listings_space_medium ON public.listings(space_medium);
CREATE INDEX idx_listings_location_city ON public.listings(location_city);
CREATE INDEX idx_listings_location_state ON public.listings(location_state);
CREATE INDEX idx_listings_location_country ON public.listings(location_country);
CREATE INDEX idx_listings_is_featured ON public.listings(is_featured);
CREATE INDEX idx_listings_created_at ON public.listings(created_at DESC);

-- Índice compuesto para la consulta más común: listings activos ordenados por fecha
CREATE INDEX idx_listings_active_recent ON public.listings(status, created_at DESC)
  WHERE status = 'active';

-- Índice compuesto para filtrado por tipo + ciudad (búsqueda típica)
CREATE INDEX idx_listings_type_city ON public.listings(type, location_city)
  WHERE status = 'active';

-- Listing views
CREATE INDEX idx_listing_views_listing_id ON public.listing_views(listing_id);
CREATE INDEX idx_listing_views_viewer_id ON public.listing_views(viewer_id);

-- Listing contacts
CREATE INDEX idx_listing_contacts_listing_id ON public.listing_contacts(listing_id);

-- Favorites
CREATE INDEX idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX idx_favorites_listing_id ON public.favorites(listing_id);

-- ============================================================================
-- 7. ROW LEVEL SECURITY (RLS)
-- Políticas de seguridad a nivel de fila — CRÍTICO para proteger los datos
-- ============================================================================

-- Habilitamos RLS en TODAS las tablas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------------------------
-- 7.1 Políticas de profiles
-- Lectura pública, escritura solo del propietario
-- --------------------------------------------------------------------------

-- Cualquier usuario (autenticado o no) puede ver perfiles públicos
CREATE POLICY "Perfiles visibles para todos"
  ON public.profiles
  FOR SELECT
  USING (true);

-- Solo el usuario puede actualizar su propio perfil
CREATE POLICY "Usuarios actualizan su propio perfil"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- La inserción se maneja vía trigger (handle_new_user), pero permitimos por si acaso
CREATE POLICY "Usuarios crean su propio perfil"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- --------------------------------------------------------------------------
-- 7.2 Políticas de listings
-- Lectura pública de activos, CRUD solo del propietario
-- --------------------------------------------------------------------------

-- Cualquiera puede ver listings activos
CREATE POLICY "Listings activos visibles para todos"
  ON public.listings
  FOR SELECT
  USING (status = 'active' OR user_id = auth.uid());

-- Solo el dueño puede crear listings
CREATE POLICY "Usuarios crean sus propios listings"
  ON public.listings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Solo el dueño puede actualizar sus listings
CREATE POLICY "Usuarios actualizan sus propios listings"
  ON public.listings
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Solo el dueño puede eliminar sus listings
CREATE POLICY "Usuarios eliminan sus propios listings"
  ON public.listings
  FOR DELETE
  USING (auth.uid() = user_id);

-- --------------------------------------------------------------------------
-- 7.3 Políticas de listing_views
-- Cualquiera puede insertar (registrar vista), solo el dueño del listing lee
-- --------------------------------------------------------------------------

-- Cualquiera puede registrar una vista (incluso anónimos vía función edge)
CREATE POLICY "Cualquiera puede registrar vista"
  ON public.listing_views
  FOR INSERT
  WITH CHECK (true);

-- Solo el dueño del listing puede ver las estadísticas de vistas
CREATE POLICY "Dueño del listing ve sus vistas"
  ON public.listing_views
  FOR SELECT
  USING (
    listing_id IN (
      SELECT id FROM public.listings WHERE user_id = auth.uid()
    )
  );

-- --------------------------------------------------------------------------
-- 7.4 Políticas de listing_contacts
-- Cualquiera puede insertar (registrar clic en contacto), solo el dueño lee
-- --------------------------------------------------------------------------

-- Cualquiera puede registrar un clic en contacto
CREATE POLICY "Cualquiera puede registrar contacto"
  ON public.listing_contacts
  FOR INSERT
  WITH CHECK (true);

-- Solo el dueño del listing puede ver sus estadísticas de contacto
CREATE POLICY "Dueño del listing ve sus contactos"
  ON public.listing_contacts
  FOR SELECT
  USING (
    listing_id IN (
      SELECT id FROM public.listings WHERE user_id = auth.uid()
    )
  );

-- --------------------------------------------------------------------------
-- 7.5 Políticas de favorites
-- CRUD exclusivo del usuario autenticado sobre sus propios favoritos
-- --------------------------------------------------------------------------

-- Usuarios ven solo sus propios favoritos
CREATE POLICY "Usuarios ven sus favoritos"
  ON public.favorites
  FOR SELECT
  USING (auth.uid() = user_id);

-- Usuarios agregan a sus propios favoritos
CREATE POLICY "Usuarios agregan favoritos"
  ON public.favorites
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Usuarios eliminan solo sus propios favoritos
CREATE POLICY "Usuarios eliminan sus favoritos"
  ON public.favorites
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- 8. STORAGE — Bucket para imágenes de listings
-- ============================================================================

-- Crear bucket público para imágenes de listings
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'listing-images',
  'listing-images',
  true,                                          -- Acceso público de lectura
  5242880,                                       -- Límite de 5MB por archivo
  ARRAY['image/jpeg', 'image/png', 'image/webp'] -- Solo imágenes
);

-- Política: cualquiera puede ver imágenes (bucket público)
CREATE POLICY "Imágenes de listings visibles para todos"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'listing-images');

-- Política: usuarios autenticados pueden subir imágenes a su propia carpeta
-- La estructura esperada es: listing-images/{user_id}/{filename}
CREATE POLICY "Usuarios suben imágenes a su carpeta"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'listing-images'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Política: usuarios pueden actualizar sus propias imágenes
CREATE POLICY "Usuarios actualizan sus propias imágenes"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'listing-images'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Política: usuarios pueden eliminar sus propias imágenes
CREATE POLICY "Usuarios eliminan sus propias imágenes"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'listing-images'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- ============================================================================
-- FIN DE LA MIGRACIÓN INICIAL
-- ============================================================================
