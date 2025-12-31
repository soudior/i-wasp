/**
 * Checkout Page - Mobile-first COD checkout
 * 
 * Production-ready checkout flow:
 * - Reads cart items from CartContext
 * - Collects shipping info
 * - Creates order with order_items
 * - Clears cart and redirects to confirmation
 */

import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useCreateOrder, OrderItem } from "@/hooks/useOrders";
import { formatPrice, PRICING } from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StickyBottomCTA } from "@/components/StickyBottomCTA";
import { OrderTrustBadges, LinkedCardPreview } from "@/components/order";
import { 
  CreditCard, 
  Truck, 
  Package, 
  ArrowLeft,
  Shield,
  Clock,
  Loader2,
  ShoppingCart
} from "lucide-react";
import { toast } from "sonner";

// Template images for previews
import cardBlackMatte from "@/assets/cards/card-black-matte.png";
import cardWhiteMinimal from "@/assets/cards/card-white-minimal.png";
import cardNavyExecutive from "@/assets/cards/card-navy-executive.png";
import cardGoldAccent from "@/assets/cards/card-gold-accent.png";
import cardHotel from "@/assets/cards/card-hotel.png";
import cardTourism from "@/assets/cards/card-tourism.png";

const templateImages: Record<string, string> = {
  signature: cardBlackMatte,
  minimal: cardWhiteMinimal,
  executive: cardNavyExecutive,
  luxe: cardGoldAccent,
  hotel: cardHotel,
  tourism: cardTourism,
  production: cardBlackMatte,
  "production-light": cardWhiteMinimal,
  "signature-light": cardWhiteMinimal,
  "hotel-guide": cardHotel,
  "hotel-guide-light": cardHotel,
  "hotel-concierge": cardHotel,
  modern: cardNavyExecutive,
  creative: cardGoldAccent,
  tech: cardBlackMatte,
};

export default function Checkout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { items, totalItems, totalPriceCents, clearCart } = useCart();
  const createOrder = useCreateOrder();
  
  // Linked card from onboarding flow
  const linkedCardSlug = searchParams.get("linkedCard");
  const linkedCardName = searchParams.get("linkedName");
  
  // Customer & shipping info
  const [shippingName, setShippingName] = useState("");
  const [shippingPhone, setShippingPhone] = useState("");
  const [shippingEmail, setShippingEmail] = useState(user?.email || "");
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingCity, setShippingCity] = useState("");
  const [shippingPostalCode, setShippingPostalCode] = useState("");
  
  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      navigate("/cart");
    }
  }, [items.length, navigate]);

  // Pre-fill email from user
  useEffect(() => {
    if (user?.email && !shippingEmail) {
      setShippingEmail(user.email);
    }
  }, [user?.email, shippingEmail]);

  const getTemplateImage = (templateId: string) => {
    return templateImages[templateId] || cardBlackMatte;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Veuillez vous connecter pour passer commande");
      navigate("/login");
      return;
    }
    
    if (items.length === 0) {
      toast.error("Votre panier est vide");
      navigate("/cart");
      return;
    }
    
    if (!shippingName || !shippingPhone || !shippingAddress || !shippingCity || !shippingPostalCode) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    // Validate phone number (basic Moroccan format)
    const phoneRegex = /^(\+212|0)[5-7]\d{8}$/;
    if (!phoneRegex.test(shippingPhone.replace(/\s/g, ""))) {
      toast.error("Veuillez entrer un numéro de téléphone valide");
      return;
    }
    
    // Convert cart items to order items
    const orderItems: OrderItem[] = items.map(item => ({
      id: item.id,
      templateId: item.templateId,
      templateName: item.templateName,
      cardName: item.cardName,
      quantity: item.quantity,
      unitPriceCents: item.unitPriceCents,
      photoUrl: item.photoUrl,
      logoUrl: item.logoUrl,
    }));

    // Calculate average unit price
    const avgUnitPrice = Math.round(totalPriceCents / totalItems);
    
    try {
      const result = await createOrder.mutateAsync({
        order_items: orderItems,
        quantity: totalItems,
        unit_price_cents: avgUnitPrice,
        total_price_cents: totalPriceCents,
        order_type: "standard",
        template: items[0]?.templateId || "iwasp-signature",
        currency: PRICING.currency,
        shipping_name: shippingName,
        shipping_phone: shippingPhone,
        shipping_address: shippingAddress,
        shipping_city: shippingCity,
        shipping_postal_code: shippingPostalCode,
        shipping_country: "MA",
        customer_email: shippingEmail || null,
        payment_method: "cod",
      });
      
      // Clear cart after successful order
      clearCart();
      
      // Navigate to confirmation page with order number
      navigate(`/order-confirmation?order=${result.order_number}`);
    } catch (error) {
      console.error("Order creation failed:", error);
    }
  };

  // Empty cart guard
  if (items.length === 0) {
    return (
      <div className="min-h-mobile-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">Panier vide</h2>
          <p className="text-muted-foreground mb-4">Ajoutez des cartes pour passer commande</p>
          <Button onClick={() => navigate("/templates")}>Voir les templates</Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-mobile-screen bg-background">
      <main className="pt-4 md:pt-8 pb-40 md:pb-24 px-4 md:px-6">
        <div className="mobile-container md:max-w-4xl md:mx-auto">
          {/* Header */}
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <button 
              onClick={() => navigate("/cart")}
              className="inline-flex items-center gap-2 text-muted-foreground active:text-foreground transition-colors mb-4 min-h-[44px]"
            >
              <ArrowLeft size={18} />
              Retour au panier
            </button>
            <h1 className="text-2xl md:text-3xl font-bold">Finaliser la commande</h1>
            <p className="text-muted-foreground mt-1">
              {totalItems} carte{totalItems > 1 ? "s" : ""} • {formatPrice(totalPriceCents)}
            </p>
          </motion.div>
          
          <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
            {/* Left Column - Form */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Order Summary Card - Mobile */}
              <Card className="lg:hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Votre commande
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-12 h-10 rounded-lg overflow-hidden bg-surface-2 flex-shrink-0">
                        <img
                          src={getTemplateImage(item.templateId)}
                          alt={item.templateName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.cardName}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.templateName} × {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-semibold">
                        {formatPrice(item.unitPriceCents * item.quantity)}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Linked Card Preview (from onboarding) */}
              {linkedCardSlug && linkedCardName && (
                <LinkedCardPreview
                  cardName={linkedCardName}
                  cardSlug={linkedCardSlug}
                />
              )}
              
              {/* Trust Badges - Mobile */}
              <div className="lg:hidden">
                <OrderTrustBadges />
              </div>
              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Adresse de livraison
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="shippingName">Nom complet *</Label>
                    <Input
                      id="shippingName"
                      value={shippingName}
                      onChange={(e) => setShippingName(e.target.value)}
                      placeholder="Prénom Nom"
                      required
                      className="h-12"
                      autoComplete="name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="shippingPhone">Téléphone *</Label>
                    <Input
                      id="shippingPhone"
                      type="tel"
                      inputMode="tel"
                      value={shippingPhone}
                      onChange={(e) => setShippingPhone(e.target.value)}
                      placeholder="06 XX XX XX XX"
                      required
                      className="h-12"
                      autoComplete="tel"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Pour vous contacter lors de la livraison
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="shippingEmail">Email (optionnel)</Label>
                    <Input
                      id="shippingEmail"
                      type="email"
                      inputMode="email"
                      value={shippingEmail}
                      onChange={(e) => setShippingEmail(e.target.value)}
                      placeholder="votre@email.com"
                      className="h-12"
                      autoComplete="email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="shippingAddress">Adresse *</Label>
                    <Textarea
                      id="shippingAddress"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      placeholder="Numéro et nom de rue"
                      required
                      className="min-h-[80px]"
                      autoComplete="street-address"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="shippingCity">Ville *</Label>
                      <Input
                        id="shippingCity"
                        value={shippingCity}
                        onChange={(e) => setShippingCity(e.target.value)}
                        placeholder="Casablanca"
                        required
                        className="h-12"
                        autoComplete="address-level2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="shippingPostalCode">Code postal *</Label>
                      <Input
                        id="shippingPostalCode"
                        value={shippingPostalCode}
                        onChange={(e) => setShippingPostalCode(e.target.value)}
                        placeholder="20000"
                        required
                        className="h-12"
                        inputMode="numeric"
                        autoComplete="postal-code"
                      />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    🇲🇦 Livraison au Maroc uniquement
                  </p>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Mode de paiement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 border-2 border-primary">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <CreditCard className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">Paiement à la livraison</p>
                      <p className="text-sm text-muted-foreground">
                        Payez en espèces ou par carte à la réception
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Right Column - Summary (Desktop) */}
            <div className="hidden lg:block lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Récapitulatif</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order items */}
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="w-14 h-10 rounded-lg overflow-hidden bg-surface-2 flex-shrink-0">
                          <img
                            src={getTemplateImage(item.templateId)}
                            alt={item.templateName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.cardName}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.templateName} × {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-semibold">
                          {formatPrice(item.unitPriceCents * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  <Separator />
                  
                  {/* Totals */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sous-total</span>
                      <span>{formatPrice(totalPriceCents)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Livraison</span>
                      <span className="text-green-600 font-medium">Gratuite</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total TTC</span>
                    <span>{formatPrice(totalPriceCents)}</span>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-amber-500 to-amber-600 text-background font-semibold rounded-full" 
                    size="lg"
                    disabled={createOrder.isPending}
                  >
                    {createOrder.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Traitement...
                      </>
                    ) : (
                      "Confirmer la commande"
                    )}
                  </Button>
                  
                  {/* NFC Trust badges */}
                  <div className="pt-2">
                    <OrderTrustBadges compact />
                  </div>
                  
                  {/* Standard trust badges */}
                  <div className="space-y-2 pt-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Shield className="h-4 w-4 text-amber-500" />
                      <span>Commande sécurisée</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4 text-amber-500" />
                      <span>Confirmation sous 24h</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Package className="h-4 w-4 text-amber-500" />
                      <span>Production: 1-3 jours</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Truck className="h-4 w-4 text-amber-500" />
                      <span>Livraison: 2-5 jours ouvrés</span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-center text-muted-foreground pt-2">
                    En confirmant, vous acceptez nos conditions générales.
                  </p>
                </CardContent>
              </Card>
            </div>
          </form>
        </div>
      </main>

      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-xl border-t border-border/50 lg:hidden z-40">
        <Button 
          type="submit"
          form="checkout-form"
          onClick={handleSubmit}
          className="w-full h-14 bg-gradient-to-r from-amber-500 to-amber-600 text-background font-semibold rounded-full text-base"
          disabled={createOrder.isPending}
        >
          {createOrder.isPending ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Traitement...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-5 w-5" />
              Confirmer • {formatPrice(totalPriceCents)}
            </>
          )}
        </Button>
        <p className="text-xs text-center text-muted-foreground mt-2">
          Paiement à la livraison • Livraison gratuite 🇲🇦
        </p>
      </div>
    </div>
  );
}