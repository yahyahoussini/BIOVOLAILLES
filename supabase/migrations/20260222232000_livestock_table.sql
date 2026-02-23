-- ============================================================
-- Migration: Livestock table for meat animals (cattle, sheep, goats)
-- Mirrors the flock table pattern but for meat farming
-- ============================================================

CREATE TABLE IF NOT EXISTS public.livestock (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  cooperative_id  UUID        NOT NULL REFERENCES public.cooperative(id) ON DELETE CASCADE,
  animal_type     TEXT        NOT NULL CHECK (animal_type IN ('bovins', 'ovins', 'caprins')),
  breed           TEXT        NOT NULL,
  quantity        INTEGER     NOT NULL DEFAULT 0,
  weight_avg_kg   NUMERIC(6,2),
  feed_type       TEXT,
  arrival_date    DATE        NOT NULL DEFAULT CURRENT_DATE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.livestock ENABLE ROW LEVEL SECURITY;

-- Read: all authenticated
CREATE POLICY "Authenticated can view livestock"
  ON public.livestock FOR SELECT TO authenticated USING (true);

-- Anon can read for trace page
CREATE POLICY "Anon can view livestock for trace"
  ON public.livestock FOR SELECT TO anon USING (true);

-- Write: super_admin, cooperative_manager
CREATE POLICY "Admin/manager can insert livestock"
  ON public.livestock FOR INSERT TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'super_admin')
    OR public.has_role(auth.uid(), 'cooperative_manager')
  );

CREATE POLICY "Admin/manager can update livestock"
  ON public.livestock FOR UPDATE TO authenticated
  USING (
    public.has_role(auth.uid(), 'super_admin')
    OR public.has_role(auth.uid(), 'cooperative_manager')
  );

CREATE POLICY "Admin/manager can delete livestock"
  ON public.livestock FOR DELETE TO authenticated
  USING (
    public.has_role(auth.uid(), 'super_admin')
    OR public.has_role(auth.uid(), 'cooperative_manager')
  );

-- Add optional livestock_id FK to slaughter_batch
ALTER TABLE public.slaughter_batch
  ADD COLUMN IF NOT EXISTS livestock_id UUID REFERENCES public.livestock(id) ON DELETE SET NULL;

-- Make flock_id nullable (slaughter can now come from livestock OR flock)
ALTER TABLE public.slaughter_batch
  ALTER COLUMN flock_id DROP NOT NULL;
