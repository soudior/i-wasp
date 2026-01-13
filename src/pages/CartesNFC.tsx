/**
 * CartesNFC Page
 * Catalogue des cartes NFC premium avec commande WhatsApp
 */

import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import { 
  Check, 
  Smartphone, 
  Zap, 
  Shield, 
  Sparkles, 
  ArrowRight, 
  MessageCircle, 
  HelpCircle,
  CreditCard
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Product {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  currency: string;
  color: string;
  features: string[];
  popular: boolean;
}

const products: Product[] = [
  {
    id: "classique",
    name: "Classique",
    subtitle: "PVC Premium",
    price: "249",
    currency: "MAD",
    color: "Noir mat + Or",
    features: [
      "PVC haute qualité",
      "Puce NFC NTAG 216",
      "Design personnalisé",
      "QR code de secours",
      "Livraison gratuite",
    ],
    popular: false,
  },
  {
    id: "premium",
    name: "Premium",
    subtitle: "PVC Luxe",
    price: "349",
    currency: "MAD",
    color: "Blanc nacré + Argent",
    features: [
      "PVC premium épais",
      "Puce NFC NTAG 424",
      "Design sur-mesure",
      "Finition soft-touch",
      "Support prioritaire",
      "Page de profil incluse",
    ],
    popular: true,
  },
  {
    id: "metal",
    name: "Métal",
    subtitle: "Acier brossé",
    price: "599",
    currency: "MAD",
    color: "Or brossé",
    features: [
      "Acier inoxydable",
      "Puce NFC NTAG 424",
      "Gravure laser personnalisée",
      "Finition miroir ou brossée",
      "Étui de luxe inclus",
      "Page de profil premium",
      "Support VIP à vie",
    ],
    popular: false,
  },
];

const features = [
  {
    icon: Smartphone,
    title: "Compatible tous smartphones",
    description: "iPhone et Android récents, aucune application requise.",
  },
  {
    icon: Zap,
    title: "Partage instantané",
    description: "Un tap suffit pour partager vos coordonnées professionnelles.",
  },
  {
    icon: Shield,
    title: "Données sécurisées",
    description: "Vos informations sont protégées et modifiables à tout moment.",
  },
  {
    icon: Sparkles,
    title: "Design premium",
    description: "Finitions haut de gamme pour une première impression mémorable.",
  },
];

const faqs = [
  {
    question: "Comment fonctionne une carte NFC ?",
    answer: "La carte NFC contient une puce qui communique avec les smartphones via la technologie Near Field Communication. Il suffit d'approcher la carte du téléphone (iPhone ou Android) pour que votre profil professionnel s'ouvre automatiquement dans le navigateur. Aucune application n'est nécessaire côté destinataire.",
  },
  {
    question: "Est-ce compatible avec tous les smartphones ?",
    answer: "Oui ! Tous les iPhones depuis l'iPhone 7 et la majorité des smartphones Android récents sont compatibles NFC. De plus, chaque carte inclut un QR code de secours pour les appareils plus anciens ou ceux qui n'ont pas le NFC activé.",
  },
  {
    question: "Puis-je modifier mes informations après achat ?",
    answer: "Absolument ! Votre profil numérique est hébergé sur notre plateforme et vous pouvez le modifier à tout moment : coordonnées, réseaux sociaux, liens, photo, etc. La carte physique reste la même, seul le contenu affiché change.",
  },
  {
    question: "Quel est le délai de livraison ?",
    answer: "Les cartes PVC (Classique et Premium) sont livrées sous 5-7 jours ouvrés. Les cartes Métal, fabriquées sur mesure, nécessitent 10-15 jours ouvrés. La livraison est gratuite partout au Maroc.",
  },
  {
    question: "Quelle est la durée de vie de la carte ?",
    answer: "La puce NFC a une durée de vie quasi illimitée (plus de 100 000 lectures). Les cartes PVC durent plusieurs années avec un usage normal. Les cartes Métal sont pratiquement indestructibles et sont garanties à vie.",
  },
  {
    question: "Comment commander ?",
    answer: "C'est simple ! Cliquez sur 'Commander' pour nous contacter via WhatsApp. Précisez le modèle souhaité et nous vous guiderons pour la personnalisation, le paiement et la livraison.",
  },
];

export default function CartesNFC() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [orderForm, setOrderForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    notes: "",
  });

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const name = orderForm.name.trim().slice(0, 100);
    const email = orderForm.email.trim().slice(0, 255);
    const phone = orderForm.phone.trim().slice(0, 20);
    const company = orderForm.company.trim().slice(0, 100);
    const notes = orderForm.notes.trim().slice(0, 500);

    const message = `🛒 *COMMANDE CARTE NFC*

📦 *Produit:* ${selectedProduct.name} (${selectedProduct.subtitle})
💰 *Prix:* ${selectedProduct.price} ${selectedProduct.currency}
🎨 *Couleur:* ${selectedProduct.color}

👤 *Client:*
• Nom: ${name}
• Email: ${email}
• Téléphone: ${phone}
${company ? `• Entreprise: ${company}` : ""}
${notes ? `\n📝 *Notes:* ${notes}` : ""}`;

    const whatsappUrl = `https://wa.me/33626424394?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
    setSelectedProduct(null);
    setOrderForm({ name: "", email: "", phone: "", company: "", notes: "" });
  };

  return (
    <Layout>
      {/* Order Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Commander {selectedProduct?.name}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleOrderSubmit} className="space-y-4 mt-4">
            {selectedProduct && (
              <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 border border-border">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <CreditCard className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{selectedProduct.name}</p>
                  <p className="text-lg font-bold text-primary">
                    {selectedProduct.price} {selectedProduct.currency}
                  </p>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom *</Label>
                <Input
                  id="name"
                  required
                  placeholder="Votre nom"
                  value={orderForm.name}
                  onChange={(e) => setOrderForm({ ...orderForm, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone *</Label>
                <Input
                  id="phone"
                  required
                  placeholder="+212 6..."
                  value={orderForm.phone}
                  onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                required
                placeholder="votre@email.com"
                value={orderForm.email}
                onChange={(e) => setOrderForm({ ...orderForm, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Entreprise</Label>
              <Input
                id="company"
                placeholder="Nom de votre entreprise"
                value={orderForm.company}
                onChange={(e) => setOrderForm({ ...orderForm, company: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes / Personnalisation</Label>
              <Textarea
                id="notes"
                rows={3}
                placeholder="Couleurs préférées, informations à graver..."
                value={orderForm.notes}
                onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })}
              />
            </div>

            <Button type="submit" className="w-full" size="lg">
              <MessageCircle className="w-4 h-4 mr-2" />
              Envoyer sur WhatsApp
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Hero Section */}
      <section className="pt-32 pb-16 lg:pb-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Text Content */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Collection Premium</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Cartes de visite{" "}
                <span className="text-primary">NFC Premium</span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-xl">
                Impressionnez vos contacts avec une carte de visite connectée. Un simple tap 
                sur n'importe quel smartphone suffit pour partager votre profil professionnel.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Button size="lg" asChild>
                  <a href="#produits">
                    Voir les modèles
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </a>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a 
                    href="https://wa.me/33626424394?text=Bonjour, je souhaite commander une carte NFC"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Commander sur WhatsApp
                  </a>
                </Button>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden border border-border bg-gradient-to-br from-primary/10 to-transparent aspect-[4/3] flex items-center justify-center">
                <CreditCard className="w-32 h-32 text-primary/30" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
              </div>
              
              {/* Floating Stats */}
              <div className="absolute -bottom-6 -left-6 bg-card rounded-xl p-4 border border-border shadow-lg">
                <div className="text-2xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Cartes livrées</div>
              </div>
              
              <div className="absolute -top-4 -right-4 bg-card rounded-xl p-4 border border-border shadow-lg">
                <div className="text-2xl font-bold text-primary">⭐ 4.9</div>
                <div className="text-sm text-muted-foreground">Satisfaction client</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="text-center space-y-4 p-6 rounded-xl bg-background border border-border hover:border-primary/30 transition-colors"
              >
                <div className="w-14 h-14 mx-auto rounded-xl bg-primary/10 flex items-center justify-center">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section id="produits" className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Choisissez votre carte
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Trois gammes pensées pour tous les budgets, toutes avec la même qualité de service i-wasp.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div 
                key={product.id}
                className={`relative rounded-2xl border ${
                  product.popular 
                    ? "border-primary bg-gradient-to-b from-primary/10 to-transparent" 
                    : "border-border bg-card"
                } overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1`}
              >
                {product.popular && (
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                    Populaire
                  </div>
                )}
                
                {/* Product Visual */}
                <div className="p-6 pb-0">
                  <div className="aspect-[3/2] rounded-xl overflow-hidden bg-muted/50 border border-border flex items-center justify-center">
                    <CreditCard className="w-20 h-20 text-primary/30" />
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6 space-y-6">
                  <div>
                    <div className="text-sm text-primary font-medium mb-1">{product.subtitle}</div>
                    <h3 className="text-2xl font-bold text-foreground">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{product.color}</p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-foreground">{product.price}</span>
                    <span className="text-muted-foreground">{product.currency}</span>
                  </div>

                  <ul className="space-y-3">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm">
                        <Check className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    variant={product.popular ? "default" : "outline"} 
                    size="lg" 
                    className="w-full"
                    onClick={() => setSelectedProduct(product)}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Commander
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Comment ça marche ?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                step: "01",
                title: "Commandez",
                description: "Choisissez votre modèle et envoyez-nous vos informations via WhatsApp.",
              },
              {
                step: "02",
                title: "Personnalisez",
                description: "Notre équipe crée votre design sur mesure et configure votre profil NFC.",
              },
              {
                step: "03",
                title: "Impressionnez",
                description: "Recevez votre carte et partagez vos contacts d'un simple tap.",
              },
            ].map((item, index) => (
              <div key={index} className="relative text-center">
                <div className="text-6xl font-bold text-primary/20 mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
                
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 -right-6 lg:-right-12">
                    <ArrowRight className="w-8 h-8 text-border" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 lg:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <HelpCircle className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Questions fréquentes</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Tout savoir sur nos cartes NFC
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Vous avez des questions ? Nous avons les réponses.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="border border-border rounded-xl px-6 bg-card data-[state=open]:border-primary/30 transition-colors"
                >
                  <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary hover:no-underline py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="mt-12 text-center p-8 rounded-2xl bg-card border border-border">
              <p className="text-muted-foreground mb-4">
                Vous avez d'autres questions ?
              </p>
              <Button size="lg" asChild>
                <a 
                  href="https://wa.me/33626424394?text=Bonjour, j'ai une question concernant les cartes NFC"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contactez-nous sur WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 via-background to-background border border-primary/20 p-8 lg:p-16 text-center">
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Prêt à impressionner ?
              </h2>
              <p className="text-muted-foreground text-lg">
                Commandez votre carte NFC premium dès maintenant et démarquez-vous à chaque rencontre.
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <Button size="lg" asChild>
                  <a 
                    href="https://wa.me/33626424394?text=Bonjour, je souhaite commander une carte NFC premium"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Commander maintenant
                  </a>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/contact">
                    Poser une question
                  </Link>
                </Button>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
          </div>
        </div>
      </section>
    </Layout>
  );
}
