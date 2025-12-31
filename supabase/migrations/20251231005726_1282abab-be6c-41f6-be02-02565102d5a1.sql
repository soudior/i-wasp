-- Fix: Remove overly permissive authenticated policy
-- Only card owners should see their own cards directly
DROP POLICY IF EXISTS "Authenticated users can view active cards" ON public.digital_cards;

-- Users can only view their own cards (this policy already exists, but let's ensure it)
-- The "Users can view their own cards" policy with (auth.uid() = user_id) handles owner access
-- Admin policy handles admin access
-- Public access goes through get_public_card() function