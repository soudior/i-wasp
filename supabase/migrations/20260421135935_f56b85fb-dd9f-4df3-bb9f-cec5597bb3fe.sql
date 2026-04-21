-- Table de configuration Wi-Fi par propriété
CREATE TABLE public.wifi_configs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  brand_name TEXT NOT NULL,
  suite_name TEXT,
  subtitle TEXT NOT NULL DEFAULT 'Appartement Officiel – Accès Wi-Fi Privé',
  footer_text TEXT NOT NULL DEFAULT 'Merci de votre séjour',
  footer_tagline TEXT NOT NULL DEFAULT 'Résidences de Luxe',
  whatsapp_number TEXT,
  networks JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.wifi_configs ENABLE ROW LEVEL SECURITY;

-- Lecture publique (les pages /wifi/:slug sont publiques)
CREATE POLICY "Anyone can view wifi configs"
ON public.wifi_configs FOR SELECT
USING (true);

-- Seuls les admins peuvent créer / modifier / supprimer
CREATE POLICY "Admins can insert wifi configs"
ON public.wifi_configs FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update wifi configs"
ON public.wifi_configs FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete wifi configs"
ON public.wifi_configs FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger updated_at
CREATE TRIGGER update_wifi_configs_updated_at
BEFORE UPDATE ON public.wifi_configs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Realtime
ALTER TABLE public.wifi_configs REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.wifi_configs;

-- Seed avec les valeurs actuelles du fichier statique
INSERT INTO public.wifi_configs (slug, brand_name, suite_name, subtitle, footer_text, footer_tagline, whatsapp_number, networks) VALUES
('nour-prestige', 'Nour Prestige', NULL, 'Appartement Officiel – Accès Wi-Fi Privé', 'Merci de séjourner chez Nour Prestige', 'Résidences de Luxe', '+212600000000',
 '[{"ssid":"HUAWEI-5G-DxH5","password":"NR3ea9N3","security":"WPA","label":"Connexion Wi-Fi 5G","recommended":true,"description":"Recommandé – Vitesse maximale"},{"ssid":"HUAWEI-2.4G-DxH5","password":"NR3ea9N3","security":"WPA","label":"Connexion Wi-Fi 2.4G","recommended":false,"description":"Compatible tous appareils"}]'::jsonb),
('abiir-2', 'Abiir', 'Suite 2', 'Appartement Officiel – Accès Wi-Fi Privé', 'Merci de séjourner chez Abiir', 'Résidences de Luxe', '+212600000000',
 '[{"ssid":"Souhail","password":"Paname75@","security":"WPA","label":"Connexion Wi-Fi","recommended":true,"description":"Réseau principal"}]'::jsonb),
('nour-prestige-legacy', 'Nour Prestige', NULL, 'Appartement Officiel – Accès Wi-Fi Privé', 'Merci de séjourner chez Nour Prestige', 'Résidences de Luxe', '+212600000000',
 '[{"ssid":"maison","password":"wifi_salon","security":"WPA","label":"Connexion Wi-Fi","recommended":true,"description":"Réseau principal"}]'::jsonb);