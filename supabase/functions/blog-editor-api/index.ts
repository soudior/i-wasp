/**
 * Edge Function: blog-editor-api
 * API pour gérer les articles de blog des sites générés
 * Authentification par token unique (pas besoin de login)
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Configuration manquante");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const url = new URL(req.url);
    const token = url.searchParams.get("token");
    const action = url.searchParams.get("action") || "list";

    if (!token) {
      return new Response(
        JSON.stringify({ error: "Token requis" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate token and get proposal_id
    const { data: tokenData, error: tokenError } = await supabase
      .from("website_blog_tokens")
      .select("proposal_id, expires_at")
      .eq("token", token)
      .single();

    if (tokenError || !tokenData) {
      console.log("Token not found:", token);
      return new Response(
        JSON.stringify({ error: "Token invalide ou expiré" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check expiration
    if (tokenData.expires_at && new Date(tokenData.expires_at) < new Date()) {
      return new Response(
        JSON.stringify({ error: "Token expiré" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const proposalId = tokenData.proposal_id;

    // Get proposal info for context
    const { data: proposal } = await supabase
      .from("website_proposals")
      .select("form_data, proposal")
      .eq("id", proposalId)
      .single();

    const siteName = proposal?.form_data?.businessName || proposal?.proposal?.siteName || "Mon Site";

    // Handle different actions
    if (req.method === "GET") {
      if (action === "info") {
        // Get site info and blog stats
        const { data: posts, error: postsError } = await supabase
          .from("website_blog_posts")
          .select("id, title, slug, published, created_at")
          .eq("proposal_id", proposalId)
          .order("created_at", { ascending: false });

        return new Response(
          JSON.stringify({
            siteName,
            proposalId,
            posts: posts || [],
            totalPosts: posts?.length || 0,
            publishedPosts: posts?.filter(p => p.published).length || 0,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (action === "list") {
        const { data: posts, error } = await supabase
          .from("website_blog_posts")
          .select("*")
          .eq("proposal_id", proposalId)
          .order("created_at", { ascending: false });

        if (error) throw error;

        return new Response(
          JSON.stringify({ posts: posts || [], siteName }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (action === "get") {
        const postId = url.searchParams.get("postId");
        if (!postId) {
          return new Response(
            JSON.stringify({ error: "postId requis" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const { data: post, error } = await supabase
          .from("website_blog_posts")
          .select("*")
          .eq("id", postId)
          .eq("proposal_id", proposalId)
          .single();

        if (error || !post) {
          return new Response(
            JSON.stringify({ error: "Article non trouvé" }),
            { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        return new Response(
          JSON.stringify({ post }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    if (req.method === "POST") {
      const body = await req.json();

      if (action === "create") {
        const { title, content, excerpt, cover_image_url } = body;

        if (!title || !content) {
          return new Response(
            JSON.stringify({ error: "Titre et contenu requis" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Generate slug from title
        const slug = title
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
          .substring(0, 50);

        // Check if slug exists and make unique
        const { data: existing } = await supabase
          .from("website_blog_posts")
          .select("slug")
          .eq("proposal_id", proposalId)
          .like("slug", `${slug}%`);

        const uniqueSlug = existing?.length ? `${slug}-${existing.length + 1}` : slug;

        const { data: post, error } = await supabase
          .from("website_blog_posts")
          .insert({
            proposal_id: proposalId,
            title,
            slug: uniqueSlug,
            content,
            excerpt: excerpt || content.substring(0, 160),
            cover_image_url,
            published: false,
          })
          .select()
          .single();

        if (error) {
          console.error("Create error:", error);
          throw error;
        }

        return new Response(
          JSON.stringify({ success: true, post }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (action === "update") {
        const { postId, title, content, excerpt, cover_image_url, published } = body;

        if (!postId) {
          return new Response(
            JSON.stringify({ error: "postId requis" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
        if (title !== undefined) updates.title = title;
        if (content !== undefined) updates.content = content;
        if (excerpt !== undefined) updates.excerpt = excerpt;
        if (cover_image_url !== undefined) updates.cover_image_url = cover_image_url;
        if (published !== undefined) {
          updates.published = published;
          if (published) updates.published_at = new Date().toISOString();
        }

        const { data: post, error } = await supabase
          .from("website_blog_posts")
          .update(updates)
          .eq("id", postId)
          .eq("proposal_id", proposalId)
          .select()
          .single();

        if (error) {
          console.error("Update error:", error);
          throw error;
        }

        return new Response(
          JSON.stringify({ success: true, post }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (action === "delete") {
        const { postId } = body;

        if (!postId) {
          return new Response(
            JSON.stringify({ error: "postId requis" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const { error } = await supabase
          .from("website_blog_posts")
          .delete()
          .eq("id", postId)
          .eq("proposal_id", proposalId);

        if (error) {
          console.error("Delete error:", error);
          throw error;
        }

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    return new Response(
      JSON.stringify({ error: "Action non reconnue" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("blog-editor-api error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erreur serveur" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
