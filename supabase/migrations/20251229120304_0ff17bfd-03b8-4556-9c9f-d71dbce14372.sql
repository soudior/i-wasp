-- Create order status enum
CREATE TYPE public.order_status AS ENUM ('pending', 'paid', 'in_production', 'shipped', 'delivered');

-- Create order type enum
CREATE TYPE public.order_type AS ENUM ('standard', 'personalized');

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  order_number TEXT NOT NULL UNIQUE,
  
  -- Card configuration
  quantity INTEGER NOT NULL DEFAULT 1,
  order_type order_type NOT NULL DEFAULT 'standard',
  template TEXT NOT NULL DEFAULT 'iwasp-signature',
  card_color TEXT NOT NULL DEFAULT 'white',
  
  -- Logo & background
  logo_url TEXT,
  background_type TEXT NOT NULL DEFAULT 'solid',
  background_color TEXT DEFAULT 'white',
  background_image_url TEXT,
  
  -- Pricing (in cents for accuracy)
  unit_price_cents INTEGER NOT NULL,
  total_price_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'EUR',
  
  -- Status tracking
  status order_status NOT NULL DEFAULT 'pending',
  paid_at TIMESTAMP WITH TIME ZONE,
  production_started_at TIMESTAMP WITH TIME ZONE,
  shipped_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  
  -- Shipping info
  shipping_name TEXT,
  shipping_address TEXT,
  shipping_city TEXT,
  shipping_postal_code TEXT,
  shipping_country TEXT DEFAULT 'FR',
  tracking_number TEXT,
  
  -- Print file reference
  print_file_url TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create unique order number function
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  year_prefix TEXT;
  sequence_num INTEGER;
  new_order_number TEXT;
BEGIN
  year_prefix := TO_CHAR(NOW(), 'YYMM');
  
  SELECT COALESCE(MAX(SUBSTRING(order_number FROM 5)::INTEGER), 0) + 1
  INTO sequence_num
  FROM orders
  WHERE order_number LIKE year_prefix || '%';
  
  new_order_number := year_prefix || LPAD(sequence_num::TEXT, 4, '0');
  NEW.order_number := new_order_number;
  
  RETURN NEW;
END;
$$;

-- Create trigger for order number
CREATE TRIGGER generate_order_number_trigger
BEFORE INSERT ON public.orders
FOR EACH ROW
WHEN (NEW.order_number IS NULL)
EXECUTE FUNCTION public.generate_order_number();

-- Create trigger for updated_at
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Users can view their own orders
CREATE POLICY "Users can view their own orders"
ON public.orders
FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own orders
CREATE POLICY "Users can create their own orders"
ON public.orders
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own pending orders
CREATE POLICY "Users can update their own pending orders"
ON public.orders
FOR UPDATE
USING (auth.uid() = user_id AND status = 'pending');

-- Create index for faster lookups
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_order_number ON public.orders(order_number);