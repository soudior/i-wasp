-- Table pour les logements en gestion locative
CREATE TABLE public.rental_properties (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price_per_night INTEGER NOT NULL DEFAULT 0,
    currency TEXT NOT NULL DEFAULT 'MAD',
    address TEXT,
    city TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    photos TEXT[] DEFAULT '{}',
    booking_url TEXT,
    airbnb_url TEXT,
    whatsapp_number TEXT,
    wifi_ssid TEXT,
    wifi_password TEXT,
    amenities TEXT[] DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.rental_properties ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own properties"
ON public.rental_properties FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own properties"
ON public.rental_properties FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own properties"
ON public.rental_properties FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own properties"
ON public.rental_properties FOR DELETE
USING (auth.uid() = user_id);

-- Public read for active properties (for NFC card display)
CREATE POLICY "Anyone can view active properties"
ON public.rental_properties FOR SELECT
USING (is_active = true);

-- Trigger for updated_at
CREATE TRIGGER update_rental_properties_updated_at
    BEFORE UPDATE ON public.rental_properties
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Table pour lier les cartes NFC aux logements
CREATE TABLE public.card_properties (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    card_id UUID NOT NULL REFERENCES public.digital_cards(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES public.rental_properties(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(card_id, property_id)
);

-- Enable RLS
ALTER TABLE public.card_properties ENABLE ROW LEVEL SECURITY;

-- RLS Policies for card_properties
CREATE POLICY "Card owners can manage property links"
ON public.card_properties FOR ALL
USING (EXISTS (
    SELECT 1 FROM public.digital_cards
    WHERE digital_cards.id = card_properties.card_id
    AND digital_cards.user_id = auth.uid()
));

-- Public read for card-property links
CREATE POLICY "Anyone can view card property links"
ON public.card_properties FOR SELECT
USING (true);