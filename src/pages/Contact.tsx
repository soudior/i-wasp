/**
 * Contact Page - Enterprise quotes and custom orders
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { 
  Send, 
  Building2, 
  Users, 
  Palette, 
  Handshake,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { toast } from "sonner";

// Form validation schema
const contactSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(100),
  email: z.string().email("Email invalide").max(255),
  phone: z.string().optional(),
  company: z.string().optional(),
  requestType: z.enum(["quote", "custom", "partnership", "other"]),
  quantity: z.string().optional(),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères").max(2000),
});

type ContactFormData = z.infer<typeof contactSchema>;

const requestTypes = [
  { value: "quote", label: "Demande de devis", icon: Building2, description: "Tarifs pour commandes en volume" },
  { value: "custom", label: "Carte sur-mesure", icon: Palette, description: "Design et personnalisation avancée" },
  { value: "partnership", label: "Partenariat", icon: Handshake, description: "Revendeurs et distributeurs" },
  { value: "other", label: "Autre demande", icon: Users, description: "Questions générales" },
];

const contactInfo = [
  { icon: Mail, label: "Email", value: "contact@iwasp.io" },
  { icon: Phone, label: "Téléphone", value: "+212 6 00 00 00 00" },
  { icon: MapPin, label: "Adresse", value: "Casablanca, Maroc" },
  { icon: Clock, label: "Réponse", value: "Sous 24-48h" },
];

export default function Contact() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      requestType: "quote",
      quantity: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from("contact_requests").insert({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        company: data.company || null,
        request_type: data.requestType,
        quantity: data.quantity ? parseInt(data.quantity) : null,
        message: data.message,
      });

      if (error) throw error;

      setIsSuccess(true);
      toast.success("Demande envoyée avec succès !");
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast.error("Erreur lors de l'envoi. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-lg mx-auto text-center py-16"
            >
              <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <h1 className="text-3xl font-display font-bold mb-4">
                Demande envoyée !
              </h1>
              <p className="text-muted-foreground mb-8">
                Merci pour votre message. Notre équipe vous contactera dans les plus brefs délais (24-48h ouvrées).
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => navigate("/")} variant="outline">
                  Retour à l'accueil
                </Button>
                <Button onClick={() => navigate("/order")} className="bg-gradient-to-r from-amber-500 to-amber-600 text-background">
                  Commander une carte
                </Button>
              </div>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
              Contactez-nous
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Demande de devis, carte sur-mesure ou partenariat ? Notre équipe est à votre écoute.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="w-5 h-5 text-primary" />
                    Envoyez-nous votre demande
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      {/* Request Type Selection */}
                      <div>
                        <Label className="mb-3 block">Type de demande</Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {requestTypes.map((type) => {
                            const isSelected = form.watch("requestType") === type.value;
                            return (
                              <button
                                key={type.value}
                                type="button"
                                onClick={() => form.setValue("requestType", type.value as any)}
                                className={`p-3 rounded-xl border-2 text-left transition-all ${
                                  isSelected
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-primary/50"
                                }`}
                              >
                                <type.icon className={`w-5 h-5 mb-2 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                                <p className="text-sm font-medium">{type.label}</p>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nom complet *</FormLabel>
                              <FormControl>
                                <Input placeholder="Votre nom" {...field} className="h-12" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email *</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="votre@email.com" {...field} className="h-12" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Téléphone</FormLabel>
                              <FormControl>
                                <Input type="tel" placeholder="+212 6 00 00 00 00" {...field} className="h-12" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="company"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Entreprise</FormLabel>
                              <FormControl>
                                <Input placeholder="Nom de l'entreprise" {...field} className="h-12" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {(form.watch("requestType") === "quote" || form.watch("requestType") === "custom") && (
                        <FormField
                          control={form.control}
                          name="quantity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Quantité estimée</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger className="h-12">
                                    <SelectValue placeholder="Sélectionnez une quantité" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="1-9">1 à 9 cartes</SelectItem>
                                  <SelectItem value="10-24">10 à 24 cartes</SelectItem>
                                  <SelectItem value="25-99">25 à 99 cartes</SelectItem>
                                  <SelectItem value="100-499">100 à 499 cartes</SelectItem>
                                  <SelectItem value="500+">500+ cartes</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Votre message *</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Décrivez votre projet, vos besoins en personnalisation, délais souhaités..."
                                className="min-h-[150px] resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        size="lg"
                        className="w-full h-12 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-background font-semibold"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Envoi en cours...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-5 w-5" />
                            Envoyer ma demande
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Info Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {/* Contact Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Nos coordonnées</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {contactInfo.map((item) => (
                    <div key={item.label} className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{item.label}</p>
                        <p className="font-medium">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Why choose us */}
              <Card className="bg-gradient-to-br from-primary/5 to-amber-500/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg">Pourquoi nous choisir ?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    "Fabrication locale de qualité",
                    "Prix dégressifs sur volume",
                    "Personnalisation complète",
                    "Support dédié entreprise",
                    "Livraison rapide Maroc",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick CTA */}
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-3">
                    Besoin d'une réponse rapide ?
                  </p>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => window.open("https://wa.me/212600000000", "_blank")}
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    WhatsApp
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
