-- Fix: Require authentication for lead insertion to prevent spam/abuse
-- Drop the existing permissive policy
DROP POLICY IF EXISTS "Anyone can create leads" ON public.leads;

-- Create a new policy that requires authentication for lead creation
CREATE POLICY "Authenticated users can create leads" 
ON public.leads 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Keep card owner policies unchanged as they're already secure