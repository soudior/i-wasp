-- Create table for Web Studio orders
CREATE TABLE public.webstudio_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Stripe data
  stripe_session_id TEXT UNIQUE NOT NULL,
  stripe_payment_intent_id TEXT,
  stripe_customer_id TEXT,
  
  -- Customer info
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  
  -- Order details
  order_number TEXT NOT NULL UNIQUE,
  package_type TEXT NOT NULL, -- STARTER, STANDARD, PREMIUM
  currency TEXT NOT NULL DEFAULT 'MAD',
  amount_cents INTEGER NOT NULL,
  
  -- Items breakdown (JSON array of items)
  items JSONB DEFAULT '[]'::jsonb,
  
  -- Options added
  options JSONB DEFAULT '[]'::jsonb,
  
  -- Status tracking
  status TEXT NOT NULL DEFAULT 'paid',
  paid_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Linked user (if authenticated)
  user_id UUID REFERENCES auth.users(id),
  
  -- Linked proposal (if from funnel)
  proposal_id UUID REFERENCES public.website_proposals(id),
  
  -- Admin notes
  admin_notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.webstudio_orders ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can do everything
CREATE POLICY "Admins can manage all webstudio orders" 
ON public.webstudio_orders 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Policy: Users can view their own orders
CREATE POLICY "Users can view their own webstudio orders" 
ON public.webstudio_orders 
FOR SELECT 
USING (
  auth.uid() = user_id 
  OR customer_email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

-- Policy: Allow insert from service role (for webhook)
CREATE POLICY "Service role can insert webstudio orders"
ON public.webstudio_orders
FOR INSERT
WITH CHECK (true);

-- Create index for faster lookups
CREATE INDEX idx_webstudio_orders_email ON public.webstudio_orders(customer_email);
CREATE INDEX idx_webstudio_orders_stripe_session ON public.webstudio_orders(stripe_session_id);
CREATE INDEX idx_webstudio_orders_status ON public.webstudio_orders(status);

-- Trigger for updated_at
CREATE TRIGGER update_webstudio_orders_updated_at
BEFORE UPDATE ON public.webstudio_orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();