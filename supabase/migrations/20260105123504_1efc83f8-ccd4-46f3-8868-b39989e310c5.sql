-- Create story analytics table for detailed tracking
CREATE TABLE public.story_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  story_id UUID NOT NULL REFERENCES public.card_stories(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('view', 'whatsapp_click', 'email_click', 'complete_view')),
  duration_ms INTEGER, -- Time spent viewing the story in milliseconds
  device_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.story_analytics ENABLE ROW LEVEL SECURITY;

-- Public can insert analytics (anonymous tracking)
CREATE POLICY "Anyone can insert story analytics"
ON public.story_analytics
FOR INSERT
WITH CHECK (true);

-- Card owners can view their story analytics
CREATE POLICY "Card owners can view their story analytics"
ON public.story_analytics
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.card_stories cs
    JOIN public.digital_cards dc ON dc.id = cs.card_id
    WHERE cs.id = story_analytics.story_id
    AND dc.user_id = auth.uid()
  )
);

-- Create index for faster queries
CREATE INDEX idx_story_analytics_story_id ON public.story_analytics(story_id);
CREATE INDEX idx_story_analytics_created_at ON public.story_analytics(created_at);

-- Create function to get story statistics
CREATE OR REPLACE FUNCTION public.get_story_stats(p_story_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'total_views', COUNT(*) FILTER (WHERE event_type = 'view'),
    'complete_views', COUNT(*) FILTER (WHERE event_type = 'complete_view'),
    'whatsapp_clicks', COUNT(*) FILTER (WHERE event_type = 'whatsapp_click'),
    'email_clicks', COUNT(*) FILTER (WHERE event_type = 'email_click'),
    'avg_duration_ms', COALESCE(AVG(duration_ms) FILTER (WHERE duration_ms IS NOT NULL), 0)::INTEGER,
    'completion_rate', CASE 
      WHEN COUNT(*) FILTER (WHERE event_type = 'view') > 0 
      THEN ROUND((COUNT(*) FILTER (WHERE event_type = 'complete_view')::NUMERIC / COUNT(*) FILTER (WHERE event_type = 'view')::NUMERIC) * 100, 1)
      ELSE 0 
    END
  )
  INTO v_result
  FROM public.story_analytics
  WHERE story_id = p_story_id;
  
  RETURN v_result;
END;
$$;

-- Create function to track story event
CREATE OR REPLACE FUNCTION public.track_story_event(
  p_story_id UUID,
  p_event_type TEXT,
  p_duration_ms INTEGER DEFAULT NULL,
  p_device_type TEXT DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.story_analytics (story_id, event_type, duration_ms, device_type)
  VALUES (p_story_id, p_event_type, p_duration_ms, p_device_type);
  
  -- Also update view_count on card_stories for backward compatibility
  IF p_event_type = 'view' THEN
    UPDATE public.card_stories 
    SET view_count = view_count + 1 
    WHERE id = p_story_id;
  END IF;
END;
$$;