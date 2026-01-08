/**
 * Boutique - IWASP NFC Products Shop
 * 
 * Premium Apple-like product showcase with CTAs to order tunnel.
 * Follows design system tokens for consistent theming.
 */

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowRight,
  Shield,
  Zap,
  Globe,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Product images
import cardPVCFront from "@/assets/products/card-pvc-front.png";
import cardMetalFront from "@/assets/products/card-metal-front.png";
import nailsHero from "@/assets/nails/nails-hero.png";

// Product data
const products = [
  {
    id: "pvc",
    name: "Carte NFC PVC",
    subtitle: "L'essentiel, élégant",
    description: "Carte professionnelle en PVC haute qualité avec puce NFC intégrée.",
    price: 29,
    currency: "€",
    image: cardPVCFront,
    features: [
      "Impression recto-verso",
      "Puce NFC haute fréquence",
      "Design personnalisable",
      "Livraison sous 5 jours"
    ],
    popular: false,
  },
  {
    id: "metal",
    name: "Carte NFC Metal",
    subtitle: "Le prestige ultime",
    description: "Carte en métal brossé avec gravure laser et finition premium.",
    price: 89,
    currency: "€",
    image: cardMetalFront,
    features: [
      "Métal brossé premium",
      "Gravure laser précise",
      "Finition or ou argent",
      "Écrin de présentation"
    ],
    popular: true,
  },
  {
    id: "nails",
    name: "NFC Nails",
    subtitle: "L'innovation beauté",
    description: "Ongles connectés avec puce NFC invisible. La technologie au bout des doigts.",
    price: 49,
    currency: "€",
    image: nailsHero,
    features: [
      "Pose par professionnels",
      "Puce invisible intégrée",
      "Compatible tous smartphones",
      "Réseau de salons partenaires"
    ],
    popular: false,
  }
];

const benefits = [
  {
    icon: Zap,
    title: "Sans contact",
    description: "Un simple tap pour partager vos infos"
  },
  {
    icon: Globe,
    title: "Universel",
    description: "Compatible avec tous les smartphones"
  },
  {
    icon: Shield,
    title: "Sécurisé",
    description: "Vos données restent privées"
  }
];

export default function Boutique() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-4">
            Produits NFC
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto">
            Connectez le monde réel au digital. 
            Un simple geste suffit.
          </p>
        </motion.div>
      </section>

      {/* Benefits Bar */}
      <section className="pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-2xl p-6 border border-border">
            <div className="grid grid-cols-3 gap-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <benefit.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                  <h3 className="text-sm font-semibold text-foreground">{benefit.title}</h3>
                  <p className="text-xs text-muted-foreground hidden md:block">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                {/* Popular Badge */}
                {product.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                      Populaire
                    </span>
                  </div>
                )}

                {/* Card */}
                <div className={`
                  bg-card rounded-3xl overflow-hidden border border-border
                  transition-all duration-300 hover:border-primary/50 hover:-translate-y-1
                  ${product.popular ? 'ring-2 ring-primary' : ''}
                `}>
                  {/* Product Image */}
                  <div className="h-56 bg-secondary flex items-center justify-center p-4 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-contain drop-shadow-2xl"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="mb-4">
                      <h2 className="text-xl font-bold text-foreground">{product.name}</h2>
                      <p className="text-sm text-muted-foreground">{product.subtitle}</p>
                    </div>

                    <p className="text-sm text-foreground/80 mb-4 line-clamp-2">
                      {product.description}
                    </p>

                    {/* Features */}
                    <ul className="space-y-2 mb-6">
                      {product.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Check className="w-4 h-4 text-primary flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Price */}
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-3xl font-bold text-foreground">
                        {product.price}
                      </span>
                      <span className="text-lg text-muted-foreground">{product.currency}</span>
                    </div>

                    {/* CTA */}
                    <Link to={`/order/type?product=${product.id}`}>
                      <Button 
                        className={`
                          w-full h-12 rounded-xl font-medium
                          ${product.popular 
                            ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                            : 'bg-foreground text-background hover:bg-foreground/90'
                          }
                        `}
                      >
                        Commander
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="pb-24 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="bg-card rounded-3xl p-8 border border-border">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Besoin d'aide pour choisir ?
            </h2>
            <p className="text-muted-foreground mb-6">
              Notre équipe est là pour vous accompagner dans votre projet.
            </p>
            <Link to="/contact">
              <Button variant="outline" className="rounded-xl">
                Nous contacter
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="pb-8 text-center">
        <p className="text-xs text-muted-foreground">
          Powered by IWASP
        </p>
      </footer>
    </div>
  );
}
