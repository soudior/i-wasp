import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Les valeurs du projet sont publiques par conception (URL + clé publishable/anon)
// et sont écrites en dur pour garantir leur présence dans le bundle de production,
// même si les variables d'environnement ne sont pas injectées au build de publication.
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || "https://vwlngxifajsziexhkafe.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  "sb_publishable_K9qQTKdVJG-k5-OKdSqZBw_DrURXgVV";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    // Stockage par défaut de supabase-js (localStorage du navigateur).
    // L'ancien « broker » qui recopiait la session d'authentification vers
    // l'éditeur externe a été supprimé : i-wasp est autonome.
    persistSession: true,
    autoRefreshToken: true,
    // PKCE : requis pour le flux OAuth mobile (navigateur système + deep link +
    // exchangeCodeForSession). Sur le web, supabase-js échange automatiquement le
    // `?code=` au retour (detectSessionInUrl) — le parcours web reste inchangé.
    flowType: 'pkce',
    detectSessionInUrl: true,
  }
});
