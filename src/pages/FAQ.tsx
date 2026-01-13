import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { SEOHead, SEO_CONFIGS } from "@/components/SEOHead";
import { CoutureNavbar } from "@/components/CoutureNavbar";
import { CoutureFooter } from "@/components/CoutureFooter";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Noir Haute Couture palette
const NOIR_COUTURE = {
  bg: "#0A0A0A",
  surface: "#111111",
  ivory: "#F6F5F2",
  ash: "#9B9B9B",
  border: "rgba(246, 245, 242, 0.08)",
  borderHover: "rgba(246, 245, 242, 0.15)",
};

const faqCategories = [
  {
    title: "Découvrir i-wasp",
    faqs: [
      {
        question: "Qu'est-ce qu'une carte de visite NFC i-wasp ?",
        answer: "Une carte i-wasp est une carte de visite nouvelle génération équipée d'une puce NFC. Il suffit de l'approcher d'un smartphone pour partager instantanément votre profil digital complet : coordonnées, réseaux sociaux, portfolio. Plus besoin de cartes papier jetables.",
      },
      {
        question: "Comment fonctionne la technologie NFC ?",
        answer: "Le NFC (Near Field Communication) permet une communication sans fil à courte portée. Quand votre carte s'approche d'un smartphone compatible, elle transmet instantanément vos informations. Aucune application n'est requise, aucune batterie nécessaire.",
      },
      {
        question: "Pourquoi choisir i-wasp plutôt qu'une carte traditionnelle ?",
        answer: "Contrairement aux cartes papier, une carte i-wasp est évolutive, écologique et mémorable. Modifiez vos informations à tout moment, suivez qui scanne votre carte, et laissez une impression durable. Un investissement unique pour une image professionnelle premium.",
      },
    ],
  },
  {
    title: "Utilisation",
    faqs: [
      {
        question: "Comment activer ma carte i-wasp ?",
        answer: "Votre carte est pré-configurée dès réception. Aucune activation manuelle n'est requise. Approchez simplement votre carte du smartphone de votre interlocuteur pour partager votre profil digital instantanément.",
      },
      {
        question: "Ma carte fonctionne-t-elle avec tous les smartphones ?",
        answer: "Oui. Tous les iPhone depuis le modèle 7 et la grande majorité des smartphones Android depuis 2015 sont compatibles NFC. Pour les appareils plus anciens, un QR code de secours est disponible au dos de chaque carte.",
      },
      {
        question: "Puis-je modifier mes informations après l'achat ?",
        answer: "Absolument. Votre profil digital est entièrement modifiable depuis votre espace personnel. Changez de photo, mettez à jour vos coordonnées, ajoutez de nouveaux liens sociaux — les modifications sont reflétées instantanément, sans remplacer votre carte physique.",
      },
      {
        question: "Que faire si le scan NFC ne fonctionne pas ?",
        answer: "Vérifiez d'abord que le NFC est activé sur le téléphone. Sur iPhone, approchez la carte du haut de l'appareil ; sur Android, du centre arrière. Les coques épaisses peuvent parfois interférer. Notre support est disponible pour vous accompagner.",
      },
    ],
  },
  {
    title: "Personnalisation",
    faqs: [
      {
        question: "Quels designs sont disponibles ?",
        answer: "Nous proposons plusieurs templates exclusifs : Noir Élégance pour un rendu sobre et premium, Ivoire Raffiné pour un contraste lumineux, et Carbone pour les professionnels tech. Chaque design est pensé pour refléter votre identité professionnelle.",
      },
      {
        question: "Puis-je ajouter mon logo d'entreprise ?",
        answer: "Oui. Lors de la création de votre carte, vous pouvez téléverser votre logo au format PNG ou SVG. Il sera intégré élégamment au design de votre carte physique et à votre profil digital.",
      },
      {
        question: "Comment personnaliser mon profil digital ?",
        answer: "Depuis votre tableau de bord, accédez à l'éditeur de carte. Vous pouvez modifier votre photo, titre, entreprise, coordonnées, et ajouter des liens vers vos réseaux sociaux, portfolio, site web ou tout autre contenu pertinent.",
      },
    ],
  },
  {
    title: "Livraison & Commande",
    faqs: [
      {
        question: "Livrez-vous au Maroc ?",
        answer: "Oui, nous livrons partout au Maroc. Le paiement à la livraison (Cash on Delivery) est disponible. Les délais de livraison sont de 2-5 jours ouvrés selon votre localisation.",
      },
      {
        question: "Quels sont les délais de livraison ?",
        answer: "La production de votre carte personnalisée prend 2-3 jours ouvrés. La livraison standard au Maroc est de 2-5 jours supplémentaires. Livraison express disponible sur demande.",
      },
      {
        question: "Le paiement à la livraison est-il disponible ?",
        answer: "Oui. Pour le Maroc, nous acceptons le paiement à la livraison (COD). Vous réglez uniquement à la réception de votre carte. Paiement en ligne sécurisé également disponible.",
      },
    ],
  },
  {
    title: "Technique & Support",
    faqs: [
      {
        question: "Ma carte a-t-elle une durée de vie limitée ?",
        answer: "Non. La puce NFC n'a pas de batterie et ne s'use pas. La carte physique est fabriquée en PVC haute qualité résistant à l'usure quotidienne. Votre investissement est conçu pour durer des années.",
      },
      {
        question: "Comment fonctionne l'intégration Wallet ?",
        answer: "Votre carte peut être ajoutée à Apple Wallet ou Google Wallet. Elle sera ainsi accessible depuis l'écran verrouillé de votre téléphone — parfait pour partager vos coordonnées même sans la carte physique sur vous.",
      },
      {
        question: "Comment contacter le support ?",
        answer: "Notre équipe est disponible par WhatsApp pour une réponse rapide, ou par email à support@i-wasp.com. Nous nous engageons à répondre sous 24h ouvrées.",
      },
    ],
  },
];

// Highlight matching text
function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  
  return (
    <>
      {parts.map((part, i) => 
        regex.test(part) ? (
          <mark 
            key={i} 
            className="bg-transparent font-medium"
            style={{ color: NOIR_COUTURE.ivory }}
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

export default function FAQ() {
  // SEO
  SEOHead(SEO_CONFIGS.faq);
  
  const [searchQuery, setSearchQuery] = useState("");

  // Filter FAQs based on search query
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return faqCategories;

    const query = searchQuery.toLowerCase();
    return faqCategories
      .map((category) => ({
        ...category,
        faqs: category.faqs.filter(
          (faq) =>
            faq.question.toLowerCase().includes(query) ||
            faq.answer.toLowerCase().includes(query)
        ),
      }))
      .filter((category) => category.faqs.length > 0);
  }, [searchQuery]);

  const totalResults = filteredCategories.reduce(
    (acc, cat) => acc + cat.faqs.length,
    0
  );

  return (
    <div 
      className="min-h-screen"
      style={{ backgroundColor: NOIR_COUTURE.bg }}
    >
      <CoutureNavbar />

      {/* Hero Section */}
      <section className="pt-32 pb-12 relative overflow-hidden">
        {/* Honeycomb pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cg fill='%23F6F5F2' fill-opacity='1'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.3zM15 0v7.5L27.99 15H28v-2.31h-.01L17 6.35V0h-2zm0 49v-8l12.99-7.5H28v2.31h-.01L17 42.15V49h-2z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            <span 
              className="inline-block text-xs tracking-[0.3em] uppercase mb-6"
              style={{ color: NOIR_COUTURE.ash }}
            >
              Centre d'aide
            </span>
            <h1 
              className="font-serif text-5xl md:text-6xl lg:text-7xl font-light tracking-tight mb-8"
              style={{ color: NOIR_COUTURE.ivory }}
            >
              Questions fréquentes
            </h1>
            <p 
              className="text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed mb-12"
              style={{ color: NOIR_COUTURE.ash }}
            >
              Tout ce que vous devez savoir sur les cartes de visite NFC i-wasp.
            </p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto">
              <div 
                className="relative group"
              >
                <div 
                  className="absolute inset-0 rounded-2xl transition-all duration-500 opacity-0 group-focus-within:opacity-100"
                  style={{
                    background: `linear-gradient(135deg, rgba(246, 245, 242, 0.05), rgba(246, 245, 242, 0.02))`,
                  }}
                />
                <div 
                  className="relative flex items-center rounded-2xl transition-all duration-300"
                  style={{ 
                    backgroundColor: NOIR_COUTURE.surface,
                    border: `1px solid ${NOIR_COUTURE.border}`,
                  }}
                >
                  <Search 
                    className="w-5 h-5 ml-5 flex-shrink-0 transition-colors duration-300"
                    style={{ color: NOIR_COUTURE.ash }}
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher une question..."
                    className="flex-1 bg-transparent px-4 py-5 text-base font-light outline-none placeholder:transition-opacity placeholder:duration-300 focus:placeholder:opacity-50"
                    style={{ 
                      color: NOIR_COUTURE.ivory,
                    }}
                  />
                  <AnimatePresence>
                    {searchQuery && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => setSearchQuery("")}
                        className="mr-4 p-1.5 rounded-full transition-colors duration-300 hover:bg-white/5"
                        style={{ color: NOIR_COUTURE.ash }}
                      >
                        <X className="w-4 h-4" />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Search Results Count */}
              <AnimatePresence>
                {searchQuery && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 text-sm font-light"
                    style={{ color: NOIR_COUTURE.ash }}
                  >
                    {totalResults === 0
                      ? "Aucun résultat trouvé"
                      : `${totalResults} résultat${totalResults > 1 ? "s" : ""} trouvé${totalResults > 1 ? "s" : ""}`}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="pb-32 relative">
        <div className="max-w-3xl mx-auto px-6">
          <AnimatePresence mode="wait">
            {filteredCategories.length === 0 ? (
              <motion.div
                key="no-results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="text-center py-20"
              >
                <div 
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{ backgroundColor: NOIR_COUTURE.surface }}
                >
                  <Search className="w-8 h-8" style={{ color: NOIR_COUTURE.ash }} />
                </div>
                <h3 
                  className="font-serif text-2xl font-light mb-3"
                  style={{ color: NOIR_COUTURE.ivory }}
                >
                  Aucune question trouvée
                </h3>
                <p 
                  className="text-base font-light"
                  style={{ color: NOIR_COUTURE.ash }}
                >
                  Essayez avec d'autres mots-clés ou{" "}
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="underline hover:no-underline transition-all"
                    style={{ color: NOIR_COUTURE.ivory }}
                  >
                    réinitialisez la recherche
                  </button>
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {filteredCategories.map((category, categoryIndex) => (
                  <motion.div
                    key={category.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ 
                      duration: 0.6, 
                      delay: categoryIndex * 0.1,
                      ease: [0.16, 1, 0.3, 1] 
                    }}
                    className="mb-16 last:mb-0"
                  >
                    {/* Category Title */}
                    <h2 
                      className="font-serif text-2xl md:text-3xl font-light mb-8 tracking-tight"
                      style={{ color: NOIR_COUTURE.ivory }}
                    >
                      {category.title}
                    </h2>

                    {/* FAQ Accordion */}
                    <div 
                      className="rounded-2xl overflow-hidden"
                      style={{ 
                        backgroundColor: NOIR_COUTURE.surface,
                        border: `1px solid ${NOIR_COUTURE.border}`,
                      }}
                    >
                      <Accordion type="single" collapsible className="w-full">
                        {category.faqs.map((faq, faqIndex) => (
                          <AccordionItem
                            key={faqIndex}
                            value={`${categoryIndex}-${faqIndex}`}
                            className="border-b last:border-b-0"
                            style={{ borderColor: NOIR_COUTURE.border }}
                          >
                            <AccordionTrigger 
                              className="px-6 py-5 text-left hover:no-underline group transition-colors duration-300"
                              style={{ color: NOIR_COUTURE.ivory }}
                            >
                              <span className="text-base md:text-lg font-light tracking-tight group-hover:opacity-70 transition-opacity duration-300">
                                <HighlightText text={faq.question} query={searchQuery} />
                              </span>
                            </AccordionTrigger>
                            <AccordionContent className="px-6 pb-6">
                              <p 
                                className="text-base font-light leading-relaxed"
                                style={{ color: NOIR_COUTURE.ash }}
                              >
                                <HighlightText text={faq.answer} query={searchQuery} />
                              </p>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="pb-32 relative">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center rounded-2xl p-12 md:p-16"
            style={{ 
              backgroundColor: NOIR_COUTURE.surface,
              border: `1px solid ${NOIR_COUTURE.border}`,
            }}
          >
            <h3 
              className="font-serif text-2xl md:text-3xl font-light mb-4 tracking-tight"
              style={{ color: NOIR_COUTURE.ivory }}
            >
              Vous ne trouvez pas votre réponse ?
            </h3>
            <p 
              className="text-base font-light mb-8"
              style={{ color: NOIR_COUTURE.ash }}
            >
              Notre équipe est disponible pour vous accompagner personnellement.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:support@i-wasp.com"
                className="inline-flex items-center justify-center px-8 py-4 text-sm tracking-[0.15em] uppercase font-medium transition-all duration-500 rounded-xl"
                style={{ 
                  backgroundColor: 'transparent',
                  border: `1px solid ${NOIR_COUTURE.border}`,
                  color: NOIR_COUTURE.ivory,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = NOIR_COUTURE.borderHover;
                  e.currentTarget.style.backgroundColor = 'rgba(246, 245, 242, 0.03)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = NOIR_COUTURE.border;
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                Nous écrire
              </a>
              <a
                href="https://wa.me/33626424394"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 text-sm tracking-[0.15em] uppercase font-medium transition-all duration-500 rounded-xl"
                style={{ 
                  backgroundColor: NOIR_COUTURE.ivory,
                  color: NOIR_COUTURE.bg,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
              >
                WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <CoutureFooter />
    </div>
  );
}
