/**
 * Conciergerie & IA — Formulaire projet i-wasp
 * Stealth Luxury Style - Argent Titane (#A5A9B4)
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Navbar } from "@/components/Navbar";
import { GlobalFooter } from "@/components/GlobalFooter";
import { 
  Sparkles, 
  Send, 
  Check,
  MessageSquare,
  Zap,
  Clock,
  Shield,
  ArrowRight
} from "lucide-react";
import { toast } from "sonner";

const WHATSAPP_PROJECT_URL = "https://wa.me/33626424394?text=";

// Stealth Luxury Colors
const COLORS = {
  bg: "#050807",
  bgCard: "#0A0D0C",
  accent: "#A5A9B4",
  accentLight: "#D1D5DB",
  text: "#F9FAFB",
  textMuted: "rgba(249, 250, 251, 0.7)",
  textDim: "rgba(249, 250, 251, 0.5)",
  border: "rgba(165, 169, 180, 0.15)",
  borderActive: "rgba(165, 169, 180, 0.4)",
};

// Benefits
const benefits = [
  {
    icon: Sparkles,
    title: "IA qui comprend ton métier",
    description: "Notre IA analyse ton activité et propose des solutions adaptées à ton secteur."
  },
  {
    icon: MessageSquare,
    title: "Un humain te répond",
    description: "Pas de robot. Un conseiller dédié étudie ton projet et te rappelle."
  },
  {
    icon: Clock,
    title: "Réponse en 24h",
    description: "Proposition détaillée avec maquette, devis et planning de livraison."
  },
  {
    icon: Shield,
    title: "Accompagnement A-Z",
    description: "Du brief à la livraison, on gère tout. Tu valides, on exécute."
  }
];

// Process steps
const processSteps = [
  { number: "1", title: "Tu décris ton projet", description: "Activité, objectifs, contraintes" },
  { number: "2", title: "Notre IA analyse", description: "Solutions optimales identifiées" },
  { number: "3", title: "Un conseiller te contacte", description: "Échange personnalisé" },
  { number: "4", title: "On conçoit pour toi", description: "Design, programmation, livraison" }
];

export default function Conciergerie() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    sector: "",
    project: "",
    budget: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Build WhatsApp message
    const message = `Bonjour 👋

*Nouveau projet conciergerie*

📋 *Infos*
- Nom : ${formData.name}
- Email : ${formData.email}
- Téléphone : ${formData.phone}
- Entreprise : ${formData.company}
- Secteur : ${formData.sector}

📝 *Projet*
${formData.project}

💰 *Budget estimé*
${formData.budget}`;

    // Open WhatsApp with pre-filled message
    window.open(WHATSAPP_PROJECT_URL + encodeURIComponent(message), "_blank");
    
    toast.success("Message préparé ! WhatsApp va s'ouvrir.");
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.bg, color: COLORS.text }}>
      <Navbar />
      
      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="container mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{ backgroundColor: `${COLORS.accent}10`, border: `1px solid ${COLORS.border}` }}
            >
              <Sparkles className="w-4 h-4" style={{ color: COLORS.accent }} />
              <span className="text-sm" style={{ color: COLORS.textMuted }}>Conciergerie & IA</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Décris ton projet,<br />
              <span style={{ color: COLORS.accent }}>on s'occupe du reste</span>
            </h1>
            
            <p className="text-xl max-w-2xl mx-auto" style={{ color: COLORS.textDim }}>
              Notre IA analyse tes besoins. Un conseiller te propose une solution complète. 
              Tu valides, on livre.
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Benefits */}
      <section className="py-16 px-6" style={{ backgroundColor: COLORS.bgCard }}>
        <div className="container mx-auto max-w-5xl">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl"
                style={{ backgroundColor: `${COLORS.text}05`, border: `1px solid ${COLORS.border}` }}
              >
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${COLORS.accent}15` }}
                >
                  <benefit.icon className="w-6 h-6" style={{ color: COLORS.accent }} />
                </div>
                <h3 className="font-semibold mb-2" style={{ color: COLORS.text }}>{benefit.title}</h3>
                <p className="text-sm" style={{ color: COLORS.textDim }}>{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Form + Process */}
      <section className="py-24 px-6" style={{ backgroundColor: COLORS.bg }}>
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold mb-2" style={{ color: COLORS.text }}>Parle-nous de ton projet</h2>
              <p className="mb-8" style={{ color: COLORS.textDim }}>Remplis le formulaire, on te recontacte en 24h max.</p>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2" style={{ color: COLORS.textMuted }}>Ton nom *</label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Jean Dupont"
                      className="h-12"
                      style={{ 
                        backgroundColor: `${COLORS.text}05`, 
                        borderColor: COLORS.border,
                        color: COLORS.text
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2" style={{ color: COLORS.textMuted }}>Téléphone *</label>
                    <Input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="+33 6 12 34 56 78"
                      className="h-12"
                      style={{ 
                        backgroundColor: `${COLORS.text}05`, 
                        borderColor: COLORS.border,
                        color: COLORS.text
                      }}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm mb-2" style={{ color: COLORS.textMuted }}>Email *</label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="jean@entreprise.com"
                    className="h-12"
                    style={{ 
                      backgroundColor: `${COLORS.text}05`, 
                      borderColor: COLORS.border,
                      color: COLORS.text
                    }}
                  />
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2" style={{ color: COLORS.textMuted }}>Entreprise</label>
                    <Input
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Mon entreprise"
                      className="h-12"
                      style={{ 
                        backgroundColor: `${COLORS.text}05`, 
                        borderColor: COLORS.border,
                        color: COLORS.text
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2" style={{ color: COLORS.textMuted }}>Secteur</label>
                    <select
                      name="sector"
                      value={formData.sector}
                      onChange={handleChange}
                      className="w-full h-12 px-3 rounded-md focus:outline-none transition-colors"
                      style={{ 
                        backgroundColor: `${COLORS.text}05`, 
                        border: `1px solid ${COLORS.border}`,
                        color: COLORS.text
                      }}
                    >
                      <option value="" style={{ backgroundColor: COLORS.bgCard }}>Sélectionner...</option>
                      <option value="restauration" style={{ backgroundColor: COLORS.bgCard }}>Restauration</option>
                      <option value="immobilier" style={{ backgroundColor: COLORS.bgCard }}>Immobilier</option>
                      <option value="evenementiel" style={{ backgroundColor: COLORS.bgCard }}>Événementiel</option>
                      <option value="commerce" style={{ backgroundColor: COLORS.bgCard }}>Commerce</option>
                      <option value="freelance" style={{ backgroundColor: COLORS.bgCard }}>Freelance / Créateur</option>
                      <option value="autre" style={{ backgroundColor: COLORS.bgCard }}>Autre</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm mb-2" style={{ color: COLORS.textMuted }}>Décris ton projet *</label>
                  <Textarea
                    name="project"
                    value={formData.project}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder="Quel est ton objectif ? Qu'est-ce que tu veux créer avec le NFC ?"
                    className="resize-none"
                    style={{ 
                      backgroundColor: `${COLORS.text}05`, 
                      borderColor: COLORS.border,
                      color: COLORS.text
                    }}
                  />
                </div>
                
                <div>
                  <label className="block text-sm mb-2" style={{ color: COLORS.textMuted }}>Budget estimé</label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full h-12 px-3 rounded-md focus:outline-none transition-colors"
                    style={{ 
                      backgroundColor: `${COLORS.text}05`, 
                      border: `1px solid ${COLORS.border}`,
                      color: COLORS.text
                    }}
                  >
                    <option value="" style={{ backgroundColor: COLORS.bgCard }}>Sélectionner...</option>
                    <option value="< 100€" style={{ backgroundColor: COLORS.bgCard }}>Moins de 100€</option>
                    <option value="100-500€" style={{ backgroundColor: COLORS.bgCard }}>100€ - 500€</option>
                    <option value="500-1000€" style={{ backgroundColor: COLORS.bgCard }}>500€ - 1000€</option>
                    <option value="> 1000€" style={{ backgroundColor: COLORS.bgCard }}>Plus de 1000€</option>
                  </select>
                </div>
                
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  size="lg"
                  className="w-full font-semibold gap-2 h-14 text-base"
                  style={{ 
                    background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentLight})`,
                    color: COLORS.bg
                  }}
                >
                  <Send className="w-5 h-5" />
                  {isSubmitting ? "Envoi..." : "Envoyer via WhatsApp"}
                </Button>
                
                <p className="text-xs text-center" style={{ color: COLORS.textDim }}>
                  En soumettant, tu acceptes d'être recontacté par notre équipe.
                </p>
              </form>
            </motion.div>
            
            {/* Process */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold mb-2" style={{ color: COLORS.text }}>Comment ça marche</h2>
              <p className="mb-8" style={{ color: COLORS.textDim }}>Un processus simple en 4 étapes.</p>
              
              <div className="space-y-6">
                {processSteps.map((step, index) => (
                  <div key={step.number} className="flex gap-4">
                    <div 
                      className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold"
                      style={{ 
                        background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentLight})`,
                        color: COLORS.bg
                      }}
                    >
                      {step.number}
                    </div>
                    <div className="pt-1">
                      <h4 className="font-semibold mb-1" style={{ color: COLORS.text }}>{step.title}</h4>
                      <p className="text-sm" style={{ color: COLORS.textDim }}>{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Trust badges */}
              <div 
                className="mt-12 p-6 rounded-2xl"
                style={{ backgroundColor: `${COLORS.text}05`, border: `1px solid ${COLORS.border}` }}
              >
                <h4 className="font-semibold mb-4" style={{ color: COLORS.text }}>Ce qu'on garantit</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm" style={{ color: COLORS.textMuted }}>
                    <Check className="w-4 h-4" style={{ color: COLORS.accent }} />
                    <span>Réponse en moins de 24h</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm" style={{ color: COLORS.textMuted }}>
                    <Check className="w-4 h-4" style={{ color: COLORS.accent }} />
                    <span>Devis détaillé gratuit</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm" style={{ color: COLORS.textMuted }}>
                    <Check className="w-4 h-4" style={{ color: COLORS.accent }} />
                    <span>Maquette avant validation</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm" style={{ color: COLORS.textMuted }}>
                    <Check className="w-4 h-4" style={{ color: COLORS.accent }} />
                    <span>Sans engagement</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      <GlobalFooter variant="dark" />
    </div>
  );
}
