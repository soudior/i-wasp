/**
 * Contact Page - Formulaire de contact i-wasp
 * Design dark luxury avec ClubNavbar
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ClubNavbar } from "@/components/ClubNavbar";
import { GlobalFooter } from "@/components/GlobalFooter";
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
  Loader2,
  MessageSquare
} from "lucide-react";
import { toast } from "sonner";

// Form validation schema
const contactSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(100),
  email: z.string().email("Email invalide").max(255),
  phone: z.string().optional(),
  company: z.string().optional(),
  requestType: z.enum(["quote", "custom", "partnership", "other"]),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères").max(2000),
});

type ContactFormData = z.infer<typeof contactSchema>;

const requestTypes = [
  { value: "quote", label: "Devis", icon: Building2 },
  { value: "custom", label: "Sur-mesure", icon: Palette },
  { value: "partnership", label: "Partenariat", icon: Handshake },
  { value: "other", label: "Autre", icon: Users },
];

const contactInfo = [
  { icon: Mail, label: "Email", value: "contact@i-wasp.com" },
  { icon: Phone, label: "WhatsApp", value: "+33 6 26 42 43 94" },
  { icon: MapPin, label: "Adresse", value: "Paris, France" },
  { icon: Clock, label: "Réponse", value: "Sous 24h" },
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
        message: data.message,
      });

      if (error) throw error;

      setIsSuccess(true);
      toast.success("Message envoyé !");
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast.error("Erreur lors de l'envoi. Réessayez.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] text-white">
        <ClubNavbar />
        <main className="pt-32 pb-16 px-6">
          <div className="container mx-auto max-w-lg">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="w-20 h-20 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-amber-400" />
              </div>
              <h1 className="text-3xl font-bold mb-4">
                Message envoyé !
              </h1>
              <p className="text-white/60 mb-8">
                Merci pour votre message. Notre équipe vous contactera dans les 24h.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/">
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    Retour à l'accueil
                  </Button>
                </Link>
                <Link to="/conciergerie">
                  <Button className="bg-amber-500 hover:bg-amber-600 text-black">
                    Lancer un projet
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    );
  }

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
              <MessageSquare className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-amber-300/80">Contact</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Une question ?<br />
              <span className="text-amber-400">Parlons-en</span>
            </h1>
            
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Devis, projet sur-mesure ou partenariat ? Notre équipe est à votre écoute.
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Form + Info */}
      <section className="py-16 px-6 bg-[#121212]">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Send className="w-5 h-5 text-amber-400" />
                  Envoyez-nous un message
                </h2>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Request Type */}
                    <div>
                      <Label className="mb-3 block text-white/70">Type de demande</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {requestTypes.map((type) => {
                          const isSelected = form.watch("requestType") === type.value;
                          return (
                            <button
                              key={type.value}
                              type="button"
                              onClick={() => form.setValue("requestType", type.value as any)}
                              className={`p-3 rounded-xl border text-center transition-all ${
                                isSelected
                                  ? "border-amber-500 bg-amber-500/10"
                                  : "border-white/10 hover:border-white/30"
                              }`}
                            >
                              <type.icon className={`w-5 h-5 mx-auto mb-2 ${isSelected ? "text-amber-400" : "text-white/50"}`} />
                              <p className="text-sm font-medium">{type.label}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white/70">Nom *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Votre nom" 
                                {...field} 
                                className="bg-white/5 border-white/10 focus:border-amber-500" 
                              />
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
                            <FormLabel className="text-white/70">Email *</FormLabel>
                            <FormControl>
                              <Input 
                                type="email" 
                                placeholder="votre@email.com" 
                                {...field} 
                                className="bg-white/5 border-white/10 focus:border-amber-500" 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white/70">Téléphone</FormLabel>
                            <FormControl>
                              <Input 
                                type="tel" 
                                placeholder="+33 6 00 00 00 00" 
                                {...field} 
                                className="bg-white/5 border-white/10 focus:border-amber-500" 
                              />
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
                            <FormLabel className="text-white/70">Entreprise</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Nom de l'entreprise" 
                                {...field} 
                                className="bg-white/5 border-white/10 focus:border-amber-500" 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/70">Message *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Décrivez votre projet..."
                              className="min-h-[120px] resize-none bg-white/5 border-white/10 focus:border-amber-500"
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
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-semibold"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Envoi...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-5 w-5" />
                          Envoyer
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Contact Info */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="font-semibold mb-4">Nos coordonnées</h3>
                <div className="space-y-4">
                  {contactInfo.map((item) => (
                    <div key={item.label} className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <p className="text-sm text-white/50">{item.label}</p>
                        <p className="font-medium">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* WhatsApp CTA */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20">
                <h3 className="font-semibold mb-2">Réponse rapide ?</h3>
                <p className="text-sm text-white/60 mb-4">
                  Contactez-nous directement sur WhatsApp pour une réponse immédiate.
                </p>
                <a 
                  href="https://wa.me/33626424394?text=Bonjour%20👋%0AJ'ai%20une%20question%20sur%20i-wasp."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="w-full bg-amber-500 hover:bg-amber-600 text-black">
                    <Phone className="mr-2 h-4 w-4" />
                    WhatsApp
                  </Button>
                </a>
              </div>

              {/* Trust */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="font-semibold mb-4">On garantit</h3>
                <div className="space-y-3">
                  {[
                    "Réponse en 24h max",
                    "Devis gratuit et sans engagement",
                    "Accompagnement personnalisé",
                    "Support après-vente",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-white/70">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
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
