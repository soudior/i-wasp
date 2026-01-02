-- Create stories table for professional stories (24h ephemeral content)
CREATE TABLE public.card_stories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  card_id UUID NOT NULL REFERENCES public.digital_cards(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL DEFAULT 'image' CHECK (content_type IN ('image', 'text')),
  image_url TEXT,
  text_content TEXT,
  text_background_color TEXT DEFAULT '#1D1D1F',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '24 hours'),
  view_count INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Enable RLS
ALTER TABLE public.card_stories ENABLE ROW LEVEL SECURITY;

-- Policies for card owners
CREATE POLICY "Card owners can manage their stories"
ON public.card_stories
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.digital_cards 
    WHERE digital_cards.id = card_stories.card_id 
    AND digital_cards.user_id = auth.uid()
  )
);

-- Public can view active stories
CREATE POLICY "Anyone can view active stories"
ON public.card_stories
FOR SELECT
USING (is_active = true AND expires_at > now());

-- Create storage bucket for story images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('stories', 'stories', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policy for story uploads
CREATE POLICY "Authenticated users can upload stories"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'stories');

CREATE POLICY "Anyone can view story images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'stories');

CREATE POLICY "Users can delete their own stories"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'stories' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Index for quick story lookups
CREATE INDEX idx_card_stories_card_id ON public.card_stories(card_id);
CREATE INDEX idx_card_stories_expires_at ON public.card_stories(expires_at) WHERE is_active = true;

-- Function to increment story view
CREATE OR REPLACE FUNCTION public.increment_story_view(p_story_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.card_stories 
  SET view_count = view_count + 1 
  WHERE id = p_story_id AND is_active = true AND expires_at > now();
END;
$$;