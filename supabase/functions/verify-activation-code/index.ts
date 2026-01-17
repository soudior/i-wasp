import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface VerifyRequest {
  serial_code: string
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Parse request body
    const { serial_code } = await req.json() as VerifyRequest

    // Validate input
    if (!serial_code || typeof serial_code !== 'string') {
      console.log('[verify-activation-code] Missing or invalid serial_code')
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Code de série requis' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Normalize serial code (remove dashes, uppercase)
    const normalizedCode = serial_code.replace(/-/g, '').toUpperCase()
    
    console.log(`[verify-activation-code] Verifying code: ${normalizedCode.substring(0, 4)}****`)

    // Call the database function to verify the code
    const { data, error } = await supabase.rpc('verify_activation_code', {
      p_serial_code: normalizedCode
    })

    if (error) {
      console.error('[verify-activation-code] Database error:', error)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Erreur lors de la vérification' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log(`[verify-activation-code] Result:`, data?.success ? 'Found' : 'Not found')

    return new Response(
      JSON.stringify(data),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('[verify-activation-code] Unexpected error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Erreur interne du serveur' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
