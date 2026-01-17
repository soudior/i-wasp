-- Table pour les rappels clients
CREATE TABLE public.client_reminders (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id TEXT NOT NULL,
    client_type TEXT NOT NULL CHECK (client_type IN ('card', 'lead', 'order', 'website')),
    tag_id UUID REFERENCES public.client_tags(id) ON DELETE SET NULL,
    reminder_type TEXT NOT NULL DEFAULT 'follow_up',
    title TEXT NOT NULL,
    description TEXT,
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled', 'overdue')),
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.client_reminders ENABLE ROW LEVEL SECURITY;

-- Policies pour les admins
CREATE POLICY "Admins can view all client reminders"
ON public.client_reminders
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_roles.user_id = auth.uid()
        AND user_roles.role = 'admin'
    )
);

CREATE POLICY "Admins can create client reminders"
ON public.client_reminders
FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_roles.user_id = auth.uid()
        AND user_roles.role = 'admin'
    )
);

CREATE POLICY "Admins can update client reminders"
ON public.client_reminders
FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_roles.user_id = auth.uid()
        AND user_roles.role = 'admin'
    )
);

CREATE POLICY "Admins can delete client reminders"
ON public.client_reminders
FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_roles.user_id = auth.uid()
        AND user_roles.role = 'admin'
    )
);

-- Trigger pour updated_at
CREATE TRIGGER update_client_reminders_updated_at
    BEFORE UPDATE ON public.client_reminders
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Configuration des rappels automatiques par tag
CREATE TABLE public.tag_reminder_rules (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    tag_id UUID NOT NULL REFERENCES public.client_tags(id) ON DELETE CASCADE,
    days_after_assignment INTEGER NOT NULL DEFAULT 7,
    reminder_title TEXT NOT NULL,
    reminder_description TEXT,
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tag_reminder_rules ENABLE ROW LEVEL SECURITY;

-- Policies pour les admins
CREATE POLICY "Admins can view all tag reminder rules"
ON public.tag_reminder_rules
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_roles.user_id = auth.uid()
        AND user_roles.role = 'admin'
    )
);

CREATE POLICY "Admins can create tag reminder rules"
ON public.tag_reminder_rules
FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_roles.user_id = auth.uid()
        AND user_roles.role = 'admin'
    )
);

CREATE POLICY "Admins can update tag reminder rules"
ON public.tag_reminder_rules
FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_roles.user_id = auth.uid()
        AND user_roles.role = 'admin'
    )
);

CREATE POLICY "Admins can delete tag reminder rules"
ON public.tag_reminder_rules
FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_roles.user_id = auth.uid()
        AND user_roles.role = 'admin'
    )
);

-- Trigger pour updated_at
CREATE TRIGGER update_tag_reminder_rules_updated_at
    BEFORE UPDATE ON public.tag_reminder_rules
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Insérer des règles par défaut pour les tags existants
INSERT INTO public.tag_reminder_rules (tag_id, days_after_assignment, reminder_title, reminder_description, priority)
SELECT 
    id,
    CASE name
        WHEN 'À relancer' THEN 3
        WHEN 'Prospect' THEN 7
        WHEN 'VIP' THEN 14
        ELSE 30
    END,
    CASE name
        WHEN 'À relancer' THEN 'Relancer le client'
        WHEN 'Prospect' THEN 'Suivre le prospect'
        WHEN 'VIP' THEN 'Contacter le client VIP'
        ELSE 'Suivi client'
    END,
    CASE name
        WHEN 'À relancer' THEN 'Ce client nécessite une relance commerciale'
        WHEN 'Prospect' THEN 'Vérifier l''avancement avec ce prospect'
        WHEN 'VIP' THEN 'Maintenir la relation avec ce client important'
        ELSE 'Effectuer un suivi de routine'
    END,
    CASE name
        WHEN 'À relancer' THEN 'high'
        WHEN 'VIP' THEN 'high'
        WHEN 'Prospect' THEN 'medium'
        ELSE 'low'
    END
FROM public.client_tags
WHERE name IN ('À relancer', 'Prospect', 'VIP');