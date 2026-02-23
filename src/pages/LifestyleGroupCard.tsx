/**
 * Nommos Group – Premium Multi-Venue Digital Card
 * Route: /card/lifestyle-group
 * 
 * Design: Ultra-refined corporate luxury (LVMH / Kering aesthetic)
 */

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe, Instagram, MapPin, Phone, Mail, Download,
  ChevronRight, QrCode, Share2, MessageCircle,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { CardLayout } from "@/layouts/CardLayout";
import { downloadVCard } from "@/lib/vcard";

import nommosBeachLogo from "@/assets/lifestyle/nommos-beach-logo.png";
import nommosMarrakechLogo from "@/assets/lifestyle/nommos-marrakech-logo.png";
import nommosMarinaBayLogo from "@/assets/lifestyle/nommos-marina-bay-logo.jpeg";
import club555MrkLogo from "@/assets/lifestyle/555-marrakech-logo.jpeg";
import club555TngLogo from "@/assets/lifestyle/555-tanger-logo.jpeg";
import secretRoomLogo from "@/assets/lifestyle/secret-room-logo.jpeg";
import sky5Logo from "@/assets/lifestyle/sky5-logo.gif";
import lalalaLogo from "@/assets/lifestyle/lalala-restaurant-logo.jpeg";
import famousBeachLogo from "@/assets/lifestyle/famous-beach-logo.jpeg";
import sensesLogo from "@/assets/lifestyle/senses-logo.png";
import lePetitVersaillesLogo from "@/assets/lifestyle/le-petit-versailles-logo.jpeg";
import nommosGroupLogo from "@/assets/lifestyle/nommos-group-logo.png";

// ─── Types ───────────────────────────────────────────────────
interface Venue {
  id: string;
  name: string;
  subtitle: string;
  city: "Marrakech" | "Tanger";
  logo: string;
  website: string;
  instagram: string;
  googleMaps: string;
}

// ─── Data ────────────────────────────────────────────────────
const GROUP_PHONE = "+212 5 00 00 00 00";
const GROUP_WHATSAPP = "+212600000000";
const GROUP_EMAIL = "contact@nommos.ma";
const GROUP_WEBSITE = "https://www.nommos.ma";
const PAGE_URL = "https://i-wasp.lovable.app/card/lifestyle-group";

const VENUES: Venue[] = [
  { id: "nommos-beach", name: "Nommos Beach", subtitle: "Resort & Pool Club", city: "Marrakech", logo: nommosBeachLogo, website: "https://www.nommosbeachresort.com", instagram: "https://www.instagram.com/nommosbeach", googleMaps: "https://maps.app.goo.gl/nommosbeach" },
  { id: "nommos-marrakech", name: "Nommos Marrakech", subtitle: "Restaurant & Lounge", city: "Marrakech", logo: nommosMarrakechLogo, website: "https://www.nommos.ma", instagram: "https://www.instagram.com/nommosmarrakech", googleMaps: "https://maps.app.goo.gl/nommosmarrakech" },
  { id: "nommos-marina-bay", name: "Nommos Marina Bay", subtitle: "Restaurant & Lounge", city: "Tanger", logo: nommosMarinaBayLogo, website: "https://www.nommostanger.com", instagram: "https://www.instagram.com/nommostanger", googleMaps: "https://maps.app.goo.gl/nommostanger" },
  { id: "lalala", name: "Lalala", subtitle: "Restaurant", city: "Marrakech", logo: lalalaLogo, website: "https://www.lalalarestaurant.com", instagram: "https://www.instagram.com/lalalarestaurant", googleMaps: "https://maps.app.goo.gl/lalala" },
  { id: "555marrakech", name: "555 Marrakech", subtitle: "Hotel Clubbing", city: "Marrakech", logo: club555MrkLogo, website: "https://www.555marrakech.com", instagram: "https://www.instagram.com/555marrakech", googleMaps: "https://maps.app.goo.gl/555marrakech" },
  { id: "555tanger", name: "555 Tanger", subtitle: "Marina Bay", city: "Tanger", logo: club555TngLogo, website: "https://www.555tanger.com", instagram: "https://www.instagram.com/555tanger", googleMaps: "https://maps.app.goo.gl/555tanger" },
  { id: "secretroom", name: "Secret Room", subtitle: "Nightlife", city: "Marrakech", logo: secretRoomLogo, website: "https://www.secretroommarrakech.com", instagram: "https://www.instagram.com/secretroommarrakech", googleMaps: "https://maps.app.goo.gl/secretroom" },
  { id: "sky5-tanger", name: "Sky5 Tanger", subtitle: "Marina Bay", city: "Tanger", logo: sky5Logo, website: "https://www.skyfivetanger.com", instagram: "https://www.instagram.com/sky5tanger", googleMaps: "https://maps.app.goo.gl/sky5tanger" },
  { id: "sky5-marrakech", name: "Sky5 Marrakech", subtitle: "Rooftop & Lounge", city: "Marrakech", logo: sky5Logo, website: "https://www.skyfivemarrakech.com", instagram: "https://www.instagram.com/sky5marrakech", googleMaps: "https://maps.app.goo.gl/sky5marrakech" },
  { id: "famous-beach", name: "Famous Beach", subtitle: "Pool · Day Club", city: "Marrakech", logo: famousBeachLogo, website: "https://famousbeachmarrakech.com", instagram: "https://www.instagram.com/famousbeachmarrakech", googleMaps: "https://maps.app.goo.gl/Your1stRealLink" },
  { id: "senses", name: "Senses", subtitle: "Café · Restaurant", city: "Marrakech", logo: sensesLogo, website: "https://www.sensesmarrakech.com", instagram: "https://www.instagram.com/sensesmarrakech", googleMaps: "https://maps.app.goo.gl/YourSensesLink" },
  { id: "le-petit-versailles", name: "Le Petit Versailles", subtitle: "Restaurant festif", city: "Tanger", logo: lePetitVersaillesLogo, website: "https://leptiversailles.com", instagram: "https://www.instagram.com/lepetittanger", googleMaps: "https://maps.app.goo.gl/YourLPVLink" },
];

type CityFilter = "all" | "Marrakech" | "Tanger";

// ─── Styles ──────────────────────────────────────────────────
const S = {
  bg: "#0B0B0F",
  card: "rgba(255,255,255,0.03)",
  cardBorder: "rgba(255,255,255,0.06)",
  cardHoverBorder: "rgba(255,255,255,0.12)",
  text: "#F0EDE8",
  textSec: "rgba(240,237,232,0.45)",
  textMuted: "rgba(240,237,232,0.25)",
  gold: "#C6A96C",
  goldMuted: "rgba(198,169,108,0.12)",
  divider: "rgba(255,255,255,0.04)",
} as const;

// ─── Venue Row ───────────────────────────────────────────────
function VenueRow({ venue, index }: { venue: Venue; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ delay: 0.03 * index, duration: 0.3 }}
    >
      <button onClick={() => setOpen(!open)} className="w-full text-left group">
        <div className="flex items-center gap-3 py-3 px-1">
          <div className="w-10 h-10 rounded-[10px] overflow-hidden flex-shrink-0 ring-1 ring-white/[0.06]">
            <img src={venue.logo} alt={venue.name} className="w-10 h-10 object-cover" loading="lazy" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium tracking-[-0.01em] truncate" style={{ color: S.text }}>{venue.name}</p>
            <p className="text-[11px] mt-0.5 tracking-wide" style={{ color: S.textMuted }}>{venue.subtitle}</p>
          </div>
          <motion.div animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.15 }}>
            <ChevronRight size={14} style={{ color: S.textMuted }} />
          </motion.div>
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex gap-1.5 pb-3 px-1">
              {[
                { href: venue.website, icon: Globe, label: "Site" },
                { href: venue.instagram, icon: Instagram, label: "Instagram" },
                { href: venue.googleMaps, icon: MapPin, label: "Maps" },
              ].map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] font-medium tracking-wide uppercase transition-all duration-200"
                  style={{ background: S.goldMuted, color: S.gold }}
                >
                  <Icon size={12} />
                  {label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── QR Modal ────────────────────────────────────────────────
function QRModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="rounded-2xl p-8 max-w-[260px] w-full text-center"
            style={{ background: "#141418" , border: `1px solid ${S.cardBorder}` }}
          >
            <QRCodeSVG value={PAGE_URL} size={160} level="H" className="mx-auto" bgColor="transparent" fgColor={S.text} />
            <p className="mt-5 text-[11px] tracking-[0.15em] uppercase font-medium" style={{ color: S.textSec }}>Scan to connect</p>
            <button onClick={onClose} className="mt-5 w-full py-2.5 rounded-lg text-[12px] font-medium tracking-wide transition-colors" style={{ background: S.goldMuted, color: S.gold }}>
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Main ────────────────────────────────────────────────────
export default function LifestyleGroupCard() {
  const [qrOpen, setQrOpen] = useState(false);
  const [city, setCity] = useState<CityFilter>("all");

  const filtered = useMemo(
    () => city === "all" ? VENUES : VENUES.filter((v) => v.city === city),
    [city]
  );

  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: "Nommos Group", url: PAGE_URL }); } catch {}
    } else {
      await navigator.clipboard.writeText(PAGE_URL);
    }
  };

  const handleVCard = () => {
    downloadVCard({
      firstName: "Nommos", lastName: "Group",
      company: "Nommos Group", phone: GROUP_PHONE,
      email: GROUP_EMAIL, website: GROUP_WEBSITE,
      nfcPageUrl: PAGE_URL,
      note: VENUES.map((v) => v.name).join(" · "),
    });
  };

  const pills: { label: string; value: CityFilter }[] = [
    { label: "Tous", value: "all" },
    { label: "Marrakech", value: "Marrakech" },
    { label: "Tanger", value: "Tanger" },
  ];

  return (
    <CardLayout>
      <div className="min-h-screen" style={{ background: S.bg, fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif" }}>
        <div className="max-w-[400px] mx-auto px-5 py-12">

          {/* ── Header ── */}
          <motion.header
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <div
              className="w-16 h-16 mx-auto mb-5 rounded-xl overflow-hidden"
              style={{ border: `1px solid ${S.cardBorder}` }}
            >
              <img src={nommosGroupLogo} alt="Nommos Group" className="w-16 h-16 object-cover" />
            </div>
            <h1
              className="text-[20px] font-semibold tracking-[-0.025em]"
              style={{ color: S.text }}
            >
              Nommos Group
            </h1>
            <p
              className="text-[10px] mt-2 tracking-[0.3em] uppercase font-light"
              style={{ color: S.textMuted }}
            >
              Marrakech · Tanger
            </p>
          </motion.header>

          {/* ── City filter ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="flex gap-1 justify-center mb-8"
          >
            {pills.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setCity(value)}
                className="relative px-4 py-1.5 rounded-full text-[10px] font-medium tracking-[0.08em] uppercase transition-all duration-200"
                style={{
                  background: city === value ? S.goldMuted : "transparent",
                  color: city === value ? S.gold : S.textMuted,
                  border: `1px solid ${city === value ? "rgba(198,169,108,0.2)" : "transparent"}`,
                }}
              >
                {label}
              </button>
            ))}
          </motion.div>

          {/* ── Venues ── */}
          <div
            className="rounded-2xl overflow-hidden divide-y"
            style={{ background: S.card, border: `1px solid ${S.cardBorder}` }}
          >
            <div className="divide-y" style={{ "--tw-divide-opacity": "1", borderColor: S.divider } as React.CSSProperties}>
              <AnimatePresence mode="popLayout">
                {filtered.map((venue, i) => (
                  <div key={venue.id} style={{ borderColor: S.divider }} className="border-b last:border-b-0">
                    <VenueRow venue={venue} index={i} />
                  </div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* ── Count ── */}
          <motion.p
            key={city}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-4 mb-8 text-[10px] tracking-[0.2em] uppercase font-light"
            style={{ color: S.textMuted }}
          >
            {filtered.length} établissement{filtered.length > 1 ? "s" : ""}
          </motion.p>

          {/* ── Actions ── */}
          <div className="space-y-2">
            {/* Save contact — primary CTA */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleVCard}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-[12px] font-semibold tracking-[0.04em] uppercase transition-all duration-200"
              style={{ background: S.gold, color: S.bg }}
            >
              <Download size={14} />
              Enregistrer le contact
            </motion.button>

            {/* Secondary row */}
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { href: `tel:${GROUP_PHONE.replace(/\s/g, "")}`, icon: Phone, label: "Appeler" },
                { href: `https://wa.me/${GROUP_WHATSAPP}`, icon: MessageCircle, label: "WhatsApp", external: true },
                { href: `mailto:${GROUP_EMAIL}`, icon: Mail, label: "Email" },
              ].map(({ href, icon: Icon, label, external }) => (
                <a
                  key={label}
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className="flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all duration-200"
                  style={{ background: S.card, border: `1px solid ${S.cardBorder}` }}
                >
                  <Icon size={15} style={{ color: S.textSec }} />
                  <span className="text-[9px] font-medium tracking-[0.06em] uppercase" style={{ color: S.textMuted }}>{label}</span>
                </a>
              ))}
            </div>

            {/* Tertiary row */}
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { onClick: () => setQrOpen(true), icon: QrCode, label: "QR Code" },
                { onClick: handleShare, icon: Share2, label: "Partager" },
              ].map(({ onClick, icon: Icon, label }) => (
                <motion.button
                  key={label}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClick}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-[11px] font-medium tracking-wide transition-all duration-200"
                  style={{ background: S.card, border: `1px solid ${S.cardBorder}`, color: S.textSec }}
                >
                  <Icon size={14} />
                  {label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* ── Footer ── */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-12 text-[8px] tracking-[0.35em] uppercase font-light"
            style={{ color: S.textMuted }}
          >
            Powered by IWASP
          </motion.p>
        </div>

        <QRModal open={qrOpen} onClose={() => setQrOpen(false)} />
      </div>
    </CardLayout>
  );
}
