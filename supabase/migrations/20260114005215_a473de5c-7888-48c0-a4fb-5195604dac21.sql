-- Enable realtime for website_proposals table
ALTER TABLE public.website_proposals REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.website_proposals;