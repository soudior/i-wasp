-- Add internal notes field for admin use on orders
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS admin_notes TEXT;

-- Add index for faster status filtering
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);