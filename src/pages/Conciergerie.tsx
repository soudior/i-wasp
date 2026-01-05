/**
 * Conciergerie & IA — Formulaire projet i-wasp
 * Décris ton activité, on te propose une solution complète
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ClubNavbar } from "@/components/ClubNavbar";
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
    <div className="min-h-screen bg-[#0B0B0B] text-white">
      <ClubNavbar />
      
      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="container mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-amber-300/80">Conciergerie & IA</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Décris ton projet,<br />
              <span className="text-amber-400">on s'occupe du reste</span>
            </h1>
            
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Notre IA analyse tes besoins. Un conseiller te propose une solution complète. 
              Tu valides, on livre.
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Benefits */}
      <section className="py-16 px-6 bg-[#121212]">
        <div className="container mx-auto max-w-5xl">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-white/5 border border-white/10"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm text-white/50">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Form + Process */}
      <section className="py-24 px-6 bg-[#0B0B0B]">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold mb-2">Parle-nous de ton projet</h2>
              <p className="text-white/50 mb-8">Remplis le formulaire, on te recontacte en 24h max.</p>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-white/70 mb-2">Ton nom *</label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Jean Dupont"
                      className="bg-white/5 border-white/10 focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/70 mb-2">Téléphone *</label>
                    <Input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="+33 6 12 34 56 78"
                      className="bg-white/5 border-white/10 focus:border-amber-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-white/70 mb-2">Email *</label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="jean@entreprise.com"
                    className="bg-white/5 border-white/10 focus:border-amber-500"
                  />
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-white/70 mb-2">Entreprise</label>
                    <Input
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Mon entreprise"
                      className="bg-white/5 border-white/10 focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/70 mb-2">Secteur</label>
                    <select
                      name="sector"
                      value={formData.sector}
                      onChange={handleChange}
                      className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white focus:border-amber-500 focus:outline-none"
                    >
                      <option value="" className="bg-[#121212]">Sélectionner...</option>
                      <option value="restauration" className="bg-[#121212]">Restauration</option>
                      <option value="immobilier" className="bg-[#121212]">Immobilier</option>
                      <option value="evenementiel" className="bg-[#121212]">Événementiel</option>
                      <option value="commerce" className="bg-[#121212]">Commerce</option>
                      <option value="freelance" className="bg-[#121212]">Freelance / Créateur</option>
                      <option value="autre" className="bg-[#121212]">Autre</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-white/70 mb-2">Décris ton projet *</label>
                  <Textarea
                    name="project"
                    value={formData.project}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder="Quel est ton objectif ? Qu'est-ce que tu veux créer avec le NFC ?"
                    className="bg-white/5 border-white/10 focus:border-amber-500 resize-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-white/70 mb-2">Budget estimé</label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="" className="bg-[#121212]">Sélectionner...</option>
                    <option value="< 100€" className="bg-[#121212]">Moins de 100€</option>
                    <option value="100-500€" className="bg-[#121212]">100€ - 500€</option>
                    <option value="500-1000€" className="bg-[#121212]">500€ - 1000€</option>
                    <option value="> 1000€" className="bg-[#121212]">Plus de 1000€</option>
                  </select>
                </div>
                
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  size="lg"
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-semibold gap-2"
                >
                  <Send className="w-5 h-5" />
                  {isSubmitting ? "Envoi..." : "Envoyer via WhatsApp"}
                </Button>
                
                <p className="text-xs text-white/40 text-center">
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
              <h2 className="text-2xl font-bold mb-2">Comment ça marche</h2>
              <p className="text-white/50 mb-8">Un processus simple en 4 étapes.</p>
              
              <div className="space-y-6">
                {processSteps.map((step, index) => (
                  <div key={step.number} className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-black font-bold">
                      {step.number}
                    </div>
                    <div className="pt-1">
                      <h4 className="font-semibold mb-1">{step.title}</h4>
                      <p className="text-sm text-white/50">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Trust badges */}
              <div className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/10">
                <h4 className="font-semibold mb-4">Ce qu'on garantit</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-white/70">
                    <Check className="w-4 h-4 text-amber-400" />
                    <span>Réponse en moins de 24h</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-white/70">
                    <Check className="w-4 h-4 text-amber-400" />
                    <span>Devis détaillé gratuit</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-white/70">
                    <Check className="w-4 h-4 text-amber-400" />
                    <span>Maquette avant validation</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-white/70">
                    <Check className="w-4 h-4 text-amber-400" />
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
