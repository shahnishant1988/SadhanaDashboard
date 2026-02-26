-- Run this in Supabase Dashboard → SQL Editor to create the shared table.
-- Then enable Row Level Security (RLS) so anyone can read/add/delete entries.

CREATE TABLE IF NOT EXISTS public.entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity TEXT NOT NULL CHECK (activity IN ('satsang', 'sadhana')),
  hours NUMERIC NOT NULL CHECK (hours >= 0 AND hours <= 24),
  date DATE NOT NULL,
  note TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Allow anonymous read/write for the public dashboard (no auth).
ALTER TABLE public.entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON public.entries
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert" ON public.entries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public delete" ON public.entries
  FOR DELETE USING (true);

-- Optional: add an index for listing by date
CREATE INDEX IF NOT EXISTS entries_created_at_idx ON public.entries (created_at DESC);
