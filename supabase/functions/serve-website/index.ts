/**
 * Edge Function: serve-website
 * Sert les sites web générés via une URL publique
 * URL: /serve-website?slug=nom-du-site
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

serve(async (req) => {
  try {
    // Get slug from query params or path
    const url = new URL(req.url);
    let slug = url.searchParams.get("slug");
    
    // Also support path-based: /serve-website/slug-name
    if (!slug) {
      const pathMatch = url.pathname.match(/\/serve-website\/(.+)/);
      if (pathMatch) {
        slug = pathMatch[1];
      }
    }

    if (!slug) {
      return new Response(
        generateErrorPage("Site introuvable", "Aucun identifiant de site spécifié."),
        { 
          status: 400, 
          headers: { "Content-Type": "text/html; charset=utf-8" } 
        }
      );
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Missing Supabase configuration");
      return new Response(
        generateErrorPage("Erreur serveur", "Configuration manquante."),
        { 
          status: 500, 
          headers: { "Content-Type": "text/html; charset=utf-8" } 
        }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // Fetch the generated website by slug
    const { data: website, error } = await supabase
      .from("generated_websites")
      .select("id, slug, full_page_html, html_content, css_content, js_content, status")
      .eq("slug", slug)
      .eq("status", "completed")
      .single();

    if (error || !website) {
      console.log(`Website not found for slug: ${slug}`, error);
      return new Response(
        generateErrorPage("Site introuvable", `Le site "${slug}" n'existe pas ou n'est pas encore publié.`),
        { 
          status: 404, 
          headers: { "Content-Type": "text/html; charset=utf-8" } 
        }
      );
    }

    // Prefer full_page_html, otherwise construct from parts
    let htmlContent = website.full_page_html;

    if (!htmlContent && website.html_content) {
      // Construct full HTML from parts
      htmlContent = constructFullHtml(
        website.html_content,
        website.css_content || "",
        website.js_content || ""
      );
    }

    if (!htmlContent) {
      return new Response(
        generateErrorPage("Contenu indisponible", "Le contenu de ce site n'est pas disponible."),
        { 
          status: 404, 
          headers: { "Content-Type": "text/html; charset=utf-8" } 
        }
      );
    }

    // Fix escaped characters if the HTML was stored with JSON escaping
    htmlContent = unescapeHtml(htmlContent);

    // Inject IWASP branding footer
    htmlContent = injectBranding(htmlContent, slug);

    // Create response with explicit HTML content type
    const response = new Response(htmlContent, {
      status: 200,
      headers: new Headers({
        "content-type": "text/html; charset=utf-8",
        "cache-control": "public, max-age=3600",
        "x-frame-options": "SAMEORIGIN",
        "x-content-type-options": "nosniff",
      }),
    });

    return response;

  } catch (error) {
    console.error("serve-website error:", error);
    return new Response(
      generateErrorPage("Erreur serveur", "Une erreur inattendue s'est produite."),
      { 
        status: 500, 
        headers: { "Content-Type": "text/html; charset=utf-8" } 
      }
    );
  }
});

function constructFullHtml(html: string, css: string, js: string): string {
  // Check if html already has DOCTYPE
  if (html.toLowerCase().includes("<!doctype html>")) {
    // Inject CSS and JS into existing HTML
    let result = html;
    if (css && !result.includes("<style>")) {
      result = result.replace("</head>", `<style>${css}</style></head>`);
    }
    if (js && !result.includes("<script>")) {
      result = result.replace("</body>", `<script>${js}</script></body>`);
    }
    return result;
  }

  // Construct full HTML
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Site hébergé par IWASP</title>
  <style>${css}</style>
</head>
<body>
  ${html}
  <script>${js}</script>
</body>
</html>`;
}

function injectBranding(html: string, slug: string): string {
  const brandingHtml = `
<!-- IWASP Hosting Badge -->
<div id="iwasp-badge" style="
  position: fixed;
  bottom: 16px;
  right: 16px;
  background: linear-gradient(135deg, #1D1D1F 0%, #2D2D2F 100%);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
  font-size: 12px;
  font-weight: 500;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  z-index: 99999;
  display: flex;
  align-items: center;
  gap: 6px;
  text-decoration: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
" onmouseover="this.style.transform='scale(1.02)'; this.style.boxShadow='0 6px 24px rgba(0,0,0,0.2)';"
   onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 4px 20px rgba(0,0,0,0.15)';"
   onclick="window.open('https://i-wasp.com', '_blank')">
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="#007AFF" stroke-width="2"/>
    <path d="M12 6v6l4 2" stroke="#007AFF" stroke-width="2" stroke-linecap="round"/>
  </svg>
  <span>Hébergé par <strong style="color: #007AFF;">IWASP</strong></span>
</div>
<!-- End IWASP Badge -->
`;

  // Inject before closing body tag
  if (html.includes("</body>")) {
    return html.replace("</body>", `${brandingHtml}</body>`);
  }
  
  // If no body tag, append at end
  return html + brandingHtml;
}

/**
 * Unescape HTML that was stored with JSON-style escaping
 * Converts \n to newlines, \" to quotes, etc.
 */
function unescapeHtml(html: string): string {
  // Check if the HTML looks escaped (contains literal \n or \")
  if (!html.includes('\\n') && !html.includes('\\"')) {
    return html; // Already clean
  }
  
  // Unescape common JSON escape sequences
  return html
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, '\\');
}

function generateErrorPage(title: string, message: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - IWASP Sites</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #F5F5F7 0%, #E5E5EA 100%);
      font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
      color: #1D1D1F;
      padding: 20px;
    }
    .container {
      text-align: center;
      max-width: 500px;
      background: white;
      padding: 48px;
      border-radius: 24px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.08);
    }
    .icon {
      width: 80px;
      height: 80px;
      margin: 0 auto 24px;
      background: #F5F5F7;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .icon svg { width: 40px; height: 40px; color: #8E8E93; }
    h1 {
      font-size: 28px;
      font-weight: 600;
      margin-bottom: 12px;
      letter-spacing: -0.5px;
    }
    p {
      color: #8E8E93;
      font-size: 16px;
      line-height: 1.6;
      margin-bottom: 32px;
    }
    .btn {
      display: inline-block;
      background: #007AFF;
      color: white;
      padding: 14px 28px;
      border-radius: 12px;
      text-decoration: none;
      font-weight: 500;
      transition: background 0.2s ease;
    }
    .btn:hover { background: #0056CC; }
    .footer {
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid #E5E5EA;
      font-size: 14px;
      color: #8E8E93;
    }
    .footer strong { color: #007AFF; }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
      </svg>
    </div>
    <h1>${title}</h1>
    <p>${message}</p>
    <a href="https://i-wasp.com" class="btn">Retour à IWASP</a>
    <div class="footer">
      Powered by <strong>IWASP</strong>
    </div>
  </div>
</body>
</html>`;
}
