-- Table pour stocker les événements analytics (clics CTA, conversions, etc.)
CREATE TABLE public.analytics_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  event_name TEXT NOT NULL,
  event_value NUMERIC,
  event_metadata JSONB DEFAULT '{}',
  page_url TEXT,
  referrer TEXT,
  user_agent TEXT,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index pour les requêtes analytics
CREATE INDEX idx_analytics_events_type ON public.analytics_events(event_type);
CREATE INDEX idx_analytics_events_created_at ON public.analytics_events(created_at);
CREATE INDEX idx_analytics_events_name ON public.analytics_events(event_name);

-- Pas de RLS car on veut que les événements soient enregistrés sans auth
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Policy pour permettre INSERT sans auth (tracking public)
CREATE POLICY "Allow public event tracking"
ON public.analytics_events
FOR INSERT
WITH CHECK (true);

-- Policy pour permettre SELECT aux admins seulement
CREATE POLICY "Admins can view analytics"
ON public.analytics_events
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Fonction pour récupérer les stats du funnel express checkout
CREATE OR REPLACE FUNCTION public.get_express_checkout_funnel(p_days INTEGER DEFAULT 30)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'page_views', COUNT(*) FILTER (WHERE event_name = 'express_offre_view'),
    'offer_selections', COUNT(*) FILTER (WHERE event_name = 'express_offer_select'),
    'info_submissions', COUNT(*) FILTER (WHERE event_name = 'express_infos_submit'),
    'payment_initiations', COUNT(*) FILTER (WHERE event_name = 'express_payer_view'),
    'purchases', COUNT(*) FILTER (WHERE event_name = 'express_purchase'),
    'webstudio_clicks', COUNT(*) FILTER (WHERE event_name = 'webstudio_cta_click'),
    'webstudio_offer_views', COUNT(*) FILTER (WHERE event_name = 'webstudio_offre_view')
  )
  INTO v_result
  FROM public.analytics_events
  WHERE created_at > NOW() - (p_days || ' days')::INTERVAL;
  
  RETURN v_result;
END;
$$;

-- Fonction pour les stats journalières
CREATE OR REPLACE FUNCTION public.get_daily_analytics(p_days INTEGER DEFAULT 7)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result JSONB;
BEGIN
  SELECT jsonb_agg(daily_stats ORDER BY day DESC)
  INTO v_result
  FROM (
    SELECT 
      DATE(created_at) as day,
      COUNT(*) FILTER (WHERE event_name = 'express_offre_view') as page_views,
      COUNT(*) FILTER (WHERE event_name = 'express_purchase') as purchases,
      COUNT(*) FILTER (WHERE event_name = 'webstudio_cta_click') as webstudio_clicks,
      COALESCE(SUM(event_value) FILTER (WHERE event_name = 'express_purchase'), 0) as revenue
    FROM public.analytics_events
    WHERE created_at > NOW() - (p_days || ' days')::INTERVAL
    GROUP BY DATE(created_at)
  ) daily_stats;
  
  RETURN COALESCE(v_result, '[]'::jsonb);
END;
$$;