import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return json({ error: "Authorization header required" }, 401);

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

  if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
    return json({ error: "Server misconfigured" }, 500);
  }

  const founderEmail = (Deno.env.get("ADMIN_EMAIL") ?? "").trim().toLowerCase();
  if (!founderEmail) {
    return json({ error: "ADMIN_EMAIL not configured" }, 500);
  }

  // Verify caller identity with user JWT
  const authClient = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
  });

  const { data: { user }, error: authError } = await authClient.auth.getUser();
  if (authError || !user) {
    return json({ error: "Unauthorized" }, 401);
  }

  const email = (user.email ?? "").trim().toLowerCase();
  if (email !== founderEmail) {
    // Not the founder: noop
    return json({ ok: true, isAdmin: false });
  }

  // Founder: ensure admin role exists (server-side write)
  const service = createClient(supabaseUrl, supabaseServiceKey);

  const { error } = await service
    .from("user_roles")
    .upsert(
      { user_id: user.id, role: "admin" },
      { onConflict: "user_id,role", ignoreDuplicates: true }
    );

  if (error) {
    console.error("[bootstrap-admin] upsert failed", error);
    return json({ error: "Failed to grant admin role" }, 500);
  }

  return json({ ok: true, isAdmin: true });
});
