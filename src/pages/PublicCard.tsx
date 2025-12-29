import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCard } from "@/hooks/useCards";
import { useCreateLead } from "@/hooks/useLeads";
import { useRecordScan } from "@/hooks/useScans";
import { DigitalCard } from "@/components/DigitalCard";
import { TemplateType, CardData } from "@/components/templates/CardTemplates";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  Phone, Mail, User, Building2,
  X, Sparkles
} from "lucide-react";

const PublicCard = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: card, isLoading, error } = useCard(slug || "");
  const createLead = useCreateLead();
  const recordScan = useRecordScan();
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadData, setLeadData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  });

  // Record scan on first load
  useEffect(() => {
    if (card?.id) {
      recordScan.mutate(card.id);
    }
  }, [card?.id]);

  const handleShareInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!card?.id) return;

    await createLead.mutateAsync({
      card_id: card.id,
      name: leadData.name || undefined,
      email: leadData.email || undefined,
      phone: leadData.phone || undefined,
      company: leadData.company || undefined,
    });

    setShowLeadForm(false);
    setLeadData({ name: "", email: "", phone: "", company: "" });
  };

  // Transform card data to template format
  const cardData: CardData | undefined = card ? {
    firstName: card.first_name,
    lastName: card.last_name,
    title: card.title || undefined,
    company: card.company || undefined,
    email: card.email || undefined,
    phone: card.phone || undefined,
    location: card.location || undefined,
    website: card.website || undefined,
    linkedin: card.linkedin || undefined,
    instagram: card.instagram || undefined,
    twitter: card.twitter || undefined,
    tagline: card.tagline || undefined,
    photoUrl: card.photo_url || undefined,
    logoUrl: card.logo_url || undefined,
  } : undefined;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 rounded-full border-2 border-foreground/20 border-t-foreground"
          />
        </motion.div>
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Sparkles size={48} className="mx-auto mb-4 text-muted-foreground" />
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">
            Carte introuvable
          </h1>
          <p className="text-muted-foreground">
            Cette carte n'existe pas ou a été désactivée.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] orb opacity-30 animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] orb opacity-20" />
      <div className="noise" />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6 py-12">
        <div className="w-full max-w-md">
          {/* Card using selected template */}
          <motion.div
            initial={{ opacity: 0, y: 30, rotateX: 10 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="perspective-2000"
          >
            {cardData && (
              <DigitalCard
                data={cardData}
                template={(card.template as TemplateType) || "executive"}
                showWalletButtons={true}
                onShareInfo={() => setShowLeadForm(true)}
              />
            )}
          </motion.div>

          {/* IWASP branding */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-8"
          >
            <p className="text-xs text-muted-foreground">
              Powered by <span className="font-semibold text-foreground">IWASP</span>
            </p>
          </motion.div>
        </div>
      </div>

      {/* Lead capture modal */}
      <AnimatePresence>
        {showLeadForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-background/80 backdrop-blur-xl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-sm card-glass p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-lg font-semibold text-foreground">
                  Partager mes coordonnées
                </h2>
                <button
                  onClick={() => setShowLeadForm(false)}
                  className="w-8 h-8 rounded-full bg-surface-2 hover:bg-surface-3 flex items-center justify-center transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleShareInfo} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="lead-name" className="flex items-center gap-2 text-sm">
                    <User size={14} className="text-chrome" />
                    Nom complet
                  </Label>
                  <Input
                    id="lead-name"
                    value={leadData.name}
                    onChange={(e) => setLeadData({ ...leadData, name: e.target.value })}
                    placeholder="Jean Dupont"
                    className="bg-surface-2 border-border/50 h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lead-email" className="flex items-center gap-2 text-sm">
                    <Mail size={14} className="text-chrome" />
                    Email
                  </Label>
                  <Input
                    id="lead-email"
                    type="email"
                    value={leadData.email}
                    onChange={(e) => setLeadData({ ...leadData, email: e.target.value })}
                    placeholder="jean@exemple.com"
                    className="bg-surface-2 border-border/50 h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lead-phone" className="flex items-center gap-2 text-sm">
                    <Phone size={14} className="text-chrome" />
                    Téléphone
                  </Label>
                  <Input
                    id="lead-phone"
                    value={leadData.phone}
                    onChange={(e) => setLeadData({ ...leadData, phone: e.target.value })}
                    placeholder="+33 6 12 34 56 78"
                    className="bg-surface-2 border-border/50 h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lead-company" className="flex items-center gap-2 text-sm">
                    <Building2 size={14} className="text-chrome" />
                    Entreprise
                  </Label>
                  <Input
                    id="lead-company"
                    value={leadData.company}
                    onChange={(e) => setLeadData({ ...leadData, company: e.target.value })}
                    placeholder="Ma Société"
                    className="bg-surface-2 border-border/50 h-11"
                  />
                </div>

                <Button
                  type="submit"
                  variant="chrome"
                  className="w-full h-11"
                  disabled={createLead.isPending}
                >
                  {createLead.isPending ? "Envoi..." : "Envoyer"}
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PublicCard;
