import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Comment fonctionne la carte NFC IWASP ?",
    answer: "Il suffit d'approcher votre carte NFC du smartphone de votre interlocuteur. Votre page de profil s'ouvre instantanément dans leur navigateur, sans application à télécharger. Compatible avec tous les smartphones récents.",
  },
  {
    question: "Puis-je modifier mes informations après l'achat ?",
    answer: "Absolument ! Vos informations sont modifiables à tout moment depuis votre tableau de bord. Les changements sont reflétés instantanément, sans avoir à reprogrammer la puce NFC.",
  },
  {
    question: "La carte fonctionne-t-elle avec tous les téléphones ?",
    answer: "Oui, la carte est compatible avec tous les smartphones équipés de NFC (iPhone 7+ et Android récents). Pour les appareils sans NFC, un QR code de secours est disponible au dos de la carte.",
  },
  {
    question: "Comment fonctionne l'intégration Wallet ?",
    answer: "Votre carte peut être ajoutée à Apple Wallet ou Google Wallet. Elle sera ainsi accessible depuis l'écran verrouillé de votre téléphone, parfait pour partager vos coordonnées même sans la carte physique.",
  },
  {
    question: "Livrez-vous au Maroc ?",
    answer: "Oui, nous livrons partout au Maroc. Le paiement à la livraison (Cash on Delivery) est disponible. Les délais de livraison sont de 2-5 jours ouvrés selon votre localisation.",
  },
  {
    question: "Quelle est la durée de vie de la carte ?",
    answer: "Nos cartes NFC sont conçues pour durer. La puce NFC n'a pas de batterie et ne s'use pas. La carte physique est fabriquée en PVC haute qualité résistant à l'usure quotidienne.",
  },
];

export function FAQSection() {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-surface-1" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-6">
            FAQ
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-semibold mb-6">
            Questions fréquentes
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Tout ce que vous devez savoir sur les cartes NFC IWASP
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-surface-2/50 border border-foreground/5 rounded-2xl px-6 data-[state=open]:border-amber-500/20"
              >
                <AccordionTrigger className="text-left text-foreground hover:text-amber-400 py-6 [&[data-state=open]>svg]:text-amber-400">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
