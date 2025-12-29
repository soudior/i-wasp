-- Enable DELETE on leads for card owners (RGPD compliance)
CREATE POLICY "Card owners can delete leads" 
ON public.leads 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM digital_cards 
  WHERE digital_cards.id = leads.card_id 
  AND digital_cards.user_id = auth.uid()
));

-- Enable UPDATE on leads for card owners (status changes)
CREATE POLICY "Card owners can update leads" 
ON public.leads 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM digital_cards 
  WHERE digital_cards.id = leads.card_id 
  AND digital_cards.user_id = auth.uid()
));