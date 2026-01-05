/**
 * Produits NFC — Catalogue des solutions i-wasp
 * Cartes de visite, tags, wearables avec exemples d'usages
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
    <div className="min-h-screen bg-[#0B0B0B] text-white">
      <ClubNavbar />
      
      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
              <CreditCard className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-amber-300/80">Catalogue NFC</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Des produits NFC<br />
              <span className="text-amber-400">pour chaque usage</span>
            </h1>
            
            <p className="text-xl text-white/60 max-w-2xl mx-auto mb-10">
              Cartes de visite, tags, wearables... Choisis ton support, 
              on s'occupe du design et de la programmation.
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Products Grid */}
      <section className="py-16 px-6 bg-[#121212]">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative p-8 rounded-3xl border transition-all ${
                  product.popular 
                    ? "bg-gradient-to-br from-amber-500/10 to-orange-500/5 border-amber-500/30" 
                    : "bg-white/5 border-white/10 hover:border-amber-500/30"
                }`}
              >
                {product.popular && (
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-amber-500 text-black text-xs font-semibold">
                    Populaire
                  </div>
                )}
                
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center flex-shrink-0">
                    <product.icon className="w-7 h-7 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{product.title}</h3>
                    <p className="text-amber-400/80 text-sm">{product.subtitle}</p>
                  </div>
                </div>
                
                <p className="text-white/60 mb-6">{product.description}</p>
                
                <ul className="space-y-2 mb-6">
                  {product.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-white/70">
                      <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <span className="text-lg font-semibold text-amber-400">{product.price}</span>
                  <a href={WHATSAPP_PROJECT_URL} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-black gap-2">
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
      <section className="py-24 px-6 bg-[#0B0B0B]">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="text-amber-400">Exemples</span> d'usages
            </h2>
            <p className="text-white/60 max-w-xl mx-auto">
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
                className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
                  <useCase.icon className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="font-semibold mb-2">{useCase.sector}</h3>
                <p className="text-sm text-white/50">{useCase.example}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-20 px-6 bg-[#121212]">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Sparkles className="w-10 h-10 text-amber-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">
              Un projet sur mesure ?
            </h2>
            <p className="text-white/60 mb-8">
              Notre conciergerie analyse tes besoins et te propose la solution idéale.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/conciergerie">
                <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-8 gap-2">
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
