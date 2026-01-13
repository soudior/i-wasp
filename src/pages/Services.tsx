/**
 * Services Page
 * Liste des services i-wasp avec formulaire de devis WhatsApp
 */

import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Globe, 
  ShoppingCart, 
  Smartphone, 
  Palette, 
  FileText,
  ArrowRight,
  Check,
  Sparkles,
  MessageCircle
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Service {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  pricing: string;
}

const services: Service[] = [
  {
    id: "sites",
    icon: Globe,
    title: "Création de Sites Web",
    subtitle: "Vitrines, corporate & landing pages",
    description: "Des sites web modernes et performants qui reflètent l'excellence de votre marque et convertissent vos visiteurs en clients.",
    features: [
      "Design sur mesure et responsive",
      "Optimisation SEO intégrée",
      "Performances optimales (Core Web Vitals)",
      "Interface d'administration intuitive",
      "Hébergement et maintenance inclus",
    ],
    pricing: "À partir de 15 000 MAD",
  },
  {
    id: "ecommerce",
    icon: ShoppingCart,
    title: "Boutiques E-commerce",
    subtitle: "Vendez en ligne efficacement",
    description: "Des boutiques en ligne complètes avec paiement sécurisé, gestion des stocks et expérience d'achat optimisée.",
    features: [
      "Catalogue produits illimité",
      "Paiement sécurisé multi-devises",
      "Gestion des commandes simplifiée",
      "Intégration livraison Maroc",
      "Analytics et reporting",
    ],
    pricing: "À partir de 25 000 MAD",
  },
  {
    id: "apps",
    icon: Smartphone,
    title: "Applications Sur Mesure",
    subtitle: "Web apps & mobiles",
    description: "Du MVP à l'application complète, nous développons des solutions digitales adaptées à vos processus métier.",
    features: [
      "Applications web progressives (PWA)",
      "Apps mobiles iOS & Android",
      "Tableaux de bord et CRM",
      "Automatisation de processus",
      "API et intégrations tierces",
    ],
    pricing: "Sur devis",
  },
  {
    id: "branding",
    icon: Palette,
    title: "Identité Visuelle",
    subtitle: "Branding & charte graphique",
    description: "Créez une identité de marque mémorable qui vous distingue et renforce la confiance de vos clients.",
    features: [
      "Création de logo unique",
      "Charte graphique complète",
      "Palette de couleurs & typographies",
      "Templates réseaux sociaux",
      "Guidelines d'utilisation",
    ],
    pricing: "À partir de 8 000 MAD",
  },
  {
    id: "print",
    icon: FileText,
    title: "Supports de Communication",
    subtitle: "Print & cartes NFC premium",
    description: "Des supports imprimés et digitaux qui marquent les esprits, incluant nos cartes de visite NFC signature.",
    features: [
      "Cartes de visite NFC premium",
      "Flyers et brochures",
      "Bannières et roll-ups",
      "Packaging et étiquettes",
      "Visuels publicitaires",
    ],
    pricing: "À partir de 2 000 MAD",
  },
];

const Services = () => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [quoteForm, setQuoteForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    description: "",
  });

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;

    const name = quoteForm.name.trim().slice(0, 100);
    const email = quoteForm.email.trim().slice(0, 255);
    const phone = quoteForm.phone.trim().slice(0, 20);
    const company = quoteForm.company.trim().slice(0, 100);
    const description = quoteForm.description.trim().slice(0, 1000);

    const message = `📋 *DEMANDE DE DEVIS*

🎯 *Service:* ${selectedService.title}
💼 *Catégorie:* ${selectedService.subtitle}
💰 *Budget indicatif:* ${selectedService.pricing}

👤 *Client:*
• Nom: ${name}
• Email: ${email}
• Téléphone: ${phone}
${company ? `• Entreprise: ${company}` : ""}

📝 *Description du projet:*
${description}`;

    const whatsappUrl = `https://wa.me/33626424394?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
    setSelectedService(null);
    setQuoteForm({ name: "", email: "", phone: "", company: "", description: "" });
  };

  return (
    <Layout>
      {/* Quote Modal */}
      <Dialog open={!!selectedService} onOpenChange={(open) => !open && setSelectedService(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Demander un devis
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleQuoteSubmit} className="space-y-4 mt-4">
            {selectedService && (
              <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 border border-border">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <selectedService.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{selectedService.title}</p>
                  <p className="text-sm text-primary font-medium">
                    {selectedService.pricing}
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
                  value={quoteForm.name}
                  onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone *</Label>
                <Input
                  id="phone"
                  required
                  placeholder="+212 6..."
                  value={quoteForm.phone}
                  onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
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
                value={quoteForm.email}
                onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Entreprise</Label>
              <Input
                id="company"
                placeholder="Nom de votre entreprise"
                value={quoteForm.company}
                onChange={(e) => setQuoteForm({ ...quoteForm, company: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Décrivez votre projet *</Label>
              <Textarea
                id="description"
                required
                rows={4}
                placeholder="Décrivez votre projet, vos objectifs et vos besoins..."
                value={quoteForm.description}
                onChange={(e) => setQuoteForm({ ...quoteForm, description: e.target.value })}
              />
            </div>

            <Button type="submit" className="w-full" size="lg">
              <MessageCircle className="w-4 h-4 mr-2" />
              Envoyer sur WhatsApp
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Hero */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
              <Sparkles size={16} className="text-primary" />
              <span className="text-sm font-medium text-primary">Nos Services</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
              Solutions digitales{" "}
              <span className="text-primary">sur mesure</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              De la stratégie à la réalisation, nous créons l'écosystème digital complet 
              qui propulse votre activité vers le succès.
            </p>
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="pb-24">
        <div className="container mx-auto px-4">
          <div className="space-y-24">
            {services.map((service, index) => (
              <div
                key={service.id}
                id={service.id}
                className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                    <service.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold mb-2 text-foreground">
                    {service.title}
                  </h2>
                  <p className="text-primary font-medium mb-4">{service.subtitle}</p>
                  <p className="text-muted-foreground text-lg mb-8">
                    {service.description}
                  </p>
                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center gap-6">
                    <span className="text-lg font-semibold text-primary">
                      {service.pricing}
                    </span>
                    <Button onClick={() => setSelectedService(service)}>
                      <MessageCircle size={18} className="mr-2" />
                      Demander un devis
                    </Button>
                  </div>
                </div>

                <div className={`${index % 2 === 1 ? "lg:order-1" : ""}`}>
                  <div className="relative">
                    <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 via-transparent to-primary/10 blur-2xl rounded-3xl" />
                    <div className="relative aspect-[4/3] rounded-2xl bg-card border border-border overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <service.icon className="w-24 h-24 text-primary/20" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-card border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-foreground">
            Vous avez un projet en tête ?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Chaque projet est unique. Discutons de vos besoins pour vous proposer 
            une solution parfaitement adaptée à votre budget et vos objectifs.
          </p>
          <Button size="lg" asChild>
            <Link to="/contact">
              Parlons de votre projet
              <ArrowRight size={20} className="ml-2" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
