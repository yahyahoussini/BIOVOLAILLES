-- ============================================================
-- Migration: Schema gaps fix
-- Adds missing columns, tables, and RPCs referenced by the app
-- ============================================================

-- -----------------------------------------------------------
-- 1. Add missing columns to packaging_batch
-- -----------------------------------------------------------
ALTER TABLE public.packaging_batch
  ADD COLUMN IF NOT EXISTS scan_count  INTEGER       NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS onssa_number TEXT,
  ADD COLUMN IF NOT EXISTS expiry_date  DATE;

-- -----------------------------------------------------------
-- 2. Add missing column to flock
-- -----------------------------------------------------------
ALTER TABLE public.flock
  ADD COLUMN IF NOT EXISTS breed_photo_url TEXT;

-- -----------------------------------------------------------
-- 3. Create production_log table
--    One log entry per day per flock (e.g. vet checks, feed)
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.production_log (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  flock_id         UUID        NOT NULL REFERENCES public.flock(id) ON DELETE CASCADE,
  collection_date  DATE        NOT NULL DEFAULT CURRENT_DATE,
  feed_type        TEXT,
  vet_check_passed BOOLEAN     NOT NULL DEFAULT false,
  notes            TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.production_log ENABLE ROW LEVEL SECURITY;

-- RLS: authenticated users can read; super_admin / hatchery_tech can write
CREATE POLICY "Authenticated users can view production logs"
  ON public.production_log FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Super admin or hatchery tech can insert production log"
  ON public.production_log FOR INSERT
  WITH CHECK (
    public.has_role(auth.uid(), 'super_admin')
    OR public.has_role(auth.uid(), 'hatchery_tech')
    OR public.has_role(auth.uid(), 'cooperative_manager')
  );

CREATE POLICY "Super admin or hatchery tech can update production log"
  ON public.production_log FOR UPDATE
  USING (
    public.has_role(auth.uid(), 'super_admin')
    OR public.has_role(auth.uid(), 'hatchery_tech')
    OR public.has_role(auth.uid(), 'cooperative_manager')
  );

CREATE POLICY "Super admin can delete production log"
  ON public.production_log FOR DELETE
  USING (public.has_role(auth.uid(), 'super_admin'));

-- -----------------------------------------------------------
-- 4. Create scan_log table
--    Anonymous insert (consumers scan QR); read by auth users
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.scan_log (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_ref  TEXT        NOT NULL,
  scanned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_agent TEXT,
  ip_hint    TEXT        -- optional, can be populated by an Edge Function
);

ALTER TABLE public.scan_log ENABLE ROW LEVEL SECURITY;

-- Allow anonymous consumers to insert a scan entry
CREATE POLICY "Anyone can insert scan log"
  ON public.scan_log FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only authenticated staff can view scan logs
CREATE POLICY "Authenticated users can view scan logs"
  ON public.scan_log FOR SELECT
  TO authenticated USING (true);

-- -----------------------------------------------------------
-- 5. increment_scan_count RPC
--    Called by TraceBatch.tsx after a successful batch lookup
-- -----------------------------------------------------------
CREATE OR REPLACE FUNCTION public.increment_scan_count(batch_ref_input TEXT)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.packaging_batch
  SET scan_count = scan_count + 1
  WHERE batch_ref = batch_ref_input;
$$;

-- Grant execute to anon so QR-scanning consumers can call it
GRANT EXECUTE ON FUNCTION public.increment_scan_count(TEXT) TO anon, authenticated;
