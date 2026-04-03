-- ============================================================================
-- SpotU — Migración 002: Interacciones cerradas (Closed Interactions)
--
-- Permite que la parte contratada solicite al contratante confirmar que una
-- interacción fue exitosa. El contratante puede confirmar o rechazar.
-- Esto genera un historial verificable de transacciones exitosas en el perfil.
-- ============================================================================

-- --------------------------------------------------------------------------
-- Tabla: closed_interactions
--
-- Flujo:
-- 1. Dos partes se contactan vía un listing (WhatsApp/email)
-- 2. Llegan a un acuerdo y trabajan juntos fuera de la plataforma
-- 3. La parte CONTRATADA (provider) crea una solicitud de "interacción cerrada"
-- 4. La parte CONTRATANTE (client) recibe la solicitud y puede confirmar o rechazar
-- 5. Si confirma → se suma al contador de interacciones exitosas del provider
-- 6. Ambas partes pueden dejar un comentario breve (testimonio público)
-- --------------------------------------------------------------------------

CREATE TABLE public.closed_interactions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- El listing que originó la interacción
  listing_id        UUID REFERENCES public.listings(id) ON DELETE SET NULL,

  -- Quién proveyó el servicio/espacio (solicita la confirmación)
  provider_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- Quién contrató el servicio/espacio (confirma la interacción)
  client_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- Estado del flujo
  status            TEXT NOT NULL DEFAULT 'pending'
                      CHECK (status IN ('pending', 'confirmed', 'rejected', 'expired')),

  -- Descripción breve de qué se hizo (la pone el provider al solicitar)
  description       TEXT NOT NULL,

  -- Comentario público del client al confirmar (opcional, funciona como testimonio)
  client_comment    TEXT,

  -- Monto aproximado de la transacción (opcional, para contexto)
  amount            DECIMAL,
  currency          TEXT DEFAULT 'USD',

  -- Timestamps
  requested_at      TIMESTAMPTZ DEFAULT NOW(),
  responded_at      TIMESTAMPTZ,
  expires_at        TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),

  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW(),

  -- Un provider no puede solicitar más de una interacción cerrada por el mismo listing con el mismo client
  UNIQUE (listing_id, provider_id, client_id)
);

COMMENT ON TABLE public.closed_interactions IS 'Registro de interacciones comerciales cerradas exitosamente — genera confianza en perfiles';
COMMENT ON COLUMN public.closed_interactions.provider_id IS 'Quien proveyó el servicio/espacio y solicita la confirmación';
COMMENT ON COLUMN public.closed_interactions.client_id IS 'Quien contrató y debe confirmar que la interacción fue exitosa';

-- --------------------------------------------------------------------------
-- Contador de interacciones confirmadas en el perfil
-- --------------------------------------------------------------------------

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS confirmed_interactions_count INTEGER DEFAULT 0;

COMMENT ON COLUMN public.profiles.confirmed_interactions_count IS 'Número de interacciones cerradas confirmadas — se muestra en el perfil público';

-- --------------------------------------------------------------------------
-- Trigger: auto-actualizar updated_at
-- --------------------------------------------------------------------------

CREATE TRIGGER set_closed_interactions_updated_at
  BEFORE UPDATE ON public.closed_interactions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- --------------------------------------------------------------------------
-- Función: incrementar/decrementar contador al confirmar/rechazar
-- --------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_interaction_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Si cambió a confirmed, incrementar contador del provider
  IF NEW.status = 'confirmed' AND (OLD.status IS DISTINCT FROM 'confirmed') THEN
    UPDATE public.profiles
    SET confirmed_interactions_count = confirmed_interactions_count + 1
    WHERE id = NEW.provider_id;
    NEW.responded_at = NOW();
  END IF;

  -- Si se rechaza, solo registrar la fecha de respuesta
  IF NEW.status = 'rejected' AND (OLD.status IS DISTINCT FROM 'rejected') THEN
    NEW.responded_at = NOW();
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_interaction_status_change
  BEFORE UPDATE ON public.closed_interactions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_interaction_status_change();

-- --------------------------------------------------------------------------
-- Índices
-- --------------------------------------------------------------------------

CREATE INDEX idx_closed_interactions_provider ON public.closed_interactions(provider_id);
CREATE INDEX idx_closed_interactions_client ON public.closed_interactions(client_id);
CREATE INDEX idx_closed_interactions_listing ON public.closed_interactions(listing_id);
CREATE INDEX idx_closed_interactions_status ON public.closed_interactions(status);

-- --------------------------------------------------------------------------
-- RLS
-- --------------------------------------------------------------------------

ALTER TABLE public.closed_interactions ENABLE ROW LEVEL SECURITY;

-- Cualquiera puede ver interacciones confirmadas (son públicas, generan confianza)
CREATE POLICY "Interacciones confirmadas visibles para todos"
  ON public.closed_interactions
  FOR SELECT
  USING (
    status = 'confirmed'
    OR provider_id = auth.uid()
    OR client_id = auth.uid()
  );

-- Solo el provider puede crear la solicitud
CREATE POLICY "Provider crea solicitud de interacción"
  ON public.closed_interactions
  FOR INSERT
  WITH CHECK (auth.uid() = provider_id);

-- Solo el client puede actualizar (confirmar/rechazar)
CREATE POLICY "Client responde a solicitud de interacción"
  ON public.closed_interactions
  FOR UPDATE
  USING (auth.uid() = client_id)
  WITH CHECK (auth.uid() = client_id);

-- ============================================================================
-- FIN DE LA MIGRACIÓN 002
-- ============================================================================
