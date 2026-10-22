import { IWASP_WHATSAPP_WA, IWASP_WHATSAPP_DISPLAY } from "@/lib/brandContact";
/**
 * Contact Page - OMNIA public design
 * Ultra-minimal, clean, professional
 */

import "@/styles/public-brand.css";
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
import { BRAND } from "@/lib/brandPalette";

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
  { icon: Phone, label: "WhatsApp", value: IWASP_WHATSAPP_DISPLAY },
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
        <div className="brand-public min-h-screen antialiased leading-relaxed" style={{ backgroundColor: BRAND.background, color: BRAND.text }}>
          {/* Header */}
          <header
            className="sticky top-0 z-50 backdrop-blur-xl"
            style={{
              backgroundColor: BRAND.header,
              borderBottom: `1px solid ${BRAND.border}`
            }}
          >
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
              <Link
                to="/"
                className="text-xl font-semibold tracking-tight"
                style={{ color: BRAND.text }}
              >
                IWASP
              </Link>
              <Link to="/express/offre">
                <Button
                  className="rounded-full px-6 h-10 font-medium"
                  style={{ backgroundColor: BRAND.accent, color: BRAND.background }}
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
                  style={{ backgroundColor: BRAND.accentSubtle }}
                >
                  <CheckCircle2 className="w-10 h-10" style={{ color: BRAND.accent }} />
                </div>
                <h1
                  className="text-3xl font-bold mb-4 tracking-tight"
                  style={{ color: BRAND.text }}
                >
                  Message envoyé !
                </h1>
                <p
                  className="mb-8 text-lg"
                  style={{ color: BRAND.textSecondary }}
                >
                  Merci pour votre message. Notre équipe vous contactera dans les 24h.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/">
                    <Button
                      variant="outline"
                      className="rounded-full px-6"
                      style={{
                        borderColor: BRAND.border,
                        color: BRAND.text,
                        backgroundColor: "transparent"
                      }}
                    >
                      Retour à l'accueil
                    </Button>
                  </Link>
                  <Link to="/express/offre">
                    <Button
                      className="rounded-full px-6"
                      style={{ backgroundColor: BRAND.accent, color: BRAND.background }}
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
      <div className="brand-public min-h-screen antialiased leading-relaxed" style={{ backgroundColor: BRAND.background, color: BRAND.text }}>
        {/* Header */}
        <header
          className="sticky top-0 z-50 backdrop-blur-xl"
          style={{
            backgroundColor: BRAND.header,
            borderBottom: `1px solid ${BRAND.border}`
          }}
        >
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link
              to="/"
              className="text-xl font-semibold tracking-tight"
              style={{ color: BRAND.text }}
            >
              IWASP
            </Link>
            <Link to="/express/offre">
              <Button
                className="rounded-full px-6 h-10 font-medium"
                style={{ backgroundColor: BRAND.accent, color: BRAND.background }}
              >
                Commander
              </Button>
            </Link>
          </div>
        </header>

        {/* Hero */}
        <section
          className="pt-16 pb-12 px-6"
          style={{ backgroundColor: BRAND.backgroundPure, borderBottom: `1px solid ${BRAND.border}` }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                style={{ backgroundColor: BRAND.accentSubtle }}
              >
                <MessageSquare className="w-4 h-4" style={{ color: BRAND.accent }} />
                <span className="text-sm font-medium" style={{ color: BRAND.accent }}>Contact</span>
              </div>

              <h1
                className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight"
                style={{ color: BRAND.text }}
              >
                Une question ?
              </h1>

              <p
                className="text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto"
                style={{ color: BRAND.textSecondary }}
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
                  className="p-5 sm:p-8 rounded-2xl border"
                  style={{
                    backgroundColor: BRAND.card,
                    borderColor: BRAND.border, boxShadow: BRAND.shadowCard
                  }}
                >
                  <h2
                    className="text-xl font-semibold mb-6 flex items-center gap-2"
                    style={{ color: BRAND.text }}
                  >
                    <Send className="w-5 h-5" style={{ color: BRAND.accent }} />
                    Envoyez-nous un message
                  </h2>

                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      {/* Request Type */}
                      <div>
                        <label
                          className="text-sm font-medium mb-3 block"
                          style={{ color: BRAND.textSecondary }}
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
                                  backgroundColor: isSelected ? BRAND.accentSubtle : BRAND.backgroundSubtle,
                                  border: isSelected
                                    ? `2px solid ${BRAND.accent}`
                                    : `1px solid ${BRAND.border}`,
                                }}
                              >
                                <type.icon
                                  className="w-5 h-5 mx-auto mb-2"
                                  style={{ color: isSelected ? BRAND.accent : BRAND.textSecondary }}
                                />
                                <p
                                  className="text-sm font-medium"
                                  style={{ color: isSelected ? BRAND.accent : BRAND.text }}
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
                              <FormLabel style={{ color: BRAND.textSecondary }}>Nom *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Votre nom"
                                  {...field}
                                  className="h-12 rounded-xl"
                                  style={{
                                    backgroundColor: BRAND.background,
                                    border: `1px solid ${BRAND.border}`,
                                    color: BRAND.text
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
                              <FormLabel style={{ color: BRAND.textSecondary }}>Email *</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="votre@email.com"
                                  {...field}
                                  className="h-12 rounded-xl"
                                  style={{
                                    backgroundColor: BRAND.background,
                                    border: `1px solid ${BRAND.border}`,
                                    color: BRAND.text
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
                              <FormLabel style={{ color: BRAND.textSecondary }}>Téléphone</FormLabel>
                              <FormControl>
                                <Input
                                  type="tel"
                                  placeholder="+33 6 00 00 00 00"
                                  {...field}
                                  className="h-12 rounded-xl"
                                  style={{
                                    backgroundColor: BRAND.background,
                                    border: `1px solid ${BRAND.border}`,
                                    color: BRAND.text
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
                              <FormLabel style={{ color: BRAND.textSecondary }}>Entreprise</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Nom de l'entreprise"
                                  {...field}
                                  className="h-12 rounded-xl"
                                  style={{
                                    backgroundColor: BRAND.background,
                                    border: `1px solid ${BRAND.border}`,
                                    color: BRAND.text
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
                            <FormLabel style={{ color: BRAND.textSecondary }}>Message *</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Décrivez votre projet..."
                                className="min-h-[120px] resize-none rounded-xl"
                                style={{
                                  backgroundColor: BRAND.background,
                                  border: `1px solid ${BRAND.border}`,
                                  color: BRAND.text
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
                        style={{ backgroundColor: BRAND.accent, color: BRAND.background }}
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
                    backgroundColor: BRAND.card,
                    borderColor: BRAND.border, boxShadow: BRAND.shadowCard
                  }}
                >
                  <h3
                    className="font-semibold mb-4"
                    style={{ color: BRAND.text }}
                  >
                    Nos coordonnées
                  </h3>
                  <div className="space-y-4">
                    {contactInfo.map((item) => (
                      <div key={item.label} className="flex items-start gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: BRAND.accentSubtle }}
                        >
                          <item.icon className="w-5 h-5" style={{ color: BRAND.accent }} />
                        </div>
                        <div>
                          <p className="text-sm" style={{ color: BRAND.textSecondary }}>{item.label}</p>
                          <p className="font-medium" style={{ color: BRAND.text }}>{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* WhatsApp CTA */}
                <div
                  className="p-6 rounded-2xl"
                  style={{
                    backgroundColor: BRAND.card,
                    borderColor: BRAND.border, boxShadow: BRAND.shadowCard
                  }}
                >
                  <h3
                    className="font-semibold mb-2"
                    style={{ color: BRAND.text }}
                  >
                    Réponse rapide ?
                  </h3>
                  <p
                    className="text-sm mb-4"
                    style={{ color: BRAND.textSecondary }}
                  >
                    Contactez-nous directement sur WhatsApp pour une réponse immédiate.
                  </p>
                  <a
                    href={`https://wa.me/${IWASP_WHATSAPP_WA}?text=Bonjour%20👋%0AJ'ai%20une%20question%20sur%20IWASP.`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      className="w-full rounded-xl h-12"
                      style={{ backgroundColor: BRAND.accent, color: BRAND.background }}
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
          style={{ borderTop: `1px solid ${BRAND.border}` }}
        >
          <p className="text-sm" style={{ color: BRAND.textMuted }}>
            Powered by IWASP
          </p>
        </footer>
      </div>
    </>
  );
}
