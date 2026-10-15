/**
 * ClientForm - Formulaire partageable via WhatsApp
 * Pour collecter les infos et créer une carte digitale
 */

import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import "@/styles/creation-studio.css";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Phone, 
  MessageCircle,
  Linkedin,
  Instagram,
  Globe,
  Palette,
  CheckCircle2,
  Sparkles,
  Camera,
  Upload,
  X,
  QrCode,
  WalletCards,
  Link2,
  ArrowUpRight
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
  businessSource: z.string().optional(),
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
${data.businessSource ? `Lien principal à analyser: ${data.businessSource}` : ""}

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
      colors: ["#DCC7B0", "#111111", "#FFFFFF"],
    });

    setIsSubmitted(true);
    
    // Ouvrir WhatsApp après un délai
    setTimeout(() => {
      window.open(whatsappUrl, "_blank");
    }, 1500);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-dvh bg-[#030303] flex items-center justify-center p-6">
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
          <p className="text-[#FDFCFB]/70 mb-6">
            WhatsApp va s'ouvrir pour envoyer vos informations à notre équipe.
          </p>
          <p className="text-sm text-[#FDFCFB]/50">
            Nous vous contacterons sous 24h pour finaliser votre carte.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="creation-studio min-h-dvh bg-[#030303] pb-safe">
      <header className="studio-header">
        <Link to="/" className="studio-brand" aria-label="i-wasp, accueil">
          <img src={iwaspLogo} alt="IWASP" className="h-9 w-auto" />
          <span>i-wasp<span className="studio-brand-caption">L’ART DE LA PRÉSENCE</span></span>
        </Link>
        <Link to="/contact" className="studio-contact">Parlons de votre projet <ArrowUpRight size={15} aria-hidden="true" /></Link>
      </header>

      <main className="studio-layout">
        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="studio-intro"
        >
          <div className="studio-eyebrow">
            <Sparkles className="w-4 h-4" />
            LE STUDIO i-wasp
          </div>
          <h1 className="studio-title">
            Votre présence.<br /><span>Votre signature.</span>
          </h1>
          <p className="studio-subtitle">Votre carte NFC, QR et Apple Wallet</p>
          <p className="studio-description">
            Donnez-nous votre activité et vos liens. Nous créons une fiche digitale complète,
            fidèle à votre image et prête à partager.
          </p>

          <div className="studio-features">
            {[
              { icon: Link2, label: "Lien i-wasp" },
              { icon: QrCode, label: "QR vers la fiche" },
              { icon: WalletCards, label: "Apple Wallet" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="studio-feature"
              >
                <Icon className="mx-auto mb-1.5 h-4 w-4 text-[#DCC7B0]" />
                <span className="text-xs leading-relaxed text-[#FDFCFB]/80">{label}</span>
              </div>
            ))}
          </div>

          <p className="mt-5 text-xs leading-relaxed text-[#FDFCFB]/65">
            Le QR visible et celui du pass Wallet ouvriront le même lien NFC sécurisé sur i-wasp.com.
          </p>
          <div className="studio-signature" aria-hidden="true">
            <span className="studio-signature-wordmark">i-wasp</span>
            <QrCode size={30} strokeWidth={1} />
            <span className="studio-signature-label">NFC · DIGITAL IDENTITY</span>
            <span className="studio-signature-line" />
          </div>
          <p className="studio-process">01. Vos informations <span>02. Votre style</span> 03. Votre demande</p>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)} className="studio-form space-y-6">
          <div className="studio-form-heading"><span>VOTRE CARTE, SUR MESURE</span><h2>Commençons par vous.</h2><p>Les champs marqués d’un * sont obligatoires.</p></div>
          {/* Photo Upload */}
          <Card className="studio-panel bg-[#111111] border-[#FDFCFB]/10">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-[#DCC7B0] mb-4">
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
                        className="w-24 h-24 rounded-full object-cover border-2 border-[#DCC7B0]"
                      />
                      <button
                        type="button"
                        aria-label="Supprimer la photo"
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
                      className="w-24 h-24 rounded-full bg-[#030303] border-2 border-dashed border-[#FDFCFB]/30 flex flex-col items-center justify-center gap-1 hover:border-[#DCC7B0] hover:bg-[#030303]/80 transition-all"
                    >
                      {isUploading ? (
                        <div className="w-6 h-6 border-2 border-[#DCC7B0] border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Upload className="w-5 h-5 text-[#FDFCFB]/60" />
                          <span className="text-[10px] text-[#FDFCFB]/60">Ajouter</span>
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
                    className="text-[#DCC7B0] text-xs"
                  >
                    <Camera className="w-3 h-3 mr-1" />
                    Changer la photo
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Identité */}
          <Card className="studio-panel bg-[#111111] border-[#FDFCFB]/10">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-[#DCC7B0] mb-2">
                <User className="w-4 h-4" />
                <span className="font-medium text-sm">Identité</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="studio-firstName" className="text-[#FDFCFB]/70 text-xs">Prénom *</Label>
                  <Input
                    id="studio-firstName"
                    {...register("firstName")}
                    placeholder="Votre prénom"
                    className="bg-[#030303] border-[#FDFCFB]/20 text-white mt-1"
                  />
                  {errors.firstName && (
                    <p className="text-red-400 text-xs mt-1">{errors.firstName.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="studio-lastName" className="text-[#FDFCFB]/70 text-xs">Nom *</Label>
                  <Input
                    id="studio-lastName"
                    {...register("lastName")}
                    placeholder="Votre nom"
                    className="bg-[#030303] border-[#FDFCFB]/20 text-white mt-1"
                  />
                  {errors.lastName && (
                    <p className="text-red-400 text-xs mt-1">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="studio-title" className="text-[#FDFCFB]/70 text-xs">Fonction / Titre</Label>
                <Input
                  id="studio-title"
                    {...register("title")}
                  placeholder="Ex: Directeur Commercial"
                  className="bg-[#030303] border-[#FDFCFB]/20 text-white mt-1"
                />
              </div>

              <div>
                <Label htmlFor="studio-company" className="text-[#FDFCFB]/70 text-xs">Entreprise</Label>
                <Input
                  id="studio-company"
                    {...register("company")}
                  placeholder="Nom de votre entreprise"
                  className="bg-[#030303] border-[#FDFCFB]/20 text-white mt-1"
                />
              </div>

              <div>
                <Label htmlFor="studio-businessSource" className="text-[#FDFCFB]/70 text-xs">
                  Lien Google, site ou réseau principal
                </Label>
                <Input
                  id="studio-businessSource"
                    {...register("businessSource")}
                  inputMode="url"
                  placeholder="https://maps.google.com/..."
                  className="bg-[#030303] border-[#FDFCFB]/20 text-white mt-1"
                />
                <p className="mt-1.5 text-[10px] leading-relaxed text-[#FDFCFB]/65">
                  Ce lien nous permet de retrouver votre logo, votre univers et vos informations officielles.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="studio-panel bg-[#111111] border-[#FDFCFB]/10">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-[#DCC7B0] mb-2">
                <Phone className="w-4 h-4" />
                <span className="font-medium text-sm">Contact</span>
              </div>

              <div>
                <Label htmlFor="studio-phone" className="text-[#FDFCFB]/70 text-xs">Téléphone *</Label>
                <Input
                  id="studio-phone"
                    {...register("phone")}
                  type="tel"
                  placeholder="+212 6XX XXX XXX"
                  className="bg-[#030303] border-[#FDFCFB]/20 text-white mt-1"
                />
                {errors.phone && (
                  <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="studio-email" className="text-[#FDFCFB]/70 text-xs">Email</Label>
                <Input
                  id="studio-email"
                    {...register("email")}
                  type="email"
                  placeholder="votre@email.com"
                  className="bg-[#030303] border-[#FDFCFB]/20 text-white mt-1"
                />
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="studio-whatsapp" className="text-[#FDFCFB]/70 text-xs">WhatsApp (si différent)</Label>
                <Input
                  id="studio-whatsapp"
                    {...register("whatsapp")}
                  type="tel"
                  placeholder="+212 6XX XXX XXX"
                  className="bg-[#030303] border-[#FDFCFB]/20 text-white mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Réseaux sociaux */}
          <Card className="studio-panel bg-[#111111] border-[#FDFCFB]/10">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-[#DCC7B0] mb-2">
                <Globe className="w-4 h-4" />
                <span className="font-medium text-sm">Réseaux sociaux</span>
              </div>

              <div>
                <Label htmlFor="studio-linkedin" className="text-[#FDFCFB]/70 text-xs flex items-center gap-2">
                  <Linkedin className="w-3 h-3" /> LinkedIn
                </Label>
                <Input
                  id="studio-linkedin"
                    {...register("linkedin")}
                  placeholder="linkedin.com/in/votre-profil"
                  className="bg-[#030303] border-[#FDFCFB]/20 text-white mt-1"
                />
              </div>

              <div>
                <Label htmlFor="studio-instagram" className="text-[#FDFCFB]/70 text-xs flex items-center gap-2">
                  <Instagram className="w-3 h-3" /> Instagram
                </Label>
                <Input
                  id="studio-instagram"
                    {...register("instagram")}
                  placeholder="@votre_compte"
                  className="bg-[#030303] border-[#FDFCFB]/20 text-white mt-1"
                />
              </div>

              <div>
                <Label htmlFor="studio-website" className="text-[#FDFCFB]/70 text-xs">Site web</Label>
                <Input
                  id="studio-website"
                    {...register("website")}
                  placeholder="https://votre-site.com"
                  className="bg-[#030303] border-[#FDFCFB]/20 text-white mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Bio */}
          <Card className="studio-panel bg-[#111111] border-[#FDFCFB]/10">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-[#DCC7B0] mb-2">
                <MessageCircle className="w-4 h-4" />
                <span className="font-medium text-sm">Bio / Description</span>
              </div>

              <Textarea
                aria-label="Bio / Description"
                {...register("bio")}
                placeholder="Décrivez brièvement votre activité..."
                className="bg-[#030303] border-[#FDFCFB]/20 text-white min-h-[80px] resize-none"
                maxLength={200}
              />
              <p className="text-[#FDFCFB]/65 text-xs text-right">
                {watchedData.bio?.length || 0}/200
              </p>
            </CardContent>
          </Card>

          {/* Template Selection */}
          <Card className="studio-panel bg-[#111111] border-[#FDFCFB]/10">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-[#DCC7B0] mb-2">
                <Palette className="w-4 h-4" />
                <span className="font-medium text-sm">Style de carte</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    aria-pressed={selectedTemplate === template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`relative p-4 rounded-xl border-2 transition-all ${
                      selectedTemplate === template.id
                        ? "border-[#DCC7B0] ring-2 ring-[#DCC7B0]/30"
                        : "border-[#FDFCFB]/20 hover:border-[#FDFCFB]/40"
                    }`}
                  >
                    <div className={`w-full h-16 rounded-lg ${template.color} mb-2`} />
                    <p className="text-white text-sm font-medium">{template.name}</p>
                    {selectedTemplate === template.id && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#DCC7B0] flex items-center justify-center">
                        <CheckCircle2 className="w-3 h-3 text-[#030303]" />
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
            className="studio-submit whitespace-normal text-center w-full min-h-14 h-auto py-4 bg-[#DCC7B0] hover:bg-[#E8D9C7] text-[#030303] font-medium text-sm rounded-xl flex items-center justify-center gap-3"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <MessageCircle className="w-5 h-5" />
                Demander ma carte NFC + Wallet
              </>
            )}
          </Button>

          <p className="text-center text-[#FDFCFB]/65 text-xs">
            En soumettant ce formulaire, vous acceptez d'être contacté par IWASP
          </p>
        </form>
      </main>

      {/* Footer */}
      <a href="https://i-wasp.com" target="_blank" rel="noopener noreferrer" className="block text-center py-6 text-[#FDFCFB]/65 text-xs hover:opacity-80 transition-opacity">
        Powered by I-WASP.com
      </a>
    </div>
  );
}
