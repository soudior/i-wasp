-- Add admin policies for profiles table
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update all profiles" 
ON public.profiles 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add admin policies for push_notification_logs
CREATE POLICY "Admins can view all notification logs" 
ON public.push_notification_logs 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert notification logs" 
ON public.push_notification_logs 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Add admin policies for push_subscriptions (missing admin view)
CREATE POLICY "Admins can view all push subscriptions" 
ON public.push_subscriptions 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add admin policies for scheduled_push_notifications
CREATE POLICY "Admins can view all scheduled notifications" 
ON public.scheduled_push_notifications 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage scheduled notifications" 
ON public.scheduled_push_notifications 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add admin policies for leads (missing admin policy)
CREATE POLICY "Admins can view all leads" 
ON public.leads 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update all leads" 
ON public.leads 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete all leads" 
ON public.leads 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add admin policies for card_scans
CREATE POLICY "Admins can view all card scans" 
ON public.card_scans 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));