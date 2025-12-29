-- Ensure digital card slugs and order numbers are generated server-side

-- Digital cards: generate slug on insert
DROP TRIGGER IF EXISTS generate_unique_slug_on_digital_cards ON public.digital_cards;
CREATE TRIGGER generate_unique_slug_on_digital_cards
BEFORE INSERT ON public.digital_cards
FOR EACH ROW
EXECUTE FUNCTION public.generate_unique_slug();

-- Digital cards: maintain updated_at
DROP TRIGGER IF EXISTS update_digital_cards_updated_at ON public.digital_cards;
CREATE TRIGGER update_digital_cards_updated_at
BEFORE UPDATE ON public.digital_cards
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Orders: generate order_number on insert
DROP TRIGGER IF EXISTS generate_order_number_on_orders ON public.orders;
CREATE TRIGGER generate_order_number_on_orders
BEFORE INSERT ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.generate_order_number();

-- Orders: maintain updated_at
DROP TRIGGER IF EXISTS update_orders_updated_at ON public.orders;
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Orders: store cart items + payment method + optional customer email
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS order_items jsonb NOT NULL DEFAULT '[]'::jsonb;

ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS customer_email text;

ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS payment_method text NOT NULL DEFAULT 'cod';
