-- Create contact_requests table for enterprise quotes and custom orders
CREATE TABLE public.contact_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Contact info
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  
  -- Request details
  request_type TEXT NOT NULL DEFAULT 'quote', -- 'quote', 'custom', 'partnership', 'other'
  quantity INTEGER,
  message TEXT NOT NULL,
  
  -- Status tracking
  status TEXT NOT NULL DEFAULT 'new', -- 'new', 'contacted', 'in_progress', 'completed', 'cancelled'
  admin_notes TEXT,
  responded_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a contact request (public form)
CREATE POLICY "Anyone can submit contact requests"
  ON public.contact_requests
  FOR INSERT
  WITH CHECK (true);

-- Only admins can view contact requests
CREATE POLICY "Admins can view contact requests"
  ON public.contact_requests
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can update contact requests
CREATE POLICY "Admins can update contact requests"
  ON public.contact_requests
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- Add index for faster queries
CREATE INDEX idx_contact_requests_status ON public.contact_requests(status);
CREATE INDEX idx_contact_requests_created_at ON public.contact_requests(created_at DESC);