-- =============================================
-- FIX SECURITY VULNERABILITIES: Multiple tables
-- Ensure all policies are PERMISSIVE with TO authenticated
-- Block anonymous access explicitly
-- =============================================

-- 1. PROFILES TABLE - Ensure authenticated-only access
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- 2. CONTACT_REQUESTS TABLE - Fix SELECT restriction
DROP POLICY IF EXISTS "Anyone can submit contact requests" ON public.contact_requests;
DROP POLICY IF EXISTS "Admins can view contact requests" ON public.contact_requests;
DROP POLICY IF EXISTS "Admins can update contact requests" ON public.contact_requests;

-- Allow INSERT from anyone (intentional for contact form)
CREATE POLICY "Anyone can submit contact requests"
ON public.contact_requests
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only admins can view
CREATE POLICY "Admins can view contact requests"
ON public.contact_requests
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can update
CREATE POLICY "Admins can update contact requests"
ON public.contact_requests
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 3. LEADS_PARTENAIRES TABLE - Fix SELECT restriction  
DROP POLICY IF EXISTS "Anyone can submit partner applications" ON public.leads_partenaires;
DROP POLICY IF EXISTS "Admins can view partner leads" ON public.leads_partenaires;
DROP POLICY IF EXISTS "Admins can update partner leads" ON public.leads_partenaires;
DROP POLICY IF EXISTS "Admins can delete partner leads" ON public.leads_partenaires;

-- Allow INSERT from anyone (intentional for partner form)
CREATE POLICY "Anyone can submit partner applications"
ON public.leads_partenaires
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only admins can view
CREATE POLICY "Admins can view partner leads"
ON public.leads_partenaires
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can update
CREATE POLICY "Admins can update partner leads"
ON public.leads_partenaires
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete
CREATE POLICY "Admins can delete partner leads"
ON public.leads_partenaires
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 4. ORDERS TABLE - Fix to ensure authenticated only
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update any order" ON public.orders;
DROP POLICY IF EXISTS "Users can create their own orders" ON public.orders;

CREATE POLICY "Users can view their own orders"
ON public.orders
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders"
ON public.orders
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update any order"
ON public.orders
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can create their own orders"
ON public.orders
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 5. LEADS TABLE - Fix INSERT policy to be more restrictive
DROP POLICY IF EXISTS "Authenticated users can create leads" ON public.leads;

-- Only allow creating leads for cards you own OR allow anyone to submit leads (public form)
-- Since leads come from public card views, we need to allow anon insert but validate card exists
CREATE POLICY "Anyone can submit leads for valid cards"
ON public.leads
FOR INSERT
TO anon, authenticated
WITH CHECK (EXISTS (
  SELECT 1 FROM public.digital_cards
  WHERE digital_cards.id = leads.card_id
  AND digital_cards.is_active = true
));

-- 6. CARD_SCANS TABLE - Fix to ensure proper access
DROP POLICY IF EXISTS "Anyone can record scans" ON public.card_scans;
DROP POLICY IF EXISTS "Card owners can view scans" ON public.card_scans;

-- Allow anyone to record scans (needed for public card views)
CREATE POLICY "Anyone can record scans"
ON public.card_scans
FOR INSERT
TO anon, authenticated
WITH CHECK (EXISTS (
  SELECT 1 FROM public.digital_cards
  WHERE digital_cards.id = card_scans.card_id
  AND digital_cards.is_active = true
));

-- Only card owners can view scans
CREATE POLICY "Card owners can view scans"
ON public.card_scans
FOR SELECT
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.digital_cards
  WHERE digital_cards.id = card_scans.card_id
  AND digital_cards.user_id = auth.uid()
));

-- 7. Force RLS on all tables
ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;
ALTER TABLE public.contact_requests FORCE ROW LEVEL SECURITY;
ALTER TABLE public.leads_partenaires FORCE ROW LEVEL SECURITY;
ALTER TABLE public.orders FORCE ROW LEVEL SECURITY;
ALTER TABLE public.leads FORCE ROW LEVEL SECURITY;
ALTER TABLE public.card_scans FORCE ROW LEVEL SECURITY;