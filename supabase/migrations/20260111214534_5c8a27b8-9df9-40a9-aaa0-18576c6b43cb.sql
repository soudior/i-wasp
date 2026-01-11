-- Create push_subscriptions table for web push notifications
CREATE TABLE public.push_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  card_id UUID NOT NULL REFERENCES public.digital_cards(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  p256dh_key TEXT NOT NULL,
  auth_key TEXT NOT NULL,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_used_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(card_id, endpoint)
);

-- Enable RLS
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to subscribe (public profiles)
CREATE POLICY "Anyone can subscribe to card notifications"
ON public.push_subscriptions
FOR INSERT
WITH CHECK (true);

-- Card owners can view their subscribers
CREATE POLICY "Card owners can view their subscribers"
ON public.push_subscriptions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.digital_cards
    WHERE digital_cards.id = push_subscriptions.card_id
    AND digital_cards.user_id = auth.uid()
  )
);

-- Card owners can manage subscribers
CREATE POLICY "Card owners can update subscribers"
ON public.push_subscriptions
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.digital_cards
    WHERE digital_cards.id = push_subscriptions.card_id
    AND digital_cards.user_id = auth.uid()
  )
);

CREATE POLICY "Card owners can delete subscribers"
ON public.push_subscriptions
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.digital_cards
    WHERE digital_cards.id = push_subscriptions.card_id
    AND digital_cards.user_id = auth.uid()
  )
);

-- Index for faster lookups
CREATE INDEX idx_push_subscriptions_card_id ON public.push_subscriptions(card_id);
CREATE INDEX idx_push_subscriptions_active ON public.push_subscriptions(is_active) WHERE is_active = true;