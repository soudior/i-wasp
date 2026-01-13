-- ============================================
-- FIX OVERLY PERMISSIVE RLS POLICIES
-- ============================================

-- 1. ALLIANCE_CHAT: Restrict reading to authenticated users only
DROP POLICY IF EXISTS "Anyone can read alliance chat" ON public.alliance_chat;
CREATE POLICY "Authenticated users can read alliance chat"
ON public.alliance_chat
FOR SELECT
TO authenticated
USING (true);

-- 2. CONTACT_REQUESTS: Remove duplicate INSERT policies, keep one with basic validation
DROP POLICY IF EXISTS "Anyone can create contact requests" ON public.contact_requests;
DROP POLICY IF EXISTS "Anyone can submit contact requests" ON public.contact_requests;
CREATE POLICY "Anyone can submit contact requests"
ON public.contact_requests
FOR INSERT
WITH CHECK (
  -- Basic validation: email and name are required
  email IS NOT NULL AND 
  email != '' AND 
  name IS NOT NULL AND 
  name != ''
);

-- 3. PUSH_SUBSCRIPTIONS: Restrict to valid active cards only
DROP POLICY IF EXISTS "Anyone can subscribe to card notifications" ON public.push_subscriptions;
CREATE POLICY "Anyone can subscribe to active card notifications"
ON public.push_subscriptions
FOR INSERT
WITH CHECK (
  -- Only allow subscriptions to active cards
  EXISTS (
    SELECT 1 FROM digital_cards
    WHERE digital_cards.id = push_subscriptions.card_id
    AND digital_cards.is_active = true
  )
);

-- 4. LEADS_PARTENAIRES: Add basic validation for partner applications
DROP POLICY IF EXISTS "Anyone can submit partner applications" ON public.leads_partenaires;
CREATE POLICY "Anyone can submit partner applications with validation"
ON public.leads_partenaires
FOR INSERT
WITH CHECK (
  -- Basic validation: required fields
  salon_name IS NOT NULL AND 
  salon_name != '' AND
  whatsapp IS NOT NULL AND 
  whatsapp != '' AND
  city IS NOT NULL AND 
  city != ''
);

-- 5. STORY_ANALYTICS: Restrict to valid stories only
DROP POLICY IF EXISTS "Anyone can insert story analytics" ON public.story_analytics;
CREATE POLICY "Anyone can insert analytics for valid stories"
ON public.story_analytics
FOR INSERT
WITH CHECK (
  -- Only allow analytics for existing active stories
  EXISTS (
    SELECT 1 FROM card_stories
    WHERE card_stories.id = story_analytics.story_id
    AND card_stories.is_active = true
    AND card_stories.expires_at > now()
  )
);