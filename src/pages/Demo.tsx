import { useState } from "react";
import { DigitalCard } from "@/components/DigitalCard";
import { CardData } from "@/components/templates/CardTemplates";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, Mail, User, Building2,
  X, Sparkles, ArrowLeft, CreditCard
} from "lucide-react";
import { Link } from "react-router-dom";
import { downloadVCard } from "@/lib/vcard";
import { downloadAppleWalletPass, downloadGoogleWalletPass } from "@/lib/walletMock";
import { toast } from "sonner";

// Demo card data - IWASP showcase
const demoCardData: CardData = {
  firstName: "Sarah",
  lastName: "Laurent",
  title: "Directrice Marketing",
  company: "IWASP Demo",
  email: "sarah@iwasp.ma",
  phone: "+212 6 12 34 56 78",
  location: "Casablanca, Maroc",
  website: "iwasp.ma",
  linkedin: "sarah-laurent",
  instagram: "@sarahlaurent",
  tagline: "L'élégance professionnelle, version numérique",
  logoUrl: undefined,
  photoUrl: undefined,
};

export default function Demo() {
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadData, setLeadData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  });
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  // Handle vCard download
  const handleDownloadVCard = () => {
    downloadVCard({
      firstName: demoCardData.firstName,
      lastName: demoCardData.lastName,
      title: demoCardData.title,
      company: demoCardData.company,
      email: demoCardData.email,
      phone: demoCardData.phone,
      website: demoCardData.website,
      location: demoCardData.location,
      linkedin: demoCardData.linkedin,
      instagram: demoCardData.instagram,
    });
    toast.success("Contact ajouté à votre répertoire !");
  };

  // Handle Apple Wallet
  const handleAppleWallet = () => {
    downloadAppleWalletPass({
      firstName: demoCardData.firstName,
      lastName: demoCardData.lastName,
      title: demoCardData.title,
      company: demoCardData.company,
      email: demoCardData.email,
      phone: demoCardData.phone,
      website: demoCardData.website,
      location: demoCardData.location,
    });
  };

  // Handle Google Wallet
  const handleGoogleWallet = () => {
    downloadGoogleWalletPass({
      firstName: demoCardData.firstName,
      lastName: demoCardData.lastName,
      title: demoCardData.title,
      company: demoCardData.company,
      email: demoCardData.email,
      phone: demoCardData.phone,
      website: demoCardData.website,
      location: demoCardData.location,
    });
  };

  // Handle lead form submission
  const handleShareInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate lead capture (demo mode - no actual database save)
    await new Promise(resolve => setTimeout(resolve, 500));
    
    toast.success("Vos coordonnées ont été partagées avec succès !");
    setShowLeadForm(false);
    setLeadSubmitted(true);
    setLeadData({ name: "", email: "", phone: "", company: "" });
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] orb opacity-30" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] orb opacity-20" />
      <div className="noise" />

      {/* Header */}
      <div className="relative z-20 p-4 flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Retour</span>
        </Link>
        
        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
          <Sparkles className="h-3 w-3 mr-1" />
          Démo Interactive
        </Badge>
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-[calc(100vh-80px)] flex items-center justify-center p-6 py-8">
        <div className="w-full max-w-md">
          {/* Demo badge */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-display font-bold text-foreground mb-2">
              Carte NFC IWASP
            </h1>
            <p className="text-muted-foreground text-sm">
              Testez toutes les fonctionnalités en temps réel
            </p>
          </div>

          {/* Digital Card Preview */}
          <div className="perspective-2000">
            <DigitalCard
              data={demoCardData}
              template="executive"
              showWalletButtons={false}
            />
          </div>

          {/* Action Buttons - All functional */}
          <div className="mt-6 space-y-3">
            {/* Primary action - Add to contacts */}
            <Button 
              onClick={handleDownloadVCard}
              className="w-full h-12 text-base font-medium"
              variant="default"
            >
              <User className="h-5 w-5 mr-2" />
              Ajouter aux contacts
            </Button>

            {/* Wallet buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={handleAppleWallet}
                variant="outline"
                className="h-11"
              >
                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Apple Wallet
              </Button>
              <Button 
                onClick={handleGoogleWallet}
                variant="outline"
                className="h-11"
              >
                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google Wallet
              </Button>
            </div>

            {/* Share info button */}
            <Button 
              onClick={() => setShowLeadForm(true)}
              variant="secondary"
              className="w-full h-11"
              disabled={leadSubmitted}
            >
              <Mail className="h-4 w-4 mr-2" />
              {leadSubmitted ? "Coordonnées partagées ✓" : "Partager mes coordonnées"}
            </Button>
          </div>

          {/* CTA to order */}
          <div className="mt-8 p-4 rounded-xl bg-primary/5 border border-primary/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Votre carte NFC premium</p>
                <p className="text-sm text-muted-foreground">À partir de 29€</p>
              </div>
            </div>
            <Link to="/templates">
              <Button variant="default" className="w-full">
                Commander ma carte
              </Button>
            </Link>
          </div>

          {/* IWASP branding */}
          <div className="text-center mt-6">
            <p className="text-xs text-muted-foreground">
              Powered by <span className="font-semibold text-foreground">IWASP</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              🇲🇦 Livraison Maroc • Paiement à la livraison
            </p>
          </div>
        </div>
      </div>

      {/* Lead capture modal */}
      <div 
        className={`fixed inset-0 z-50 flex items-center justify-center p-6 bg-background/80 backdrop-blur-xl transition-opacity duration-200 ${
          showLeadForm ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="w-full max-w-sm card-glass p-6">
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
              <Label htmlFor="demo-lead-name" className="flex items-center gap-2 text-sm">
                <User size={14} className="text-chrome" />
                Nom complet
              </Label>
              <Input
                id="demo-lead-name"
                value={leadData.name}
                onChange={(e) => setLeadData({ ...leadData, name: e.target.value })}
                placeholder="Jean Dupont"
                className="bg-surface-2 border-border/50 h-11"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="demo-lead-email" className="flex items-center gap-2 text-sm">
                <Mail size={14} className="text-chrome" />
                Email
              </Label>
              <Input
                id="demo-lead-email"
                type="email"
                value={leadData.email}
                onChange={(e) => setLeadData({ ...leadData, email: e.target.value })}
                placeholder="jean@exemple.com"
                className="bg-surface-2 border-border/50 h-11"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="demo-lead-phone" className="flex items-center gap-2 text-sm">
                <Phone size={14} className="text-chrome" />
                Téléphone
              </Label>
              <Input
                id="demo-lead-phone"
                value={leadData.phone}
                onChange={(e) => setLeadData({ ...leadData, phone: e.target.value })}
                placeholder="+212 6 12 34 56 78"
                className="bg-surface-2 border-border/50 h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="demo-lead-company" className="flex items-center gap-2 text-sm">
                <Building2 size={14} className="text-chrome" />
                Entreprise
              </Label>
              <Input
                id="demo-lead-company"
                value={leadData.company}
                onChange={(e) => setLeadData({ ...leadData, company: e.target.value })}
                placeholder="Ma Société"
                className="bg-surface-2 border-border/50 h-11"
              />
            </div>

            <Button
              type="submit"
              variant="default"
              className="w-full h-11"
            >
              Envoyer
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
