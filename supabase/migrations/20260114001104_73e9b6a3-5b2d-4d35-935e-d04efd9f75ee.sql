-- Add notes and tracking columns to website_proposals
ALTER TABLE public.website_proposals 
ADD COLUMN IF NOT EXISTS admin_notes text,
ADD COLUMN IF NOT EXISTS status_history jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS assigned_to text,
ADD COLUMN IF NOT EXISTS priority text DEFAULT 'normal',
ADD COLUMN IF NOT EXISTS deadline timestamp with time zone;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_website_proposals_status ON public.website_proposals(status);
CREATE INDEX IF NOT EXISTS idx_website_proposals_priority ON public.website_proposals(priority);