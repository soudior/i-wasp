/**
 * Contact Page - Apple/Cupertino Style
 * Ultra-minimal, clean, professional
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { SEOHead, SEO_CONFIGS } from "@/components/SEOHead";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  MessageSquare,
  ArrowLeft
} from "lucide-react";
import { toast } from "sonner";
import { APPLE } from "@/lib/applePalette";

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

  // Success State
  if (isSuccess) {
    return (
      <>
        <SEOHead {...SEO_CONFIGS.contact} />
        <div className="min-h-screen" style={{ backgroundColor: APPLE.background }}>
          {/* Header */}
          <header 
            className="sticky top-0 z-50 backdrop-blur-xl"
            style={{ 
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              borderBottom: `1px solid ${APPLE.border}`
            }}
          >
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
              <Link 
                to="/" 
                className="text-xl font-semibold tracking-tight"
                style={{ color: APPLE.text }}
              >
                IWASP
              </Link>
              <Link to="/express/offre">
                <Button 
                  className="rounded-full px-6 h-10 font-medium"
                  style={{ backgroundColor: APPLE.accent, color: "#FFFFFF" }}
                >
                  Commander
                </Button>
              </Link>
            </div>
          </header>

          <main className="pt-24 pb-16 px-6">
            <div className="max-w-lg mx-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <div 
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{ backgroundColor: APPLE.accentSubtle }}
                >
                  <CheckCircle2 className="w-10 h-10" style={{ color: APPLE.accent }} />
                </div>
                <h1 
                  className="text-3xl font-bold mb-4 tracking-tight"
                  style={{ color: APPLE.text }}
                >
                  Message envoyé !
                </h1>
                <p 
                  className="mb-8 text-lg"
                  style={{ color: APPLE.textSecondary }}
                >
                  Merci pour votre message. Notre équipe vous contactera dans les 24h.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/">
                    <Button 
                      variant="outline" 
                      className="rounded-full px-6"
                      style={{ 
                        borderColor: APPLE.border, 
                        color: APPLE.text,
                        backgroundColor: "transparent"
                      }}
                    >
                      Retour à l'accueil
                    </Button>
                  </Link>
                  <Link to="/express/offre">
                    <Button 
                      className="rounded-full px-6"
                      style={{ backgroundColor: APPLE.accent, color: "#FFFFFF" }}
                    >
                      Commander une carte
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead {...SEO_CONFIGS.contact} />
      <div className="min-h-screen" style={{ backgroundColor: APPLE.background }}>
        {/* Header */}
        <header 
          className="sticky top-0 z-50 backdrop-blur-xl"
          style={{ 
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            borderBottom: `1px solid ${APPLE.border}`
          }}
        >
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link 
              to="/" 
              className="text-xl font-semibold tracking-tight"
              style={{ color: APPLE.text }}
            >
              IWASP
            </Link>
            <Link to="/express/offre">
              <Button 
                className="rounded-full px-6 h-10 font-medium"
                style={{ backgroundColor: APPLE.accent, color: "#FFFFFF" }}
              >
                Commander
              </Button>
            </Link>
          </div>
        </header>

        {/* Hero */}
        <section 
          className="pt-16 pb-12 px-6"
          style={{ backgroundColor: APPLE.backgroundPure, borderBottom: `1px solid ${APPLE.border}` }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                style={{ backgroundColor: APPLE.accentSubtle }}
              >
                <MessageSquare className="w-4 h-4" style={{ color: APPLE.accent }} />
                <span className="text-sm font-medium" style={{ color: APPLE.accent }}>Contact</span>
              </div>
              
              <h1 
                className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight"
                style={{ color: APPLE.text }}
              >
                Une question ?
              </h1>
              
              <p 
                className="text-xl max-w-2xl mx-auto"
                style={{ color: APPLE.textSecondary }}
              >
                Devis, projet sur-mesure ou partenariat ? Notre équipe est à votre écoute.
              </p>
            </motion.div>
          </div>
        </section>
        
        {/* Form + Info */}
        <section className="py-12 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="lg:col-span-2"
              >
                <div 
                  className="p-8 rounded-2xl"
                  style={{ 
                    backgroundColor: APPLE.card, 
                    boxShadow: APPLE.shadowCard
                  }}
                >
                  <h2 
                    className="text-xl font-semibold mb-6 flex items-center gap-2"
                    style={{ color: APPLE.text }}
                  >
                    <Send className="w-5 h-5" style={{ color: APPLE.accent }} />
                    Envoyez-nous un message
                  </h2>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      {/* Request Type */}
                      <div>
                        <label 
                          className="text-sm font-medium mb-3 block"
                          style={{ color: APPLE.textSecondary }}
                        >
                          Type de demande
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {requestTypes.map((type) => {
                            const isSelected = form.watch("requestType") === type.value;
                            return (
                              <button
                                key={type.value}
                                type="button"
                                onClick={() => form.setValue("requestType", type.value as any)}
                                className="p-3 rounded-xl text-center transition-all"
                                style={{
                                  backgroundColor: isSelected ? APPLE.accentSubtle : APPLE.backgroundSubtle,
                                  border: isSelected 
                                    ? `2px solid ${APPLE.accent}` 
                                    : `1px solid ${APPLE.border}`,
                                }}
                              >
                                <type.icon 
                                  className="w-5 h-5 mx-auto mb-2" 
                                  style={{ color: isSelected ? APPLE.accent : APPLE.textSecondary }} 
                                />
                                <p 
                                  className="text-sm font-medium"
                                  style={{ color: isSelected ? APPLE.accent : APPLE.text }}
                                >
                                  {type.label}
                                </p>
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
                              <FormLabel style={{ color: APPLE.textSecondary }}>Nom *</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Votre nom" 
                                  {...field} 
                                  className="h-12 rounded-xl"
                                  style={{ 
                                    backgroundColor: APPLE.background,
                                    border: `1px solid ${APPLE.border}`,
                                    color: APPLE.text
                                  }}
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
                              <FormLabel style={{ color: APPLE.textSecondary }}>Email *</FormLabel>
                              <FormControl>
                                <Input 
                                  type="email" 
                                  placeholder="votre@email.com" 
                                  {...field} 
                                  className="h-12 rounded-xl"
                                  style={{ 
                                    backgroundColor: APPLE.background,
                                    border: `1px solid ${APPLE.border}`,
                                    color: APPLE.text
                                  }}
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
                              <FormLabel style={{ color: APPLE.textSecondary }}>Téléphone</FormLabel>
                              <FormControl>
                                <Input 
                                  type="tel" 
                                  placeholder="+33 6 00 00 00 00" 
                                  {...field} 
                                  className="h-12 rounded-xl"
                                  style={{ 
                                    backgroundColor: APPLE.background,
                                    border: `1px solid ${APPLE.border}`,
                                    color: APPLE.text
                                  }}
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
                              <FormLabel style={{ color: APPLE.textSecondary }}>Entreprise</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Nom de l'entreprise" 
                                  {...field} 
                                  className="h-12 rounded-xl"
                                  style={{ 
                                    backgroundColor: APPLE.background,
                                    border: `1px solid ${APPLE.border}`,
                                    color: APPLE.text
                                  }}
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
                            <FormLabel style={{ color: APPLE.textSecondary }}>Message *</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Décrivez votre projet..."
                                className="min-h-[120px] resize-none rounded-xl"
                                style={{ 
                                  backgroundColor: APPLE.background,
                                  border: `1px solid ${APPLE.border}`,
                                  color: APPLE.text
                                }}
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
                        className="w-full font-semibold h-14 rounded-xl text-base"
                        style={{ backgroundColor: APPLE.accent, color: "#FFFFFF" }}
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
                            Envoyer le message
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </div>
              </motion.div>

              {/* Sidebar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-6"
              >
                {/* Contact Info */}
                <div 
                  className="p-6 rounded-2xl"
                  style={{ 
                    backgroundColor: APPLE.card, 
                    boxShadow: APPLE.shadowCard
                  }}
                >
                  <h3 
                    className="font-semibold mb-4"
                    style={{ color: APPLE.text }}
                  >
                    Nos coordonnées
                  </h3>
                  <div className="space-y-4">
                    {contactInfo.map((item) => (
                      <div key={item.label} className="flex items-start gap-3">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: APPLE.accentSubtle }}
                        >
                          <item.icon className="w-5 h-5" style={{ color: APPLE.accent }} />
                        </div>
                        <div>
                          <p className="text-sm" style={{ color: APPLE.textSecondary }}>{item.label}</p>
                          <p className="font-medium" style={{ color: APPLE.text }}>{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* WhatsApp CTA */}
                <div 
                  className="p-6 rounded-2xl"
                  style={{ 
                    backgroundColor: APPLE.card, 
                    boxShadow: APPLE.shadowCard
                  }}
                >
                  <h3 
                    className="font-semibold mb-2"
                    style={{ color: APPLE.text }}
                  >
                    Réponse rapide ?
                  </h3>
                  <p 
                    className="text-sm mb-4"
                    style={{ color: APPLE.textSecondary }}
                  >
                    Contactez-nous directement sur WhatsApp pour une réponse immédiate.
                  </p>
                  <a 
                    href="https://wa.me/33626424394?text=Bonjour%20👋%0AJ'ai%20une%20question%20sur%20IWASP."
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button 
                      className="w-full rounded-xl h-12"
                      style={{ backgroundColor: "#25D366", color: "#FFFFFF" }}
                    >
                      <Phone className="mr-2 h-4 w-4" />
                      WhatsApp
                    </Button>
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer 
          className="py-8 px-6 text-center"
          style={{ borderTop: `1px solid ${APPLE.border}` }}
        >
          <p className="text-sm" style={{ color: APPLE.textMuted }}>
            Powered by IWASP
          </p>
        </footer>
      </div>
    </>
  );
}
