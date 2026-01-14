-- Blog system for generated websites (posts + editor tokens)

-- 1) Tokens used to access the blog editor (no auth required)
CREATE TABLE IF NOT EXISTS public.website_blog_tokens (
  proposal_id UUID NOT NULL PRIMARY KEY,
  token TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NULL
);

-- Link token to proposal (no FK to auth.users)
ALTER TABLE public.website_blog_tokens
  ADD CONSTRAINT website_blog_tokens_proposal_id_fkey
  FOREIGN KEY (proposal_id)
  REFERENCES public.website_proposals(id)
  ON DELETE CASCADE;

-- 2) Blog posts
CREATE TABLE IF NOT EXISTS public.website_blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id UUID NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  excerpt TEXT NULL,
  content TEXT NOT NULL,
  cover_image_url TEXT NULL,
  published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.website_blog_posts
  ADD CONSTRAINT website_blog_posts_proposal_id_fkey
  FOREIGN KEY (proposal_id)
  REFERENCES public.website_proposals(id)
  ON DELETE CASCADE;

-- One slug per proposal
CREATE UNIQUE INDEX IF NOT EXISTS website_blog_posts_proposal_slug_uidx
  ON public.website_blog_posts (proposal_id, slug);

CREATE INDEX IF NOT EXISTS website_blog_posts_proposal_published_idx
  ON public.website_blog_posts (proposal_id, published, created_at DESC);

-- Auto-update updated_at
DROP TRIGGER IF EXISTS trg_website_blog_posts_updated_at ON public.website_blog_posts;
CREATE TRIGGER trg_website_blog_posts_updated_at
BEFORE UPDATE ON public.website_blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Security: enable RLS
ALTER TABLE public.website_blog_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_blog_posts ENABLE ROW LEVEL SECURITY;

-- Public can read only published posts (for the generated site's blog page)
DROP POLICY IF EXISTS "Public can read published blog posts" ON public.website_blog_posts;
CREATE POLICY "Public can read published blog posts"
ON public.website_blog_posts
FOR SELECT
USING (published = true);

-- No direct access to tokens from the client
DROP POLICY IF EXISTS "No direct access to blog tokens" ON public.website_blog_tokens;
CREATE POLICY "No direct access to blog tokens"
ON public.website_blog_tokens
FOR SELECT
USING (false);