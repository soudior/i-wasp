/**
 * Boutique - IWASP NFC Products Shop
 * 
 * Premium Apple-like product showcase with CTAs to order tunnel.
 * Follows Cupertino design: minimal, airy, high-end.
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
import cardPVC from "@/assets/cards/card-black-matte.png";
import cardMetal from "@/assets/cards/card-gold-accent.png";
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
    image: cardPVC,
    features: [
      "Impression recto-verso",
      "Puce NFC haute fréquence",
      "Design personnalisable",
      "Livraison sous 5 jours"
    ],
    popular: false,
    color: "from-slate-900 to-slate-700"
  },
  {
    id: "metal",
    name: "Carte NFC Metal",
    subtitle: "Le prestige ultime",
    description: "Carte en métal brossé avec gravure laser et finition premium.",
    price: 89,
    currency: "€",
    image: cardMetal,
    features: [
      "Métal brossé premium",
      "Gravure laser précise",
      "Finition or ou argent",
      "Écrin de présentation"
    ],
    popular: true,
    color: "from-amber-600 to-yellow-500"
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
    color: "from-pink-500 to-rose-400"
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
    <div className="min-h-screen bg-[#F5F5F7]">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-[#1D1D1F] tracking-tight mb-4">
            Produits NFC
          </h1>
          <p className="text-lg md:text-xl text-[#8E8E93] max-w-xl mx-auto">
            Connectez le monde réel au digital. 
            Un simple geste suffit.
          </p>
        </motion.div>
      </section>

      {/* Benefits Bar */}
      <section className="pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="grid grid-cols-3 gap-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <benefit.icon className="w-6 h-6 text-[#007AFF] mx-auto mb-2" />
                  <h3 className="text-sm font-semibold text-[#1D1D1F]">{benefit.title}</h3>
                  <p className="text-xs text-[#8E8E93] hidden md:block">{benefit.description}</p>
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
                    <span className="bg-[#007AFF] text-white text-xs font-medium px-3 py-1 rounded-full">
                      Populaire
                    </span>
                  </div>
                )}

                {/* Card */}
                <div className={`
                  bg-white rounded-3xl overflow-hidden shadow-sm
                  transition-all duration-300 hover:shadow-xl hover:-translate-y-1
                  ${product.popular ? 'ring-2 ring-[#007AFF]' : ''}
                `}>
                  {/* Product Image */}
                  <div className={`
                    h-56 bg-gradient-to-br ${product.color}
                    flex items-center justify-center p-4 overflow-hidden
                  `}>
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-contain drop-shadow-2xl"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="mb-4">
                      <h2 className="text-xl font-bold text-[#1D1D1F]">{product.name}</h2>
                      <p className="text-sm text-[#8E8E93]">{product.subtitle}</p>
                    </div>

                    <p className="text-sm text-[#1D1D1F]/80 mb-4 line-clamp-2">
                      {product.description}
                    </p>

                    {/* Features */}
                    <ul className="space-y-2 mb-6">
                      {product.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-[#8E8E93]">
                          <Check className="w-4 h-4 text-[#007AFF] flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Price */}
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-3xl font-bold text-[#1D1D1F]">
                        {product.price}
                      </span>
                      <span className="text-lg text-[#8E8E93]">{product.currency}</span>
                    </div>

                    {/* CTA */}
                    <Link to={`/order/type?product=${product.id}`}>
                      <Button 
                        className={`
                          w-full h-12 rounded-xl font-medium
                          ${product.popular 
                            ? 'bg-[#007AFF] hover:bg-[#0066CC] text-white' 
                            : 'bg-[#1D1D1F] hover:bg-[#1D1D1F]/90 text-white'
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
          <div className="bg-white rounded-3xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-[#1D1D1F] mb-2">
              Besoin d'aide pour choisir ?
            </h2>
            <p className="text-[#8E8E93] mb-6">
              Notre équipe est là pour vous accompagner dans votre projet.
            </p>
            <Link to="/contact">
              <Button variant="outline" className="rounded-xl border-[#1D1D1F]/20">
                Nous contacter
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="pb-8 text-center">
        <p className="text-xs text-[#8E8E93]">
          Powered by IWASP
        </p>
      </footer>
    </div>
  );
}
