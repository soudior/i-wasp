import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { 
  Sparkles, 
  Users, 
  TrendingUp, 
  Award, 
  MapPin, 
  Phone, 
  Building2,
  CheckCircle2,
  Star,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import iwaspLogo from "@/assets/iwasp-logo.png";
import nailsHero from "@/assets/nails/nails-hero.png";

const Partenaires = () => {
  const [formData, setFormData] = useState({
    salonName: "",
    city: "",
    clientsPerMonth: "",
    phone: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.salonName || !formData.city || !formData.phone) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("contact_requests")
        .insert({
          name: formData.salonName,
          email: `${formData.salonName.toLowerCase().replace(/\s+/g, '')}@partenaire.iwasp.ma`,
          phone: formData.phone,
          company: formData.salonName,
          message: `Demande partenariat Pro - Ville: ${formData.city}, Clients/mois: ${formData.clientsPerMonth || 'Non spécifié'}`,
          request_type: "partnership",
          quantity: parseInt(formData.clientsPerMonth) || null
        });

      if (error) throw error;

      setSubmitted(true);
      toast.success("Demande envoyée ! Nous vous contactons sous 24h.");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Erreur lors de l'envoi. Réessayez.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    {
      icon: TrendingUp,
      title: "Revenu Supplémentaire",
      description: "Marge directe sur chaque vente. Tarifs Pro exclusifs."
    },
    {
      icon: Users,
      title: "Nouveaux Clients",
      description: "Référencement comme 'Point de Pose Officiel' sur notre site."
    },
    {
      icon: Award,
      title: "Innovation Exclusive",
      description: "Proposez la 'Manucure Connectée' avant vos concurrents."
    },
    {
      icon: Sparkles,
      title: "Kit Marketing Offert",
      description: "Présentoir, stickers vitrine et formation inclus."
    }
  ];

  const offers = [
    {
      name: "Pack Découverte",
      quantity: "10 puces",
      price: "600 DH",
      features: ["Formation pose incluse", "Présentoir comptoir", "Stickers vitrine"]
    },
    {
      name: "Pack Salon",
      quantity: "25 puces",
      price: "1 200 DH",
      features: ["Tout le Pack Découverte", "Affiches personnalisées", "Support prioritaire"]
    },
    {
      name: "Pack Premium",
      quantity: "50+ puces",
      price: "Sur devis",
      features: ["Prix négocié", "Exclusivité zone", "Co-marketing"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a1a] via-[#0d0d0d] to-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-amber-500/20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={iwaspLogo} alt="i-wasp" className="h-8" />
          </Link>
          <Link to="/nails">
            <Button variant="outline" className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10">
              Voir les produits
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 px-4 py-2 rounded-full text-sm mb-6">
              <Star className="h-4 w-4" />
              Programme Partenaires Professionnels
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Devenez le premier{" "}
              <span className="bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
                "Salon Connecté"
              </span>{" "}
              de votre ville
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Transformez chaque manucure en une expérience unique. Proposez i-wasp Nails 
              à vos clientes et générez un nouveau revenu.
            </p>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative max-w-2xl mx-auto mb-16"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/30 to-yellow-500/30 blur-3xl rounded-full" />
            <img 
              src={nailsHero} 
              alt="i-wasp Nails dans un salon de luxe" 
              className="relative z-10 rounded-2xl shadow-2xl shadow-amber-500/20"
            />
          </motion.div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-16 px-4 bg-gradient-to-b from-transparent to-amber-950/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Pourquoi devenir partenaire i-wasp ?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white/5 border-amber-500/20 p-6 h-full hover:bg-white/10 transition-colors">
                  <benefit.icon className="h-10 w-10 text-amber-400 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">{benefit.title}</h3>
                  <p className="text-gray-400 text-sm">{benefit.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Offers Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
            Offres de Lancement Pro
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-xl mx-auto">
            Tarifs exclusifs pour nos premiers partenaires. Réservé aux salons sérieux.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {offers.map((offer, index) => (
              <motion.div
                key={offer.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`p-6 h-full ${
                  index === 1 
                    ? "bg-gradient-to-b from-amber-500/20 to-amber-900/20 border-amber-500/50" 
                    : "bg-white/5 border-white/10"
                }`}>
                  {index === 1 && (
                    <div className="text-amber-400 text-xs font-semibold mb-2">⭐ POPULAIRE</div>
                  )}
                  <h3 className="text-xl font-bold text-white mb-1">{offer.name}</h3>
                  <p className="text-gray-400 text-sm mb-3">{offer.quantity}</p>
                  <p className="text-3xl font-bold text-amber-400 mb-4">{offer.price}</p>
                  <ul className="space-y-2">
                    {offer.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-gray-300">
                        <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 px-4 bg-gradient-to-b from-amber-950/20 to-transparent">
        <div className="max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="bg-white/5 border-amber-500/30 p-8">
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-8 w-8 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Demande reçue !</h3>
                  <p className="text-gray-400">
                    Notre équipe commerciale vous contacte sous 24h pour discuter du partenariat.
                  </p>
                </div>
              ) : (
                <>
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2">
                      Demander le catalogue tarifs Pro
                    </h2>
                    <p className="text-gray-400 text-sm">
                      Remplissez ce formulaire et recevez nos offres exclusives partenaires.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <Label htmlFor="salonName" className="text-white flex items-center gap-2 mb-2">
                        <Building2 className="h-4 w-4 text-amber-400" />
                        Nom du Salon *
                      </Label>
                      <Input
                        id="salonName"
                        placeholder="Ex: Beauty Lounge Marrakech"
                        value={formData.salonName}
                        onChange={(e) => setFormData({ ...formData, salonName: e.target.value })}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="city" className="text-white flex items-center gap-2 mb-2">
                        <MapPin className="h-4 w-4 text-amber-400" />
                        Ville *
                      </Label>
                      <Input
                        id="city"
                        placeholder="Ex: Casablanca, Marrakech, Rabat..."
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="clientsPerMonth" className="text-white flex items-center gap-2 mb-2">
                        <Users className="h-4 w-4 text-amber-400" />
                        Nombre de clientes / mois
                      </Label>
                      <Input
                        id="clientsPerMonth"
                        type="number"
                        placeholder="Ex: 150"
                        value={formData.clientsPerMonth}
                        onChange={(e) => setFormData({ ...formData, clientsPerMonth: e.target.value })}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-white flex items-center gap-2 mb-2">
                        <Phone className="h-4 w-4 text-amber-400" />
                        Téléphone *
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Ex: 06 12 34 56 78"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-semibold py-6 text-lg"
                    >
                      {isSubmitting ? (
                        "Envoi en cours..."
                      ) : (
                        <>
                          Demander le catalogue tarifs Pro
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </form>
                </>
              )}
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-500 text-sm">
            © 2024 i-wasp Maroc. Programme Partenaires Professionnels.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Partenaires;
