-- Create webhook_configs table to store per-user CRM webhook settings
CREATE TABLE public.webhook_configs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL DEFAULT 'Default CRM',
  webhook_url TEXT NOT NULL,
  provider TEXT NOT NULL DEFAULT 'zapier', -- zapier, make, hubspot, notion, n8n, custom
  enabled BOOLEAN NOT NULL DEFAULT true,
  sync_consented_only BOOLEAN NOT NULL DEFAULT true,
  retry_count INTEGER NOT NULL DEFAULT 3,
  field_mapping JSONB DEFAULT '{"name": true, "email": true, "phone": true, "company": true, "score": true, "source": true, "consent_status": true, "timestamp": true, "card_owner": true, "actions": true}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create webhook_logs table for sync status tracking
CREATE TABLE public.webhook_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  webhook_config_id UUID REFERENCES public.webhook_configs(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  user_id UUID NOT NULL,
  event_type TEXT NOT NULL, -- lead.created, lead.score_updated, test
  status TEXT NOT NULL DEFAULT 'pending', -- pending, success, failed, retrying
  attempts INTEGER NOT NULL DEFAULT 0,
  last_attempt_at TIMESTAMP WITH TIME ZONE,
  response_status INTEGER,
  error_message TEXT,
  payload JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.webhook_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for webhook_configs
CREATE POLICY "Users can view their own webhook configs" 
ON public.webhook_configs 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own webhook configs" 
ON public.webhook_configs 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own webhook configs" 
ON public.webhook_configs 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own webhook configs" 
ON public.webhook_configs 
FOR DELETE 
USING (auth.uid() = user_id);

-- RLS Policies for webhook_logs
CREATE POLICY "Users can view their own webhook logs" 
ON public.webhook_logs 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own webhook logs" 
ON public.webhook_logs 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own webhook logs" 
ON public.webhook_logs 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_webhook_configs_updated_at
BEFORE UPDATE ON public.webhook_configs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for efficient querying
CREATE INDEX idx_webhook_logs_user_id ON public.webhook_logs(user_id);
CREATE INDEX idx_webhook_logs_status ON public.webhook_logs(status);
CREATE INDEX idx_webhook_configs_user_id ON public.webhook_configs(user_id);