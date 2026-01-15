/**
 * Web Studio Paiement - Page de paiement Stripe
 * Récapitulatif + redirection vers Stripe Checkout
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CoutureNavbar } from "@/components/CoutureNavbar";
import { CoutureFooter } from "@/components/CoutureFooter";
import { 
  ArrowLeft,
  CreditCard,
  Check,
  Loader2,
  Shield,
  Zap,
  Lock,
  Globe,
  ExternalLink
} from "lucide-react";
import { WEB_STUDIO_PACKAGES, WebStudioPackageKey, getPackageById } from "@/lib/webStudioPackages";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const STUDIO = {
  noir: "#050505",
  noirCard: "#111111",
  or: "#D4A853",
  ivoire: "#F5F5F5",
  gris: "#6B6B6B",
};

interface OrderData {
  formData: {
    packageId: string;
    packageName: string;
    selectedPages: string[];
    sector: string;
    businessName: string;
    businessDescription: string;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    hosting?: {
      type: 'iwasp' | 'custom';
      customDomainName: string | null;
      subdomain: string | null;
    };
    options: {
      customDomain: boolean;
      logoDesign: boolean;
      seoOptimization: boolean;
    };
  };
  priceMad: number;
  priceEur: number;
  isInstant: boolean;
}

export default function WebStudioPaiement() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const packId = searchParams.get('pack') || 'basic';
  const selectedPackage = getPackageById(packId);
  
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('iwasp_webstudio_order');
    if (stored) {
      setOrderData(JSON.parse(stored));
    } else {
      navigate('/web-studio/offres');
    }
  }, [navigate]);

  const handlePayment = async () => {
    if (!orderData || !selectedPackage) return;

    setIsProcessing(true);

    try {
      // First, create the proposal in Supabase
      const { data: proposalData, error: proposalError } = await supabase
        .from('website_proposals')
        .insert({
          form_data: orderData.formData as any,
          proposal: {
            siteName: orderData.formData.businessName,
            tagline: orderData.formData.businessDescription,
            pages: orderData.formData.selectedPages,
            sector: orderData.formData.sector,
            packageId: packId,
            packageName: selectedPackage.name,
            isInstant: selectedPackage.isInstant,
          } as any,
          price_eur: selectedPackage.priceEur,
          price_mad: orderData.priceMad,
          is_express: selectedPackage.isInstant,
          status: 'pending_payment',
        })
        .select('id')
        .single();

      if (proposalError) throw proposalError;

      const proposalId = proposalData.id;

      // Create Stripe checkout session
      const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke(
        'create-webstudio-ia-payment',
        {
          body: {
            proposalId,
            priceId: selectedPackage.stripe_price_id,
            email: orderData.formData.contactEmail,
            packageName: selectedPackage.name,
            isInstant: selectedPackage.isInstant,
          },
        }
      );

      if (checkoutError) throw checkoutError;

      if (checkoutData?.url) {
        // Redirect to Stripe Checkout
        window.location.href = checkoutData.url;
      } else {
        throw new Error('No checkout URL received');
      }

    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Erreur de paiement",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!orderData || !selectedPackage) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: STUDIO.noir }}>
        <Loader2 size={32} className="animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: STUDIO.noir }}>
      <CoutureNavbar />

      <main className="pt-24 pb-20 px-4">
        <div className="max-w-xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-2xl md:text-3xl font-light mb-2" style={{ color: STUDIO.ivoire }}>
              Récapitulatif de votre commande
            </h1>
            <p className="text-sm" style={{ color: STUDIO.gris }}>
              Vérifiez les informations avant de procéder au paiement
            </p>
          </motion.div>

          {/* Order summary */}
          <motion.div
            className="rounded-2xl p-6 mb-6"
            style={{
              backgroundColor: STUDIO.noirCard,
              border: "1px solid rgba(255,255,255,0.1)",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Package info */}
            <div className={`rounded-xl p-4 mb-6 ${selectedPackage.color.bg} ${selectedPackage.color.border} border`}>
              <div className="flex items-center justify-between">
                <div>
                  <span className={`text-xs ${selectedPackage.color.accent}`}>
                    {selectedPackage.badge}
                  </span>
                  <h3 className="font-semibold" style={{ color: STUDIO.ivoire }}>
                    {selectedPackage.name}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  {selectedPackage.isInstant && (
                    <Zap size={20} className="text-emerald-500" />
                  )}
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b border-white/10">
                <span style={{ color: STUDIO.gris }}>Entreprise</span>
                <span style={{ color: STUDIO.ivoire }}>{orderData.formData.businessName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/10">
                <span style={{ color: STUDIO.gris }}>Contact</span>
                <span style={{ color: STUDIO.ivoire }}>{orderData.formData.contactName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/10">
                <span style={{ color: STUDIO.gris }}>Email</span>
                <span style={{ color: STUDIO.ivoire }}>{orderData.formData.contactEmail}</span>
              </div>
              {orderData.formData.selectedPages.length > 1 && (
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span style={{ color: STUDIO.gris }}>Pages</span>
                  <span style={{ color: STUDIO.ivoire }}>
                    {orderData.formData.selectedPages.length} pages
                  </span>
                </div>
              )}
              <div className="flex justify-between py-2 border-b border-white/10">
                <span style={{ color: STUDIO.gris }}>Délai</span>
                <span className={selectedPackage.color.accent}>
                  {selectedPackage.deliveryIcon} {selectedPackage.delivery}
                </span>
              </div>

              {/* Hosting / Domain Preview */}
              {orderData.formData.hosting && (
                <div className="py-3 border-b border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span style={{ color: STUDIO.gris }}>Hébergement</span>
                    <span style={{ color: STUDIO.ivoire }}>
                      {orderData.formData.hosting.type === 'iwasp' ? 'IWASP (inclus)' : 'Domaine personnalisé'}
                    </span>
                  </div>
                  {/* Domain preview */}
                  <div className="mt-3 p-3 rounded-lg bg-gradient-to-r from-amber-500/10 to-amber-600/5 border border-amber-500/20">
                    <div className="flex items-center gap-2 mb-1">
                      <Globe size={14} className="text-amber-500" />
                      <span className="text-xs font-medium text-amber-500">Votre site sera accessible sur :</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono px-2 py-1 rounded bg-black/30" style={{ color: STUDIO.ivoire }}>
                        {orderData.formData.hosting.type === 'iwasp' 
                          ? `${orderData.formData.hosting.subdomain || orderData.formData.businessName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.i-wasp.com`
                          : orderData.formData.hosting.customDomainName || 'votre-domaine.com'
                        }
                      </code>
                      <ExternalLink size={12} className="text-amber-500/60" />
                    </div>
                    {orderData.formData.hosting.type === 'custom' && (
                      <p className="text-xs mt-2" style={{ color: STUDIO.gris }}>
                        Les instructions DNS vous seront envoyées après le paiement
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Options */}
              {orderData.formData.hosting?.type === 'custom' && (
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span style={{ color: STUDIO.gris }}>Domaine personnalisé</span>
                  <span style={{ color: STUDIO.ivoire }}>+100 MAD/an</span>
                </div>
              )}
              {orderData.formData.options.logoDesign && (
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span style={{ color: STUDIO.gris }}>Design de logo</span>
                  <span style={{ color: STUDIO.ivoire }}>+200 MAD</span>
                </div>
              )}
              {orderData.formData.options.seoOptimization && (
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span style={{ color: STUDIO.gris }}>SEO avancé</span>
                  <span style={{ color: STUDIO.ivoire }}>+150 MAD</span>
                </div>
              )}
            </div>

            {/* Total */}
            <div className="mt-6 pt-4 border-t border-white/20">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium" style={{ color: STUDIO.ivoire }}>
                  Total
                </span>
                <div className="text-right">
                  <span className="text-3xl font-bold text-amber-500">
                    {orderData.priceMad}
                  </span>
                  <span className="text-lg ml-1" style={{ color: STUDIO.gris }}>
                    MAD
                  </span>
                  <p className="text-xs" style={{ color: STUDIO.gris }}>
                    ≈ {orderData.priceEur}€
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Instant delivery notice */}
          {selectedPackage.isInstant && (
            <motion.div
              className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-3">
                <Zap size={24} className="text-emerald-500" />
                <div>
                  <p className="font-medium text-emerald-500">Livraison instantanée</p>
                  <p className="text-xs text-white/60">
                    Après paiement, votre site sera généré et accessible en 5-10 minutes
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Security badges */}
          <motion.div
            className="flex items-center justify-center gap-6 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2 text-xs" style={{ color: STUDIO.gris }}>
              <Shield size={16} className="text-green-500" />
              <span>Paiement sécurisé</span>
            </div>
            <div className="flex items-center gap-2 text-xs" style={{ color: STUDIO.gris }}>
              <Lock size={16} className="text-green-500" />
              <span>SSL 256-bit</span>
            </div>
          </motion.div>

          {/* Actions */}
          <div className="flex gap-4">
            <motion.button
              onClick={() => navigate(-1)}
              className="flex-1 py-4 rounded-xl font-medium flex items-center justify-center gap-2 bg-white/5 border border-white/10"
              style={{ color: STUDIO.ivoire }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowLeft size={18} />
              <span>Retour</span>
            </motion.button>

            <motion.button
              onClick={handlePayment}
              disabled={isProcessing}
              className="flex-[2] py-4 rounded-xl font-medium flex items-center justify-center gap-2 bg-amber-500 text-black"
              whileHover={!isProcessing ? { scale: 1.02 } : {}}
              whileTap={!isProcessing ? { scale: 0.98 } : {}}
            >
              {isProcessing ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  <CreditCard size={18} />
                  <span>Payer {orderData.priceMad} MAD</span>
                </>
              )}
            </motion.button>
          </div>

          {/* Stripe logo */}
          <div className="text-center mt-6">
            <p className="text-xs" style={{ color: STUDIO.gris }}>
              Paiement sécurisé par Stripe
            </p>
          </div>
        </div>
      </main>

      <CoutureFooter />
    </div>
  );
}
