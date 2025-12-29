import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DigitalCard } from "@/components/DigitalCard";
import { 
  User, Mail, Phone, MapPin, Globe, Briefcase, Building2, 
  MessageSquare, Linkedin, Instagram, Twitter, Save, Eye
} from "lucide-react";

const CreateCard = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    title: "",
    company: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    instagram: "",
    twitter: "",
    tagline: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Créez votre <span className="text-gradient-gold">carte digitale</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Personnalisez votre carte de visite et partagez-la instantanément
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card variant="premium" className="p-6">
                <Tabs defaultValue="info" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-secondary mb-6">
                    <TabsTrigger value="info">Informations</TabsTrigger>
                    <TabsTrigger value="social">Réseaux</TabsTrigger>
                    <TabsTrigger value="style">Style</TabsTrigger>
                  </TabsList>

                  <TabsContent value="info" className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="flex items-center gap-2">
                          <User size={14} className="text-primary" />
                          Prénom
                        </Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          placeholder="Alexandre"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="bg-secondary border-border"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="flex items-center gap-2">
                          <User size={14} className="text-primary" />
                          Nom
                        </Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          placeholder="Dubois"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="bg-secondary border-border"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="title" className="flex items-center gap-2">
                        <Briefcase size={14} className="text-primary" />
                        Fonction
                      </Label>
                      <Input
                        id="title"
                        name="title"
                        placeholder="Directeur Général"
                        value={formData.title}
                        onChange={handleChange}
                        className="bg-secondary border-border"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company" className="flex items-center gap-2">
                        <Building2 size={14} className="text-primary" />
                        Entreprise
                      </Label>
                      <Input
                        id="company"
                        name="company"
                        placeholder="Prestige Corp"
                        value={formData.company}
                        onChange={handleChange}
                        className="bg-secondary border-border"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail size={14} className="text-primary" />
                        Email
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="contact@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="bg-secondary border-border"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone size={14} className="text-primary" />
                        Téléphone
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        placeholder="+33 6 12 34 56 78"
                        value={formData.phone}
                        onChange={handleChange}
                        className="bg-secondary border-border"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location" className="flex items-center gap-2">
                        <MapPin size={14} className="text-primary" />
                        Localisation
                      </Label>
                      <Input
                        id="location"
                        name="location"
                        placeholder="Paris, France"
                        value={formData.location}
                        onChange={handleChange}
                        className="bg-secondary border-border"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tagline" className="flex items-center gap-2">
                        <MessageSquare size={14} className="text-primary" />
                        Phrase emblématique
                      </Label>
                      <Input
                        id="tagline"
                        name="tagline"
                        placeholder="L'excellence en toute simplicité"
                        value={formData.tagline}
                        onChange={handleChange}
                        className="bg-secondary border-border"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="social" className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="website" className="flex items-center gap-2">
                        <Globe size={14} className="text-primary" />
                        Site web
                      </Label>
                      <Input
                        id="website"
                        name="website"
                        placeholder="www.example.com"
                        value={formData.website}
                        onChange={handleChange}
                        className="bg-secondary border-border"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="linkedin" className="flex items-center gap-2">
                        <Linkedin size={14} className="text-primary" />
                        LinkedIn
                      </Label>
                      <Input
                        id="linkedin"
                        name="linkedin"
                        placeholder="votre-profil"
                        value={formData.linkedin}
                        onChange={handleChange}
                        className="bg-secondary border-border"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="instagram" className="flex items-center gap-2">
                        <Instagram size={14} className="text-primary" />
                        Instagram
                      </Label>
                      <Input
                        id="instagram"
                        name="instagram"
                        placeholder="@votre_compte"
                        value={formData.instagram}
                        onChange={handleChange}
                        className="bg-secondary border-border"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="twitter" className="flex items-center gap-2">
                        <Twitter size={14} className="text-primary" />
                        Twitter / X
                      </Label>
                      <Input
                        id="twitter"
                        name="twitter"
                        placeholder="@votre_compte"
                        value={formData.twitter}
                        onChange={handleChange}
                        className="bg-secondary border-border"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="style" className="space-y-6">
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">
                        Options de personnalisation avancées bientôt disponibles
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex gap-4 mt-8">
                  <Button variant="chrome" className="flex-1">
                    <Save size={18} />
                    Enregistrer
                  </Button>
                  <Button variant="outline">
                    <Eye size={18} />
                    Aperçu
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Preview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="lg:sticky lg:top-24"
            >
              <div className="text-center mb-6">
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  Aperçu en direct
                </h3>
                <p className="text-sm text-muted-foreground">
                  Votre carte se met à jour automatiquement
                </p>
              </div>
              
              <DigitalCard 
                data={{
                  firstName: formData.firstName || "Alexandre",
                  lastName: formData.lastName || "Dubois",
                  title: formData.title || "Directeur Général",
                  company: formData.company || "Prestige Corp",
                  email: formData.email || "a.dubois@prestige.com",
                  phone: formData.phone || "+33 6 12 34 56 78",
                  location: formData.location || "Paris, France",
                  website: formData.website || "prestige-corp.com",
                  linkedin: formData.linkedin || "alexandre-dubois",
                  instagram: formData.instagram || "@adubois",
                  tagline: formData.tagline || "L'excellence en toute simplicité",
                }} 
              />
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreateCard;
