-- Block anonymous SELECT access to digital_cards table
-- Note: Public card access is handled via SECURITY DEFINER RPC functions (get_public_card, get_card_action_url)
CREATE POLICY "Block anonymous select on digital_cards"
ON public.digital_cards
FOR SELECT
TO anon
USING (false);

-- Block anonymous SELECT access to leads table
-- Note: Lead submission (INSERT) is still allowed for anonymous users via existing policy
CREATE POLICY "Block anonymous select on leads"
ON public.leads
FOR SELECT
TO anon
USING (false);