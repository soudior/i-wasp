-- =============================================
-- FIX RLS VULNERABILITIES: digital_cards & leads
-- Convert RESTRICTIVE policies to PERMISSIVE
-- =============================================

-- 1. Drop existing RESTRICTIVE policies on digital_cards
DROP POLICY IF EXISTS "Users can view their own cards" ON public.digital_cards;
DROP POLICY IF EXISTS "Users can create their own cards" ON public.digital_cards;
DROP POLICY IF EXISTS "Users can update their own cards" ON public.digital_cards;
DROP POLICY IF EXISTS "Users can delete their own cards" ON public.digital_cards;
DROP POLICY IF EXISTS "Admins can view all cards" ON public.digital_cards;
DROP POLICY IF EXISTS "Admins can insert any card" ON public.digital_cards;
DROP POLICY IF EXISTS "Admins can update any card" ON public.digital_cards;
DROP POLICY IF EXISTS "Admins can delete any card" ON public.digital_cards;

-- 2. Recreate PERMISSIVE policies for digital_cards (authenticated access only)
CREATE POLICY "Users can view their own cards"
ON public.digital_cards
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own cards"
ON public.digital_cards
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cards"
ON public.digital_cards
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cards"
ON public.digital_cards
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all cards"
ON public.digital_cards
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert any card"
ON public.digital_cards
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update any card"
ON public.digital_cards
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete any card"
ON public.digital_cards
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 3. Drop existing RESTRICTIVE policies on leads
DROP POLICY IF EXISTS "Card owners can view leads" ON public.leads;
DROP POLICY IF EXISTS "Card owners can delete leads" ON public.leads;
DROP POLICY IF EXISTS "Card owners can update leads" ON public.leads;
DROP POLICY IF EXISTS "Authenticated users can create leads" ON public.leads;

-- 4. Recreate PERMISSIVE policies for leads (authenticated access only)
CREATE POLICY "Card owners can view leads"
ON public.leads
FOR SELECT
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.digital_cards
  WHERE digital_cards.id = leads.card_id
  AND digital_cards.user_id = auth.uid()
));

CREATE POLICY "Card owners can update leads"
ON public.leads
FOR UPDATE
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.digital_cards
  WHERE digital_cards.id = leads.card_id
  AND digital_cards.user_id = auth.uid()
));

CREATE POLICY "Card owners can delete leads"
ON public.leads
FOR DELETE
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.digital_cards
  WHERE digital_cards.id = leads.card_id
  AND digital_cards.user_id = auth.uid()
));

CREATE POLICY "Authenticated users can create leads"
ON public.leads
FOR INSERT
TO authenticated
WITH CHECK (EXISTS (
  SELECT 1 FROM public.digital_cards
  WHERE digital_cards.id = leads.card_id
));

-- 5. Verify RLS is enabled
ALTER TABLE public.digital_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- 6. Force RLS for table owners too (extra security)
ALTER TABLE public.digital_cards FORCE ROW LEVEL SECURITY;
ALTER TABLE public.leads FORCE ROW LEVEL SECURITY;