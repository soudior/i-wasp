import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateOrder } from "@/hooks/useOrders";
import { 
  PRICING, 
  calculateB2CPrice, 
  calculateB2BPrice, 
  formatPrice, 
  getUnitPrice, 
  isB2BQuantity, 
  getPricingTier 
} from "@/lib/pricing";
import { PRINT_TEMPLATES, PREMIUM_BACKGROUNDS, type PrintTemplateType, type PremiumBackgroundId } from "@/lib/printTypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  Truck, 
  Package, 
  CheckCircle2, 
  Upload, 
  Minus, 
  Plus,
  ArrowLeft,
  Shield,
  Clock
} from "lucide-react";
import { PhotoUpload } from "@/components/PhotoUpload";
import { toast } from "sonner";

type OrderType = "standard" | "personalized";

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const createOrder = useCreateOrder();
  
  // Form state
  const [quantity, setQuantity] = useState(1);
  const [orderType, setOrderType] = useState<OrderType>("standard");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [backgroundType, setBackgroundType] = useState<"solid" | "image">("solid");
  const [backgroundColor, setBackgroundColor] = useState<PremiumBackgroundId>("white");
  const [backgroundImageUrl, setBackgroundImageUrl] = useState<string | null>(null);
  
  // Shipping info
  const [shippingName, setShippingName] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingCity, setShippingCity] = useState("");
  const [shippingPostalCode, setShippingPostalCode] = useState("");
  
  // Calculate pricing
  const isB2B = isB2BQuantity(quantity);
  const isPersonalized = orderType === "personalized";
  const totalPrice = isB2B 
    ? calculateB2BPrice(quantity, isPersonalized) 
    : calculateB2CPrice(quantity);
  const unitPrice = getUnitPrice(quantity, isB2B);
  const tier = getPricingTier(quantity);
  
  // Handle quantity changes
  const handleQuantityChange = (delta: number) => {
    const newQty = Math.max(1, quantity + delta);
    setQuantity(newQty);
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Veuillez vous connecter pour passer commande");
      navigate("/login");
      return;
    }
    
    if (!shippingName || !shippingAddress || !shippingCity || !shippingPostalCode) {
      toast.error("Veuillez remplir tous les champs de livraison");
      return;
    }
    
    try {
      await createOrder.mutateAsync({
        quantity,
        order_type: orderType,
        template: "iwasp-signature",
        card_color: PREMIUM_BACKGROUNDS[backgroundColor].hex,
        logo_url: logoUrl,
        background_type: backgroundType,
        background_color: PREMIUM_BACKGROUNDS[backgroundColor].hex,
        background_image_url: backgroundImageUrl,
        unit_price_cents: unitPrice,
        total_price_cents: totalPrice,
        currency: PRICING.currency,
        status: "pending",
        shipping_name: shippingName,
        shipping_address: shippingAddress,
        shipping_city: shippingCity,
        shipping_postal_code: shippingPostalCode,
        shipping_country: "MA", // Morocco
      });
      
      toast.success("Commande enregistrée ! Vous recevrez une confirmation sous 24h.");
      navigate("/dashboard");
    } catch (error) {
      console.error("Order creation failed:", error);
    }
  };
  
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-3xl font-bold">Commander vos cartes IWASP</h1>
          <p className="text-muted-foreground mt-2">
            Cartes NFC premium avec paiement à la livraison
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Configuration */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Quantity Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Quantité
                </CardTitle>
                <CardDescription>
                  Choisissez le nombre de cartes NFC
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-24 text-center text-lg font-semibold"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleQuantityChange(1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Badge variant="secondary" className="ml-2">
                    {tier}
                  </Badge>
                </div>
                
                {isB2B && (
                  <p className="text-sm text-muted-foreground mt-3">
                    🏢 Tarif entreprise appliqué ({formatPrice(unitPrice)} HT/carte)
                  </p>
                )}
              </CardContent>
            </Card>
            
            {/* Order Type */}
            <Card>
              <CardHeader>
                <CardTitle>Type de commande</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={orderType} 
                  onValueChange={(v) => setOrderType(v as OrderType)}
                  className="grid grid-cols-2 gap-4"
                >
                  <Label
                    htmlFor="standard"
                    className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      orderType === "standard" 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    <RadioGroupItem value="standard" id="standard" className="sr-only" />
                    <Package className="h-8 w-8 mb-2" />
                    <span className="font-medium">Standard</span>
                    <span className="text-sm text-muted-foreground">Cartes IWASP classiques</span>
                  </Label>
                  
                  <Label
                    htmlFor="personalized"
                    className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      orderType === "personalized" 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    <RadioGroupItem value="personalized" id="personalized" className="sr-only" />
                    <Upload className="h-8 w-8 mb-2" />
                    <span className="font-medium">Personnalisée</span>
                    <span className="text-sm text-muted-foreground">Avec votre logo</span>
                    {isB2B && <Badge className="mt-1">+10€ HT/carte</Badge>}
                  </Label>
                </RadioGroup>
              </CardContent>
            </Card>
            
            {/* Logo Upload (if personalized) */}
            {orderType === "personalized" && (
              <Card>
                <CardHeader>
                  <CardTitle>Votre logo</CardTitle>
                  <CardDescription>
                    Format SVG ou PNG, minimum 1000×1000px
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PhotoUpload
                    value={logoUrl}
                    onChange={setLogoUrl}
                    type="logo"
                  />
                </CardContent>
              </Card>
            )}
            
            {/* Background Color */}
            <Card>
              <CardHeader>
                <CardTitle>Couleur de fond</CardTitle>
                <CardDescription>
                  Sélectionnez le fond de votre carte
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-3">
                  {Object.entries(PREMIUM_BACKGROUNDS).map(([id, bg]) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setBackgroundColor(id as PremiumBackgroundId)}
                      className={`aspect-square rounded-lg border-2 transition-all ${
                        backgroundColor === id 
                          ? "border-primary ring-2 ring-primary ring-offset-2" 
                          : "border-border hover:border-muted-foreground"
                      }`}
                      style={{ backgroundColor: bg.hex }}
                      title={bg.name}
                    >
                      {backgroundColor === id && (
                        <CheckCircle2 
                          className="h-4 w-4 mx-auto" 
                          style={{ color: bg.textColor }}
                        />
                      )}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {PREMIUM_BACKGROUNDS[backgroundColor].name}
                </p>
              </CardContent>
            </Card>
            
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
                  <Label htmlFor="shippingName">Nom complet</Label>
                  <Input
                    id="shippingName"
                    value={shippingName}
                    onChange={(e) => setShippingName(e.target.value)}
                    placeholder="Prénom Nom"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="shippingAddress">Adresse</Label>
                  <Textarea
                    id="shippingAddress"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="Numéro et nom de rue"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="shippingCity">Ville</Label>
                    <Input
                      id="shippingCity"
                      value={shippingCity}
                      onChange={(e) => setShippingCity(e.target.value)}
                      placeholder="Casablanca"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="shippingPostalCode">Code postal</Label>
                    <Input
                      id="shippingPostalCode"
                      value={shippingPostalCode}
                      onChange={(e) => setShippingPostalCode(e.target.value)}
                      placeholder="20000"
                      required
                    />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  🇲🇦 Livraison au Maroc uniquement
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Right Column - Summary */}
          <div className="space-y-6">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Récapitulatif</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>IWASP Signature × {quantity}</span>
                    <span>{formatPrice(quantity * unitPrice)}</span>
                  </div>
                  {orderType === "personalized" && isB2B && (
                    <div className="flex justify-between text-muted-foreground">
                      <span>Personnalisation × {quantity}</span>
                      <span>{formatPrice(quantity * PRICING.b2b.personalizationFee)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-muted-foreground">
                    <span>Livraison</span>
                    <span className="text-green-600 font-medium">Gratuite</span>
                  </div>
                </div>
                
                <Separator />
                
                {/* Total */}
                <div className="flex justify-between text-lg font-bold">
                  <span>Total {isB2B ? "HT" : "TTC"}</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                
                <Separator />
                
                {/* Payment Method - COD Only */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Paiement à la livraison</p>
                      <p className="text-sm text-muted-foreground">
                        Payez en espèces ou par carte
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Trust Badges */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    <span>Commande sécurisée</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Confirmation sous 24h</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Truck className="h-4 w-4" />
                    <span>Livraison 5-7 jours ouvrés</span>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={createOrder.isPending}
                >
                  {createOrder.isPending ? "Traitement..." : "Confirmer la commande"}
                </Button>
                
                <p className="text-xs text-center text-muted-foreground">
                  En confirmant, vous acceptez nos conditions générales de vente.
                  Paiement à la réception de votre commande.
                </p>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </div>
  );
}
