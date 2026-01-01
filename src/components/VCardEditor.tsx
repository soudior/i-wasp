/**
 * VCardEditor - Module vCard professionnelle IWASP
 * 
 * Génération automatique et prévisualisation du contact
 * Compatible: iOS, Android, Outlook, Google Contacts
 */

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  UserPlus, 
  Check, 
  User, 
  Briefcase, 
  Building, 
  Phone, 
  Mail, 
  MapPin, 
  Globe,
  Linkedin,
  Instagram,
  Download,
  Smartphone,
  Eye,
  EyeOff,
  Sparkles
} from "lucide-react";
import { downloadVCard, getVCardPreview, VCardData } from "@/lib/vcard";

interface VCardEditorProps {
  data: {
    firstName?: string;
    lastName?: string;
    title?: string;
    company?: string;
    phone?: string;
    email?: string;
    website?: string;
    location?: string;
    socialLinks?: Array<{ networkId: string; value: string }>;
  };
  onActivate?: (active: boolean) => void;
}

const iconMap: Record<string, typeof User> = {
  user: User,
  briefcase: Briefcase,
  building: Building,
  phone: Phone,
  mail: Mail,
  "map-pin": MapPin,
  globe: Globe,
  linkedin: Linkedin,
  instagram: Instagram,
};

export function VCardEditor({ data, onActivate }: VCardEditorProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  // Build vCard data from props
  const vcardData: VCardData = useMemo(() => {
    const linkedin = data.socialLinks?.find(l => l.networkId === "linkedin")?.value;
    const instagram = data.socialLinks?.find(l => l.networkId === "instagram")?.value;
    const twitter = data.socialLinks?.find(l => l.networkId === "twitter")?.value;
    const whatsapp = data.socialLinks?.find(l => l.networkId === "whatsapp")?.value;

    return {
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      title: data.title,
      company: data.company,
      phone: data.phone,
      email: data.email,
      address: data.location,
      website: data.website,
      linkedin,
      instagram,
      twitter,
      whatsapp,
    };
  }, [data]);

  const preview = useMemo(() => getVCardPreview(vcardData), [vcardData]);

  const handleDownload = async () => {
    if (!preview.isComplete) return;
    
    setIsDownloading(true);
    
    // Small delay for animation
    await new Promise(resolve => setTimeout(resolve, 300));
    
    downloadVCard(vcardData);
    
    setIsDownloading(false);
    setDownloaded(true);
    onActivate?.(true);
    
    // Reset after animation
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UserPlus size={18} className="text-accent" />
          <h3 className="font-semibold">vCard professionnelle</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowPreview(!showPreview)}
          className="text-xs gap-1.5"
        >
          {showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
          {showPreview ? "Masquer" : "Aperçu"}
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        Ajoutez vos contacts en un clic sur iOS, Android, Outlook et Google Contacts
      </p>

      {/* Preview panel */}
      <AnimatePresence mode="wait">
        {showPreview && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Card className="p-4 bg-muted/30 border-border/50 space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Sparkles size={14} className="text-accent" />
                Aperçu du fichier contact.vcf
              </div>
              
              {preview.fields.length > 0 ? (
                <div className="space-y-2">
                  {preview.fields.map((field, index) => {
                    const IconComponent = iconMap[field.icon] || User;
                    return (
                      <motion.div
                        key={field.label}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.2 }}
                        className="flex items-center gap-3 text-sm"
                      >
                        <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                          <IconComponent size={14} className="text-accent" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted-foreground">{field.label}</p>
                          <p className="truncate font-medium">{field.value}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Remplissez vos informations pour voir l'aperçu
                </p>
              )}

              {/* Compatibility badges */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-border/30">
                {["iOS", "Android", "Outlook", "Google"].map((platform) => (
                  <span
                    key={platform}
                    className="text-[10px] px-2 py-1 rounded-full bg-accent/10 text-accent font-medium"
                  >
                    ✓ {platform}
                  </span>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status indicator */}
      <div className={`flex items-center gap-2 p-3 rounded-xl transition-all duration-300 ${
        preview.isComplete 
          ? "bg-accent/10 border border-accent/20" 
          : "bg-muted/50 border border-border/30"
      }`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
          preview.isComplete ? "bg-accent" : "bg-muted"
        }`}>
          {preview.isComplete ? (
            <Check size={16} className="text-accent-foreground" />
          ) : (
            <User size={16} className="text-muted-foreground" />
          )}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">
            {preview.isComplete 
              ? `${preview.fields.length} informations prêtes` 
              : "Informations incomplètes"
            }
          </p>
          <p className="text-xs text-muted-foreground">
            {preview.isComplete 
              ? "Votre vCard est prête à être partagée" 
              : "Ajoutez au moins nom + téléphone ou email"
            }
          </p>
        </div>
      </div>

      {/* Download button */}
      <Button
        onClick={handleDownload}
        disabled={!preview.isComplete || isDownloading}
        className={`w-full h-14 rounded-xl text-base font-semibold transition-all duration-300 ${
          downloaded 
            ? "bg-accent text-accent-foreground" 
            : "bg-primary text-primary-foreground hover:opacity-90"
        }`}
      >
        <AnimatePresence mode="wait">
          {isDownloading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Download size={20} />
              </motion.div>
              Génération...
            </motion.div>
          ) : downloaded ? (
            <motion.div
              key="success"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="flex items-center gap-2"
            >
              <Check size={20} />
              Téléchargé !
            </motion.div>
          ) : (
            <motion.div
              key="default"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <UserPlus size={20} />
              Ajouter en vCard
            </motion.div>
          )}
        </AnimatePresence>
      </Button>

      {/* Help text */}
      <p className="text-[11px] text-center text-muted-foreground">
        <Smartphone size={12} className="inline mr-1" />
        Carte NFC = ajout contact en 1 clic
      </p>
    </div>
  );
}

export default VCardEditor;
