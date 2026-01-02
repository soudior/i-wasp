import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  ChevronDown, 
  CreditCard, 
  Smartphone, 
  Image, 
  Wifi, 
  Share2, 
  User, 
  Mail, 
  MessageCircle,
  Play,
  HelpCircle
} from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  icon: React.ReactNode;
  videoUrl?: string;
}

const faqCategories = [
  {
    title: "Activation de votre carte",
    icon: <CreditCard className="w-5 h-5" />,
    items: [
      {
        question: "Comment activer ma carte NFC ?",
        answer: "Votre carte est pré-configurée et prête à l'emploi dès réception. Aucune activation manuelle n'est requise. Approchez simplement votre carte du téléphone de votre interlocuteur pour partager instantanément votre profil digital.",
        icon: <CreditCard className="w-4 h-4" />,
      },
      {
        question: "Ma carte doit-elle être chargée ?",
        answer: "Non, votre carte NFC ne nécessite aucune batterie ni recharge. La technologie NFC fonctionne par induction électromagnétique : le téléphone de votre contact alimente la puce lors du scan.",
        icon: <CreditCard className="w-4 h-4" />,
      },
      {
        question: "Ma carte a-t-elle une date d'expiration ?",
        answer: "Non, votre carte physique n'expire jamais. Votre abonnement digital vous permet de modifier votre profil à tout moment. Même si vous changez de poste ou d'entreprise, la même carte continuera de fonctionner.",
        icon: <CreditCard className="w-4 h-4" />,
      },
    ],
  },
  {
    title: "Utilisation du NFC",
    icon: <Smartphone className="w-5 h-5" />,
    items: [
      {
        question: "Comment scanner une carte NFC ?",
        answer: "Sur iPhone : Approchez la carte du haut du téléphone (près de l'encoche ou Dynamic Island). Sur Android : Approchez la carte du centre arrière du téléphone. Une notification apparaîtra automatiquement pour ouvrir le profil.",
        icon: <Smartphone className="w-4 h-4" />,
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      },
      {
        question: "Le NFC fonctionne-t-il avec tous les téléphones ?",
        answer: "La majorité des smartphones modernes supportent le NFC : iPhone 7 et versions ultérieures, et la plupart des Android depuis 2015. Vérifiez que le NFC est activé dans les paramètres de votre téléphone.",
        icon: <Smartphone className="w-4 h-4" />,
      },
      {
        question: "Que faire si le scan ne fonctionne pas ?",
        answer: "1. Vérifiez que le NFC est activé sur le téléphone. 2. Retirez la coque de protection si elle est épaisse. 3. Essayez différentes positions (haut pour iPhone, centre pour Android). 4. Si le problème persiste, contactez notre support.",
        icon: <Smartphone className="w-4 h-4" />,
      },
    ],
  },
  {
    title: "Personnalisation du profil",
    icon: <User className="w-5 h-5" />,
    items: [
      {
        question: "Comment modifier mon logo ?",
        answer: "Connectez-vous à votre Dashboard, accédez à 'Paramètres' ou 'Modifier la carte', puis uploadez votre nouveau logo au format PNG ou SVG. Le changement sera visible instantanément sur votre profil digital.",
        icon: <Image className="w-4 h-4" />,
      },
      {
        question: "Comment ajouter mes réseaux sociaux ?",
        answer: "Dans l'éditeur de carte, vous trouverez une section 'Liens sociaux'. Cliquez sur '+' pour ajouter LinkedIn, Instagram, WhatsApp, ou tout autre réseau. Entrez simplement votre nom d'utilisateur ou URL.",
        icon: <Share2 className="w-4 h-4" />,
      },
      {
        question: "Comment changer ma photo de profil ?",
        answer: "Accédez à l'éditeur de carte depuis votre Dashboard. Cliquez sur votre photo actuelle pour la remplacer. Pour un rendu optimal, utilisez une photo carrée de bonne qualité sur fond neutre.",
        icon: <User className="w-4 h-4" />,
      },
    ],
  },
  {
    title: "Fonctionnalités avancées",
    icon: <Wifi className="w-5 h-5" />,
    items: [
      {
        question: "Comment utiliser le partage WiFi ?",
        answer: "Avec l'abonnement Gold, vous pouvez générer un QR code WiFi. Vos visiteurs scannent ce code pour se connecter instantanément à votre réseau sans taper de mot de passe. Idéal pour les showrooms et bureaux.",
        icon: <Wifi className="w-4 h-4" />,
      },
      {
        question: "Comment fonctionnent les Stories ?",
        answer: "Les Stories vous permettent de partager du contenu éphémère (24h) sur votre profil : promotions, événements, annonces. Accédez à 'Stories' dans votre Dashboard pour en créer une nouvelle.",
        icon: <Play className="w-4 h-4" />,
      },
      {
        question: "Comment ajouter ma carte au Wallet Apple/Google ?",
        answer: "Depuis votre profil digital, appuyez sur 'Ajouter au Wallet'. La carte sera enregistrée dans Apple Wallet (iPhone) ou Google Pay (Android), permettant un partage encore plus rapide.",
        icon: <CreditCard className="w-4 h-4" />,
      },
    ],
  },
];

const FAQAccordion = ({ item }: { item: FAQItem }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-[#E5E5E7]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-[#8E8E93]">{item.icon}</span>
          <span className="text-[#1D1D1F] font-medium text-[15px]">
            {item.question}
          </span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-[#8E8E93]" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pb-4 pl-9 pr-4">
              <p className="text-[#8E8E93] text-[14px] leading-relaxed whitespace-pre-line">
                {item.answer}
              </p>
              {item.videoUrl && (
                <div className="mt-4 rounded-xl overflow-hidden aspect-video bg-[#1D1D1F]">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <Play className="w-12 h-12 text-white/50 mx-auto mb-2" />
                      <p className="text-white/50 text-sm">Tutoriel vidéo</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Help = () => {
  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#F5F5F7]/80 backdrop-blur-xl border-b border-[#E5E5E7]">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-4">
          <Link 
            to="/" 
            className="p-2 -ml-2 rounded-full hover:bg-black/5 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-[#1D1D1F]" />
          </Link>
          <h1 className="text-xl font-semibold text-[#1D1D1F] tracking-tight">
            Aide & FAQ
          </h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 pb-32">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 bg-[#1D1D1F] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-8 h-8 text-[#D4AF37]" />
          </div>
          <h2 className="text-2xl font-bold text-[#1D1D1F] tracking-tight mb-2">
            Comment pouvons-nous vous aider ?
          </h2>
          <p className="text-[#8E8E93] text-[15px]">
            Trouvez rapidement les réponses à vos questions
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-3 mb-8"
        >
          <Link
            to="/guide"
            className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <CreditCard className="w-6 h-6 text-[#D4AF37] mb-2" />
            <p className="text-[#1D1D1F] font-medium text-[14px]">
              Guide d'utilisation
            </p>
            <p className="text-[#8E8E93] text-[12px] mt-1">
              Étape par étape
            </p>
          </Link>
          <Link
            to="/install"
            className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <Smartphone className="w-6 h-6 text-[#D4AF37] mb-2" />
            <p className="text-[#1D1D1F] font-medium text-[14px]">
              Installer l'app
            </p>
            <p className="text-[#8E8E93] text-[12px] mt-1">
              PWA sur mobile
            </p>
          </Link>
        </motion.div>

        {/* FAQ Categories */}
        {faqCategories.map((category, categoryIndex) => (
          <motion.section
            key={category.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + categoryIndex * 0.05 }}
            className="mb-6"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[#D4AF37]">{category.icon}</span>
              <h3 className="text-[17px] font-semibold text-[#1D1D1F]">
                {category.title}
              </h3>
            </div>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {category.items.map((item, itemIndex) => (
                <FAQAccordion key={itemIndex} item={item} />
              ))}
            </div>
          </motion.section>
        ))}

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#1D1D1F] rounded-2xl p-6 text-center"
        >
          <h3 className="text-white font-semibold text-lg mb-2">
            Besoin d'aide supplémentaire ?
          </h3>
          <p className="text-white/60 text-[14px] mb-4">
            Notre équipe est disponible pour vous accompagner
          </p>
          <div className="flex gap-3 justify-center">
            <a
              href="mailto:support@i-wasp.com"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span className="text-[14px]">Email</span>
            </a>
            <a
              href="https://wa.me/212600000000"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#D4AF37] hover:bg-[#C9A431] text-[#1D1D1F] px-4 py-2.5 rounded-xl transition-colors font-medium"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="text-[14px]">WhatsApp</span>
            </a>
          </div>
        </motion.div>

        {/* Footer */}
        <p className="text-center text-[#8E8E93] text-[12px] mt-8">
          Powered by IWASP
        </p>
      </main>
    </div>
  );
};

export default Help;
