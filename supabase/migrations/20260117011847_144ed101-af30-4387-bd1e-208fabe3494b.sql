-- Create client_tags table for organizing clients
CREATE TABLE public.client_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#FFC700',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create client_notes table for notes on clients
CREATE TABLE public.client_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id TEXT NOT NULL,
  client_type TEXT NOT NULL CHECK (client_type IN ('card', 'website', 'lead', 'order')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create junction table for client-tag relationships
CREATE TABLE public.client_tag_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id TEXT NOT NULL,
  client_type TEXT NOT NULL CHECK (client_type IN ('card', 'website', 'lead', 'order')),
  tag_id UUID NOT NULL REFERENCES public.client_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(client_id, tag_id)
);

-- Enable RLS
ALTER TABLE public.client_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_tag_assignments ENABLE ROW LEVEL SECURITY;

-- RLS policies for client_tags (admins only)
CREATE POLICY "Admins can manage client tags" ON public.client_tags
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for client_notes (admins only)
CREATE POLICY "Admins can manage client notes" ON public.client_notes
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for client_tag_assignments (admins only)
CREATE POLICY "Admins can manage tag assignments" ON public.client_tag_assignments
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Create updated_at trigger for client_tags
CREATE TRIGGER update_client_tags_updated_at
  BEFORE UPDATE ON public.client_tags
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create updated_at trigger for client_notes
CREATE TRIGGER update_client_notes_updated_at
  BEFORE UPDATE ON public.client_notes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default tags
INSERT INTO public.client_tags (name, color) VALUES
  ('VIP', '#FFC700'),
  ('Prospect', '#3B82F6'),
  ('Actif', '#22C55E'),
  ('Inactif', '#6B7280'),
  ('À relancer', '#F59E0B'),
  ('Premium', '#A855F7');