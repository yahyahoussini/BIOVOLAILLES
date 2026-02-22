-- ============================================================
-- Fix: Allow anonymous (QR-scanning) users to read trace data
-- The /trace/:batchRef page is public — no login required
-- ============================================================

-- Allow anon to read packaging_batch (for QR trace lookup)
CREATE POLICY "Anon can view packaging batches for trace"
  ON public.packaging_batch FOR SELECT
  TO anon USING (true);

-- Allow anon to read flock (joined in the trace query)
CREATE POLICY "Anon can view flocks for trace"
  ON public.flock FOR SELECT
  TO anon USING (true);

-- Allow anon to read cooperative (joined in the trace query)
CREATE POLICY "Anon can view cooperatives for trace"
  ON public.cooperative FOR SELECT
  TO anon USING (true);

-- Allow anon to read production_log (shown on trace page)
CREATE POLICY "Anon can view production logs for trace"
  ON public.production_log FOR SELECT
  TO anon USING (true);

-- Allow anon to read slaughter_batch (for meat trace lookup)
CREATE POLICY "Anon can view slaughter batches for trace"
  ON public.slaughter_batch FOR SELECT
  TO anon USING (true);
