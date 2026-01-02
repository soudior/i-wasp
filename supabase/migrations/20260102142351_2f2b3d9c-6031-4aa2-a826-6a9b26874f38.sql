-- Sécuriser contact_requests pour admin uniquement
DROP POLICY IF EXISTS "Admin can view all contact requests" ON public.contact_requests;
DROP POLICY IF EXISTS "Admin can update contact requests" ON public.contact_requests;
DROP POLICY IF EXISTS "Anyone can create contact requests" ON public.contact_requests;

-- Politique pour créer des demandes de contact (public)
CREATE POLICY "Anyone can create contact requests" 
ON public.contact_requests 
FOR INSERT 
WITH CHECK (true);

-- Politique pour que seuls les admins puissent voir
CREATE POLICY "Admin can view all contact requests" 
ON public.contact_requests 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

-- Politique pour que seuls les admins puissent modifier
CREATE POLICY "Admin can update contact requests" 
ON public.contact_requests 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

-- Politique pour que seuls les admins puissent supprimer
CREATE POLICY "Admin can delete contact requests" 
ON public.contact_requests 
FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));