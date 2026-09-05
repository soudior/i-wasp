/**
 * AjbanWalletSection — Carte Wallet premium pour la Coopérative Ajban Al Khair.
 *
 * Réutilise l'intégration Wallet existante du projet (edge functions
 * apple-wallet / google-wallet via src/lib/walletService).
 *
 * Règle absolue i-Wasp : le QR encode TOUJOURS l'URL NFC publique canonique.
 * Elle est figée en dur — et non dérivée de window.location.origin — pour
 * qu'un rendu ouvert depuis une preview, un domaine temporaire ou un tunnel
 * n'encode jamais une adresse morte sur une carte imprimée.
 */

import { useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Loader2, MapPin, Phone, Wallet } from "lucide-react";
import { toast } from "sonner";
import {
  addToAppleWallet,
  addToGoogleWallet,
  supportsAppleWallet,
  supportsGoogleWallet,
  WalletCardData,
  WalletStyles,
} from "@/lib/walletService";

/** URL NFC canonique — identique à celle gravée sur la puce et au QR. */
export const AJBAN_CARD_URL = "https://i-wasp.com/card/ajban-al-khair";

const C = {
  deep: "#10261e",
  green: "#183328",
  cream: "#f8f3e8",
  amber: "#f3bd63",
  amberDeep: "#d9902f",
  sand: "#eee5d3",
  olive: "#829269",
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

interface AjbanWalletSectionProps {
  phone: string;
  address: string;
}

export function AjbanWalletSection({ phone, address }: AjbanWalletSectionProps) {
  const [loading, setLoading] = useState<"apple" | "google" | null>(null);

  const isApple = supportsAppleWallet();
  const isAndroid = supportsGoogleWallet();
  const isDesktop = !isApple && !isAndroid;

  const cardData: WalletCardData = useMemo(
    () => ({
      id: "ajban-al-khair",
      slug: "ajban-al-khair",
      firstName: "Ajban",
      lastName: "Al Khair",
      title: "Coopérative fromagère",
      company: "Coopérative Ajban Al Khair",
      phone,
      website: AJBAN_CARD_URL,
      location: address,
      tagline: "Fromages artisanaux · Marrakech",
    }),
    [phone, address]
  );

  // Pas d'e-mail vérifié pour ce client : le champ est masqué plutôt qu'inventé.
  const walletStyles: WalletStyles = {
    backgroundColor: C.deep,
    foregroundColor: C.cream,
    labelColor: C.amber,
    showTitle: true,
    showCompany: true,
    showPhone: true,
    showEmail: false,
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
      if (!ok) return; // walletService gère déjà le repli vCard et la notification
    } catch {
      toast.error("Impossible d'ajouter la carte au Wallet pour le moment.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <section className="px-6 pb-12">
      <div className="mb-6 flex items-center gap-2">
        <Wallet size={17} className="text-[#a26825]" />
        <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#a26825]">
          Carte Wallet
        </p>
      </div>

      {/* Aperçu de la carte — objet digital, pas une miniature de la page */}
      <div
        className="relative overflow-hidden rounded-[26px]"
        style={{
          background: `linear-gradient(155deg, ${C.green} 0%, ${C.deep} 58%, #0b1c15 100%)`,
          border: `1px solid ${C.amber}38`,
          boxShadow: `0 20px 44px -22px ${C.amberDeep}66, 0 12px 30px rgba(16,38,30,0.45)`,
        }}
      >
        <div
          className="h-[2px] w-full"
          style={{ background: `linear-gradient(90deg, transparent, ${C.amber}, transparent)` }}
        />

        <div className="p-5">
          <div className="flex items-start gap-4">
            {/* Monogramme : pas de logo officiel disponible, aucun faux logo créé */}
            <div
              className="grid h-14 w-14 flex-shrink-0 place-items-center rounded-full"
              style={{ border: `1.5px solid ${C.amber}`, backgroundColor: "rgba(243,189,99,0.08)" }}
            >
              <span
                className="font-['Playfair_Display'] text-2xl leading-none"
                style={{ color: C.amber }}
              >
                A
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <p
                className="font-['Playfair_Display'] text-xl leading-tight"
                style={{ color: C.cream }}
              >
                Ajban Al Khair
              </p>
              <p
                className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em]"
                style={{ color: C.amber }}
              >
                Coopérative fromagère
              </p>
              <p dir="rtl" className="mt-1 font-['Playfair_Display'] text-sm text-white/55">
                تعاونية أجبان الخير
              </p>
            </div>
          </div>

          <div className="my-5 h-px w-full" style={{ backgroundColor: "rgba(243,189,99,0.18)" }} />

          <div className="flex items-end justify-between gap-4">
            <div className="min-w-0 space-y-2.5">
              <div className="flex items-center gap-2.5">
                <Phone size={13} style={{ color: C.amber }} />
                <span className="truncate text-[13px] tabular-nums text-white/85">{phone}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin size={13} className="mt-0.5 flex-shrink-0" style={{ color: C.amber }} />
                <span className="text-[13px] leading-snug text-white/85">{address}</span>
              </div>
              <p className="pt-1 text-[10px] uppercase tracking-[0.18em] text-white/35">
                i-wasp.com/card/ajban-al-khair
              </p>
            </div>

            {/* QR de secours — encode l'URL NFC canonique, jamais un numéro */}
            <div
              className="flex-shrink-0 rounded-2xl p-2"
              style={{ backgroundColor: "#FFFFFF", border: `1px solid ${C.amber}55` }}
            >
              <QRCodeSVG
                value={AJBAN_CARD_URL}
                size={70}
                level="M"
                fgColor={C.deep}
                bgColor="#FFFFFF"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Boutons d'ajout — on n'affiche que ce que l'appareil sait faire */}
      <div className="mt-4 grid gap-2.5">
        {(isApple || isDesktop) && (
          <button
            onClick={() => handleWallet("apple")}
            disabled={loading !== null}
            className="flex h-12 items-center justify-center gap-2.5 rounded-full bg-[#183328] text-[13px] font-bold text-[#f8f3e8] transition active:scale-[0.98] disabled:opacity-60"
          >
            {loading === "apple" ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <AppleLogoIcon className="h-4 w-4" />
            )}
            Ajouter à Apple Wallet
          </button>
        )}

        {(isAndroid || isDesktop) && (
          <button
            onClick={() => handleWallet("google")}
            disabled={loading !== null}
            className="flex h-12 items-center justify-center gap-2.5 rounded-full border border-[#183328]/20 bg-white text-[13px] font-bold text-[#183328] transition active:scale-[0.98] disabled:opacity-60"
          >
            {loading === "google" ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <GoogleWalletIcon className="h-4 w-4" />
            )}
            Ajouter à Google Wallet
          </button>
        )}
      </div>

      <p className="mt-3 text-center text-[11px] text-[#183328]/50">
        Le QR reste votre accès de secours : il ouvre cette même page.
      </p>
    </section>
  );
}
