-- Block anonymous SELECT on contact_requests (only admins can read)
CREATE POLICY "Block anonymous select on contact_requests"
ON public.contact_requests
FOR SELECT
TO anon
USING (false);

-- Block anonymous SELECT on orders (protect shipping data)
CREATE POLICY "Block anonymous select on orders"
ON public.orders
FOR SELECT
TO anon
USING (false);

-- Block anonymous SELECT on card_scans (protect analytics data)
CREATE POLICY "Block anonymous select on card_scans"
ON public.card_scans
FOR SELECT
TO anon
USING (false);