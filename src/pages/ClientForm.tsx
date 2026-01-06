/**
 * ClientForm - Formulaire partageable via WhatsApp
 * Pour collecter les infos et créer une carte digitale
 */

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Briefcase, 
  Phone, 
  Mail, 
  MessageCircle,
  Linkedin,
  Instagram,
  Globe,
  Palette,
  Send,
  CheckCircle2,
  Sparkles,
  Camera,
  Upload,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import iwaspLogo from "@/assets/iwasp-logo.png";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  firstName: z.string().min(2, "Prénom requis"),
  lastName: z.string().min(2, "Nom requis"),
  title: z.string().optional(),
  company: z.string().optional(),
  phone: z.string().min(8, "Numéro requis"),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  whatsapp: z.string().optional(),
  linkedin: z.string().optional(),
  instagram: z.string().optional(),
  website: z.string().optional(),
  bio: z.string().max(200, "Maximum 200 caractères").optional(),
  templatePreference: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const templates = [
  { id: "signature", name: "Signature", color: "bg-gradient-to-br from-amber-500 to-amber-700" },
  { id: "minimal", name: "Minimal", color: "bg-gradient-to-br from-gray-800 to-gray-900" },
  { id: "boutique", name: "Boutique", color: "bg-gradient-to-br from-rose-400 to-pink-600" },
  { id: "ultra-luxe", name: "Ultra Luxe", color: "bg-gradient-to-br from-amber-300 to-yellow-600" },
];

export default function ClientForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("signature");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      templatePreference: "signature",
    },
  });

  const watchedData = watch();

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner une image");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("L'image ne doit pas dépasser 5MB");
      return;
    }

    setIsUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `client-form-${Date.now()}.${fileExt}`;
      const filePath = `form-photos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("card-assets")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("card-assets")
        .getPublicUrl(filePath);

      setPhotoUrl(publicUrl);
      toast.success("Photo ajoutée !");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Erreur lors de l'upload");
    } finally {
      setIsUploading(false);
    }
  };

  const removePhoto = () => {
    setPhotoUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: FormData) => {
    // Construire le message WhatsApp avec toutes les infos
    const message = `
🎯 *Nouvelle demande de carte IWASP*

👤 *Identité*
Prénom: ${data.firstName}
Nom: ${data.lastName}
${data.title ? `Fonction: ${data.title}` : ""}
${data.company ? `Entreprise: ${data.company}` : ""}

📱 *Contact*
Téléphone: ${data.phone}
${data.email ? `Email: ${data.email}` : ""}
${data.whatsapp ? `WhatsApp: ${data.whatsapp}` : ""}

🔗 *Réseaux*
${data.linkedin ? `LinkedIn: ${data.linkedin}` : ""}
${data.instagram ? `Instagram: ${data.instagram}` : ""}
${data.website ? `Site web: ${data.website}` : ""}

${data.bio ? `📝 *Bio*\n${data.bio}` : ""}

🎨 *Template choisi*: ${templates.find(t => t.id === selectedTemplate)?.name || "Signature"}
${photoUrl ? `\n📷 *Photo de profil*: ${photoUrl}` : ""}
    `.trim();

    // Encoder le message pour WhatsApp
    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = "33626424394"; // Numéro IWASP
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    // Afficher confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#D4AF37", "#1A1A1A", "#FFFFFF"],
    });

    setIsSubmitted(true);
    
    // Ouvrir WhatsApp après un délai
    setTimeout(() => {
      window.open(whatsappUrl, "_blank");
    }, 1500);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-dvh bg-[#0B0B0B] flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-sm"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">
            Formulaire envoyé ! 🎉
          </h2>
          <p className="text-[#E5E5E5]/70 mb-6">
            WhatsApp va s'ouvrir pour envoyer vos informations à notre équipe.
          </p>
          <p className="text-sm text-[#E5E5E5]/50">
            Nous vous contacterons sous 24h pour finaliser votre carte.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[#0B0B0B] pb-safe">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#0B0B0B]/95 backdrop-blur-lg border-b border-[#E5E5E5]/10 px-4 py-4">
        <div className="flex items-center justify-center gap-3">
          <img src={iwaspLogo} alt="IWASP" className="h-8 w-auto" />
          <span className="text-white font-semibold">Créer ma carte</span>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFC700]/20 text-[#FFC700] text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            Carte NFC Premium
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Vos informations
          </h1>
          <p className="text-[#E5E5E5]/60 text-sm">
            Remplissez ce formulaire pour créer votre carte digitale professionnelle
          </p>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Photo Upload */}
          <Card className="bg-[#1A1A1A] border-[#E5E5E5]/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-[#FFC700] mb-4">
                <Camera className="w-4 h-4" />
                <span className="font-medium text-sm">Photo de profil</span>
              </div>

              <div className="flex flex-col items-center gap-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />

                <AnimatePresence mode="wait">
                  {photoUrl ? (
                    <motion.div
                      key="photo"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="relative"
                    >
                      <img
                        src={photoUrl}
                        alt="Photo de profil"
                        className="w-24 h-24 rounded-full object-cover border-2 border-[#FFC700]"
                      />
                      <button
                        type="button"
                        onClick={removePhoto}
                        className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
                      >
                        <X className="w-3 h-3 text-white" />
                      </button>
                    </motion.div>
                  ) : (
                    <motion.button
                      key="upload"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="w-24 h-24 rounded-full bg-[#0B0B0B] border-2 border-dashed border-[#E5E5E5]/30 flex flex-col items-center justify-center gap-1 hover:border-[#FFC700] hover:bg-[#0B0B0B]/80 transition-all"
                    >
                      {isUploading ? (
                        <div className="w-6 h-6 border-2 border-[#FFC700] border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Upload className="w-5 h-5 text-[#E5E5E5]/60" />
                          <span className="text-[10px] text-[#E5E5E5]/60">Ajouter</span>
                        </>
                      )}
                    </motion.button>
                  )}
                </AnimatePresence>

                {photoUrl && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[#FFC700] text-xs"
                  >
                    <Camera className="w-3 h-3 mr-1" />
                    Changer la photo
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Identité */}
          <Card className="bg-[#1A1A1A] border-[#E5E5E5]/10">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center gap-2 text-[#FFC700] mb-2">
                <User className="w-4 h-4" />
                <span className="font-medium text-sm">Identité</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-[#E5E5E5]/70 text-xs">Prénom *</Label>
                  <Input
                    {...register("firstName")}
                    placeholder="Votre prénom"
                    className="bg-[#0B0B0B] border-[#E5E5E5]/20 text-white mt-1"
                  />
                  {errors.firstName && (
                    <p className="text-red-400 text-xs mt-1">{errors.firstName.message}</p>
                  )}
                </div>
                <div>
                  <Label className="text-[#E5E5E5]/70 text-xs">Nom *</Label>
                  <Input
                    {...register("lastName")}
                    placeholder="Votre nom"
                    className="bg-[#0B0B0B] border-[#E5E5E5]/20 text-white mt-1"
                  />
                  {errors.lastName && (
                    <p className="text-red-400 text-xs mt-1">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label className="text-[#E5E5E5]/70 text-xs">Fonction / Titre</Label>
                <Input
                  {...register("title")}
                  placeholder="Ex: Directeur Commercial"
                  className="bg-[#0B0B0B] border-[#E5E5E5]/20 text-white mt-1"
                />
              </div>

              <div>
                <Label className="text-[#E5E5E5]/70 text-xs">Entreprise</Label>
                <Input
                  {...register("company")}
                  placeholder="Nom de votre entreprise"
                  className="bg-[#0B0B0B] border-[#E5E5E5]/20 text-white mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="bg-[#1A1A1A] border-[#E5E5E5]/10">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center gap-2 text-[#FFC700] mb-2">
                <Phone className="w-4 h-4" />
                <span className="font-medium text-sm">Contact</span>
              </div>

              <div>
                <Label className="text-[#E5E5E5]/70 text-xs">Téléphone *</Label>
                <Input
                  {...register("phone")}
                  type="tel"
                  placeholder="+212 6XX XXX XXX"
                  className="bg-[#0B0B0B] border-[#E5E5E5]/20 text-white mt-1"
                />
                {errors.phone && (
                  <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <Label className="text-[#E5E5E5]/70 text-xs">Email</Label>
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="votre@email.com"
                  className="bg-[#0B0B0B] border-[#E5E5E5]/20 text-white mt-1"
                />
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <Label className="text-[#E5E5E5]/70 text-xs">WhatsApp (si différent)</Label>
                <Input
                  {...register("whatsapp")}
                  type="tel"
                  placeholder="+212 6XX XXX XXX"
                  className="bg-[#0B0B0B] border-[#E5E5E5]/20 text-white mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Réseaux sociaux */}
          <Card className="bg-[#1A1A1A] border-[#E5E5E5]/10">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center gap-2 text-[#FFC700] mb-2">
                <Globe className="w-4 h-4" />
                <span className="font-medium text-sm">Réseaux sociaux</span>
              </div>

              <div>
                <Label className="text-[#E5E5E5]/70 text-xs flex items-center gap-2">
                  <Linkedin className="w-3 h-3" /> LinkedIn
                </Label>
                <Input
                  {...register("linkedin")}
                  placeholder="linkedin.com/in/votre-profil"
                  className="bg-[#0B0B0B] border-[#E5E5E5]/20 text-white mt-1"
                />
              </div>

              <div>
                <Label className="text-[#E5E5E5]/70 text-xs flex items-center gap-2">
                  <Instagram className="w-3 h-3" /> Instagram
                </Label>
                <Input
                  {...register("instagram")}
                  placeholder="@votre_compte"
                  className="bg-[#0B0B0B] border-[#E5E5E5]/20 text-white mt-1"
                />
              </div>

              <div>
                <Label className="text-[#E5E5E5]/70 text-xs">Site web</Label>
                <Input
                  {...register("website")}
                  placeholder="https://votre-site.com"
                  className="bg-[#0B0B0B] border-[#E5E5E5]/20 text-white mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Bio */}
          <Card className="bg-[#1A1A1A] border-[#E5E5E5]/10">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center gap-2 text-[#FFC700] mb-2">
                <MessageCircle className="w-4 h-4" />
                <span className="font-medium text-sm">Bio / Description</span>
              </div>

              <Textarea
                {...register("bio")}
                placeholder="Décrivez brièvement votre activité..."
                className="bg-[#0B0B0B] border-[#E5E5E5]/20 text-white min-h-[80px] resize-none"
                maxLength={200}
              />
              <p className="text-[#E5E5E5]/40 text-xs text-right">
                {watchedData.bio?.length || 0}/200
              </p>
            </CardContent>
          </Card>

          {/* Template Selection */}
          <Card className="bg-[#1A1A1A] border-[#E5E5E5]/10">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center gap-2 text-[#FFC700] mb-2">
                <Palette className="w-4 h-4" />
                <span className="font-medium text-sm">Style de carte</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`relative p-4 rounded-xl border-2 transition-all ${
                      selectedTemplate === template.id
                        ? "border-[#FFC700] ring-2 ring-[#FFC700]/30"
                        : "border-[#E5E5E5]/20 hover:border-[#E5E5E5]/40"
                    }`}
                  >
                    <div className={`w-full h-16 rounded-lg ${template.color} mb-2`} />
                    <p className="text-white text-sm font-medium">{template.name}</p>
                    {selectedTemplate === template.id && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#FFC700] flex items-center justify-center">
                        <CheckCircle2 className="w-3 h-3 text-[#0B0B0B]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-14 bg-[#25D366] hover:bg-[#25D366]/90 text-white font-bold text-lg rounded-xl flex items-center justify-center gap-3"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <MessageCircle className="w-5 h-5" />
                Envoyer via WhatsApp
              </>
            )}
          </Button>

          <p className="text-center text-[#E5E5E5]/40 text-xs">
            En soumettant ce formulaire, vous acceptez d'être contacté par IWASP
          </p>
        </form>
      </div>

      {/* Footer */}
      <a href="https://i-wasp.com" target="_blank" rel="noopener noreferrer" className="block text-center py-6 text-[#E5E5E5]/30 text-xs hover:opacity-80 transition-opacity">
        Powered by I-WASP.com
      </a>
    </div>
  );
}
