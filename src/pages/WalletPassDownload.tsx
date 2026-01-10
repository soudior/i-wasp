import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader2, Smartphone, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { 
  supportsAppleWallet, 
  supportsGoogleWallet,
  addToAppleWallet,
  addToGoogleWallet,
  WalletCardData
} from "@/lib/walletService";

type DownloadStatus = "detecting" | "loading" | "success" | "error" | "unsupported";

export default function WalletPassDownload() {
  const { slug } = useParams<{ slug: string }>();
  const [status, setStatus] = useState<DownloadStatus>("detecting");
  const [walletType, setWalletType] = useState<"apple" | "google" | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (!slug) {
      setStatus("error");
      setErrorMessage("URL invalide");
      return;
    }

    const downloadPass = async () => {
      try {
        // Detect wallet type
        const isApple = supportsAppleWallet();
        const isGoogle = supportsGoogleWallet();

        if (!isApple && !isGoogle) {
          setStatus("unsupported");
          return;
        }

        setWalletType(isApple ? "apple" : "google");
        setStatus("loading");

        // Fetch card data from database
        const { data: vcardData, error } = await supabase.rpc("get_vcard_data", {
          p_slug: slug,
        });

        if (error || !vcardData) {
          setStatus("error");
          setErrorMessage("Carte introuvable");
          return;
        }

        const cardData = vcardData as {
          first_name: string;
          last_name: string;
          title?: string;
          company?: string;
          email?: string;
          phone?: string;
          slug: string;
        };

        // Prepare wallet data
        const walletData: WalletCardData = {
          id: slug,
          firstName: cardData.first_name,
          lastName: cardData.last_name,
          title: cardData.title || undefined,
          company: cardData.company || undefined,
          email: cardData.email || undefined,
          phone: cardData.phone || undefined,
          slug: cardData.slug,
        };

        // Download appropriate pass
        let success = false;
        if (isApple) {
          success = await addToAppleWallet(walletData);
        } else {
          success = await addToGoogleWallet(walletData);
        }

        setStatus(success ? "success" : "error");
        if (!success) {
          setErrorMessage("Échec du téléchargement. Le contact a été téléchargé en format vCard.");
        }
      } catch (err) {
        console.error("Wallet pass download error:", err);
        setStatus("error");
        setErrorMessage("Une erreur est survenue");
      }
    };

    // Small delay for smooth UX
    const timer = setTimeout(downloadPass, 500);
    return () => clearTimeout(timer);
  }, [slug]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
      <div className="max-w-sm w-full text-center">
        {/* IWASP Logo */}
        <div className="mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <span className="text-white font-bold text-xl">iW</span>
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
          {status === "detecting" && (
            <>
              <Smartphone className="w-12 h-12 mx-auto text-amber-500 mb-4 animate-pulse" />
              <h1 className="text-white text-xl font-medium mb-2">
                Détection de l'appareil...
              </h1>
              <p className="text-white/60 text-sm">
                Préparation du pass wallet
              </p>
            </>
          )}

          {status === "loading" && (
            <>
              <Loader2 className="w-12 h-12 mx-auto text-amber-500 mb-4 animate-spin" />
              <h1 className="text-white text-xl font-medium mb-2">
                Génération du pass...
              </h1>
              <p className="text-white/60 text-sm">
                {walletType === "apple" ? "Apple Wallet" : "Google Wallet"}
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-500 mb-4" />
              <h1 className="text-white text-xl font-medium mb-2">
                Pass téléchargé !
              </h1>
              <p className="text-white/60 text-sm">
                Ajouté à {walletType === "apple" ? "Apple Wallet" : "Google Wallet"}
              </p>
            </>
          )}

          {status === "error" && (
            <>
              <AlertCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
              <h1 className="text-white text-xl font-medium mb-2">
                Erreur
              </h1>
              <p className="text-white/60 text-sm">
                {errorMessage}
              </p>
            </>
          )}

          {status === "unsupported" && (
            <>
              <Smartphone className="w-12 h-12 mx-auto text-amber-500/50 mb-4" />
              <h1 className="text-white text-xl font-medium mb-2">
                Appareil non supporté
              </h1>
              <p className="text-white/60 text-sm mb-4">
                Cette fonctionnalité nécessite un iPhone ou Android
              </p>
              <a
                href={`/c/${slug}`}
                className="inline-block px-6 py-3 bg-amber-500 text-black font-medium rounded-xl hover:bg-amber-400 transition-colors"
              >
                Voir la carte
              </a>
            </>
          )}
        </div>

        {/* Footer */}
        <p className="text-white/30 text-xs mt-6">
          Powered by IWASP
        </p>
      </div>
    </div>
  );
}
