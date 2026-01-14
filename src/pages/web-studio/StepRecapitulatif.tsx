/**
 * Étape 5: Récapitulatif et génération
 * Affiche un résumé, génère la proposition, permet de commander
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, 
  Package, 
  Palette, 
  User, 
  Zap, 
  Check,
  Sparkles,
  Loader2,
  MessageCircle,
  FileText,
  ArrowRight
} from "lucide-react";
import { StudioFunnelStep } from "@/components/web-studio/StudioFunnelStep";
import { useWebStudio, WebStudioGuard } from "@/contexts/WebStudioContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const STUDIO = {
  noir: "#050505",
  noirSoft: "#0A0A0A",
  noirCard: "#111111",
  or: "#D4A853",
  orLight: "#E8C87A",
  ivoire: "#F5F5F5",
  gris: "#6B6B6B",
};

function StepRecapitulatifContent() {
  const { 
    state, 
    prevStep, 
    setProposal, 
    setIsExpress, 
    setSavedProposalId,
    calculatePrice,
    resetStudio 
  } = useWebStudio();
  const { formData, isExpress, proposal, isGenerating, sessionId } = state;
  const { toast } = useToast();
  
  const [isGeneratingLocal, setIsGeneratingLocal] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const handleGenerate = async () => {
    setIsGeneratingLocal(true);
    setProposal(null);

    try {
      const { data, error } = await supabase.functions.invoke("generate-website", {
        body: {
          businessType: formData.businessType,
          businessName: formData.businessName,
          description: formData.description,
          style: formData.style,
          colors: formData.colors,
          websiteUrl: formData.websiteUrl,
          socialLinks: formData.socialLinks,
          products: formData.products,
          services: formData.services,
          contactEmail: formData.contactEmail,
          contactPhone: formData.contactPhone,
        },
      });

      if (error) throw error;

      if (data.proposal) {
        setProposal(data.proposal);
        toast({
          title: "✨ Proposition générée !",
          description: "Votre site web est prêt à être visualisé",
        });
      }
    } catch (error: any) {
      console.error("Generation error:", error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingLocal(false);
    }
  };

  const handleOrder = async () => {
    if (!proposal) {
      toast({
        title: "Générez d'abord",
        description: "Cliquez sur 'Générer ma proposition' avant de commander",
        variant: "destructive",
      });
      return;
    }

    setIsOrdering(true);
    const price = calculatePrice();

    try {
      const { data, error } = await supabase.functions.invoke("webstudio-order", {
        body: {
          sessionId,
          formData,
          proposal,
          isExpress,
          priceEur: price.eur,
          priceMad: price.mad,
        },
      });

      if (error) throw error;

      if (data?.proposalId) {
        setSavedProposalId(data.proposalId);
      }
      setOrderSuccess(true);
      toast({
        title: "🎉 Commande envoyée !",
        description: "Notre équipe vous contactera sous 24h",
      });
    } catch (error: any) {
      console.error("Order error:", error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setIsOrdering(false);
    }
  };

  const handleWhatsApp = () => {
    const price = calculatePrice();
    const message = encodeURIComponent(
      `🚀 Demande de devis - Web Studio\n\n` +
      `📌 Projet: ${formData.businessName || formData.businessType}\n` +
      `📄 Pages: ${proposal?.estimatedPages || "À définir"}\n` +
      `⚡ Express: ${isExpress ? "Oui" : "Non"}\n` +
      `💰 Estimation: ${price.eur}€ / ${price.mad}DH\n\n` +
      `Contact: ${formData.contactEmail}`
    );
    window.open(`https://wa.me/33626424394?text=${message}`, "_blank");
  };

  const price = calculatePrice();

  // Success state
  if (orderSuccess) {
    return (
      <StudioFunnelStep
        currentStep={4}
        title="Commande confirmée ! 🎉"
        subtitle="Merci pour votre confiance"
        showContinue={false}
        showBack={false}
      >
        <motion.div
          className="rounded-2xl p-8 text-center"
          style={{
            backgroundColor: STUDIO.noirCard,
            border: `1px solid ${STUDIO.or}30`,
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{ backgroundColor: `${STUDIO.or}20` }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
          >
            <Check size={40} style={{ color: STUDIO.or }} />
          </motion.div>
          <h3 className="text-xl font-medium mb-3" style={{ color: STUDIO.ivoire }}>
            Votre demande a été enregistrée
          </h3>
          <p className="text-sm mb-6" style={{ color: STUDIO.gris }}>
            Notre équipe vous contactera à <strong style={{ color: STUDIO.or }}>{formData.contactEmail}</strong> sous 24h
          </p>
          <div className="flex flex-col gap-3">
            <motion.button
              onClick={handleWhatsApp}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl"
              style={{
                backgroundColor: "#25D366",
                color: "#FFFFFF",
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <MessageCircle size={18} />
              <span>Contacter sur WhatsApp</span>
            </motion.button>
            <motion.button
              onClick={resetStudio}
              className="text-sm underline"
              style={{ color: STUDIO.gris }}
            >
              Créer un nouveau projet
            </motion.button>
          </div>
        </motion.div>
      </StudioFunnelStep>
    );
  }

  return (
    <StudioFunnelStep
      currentStep={4}
      title="Récapitulatif de votre projet"
      subtitle="Vérifiez les informations et générez votre proposition"
      onBack={prevStep}
      showContinue={false}
    >
      <div className="space-y-6">
        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-3">
          {/* Enterprise */}
          <motion.div
            className="rounded-xl p-4"
            style={{
              backgroundColor: STUDIO.noirCard,
              border: `1px solid ${STUDIO.ivoire}10`,
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Building2 size={16} className="mb-2" style={{ color: STUDIO.or }} />
            <p className="text-xs mb-1" style={{ color: STUDIO.gris }}>Entreprise</p>
            <p className="text-sm font-medium truncate" style={{ color: STUDIO.ivoire }}>
              {formData.businessName || "Non renseigné"}
            </p>
            <p className="text-xs truncate" style={{ color: STUDIO.gris }}>
              {formData.businessType}
            </p>
          </motion.div>

          {/* Products */}
          <motion.div
            className="rounded-xl p-4"
            style={{
              backgroundColor: STUDIO.noirCard,
              border: `1px solid ${STUDIO.ivoire}10`,
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Package size={16} className="mb-2" style={{ color: STUDIO.or }} />
            <p className="text-xs mb-1" style={{ color: STUDIO.gris }}>Offre</p>
            <p className="text-sm font-medium truncate" style={{ color: STUDIO.ivoire }}>
              {formData.services ? "Services" : ""}{formData.services && formData.products ? " + " : ""}{formData.products ? "Produits" : ""}
            </p>
          </motion.div>

          {/* Design */}
          <motion.div
            className="rounded-xl p-4"
            style={{
              backgroundColor: STUDIO.noirCard,
              border: `1px solid ${STUDIO.ivoire}10`,
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Palette size={16} className="mb-2" style={{ color: STUDIO.or }} />
            <p className="text-xs mb-1" style={{ color: STUDIO.gris }}>Style</p>
            <p className="text-sm font-medium truncate" style={{ color: STUDIO.ivoire }}>
              {formData.style || "À proposer par l'IA"}
            </p>
          </motion.div>

          {/* Contact */}
          <motion.div
            className="rounded-xl p-4"
            style={{
              backgroundColor: STUDIO.noirCard,
              border: `1px solid ${STUDIO.ivoire}10`,
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <User size={16} className="mb-2" style={{ color: STUDIO.or }} />
            <p className="text-xs mb-1" style={{ color: STUDIO.gris }}>Contact</p>
            <p className="text-sm font-medium truncate" style={{ color: STUDIO.ivoire }}>
              {formData.contactName}
            </p>
            <p className="text-xs truncate" style={{ color: STUDIO.gris }}>
              {formData.contactEmail}
            </p>
          </motion.div>
        </div>

        {/* Express option */}
        <motion.div
          className="rounded-xl p-4"
          style={{
            backgroundColor: isExpress ? `${STUDIO.or}10` : STUDIO.noirCard,
            border: `1px solid ${isExpress ? STUDIO.or : `${STUDIO.ivoire}10`}`,
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={() => setIsExpress(!isExpress)}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Zap size={20} style={{ color: isExpress ? STUDIO.or : STUDIO.gris }} />
              <div className="text-left">
                <p className="text-sm font-medium" style={{ color: STUDIO.ivoire }}>
                  Livraison Express 24-48h
                </p>
                <p className="text-xs" style={{ color: STUDIO.gris }}>
                  +50€ / +500 DH
                </p>
              </div>
            </div>
            <div
              className={`w-12 h-6 rounded-full relative transition-colors ${
                isExpress ? "" : ""
              }`}
              style={{
                backgroundColor: isExpress ? STUDIO.or : `${STUDIO.ivoire}20`,
              }}
            >
              <motion.div
                className="absolute top-1 w-4 h-4 rounded-full"
                style={{ backgroundColor: isExpress ? STUDIO.noir : STUDIO.gris }}
                animate={{ left: isExpress ? "calc(100% - 20px)" : "4px" }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </div>
          </button>
        </motion.div>

        {/* Generate button */}
        {!proposal && (
          <motion.button
            onClick={handleGenerate}
            disabled={isGeneratingLocal}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-medium"
            style={{
              background: `linear-gradient(135deg, ${STUDIO.or} 0%, ${STUDIO.orLight} 100%)`,
              color: STUDIO.noir,
              boxShadow: `0 8px 24px ${STUDIO.or}30`,
            }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            {isGeneratingLocal ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Génération en cours...</span>
              </>
            ) : (
              <>
                <Sparkles size={20} />
                <span>Générer ma proposition</span>
              </>
            )}
          </motion.button>
        )}

        {/* Proposal result */}
        <AnimatePresence>
          {proposal && (
            <motion.div
              className="rounded-xl p-6"
              style={{
                backgroundColor: STUDIO.noirCard,
                border: `1px solid ${STUDIO.or}30`,
              }}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${STUDIO.or}20` }}
                >
                  <FileText size={20} style={{ color: STUDIO.or }} />
                </div>
                <div>
                  <h4 className="font-medium" style={{ color: STUDIO.ivoire }}>
                    {proposal.siteName}
                  </h4>
                  <p className="text-xs" style={{ color: STUDIO.gris }}>
                    {proposal.estimatedPages} pages • {proposal.complexity}
                  </p>
                </div>
              </div>

              <p className="text-sm mb-4" style={{ color: STUDIO.gris }}>
                "{proposal.tagline}"
              </p>

              {/* Price display */}
              <div
                className="rounded-lg p-4 mb-4"
                style={{ backgroundColor: `${STUDIO.or}10` }}
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: STUDIO.gris }}>
                    Estimation
                  </span>
                  <div className="text-right">
                    <span
                      className="text-xl font-bold"
                      style={{ color: STUDIO.or }}
                    >
                      {price.eur}€
                    </span>
                    <span className="text-sm ml-2" style={{ color: STUDIO.gris }}>
                      / {price.mad} DH
                    </span>
                  </div>
                </div>
              </div>

              {/* Order button */}
              <motion.button
                onClick={handleOrder}
                disabled={isOrdering}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium"
                style={{
                  background: `linear-gradient(135deg, ${STUDIO.or} 0%, ${STUDIO.orLight} 100%)`,
                  color: STUDIO.noir,
                }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {isOrdering ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Envoi en cours...</span>
                  </>
                ) : (
                  <>
                    <span>Valider ma commande</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </motion.button>

              <p className="text-center text-xs mt-3" style={{ color: STUDIO.gris }}>
                ou{" "}
                <button
                  onClick={handleWhatsApp}
                  className="underline"
                  style={{ color: STUDIO.or }}
                >
                  discuter sur WhatsApp
                </button>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </StudioFunnelStep>
  );
}

export default function StepRecapitulatif() {
  return (
    <WebStudioGuard step={4}>
      <StepRecapitulatifContent />
    </WebStudioGuard>
  );
}
