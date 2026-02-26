-- Run this if you already created the table without the name column.
ALTER TABLE public.entries
  ADD COLUMN IF NOT EXISTS name TEXT NOT NULL DEFAULT '';
