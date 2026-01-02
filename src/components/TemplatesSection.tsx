import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

// Card mockup imports (WebP optimized where available)
import cardBlackMatte from "@/assets/cards/card-black-matte.webp";
import cardWhiteMinimal from "@/assets/cards/card-white-minimal.png";
import cardNavyExecutive from "@/assets/cards/card-navy-executive.png";
import cardGoldAccent from "@/assets/cards/card-gold-accent.png";
import cardHotel from "@/assets/cards/card-hotel.png";
import cardTourism from "@/assets/cards/card-tourism.png";

// Phone preview imports (WebP optimized where available)
import phoneBlack from "@/assets/phones/phone-black.webp";
import phoneWhite from "@/assets/phones/phone-white.png";
import phoneNavy from "@/assets/phones/phone-navy.png";
import phoneGold from "@/assets/phones/phone-gold.png";
import phoneHotel from "@/assets/phones/phone-hotel.png";
import phoneTourism from "@/assets/phones/phone-tourism.png";

const templates = [
  { id: "signature", name: "Signature", category: "Business", cardImage: cardBlackMatte, phoneImage: phoneBlack },
  { id: "minimal", name: "Minimal", category: "Essential", cardImage: cardWhiteMinimal, phoneImage: phoneWhite },
  { id: "executive", name: "Executive", category: "Business", cardImage: cardNavyExecutive, phoneImage: phoneNavy },
  { id: "luxe", name: "Luxe", category: "Premium", cardImage: cardGoldAccent, phoneImage: phoneGold },
  { id: "hotel", name: "Hôtellerie", category: "Hospitality", cardImage: cardHotel, phoneImage: phoneHotel },
  { id: "tourism", name: "Tourisme", category: "Travel", cardImage: cardTourism, phoneImage: phoneTourism },
];

export function TemplatesSection() {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-gradient-radial from-amber-500/[0.05] via-transparent to-transparent blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-6">
            Collection
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-semibold mb-6">
            Templates premium
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choisissez parmi nos designs exclusifs, créés pour impressionner
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group"
            >
              <Link to="/templates" className="block">
                <div className="relative rounded-2xl overflow-hidden bg-surface-1 border border-foreground/5 hover:border-amber-500/20 transition-all duration-500">
                  {/* Card + Phone composite */}
                  <div className="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-surface-2 to-background p-6">
                    {/* Card image */}
                    <motion.img
                      src={template.cardImage}
                      alt={template.name}
                      className="absolute inset-4 w-[60%] h-auto object-contain z-10"
                      whileHover={{ scale: 1.05, rotate: -2 }}
                      transition={{ duration: 0.4 }}
                    />
                    {/* Phone preview - positioned right */}
                    <motion.img
                      src={template.phoneImage}
                      alt={`${template.name} preview`}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-[45%] h-auto object-contain z-20"
                      initial={{ x: 20, opacity: 0.8 }}
                      whileHover={{ x: 0, opacity: 1, scale: 1.02 }}
                      transition={{ duration: 0.4 }}
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent z-30" />
                  </div>

                  {/* Info */}
                  <div className="p-6 relative z-40">
                    <span className="text-xs text-amber-400 font-medium tracking-wider uppercase">
                      {template.category}
                    </span>
                    <h3 className="text-lg font-semibold text-foreground mt-1 group-hover:text-amber-400 transition-colors">
                      {template.name}
                    </h3>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center mt-12"
        >
          <Link to="/templates">
            <Button
              variant="outline"
              size="lg"
              className="border-foreground/20 hover:border-amber-500/40 hover:bg-amber-500/5 px-8 rounded-full font-medium group"
            >
              Voir tous les templates
              <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
