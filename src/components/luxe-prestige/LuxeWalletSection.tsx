/**
 * LuxeWalletSection - Présentation Wallet haut de gamme pour Luxe Prestige
 * Réutilise l'intégration Wallet existante (edge functions apple-wallet / google-wallet)
 */

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { Loader2, Wallet, Phone, Mail, MapPin, Share2 } from "lucide-react";
import { toast } from "sonner";
import {
  addToAppleWallet,
  addToGoogleWallet,
  supportsAppleWallet,
  supportsGoogleWallet,
  WalletCardData,
  WalletStyles,
} from "@/lib/walletService";
import { PUBLIC_SITE_URL, publicCardUrl } from "@/lib/publicUrl";

const C = {
  background: "#0A0A0A",
  card: "#111111",
  gold: "#D4AF37",
  goldLight: "#F4E4BC",
  goldDark: "#B8960C",
  text: "#FFFFFF",
  textMuted: "#9CA3AF",
  accent: "#1C1C1C",
};

function AppleLogoIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

function GoogleWalletIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 110-12.064c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0012.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z" />
    </svg>
  );
}

interface LuxeWalletSectionProps {
  logo: string;
  name: string;
  title: string;
  tagline: string;
  phone: string;
  email: string;
  location: string;
  onShare?: () => void;
}

export function LuxeWalletSection({
  logo,
  name,
  title,
  tagline,
  phone,
  email,
  location,
  onShare,
}: LuxeWalletSectionProps) {
  const [loading, setLoading] = useState<"apple" | "google" | null>(null);

  // URL canonique : jamais window.location, sinon une preview grave un lien mort.
  const pageUrl = publicCardUrl("luxe-prestige");

  const isApple = supportsAppleWallet();
  const isAndroid = supportsGoogleWallet();
  const isDesktop = !isApple && !isAndroid;

  const cardData: WalletCardData = useMemo(
    () => ({
      id: "luxe-prestige",
      slug: "luxe-prestige",
      firstName: "Luxe",
      lastName: "Prestige",
      title,
      company: name,
      email,
      phone,
      website: pageUrl,
      location,
      // Image embarquee dans le pass Wallet : domaine canonique obligatoire,
      // sinon un pass genere depuis une preview pointe vers une image ephemere.
      photoUrl: `${PUBLIC_SITE_URL}${logo}`,
      tagline,
    }),
    [title, name, email, phone, pageUrl, location, logo, tagline]
  );

  const walletStyles: WalletStyles = {
    backgroundColor: C.background,
    foregroundColor: C.goldLight,
    labelColor: C.gold,
    showTitle: true,
    showCompany: true,
    showPhone: true,
    showEmail: true,
    showWebsite: true,
    showLocation: true,
  };

  const handleWallet = async (type: "apple" | "google") => {
    if (loading) return;
    setLoading(type);
    try {
      const ok =
        type === "apple"
          ? await addToAppleWallet(cardData, walletStyles)
          : await addToGoogleWallet(cardData, walletStyles);
      if (!ok) {
        // walletService gère déjà le repli vCard + notification
        return;
      }
    } catch {
      toast.error("Impossible d'ajouter la carte au Wallet pour le moment.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="p-6" style={{ backgroundColor: C.accent }}>
      <div className="flex items-center gap-2 mb-4">
        <Wallet size={18} style={{ color: C.gold }} />
        <h2 className="text-lg font-semibold tracking-wide" style={{ color: C.gold }}>
          Carte Wallet
        </h2>
      </div>

      {/* Aperçu de la carte Wallet */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: `linear-gradient(150deg, ${C.card} 0%, ${C.background} 60%, #14100a 100%)`,
          border: `1px solid ${C.gold}40`,
          boxShadow: `0 18px 40px -20px ${C.gold}55, 0 10px 30px rgba(0,0,0,0.6)`,
        }}
      >
        {/* Liseré or supérieur */}
        <div
          className="h-[2px] w-full"
          style={{ background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)` }}
        />

        <div className="p-5">
          {/* En-tête : logo + identité */}
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0"
              style={{ border: `1.5px solid ${C.gold}`, backgroundColor: C.background }}
            >
              <img src={logo} alt={name} className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="min-w-0">
              <p
                className="text-base font-semibold truncate"
                style={{ color: C.goldLight, letterSpacing: "0.06em" }}
              >
                {name}
              </p>
              <p className="text-[11px] uppercase truncate" style={{ color: C.gold, letterSpacing: "0.18em" }}>
                {title}
              </p>
            </div>
          </div>

          {/* Séparateur */}
          <div
            className="my-4 h-px w-full"
            style={{ background: `linear-gradient(90deg, ${C.gold}00, ${C.gold}55, ${C.gold}00)` }}
          />

          {/* Coordonnées + QR */}
          <div className="flex items-start gap-4">
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-center gap-2 min-w-0">
                <Phone size={13} style={{ color: C.gold }} className="flex-shrink-0" />
                <span className="text-xs truncate" style={{ color: C.text }}>{phone}</span>
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <Mail size={13} style={{ color: C.gold }} className="flex-shrink-0" />
                <span className="text-[11px] break-all leading-tight" style={{ color: C.text }}>{email}</span>
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <MapPin size={13} style={{ color: C.gold }} className="flex-shrink-0" />
                <span className="text-xs truncate" style={{ color: C.textMuted }}>{location}</span>
              </div>
            </div>

            {/* QR de secours */}
            <div
              className="p-2 rounded-xl flex-shrink-0"
              style={{ backgroundColor: "#FFFFFF", border: `1px solid ${C.gold}55` }}
            >
              <QRCodeSVG value={pageUrl} size={68} level="M" fgColor="#0A0A0A" bgColor="#FFFFFF" />
            </div>
          </div>
        </div>
      </motion.div>

      <p className="mt-3 text-[11px] text-center" style={{ color: C.textMuted }}>
        Ajoutez la carte à votre téléphone — le QR reste votre accès de secours.
      </p>

      {/* Boutons Wallet */}
      <div className="mt-4 space-y-3">
        {(isApple || isDesktop) && (
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => handleWallet("apple")}
            disabled={loading !== null}
            aria-busy={loading === "apple"}
            className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2.5 font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              background: `linear-gradient(135deg, ${C.gold}, ${C.goldDark})`,
              color: C.background,
              boxShadow: `0 6px 22px -8px ${C.gold}aa`,
            }}
          >
            {loading === "apple" ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <AppleLogoIcon className="w-[18px] h-[18px]" />
            )}
            <span className="text-sm">
              {loading === "apple" ? "Génération en cours…" : "Ajouter à Apple Wallet"}
            </span>
          </motion.button>
        )}

        {(isAndroid || isDesktop) && (
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => handleWallet("google")}
            disabled={loading !== null}
            aria-busy={loading === "google"}
            className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2.5 font-medium transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              backgroundColor: C.card,
              color: C.gold,
              border: `1px solid ${C.gold}66`,
            }}
          >
            {loading === "google" ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <GoogleWalletIcon className="w-[18px] h-[18px]" />
            )}
            <span className="text-sm">
              {loading === "google" ? "Génération en cours…" : "Ajouter à Google Wallet"}
            </span>
          </motion.button>
        )}

        {onShare && (
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onShare}
            className="w-full py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-all"
            style={{
              backgroundColor: "transparent",
              color: C.textMuted,
              border: `1px solid ${C.textMuted}40`,
            }}
          >
            <Share2 size={16} />
            Partager la carte
          </motion.button>
        )}
      </div>
    </div>
  );
}
