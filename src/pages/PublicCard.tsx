import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCard } from "@/hooks/useCards";
import { useCreateLead } from "@/hooks/useLeads";
import { useRecordScan } from "@/hooks/useScans";
import { downloadVCard } from "@/lib/vcard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  Phone, Mail, MapPin, Globe, Linkedin, Instagram, 
  MessageCircle, Plus, Wallet, Share2, User, Building2,
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

  const handleDownloadVCard = () => {
    if (!card) return;
    downloadVCard({
      firstName: card.first_name,
      lastName: card.last_name,
      title: card.title || undefined,
      company: card.company || undefined,
      email: card.email || undefined,
      phone: card.phone || undefined,
      website: card.website || undefined,
      location: card.location || undefined,
      linkedin: card.linkedin || undefined,
      instagram: card.instagram || undefined,
      twitter: card.twitter || undefined,
      tagline: card.tagline || undefined,
    });
    toast.success("Contact téléchargé !");
  };

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

  const handleAddToWallet = (type: "apple" | "google") => {
    toast.info(`Intégration ${type === "apple" ? "Apple" : "Google"} Wallet bientôt disponible`);
  };

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
        <div className="w-full max-w-sm">
          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 30, rotateX: 10 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="perspective-2000"
          >
            <div className="card-glass p-8 animate-float-3d">
              <div className="shimmer" />
              
              {/* Header */}
              <div className="relative z-10 flex items-start gap-5 mb-6">
                <motion.div 
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-20 h-20 rounded-2xl overflow-hidden ring-2 ring-foreground/10 shadow-lg">
                    {card.photo_url ? (
                      <img 
                        src={card.photo_url} 
                        alt={card.first_name} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-surface-2 to-surface-3 flex items-center justify-center">
                        <span className="text-2xl font-semibold text-chrome">
                          {card.first_name?.charAt(0)}{card.last_name?.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  {/* NFC indicator */}
                  <motion.div 
                    className="absolute -bottom-1 -right-1 w-6 h-6 bg-foreground rounded-full flex items-center justify-center shadow-lg"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-background" />
                  </motion.div>
                </motion.div>
                
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl font-semibold text-foreground truncate">
                    {card.first_name} {card.last_name}
                  </h1>
                  {card.title && <p className="text-sm text-chrome mt-0.5">{card.title}</p>}
                  {card.company && <p className="text-sm text-muted-foreground">{card.company}</p>}
                </div>
              </div>

              {/* Tagline */}
              {card.tagline && (
                <div className="relative z-10 mb-6 pl-4 border-l-2 border-foreground/20">
                  <p className="text-sm text-muted-foreground italic">"{card.tagline}"</p>
                </div>
              )}

              {/* Contact info */}
              <div className="relative z-10 space-y-2.5 mb-6">
                {card.phone && (
                  <a 
                    href={`tel:${card.phone}`} 
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-foreground/5 transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-surface-2 flex items-center justify-center group-hover:bg-surface-3 transition-colors">
                      <Phone size={16} className="text-chrome" />
                    </div>
                    <span className="text-sm text-secondary-foreground group-hover:text-foreground transition-colors">
                      {card.phone}
                    </span>
                  </a>
                )}
                {card.email && (
                  <a 
                    href={`mailto:${card.email}`} 
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-foreground/5 transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-surface-2 flex items-center justify-center group-hover:bg-surface-3 transition-colors">
                      <Mail size={16} className="text-chrome" />
                    </div>
                    <span className="text-sm text-secondary-foreground group-hover:text-foreground transition-colors truncate">
                      {card.email}
                    </span>
                  </a>
                )}
                {card.location && (
                  <div className="flex items-center gap-3 p-2.5 rounded-xl">
                    <div className="w-9 h-9 rounded-xl bg-surface-2 flex items-center justify-center">
                      <MapPin size={16} className="text-muted-foreground" />
                    </div>
                    <span className="text-sm text-muted-foreground">{card.location}</span>
                  </div>
                )}
              </div>

              {/* Action buttons grid */}
              <div className="relative z-10 grid grid-cols-4 gap-2 mb-6">
                {[
                  { icon: Phone, label: "Appeler", href: `tel:${card.phone}`, show: !!card.phone },
                  { icon: Mail, label: "Email", href: `mailto:${card.email}`, show: !!card.email },
                  { icon: MessageCircle, label: "WhatsApp", href: `https://wa.me/${card.phone?.replace(/\s/g, '')}`, show: !!card.phone },
                  { icon: Globe, label: "Site", href: card.website?.startsWith("http") ? card.website : `https://${card.website}`, show: !!card.website },
                ].filter(a => a.show).map((action) => (
                  <motion.a
                    key={action.label}
                    href={action.href}
                    target={action.label === "Site" ? "_blank" : undefined}
                    rel={action.label === "Site" ? "noopener noreferrer" : undefined}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-surface-2/50 hover:bg-surface-3 border border-transparent hover:border-foreground/10 transition-all duration-200"
                  >
                    <action.icon size={18} className="text-chrome" />
                    <span className="text-xs text-muted-foreground">{action.label}</span>
                  </motion.a>
                ))}
              </div>

              {/* Social links */}
              {(card.linkedin || card.instagram) && (
                <div className="relative z-10 flex items-center justify-center gap-4 pb-6 border-b border-foreground/10">
                  {card.linkedin && (
                    <motion.a 
                      href={`https://linkedin.com/in/${card.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -2 }}
                      className="w-10 h-10 rounded-xl bg-surface-2 hover:bg-surface-3 flex items-center justify-center transition-colors"
                    >
                      <Linkedin size={18} className="text-muted-foreground hover:text-foreground transition-colors" />
                    </motion.a>
                  )}
                  {card.instagram && (
                    <motion.a 
                      href={`https://instagram.com/${card.instagram?.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -2 }}
                      className="w-10 h-10 rounded-xl bg-surface-2 hover:bg-surface-3 flex items-center justify-center transition-colors"
                    >
                      <Instagram size={18} className="text-muted-foreground hover:text-foreground transition-colors" />
                    </motion.a>
                  )}
                </div>
              )}

              {/* Add to contacts */}
              <motion.button
                onClick={handleDownloadVCard}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative z-10 w-full mt-6 py-3.5 px-4 btn-chrome rounded-2xl font-semibold text-sm flex items-center justify-center gap-2"
              >
                <Plus size={18} />
                Ajouter aux contacts
              </motion.button>

              {/* Wallet buttons */}
              <div className="relative z-10 grid grid-cols-2 gap-3 mt-4">
                <motion.button
                  onClick={() => handleAddToWallet("apple")}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="wallet-btn flex items-center justify-center gap-2"
                >
                  <Wallet size={16} />
                  <span className="text-xs">Apple Wallet</span>
                </motion.button>
                <motion.button
                  onClick={() => handleAddToWallet("google")}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="wallet-btn flex items-center justify-center gap-2"
                >
                  <Wallet size={16} />
                  <span className="text-xs">Google Wallet</span>
                </motion.button>
              </div>

              {/* Share your info button */}
              <motion.button
                onClick={() => setShowLeadForm(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative z-10 w-full mt-4 py-3 px-4 rounded-2xl border border-foreground/10 hover:border-foreground/20 bg-surface-2/50 hover:bg-surface-3 transition-all font-medium text-sm flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <Share2 size={16} />
                Partager mes coordonnées
              </motion.button>
            </div>
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
