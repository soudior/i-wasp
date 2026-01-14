/**
 * Edge Function: stripe-webhook
 * Handles Stripe webhook events for Web Studio orders
 * Automatically saves orders to database after successful payment
 */

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

// Generate order number in format WS-YYMM-XXXX
function generateOrderNumber(): string {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `WS-${year}${month}-${random}`;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Webhook received");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY not configured");
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Supabase configuration missing");
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get raw body for signature verification
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    // Note: In production, you should verify the webhook signature
    // For now, we'll parse the event directly
    let event: Stripe.Event;
    
    try {
      event = JSON.parse(body) as Stripe.Event;
    } catch (err) {
      logStep("ERROR: Invalid JSON body");
      return new Response(
        JSON.stringify({ error: "Invalid request body" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    logStep("Event received", { type: event.type, id: event.id });

    // Handle checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      
      logStep("Processing checkout session", { 
        sessionId: session.id,
        paymentStatus: session.payment_status,
        metadata: session.metadata,
      });

      // Only process webstudio_direct payments
      if (session.metadata?.type !== 'webstudio_direct') {
        logStep("Skipping non-webstudio payment");
        return new Response(
          JSON.stringify({ received: true, skipped: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Check if order already exists
      const { data: existingOrder } = await supabase
        .from("webstudio_orders")
        .select("id")
        .eq("stripe_session_id", session.id)
        .single();

      if (existingOrder) {
        logStep("Order already exists, skipping", { orderId: existingOrder.id });
        return new Response(
          JSON.stringify({ received: true, exists: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Get line items for order details
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
      const items = lineItems.data.map((item: Stripe.LineItem) => ({
        name: item.description || 'Article',
        quantity: item.quantity || 1,
        amount_cents: item.amount_total || 0,
      }));

      // Parse options from payment intent metadata if available
      let options: unknown[] = [];
      if (session.payment_intent) {
        try {
          const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent as string);
          if (paymentIntent.metadata?.options) {
            options = JSON.parse(paymentIntent.metadata.options);
          }
        } catch (e) {
          logStep("Could not parse options from payment intent");
        }
      }

      // Create order in database
      const orderData = {
        stripe_session_id: session.id,
        stripe_payment_intent_id: session.payment_intent as string || null,
        stripe_customer_id: session.customer as string || null,
        customer_email: session.customer_details?.email || session.customer_email || '',
        customer_name: session.customer_details?.name || null,
        order_number: generateOrderNumber(),
        package_type: session.metadata?.package_type || 'UNKNOWN',
        currency: (session.currency || 'eur').toUpperCase(),
        amount_cents: session.amount_total || 0,
        items: items,
        options: options,
        status: 'paid',
        paid_at: new Date().toISOString(),
      };

      logStep("Creating order", orderData);

      const { data: newOrder, error: insertError } = await supabase
        .from("webstudio_orders")
        .insert(orderData)
        .select()
        .single();

      if (insertError) {
        logStep("ERROR inserting order", { error: insertError.message });
        throw insertError;
      }

      logStep("Order created successfully", { 
        orderId: newOrder.id, 
        orderNumber: newOrder.order_number,
      });

      // TODO: Send confirmation email here
      // You can invoke the send-webstudio-confirmation function

      return new Response(
        JSON.stringify({ 
          received: true, 
          orderId: newOrder.id,
          orderNumber: newOrder.order_number,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Handle payment_intent.succeeded for additional tracking
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      logStep("Payment intent succeeded", { 
        paymentIntentId: paymentIntent.id,
        metadata: paymentIntent.metadata,
      });
      
      // Update order status if needed
      if (paymentIntent.metadata?.type === 'webstudio_direct') {
        // Order should already be created by checkout.session.completed
        logStep("WebStudio payment confirmed");
      }
    }

    // Handle payment_intent.payment_failed
    if (event.type === "payment_intent.payment_failed") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      logStep("Payment failed", { 
        paymentIntentId: paymentIntent.id,
        error: paymentIntent.last_payment_error?.message,
      });
    }

    return new Response(
      JSON.stringify({ received: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
