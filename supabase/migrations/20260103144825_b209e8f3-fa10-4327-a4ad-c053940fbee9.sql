-- Table for template assignments
-- Allows admins to assign private/client templates to specific users

CREATE TABLE public.template_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id TEXT NOT NULL,
  assigned_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_locked BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, template_id)
);

-- Enable RLS
ALTER TABLE public.template_assignments ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Admins can view all assignments
CREATE POLICY "Admins can view all template assignments"
ON public.template_assignments
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Admins can create assignments
CREATE POLICY "Admins can create template assignments"
ON public.template_assignments
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Admins can update assignments
CREATE POLICY "Admins can update template assignments"
ON public.template_assignments
FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

-- Admins can delete assignments
CREATE POLICY "Admins can delete template assignments"
ON public.template_assignments
FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- Users can view their own assignments
CREATE POLICY "Users can view their own template assignments"
ON public.template_assignments
FOR SELECT
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_template_assignments_updated_at
BEFORE UPDATE ON public.template_assignments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Index for faster lookups
CREATE INDEX idx_template_assignments_user_id ON public.template_assignments(user_id);
CREATE INDEX idx_template_assignments_template_id ON public.template_assignments(template_id);