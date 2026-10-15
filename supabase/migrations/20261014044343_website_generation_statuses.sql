-- Draft prerequisite only: preserve existing states and add generator states.
-- Validates existing rows; unexpected values abort the transaction.
BEGIN;
ALTER TABLE public.website_proposals DROP CONSTRAINT IF EXISTS website_proposals_status_check;
ALTER TABLE public.website_proposals ADD CONSTRAINT website_proposals_status_check
CHECK (status = ANY (ARRAY[
 'generated'::text, 'pending_payment'::text, 'paid'::text, 'contacted'::text,
 'in_production'::text, 'ordered'::text, 'live'::text, 'completed'::text,
 'cancelled'::text, 'generating'::text, 'generation_failed'::text, 'site_generated'::text
]));
COMMIT;
