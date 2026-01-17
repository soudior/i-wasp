/**
 * Page Tarifs Complets - i-wasp Studio
 * 3 sections: Cartes NFC, Sites Web Studio, Packs Promo
 * Design premium, Apple-like
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  CreditCard, 
  Globe, 
  Package, 
  Check, 
  ArrowRight, 
  Sparkles,
  Phone,
  MessageSquare,
  Star,
  Zap,
  Crown,
  BadgePercent,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Pricing data
import { NFC_PRICING, getNfcTiersList } from "@/lib/nfcPricing";
import { WEB_STUDIO_PACKAGES, WEB_MAINTENANCE } from "@/lib/webStudioPackages";
import { PROMO_PACKS, getPromoPacksList } from "@/lib/promoPacks";

type Currency = 'MAD' | 'EUR';

export default function TarifsComplets() {
  const [currency, setCurrency] = useState<Currency>('MAD');
  const [loadingNfc, setLoadingNfc] = useState<string | null>(null);
  const [loadingPack, setLoadingPack] = useState<string | null>(null);

  const nfcTiers = getNfcTiersList();
  const promoPacks = getPromoPacksList();

  const formatPrice = (mad: number) => {
    if (currency === 'EUR') {
      return `€${Math.round(mad * 0.10)}`;
    }
    return `${mad.toLocaleString('fr-FR')} DH`;
  };

  // Handle NFC payment
  const handleNfcPayment = async (tierId: string) => {
    setLoadingNfc(tierId);
    try {
      const { data, error } = await supabase.functions.invoke('create-nfc-payment', {
        body: { tierId },
      });

      if (error) throw error;
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (err) {
      console.error('NFC payment error:', err);
      toast.error("Erreur lors de la création du paiement");
    } finally {
      setLoadingNfc(null);
    }
  };

  // Handle Promo Pack payment
  const handlePromoPackPayment = async (packId: string) => {
    setLoadingPack(packId);
    try {
      const { data, error } = await supabase.functions.invoke('create-promo-pack-payment', {
        body: { packId },
      });

      if (error) throw error;
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (err) {
      console.error('Promo pack payment error:', err);
      toast.error("Erreur lors de la création du paiement");
    } finally {
      setLoadingPack(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold tracking-tight">
            i-wasp<span className="text-primary">.</span>
          </Link>
          <div className="flex items-center gap-4">
            {/* Currency Toggle */}
            <div className="flex items-center bg-muted rounded-full p-1">
              <button
                onClick={() => setCurrency('MAD')}
                className={cn(
                  "px-3 py-1 text-sm font-medium rounded-full transition-all",
                  currency === 'MAD' 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                DH
              </button>
              <button
                onClick={() => setCurrency('EUR')}
                className={cn(
                  "px-3 py-1 text-sm font-medium rounded-full transition-all",
                  currency === 'EUR' 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                €
              </button>
            </div>
            <Link to="/contact">
              <Button variant="outline" size="sm">
                <Phone className="w-4 h-4 mr-2" />
                Contact
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <Badge className="mb-4" variant="secondary">
            <Sparkles className="w-3 h-3 mr-1" />
            Basé au Maroc · Livraison Mondiale
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Tarifs <span className="text-primary">Transparents</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Cartes NFC premium, sites web professionnels et packs promotionnels. 
            Choisissez la solution adaptée à vos besoins.
          </p>
        </motion.div>
      </section>

      {/* Tabs Navigation */}
      <Tabs defaultValue="nfc" className="max-w-7xl mx-auto px-4 pb-20">
        <TabsList className="grid grid-cols-3 max-w-md mx-auto mb-12">
          <TabsTrigger value="nfc" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            <span className="hidden sm:inline">Cartes NFC</span>
            <span className="sm:hidden">NFC</span>
          </TabsTrigger>
          <TabsTrigger value="web" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            <span className="hidden sm:inline">Sites Web</span>
            <span className="sm:hidden">Web</span>
          </TabsTrigger>
          <TabsTrigger value="packs" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            Packs
          </TabsTrigger>
        </TabsList>

        {/* ==================== SECTION 1: CARTES NFC ==================== */}
        <TabsContent value="nfc" className="space-y-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Cartes NFC Premium</h2>
            <p className="text-muted-foreground">
              Design personnalisé, inscription NFC unique, livraison rapide
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {nfcTiers.map((tier, index) => (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={cn(
                  "relative h-full flex flex-col transition-all hover:shadow-lg",
                  tier.id === 'pack_50' && "border-primary ring-2 ring-primary/20"
                )}>
                  {tier.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className={cn(
                        "whitespace-nowrap",
                        tier.id === 'pack_100' && "bg-amber-500 hover:bg-amber-600",
                        tier.id === 'pack_50' && "bg-primary"
                      )}>
                        {tier.badge}
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pt-8">
                    <CardTitle className="text-lg">{tier.name}</CardTitle>
                    <CardDescription>{tier.subtitle}</CardDescription>
                    <div className="mt-4">
                      <span className="text-3xl font-bold">
                        {formatPrice(tier.priceMad)}
                      </span>
                      {tier.savings && (
                        <p className="text-sm text-green-600 font-medium mt-1">
                          -{tier.savings}% économie
                        </p>
                      )}
                      {tier.quantity > 1 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatPrice(tier.pricePerCardMad)}/carte
                        </p>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <ul className="space-y-2 flex-1">
                      {tier.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className="w-full mt-6"
                      variant={tier.id === 'pack_50' ? 'default' : 'outline'}
                      onClick={() => handleNfcPayment(tier.id)}
                      disabled={loadingNfc === tier.id}
                    >
                      {loadingNfc === tier.id ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : null}
                      Commander
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* NFC Extras */}
          <Card className="mt-8 p-6 bg-muted/30">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              Options supplémentaires
            </h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                <span className="text-sm">Gravure laser</span>
                <span className="font-medium">{formatPrice(500)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                <span className="text-sm">Production express</span>
                <span className="font-medium">{formatPrice(300)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                <span className="text-sm">Packaging premium</span>
                <span className="font-medium">{formatPrice(200)}</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              * Gravure laser gratuite pour les commandes de 100+ cartes
            </p>
          </Card>
        </TabsContent>

        {/* ==================== SECTION 2: SITES WEB ==================== */}
        <TabsContent value="web" className="space-y-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Sites Web Studio</h2>
            <p className="text-muted-foreground">
              Sites professionnels sur-mesure, design responsive, SEO optimisé
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {Object.values(WEB_STUDIO_PACKAGES).map((pkg, index) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={cn(
                  "relative h-full flex flex-col transition-all hover:shadow-lg",
                  pkg.id === 'pro' && "border-primary ring-2 ring-primary/20"
                )}>
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className={cn(
                      "whitespace-nowrap",
                      pkg.id === 'basic' && "bg-emerald-500 hover:bg-emerald-600",
                      pkg.id === 'pro' && "bg-primary",
                      pkg.id === 'enterprise' && "bg-amber-500 hover:bg-amber-600"
                    )}>
                      {pkg.badge}
                    </Badge>
                  </div>
                  <CardHeader className="text-center pt-8">
                    <CardTitle className="text-xl">{pkg.name}</CardTitle>
                    <CardDescription>{pkg.tagline}</CardDescription>
                    <div className="mt-4">
                      <span className="text-3xl font-bold">
                        {formatPrice(pkg.priceMad)}
                      </span>
                      <p className="text-xs text-muted-foreground mt-1">
                        {pkg.pages}
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <p className="text-sm text-muted-foreground mb-4">
                      {pkg.description}
                    </p>
                    <ul className="space-y-2 flex-1">
                      {pkg.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 space-y-2">
                      <Link to="/web-studio/offres">
                        <Button 
                          className={cn("w-full", pkg.color.button)}
                        >
                          Choisir {pkg.name}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                      <p className="text-xs text-center text-muted-foreground">
                        {pkg.deliveryIcon} Livraison: {pkg.delivery}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Maintenance Option */}
          <Card className="mt-8 p-6 bg-gradient-to-r from-blue-500/5 to-primary/5 border-blue-500/20">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Star className="w-5 h-5 text-blue-500" />
                  Maintenance Mensuelle
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Gardez votre site à jour et sécurisé
                </p>
                <ul className="mt-3 grid sm:grid-cols-2 gap-2">
                  {WEB_MAINTENANCE.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <Check className="w-3 h-3 text-blue-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="text-center md:text-right shrink-0">
                <div className="text-3xl font-bold">
                  {formatPrice(WEB_MAINTENANCE.monthly.priceMad)}
                </div>
                <p className="text-sm text-muted-foreground">/mois</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* ==================== SECTION 3: PACKS PROMO ==================== */}
        <TabsContent value="packs" className="space-y-8">
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-gradient-to-r from-emerald-500 to-blue-500">
              <BadgePercent className="w-3 h-3 mr-1" />
              Économies jusqu'à -32%
            </Badge>
            <h2 className="text-2xl font-bold mb-2">Packs Promo Fusion</h2>
            <p className="text-muted-foreground">
              Cartes NFC + Site Web = La solution complète à prix réduit
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {promoPacks.map((pack, index) => (
              <motion.div
                key={pack.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={cn(
                  "relative h-full flex flex-col transition-all hover:shadow-lg",
                  pack.id === 'premium' && "border-blue-500 ring-2 ring-blue-500/20",
                  pack.color.border
                )}>
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className={cn(
                      "whitespace-nowrap",
                      pack.id === 'business' && "bg-emerald-500",
                      pack.id === 'premium' && "bg-blue-500",
                      pack.id === 'custom' && "bg-amber-500"
                    )}>
                      {pack.badge}
                    </Badge>
                  </div>
                  <CardHeader className={cn("pt-8", pack.color.bg)}>
                    <CardTitle className="text-xl text-center">{pack.name}</CardTitle>
                    <CardDescription className="text-center">{pack.tagline}</CardDescription>
                    
                    {pack.priceMad ? (
                      <div className="text-center mt-4">
                        {pack.valueTotal && (
                          <p className="text-sm text-muted-foreground line-through">
                            {formatPrice(pack.valueTotal)}
                          </p>
                        )}
                        <span className="text-3xl font-bold">
                          {formatPrice(pack.priceMad)}
                        </span>
                        {pack.savingsMad && (
                          <Badge variant="secondary" className="ml-2 text-green-600 bg-green-100">
                            -{pack.savingsPercent}%
                          </Badge>
                        )}
                        {pack.savingsMad && (
                          <p className="text-sm text-green-600 font-medium mt-1">
                            Économie: {formatPrice(pack.savingsMad)}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="text-center mt-4">
                        <span className="text-2xl font-bold">Sur devis</span>
                        <p className="text-sm text-muted-foreground">Projet personnalisé</p>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col pt-6">
                    <p className="text-sm text-muted-foreground mb-4">
                      {pack.description}
                    </p>
                    
                    {/* Pack Contents */}
                    {pack.includes.website && (
                      <div className="p-3 bg-muted/50 rounded-lg mb-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-blue-500" />
                            {pack.includes.website.name}
                          </span>
                          <span className="text-muted-foreground">
                            {formatPrice(pack.includes.website.valueMad)}
                          </span>
                        </div>
                      </div>
                    )}
                    {pack.includes.nfcCards && (
                      <div className="p-3 bg-muted/50 rounded-lg mb-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-emerald-500" />
                            {pack.includes.nfcCards.name}
                          </span>
                          <span className="text-muted-foreground">
                            {formatPrice(pack.includes.nfcCards.valueMad)}
                          </span>
                        </div>
                      </div>
                    )}
                    {pack.includes.maintenance && (
                      <div className="p-3 bg-muted/50 rounded-lg mb-4">
                        <div className="flex justify-between items-center text-sm">
                          <span className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-amber-500" />
                            {pack.includes.maintenance.name}
                          </span>
                          <span className="text-muted-foreground">
                            {formatPrice(pack.includes.maintenance.valueMad)}
                          </span>
                        </div>
                      </div>
                    )}

                    <ul className="space-y-2 flex-1">
                      {pack.features.slice(0, 5).map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6">
                      {pack.priceMad ? (
                        <Button 
                          className={cn("w-full", pack.color.button)}
                          onClick={() => handlePromoPackPayment(pack.id)}
                          disabled={loadingPack === pack.id}
                        >
                          {loadingPack === pack.id ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : null}
                          Choisir ce pack
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      ) : (
                        <Link to="/contact">
                          <Button className={cn("w-full", pack.color.button)}>
                            Demander un devis
                            <MessageSquare className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Comparison Note */}
          <div className="text-center mt-8 p-6 bg-gradient-to-r from-primary/5 to-blue-500/5 rounded-2xl">
            <Crown className="w-8 h-8 text-amber-500 mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-2">Pourquoi choisir un Pack?</h3>
            <p className="text-muted-foreground max-w-xl mx-auto">
              En combinant site web et cartes NFC, vous bénéficiez de réductions 
              importantes et d'une solution cohérente pour votre présence digitale.
            </p>
          </div>
        </TabsContent>
      </Tabs>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-muted/50 to-background">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">
            Besoin d'aide pour choisir?
          </h2>
          <p className="text-muted-foreground mb-8">
            Réservez un appel conseil gratuit de 30 minutes. 
            Nous vous guiderons vers la meilleure solution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg" className="w-full sm:w-auto">
                <Phone className="w-4 h-4 mr-2" />
                Appel Conseil Gratuit
              </Button>
            </Link>
            <a href="https://wa.me/212600000000" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                <MessageSquare className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer Mini */}
      <footer className="py-8 px-4 border-t border-border/40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>© 2025 i-wasp Studio</span>
            <span>·</span>
            <span>Casablanca, Maroc</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/cgv" className="text-sm text-muted-foreground hover:text-foreground">
              CGV
            </Link>
            <Link to="/mentions-legales" className="text-sm text-muted-foreground hover:text-foreground">
              Mentions légales
            </Link>
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              Confidentialité
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
