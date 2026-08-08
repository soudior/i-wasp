/**
 * FAQ — réponses claires aux questions fréquentes.
 */

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { HOME, reveal } from "./theme";

// Source statique (français) — utilisée pour le schéma JSON-LD FAQPage (SEO en
// langue primaire). L'affichage, lui, est traduit via i18n (voir plus bas).
export const FAQS = [
  {
    q: "Faut-il une application pour utiliser ma carte ?",
    a: "Non. La personne qui reçoit votre carte n'a rien à installer : votre profil s'ouvre directement dans son navigateur en approchant la carte de son téléphone, ou en scannant le QR code.",
  },
  {
    q: "La carte est-elle compatible avec tous les téléphones ?",
    a: "Le NFC fonctionne sur la quasi-totalité des smartphones récents (iOS et Android). Pour les rares appareils sans NFC actif, le QR code au dos ouvre le même profil.",
  },
  {
    q: "Puis-je modifier mes informations après l'achat ?",
    a: "Oui, autant de fois que vous le souhaitez. Votre profil se met à jour en temps réel, sans jamais reprogrammer la carte physique.",
  },
  {
    q: "Que se passe-t-il si je perds ma carte ?",
    a: "Vous pouvez suspendre la carte depuis votre tableau de bord pour désactiver le partage, puis la remplacer sans perdre votre profil.",
  },
  {
    q: "Mes données sont-elles en sécurité ?",
    a: "Aucune donnée personnelle n'est stockée dans la puce : elle ne contient qu'un lien court vers votre profil, que vous contrôlez entièrement.",
  },
  {
    q: "Quels sont les délais de livraison ?",
    a: "Selon le modèle, comptez 2 à 7 jours ouvrés. Les cartes Prestige sont expédiées en express.",
  },
];

export function FaqSection() {
  const { shouldReduceMotion } = useReducedMotion();
  const { t } = useTranslation();
  const items = t("homepage.faq.items", { returnObjects: true }) as { q: string; a: string }[];

  return (
    <section id="faq" className="relative py-24 sm:py-28 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={reveal(shouldReduceMotion)}
        >
          <div className="text-center mb-12">
            <p className="font-mono text-[10px] tracking-[0.4em] uppercase mb-5" style={{ color: HOME.accent, opacity: 0.7 }}>
              {t("homepage.faq.eyebrow")}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight" style={{ color: HOME.text }}>
              {t("homepage.faq.title")}
            </h2>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {items.map((item, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                style={{ borderBottom: `1px solid ${HOME.border}` }}
              >
                <AccordionTrigger
                  className="text-left font-display text-base sm:text-lg hover:no-underline py-5"
                  style={{ color: HOME.text }}
                >
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="font-body text-sm sm:text-base font-light leading-relaxed pb-5" style={{ color: HOME.textMuted }}>
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}

export default FaqSection;
