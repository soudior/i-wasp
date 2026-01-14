-- Ajouter une policy pour que les admins puissent voir toutes les website_proposals
CREATE POLICY "Admins can view all website proposals"
  ON public.website_proposals
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Ajouter une policy pour que les admins puissent modifier les proposals
CREATE POLICY "Admins can update all website proposals"
  ON public.website_proposals
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Ajouter une policy pour que les admins puissent supprimer les proposals
CREATE POLICY "Admins can delete website proposals"
  ON public.website_proposals
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));