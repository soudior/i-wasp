-- Create table for scheduled push notifications
CREATE TABLE public.scheduled_push_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  card_id UUID NOT NULL REFERENCES public.digital_cards(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  sent_at TIMESTAMP WITH TIME ZONE,
  sent_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.scheduled_push_notifications ENABLE ROW LEVEL SECURITY;

-- Users can view their own scheduled notifications
CREATE POLICY "Users can view their own scheduled notifications"
ON public.scheduled_push_notifications
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own scheduled notifications
CREATE POLICY "Users can insert their own scheduled notifications"
ON public.scheduled_push_notifications
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own scheduled notifications
CREATE POLICY "Users can update their own scheduled notifications"
ON public.scheduled_push_notifications
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own scheduled notifications
CREATE POLICY "Users can delete their own scheduled notifications"
ON public.scheduled_push_notifications
FOR DELETE
USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_scheduled_push_status ON public.scheduled_push_notifications(status);
CREATE INDEX idx_scheduled_push_scheduled_at ON public.scheduled_push_notifications(scheduled_at);
CREATE INDEX idx_scheduled_push_user_id ON public.scheduled_push_notifications(user_id);