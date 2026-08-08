-- SÉCURITÉ (P1-RLS) — Corriger l'exposition des tokens d'édition de blog.
--
-- Contexte :
--   La migration 20260114035854 verrouille website_blog_tokens avec
--   `FOR SELECT USING (false)` (« No direct access to blog tokens ») et limite
--   website_blog_posts à la lecture des articles publiés.
--   La migration 20260114042211 a ensuite ajouté, sur les deux tables, une
--   politique `FOR ALL USING (true) WITH CHECK (true)` SANS clause `TO`.
--   PostgreSQL applique donc cette politique au rôle `public` (dont `anon`), et
--   comme les politiques permissives sont combinées en OU, elle ANNULE le verrou :
--   n'importe quel client muni de la clé anon peut lire tous les tokens d'édition
--   (et lire/écrire tous les articles). Ces tokens sont la seule authentification
--   de l'edge function blog-editor-api → exposition = prise de contrôle des blogs.
--
-- Correctif :
--   Supprimer ces deux politiques permissives. Le `service_role` utilisé par les
--   edge functions CONTOURNE la RLS : il n'a jamais eu besoin de ces politiques.
--   On restaure ainsi l'intention d'origine (tokens inaccessibles au client,
--   articles publics uniquement s'ils sont publiés).

DROP POLICY IF EXISTS "Service role can manage blog tokens" ON public.website_blog_tokens;
DROP POLICY IF EXISTS "Service role can manage blog posts" ON public.website_blog_posts;

-- Garde-fous : s'assurer que la RLS reste active et que le verrou tokens existe.
ALTER TABLE public.website_blog_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "No direct access to blog tokens" ON public.website_blog_tokens;
CREATE POLICY "No direct access to blog tokens"
ON public.website_blog_tokens
FOR SELECT
USING (false);

DROP POLICY IF EXISTS "Public can read published blog posts" ON public.website_blog_posts;
CREATE POLICY "Public can read published blog posts"
ON public.website_blog_posts
FOR SELECT
USING (published = true);
