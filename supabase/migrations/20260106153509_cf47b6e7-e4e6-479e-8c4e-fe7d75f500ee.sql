-- Create alliance_chat table for VIP encrypted messaging
CREATE TABLE public.alliance_chat (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.alliance_chat ENABLE ROW LEVEL SECURITY;

-- Anyone can read messages (public chat)
CREATE POLICY "Anyone can read alliance chat"
  ON public.alliance_chat
  FOR SELECT
  USING (true);

-- Authenticated users can post messages
CREATE POLICY "Authenticated users can post messages"
  ON public.alliance_chat
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Create legacy_flags table for the world map
CREATE TABLE public.legacy_flags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT DEFAULT 'Monde',
  x_position NUMERIC NOT NULL,
  y_position NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.legacy_flags ENABLE ROW LEVEL SECURITY;

-- Anyone can read flags (public map)
CREATE POLICY "Anyone can read legacy flags"
  ON public.legacy_flags
  FOR SELECT
  USING (true);

-- Authenticated users can plant their flag
CREATE POLICY "Authenticated users can plant flags"
  ON public.legacy_flags
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Users can only delete their own flags
CREATE POLICY "Users can delete own flags"
  ON public.legacy_flags
  FOR DELETE
  USING (auth.uid() = user_id);

-- Enable realtime for both tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.alliance_chat;
ALTER PUBLICATION supabase_realtime ADD TABLE public.legacy_flags;