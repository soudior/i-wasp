/**
 * Pricing Page — Tarifs i-wasp
 * Style: Haute Couture Digitale - Noir Couture unifié
 */

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CoutureNavbar } from "@/components/CoutureNavbar";
import { CoutureFooter } from "@/components/CoutureFooter";
import { motion } from "framer-motion";
import { Check, X, Crown, Star, ArrowRight, Shield, Users } from "lucide-react";
import { SUBSCRIPTION_PLANS, FEATURE_COMPARISON } from "@/lib/subscriptionPlans";

// Noir Couture Palette — Harmonisé avec tout le site
const NOIR_COUTURE = {
  jet: "#0A0A0A",          // Fond principal
  jetElevated: "#111111",  // Fond élevé
  silk: "#F6F5F2",         // Texte principal ivoire
  muted: "#9B9B9B",        // Texte secondaire gris cendre
  platinum: "#7E7E7E",     // Accent platine mat
  border: "#1A1A1A",       // Bordures subtiles
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
      <Check className="w-5 h-5" style={{ color: NOIR_COUTURE.silk }} />
    ) : (
      <X className="w-5 h-5" style={{ color: `${NOIR_COUTURE.muted}40` }} />
    );
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: NOIR_COUTURE.jet, color: NOIR_COUTURE.silk }}>
      <CoutureNavbar />
      
      {/* Hero */}
      <section className="relative py-32 px-4">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[200px]"
          style={{ backgroundColor: `${NOIR_COUTURE.muted}06` }}
        />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p 
              className="text-xs uppercase tracking-[0.2em] mb-6 font-light"
              style={{ color: NOIR_COUTURE.muted }}
            >
              Conciergerie digitale
            </p>
            
            <h1 className="font-display text-3xl md:text-5xl font-light tracking-tight mb-6">
              Nos services
            </h1>
            
            <div className="max-w-xl mx-auto space-y-3 mt-8">
              <p className="text-lg font-light" style={{ color: NOIR_COUTURE.muted }}>
                La carte physique est incluse dans chaque service.
              </p>
              <p className="font-light" style={{ color: NOIR_COUTURE.silk }}>
                Choisissez le niveau d'accompagnement qui vous correspond.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Plans - 3 niveaux de service */}
      <section className="py-12 px-4" style={{ backgroundColor: NOIR_COUTURE.jetElevated }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 items-start">
            
            {/* ESSENTIEL */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="p-6 rounded-2xl border"
              style={{ 
                backgroundColor: NOIR_COUTURE.jet,
                borderColor: NOIR_COUTURE.border
              }}
            >
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                style={{ backgroundColor: `${NOIR_COUTURE.muted}15` }}
              >
                <Star className="w-5 h-5" style={{ color: NOIR_COUTURE.muted }} />
              </div>
              
              <h3 className="text-2xl font-medium mb-1 tracking-tight">Essentiel</h3>
              <p className="text-sm mb-5 font-light" style={{ color: NOIR_COUTURE.muted }}>Votre entrée dans la conciergerie</p>
              
              <div className="mb-5">
                <span className="text-3xl font-medium">290 DH</span>
                <span className="text-sm ml-2 font-light" style={{ color: NOIR_COUTURE.muted }}>mise en service</span>
              </div>
              
              <p className="text-sm mb-6 font-light" style={{ color: NOIR_COUTURE.muted }}>
                Carte NFC premium + profil digital.
              </p>
              
              <a 
                href="https://wa.me/33626424394?text=Bonjour%20👋%0AJe%20souhaite%20accéder%20au%20service%20Essentiel%20i-Wasp."
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button 
                  variant="outline"
                  className="w-full py-5 font-medium text-sm uppercase tracking-[0.1em]"
                  style={{ 
                    borderColor: NOIR_COUTURE.border,
                    color: NOIR_COUTURE.silk
                  }}
                >
                  Accéder au service
                </Button>
              </a>

              <div className="mt-6 pt-6" style={{ borderTop: `1px solid ${NOIR_COUTURE.border}` }}>
                <p className="text-[10px] font-medium uppercase tracking-[0.15em] mb-3" style={{ color: NOIR_COUTURE.muted }}>Inclus</p>
                <ul className="space-y-2">
                  {SUBSCRIPTION_PLANS.ESSENTIEL.included.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm font-light" style={{ color: NOIR_COUTURE.muted }}>
                      <Check className="w-4 h-4 flex-shrink-0" style={{ color: NOIR_COUTURE.muted }} />
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
              transition={{ delay: 0.1, duration: 0.6 }}
              className="relative p-6 rounded-2xl md:-mt-4 md:mb-4"
              style={{ 
                backgroundColor: `${NOIR_COUTURE.muted}10`,
                border: `1px solid ${NOIR_COUTURE.muted}40`
              }}
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                <span 
                  className="px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-[0.1em] flex items-center gap-2"
                  style={{ 
                    backgroundColor: NOIR_COUTURE.silk,
                    color: NOIR_COUTURE.jet
                  }}
                >
                  <Crown className="w-3.5 h-3.5" />
                  Recommandé
                </span>
              </div>
              
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 mt-2"
                style={{ backgroundColor: NOIR_COUTURE.silk }}
              >
                <Crown className="w-6 h-6" style={{ color: NOIR_COUTURE.jet }} />
              </div>
              
              <h3 className="text-2xl font-medium mb-1 tracking-tight">Signature</h3>
              <p className="font-light text-sm mb-5" style={{ color: NOIR_COUTURE.silk }}>L'expérience conciergerie complète</p>
              
              <div className="mb-5 space-y-3">
                <div 
                  className="p-4 rounded-xl border"
                  style={{ 
                    backgroundColor: `${NOIR_COUTURE.muted}08`,
                    borderColor: NOIR_COUTURE.border
                  }}
                >
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-medium">490 DH</span>
                    <span className="font-light" style={{ color: NOIR_COUTURE.muted }}>/an</span>
                  </div>
                  <p className="text-sm mt-1 font-light" style={{ color: NOIR_COUTURE.muted }}>soit 41 DH/mois</p>
                </div>
                
                <div 
                  className="p-3 rounded-xl border"
                  style={{ 
                    backgroundColor: NOIR_COUTURE.jet,
                    borderColor: NOIR_COUTURE.border
                  }}
                >
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-medium" style={{ color: NOIR_COUTURE.muted }}>49 DH</span>
                    <span className="font-light" style={{ color: `${NOIR_COUTURE.muted}80` }}>/mois</span>
                  </div>
                </div>
              </div>
              
              <p className="text-sm mb-6 font-light" style={{ color: NOIR_COUTURE.muted }}>
                Nous gérons votre identité. Vous restez concentré.
              </p>
              
              <Link to="/order/type">
                <Button 
                  className="w-full py-6 font-medium text-sm uppercase tracking-[0.1em]"
                  style={{ 
                    backgroundColor: NOIR_COUTURE.silk,
                    color: NOIR_COUTURE.jet
                  }}
                >
                  <Crown className="w-5 h-5 mr-2" />
                  Choisir Signature
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>

              <div className="mt-6 pt-6" style={{ borderTop: `1px solid ${NOIR_COUTURE.border}` }}>
                <p className="text-[10px] font-medium uppercase tracking-[0.15em] mb-4 flex items-center gap-2" style={{ color: NOIR_COUTURE.silk }}>
                  <Star className="w-3 h-3" style={{ fill: NOIR_COUTURE.silk }} />
                  Service complet
                </p>
                <ul className="space-y-2">
                  {SUBSCRIPTION_PLANS.SIGNATURE.included.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm font-light">
                      <Check className="w-4 h-4 flex-shrink-0" style={{ color: NOIR_COUTURE.silk }} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                
                <div 
                  className="mt-5 p-4 rounded-xl border"
                  style={{ 
                    backgroundColor: NOIR_COUTURE.jet,
                    borderColor: NOIR_COUTURE.border
                  }}
                >
                  <p className="text-[10px] font-medium uppercase tracking-[0.15em] mb-3" style={{ color: NOIR_COUTURE.muted }}>
                    + Avantages
                  </p>
                  <ul className="space-y-2">
                    {SUBSCRIPTION_PLANS.SIGNATURE.businessFeatures.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs font-light" style={{ color: NOIR_COUTURE.muted }}>
                        <Shield className="w-3 h-3 flex-shrink-0" style={{ color: NOIR_COUTURE.muted }} />
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
              transition={{ delay: 0.2, duration: 0.6 }}
              className="p-6 rounded-2xl border"
              style={{ 
                backgroundColor: NOIR_COUTURE.jet,
                borderColor: NOIR_COUTURE.border
              }}
            >
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                style={{ backgroundColor: NOIR_COUTURE.silk }}
              >
                <Users className="w-5 h-5" style={{ color: NOIR_COUTURE.jet }} />
              </div>
              
              <h3 className="text-2xl font-medium mb-1 tracking-tight">Élite</h3>
              <p className="text-sm mb-5 font-light" style={{ color: NOIR_COUTURE.muted }}>Service sur-mesure entreprises</p>
              
              <div className="mb-5">
                <span className="text-2xl font-medium">Sur devis</span>
              </div>
              
              <p className="text-sm mb-6 font-light" style={{ color: NOIR_COUTURE.muted }}>
                Une conciergerie dédiée pour votre équipe.
              </p>
              
              <a 
                href="https://wa.me/33626424394?text=Bonjour%20👋%0AJe%20souhaite%20en%20savoir%20plus%20sur%20le%20service%20Élite%20pour%20mon%20équipe."
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button 
                  variant="outline"
                  className="w-full py-5 font-medium text-sm uppercase tracking-[0.1em]"
                  style={{ 
                    borderColor: NOIR_COUTURE.border,
                    color: NOIR_COUTURE.silk
                  }}
                >
                  Nous contacter
                </Button>
              </a>

              <div className="mt-6 pt-6" style={{ borderTop: `1px solid ${NOIR_COUTURE.border}` }}>
                <p className="text-[10px] font-medium uppercase tracking-[0.15em] mb-3" style={{ color: NOIR_COUTURE.muted }}>Inclus</p>
                <ul className="space-y-2">
                  {SUBSCRIPTION_PLANS.ELITE.included.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm font-light" style={{ color: NOIR_COUTURE.muted }}>
                      <Check className="w-4 h-4 flex-shrink-0" style={{ color: NOIR_COUTURE.muted }} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
          
          {/* Note prix */}
          <p className="text-center text-xs mt-8 font-light" style={{ color: NOIR_COUTURE.muted }}>
            Tous les prix sont indiqués en dirhams marocains (DH). Service disponible au Maroc.
          </p>
        </div>
      </section>

      {/* Detailed Comparison */}
      <section className="py-20 px-4" style={{ backgroundColor: NOIR_COUTURE.jet }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl font-light text-center mb-12 tracking-tight">
            Comparaison des services
          </h2>
          
          <div 
            className="rounded-xl overflow-hidden border"
            style={{ borderColor: NOIR_COUTURE.border }}
          >
            {/* Header */}
            <div 
              className="grid grid-cols-3"
              style={{ backgroundColor: NOIR_COUTURE.jetElevated }}
            >
              <div className="p-4 font-medium text-sm" style={{ color: NOIR_COUTURE.muted }}>Service</div>
              <div 
                className="p-4 text-center font-medium text-sm"
                style={{ borderLeft: `1px solid ${NOIR_COUTURE.border}`, borderRight: `1px solid ${NOIR_COUTURE.border}` }}
              >
                Essentiel
              </div>
              <div 
                className="p-4 text-center font-medium text-sm"
                style={{ backgroundColor: `${NOIR_COUTURE.muted}10`, color: NOIR_COUTURE.silk }}
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
                  backgroundColor: index % 2 === 0 ? `${NOIR_COUTURE.muted}05` : NOIR_COUTURE.jet 
                }}
              >
                <div className="p-4 text-sm font-light">{feature.name}</div>
                <div 
                  className="p-4 flex justify-center items-center"
                  style={{ borderLeft: `1px solid ${NOIR_COUTURE.border}`, borderRight: `1px solid ${NOIR_COUTURE.border}` }}
                >
                  {renderValue(feature.free)}
                </div>
                <div 
                  className="p-4 flex justify-center items-center"
                  style={{ backgroundColor: `${NOIR_COUTURE.muted}05` }}
                >
                  {renderValue(feature.gold)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-4" style={{ backgroundColor: NOIR_COUTURE.jetElevated }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl font-light text-center mb-12 tracking-tight">
            Questions fréquentes
          </h2>
          
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="p-6 rounded-xl border"
                style={{ 
                  backgroundColor: NOIR_COUTURE.jet,
                  borderColor: NOIR_COUTURE.border
                }}
              >
                <h3 className="text-lg font-medium mb-2 tracking-tight">{faq.question}</h3>
                <p className="font-light" style={{ color: NOIR_COUTURE.muted }}>{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4" style={{ backgroundColor: NOIR_COUTURE.jet }}>
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="p-10 md:p-14 rounded-3xl"
            style={{ 
              backgroundColor: NOIR_COUTURE.silk,
            }}
          >
            <Crown className="w-10 h-10 mx-auto mb-6" style={{ color: NOIR_COUTURE.jet }} />
            <h2 className="font-display text-2xl md:text-3xl font-light mb-4 tracking-tight" style={{ color: NOIR_COUTURE.jet }}>
              Prêt à confier votre image à i-wasp ?
            </h2>
            <p className="mb-10 font-light" style={{ color: NOIR_COUTURE.platinum }}>
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
                  className="text-sm uppercase tracking-[0.1em]"
                  style={{ 
                    borderColor: NOIR_COUTURE.jet,
                    color: NOIR_COUTURE.jet
                  }}
                >
                  Service Essentiel
                </Button>
              </a>
              <Link to="/order/type">
                <Button 
                  size="lg" 
                  className="font-medium text-sm uppercase tracking-[0.1em]"
                  style={{ 
                    backgroundColor: NOIR_COUTURE.jet,
                    color: NOIR_COUTURE.silk
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
      
      <CoutureFooter />
    </div>
  );
}
