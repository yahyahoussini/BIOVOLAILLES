-- ============================================================
-- Add livestock support to packaging_batch
-- ============================================================

-- Add optional livestock_id FK
ALTER TABLE public.packaging_batch
  ADD COLUMN IF NOT EXISTS livestock_id UUID REFERENCES public.livestock(id) ON DELETE SET NULL;

-- Make flock_id nullable (packaging can now come from livestock OR flock)
ALTER TABLE public.packaging_batch
  ALTER COLUMN flock_id DROP NOT NULL;
