-- ============================================================================
-- SpotU — Migración 004: increment_contacts RPC + avatars bucket
-- ============================================================================

-- 1. RPC para incrementar el contador de contactos de una publicación
--    SECURITY DEFINER para que cualquier usuario (incluso anónimo) pueda llamarla
CREATE OR REPLACE FUNCTION public.increment_contacts(listing_id UUID)
RETURNS void AS $$
  UPDATE public.listings
  SET contacts_count = contacts_count + 1
  WHERE id = listing_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- 2. Bucket público para avatares de usuario
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  2097152, -- 2 MB por imagen
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- 3. Políticas de acceso al bucket de avatares
CREATE POLICY "Avatares visibles para todos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Usuarios suben su propio avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Usuarios actualizan su propio avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Usuarios eliminan su propio avatar"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
