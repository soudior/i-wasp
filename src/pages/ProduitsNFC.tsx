/**
 * Produits NFC — Catalogue des solutions i-wasp
 * Palette Stealth Luxury : Noir Émeraude #050807, Argent Titane #A5A9B4, Platine #D1D5DB
 */

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ClubNavbar } from "@/components/ClubNavbar";
import { GlobalFooter } from "@/components/GlobalFooter";
import { 
  CreditCard, 
  Tag, 
  Watch, 
  Smartphone,
  ArrowRight,
  Check,
  Sparkles,
  ChefHat,
  Building2,
  Calendar,
  Palette
} from "lucide-react";

// Stealth Luxury Palette
const STEALTH = {
  bg: "#050807",
  bgAlt: "#0A0D0C",
  accent: "#A5A9B4",
  accentLight: "#D1D5DB",
  border: "rgba(165, 169, 180, 0.12)",
  glass: "rgba(255, 255, 255, 0.02)"
};

const WHATSAPP_PROJECT_URL = "https://wa.me/33626424394?text=Bonjour%20👋%0AJe%20souhaite%20commander%20des%20produits%20NFC%20i-wasp.";

// Products
const products = [
  {
    id: "carte-visite",
    icon: CreditCard,
    title: "Carte de visite NFC",
    subtitle: "L'essentiel premium",
    description: "Une carte élégante qui partage ton profil digital en un tap. Design personnalisé, finition luxe.",
    features: [
      "Design sur mesure",
      "Finition mat ou brillant",
      "QR code de secours",
      "Profil digital illimité"
    ],
    price: "À partir de 49€",
    popular: true
  },
  {
    id: "tag-nfc",
    icon: Tag,
    title: "Tags NFC",
    subtitle: "Discret et polyvalent",
    description: "Stickers NFC à coller partout : vitrines, produits, affiches. Redirige vers n'importe quelle URL.",
    features: [
      "Pack de 5 ou 10 tags",
      "Résistant eau et UV",
      "Programmable à volonté",
      "Statistiques de scan"
    ],
    price: "À partir de 29€",
    popular: false
  },
  {
    id: "wearable",
    icon: Watch,
    title: "Wearables NFC",
    subtitle: "Toujours sur toi",
    description: "Bracelets, bagues et accessoires connectés. Partage tes infos sans sortir de carte.",
    features: [
      "Bracelet silicone ou cuir",
      "Bague métal premium",
      "Étanche et durable",
      "Style personnalisable"
    ],
    price: "À partir de 69€",
    popular: false
  },
  {
    id: "badge-event",
    icon: Smartphone,
    title: "Badges événement",
    subtitle: "Pour les pros",
    description: "Badges NFC pour conférences, salons et événements. Collecte de leads automatisée.",
    features: [
      "Impression recto-verso",
      "Lanyard inclus",
      "Export contacts Excel",
      "Intégration CRM"
    ],
    price: "Sur devis",
    popular: false
  }
];

// Use cases
const useCases = [
  {
    icon: ChefHat,
    sector: "Restauration",
    example: "Menu digital, avis Google, programme fidélité"
  },
  {
    icon: Building2,
    sector: "Immobilier",
    example: "Fiche bien, prise de RDV, dossier locataire"
  },
  {
    icon: Calendar,
    sector: "Événementiel",
    example: "Invitation VIP, check-in, networking"
  },
  {
    icon: Palette,
    sector: "Créateurs",
    example: "Portfolio, boutique, réseaux sociaux"
  }
];

export default function ProduitsNFC() {
  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: STEALTH.bg }}>
      <ClubNavbar />
      
      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{ 
                backgroundColor: `${STEALTH.accent}10`, 
                border: `1px solid ${STEALTH.border}` 
              }}
            >
              <CreditCard className="w-4 h-4" style={{ color: STEALTH.accent }} />
              <span className="text-sm" style={{ color: STEALTH.accentLight }}>Catalogue NFC</span>
            </div>
            
            <h1 
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
              style={{ fontFamily: "'Bodoni Moda', serif" }}
            >
              Des produits NFC<br />
              <span style={{ color: STEALTH.accent }}>pour chaque usage</span>
            </h1>
            
            <p className="text-xl max-w-2xl mx-auto mb-10" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Cartes de visite, tags, wearables... Choisis ton support, 
              on s'occupe du design et de la programmation.
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Products Grid */}
      <section className="py-16 px-6" style={{ backgroundColor: STEALTH.bgAlt }}>
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative p-8 rounded-3xl transition-all"
                style={{
                  background: product.popular 
                    ? `linear-gradient(135deg, ${STEALTH.accent}15 0%, ${STEALTH.glass} 100%)`
                    : STEALTH.glass,
                  border: `1px solid ${product.popular ? STEALTH.accent + '30' : STEALTH.border}`
                }}
              >
                {product.popular && (
                  <div 
                    className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ backgroundColor: STEALTH.accent, color: STEALTH.bg }}
                  >
                    Populaire
                  </div>
                )}
                
                <div className="flex items-start gap-4 mb-6">
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${STEALTH.accent}20 0%, ${STEALTH.accent}10 100%)` }}
                  >
                    <product.icon className="w-7 h-7" style={{ color: STEALTH.accent }} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{product.title}</h3>
                    <p className="text-sm" style={{ color: STEALTH.accent }}>{product.subtitle}</p>
                  </div>
                </div>
                
                <p className="mb-6" style={{ color: 'rgba(255,255,255,0.6)' }}>{product.description}</p>
                
                <ul className="space-y-2 mb-6">
                  {product.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
                      <Check className="w-4 h-4 flex-shrink-0" style={{ color: STEALTH.accent }} />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <div 
                  className="flex items-center justify-between pt-4"
                  style={{ borderTop: `1px solid ${STEALTH.border}` }}
                >
                  <span className="text-lg font-semibold" style={{ color: STEALTH.accent }}>{product.price}</span>
                  <a href={WHATSAPP_PROJECT_URL} target="_blank" rel="noopener noreferrer">
                    <Button 
                      size="sm" 
                      className="gap-2"
                      style={{ backgroundColor: STEALTH.accent, color: STEALTH.bg }}
                    >
                      Commander
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Use Cases */}
      <section className="py-24 px-6" style={{ backgroundColor: STEALTH.bg }}>
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 
              className="text-3xl sm:text-4xl font-bold mb-4"
              style={{ fontFamily: "'Bodoni Moda', serif" }}
            >
              <span style={{ color: STEALTH.accent }}>Exemples</span> d'usages
            </h2>
            <p className="max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Chaque secteur a ses besoins. Voici comment nos clients utilisent le NFC.
            </p>
          </motion.div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase, index) => (
              <motion.div
                key={useCase.sector}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl text-center"
                style={{ 
                  backgroundColor: STEALTH.glass, 
                  border: `1px solid ${STEALTH.border}` 
                }}
              >
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: `${STEALTH.accent}10` }}
                >
                  <useCase.icon className="w-6 h-6" style={{ color: STEALTH.accent }} />
                </div>
                <h3 className="font-semibold text-white mb-2">{useCase.sector}</h3>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{useCase.example}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-20 px-6" style={{ backgroundColor: STEALTH.bgAlt }}>
        <div className="container mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Sparkles className="w-10 h-10 mx-auto mb-6" style={{ color: STEALTH.accent }} />
            <h2 
              className="text-3xl font-bold mb-4"
              style={{ fontFamily: "'Bodoni Moda', serif" }}
            >
              Un projet sur mesure ?
            </h2>
            <p className="mb-8" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Notre conciergerie analyse tes besoins et te propose la solution idéale.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/conciergerie">
                <Button 
                  size="lg" 
                  className="font-semibold px-8 gap-2"
                  style={{ backgroundColor: STEALTH.accent, color: STEALTH.bg }}
                >
                  Parler à la conciergerie
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      
      <GlobalFooter variant="dark" />
    </div>
  );
}
