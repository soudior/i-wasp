import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[VERIFY-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { sessionId } = await req.json();
    if (!sessionId) throw new Error("Session ID is required");
    logStep("Session ID received", { sessionId });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    
    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent', 'customer'],
    });

    logStep("Session retrieved", { 
      status: session.status,
      paymentStatus: session.payment_status,
      amountTotal: session.amount_total,
      metadata: session.metadata,
    });

    const isSuccessful = session.payment_status === 'paid' && session.status === 'complete';
    let orderUpdated = false;

    // If payment is successful and we have an order ID, update the order status
    if (isSuccessful && session.metadata?.order_id) {
      const orderId = session.metadata.order_id;
      logStep("Updating order status", { orderId });

      const { error: updateError } = await supabase
        .from('orders')
        .update({ 
          status: 'paid',
          paid_at: new Date().toISOString(),
          payment_method: 'stripe',
        })
        .eq('id', orderId);

      if (updateError) {
        logStep("Error updating order", { error: updateError.message });
      } else {
        orderUpdated = true;
        logStep("Order status updated to paid", { orderId });
      }
    }

    return new Response(JSON.stringify({
      verified: isSuccessful,
      status: session.status,
      paymentStatus: session.payment_status,
      amountTotal: session.amount_total,
      currency: session.currency,
      customerEmail: session.customer_details?.email || null,
      metadata: session.metadata,
      orderUpdated,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage, verified: false }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  }
});
