declare module "https://esm.sh/@supabase/supabase-js@2.89.0" { export { createClient } from "@supabase/supabase-js"; }
declare module "https://esm.sh/@supabase/supabase-js@2.57.2" { export { createClient } from "@supabase/supabase-js"; }
declare module "https://deno.land/std@0.190.0/http/server.ts" { export function serve(handler: (req: Request) => Promise<Response>): void; }
declare module "https://esm.sh/stripe@18.5.0" { export default class Stripe { constructor(key: string, options: { apiVersion: string }); checkout: { sessions: { retrieve: (id: string) => Promise<{ status: string | null; payment_status: string; metadata: Record<string,string> | null }> } }; } }
