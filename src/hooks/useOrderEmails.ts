import { supabase } from "@/integrations/supabase/client";

export type EmailType = 
  | "order_confirmation" 
  | "welcome"
  | "payment_confirmed" 
  | "in_production" 
  | "shipped" 
  | "delivered"
  | "invoice";

interface SendEmailParams {
  orderId: string;
  emailType: EmailType;
  trackingNumber?: string;
}

export async function sendOrderEmail({ orderId, emailType, trackingNumber }: SendEmailParams): Promise<boolean> {
  try {
    console.log(`Sending ${emailType} email for order ${orderId}`);
    
    const { data, error } = await supabase.functions.invoke("send-order-email", {
      body: { orderId, emailType, trackingNumber }
    });

    if (error) {
      console.error("Error sending order email:", error);
      return false;
    }

    console.log("Email sent successfully:", data);
    return true;
  } catch (error) {
    console.error("Failed to send order email:", error);
    return false;
  }
}

// Helper to trigger emails on order status changes
export function useOrderEmailTrigger() {
  const triggerEmail = async (orderId: string, emailType: EmailType, trackingNumber?: string) => {
    return sendOrderEmail({ orderId, emailType, trackingNumber });
  };

  return { triggerEmail };
}
