/**
 * Pricing Page — Tarifs i-wasp
 * 
 * Palette Stealth Luxury:
 * - Noir Émeraude: #050807
 * - Argent Titane: #A5A9B4
 * - Platine: #D1D5DB
 */

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ClubNavbar } from "@/components/ClubNavbar";
import { GlobalFooter } from "@/components/GlobalFooter";
import { motion } from "framer-motion";
import { Check, X, Crown, Star, ArrowRight, Shield, Users } from "lucide-react";
import { SUBSCRIPTION_PLANS, FEATURE_COMPARISON } from "@/lib/subscriptionPlans";

// Stealth Luxury Colors
const STEALTH = {
  noir: "#050807",
  noirElevated: "#0A0F0D",
  titanium: "#A5A9B4",
  platinum: "#D1D5DB",
  emeraldGlow: "#1A2B26",
};

const faqs = [
  {
    question: "La carte NFC est-elle incluse ?",
    answer: "Oui. La carte NFC premium est incluse dans chaque niveau de service.",
  },
  {
    question: "Quelle est la différence entre Essentiel et Signature ?",
    answer: "Essentiel vous donne accès à la conciergerie avec un profil standard. Signature débloque l'expérience complète : mises à jour illimitées, statistiques, capture de contacts, et support prioritaire.",
  },
  {
    question: "Puis-je passer de Essentiel à Signature ?",
    answer: "Oui. Vous pouvez upgrader à tout moment depuis votre espace.",
  },
  {
    question: "Comment fonctionne le service Élite ?",
    answer: "Élite est conçu pour les équipes et entreprises. Contactez-nous pour une offre adaptée à vos besoins.",
  },
];

export default function Pricing() {
  const renderValue = (value: boolean | string) => {
    if (typeof value === "string") {
      return <span className="text-sm">{value}</span>;
    }
    return value ? (
      <Check className="w-5 h-5" style={{ color: STEALTH.platinum }} />
    ) : (
      <X className="w-5 h-5" style={{ color: `${STEALTH.titanium}40` }} />
    );
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: STEALTH.noir, color: 'white' }}>
      <ClubNavbar />
      
      {/* Hero */}
      <section className="relative py-32 px-4">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[200px]"
          style={{ backgroundColor: `${STEALTH.titanium}06` }}
        />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p 
              className="text-sm tracking-widest uppercase mb-6"
              style={{ color: STEALTH.titanium }}
            >
              Conciergerie digitale
            </p>
            
            <h1 className="text-3xl md:text-5xl font-semibold tracking-tight mb-6">
              Nos services
            </h1>
            
            <div className="max-w-xl mx-auto space-y-3 mt-8">
              <p className="text-lg" style={{ color: `${STEALTH.titanium}99` }}>
                La carte physique est incluse dans chaque service.
              </p>
              <p className="font-medium" style={{ color: STEALTH.platinum }}>
                Choisissez le niveau d'accompagnement qui vous correspond.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Plans - 3 niveaux de service */}
      <section className="py-8 px-4" style={{ backgroundColor: STEALTH.noirElevated }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 items-start">
            
            {/* ESSENTIEL */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl border"
              style={{ 
                backgroundColor: `${STEALTH.noir}80`,
                borderColor: `${STEALTH.titanium}20`
              }}
            >
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-5"
                style={{ backgroundColor: `${STEALTH.titanium}20` }}
              >
                <Star className="w-5 h-5" style={{ color: STEALTH.titanium }} />
              </div>
              
              <h3 className="text-2xl font-semibold mb-1">Essentiel</h3>
              <p className="text-sm mb-5" style={{ color: `${STEALTH.titanium}80` }}>Votre entrée dans la conciergerie</p>
              
              <div className="mb-5">
                <span className="text-3xl font-semibold">290 DH</span>
                <span className="text-sm ml-2" style={{ color: `${STEALTH.titanium}80` }}>mise en service</span>
              </div>
              
              <p className="text-sm mb-6" style={{ color: `${STEALTH.titanium}80` }}>
                Carte NFC premium + profil digital.
              </p>
              
              <a 
                href="https://wa.me/33626424394?text=Bonjour%20👋%0AJe%20souhaite%20accéder%20au%20service%20Essentiel%20i-Wasp."
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button 
                  variant="outline"
                  className="w-full py-5 font-medium"
                  style={{ 
                    borderColor: `${STEALTH.titanium}40`,
                    color: 'white'
                  }}
                >
                  Accéder au service
                </Button>
              </a>

              <div className="mt-6 pt-6" style={{ borderTop: `1px solid ${STEALTH.titanium}20` }}>
                <p className="text-xs font-medium uppercase tracking-wide mb-3" style={{ color: `${STEALTH.titanium}80` }}>Inclus</p>
                <ul className="space-y-2">
                  {SUBSCRIPTION_PLANS.ESSENTIEL.included.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm" style={{ color: `${STEALTH.titanium}99` }}>
                      <Check className="w-4 h-4 flex-shrink-0" style={{ color: `${STEALTH.titanium}80` }} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* SIGNATURE - RECOMMANDÉ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="relative p-6 rounded-2xl md:-mt-4 md:mb-4"
              style={{ 
                backgroundColor: `${STEALTH.titanium}10`,
                border: `2px solid ${STEALTH.titanium}60`
              }}
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                <span 
                  className="px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-2"
                  style={{ 
                    background: `linear-gradient(135deg, ${STEALTH.titanium}, ${STEALTH.platinum})`,
                    color: STEALTH.noir
                  }}
                >
                  <Crown className="w-3.5 h-3.5" />
                  RECOMMANDÉ
                </span>
              </div>
              
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 mt-2"
                style={{ backgroundColor: `${STEALTH.titanium}30` }}
              >
                <Crown className="w-6 h-6" style={{ color: STEALTH.platinum }} />
              </div>
              
              <h3 className="text-2xl font-semibold mb-1">Signature</h3>
              <p className="font-medium text-sm mb-5" style={{ color: STEALTH.platinum }}>L'expérience conciergerie complète</p>
              
              <div className="mb-5 space-y-3">
                <div 
                  className="p-4 rounded-xl border"
                  style={{ 
                    backgroundColor: `${STEALTH.titanium}10`,
                    borderColor: `${STEALTH.titanium}30`
                  }}
                >
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-semibold">490 DH</span>
                    <span style={{ color: `${STEALTH.titanium}80` }}>/an</span>
                  </div>
                  <p className="text-sm mt-1" style={{ color: `${STEALTH.titanium}80` }}>soit 41 DH/mois</p>
                </div>
                
                <div 
                  className="p-3 rounded-xl border"
                  style={{ 
                    backgroundColor: `${STEALTH.noir}50`,
                    borderColor: `${STEALTH.titanium}20`
                  }}
                >
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-semibold" style={{ color: `${STEALTH.titanium}CC` }}>49 DH</span>
                    <span style={{ color: `${STEALTH.titanium}60` }}>/mois</span>
                  </div>
                </div>
              </div>
              
              <p className="text-sm mb-6" style={{ color: `${STEALTH.titanium}99` }}>
                Nous gérons votre identité. Vous restez concentré.
              </p>
              
              <Link to="/order/type">
                <Button 
                  className="w-full py-6 font-semibold"
                  style={{ 
                    background: `linear-gradient(135deg, ${STEALTH.titanium}, ${STEALTH.platinum})`,
                    color: STEALTH.noir
                  }}
                >
                  <Crown className="w-5 h-5 mr-2" />
                  Choisir Signature
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>

              <div className="mt-6 pt-6" style={{ borderTop: `1px solid ${STEALTH.titanium}30` }}>
                <p className="text-xs font-medium uppercase tracking-wide mb-4 flex items-center gap-2" style={{ color: STEALTH.platinum }}>
                  <Star className="w-3 h-3" style={{ fill: STEALTH.platinum }} />
                  Service complet
                </p>
                <ul className="space-y-2">
                  {SUBSCRIPTION_PLANS.SIGNATURE.included.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 flex-shrink-0" style={{ color: STEALTH.platinum }} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                
                <div 
                  className="mt-5 p-4 rounded-xl border"
                  style={{ 
                    backgroundColor: `${STEALTH.noir}50`,
                    borderColor: `${STEALTH.titanium}20`
                  }}
                >
                  <p className="text-xs font-medium uppercase tracking-wide mb-3" style={{ color: `${STEALTH.titanium}80` }}>
                    + Avantages
                  </p>
                  <ul className="space-y-2">
                    {SUBSCRIPTION_PLANS.SIGNATURE.businessFeatures.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs" style={{ color: `${STEALTH.titanium}99` }}>
                        <Shield className="w-3 h-3 flex-shrink-0" style={{ color: STEALTH.titanium }} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* ÉLITE */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl border"
              style={{ 
                backgroundColor: `${STEALTH.noir}80`,
                borderColor: `${STEALTH.titanium}20`
              }}
            >
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-5"
                style={{ backgroundColor: STEALTH.titanium }}
              >
                <Users className="w-5 h-5" style={{ color: STEALTH.noir }} />
              </div>
              
              <h3 className="text-2xl font-semibold mb-1">Élite</h3>
              <p className="text-sm mb-5" style={{ color: `${STEALTH.titanium}80` }}>Service sur-mesure entreprises</p>
              
              <div className="mb-5">
                <span className="text-2xl font-semibold">Sur devis</span>
              </div>
              
              <p className="text-sm mb-6" style={{ color: `${STEALTH.titanium}80` }}>
                Une conciergerie dédiée pour votre équipe.
              </p>
              
              <a 
                href="https://wa.me/33626424394?text=Bonjour%20👋%0AJe%20souhaite%20en%20savoir%20plus%20sur%20le%20service%20Élite%20pour%20mon%20équipe."
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button 
                  variant="outline"
                  className="w-full py-5 font-medium"
                  style={{ 
                    borderColor: `${STEALTH.titanium}40`,
                    color: 'white'
                  }}
                >
                  Nous contacter
                </Button>
              </a>

              <div className="mt-6 pt-6" style={{ borderTop: `1px solid ${STEALTH.titanium}20` }}>
                <p className="text-xs font-medium uppercase tracking-wide mb-3" style={{ color: `${STEALTH.titanium}80` }}>Inclus</p>
                <ul className="space-y-2">
                  {SUBSCRIPTION_PLANS.ELITE.included.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm" style={{ color: `${STEALTH.titanium}99` }}>
                      <Check className="w-4 h-4 flex-shrink-0" style={{ color: `${STEALTH.titanium}80` }} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
          
          {/* Note prix */}
          <p className="text-center text-xs mt-8" style={{ color: `${STEALTH.titanium}80` }}>
            Tous les prix sont indiqués en dirhams marocains (DH). Service disponible au Maroc.
          </p>
        </div>
      </section>

      {/* Detailed Comparison */}
      <section className="py-16 px-4" style={{ backgroundColor: STEALTH.noir }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-12">
            Comparaison des services
          </h2>
          
          <div 
            className="rounded-xl overflow-hidden border"
            style={{ borderColor: `${STEALTH.titanium}20` }}
          >
            {/* Header */}
            <div 
              className="grid grid-cols-3"
              style={{ backgroundColor: STEALTH.noirElevated }}
            >
              <div className="p-4 font-medium" style={{ color: `${STEALTH.titanium}80` }}>Service</div>
              <div 
                className="p-4 text-center font-medium"
                style={{ borderLeft: `1px solid ${STEALTH.titanium}20`, borderRight: `1px solid ${STEALTH.titanium}20` }}
              >
                Essentiel
              </div>
              <div 
                className="p-4 text-center font-medium"
                style={{ backgroundColor: `${STEALTH.titanium}10`, color: STEALTH.platinum }}
              >
                Signature
              </div>
            </div>
            
            {/* Rows */}
            {FEATURE_COMPARISON.map((feature, index) => (
              <div 
                key={index}
                className="grid grid-cols-3"
                style={{ 
                  backgroundColor: index % 2 === 0 ? `${STEALTH.titanium}05` : STEALTH.noir 
                }}
              >
                <div className="p-4 text-sm">{feature.name}</div>
                <div 
                  className="p-4 flex justify-center items-center"
                  style={{ borderLeft: `1px solid ${STEALTH.titanium}20`, borderRight: `1px solid ${STEALTH.titanium}20` }}
                >
                  {renderValue(feature.free)}
                </div>
                <div 
                  className="p-4 flex justify-center items-center"
                  style={{ backgroundColor: `${STEALTH.titanium}05` }}
                >
                  {renderValue(feature.gold)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4" style={{ backgroundColor: STEALTH.noirElevated }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-12">
            Questions fréquentes
          </h2>
          
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-xl border"
                style={{ 
                  backgroundColor: `${STEALTH.noir}80`,
                  borderColor: `${STEALTH.titanium}20`
                }}
              >
                <h3 className="text-lg font-medium mb-2">{faq.question}</h3>
                <p style={{ color: `${STEALTH.titanium}99` }}>{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4" style={{ backgroundColor: STEALTH.noir }}>
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 md:p-12 rounded-2xl"
            style={{ 
              background: `linear-gradient(135deg, ${STEALTH.titanium}, ${STEALTH.platinum})`,
            }}
          >
            <Crown className="w-12 h-12 mx-auto mb-6" style={{ color: STEALTH.noir }} />
            <h2 className="text-3xl font-semibold mb-4" style={{ color: STEALTH.noir }}>
              Prêt à confier votre image à i-Wasp ?
            </h2>
            <p className="mb-8" style={{ color: `${STEALTH.noir}B3` }}>
              Rejoignez les professionnels qui font confiance à notre conciergerie.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://wa.me/33626424394?text=Bonjour%20👋%0AJe%20souhaite%20accéder%20au%20service%20Essentiel."
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button 
                  variant="outline" 
                  size="lg"
                  style={{ 
                    borderColor: `${STEALTH.noir}40`,
                    color: STEALTH.noir
                  }}
                >
                  Service Essentiel
                </Button>
              </a>
              <Link to="/order/type">
                <Button 
                  size="lg" 
                  className="font-semibold"
                  style={{ 
                    backgroundColor: STEALTH.noir,
                    color: 'white'
                  }}
                >
                  <Crown className="w-5 h-5 mr-2" />
                  Choisir Signature
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
