-- Table pour sauvegarder les propositions de sites web générées par l'IA
CREATE TABLE public.website_proposals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT, -- Pour les utilisateurs non connectés
  form_data JSONB NOT NULL,
  proposal JSONB NOT NULL,
  is_express BOOLEAN DEFAULT false,
  price_eur INTEGER,
  price_mad INTEGER,
  status TEXT DEFAULT 'generated' CHECK (status IN ('generated', 'contacted', 'ordered', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index pour recherche rapide
CREATE INDEX idx_website_proposals_user_id ON public.website_proposals(user_id);
CREATE INDEX idx_website_proposals_session_id ON public.website_proposals(session_id);
CREATE INDEX idx_website_proposals_created_at ON public.website_proposals(created_at DESC);

-- Enable RLS
ALTER TABLE public.website_proposals ENABLE ROW LEVEL SECURITY;

-- Politique: les utilisateurs peuvent voir leurs propres propositions
CREATE POLICY "Users can view their own proposals" 
ON public.website_proposals 
FOR SELECT 
USING (
  auth.uid() = user_id 
  OR session_id = current_setting('request.headers', true)::json->>'x-session-id'
);

-- Politique: tout le monde peut insérer (avec ou sans connexion)
CREATE POLICY "Anyone can create proposals" 
ON public.website_proposals 
FOR INSERT 
WITH CHECK (true);

-- Politique: les utilisateurs peuvent mettre à jour leurs propres propositions
CREATE POLICY "Users can update their own proposals" 
ON public.website_proposals 
FOR UPDATE 
USING (
  auth.uid() = user_id 
  OR session_id = current_setting('request.headers', true)::json->>'x-session-id'
);

-- Trigger pour updated_at
CREATE TRIGGER update_website_proposals_updated_at
BEFORE UPDATE ON public.website_proposals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();