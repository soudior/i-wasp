-- Create table for push notification history
CREATE TABLE public.push_notification_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  card_id UUID NOT NULL REFERENCES public.digital_cards(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  sent_count INTEGER NOT NULL DEFAULT 0,
  failed_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.push_notification_logs ENABLE ROW LEVEL SECURITY;

-- Users can view their own notification logs
CREATE POLICY "Users can view their own notification logs"
ON public.push_notification_logs
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own notification logs
CREATE POLICY "Users can insert their own notification logs"
ON public.push_notification_logs
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_push_notification_logs_user_id ON public.push_notification_logs(user_id);
CREATE INDEX idx_push_notification_logs_card_id ON public.push_notification_logs(card_id);