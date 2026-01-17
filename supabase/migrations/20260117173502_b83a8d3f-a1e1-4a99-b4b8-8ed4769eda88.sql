-- Add serial_code column to digital_cards for activation
ALTER TABLE public.digital_cards 
ADD COLUMN IF NOT EXISTS serial_code text UNIQUE;

-- Create an index for faster lookups
CREATE INDEX IF NOT EXISTS idx_digital_cards_serial_code ON public.digital_cards(serial_code);

-- Generate default serial codes for existing cards that don't have one
UPDATE public.digital_cards 
SET serial_code = UPPER(
  SUBSTRING(REPLACE(id::text, '-', '') FROM 1 FOR 4) || '-' ||
  SUBSTRING(REPLACE(id::text, '-', '') FROM 5 FOR 4) || '-' ||
  SUBSTRING(REPLACE(id::text, '-', '') FROM 9 FOR 4)
)
WHERE serial_code IS NULL;

-- Create a function to generate serial codes for new cards
CREATE OR REPLACE FUNCTION generate_serial_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.serial_code IS NULL THEN
    NEW.serial_code := UPPER(
      SUBSTRING(REPLACE(NEW.id::text, '-', '') FROM 1 FOR 4) || '-' ||
      SUBSTRING(REPLACE(NEW.id::text, '-', '') FROM 5 FOR 4) || '-' ||
      SUBSTRING(REPLACE(NEW.id::text, '-', '') FROM 9 FOR 4)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate serial codes
DROP TRIGGER IF EXISTS trigger_generate_serial_code ON public.digital_cards;
CREATE TRIGGER trigger_generate_serial_code
  BEFORE INSERT ON public.digital_cards
  FOR EACH ROW
  EXECUTE FUNCTION generate_serial_code();

-- Create a secure function to verify activation codes (callable by edge function)
CREATE OR REPLACE FUNCTION public.verify_activation_code(p_serial_code text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_card record;
BEGIN
  -- Normalize the serial code (remove dashes, uppercase)
  SELECT * INTO v_card
  FROM digital_cards
  WHERE UPPER(REPLACE(serial_code, '-', '')) = UPPER(REPLACE(p_serial_code, '-', ''))
    AND is_active = true
  LIMIT 1;
  
  IF v_card IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Code de série non trouvé ou carte inactive'
    );
  END IF;
  
  RETURN jsonb_build_object(
    'success', true,
    'card_id', v_card.id,
    'first_name', v_card.first_name,
    'last_name', v_card.last_name,
    'full_name', UPPER(COALESCE(v_card.first_name, '') || ' ' || COALESCE(v_card.last_name, '')),
    'company', v_card.company,
    'slug', v_card.slug
  );
END;
$$;