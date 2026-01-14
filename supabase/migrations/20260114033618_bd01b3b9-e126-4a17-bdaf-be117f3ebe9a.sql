-- Drop the existing check constraint
ALTER TABLE public.website_proposals 
DROP CONSTRAINT IF EXISTS website_proposals_status_check;

-- Add new check constraint with additional payment statuses
ALTER TABLE public.website_proposals 
ADD CONSTRAINT website_proposals_status_check 
CHECK (status = ANY (ARRAY[
  'generated'::text,      -- Initial state after form submission
  'pending_payment'::text, -- Awaiting payment
  'paid'::text,           -- Payment confirmed
  'contacted'::text,      -- Client contacted
  'in_production'::text,  -- Site being built
  'ordered'::text,        -- Order confirmed (legacy)
  'live'::text,           -- Site is live
  'completed'::text,      -- Project completed
  'cancelled'::text       -- Order cancelled
]));