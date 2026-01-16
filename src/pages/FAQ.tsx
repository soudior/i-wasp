import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  ChevronDown, 
  Phone, 
  MessageCircle, 
  CreditCard, 
  Truck, 
  Shield, 
  Smartphone,
  RefreshCw,
  Users,
  Zap,
  HelpCircle,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { SEOHead, SEO_CONFIGS } from "@/components/SEOHead";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const faqCategories = [
  {
    id: "getting-started",
    title: "Découvrir i-wasp",
    icon: Zap,
    faqs: [
      {
        question: "Qu'est-ce qu'une carte NFC i-wasp ?",
        answer: "Une carte i-wasp est une carte de visite nouvelle génération équipée d'une puce NFC. Approchez-la simplement d'un smartphone pour partager instantanément votre profil digital : coordonnées, réseaux sociaux, portfolio. Plus besoin de cartes papier jetables qui finissent à la poubelle.",
      },
      {
        question: "Pourquoi choisir i-wasp plutôt qu'une carte papier ?",
        answer: "Avec i-wasp, vous économisez sur l'impression répétée de cartes, vous pouvez modifier vos informations à tout moment sans commander de nouvelles cartes, et vous laissez une impression mémorable. C'est un investissement unique pour une image professionnelle premium.",
      },
      {
        question: "C'est vraiment utile pour mon activité ?",
        answer: "Absolument ! Que vous soyez entrepreneur, freelance, commercial ou professionnel libéral, une carte NFC vous distingue immédiatement. Nos clients rapportent en moyenne 3x plus de contacts conservés par rapport aux cartes papier traditionnelles.",
      },
    ],
  },
  {
    id: "how-it-works",
    title: "Fonctionnement",
    icon: Smartphone,
    faqs: [
      {
        question: "Comment ça marche concrètement ?",
        answer: "C'est très simple : vous approchez votre carte du smartphone de votre interlocuteur (à 2-3 cm), et votre profil digital s'affiche instantanément dans son navigateur. Aucune application à télécharger, aucune manipulation compliquée.",
      },
      {
        question: "Ça fonctionne avec tous les téléphones ?",
        answer: "Oui ! Tous les iPhone depuis le modèle 7 (2016) et 95% des Android récents sont compatibles NFC. Pour les rares téléphones sans NFC, un QR code est gravé au dos de chaque carte en backup.",
      },
      {
        question: "Faut-il installer une application ?",
        answer: "Non, aucune application n'est nécessaire — ni pour vous, ni pour vos contacts. Le profil s'ouvre directement dans le navigateur Safari ou Chrome du smartphone.",
      },
      {
        question: "Et si le scan NFC ne fonctionne pas ?",
        answer: "C'est très rare, mais voici les astuces : sur iPhone, approchez la carte du haut de l'écran ; sur Android, du centre arrière. Vérifiez que le NFC est activé dans les paramètres. Les coques très épaisses peuvent parfois bloquer le signal. En dernier recours, le QR code au dos fonctionne toujours !",
      },
    ],
  },
  {
    id: "customization",
    title: "Personnalisation",
    icon: RefreshCw,
    faqs: [
      {
        question: "Puis-je modifier mes informations après l'achat ?",
        answer: "Oui, à vie ! Depuis votre tableau de bord, modifiez votre photo, titre, coordonnées, liens sociaux... Les changements sont reflétés instantanément sans toucher à votre carte physique. C'est tout l'avantage du digital.",
      },
      {
        question: "Comment personnaliser le design de ma carte ?",
        answer: "Lors de votre commande, choisissez parmi nos templates premium (Noir Élégance, Ivoire Raffiné, Carbone). Vous pouvez ajouter votre logo, choisir la couleur, et personnaliser chaque élément de votre profil digital.",
      },
      {
        question: "Puis-je avoir plusieurs cartes avec des profils différents ?",
        answer: "Absolument ! Vous pouvez créer autant de profils que nécessaire (personnel, professionnel, par projet...). Chaque carte peut être liée à un profil différent. Idéal pour les multi-entrepreneurs.",
      },
    ],
  },
  {
    id: "ordering",
    title: "Commande & Prix",
    icon: CreditCard,
    faqs: [
      {
        question: "Quel est le prix d'une carte i-wasp ?",
        answer: "Une carte i-wasp est à 149 DH (au lieu de 249 DH). Ce prix inclut : la carte NFC premium personnalisée, votre profil digital à vie, les mises à jour illimitées, et la livraison gratuite partout au Maroc.",
      },
      {
        question: "Y a-t-il des frais cachés ou un abonnement ?",
        answer: "Aucun ! C'est un paiement unique. Pas d'abonnement, pas de frais mensuels, pas de surprises. Votre profil digital reste actif à vie, inclus dans le prix.",
      },
      {
        question: "Comment passer commande ?",
        answer: "C'est rapide : cliquez sur \"Commander\", personnalisez votre carte, entrez vos informations de livraison, et payez. Vous pouvez payer par carte bancaire ou à la livraison (Cash on Delivery) partout au Maroc.",
      },
      {
        question: "Puis-je payer à la livraison ?",
        answer: "Oui ! Le paiement à la livraison (COD) est disponible partout au Maroc. Vous payez en espèces au livreur à réception de votre carte. Simple et sans risque.",
      },
    ],
  },
  {
    id: "delivery",
    title: "Livraison",
    icon: Truck,
    faqs: [
      {
        question: "Livrez-vous partout au Maroc ?",
        answer: "Oui ! Nous livrons dans toutes les villes du Maroc : Casablanca, Rabat, Marrakech, Fès, Tanger, Agadir, et toutes les autres. La livraison est 100% gratuite.",
      },
      {
        question: "Quel est le délai de livraison ?",
        answer: "Votre carte est produite en 3-5 jours ouvrés, puis livrée en 2-4 jours. Comptez donc 5-9 jours au total selon votre ville. Vous recevez un numéro de suivi par SMS.",
      },
      {
        question: "Comment suivre ma commande ?",
        answer: "Dès l'expédition, vous recevez un SMS et email avec votre numéro de suivi. Vous pouvez suivre votre colis en temps réel jusqu'à la livraison.",
      },
    ],
  },
  {
    id: "guarantees",
    title: "Garanties",
    icon: Shield,
    faqs: [
      {
        question: "Quelle est la durée de vie de la carte ?",
        answer: "La puce NFC n'a pas de batterie et ne s'use pas — elle fonctionne à vie. La carte physique est fabriquée en PVC haute qualité, résistante à l'eau et aux rayures. Nous garantissons votre carte pendant 2 ans.",
      },
      {
        question: "Que se passe-t-il si ma carte est défectueuse ?",
        answer: "Si votre carte présente un défaut de fabrication, nous la remplaçons gratuitement. Contactez-nous simplement par WhatsApp avec une photo du problème.",
      },
      {
        question: "Puis-je me faire rembourser si je ne suis pas satisfait ?",
        answer: "Oui ! Vous avez 14 jours après réception pour nous retourner la carte si elle ne vous convient pas. Nous vous remboursons intégralement, sans questions.",
      },
      {
        question: "Mes données sont-elles sécurisées ?",
        answer: "Absolument. Vos données sont hébergées sur des serveurs sécurisés en Europe. Vous contrôlez exactement ce qui est visible sur votre profil, et vous pouvez le désactiver à tout moment.",
      },
    ],
  },
  {
    id: "business",
    title: "Entreprises",
    icon: Users,
    faqs: [
      {
        question: "Proposez-vous des tarifs pour les entreprises ?",
        answer: "Oui ! À partir de 5 cartes, bénéficiez de tarifs dégressifs : -15% pour 5-10 cartes, -25% pour 11-25 cartes, et tarifs sur mesure au-delà. Contactez-nous pour un devis personnalisé.",
      },
      {
        question: "Pouvez-vous personnaliser les cartes avec notre charte graphique ?",
        answer: "Absolument ! Pour les commandes entreprise, nous créons des designs sur mesure avec votre logo, vos couleurs, et votre identité visuelle. Nous pouvons même graver votre logo au laser.",
      },
      {
        question: "Comment gérer les cartes de toute mon équipe ?",
        answer: "Nous proposons un tableau de bord entreprise qui permet de gérer tous les profils de votre équipe depuis une seule interface. Créez, modifiez et suivez les statistiques de toutes les cartes.",
      },
    ],
  },
];

// Trust stats
const trustStats = [
  { value: "547+", label: "Cartes livrées" },
  { value: "98%", label: "Clients satisfaits" },
  { value: "24h", label: "Support réactif" },
  { value: "0 DH", label: "Livraison" },
];

// Highlight search matches
function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  
  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="bg-primary/20 text-primary rounded px-0.5">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim() && !selectedCategory) return faqCategories;

    return faqCategories
      .filter(category => !selectedCategory || category.id === selectedCategory)
      .map((category) => ({
        ...category,
        faqs: category.faqs.filter(
          (faq) =>
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      }))
      .filter((category) => category.faqs.length > 0);
  }, [searchQuery, selectedCategory]);

  const totalFaqs = faqCategories.reduce((acc, cat) => acc + cat.faqs.length, 0);

  return (
    <>
      <SEOHead {...SEO_CONFIGS.faq} />

      <div className="min-h-screen bg-[#F5F5F7]">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-black/5 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link to="/" className="font-semibold text-[#1D1D1F] text-xl tracking-tight">
              IWASP
            </Link>
            <Link to="/express/pack">
              <Button className="bg-[#007AFF] hover:bg-[#0056CC] text-white rounded-full px-6 h-10 font-medium">
                Commander
              </Button>
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <section className="bg-white border-b border-black/5">
          <div className="max-w-4xl mx-auto px-6 py-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#007AFF]/10 text-[#007AFF] text-sm font-medium mb-6">
                <HelpCircle className="w-4 h-4" />
                Centre d'aide
              </span>
              
              <h1 className="text-4xl md:text-5xl font-bold text-[#1D1D1F] tracking-tight mb-4">
                Questions fréquentes
              </h1>
              
              <p className="text-lg text-[#8E8E93] mb-8 max-w-2xl mx-auto">
                Tout ce que vous devez savoir sur les cartes NFC i-wasp. 
                {totalFaqs} réponses pour vous aider.
              </p>

              {/* Search */}
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8E8E93]" />
                <Input
                  type="text"
                  placeholder="Rechercher une question..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 h-14 text-lg bg-[#F5F5F7] border-0 rounded-2xl focus:ring-2 focus:ring-[#007AFF]/20 placeholder:text-[#8E8E93]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8E8E93] hover:text-[#1D1D1F]"
                  >
                    ✕
                  </button>
                )}
              </div>
            </motion.div>

            {/* Trust Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex flex-wrap justify-center gap-8 mt-10"
            >
              {trustStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-[#1D1D1F]">{stat.value}</div>
                  <div className="text-sm text-[#8E8E93]">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="bg-[#F5F5F7] sticky top-[73px] z-40 border-b border-black/5">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  !selectedCategory
                    ? "bg-[#1D1D1F] text-white"
                    : "bg-white text-[#1D1D1F] hover:bg-black/5"
                }`}
              >
                Tout voir
              </button>
              {faqCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(
                      selectedCategory === category.id ? null : category.id
                    )}
                    className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === category.id
                        ? "bg-[#1D1D1F] text-white"
                        : "bg-white text-[#1D1D1F] hover:bg-black/5"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {category.title}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-12">
          <div className="max-w-3xl mx-auto px-6">
            <AnimatePresence mode="wait">
              {filteredCategories.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-16"
                >
                  <div className="w-16 h-16 bg-[#F5F5F7] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-[#8E8E93]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#1D1D1F] mb-2">
                    Aucun résultat
                  </h3>
                  <p className="text-[#8E8E93] mb-6">
                    Essayez une autre recherche ou contactez-nous
                  </p>
                  <a
                    href="https://wa.me/212667285923?text=Bonjour, j'ai une question..."
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full px-6">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Poser une question
                    </Button>
                  </a>
                </motion.div>
              ) : (
                filteredCategories.map((category, categoryIndex) => {
                  const Icon = category.icon;
                  return (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: categoryIndex * 0.1, duration: 0.4 }}
                      className="mb-10"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-[#007AFF]/10 rounded-xl flex items-center justify-center">
                          <Icon className="w-5 h-5 text-[#007AFF]" />
                        </div>
                        <h2 className="text-xl font-semibold text-[#1D1D1F]">
                          {category.title}
                        </h2>
                        <span className="text-sm text-[#8E8E93] bg-black/5 px-2 py-0.5 rounded-full">
                          {category.faqs.length}
                        </span>
                      </div>

                      <Accordion type="single" collapsible className="space-y-3">
                        {category.faqs.map((faq, faqIndex) => (
                          <AccordionItem
                            key={faqIndex}
                            value={`${category.id}-${faqIndex}`}
                            className="bg-white border-0 rounded-2xl shadow-sm overflow-hidden data-[state=open]:shadow-md transition-shadow"
                          >
                            <AccordionTrigger className="px-6 py-5 text-left text-[#1D1D1F] font-medium hover:no-underline hover:bg-black/[0.02] [&[data-state=open]]:bg-black/[0.02]">
                              <HighlightText text={faq.question} query={searchQuery} />
                            </AccordionTrigger>
                            <AccordionContent className="px-6 pb-5 text-[#8E8E93] leading-relaxed">
                              <HighlightText text={faq.answer} query={searchQuery} />
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-white border-t border-black/5">
          <div className="max-w-4xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-[#1D1D1F] mb-4">
                Vous n'avez pas trouvé votre réponse ?
              </h2>
              <p className="text-[#8E8E93] mb-8 max-w-xl mx-auto">
                Notre équipe est disponible 7j/7 pour répondre à toutes vos questions
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://wa.me/212667285923?text=Bonjour, j'ai une question..."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button 
                    size="lg"
                    className="bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full px-8 h-14 text-base font-medium w-full sm:w-auto"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    WhatsApp
                  </Button>
                </a>
                <a href="tel:+212667285923">
                  <Button 
                    size="lg"
                    variant="outline"
                    className="rounded-full px-8 h-14 text-base font-medium border-2 w-full sm:w-auto"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    +212 667 285 923
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Ready to Order CTA */}
        <section className="py-16 bg-[#1D1D1F]">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/80 text-sm mb-6">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                Livraison gratuite • Paiement à la livraison
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Prêt à vous démarquer ?
              </h2>
              <p className="text-white/60 mb-8 max-w-xl mx-auto">
                Rejoignez 500+ professionnels marocains qui ont déjà adopté la carte de visite du futur
              </p>

              <Link to="/express/pack">
                <Button 
                  size="lg"
                  className="bg-[#007AFF] hover:bg-[#0056CC] text-white rounded-full px-10 h-14 text-lg font-medium group"
                >
                  Commander ma carte
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              <p className="text-white/40 text-sm mt-4">
                149 DH seulement • Sans abonnement
              </p>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white border-t border-black/5 py-8">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-sm text-[#8E8E93]">
                © 2025 IWASP. Tous droits réservés.
              </div>
              <div className="flex gap-6 text-sm">
                <Link to="/cgv" className="text-[#8E8E93] hover:text-[#1D1D1F] transition-colors">
                  CGV
                </Link>
                <Link to="/contact" className="text-[#8E8E93] hover:text-[#1D1D1F] transition-colors">
                  Contact
                </Link>
                <Link to="/" className="text-[#8E8E93] hover:text-[#1D1D1F] transition-colors">
                  Accueil
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
