-- Permettre les opérations CRUD sur website_blog_posts via service role
-- (les edge functions utilisent le service role key)

-- Ajouter les politiques manquantes pour website_blog_posts
CREATE POLICY "Service role can manage blog posts"
ON public.website_blog_posts FOR ALL
USING (true)
WITH CHECK (true);

-- Ajouter les politiques pour website_blog_tokens
CREATE POLICY "Service role can manage blog tokens"
ON public.website_blog_tokens FOR ALL
USING (true)
WITH CHECK (true);