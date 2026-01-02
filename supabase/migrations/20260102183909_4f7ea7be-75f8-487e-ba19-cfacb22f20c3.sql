-- Add iCal URL fields to rental_properties
ALTER TABLE public.rental_properties 
ADD COLUMN IF NOT EXISTS airbnb_ical_url TEXT,
ADD COLUMN IF NOT EXISTS booking_ical_url TEXT;