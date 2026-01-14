/**
 * Edge Function: generate-website-code
 * Génère automatiquement le code HTML/CSS/JS d'un site web basé sur une proposition Web Studio
 * Utilise Lovable AI pour la génération
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

interface WebsiteProposal {
  id: string;
  form_data: {
    businessType?: string;
    businessName?: string;
    description?: string;
    style?: string;
    colors?: string;
    contactEmail?: string;
    contactPhone?: string;
    products?: string;
    websiteUrl?: string;
    socialLinks?: string;
  };
  proposal: {
    siteName?: string;
    tagline?: string;
    colorPalette?: {
      primary?: string;
      secondary?: string;
      accent?: string;
      background?: string;
      text?: string;
    };
    typography?: {
      headingFont?: string;
      bodyFont?: string;
    };
    pages?: Array<{
      name: string;
      slug: string;
      sections: Array<{
        type: string;
        title: string;
        content?: string;
        items?: string[];
      }>;
    }>;
    features?: string[];
  };
}

function generateSystemPrompt(): string {
  return `Tu es un designer web d'élite créant des sites dignes des plus grandes maisons de luxe.
Tu génères du code HTML/CSS/JS de qualité EXCEPTIONNELLE, comparable aux sites de Apple, Hermès, Aesop.

🎯 PHILOSOPHIE DESIGN ULTRA-PREMIUM:

1. MINIMALISME ABSOLU:
   - Chaque pixel compte, supprimer TOUT le superflu
   - Espace blanc généreux (80-120px padding vertical)
   - Maximum 3 couleurs: fond + texte + accent unique
   - PAS de décorations inutiles, PAS de borders, PAS de shadows lourdes

2. TYPOGRAPHIE MAJESTUEUSE:
   - Titres TRÈS grands: clamp(3rem, 8vw, 6rem) pour hero
   - Police élégante: Playfair Display, Cormorant Garamond, ou serif classique
   - Letter-spacing négatif sur gros titres: -0.04em
   - Line-height: 1.1 pour titres, 1.7 pour corps
   - Corps en sans-serif sobre: Inter, Outfit, ou system-ui

3. HERO SECTION CINÉMATIQUE (100vh):
   - Image plein écran avec overlay subtil (rgba(0,0,0,0.2) à 0.4)
   - Titre centré, blanc, impactant
   - Navigation ultra-fine en haut (position fixed, glass effect)
   - PAS de bouton CTA visible - juste le titre et l'atmosphère
   - Transition de scroll fluide vers les sections

4. NAVIGATION INVISIBLE MAIS PRÉSENTE:
   - Position: fixed, top: 0, z-index: 1000
   - Background: transparent ou rgba(255,255,255,0.8) avec backdrop-filter: blur(20px)
   - Logo minimaliste à gauche (lettre unique ou logotype fin)
   - Liens à droite, espacement généreux, font-weight: 400
   - Hauteur: 80px, pas de border, pas de shadow
   - Liens: hover avec opacity: 0.6 seulement

5. SECTIONS IMMERSIVES:
   - Chaque section = min-height: 100vh ou padding: 120px 0
   - UNE seule idée par section
   - Images de haute qualité (picsum.photos/1920/1080 pour heros)
   - Grilles asymétriques: 60/40 ou 70/30, jamais 50/50
   - Révélation au scroll avec opacity + translateY

6. PALETTE COULEURS RAFFINÉE:
   - Fond: #FAFAFA, #F5F5F7, ou blanc pur
   - Texte principal: #1D1D1F ou #0D0D0D
   - Texte secondaire: #6E6E73 ou #8E8E93
   - Accent: UNE couleur unique (doré #C9A96E, bleu #007AFF, vert #2D5A47)
   - Pas de dégradés flashy, pas de couleurs vives multiples

7. IMAGES & VISUELS:
   - Utiliser picsum.photos avec bonnes dimensions:
     - Hero: 1920x1080
     - Sections: 1200x800
     - Cards: 600x800 (portrait) ou 800x600 (paysage)
   - object-fit: cover; TOUJOURS
   - Filter léger optionnel: brightness(0.95) ou sepia(0.05)

8. ANIMATIONS SUBTILES:
   - transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1)
   - Fade-in au scroll: opacity 0→1, translateY 40px→0
   - Hover sur liens: opacity seulement
   - Hover sur images: scale(1.02) très subtil
   - PAS d'animations flashy ou saccadées

9. FOOTER ÉLÉGANT:
   - Fond légèrement différent: #F5F5F7 ou #0D0D0D
   - Disposition en colonnes clean
   - Logo, liens, réseaux sociaux, copyright
   - Padding généreux: 80px vertical

CSS MODÈLE REQUIS:
\`\`\`css
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Outfit:wght@300;400;500&display=swap');

:root {
  --color-bg: #FAFAFA;
  --color-text: #1D1D1F;
  --color-text-muted: #6E6E73;
  --color-accent: #C9A96E;
  --font-heading: 'Cormorant Garamond', Georgia, serif;
  --font-body: 'Outfit', -apple-system, sans-serif;
  --transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}

*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; font-size: 16px; }
body { 
  font-family: var(--font-body); 
  background: var(--color-bg); 
  color: var(--color-text);
  line-height: 1.7;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4 { 
  font-family: var(--font-heading); 
  font-weight: 400;
  letter-spacing: -0.03em;
  line-height: 1.1;
}

.reveal { opacity: 0; transform: translateY(40px); transition: var(--transition); }
.reveal.visible { opacity: 1; transform: translateY(0); }

.nav { 
  position: fixed; top: 0; left: 0; right: 0; 
  z-index: 1000; 
  padding: 24px 48px;
  display: flex; justify-content: space-between; align-items: center;
  background: rgba(250,250,250,0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.nav a { 
  color: var(--color-text); 
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 400;
  transition: opacity 0.3s;
}
.nav a:hover { opacity: 0.6; }

.hero {
  height: 100vh;
  display: flex; align-items: center; justify-content: center;
  position: relative;
  overflow: hidden;
}
.hero-bg {
  position: absolute; inset: 0;
  background-size: cover; background-position: center;
  filter: brightness(0.85);
}
.hero-content {
  position: relative; z-index: 1;
  text-align: center;
  color: white;
}
.hero h1 {
  font-size: clamp(3rem, 8vw, 7rem);
  font-weight: 400;
  letter-spacing: -0.04em;
  text-shadow: 0 2px 40px rgba(0,0,0,0.3);
}

section { padding: 120px 48px; }
.container { max-width: 1400px; margin: 0 auto; }

@media (max-width: 768px) {
  .nav { padding: 16px 24px; }
  section { padding: 80px 24px; }
  .hero h1 { font-size: clamp(2.5rem, 10vw, 4rem); }
}
\`\`\`

JAVASCRIPT COMPLET (OBLIGATOIRE):
\`\`\`javascript
document.addEventListener('DOMContentLoaded', function() {
  // Reveal on scroll
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });
  reveals.forEach(el => observer.observe(el));

  // Mobile menu toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
      menuToggle.classList.toggle('active');
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Close mobile menu if open
        if (mobileNav) mobileNav.classList.remove('open');
        if (menuToggle) menuToggle.classList.remove('active');
      }
    });
  });

  // Modal functionality for legal pages
  const modals = document.querySelectorAll('.modal');
  const modalTriggers = document.querySelectorAll('[data-modal]');
  const modalCloses = document.querySelectorAll('.modal-close');

  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = trigger.getAttribute('data-modal');
      const modal = document.getElementById(modalId);
      if (modal) modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  modalCloses.forEach(close => {
    close.addEventListener('click', () => {
      modals.forEach(modal => modal.classList.remove('active'));
      document.body.style.overflow = '';
    });
  });

  modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // Contact form handling
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const formData = new FormData(this);
      const data = Object.fromEntries(formData);
      
      // Show success message
      const successMsg = document.createElement('div');
      successMsg.className = 'form-success';
      successMsg.innerHTML = '<p>✓ Message envoyé avec succès!</p>';
      this.parentNode.insertBefore(successMsg, this.nextSibling);
      this.reset();
      
      setTimeout(() => successMsg.remove(), 5000);
    });
  }

  // FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        faqItems.forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    }
  });
});
\`\`\`

10. PAGES LÉGALES OBLIGATOIRES (dans des modals ou sections):
    - Politique de confidentialité (avec contenu réel adapté à l'activité)
    - Conditions générales / Mentions légales
    - FAQ (minimum 5 questions pertinentes au secteur)
    
    Ces pages doivent contenir du VRAI CONTENU pertinent, pas du lorem ipsum.
    Utiliser des modals avec la classe .modal et data-modal="nom-modal".

11. TOUS LES BOUTONS DOIVENT FONCTIONNER:
    - Boutons de navigation → smooth scroll vers sections (#section-id)
    - Boutons CTA → ouvrir formulaire contact ou modal
    - Liens footer (Politique, CGV, FAQ) → ouvrir modals correspondantes
    - Formulaire contact → feedback visuel au submit
    - Menu mobile → toggle avec animation

CSS ADDITIONNEL POUR MODALS ET FORMS:
\`\`\`css
/* Modals */
.modal {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.8);
  display: flex; align-items: center; justify-content: center;
  opacity: 0; visibility: hidden;
  transition: all 0.3s ease;
  z-index: 2000;
  padding: 24px;
}
.modal.active { opacity: 1; visibility: visible; }
.modal-content {
  background: white;
  max-width: 800px;
  max-height: 80vh;
  overflow-y: auto;
  border-radius: 16px;
  padding: 48px;
  position: relative;
}
.modal-close {
  position: absolute; top: 16px; right: 16px;
  background: none; border: none;
  font-size: 24px; cursor: pointer;
  color: var(--color-text-muted);
}

/* Forms */
.form-group { margin-bottom: 24px; }
.form-group label { display: block; margin-bottom: 8px; font-weight: 500; }
.form-group input, .form-group textarea {
  width: 100%;
  padding: 16px;
  border: 1px solid #E5E5E5;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.3s;
}
.form-group input:focus, .form-group textarea:focus {
  outline: none;
  border-color: var(--color-accent);
}
.form-success {
  background: #D4EDDA;
  color: #155724;
  padding: 16px;
  border-radius: 8px;
  margin-top: 16px;
}

/* FAQ */
.faq-item { border-bottom: 1px solid #E5E5E5; }
.faq-question {
  padding: 24px 0;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 500;
}
.faq-question::after { content: '+'; font-size: 1.5rem; }
.faq-item.open .faq-question::after { content: '−'; }
.faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}
.faq-item.open .faq-answer { max-height: 500px; padding-bottom: 24px; }

/* Mobile Menu */
.menu-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px;
}
.menu-toggle span {
  width: 24px; height: 2px;
  background: var(--color-text);
  transition: all 0.3s;
}
.menu-toggle.active span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
.menu-toggle.active span:nth-child(2) { opacity: 0; }
.menu-toggle.active span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }

@media (max-width: 768px) {
  .menu-toggle { display: flex; }
  .nav-links { 
    position: fixed;
    top: 80px; left: 0; right: 0;
    background: var(--color-bg);
    padding: 24px;
    flex-direction: column;
    gap: 24px;
    transform: translateY(-100%);
    opacity: 0;
    transition: all 0.3s;
  }
  .mobile-nav.open .nav-links,
  .nav-links.open { transform: translateY(0); opacity: 1; }
}
\`\`\`

TRÈS IMPORTANT - FORMAT DE RÉPONSE:
Réponds UNIQUEMENT avec un objet JSON valide.
Pas de texte avant ni après. Pas de markdown. Juste le JSON brut.

{
  "html": "<!DOCTYPE html>...(HTML complet avec CSS et JS inline)",
  "css": "",
  "js": "",
  "fullPage": "<!DOCTYPE html>...(copie identique du html)"
}

Mets TOUT le CSS dans une balise <style> dans le <head>.
Mets TOUT le JS dans une balise <script defer> avant </body>.
Le champ "fullPage" doit être identique à "html".

RÈGLES D'OR:
1. Le site doit ressembler à celui d'un restaurant étoilé Michelin ou d'une maison de luxe.
2. TOUS les liens et boutons DOIVENT fonctionner (pas de liens morts).
3. Le contenu textuel doit être RÉEL et pertinent (pas de lorem ipsum).
4. Les pages légales doivent contenir du vrai contenu adapté au secteur d'activité.
5. Sobre, élégant, intemporel. Moins c'est plus.`;
}

function generateUserPrompt(proposal: WebsiteProposal): string {
  const p = proposal.proposal;
  const fd = proposal.form_data;
  
  const pages = p.pages?.map(page => {
    const sectionsDesc = page.sections.map(s => 
      `    - ${s.type}: "${s.title}" ${s.items?.length ? `(${s.items.join(", ")})` : ""}`
    ).join("\n");
    return `  ${page.name} (/${page.slug}):\n${sectionsDesc}`;
  }).join("\n\n") || "Pages à définir";

  return `Génère un site web COMPLET et FONCTIONNEL pour:

📌 INFORMATIONS PRINCIPALES:
- Nom du site: ${p.siteName || fd.businessName || "Mon Site"}
- Slogan: ${p.tagline || ""}
- Type d'activité: ${fd.businessType || "Entreprise"}
- Description: ${fd.description || ""}

🎨 DESIGN:
- Style souhaité: ${fd.style || "Moderne et professionnel"}
- Couleurs: 
  - Primaire: ${p.colorPalette?.primary || "#007AFF"}
  - Secondaire: ${p.colorPalette?.secondary || "#F5F5F7"}
  - Accent: ${p.colorPalette?.accent || "#D4AF37"}
  - Background: ${p.colorPalette?.background || "#FFFFFF"}
  - Texte: ${p.colorPalette?.text || "#1D1D1F"}
- Police titres: ${p.typography?.headingFont || "Cormorant Garamond"}
- Police corps: ${p.typography?.bodyFont || "Outfit"}

📄 PAGES ET SECTIONS:
${pages}

✨ FONCTIONNALITÉS:
${p.features?.map(f => `- ${f}`).join("\n") || "- Site vitrine standard"}

📞 CONTACT:
- Email: ${fd.contactEmail || "contact@example.com"}
- Téléphone: ${fd.contactPhone || ""}
${fd.socialLinks ? `- Réseaux: ${fd.socialLinks}` : ""}

${fd.products ? `\n🛍️ PRODUITS/SERVICES:\n${fd.products}` : ""}

⚖️ PAGES LÉGALES OBLIGATOIRES (à inclure comme modals):
1. POLITIQUE DE CONFIDENTIALITÉ - Contenu réel adapté à "${fd.businessType || 'entreprise'}":
   - Responsable du traitement: ${p.siteName || fd.businessName}
   - Types de données collectées (formulaire contact, cookies)
   - Finalités du traitement
   - Durée de conservation
   - Droits des utilisateurs (RGPD)
   - Contact: ${fd.contactEmail || "contact@example.com"}

2. MENTIONS LÉGALES / CGV:
   - Raison sociale: ${p.siteName || fd.businessName}
   - Activité: ${fd.businessType || "Services"}
   - Contact: ${fd.contactEmail}, ${fd.contactPhone}
   - Hébergeur: IWASP Web Studio
   - Propriété intellectuelle
   - Limitation de responsabilité

3. FAQ (minimum 5 questions pertinentes pour "${fd.businessType || 'cette activité'}"):
   - Questions sur les services/produits
   - Tarifs et paiements
   - Délais et livraisons (si applicable)
   - Contact et support
   - Politique de retour/annulation (si applicable)

🔗 LIENS OBLIGATOIRES (tous doivent fonctionner):
- Navigation principale → sections avec smooth scroll (#id)
- Boutons CTA → formulaire contact ou action appropriée
- Footer: liens vers modals (Politique, CGV, FAQ)
- Réseaux sociaux (si fournis)
- Email: mailto:${fd.contactEmail}
- Téléphone: tel:${fd.contactPhone}

Génère le code HTML/CSS/JS complet en JSON avec TOUT le contenu réel.`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!LOVABLE_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Configuration manquante");
    }

    const { proposalId } = await req.json();

    if (!proposalId) {
      return new Response(
        JSON.stringify({ error: "proposalId requis" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // Fetch the proposal
    const { data: proposal, error: fetchError } = await admin
      .from("website_proposals")
      .select("*")
      .eq("id", proposalId)
      .single();

    if (fetchError || !proposal) {
      console.error("Proposal fetch error:", fetchError);
      return new Response(
        JSON.stringify({ error: "Proposition introuvable" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if already generating or completed
    const { data: existingWebsite } = await admin
      .from("generated_websites")
      .select("id, status")
      .eq("proposal_id", proposalId)
      .single();

    let websiteId: string;

    if (existingWebsite) {
      if (existingWebsite.status === "generating") {
        return new Response(
          JSON.stringify({ error: "Génération déjà en cours", websiteId: existingWebsite.id }),
          { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      websiteId = existingWebsite.id;
      // Update to generating status
      await admin
        .from("generated_websites")
        .update({ status: "generating", generation_log: "Démarrage de la génération...", updated_at: new Date().toISOString() })
        .eq("id", websiteId);
    } else {
      // Create new record
      const { data: newWebsite, error: insertError } = await admin
        .from("generated_websites")
        .insert({
          proposal_id: proposalId,
          status: "generating",
          generation_log: "Démarrage de la génération...",
        })
        .select("id")
        .single();

      if (insertError || !newWebsite) {
        console.error("Insert error:", insertError);
        throw new Error("Erreur lors de la création de l'enregistrement");
      }
      websiteId = newWebsite.id;
    }

    console.log(`Generating website for proposal ${proposalId}, website record: ${websiteId}`);

    // Update proposal status
    await admin
      .from("website_proposals")
      .update({ 
        status: "generating",
        updated_at: new Date().toISOString()
      })
      .eq("id", proposalId);

    // Call Lovable AI
    const systemPrompt = generateSystemPrompt();
    const userPrompt = generateUserPrompt(proposal as WebsiteProposal);

    console.log("Calling Lovable AI for website generation...");

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 16000,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI API error:", aiResponse.status, errorText);

      const errorMessage = aiResponse.status === 429 
        ? "Rate limit atteint. Réessayez dans quelques minutes."
        : aiResponse.status === 402
        ? "Crédits IA insuffisants."
        : `Erreur IA: ${aiResponse.status}`;

      await admin
        .from("generated_websites")
        .update({ 
          status: "failed", 
          generation_log: errorMessage,
          updated_at: new Date().toISOString()
        })
        .eq("id", websiteId);

      await admin
        .from("website_proposals")
        .update({ status: "generation_failed", updated_at: new Date().toISOString() })
        .eq("id", proposalId);

      return new Response(
        JSON.stringify({ error: errorMessage }),
        { status: aiResponse.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await aiResponse.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("Pas de réponse de l'IA");
    }

    // Parse the JSON response with robust extraction
    let generatedCode;
    try {
      // First, try direct JSON parse
      generatedCode = JSON.parse(content.trim());
    } catch (firstError) {
      console.log("Direct parse failed, trying extraction methods...");
      console.log("Raw content preview:", content.substring(0, 300));
      
      try {
        // Clean markdown code blocks if present
        let cleanedContent = content
          .replace(/```json\s*/gi, "")
          .replace(/```\s*/g, "")
          .trim();
        
        // Try to find JSON object in the response
        const jsonMatch = cleanedContent.match(/\{[\s\S]*"html"[\s\S]*"fullPage"[\s\S]*\}/);
        if (jsonMatch) {
          cleanedContent = jsonMatch[0];
        } else {
          // Try finding any JSON object with "html" key
          const simpleMatch = cleanedContent.match(/\{[\s\S]*"html"\s*:\s*"[\s\S]*\}/);
          if (simpleMatch) {
            cleanedContent = simpleMatch[0];
          }
        }
        
        generatedCode = JSON.parse(cleanedContent);
      } catch (secondError) {
        console.error("JSON extraction failed:", secondError);
        
        // Last resort: extract HTML directly from the response
        const htmlMatch = content.match(/<!DOCTYPE html>[\s\S]*<\/html>/i);
        if (htmlMatch) {
          console.log("Found raw HTML, using it directly");
          generatedCode = {
            html: htmlMatch[0],
            css: "",
            js: "",
            fullPage: htmlMatch[0]
          };
        } else {
          console.error("No valid HTML found in response");
          await admin
            .from("generated_websites")
            .update({ 
              status: "failed", 
              generation_log: "Erreur de parsing de la réponse IA - format invalide",
              updated_at: new Date().toISOString()
            })
            .eq("id", websiteId);

          throw new Error("Erreur lors de l'analyse du code généré");
        }
      }
    }

    // Save the generated code
    const nowIso = new Date().toISOString();
    
    // Generate a unique slug for hosting
    const businessName = proposal.form_data?.businessName || proposal.proposal?.siteName || `site-${Date.now()}`;
    const { data: slugData } = await admin.rpc("generate_website_slug", { 
      p_business_name: businessName 
    });
    const websiteSlug = slugData || `site-${websiteId.substring(0, 8)}`;
    
    // Build the public preview URL - use the React app route, not the edge function directly
    // The edge function has Content-Security-Policy restrictions that prevent proper HTML rendering
    const previewUrl = `https://i-wasp.lovable.app/s/${websiteSlug}`;
    
    await admin
      .from("generated_websites")
      .update({
        status: "completed",
        slug: websiteSlug,
        html_content: generatedCode.html || "",
        css_content: generatedCode.css || "",
        js_content: generatedCode.js || "",
        full_page_html: generatedCode.fullPage || generatedCode.html || "",
        preview_url: previewUrl,
        generation_log: "Génération terminée avec succès",
        generated_at: nowIso,
        updated_at: nowIso,
      })
      .eq("id", websiteId);

    // Update proposal status
    await admin
      .from("website_proposals")
      .update({ 
        status: "site_generated",
        updated_at: nowIso
      })
      .eq("id", proposalId);

    // Generate blog access token
    const blogToken = crypto.randomUUID();
    const { error: tokenError } = await admin
      .from("website_blog_tokens")
      .upsert({
        proposal_id: proposalId,
        token: blogToken,
        expires_at: null, // No expiration
      }, { onConflict: "proposal_id" });

    if (tokenError) {
      console.error("Error creating blog token:", tokenError);
    }

    const blogEditorUrl = `https://i-wasp.com/web-studio/blog-editor?token=${blogToken}`;

    console.log(`Website generated successfully for proposal ${proposalId}, hosted at: ${previewUrl}`);
    console.log(`Blog editor available at: ${blogEditorUrl}`);

    // === AUTO SEND EMAIL TO CLIENT ===
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const recipientEmail = proposal.form_data?.contactEmail;
    
    if (RESEND_API_KEY && recipientEmail) {
      console.log(`Sending automatic notification email to: ${recipientEmail}`);
      
      try {
        const emailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "IWASP Web Studio <contact@i-wasp.com>",
            to: [recipientEmail],
            subject: `🎉 Votre site ${businessName} est prêt !`,
            html: `
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
              </head>
              <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f7;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f7; padding: 40px 20px;">
                  <tr>
                    <td align="center">
                      <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
                        <!-- Header -->
                        <tr>
                          <td style="background: linear-gradient(135deg, #1D1D1F 0%, #2D2D2F 100%); padding: 40px 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">
                              🎉 Félicitations !
                            </h1>
                            <p style="margin: 16px 0 0; color: rgba(255,255,255,0.8); font-size: 16px;">
                              Votre site web est maintenant en ligne
                            </p>
                          </td>
                        </tr>
                        
                        <!-- Content -->
                        <tr>
                          <td style="padding: 40px;">
                            <h2 style="margin: 0 0 16px; color: #1D1D1F; font-size: 22px; font-weight: 600;">
                              ${businessName}
                            </h2>
                            <p style="margin: 0 0 24px; color: #6B7280; font-size: 16px; line-height: 1.6;">
                              Nous sommes ravis de vous annoncer que votre site web a été créé avec succès par notre équipe IWASP Web Studio.
                            </p>
                            
                            <!-- CTA Button -->
                            <table width="100%" cellpadding="0" cellspacing="0">
                              <tr>
                                <td align="center" style="padding: 20px 0;">
                                  <a href="${previewUrl}" style="display: inline-block; background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);">
                                    Voir mon site →
                                  </a>
                                </td>
                              </tr>
                            </table>
                            
                            <p style="margin: 24px 0 0; color: #9CA3AF; font-size: 14px; text-align: center;">
                              Lien direct : <a href="${previewUrl}" style="color: #F59E0B;">${previewUrl}</a>
                            </p>
                            
                            <!-- Blog Editor Section -->
                            <div style="margin-top: 32px; padding: 24px; background: #F9FAFB; border-radius: 12px;">
                              <h3 style="margin: 0 0 12px; color: #1D1D1F; font-size: 16px; font-weight: 600;">
                                📝 Gérez votre blog
                              </h3>
                              <p style="margin: 0 0 16px; color: #6B7280; font-size: 14px;">
                                Vous pouvez ajouter des articles de blog à votre site via l'éditeur dédié.
                              </p>
                              <a href="${blogEditorUrl}" style="color: #F59E0B; font-size: 14px; text-decoration: none;">
                                Accéder à l'éditeur de blog →
                              </a>
                            </div>
                          </td>
                        </tr>
                        
                        <!-- Footer -->
                        <tr>
                          <td style="background-color: #F9FAFB; padding: 24px 40px; text-align: center; border-top: 1px solid #E5E7EB;">
                            <p style="margin: 0; color: #6B7280; font-size: 14px;">
                              Une question ? Contactez-nous sur WhatsApp
                            </p>
                            <p style="margin: 8px 0 0; color: #9CA3AF; font-size: 12px;">
                              © 2026 IWASP · Tap. Connect. Empower.
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </body>
              </html>
            `,
          }),
        });

        const emailData = await emailResponse.json();
        
        if (emailResponse.ok) {
          console.log(`Email sent successfully to ${recipientEmail}`, emailData);
        } else {
          console.error("Failed to send email:", emailData);
        }
      } catch (emailError) {
        console.error("Error sending notification email:", emailError);
        // Don't fail the whole generation if email fails
      }
    } else {
      console.log("Skipping email: no RESEND_API_KEY or no recipient email");
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        websiteId,
        previewUrl,
        blogEditorUrl,
        emailSent: !!recipientEmail,
        message: "Site web généré avec succès"
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("generate-website-code error:", error);
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
