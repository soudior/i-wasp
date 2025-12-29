-- Enhance leads table with RGPD consent, scoring and metadata
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS consent_given BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS consent_timestamp TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'nfc',
ADD COLUMN IF NOT EXISTS device_type TEXT,
ADD COLUMN IF NOT EXISTS location_city TEXT,
ADD COLUMN IF NOT EXISTS location_country TEXT,
ADD COLUMN IF NOT EXISTS lead_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'new',
ADD COLUMN IF NOT EXISTS message TEXT;

-- Add comment for documentation
COMMENT ON COLUMN public.leads.lead_score IS 'Auto-calculated score: email +10, phone +15, message +10';
COMMENT ON COLUMN public.leads.consent_given IS 'RGPD explicit consent flag';
COMMENT ON COLUMN public.leads.status IS 'Lead status: new, contacted, converted, archived';