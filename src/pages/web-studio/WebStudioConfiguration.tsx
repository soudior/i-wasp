/**
 * Web Studio Configuration - Formulaire de configuration du site
 * Adapté selon le pack choisi (Starter, Pro, Elite)
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CoutureNavbar } from "@/components/CoutureNavbar";
import { CoutureFooter } from "@/components/CoutureFooter";
import { 
  ArrowLeft,
  ArrowRight,
  Check,
  Building2,
  FileText,
  User,
  Sparkles,
  Loader2,
  Globe,
  Server
} from "lucide-react";
import { 
  WEB_STUDIO_PACKAGES, 
  WebStudioPackageKey,
  AVAILABLE_PAGES,
  BUSINESS_SECTORS,
  getMaxPages
} from "@/lib/webStudioPackages";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const STUDIO = {
  noir: "#050505",
  noirCard: "#111111",
  or: "#D4A853",
  ivoire: "#F5F5F5",
  gris: "#6B6B6B",
};

interface FormData {
  // Pages selection
  selectedPages: string[];
  otherPage: string;
  // Business info
  sector: string;
  otherSector: string;
  businessName: string;
  businessDescription: string;
  // Contact
  fullName: string;
  email: string;
  phone: string;
  // Hosting
  hostingType: 'iwasp' | 'custom';
  customDomainName: string;
  // Options
  customDomain: boolean;
  logoDesign: boolean;
  seoOptimization: boolean;
}

export default function WebStudioConfiguration() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const packId = searchParams.get('pack') || 'basic';
  const packageKey = (Object.keys(WEB_STUDIO_PACKAGES).find(
    k => WEB_STUDIO_PACKAGES[k as WebStudioPackageKey].id === packId
  ) || 'BASIC') as WebStudioPackageKey;
  
  const selectedPackage = WEB_STUDIO_PACKAGES[packageKey];
  const maxPages = getMaxPages(packId);
  const isBasic = packId === 'basic';

  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    selectedPages: ['accueil'],
    otherPage: '',
    sector: '',
    otherSector: '',
    businessName: '',
    businessDescription: '',
    fullName: '',
    email: '',
    phone: '',
    hostingType: 'iwasp',
    customDomainName: '',
    customDomain: false,
    logoDesign: false,
    seoOptimization: false,
  });

  const steps = isBasic 
    ? ['Secteur', 'Informations', 'Contact']
    : ['Pages', 'Secteur', 'Informations', 'Contact'];

  const updateField = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const togglePage = (pageId: string) => {
    setFormData(prev => {
      const current = prev.selectedPages;
      if (current.includes(pageId)) {
        if (pageId === 'accueil') return prev; // Can't remove home
        return { ...prev, selectedPages: current.filter(p => p !== pageId) };
      }
      if (current.length >= maxPages) {
        toast({
          title: `Maximum ${maxPages} pages`,
          description: `Votre formule permet jusqu'à ${maxPages} pages`,
          variant: "destructive",
        });
        return prev;
      }
      return { ...prev, selectedPages: [...current, pageId] };
    });
  };

  const canProceed = () => {
    if (isBasic) {
      if (currentStep === 0) return !!formData.sector;
      if (currentStep === 1) return !!formData.businessName && !!formData.businessDescription;
      if (currentStep === 2) return !!formData.fullName && !!formData.email && !!formData.phone;
    } else {
      if (currentStep === 0) return formData.selectedPages.length >= 1;
      if (currentStep === 1) return !!formData.sector;
      if (currentStep === 2) return !!formData.businessName && !!formData.businessDescription;
      if (currentStep === 3) return !!formData.fullName && !!formData.email && !!formData.phone;
    }
    return false;
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else {
      navigate('/web-studio/offres');
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Calculate total price
      let totalMad = selectedPackage.priceMad;
      if (formData.hostingType === 'custom') totalMad += 100;
      if (formData.logoDesign) totalMad += 200;
      if (formData.seoOptimization) totalMad += 150;

      // Create the order in Supabase
      const orderData = {
        formData: {
          packageId: packId,
          packageName: selectedPackage.name,
          selectedPages: formData.selectedPages,
          sector: formData.sector === 'autre' ? formData.otherSector : formData.sector,
          businessName: formData.businessName,
          businessDescription: formData.businessDescription,
          contactName: formData.fullName,
          contactEmail: formData.email,
          contactPhone: formData.phone,
          hosting: {
            type: formData.hostingType,
            customDomainName: formData.hostingType === 'custom' ? formData.customDomainName : null,
            subdomain: formData.hostingType === 'iwasp' 
              ? formData.businessName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
              : null,
          },
          options: {
            customDomain: formData.customDomain,
            logoDesign: formData.logoDesign,
            seoOptimization: formData.seoOptimization,
          }
        },
        priceMad: totalMad,
        priceEur: selectedPackage.priceEur,
        isInstant: selectedPackage.isInstant,
      };

      // Store in session for checkout
      sessionStorage.setItem('iwasp_webstudio_order', JSON.stringify(orderData));

      // Navigate to checkout with package info
      navigate(`/web-studio/paiement?pack=${packId}`);
      
    } catch (error: any) {
      console.error('Submit error:', error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    const stepIndex = isBasic ? currentStep + 1 : currentStep; // Offset for basic (no pages step)

    // Pages step (Pro/Enterprise only)
    if (!isBasic && currentStep === 0) {
      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2" style={{ color: STUDIO.ivoire }}>
              Quelles pages voulez-vous sur votre site ?
            </h3>
            <p className="text-sm mb-4" style={{ color: STUDIO.gris }}>
              Sélectionnez jusqu'à {maxPages} pages ({formData.selectedPages.length}/{maxPages})
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {AVAILABLE_PAGES.slice(0, packId === 'premium' ? undefined : -2).map((page) => (
              <motion.button
                key={page.id}
                onClick={() => togglePage(page.id)}
                className={`p-4 rounded-xl text-left transition-all ${
                  formData.selectedPages.includes(page.id)
                    ? 'bg-amber-500/20 border-amber-500'
                    : 'bg-white/5 border-white/10'
                } border`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={page.required}
              >
                <div className="flex items-center justify-between">
                  <span style={{ color: STUDIO.ivoire }}>{page.label}</span>
                  {formData.selectedPages.includes(page.id) && (
                    <Check size={16} className="text-amber-500" />
                  )}
                </div>
              </motion.button>
            ))}
          </div>
          {formData.selectedPages.includes('autre') && (
            <Input
              placeholder="Précisez la page..."
              value={formData.otherPage}
              onChange={(e) => updateField('otherPage', e.target.value)}
              className="bg-white/5 border-white/10"
            />
          )}
        </div>
      );
    }

    // Sector step
    if ((isBasic && currentStep === 0) || (!isBasic && currentStep === 1)) {
      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2" style={{ color: STUDIO.ivoire }}>
              Quel est votre secteur d'activité ?
            </h3>
            <p className="text-sm mb-4" style={{ color: STUDIO.gris }}>
              Cela nous permet de générer un design et contenu adapté
            </p>
          </div>
          <Select value={formData.sector} onValueChange={(v) => updateField('sector', v)}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Sélectionnez votre secteur" />
            </SelectTrigger>
            <SelectContent>
              {BUSINESS_SECTORS.map((sector) => (
                <SelectItem key={sector.id} value={sector.id}>
                  {sector.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formData.sector === 'autre' && (
            <Input
              placeholder="Précisez votre secteur..."
              value={formData.otherSector}
              onChange={(e) => updateField('otherSector', e.target.value)}
              className="bg-white/5 border-white/10 text-white"
            />
          )}
        </div>
      );
    }

    // Business info step
    if ((isBasic && currentStep === 1) || (!isBasic && currentStep === 2)) {
      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2" style={{ color: STUDIO.ivoire }}>
              Informations sur votre entreprise
            </h3>
          </div>
          <div className="space-y-4">
            <div>
              <Label className="text-white/70">Nom de votre entreprise *</Label>
              <Input
                placeholder="Ex: Café Marrakech"
                value={formData.businessName}
                onChange={(e) => updateField('businessName', e.target.value)}
                className="bg-white/5 border-white/10 text-white mt-1"
              />
            </div>
            <div>
              <Label className="text-white/70">Description de votre activité *</Label>
              <Textarea
                placeholder="En quelques phrases, décrivez ce que vous faites..."
                value={formData.businessDescription}
                onChange={(e) => updateField('businessDescription', e.target.value)}
                className="bg-white/5 border-white/10 text-white mt-1 min-h-[120px]"
              />
            </div>
          </div>
        </div>
      );
    }

    // Contact step
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2" style={{ color: STUDIO.ivoire }}>
            Vos coordonnées
          </h3>
        </div>
        <div className="space-y-4">
          <div>
            <Label className="text-white/70">Nom complet *</Label>
            <Input
              placeholder="Votre nom"
              value={formData.fullName}
              onChange={(e) => updateField('fullName', e.target.value)}
              className="bg-white/5 border-white/10 text-white mt-1"
            />
          </div>
          <div>
            <Label className="text-white/70">Email *</Label>
            <Input
              type="email"
              placeholder="votre@email.com"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              className="bg-white/5 border-white/10 text-white mt-1"
            />
          </div>
          <div>
            <Label className="text-white/70">Téléphone *</Label>
            <Input
              type="tel"
              placeholder="+212 6XX XXX XXX"
              value={formData.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              className="bg-white/5 border-white/10 text-white mt-1"
            />
          </div>
        </div>

        {/* Hosting Options */}
        <div className="pt-4 border-t border-white/10">
          <h4 className="text-sm font-medium mb-4" style={{ color: STUDIO.ivoire }}>
            Hébergement
          </h4>
          <div className="space-y-3">
            {/* IWASP hosting option */}
            <label 
              className={`flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-all ${
                formData.hostingType === 'iwasp' 
                  ? 'bg-amber-500/20 border-amber-500' 
                  : 'bg-white/5 border-white/10'
              } border`}
              onClick={() => updateField('hostingType', 'iwasp')}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                formData.hostingType === 'iwasp' ? 'border-amber-500' : 'border-white/30'
              }`}>
                {formData.hostingType === 'iwasp' && (
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Server size={16} className="text-amber-500" />
                  <span style={{ color: STUDIO.ivoire }} className="font-medium">Hébergement IWASP</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">Inclus</span>
                </div>
                <p className="text-xs mt-1" style={{ color: STUDIO.gris }}>
                  Votre site sera accessible sur <span className="text-amber-400">{formData.businessName ? formData.businessName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') : 'votre-entreprise'}.i-wasp.com</span>
                </p>
              </div>
            </label>

            {/* Custom domain option */}
            <label 
              className={`flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-all ${
                formData.hostingType === 'custom' 
                  ? 'bg-amber-500/20 border-amber-500' 
                  : 'bg-white/5 border-white/10'
              } border`}
              onClick={() => updateField('hostingType', 'custom')}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                formData.hostingType === 'custom' ? 'border-amber-500' : 'border-white/30'
              }`}>
                {formData.hostingType === 'custom' && (
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Globe size={16} className="text-blue-400" />
                  <span style={{ color: STUDIO.ivoire }} className="font-medium">Domaine personnalisé</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">+100 MAD/an</span>
                </div>
                <p className="text-xs mt-1" style={{ color: STUDIO.gris }}>
                  Utilisez votre propre nom de domaine (ex: votre-entreprise.ma)
                </p>
              </div>
            </label>

            {/* Custom domain input */}
            {formData.hostingType === 'custom' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="ml-8"
              >
                <Label className="text-white/70 text-xs">Votre nom de domaine</Label>
                <Input
                  placeholder="exemple.ma ou www.exemple.com"
                  value={formData.customDomainName}
                  onChange={(e) => updateField('customDomainName', e.target.value)}
                  className="bg-white/5 border-white/10 text-white mt-1"
                />
                <p className="text-xs mt-2" style={{ color: STUDIO.gris }}>
                  Vous recevrez les instructions de configuration DNS après le paiement
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Additional Options */}
        <div className="pt-4 border-t border-white/10">
          <h4 className="text-sm font-medium mb-4" style={{ color: STUDIO.ivoire }}>
            Options supplémentaires
          </h4>
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 rounded-xl bg-white/5 cursor-pointer">
              <Checkbox
                checked={formData.logoDesign}
                onCheckedChange={(c) => updateField('logoDesign', c)}
              />
              <div className="flex-1">
                <span style={{ color: STUDIO.ivoire }}>Design de logo</span>
                <span className="text-amber-500 ml-2 text-sm">+200 MAD</span>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 rounded-xl bg-white/5 cursor-pointer">
              <Checkbox
                checked={formData.seoOptimization}
                onCheckedChange={(c) => updateField('seoOptimization', c)}
              />
              <div className="flex-1">
                <span style={{ color: STUDIO.ivoire }}>Optimisation SEO avancée</span>
                <span className="text-amber-500 ml-2 text-sm">+150 MAD</span>
              </div>
            </label>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: STUDIO.noir }}>
      <CoutureNavbar />

      <main className="pt-24 pb-20 px-4">
        <div className="max-w-xl mx-auto">
          {/* Package info */}
          <motion.div
            className={`rounded-xl p-4 mb-6 ${selectedPackage.color.bg} ${selectedPackage.color.border} border`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className={`text-xs ${selectedPackage.color.accent}`}>
                  {selectedPackage.badge}
                </span>
                <h3 className="font-semibold" style={{ color: STUDIO.ivoire }}>
                  {selectedPackage.name}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold" style={{ color: STUDIO.ivoire }}>
                  {selectedPackage.priceMad}
                </span>
                <span className="text-sm ml-1" style={{ color: STUDIO.gris }}>MAD</span>
              </div>
            </div>
          </motion.div>

          {/* Progress */}
          <div className="flex items-center gap-2 mb-8">
            {steps.map((step, i) => (
              <div key={i} className="flex-1 flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    i <= currentStep
                      ? 'bg-amber-500 text-black'
                      : 'bg-white/10 text-white/50'
                  }`}
                >
                  {i < currentStep ? <Check size={16} /> : i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 ${
                      i < currentStep ? 'bg-amber-500' : 'bg-white/10'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step content */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="rounded-2xl p-6"
            style={{
              backgroundColor: STUDIO.noirCard,
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {isBasic && currentStep === 0 && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={16} className="text-emerald-500" />
                  <span className="text-sm font-medium text-emerald-500">Pack Basic - Site Vitrine</span>
                </div>
                <p className="text-xs text-white/60">
                  Votre site vitrine sera créé avec : accueil, services, contact et formulaire.
                </p>
              </div>
            )}

            {renderStepContent()}
          </motion.div>

          {/* Navigation */}
          <div className="flex gap-4 mt-6">
            <motion.button
              onClick={handleBack}
              className="flex-1 py-4 rounded-xl font-medium flex items-center justify-center gap-2 bg-white/5 border border-white/10"
              style={{ color: STUDIO.ivoire }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowLeft size={18} />
              <span>Retour</span>
            </motion.button>

            <motion.button
              onClick={handleNext}
              disabled={!canProceed() || isSubmitting}
              className={`flex-1 py-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-opacity ${
                canProceed() && !isSubmitting
                  ? 'bg-amber-500 text-black'
                  : 'bg-amber-500/30 text-white/50 cursor-not-allowed'
              }`}
              whileHover={canProceed() && !isSubmitting ? { scale: 1.02 } : {}}
              whileTap={canProceed() && !isSubmitting ? { scale: 0.98 } : {}}
            >
              {isSubmitting ? (
                <Loader2 size={18} className="animate-spin" />
              ) : currentStep === steps.length - 1 ? (
                <>
                  <span>Procéder au paiement</span>
                  <ArrowRight size={18} />
                </>
              ) : (
                <>
                  <span>Continuer</span>
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </div>
        </div>
      </main>

      <CoutureFooter />
    </div>
  );
}
