-- Add onssa_number to slaughter_batch (already exists in packaging_batch)
ALTER TABLE public.slaughter_batch
  ADD COLUMN IF NOT EXISTS onssa_number TEXT;
