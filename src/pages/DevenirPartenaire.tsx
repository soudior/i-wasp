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
  ArrowRight,
  Crown,
  Gift,
  Eye,
  Scissors
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import iwaspLogo from "@/assets/iwasp-logo.png";
import nailsHero from "@/assets/nails/nails-hero.png";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DevenirPartenaire = () => {
  const [formData, setFormData] = useState({
    salonName: "",
    city: "",
    manicureStations: "1",
    whatsapp: "",
    email: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.salonName || !formData.city || !formData.whatsapp) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("leads_partenaires" as any)
        .insert({
          salon_name: formData.salonName,
          city: formData.city,
          manicure_stations: parseInt(formData.manicureStations),
          whatsapp: formData.whatsapp,
          email: formData.email || null
        });

      if (error) throw error;

      setSubmitted(true);
      toast.success("Candidature envoyée ! Nous vous contactons sous 24h.");
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
      title: "Tarif Grossiste Exclusif",
      description: "Prix préférentiels réservés à nos partenaires certifiés."
    },
    {
      icon: Eye,
      title: "Visibilité Garantie",
      description: "Référencement sur notre carte des salons partenaires."
    },
    {
      icon: Gift,
      title: "Kit Marketing Offert",
      description: "Présentoir, stickers vitrine et supports de communication."
    },
    {
      icon: Crown,
      title: "Exclusivité Territoriale",
      description: "Nombre limité de partenaires par quartier."
    }
  ];

  const cities = [
    "Casablanca",
    "Marrakech", 
    "Rabat",
    "Tanger",
    "Fès",
    "Agadir",
    "Meknès",
    "Oujda",
    "Kénitra",
    "Tétouan",
    "Autre"
  ];

  const certifiedSalons = [
    { name: "Luxury Nails Lounge", city: "Casablanca", district: "Maarif" },
    { name: "Beauty Palace", city: "Marrakech", district: "Guéliz" },
    { name: "Élégance Spa", city: "Rabat", district: "Agdal" },
    { name: "Prestige Nails", city: "Tanger", district: "Centre-ville" },
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
              Découvrir i-wasp Nails
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
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/30 to-yellow-500/30 text-amber-400 px-5 py-2.5 rounded-full text-sm mb-6 border border-amber-500/40">
              <Crown className="h-4 w-4" />
              Programme Partenaire Exclusif
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Devenez un{" "}
              <span className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                Point de Pose Officiel
              </span>
              <br />i-wasp
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Augmentez le panier moyen de vos clientes en proposant la manucure connectée. 
              Une technologie invisible, une marge garantie pour votre salon.
            </p>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative max-w-xl mx-auto mb-16"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/40 to-yellow-500/40 blur-3xl rounded-full" />
            <img 
              src={nailsHero} 
              alt="i-wasp Nails dans un salon de luxe" 
              className="relative z-10 rounded-2xl shadow-2xl shadow-amber-500/30 border border-amber-500/20"
            />
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-yellow-500 text-black px-6 py-2 rounded-full text-sm font-semibold z-20">
              <Scissors className="h-4 w-4 inline mr-2" />
              Salon Connecté Certifié
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-16 px-4 bg-gradient-to-b from-transparent to-amber-950/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
            Les Avantages du Partenariat
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-xl mx-auto">
            Rejoignez le réseau exclusif des salons i-wasp et transformez votre business.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-gradient-to-b from-white/5 to-white/[0.02] border-amber-500/20 p-6 h-full hover:border-amber-500/40 transition-all hover:shadow-lg hover:shadow-amber-500/10">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 flex items-center justify-center mb-4">
                    <benefit.icon className="h-6 w-6 text-amber-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{benefit.title}</h3>
                  <p className="text-gray-400 text-sm">{benefit.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-16 px-4" id="candidature">
        <div className="max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="bg-gradient-to-b from-amber-500/10 to-transparent border-amber-500/30 p-8 relative overflow-hidden">
              {/* Gold corner accents */}
              <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-amber-500/50" />
              <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-amber-500/50" />
              <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-amber-500/50" />
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-amber-500/50" />

              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                    <CheckCircle2 className="h-10 w-10 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Candidature Reçue !</h3>
                  <p className="text-gray-400 mb-6">
                    Notre équipe commerciale vous contacte sur WhatsApp sous 24h pour finaliser votre partenariat.
                  </p>
                  <Link to="/certificat-partenaire?salon=Demo">
                    <Button className="bg-gradient-to-r from-amber-500 to-yellow-500 text-black">
                      Voir un exemple de certificat
                    </Button>
                  </Link>
                </div>
              ) : (
                <>
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 bg-amber-500/20 px-3 py-1 rounded-full text-amber-400 text-xs mb-4">
                      <Award className="h-3 w-3" />
                      CANDIDATURE PARTENAIRE
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      Formulaire de Candidature Pro
                    </h2>
                    <p className="text-gray-400 text-sm">
                      Rejoignez le réseau des salons connectés i-wasp
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
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:border-amber-500"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="city" className="text-white flex items-center gap-2 mb-2">
                        <MapPin className="h-4 w-4 text-amber-400" />
                        Ville *
                      </Label>
                      <Select 
                        value={formData.city} 
                        onValueChange={(value) => setFormData({ ...formData, city: value })}
                      >
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Sélectionnez votre ville" />
                        </SelectTrigger>
                        <SelectContent>
                          {cities.map((city) => (
                            <SelectItem key={city} value={city}>{city}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="stations" className="text-white flex items-center gap-2 mb-2">
                        <Scissors className="h-4 w-4 text-amber-400" />
                        Nombre de postes de manucure
                      </Label>
                      <Select 
                        value={formData.manicureStations} 
                        onValueChange={(value) => setFormData({ ...formData, manicureStations: value })}
                      >
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} poste{num > 1 ? 's' : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="whatsapp" className="text-white flex items-center gap-2 mb-2">
                        <Phone className="h-4 w-4 text-amber-400" />
                        Numéro WhatsApp *
                      </Label>
                      <Input
                        id="whatsapp"
                        type="tel"
                        placeholder="Ex: +212 6 12 34 56 78"
                        value={formData.whatsapp}
                        onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:border-amber-500"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-white flex items-center gap-2 mb-2">
                        <Star className="h-4 w-4 text-amber-400" />
                        Email (optionnel)
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="contact@votresalon.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:border-amber-500"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 hover:from-amber-600 hover:via-yellow-600 hover:to-amber-600 text-black font-bold py-6 text-lg shadow-lg shadow-amber-500/30"
                    >
                      {isSubmitting ? (
                        "Envoi en cours..."
                      ) : (
                        <>
                          <Crown className="mr-2 h-5 w-5" />
                          Postuler au Programme Partenaire
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

      {/* Partner Salons Map */}
      <section className="py-16 px-4 bg-gradient-to-b from-amber-950/10 to-transparent">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Où poser vos i-wasp Nails ?
            </h2>
            <p className="text-gray-400">
              Nos salons partenaires certifiés au Maroc
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4">
            {certifiedSalons.map((salon, index) => (
              <motion.div
                key={salon.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white/5 border-amber-500/20 p-4 flex items-center gap-4 hover:bg-white/10 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-6 w-6 text-black" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{salon.name}</h3>
                    <p className="text-gray-400 text-sm flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {salon.district}, {salon.city}
                    </p>
                  </div>
                  <div className="ml-auto">
                    <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-1 rounded-full">
                      Certifié
                    </span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-500 text-sm">
              + de nombreux salons en cours de certification...
            </p>
          </div>
        </div>
      </section>

      {/* CTA to Certificate */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 border-amber-500/40 p-8">
            <Award className="h-16 w-16 text-amber-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Recevez votre Certificat Officiel
            </h2>
            <p className="text-gray-400 mb-6">
              Chaque partenaire certifié reçoit un certificat luxueux à afficher dans son salon.
            </p>
            <Link to="/certificat-partenaire?salon=Votre%20Salon">
              <Button className="bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-semibold">
                <Award className="mr-2 h-4 w-4" />
                Voir un exemple de certificat
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-500 text-sm">
            © 2024 i-wasp Maroc. Programme Partenaires Exclusif.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default DevenirPartenaire;
