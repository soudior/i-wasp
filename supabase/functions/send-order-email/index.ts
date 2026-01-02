import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const adminEmail = Deno.env.get("ADMIN_EMAIL") || "contact@i-wasp.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type EmailType = 
  | "order_confirmation" 
  | "welcome"
  | "payment_confirmed" 
  | "in_production" 
  | "shipped" 
  | "delivered"
  | "invoice"
  | "admin_notification";

interface OrderEmailRequest {
  orderId: string;
  emailType: EmailType;
  trackingNumber?: string;
  language?: "fr" | "ar";
}

interface OrderData {
  order_number: string;
  customer_email: string;
  shipping_name: string;
  shipping_address: string;
  shipping_city: string;
  shipping_postal_code: string;
  shipping_phone: string;
  total_price_cents: number;
  quantity: number;
  template: string;
  order_items: any[];
  tracking_number?: string;
  created_at: string;
}

const formatPrice = (cents: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(cents / 100);
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const getEmailSubject = (emailType: EmailType, orderNumber: string, language: "fr" | "ar" = "fr"): string => {
  if (language === "ar") {
    switch (emailType) {
      case "order_confirmation":
        return `✅ تأكيد الطلب #${orderNumber} - IWASP`;
      case "welcome":
        return `🐝 مرحبا بيك فـ IWASP ! 🚀`;
      case "payment_confirmed":
        return `💳 تأكد الخلاص - الطلب #${orderNumber} - IWASP`;
      case "in_production":
        return `🏭 الطلب ديالك #${orderNumber} كيتصنع - IWASP`;
      case "shipped":
        return `📦 الطلب ديالك #${orderNumber} تصيفط - IWASP`;
      case "delivered":
        return `🎉 الطلب ديالك #${orderNumber} وصل - IWASP`;
      case "invoice":
        return `🧾 الفاتورة - الطلب #${orderNumber} - IWASP`;
      default:
        return `الطلب #${orderNumber} - IWASP`;
    }
  }
  
  switch (emailType) {
    case "order_confirmation":
      return `✅ Confirmation de commande #${orderNumber} - IWASP`;
    case "welcome":
      return `🐝 Bienvenue dans l'ère du networking digital avec IWASP ! 🚀`;
    case "payment_confirmed":
      return `💳 Paiement confirmé - Commande #${orderNumber} - IWASP`;
    case "in_production":
      return `🏭 Votre commande #${orderNumber} est en fabrication - IWASP`;
    case "shipped":
      return `📦 Votre commande #${orderNumber} a été expédiée - IWASP`;
    case "delivered":
      return `🎉 Votre commande #${orderNumber} a été livrée - IWASP`;
    case "invoice":
      return `🧾 Facture - Commande #${orderNumber} - IWASP`;
    case "admin_notification":
      return `🔔 Nouvelle commande #${orderNumber} reçue`;
    default:
      return `Commande #${orderNumber} - IWASP`;
  }
};

const generateEmailHtml = (emailType: EmailType, order: OrderData, language: "fr" | "ar" = "fr"): string => {
  const isArabic = language === "ar";
  const rtlStyle = isArabic ? 'direction: rtl; text-align: right;' : '';
  const baseStyles = `
    <style>
      body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; }
      .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
      .header { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 40px 30px; text-align: center; }
      .header h1 { color: #d4af37; margin: 0; font-size: 28px; font-weight: 600; }
      .header p { color: #ffffff; margin: 10px 0 0; font-size: 14px; opacity: 0.9; }
      .content { padding: 40px 30px; }
      .greeting { font-size: 18px; color: #1a1a2e; margin-bottom: 20px; }
      .message { color: #4a5568; line-height: 1.7; margin-bottom: 30px; }
      .order-box { background: #f8f9fa; border-radius: 8px; padding: 25px; margin: 25px 0; border-left: 4px solid #d4af37; }
      .order-box h3 { color: #1a1a2e; margin: 0 0 15px; font-size: 16px; }
      .order-detail { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
      .order-detail:last-child { border-bottom: none; }
      .order-detail span:first-child { color: #718096; }
      .order-detail span:last-child { color: #1a1a2e; font-weight: 500; }
      .total-row { background: #1a1a2e; color: white; padding: 15px 25px; border-radius: 8px; display: flex; justify-content: space-between; margin-top: 20px; }
      .total-row span:last-child { font-size: 20px; font-weight: 600; color: #d4af37; }
      .tracking-box { background: linear-gradient(135deg, #d4af37 0%, #b8942e 100%); color: #1a1a2e; padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0; }
      .tracking-box h3 { margin: 0 0 10px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
      .tracking-box p { margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 2px; }
      .footer { background: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0; }
      .footer p { color: #718096; font-size: 13px; margin: 5px 0; }
      .footer a { color: #d4af37; text-decoration: none; }
      .status-badge { display: inline-block; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 500; }
      .status-confirmed { background: #c6f6d5; color: #22543d; }
      .status-production { background: #bee3f8; color: #2a4365; }
      .status-shipped { background: #fed7aa; color: #7b341e; }
    </style>
  `;

  const header = `
    <div class="header">
      <h1>IWASP</h1>
      <p>Cartes de visite NFC intelligentes</p>
    </div>
  `;

  const orderDetails = `
    <div class="order-box">
      <h3>📋 Détails de la commande</h3>
      <div class="order-detail">
        <span>Numéro de commande</span>
        <span>#${order.order_number}</span>
      </div>
      <div class="order-detail">
        <span>Date</span>
        <span>${formatDate(order.created_at)}</span>
      </div>
      <div class="order-detail">
        <span>Quantité</span>
        <span>${order.quantity} carte${order.quantity > 1 ? 's' : ''}</span>
      </div>
      <div class="order-detail">
        <span>Template</span>
        <span>${order.template}</span>
      </div>
    </div>
    <div class="total-row">
      <span>Total</span>
      <span>${formatPrice(order.total_price_cents)}</span>
    </div>
  `;

  const shippingDetails = `
    <div class="order-box">
      <h3>📍 Adresse de livraison</h3>
      <p style="color: #4a5568; margin: 0; line-height: 1.6;">
        ${order.shipping_name}<br>
        ${order.shipping_address}<br>
        ${order.shipping_postal_code} ${order.shipping_city}<br>
        📞 ${order.shipping_phone}
      </p>
    </div>
  `;

  const footer = `
    <div class="footer">
      <p>Une question ? Répondez directement à cet email.</p>
      <p><a href="https://i-wasp.com">www.i-wasp.com</a></p>
      <p style="margin-top: 15px; font-size: 11px; color: #a0aec0;">
        © ${new Date().getFullYear()} IWASP - Tous droits réservés
      </p>
    </div>
  `;

  switch (emailType) {
    case "order_confirmation":
      return `
        <!DOCTYPE html>
        <html>
        <head>${baseStyles}</head>
        <body>
          <div class="container">
            ${header}
            <div class="content">
              <p class="greeting">Bonjour ${order.shipping_name},</p>
              <p class="message">
                Merci pour votre commande ! 🎉<br><br>
                Nous avons bien reçu votre commande et nous la traiterons dès réception du paiement.
                <br><br>
                <strong>Mode de paiement :</strong> Paiement à la livraison
              </p>
              ${orderDetails}
              ${shippingDetails}
              <p class="message">
                Nous vous tiendrons informé(e) de l'avancement de votre commande par email.
              </p>
            </div>
            ${footer}
          </div>
        </body>
        </html>
      `;

    case "welcome":
      if (isArabic) {
        return `
          <!DOCTYPE html>
          <html dir="rtl" lang="ar">
          <head>
            ${baseStyles}
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; direction: rtl; }
              .welcome-hero { background: linear-gradient(135deg, #1a1a2e 0%, #0f0f1a 100%); padding: 50px 30px; text-align: center; }
              .welcome-hero h1 { color: #d4af37; font-size: 32px; margin: 0 0 10px; }
              .welcome-hero .bee-icon { font-size: 48px; margin-bottom: 15px; }
              .welcome-hero p { color: #ffffff; opacity: 0.9; font-size: 16px; }
              .step-card { background: white; border-radius: 12px; padding: 25px; margin: 15px 0; border-right: 4px solid #d4af37; border-left: none; box-shadow: 0 2px 8px rgba(0,0,0,0.08); text-align: right; }
              .step-number { background: linear-gradient(135deg, #d4af37 0%, #b8942e 100%); color: #1a1a2e; width: 32px; height: 32px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: 700; margin-left: 12px; }
              .step-title { color: #1a1a2e; font-weight: 600; font-size: 16px; }
              .step-desc { color: #718096; font-size: 14px; margin-top: 8px; line-height: 1.8; }
              .cta-button { display: inline-block; background: linear-gradient(135deg, #d4af37 0%, #b8942e 100%); color: #1a1a2e !important; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; margin: 10px 5px; }
              .whatsapp-box { background: #25D366; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0; }
              .whatsapp-box a { color: white !important; text-decoration: none; font-weight: 600; }
              .guide-link { background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
              .content { text-align: right; }
              .greeting { text-align: right; }
              .message { text-align: right; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="welcome-hero">
                <div class="bee-icon">🐝</div>
                <h1>مرحبا بيك فـ IWASP !</h1>
                <p>مبروك عليك ! دابا بديتي تغير الطريقة لي كتواصل بيها مع الناس فالخدمة.</p>
              </div>
              <div class="content">
                <p class="greeting">سلام ${order.shipping_name}،</p>
                <p class="message">
                  الكارطة ديالك IWASP دخلات للتحضير. هاشنو غادي يوقع دابا :
                </p>
                
                <div class="step-card">
                  <span class="step-number">1</span>
                  <span class="step-title">التخصيص</span>
                  <p class="step-desc">غادي نحفرو اللوڭو ديالك بدقة على الكارطة NFC الفاخرة ديالك.</p>
                </div>
                
                <div class="step-card">
                  <span class="step-number">2</span>
                  <span class="step-title">الإرسال</span>
                  <p class="step-desc">غادي توصلك رقم التتبع ملي الكارطة ديالك تخرج من عندنا.</p>
                </div>
                
                <div class="step-card">
                  <span class="step-number">3</span>
                  <span class="step-title">التفعيل</span>
                  <p class="step-desc">ملي توصلك، غير طابقها على التيليفون وغادي تتربط بالبروفايل ديالك أوتوماتيك!</p>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="https://i-wasp.com/guide" class="cta-button">📖 شوف دليل الاستعمال</a>
                </div>
                
                <div class="guide-link">
                  <p style="margin: 0 0 10px; color: #4a5568;">💡 <strong>نصيحة Pro :</strong></p>
                  <p style="margin: 0; color: #718096; font-size: 14px;">باش تكون الكونيكسيون NFC زوينة، حط الكارطة ديالك فوق <strong>اللّي فوق فـ iPhone</strong> ولا فـ <strong>الوسط فـ Android</strong>.</p>
                </div>
                
                <div class="order-box" style="border-right: 4px solid #d4af37; border-left: none;">
                  <h3>📋 تفاصيل الطلب</h3>
                  <div class="order-detail">
                    <span>رقم الطلب</span>
                    <span>#${order.order_number}</span>
                  </div>
                  <div class="order-detail">
                    <span>التاريخ</span>
                    <span>${formatDate(order.created_at)}</span>
                  </div>
                  <div class="order-detail">
                    <span>العدد</span>
                    <span>${order.quantity} كارطة</span>
                  </div>
                </div>
                
                <div class="whatsapp-box">
                  <p style="margin: 0 0 10px;">محتاج شي مساعدة؟ راسلنا على واتساب :</p>
                  <a href="https://wa.me/212600000000?text=سلام%20IWASP%2C%20عندي%20سؤال%20على%20الطلب%20%23${order.order_number}">💬 كتب لينا على واتساب</a>
                </div>
                
                <p class="message" style="text-align: center; font-style: italic;">
                  مرحبا بيك فالخلية ! 🐝<br>
                  <strong>فريق IWASP</strong>
                </p>
              </div>
              ${footer}
            </div>
          </body>
          </html>
        `;
      }
      
      return `
        <!DOCTYPE html>
        <html>
        <head>
          ${baseStyles}
          <style>
            .welcome-hero { background: linear-gradient(135deg, #1a1a2e 0%, #0f0f1a 100%); padding: 50px 30px; text-align: center; }
            .welcome-hero h1 { color: #d4af37; font-size: 32px; margin: 0 0 10px; }
            .welcome-hero .bee-icon { font-size: 48px; margin-bottom: 15px; }
            .welcome-hero p { color: #ffffff; opacity: 0.9; font-size: 16px; }
            .step-card { background: white; border-radius: 12px; padding: 25px; margin: 15px 0; border-left: 4px solid #d4af37; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
            .step-number { background: linear-gradient(135deg, #d4af37 0%, #b8942e 100%); color: #1a1a2e; width: 32px; height: 32px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: 700; margin-right: 12px; }
            .step-title { color: #1a1a2e; font-weight: 600; font-size: 16px; }
            .step-desc { color: #718096; font-size: 14px; margin-top: 8px; line-height: 1.5; }
            .cta-button { display: inline-block; background: linear-gradient(135deg, #d4af37 0%, #b8942e 100%); color: #1a1a2e !important; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; margin: 10px 5px; }
            .cta-button-secondary { background: transparent; border: 2px solid #d4af37; color: #d4af37 !important; }
            .whatsapp-box { background: #25D366; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0; }
            .whatsapp-box a { color: white !important; text-decoration: none; font-weight: 600; }
            .guide-link { background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
            .guide-link a { color: #d4af37 !important; text-decoration: underline; font-weight: 500; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="welcome-hero">
              <div class="bee-icon">🐝</div>
              <h1>Bienvenue chez IWASP !</h1>
              <p>Félicitations ! Vous venez de faire le premier pas pour moderniser vos échanges professionnels.</p>
            </div>
            <div class="content">
              <p class="greeting">Bonjour ${order.shipping_name},</p>
              <p class="message">
                Votre carte IWASP est entrée en phase de préparation. Voici ce qu'il va se passer ensuite :
              </p>
              
              <div class="step-card">
                <span class="step-number">1</span>
                <span class="step-title">Personnalisation</span>
                <p class="step-desc">Nous gravons votre logo avec précision sur votre carte NFC premium.</p>
              </div>
              
              <div class="step-card">
                <span class="step-number">2</span>
                <span class="step-title">Expédition</span>
                <p class="step-desc">Vous recevrez un numéro de suivi dès que votre carte quittera nos bureaux.</p>
              </div>
              
              <div class="step-card">
                <span class="step-number">3</span>
                <span class="step-title">Activation</span>
                <p class="step-desc">Dès réception, il vous suffira de "taper" votre carte sur un téléphone pour l'associer à votre profil digital.</p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://i-wasp.com/guide" class="cta-button">📖 Voir le guide d'utilisation</a>
              </div>
              
              <div class="guide-link">
                <p style="margin: 0 0 10px; color: #4a5568;">💡 <strong>Conseil Pro :</strong></p>
                <p style="margin: 0; color: #718096; font-size: 14px;">Pour une connexion NFC optimale, placez votre carte IWASP près du <strong>haut de l'iPhone</strong> ou au <strong>centre de l'Android</strong> de votre client.</p>
              </div>
              
              ${orderDetails}
              
              <div class="whatsapp-box">
                <p style="margin: 0 0 10px;">Besoin d'aide ? Contactez-nous sur WhatsApp :</p>
                <a href="https://wa.me/212600000000?text=Bonjour%20IWASP%2C%20j%27ai%20une%20question%20concernant%20ma%20commande%20%23${order.order_number}">💬 Écrire sur WhatsApp</a>
              </div>
              
              <p class="message" style="text-align: center; font-style: italic;">
                Bienvenue dans la ruche ! 🐝<br>
                <strong>L'équipe IWASP</strong>
              </p>
            </div>
            ${footer}
          </div>
        </body>
        </html>
      `;

    case "payment_confirmed":
      return `
        <!DOCTYPE html>
        <html>
        <head>${baseStyles}</head>
        <body>
          <div class="container">
            ${header}
            <div class="content">
              <p class="greeting">Bonjour ${order.shipping_name},</p>
              <p class="message">
                <span class="status-badge status-confirmed">✅ Paiement confirmé</span>
                <br><br>
                Excellente nouvelle ! Votre paiement a été confirmé avec succès.
                <br><br>
                Votre commande va maintenant passer en production. Nous vous enverrons un email dès que la fabrication de vos cartes commencera.
              </p>
              ${orderDetails}
            </div>
            ${footer}
          </div>
        </body>
        </html>
      `;

    case "in_production":
      return `
        <!DOCTYPE html>
        <html>
        <head>${baseStyles}</head>
        <body>
          <div class="container">
            ${header}
            <div class="content">
              <p class="greeting">Bonjour ${order.shipping_name},</p>
              <p class="message">
                <span class="status-badge status-production">🏭 En fabrication</span>
                <br><br>
                Bonne nouvelle ! Vos cartes de visite NFC sont maintenant en cours de fabrication.
                <br><br>
                Nos artisans travaillent avec soin pour créer des cartes de qualité premium. Comptez généralement 3-5 jours ouvrés pour la fabrication.
                <br><br>
                Vous recevrez un email avec le numéro de suivi dès l'expédition.
              </p>
              ${orderDetails}
            </div>
            ${footer}
          </div>
        </body>
        </html>
      `;

    case "shipped":
      return `
        <!DOCTYPE html>
        <html>
        <head>${baseStyles}</head>
        <body>
          <div class="container">
            ${header}
            <div class="content">
              <p class="greeting">Bonjour ${order.shipping_name},</p>
              <p class="message">
                <span class="status-badge status-shipped">📦 Expédiée</span>
                <br><br>
                Super nouvelle ! Votre commande a été expédiée et est en route vers vous !
              </p>
              ${order.tracking_number ? `
                <div class="tracking-box">
                  <h3>Numéro de suivi</h3>
                  <p>${order.tracking_number}</p>
                </div>
              ` : ''}
              ${shippingDetails}
              <p class="message">
                Livraison estimée : 2-4 jours ouvrés selon votre localisation.
              </p>
            </div>
            ${footer}
          </div>
        </body>
        </html>
      `;

    case "delivered":
      return `
        <!DOCTYPE html>
        <html>
        <head>${baseStyles}</head>
        <body>
          <div class="container">
            ${header}
            <div class="content">
              <p class="greeting">Bonjour ${order.shipping_name},</p>
              <p class="message">
                <span class="status-badge" style="background: #c6f6d5; color: #22543d; display: inline-block; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 500;">🎉 Livrée</span>
                <br><br>
                Excellente nouvelle ! Votre commande a été livrée avec succès !
                <br><br>
                Nous espérons que vous êtes satisfait(e) de vos nouvelles cartes NFC. 
                N'hésitez pas à nous contacter si vous avez des questions sur leur utilisation.
              </p>
              ${orderDetails}
              <p class="message">
                <strong>Prochaines étapes :</strong><br>
                1. Activez vos cartes en vous connectant sur i-wasp.com<br>
                2. Personnalisez votre profil digital<br>
                3. Partagez votre carte avec vos contacts !
              </p>
              <p class="message" style="font-size: 13px; color: #718096;">
                Merci de votre confiance. À bientôt !
              </p>
            </div>
            ${footer}
          </div>
        </body>
        </html>
      `;

    case "invoice":
      return `
        <!DOCTYPE html>
        <html>
        <head>${baseStyles}</head>
        <body>
          <div class="container">
            ${header}
            <div class="content">
              <p class="greeting">Bonjour ${order.shipping_name},</p>
              <p class="message">
                Veuillez trouver ci-dessous le récapitulatif de votre facture pour la commande #${order.order_number}.
              </p>
              ${orderDetails}
              ${shippingDetails}
              <p class="message" style="font-size: 12px; color: #718096;">
                Cette facture fait foi de justificatif de paiement.<br>
                Numéro de facture : INV-${order.order_number}
              </p>
            </div>
            ${footer}
          </div>
        </body>
        </html>
      `;

    case "admin_notification":
      return `
        <!DOCTYPE html>
        <html>
        <head>${baseStyles}</head>
        <body>
          <div class="container">
            ${header}
            <div class="content">
              <p class="greeting">🔔 Nouvelle commande reçue !</p>
              <p class="message">
                Une nouvelle commande vient d'être passée sur le site.
              </p>
              ${orderDetails}
              ${shippingDetails}
              <div class="order-box">
                <h3>📧 Contact client</h3>
                <p style="color: #4a5568; margin: 0;">
                  Email : ${order.customer_email}<br>
                  Téléphone : ${order.shipping_phone}
                </p>
              </div>
            </div>
            ${footer}
          </div>
        </body>
        </html>
      `;

    default:
      return "";
  }
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId, emailType, trackingNumber, language = "fr" }: OrderEmailRequest = await req.json();

    console.log(`Processing ${emailType} email for order ${orderId} in ${language}`);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch order details
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      console.error("Order not found:", orderError);
      throw new Error(`Order not found: ${orderId}`);
    }

    // Merge tracking number if provided
    const orderData: OrderData = {
      ...order,
      tracking_number: trackingNumber || order.tracking_number
    };

    // Don't send if no customer email
    if (!order.customer_email && emailType !== "admin_notification") {
      console.log("No customer email, skipping customer notification");
      return new Response(
        JSON.stringify({ success: true, message: "No customer email, skipped" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const emailsSent: string[] = [];

    // Send customer email
    if (emailType !== "admin_notification" && order.customer_email) {
      const customerEmailResult = await resend.emails.send({
        from: "IWASP <no-reply@i-wasp.com>",
        reply_to: "contact@i-wasp.com",
        to: [order.customer_email],
        subject: getEmailSubject(emailType, order.order_number, language),
        html: generateEmailHtml(emailType, orderData, language),
      });

      console.log("Customer email sent:", customerEmailResult);
      emailsSent.push(`customer: ${order.customer_email}`);
    }

    // Send admin notification for new orders
    if (emailType === "order_confirmation" || emailType === "admin_notification") {
      const adminEmailResult = await resend.emails.send({
        from: "IWASP System <no-reply@i-wasp.com>",
        reply_to: "contact@i-wasp.com",
        to: [adminEmail],
        subject: getEmailSubject("admin_notification", order.order_number),
        html: generateEmailHtml("admin_notification", orderData),
      });

      console.log("Admin email sent:", adminEmailResult);
      emailsSent.push(`admin: ${adminEmail}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        emailsSent,
        orderId,
        emailType 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );

  } catch (error: any) {
    console.error("Error sending order email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
