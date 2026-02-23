/**
 * Nommos Group – Ultra-Premium Multi-Venue Digital Card
 * Route: /card/lifestyle-group
 * 
 * Design: Contemporary luxury (LVMH / Kering / Hermès aesthetic)
 * Typography: Refined serif + clean sans-serif pairing
 * Palette: Deep obsidian, champagne gold, warm ivory
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

// ─── Design Tokens ───────────────────────────────────────────
const T = {
  // Core palette
  bg: "#060608",
  surface: "rgba(255,255,255,0.025)",
  surfaceBorder: "rgba(255,255,255,0.05)",
  surfaceHover: "rgba(255,255,255,0.04)",
  // Typography
  ivory: "#F5F0EA",
  ivoryMid: "rgba(245,240,234,0.55)",
  ivoryDim: "rgba(245,240,234,0.2)",
  // Accent
  gold: "#C9A96E",
  goldSoft: "rgba(201,169,110,0.1)",
  goldBorder: "rgba(201,169,110,0.18)",
  // Divider
  line: "rgba(255,255,255,0.035)",
} as const;

// ─── Venue Row ───────────────────────────────────────────────
function VenueRow({ venue, index }: { venue: Venue; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ delay: 0.025 * index, duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <button onClick={() => setOpen(!open)} className="w-full text-left group">
        <div className="flex items-center gap-4 py-4 px-1">
          {/* Logo */}
          <div
            className="w-11 h-11 rounded-[12px] overflow-hidden flex-shrink-0"
            style={{ border: `1px solid ${T.surfaceBorder}` }}
          >
            <img src={venue.logo} alt={venue.name} className="w-11 h-11 object-cover" loading="lazy" />
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p
              className="text-[13.5px] font-medium tracking-[-0.01em] truncate"
              style={{ color: T.ivory, fontFamily: "'Playfair Display', 'Georgia', serif" }}
            >
              {venue.name}
            </p>
            <p
              className="text-[10.5px] mt-0.5 tracking-[0.06em] uppercase"
              style={{ color: T.ivoryDim }}
            >
              {venue.subtitle}
            </p>
          </div>

          {/* Chevron */}
          <motion.div
            animate={{ rotate: open ? 90 : 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <ChevronRight size={13} style={{ color: T.ivoryDim }} />
          </motion.div>
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <div className="flex gap-2 pb-4 px-1">
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
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-[10px] text-[9.5px] font-semibold tracking-[0.1em] uppercase transition-all duration-300"
                  style={{
                    background: T.goldSoft,
                    color: T.gold,
                    border: `1px solid ${T.goldBorder}`,
                  }}
                >
                  <Icon size={11} strokeWidth={2} />
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
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: "rgba(0,0,0,0.88)", backdropFilter: "blur(40px)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="rounded-[20px] p-10 max-w-[280px] w-full text-center"
            style={{ background: "#0E0E12", border: `1px solid ${T.surfaceBorder}` }}
          >
            <QRCodeSVG value={PAGE_URL} size={160} level="H" className="mx-auto" bgColor="transparent" fgColor={T.ivory} />
            <p
              className="mt-6 text-[9px] tracking-[0.25em] uppercase font-medium"
              style={{ color: T.ivoryMid, fontFamily: "'Inter', sans-serif" }}
            >
              Scan to connect
            </p>
            <button
              onClick={onClose}
              className="mt-6 w-full py-2.5 rounded-[10px] text-[11px] font-semibold tracking-[0.08em] uppercase transition-all duration-300"
              style={{ background: T.goldSoft, color: T.gold, border: `1px solid ${T.goldBorder}` }}
            >
              Fermer
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
      <div
        className="min-h-screen"
        style={{
          background: `linear-gradient(180deg, ${T.bg} 0%, #08080C 50%, ${T.bg} 100%)`,
          fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif",
        }}
      >
        <div className="max-w-[420px] mx-auto px-6 pt-16 pb-14">

          {/* ── Decorative line ── */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="w-8 h-px mx-auto mb-10 origin-center"
            style={{ background: T.gold }}
          />

          {/* ── Header ── */}
          <motion.header
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-center mb-12"
          >
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="w-[72px] h-[72px] mx-auto mb-7 rounded-[16px] overflow-hidden"
              style={{ border: `1px solid ${T.surfaceBorder}` }}
            >
              <img src={nommosGroupLogo} alt="Nommos Group" className="w-[72px] h-[72px] object-cover" />
            </motion.div>

            {/* Brand name — serif */}
            <h1
              className="text-[22px] font-normal tracking-[0.04em]"
              style={{ color: T.ivory, fontFamily: "'Playfair Display', 'Georgia', serif" }}
            >
              Nommos Group
            </h1>

            {/* Tagline */}
            <p
              className="mt-3 text-[9px] tracking-[0.35em] uppercase font-light"
              style={{ color: T.ivoryDim }}
            >
              Marrakech · Tanger
            </p>
          </motion.header>

          {/* ── City filter ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="flex gap-1.5 justify-center mb-10"
          >
            {pills.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setCity(value)}
                className="relative px-5 py-2 rounded-full text-[9px] font-semibold tracking-[0.12em] uppercase transition-all duration-300"
                style={{
                  background: city === value ? T.goldSoft : "transparent",
                  color: city === value ? T.gold : T.ivoryDim,
                  border: `1px solid ${city === value ? T.goldBorder : "transparent"}`,
                }}
              >
                {label}
              </button>
            ))}
          </motion.div>

          {/* ── Venues ── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="rounded-[20px] overflow-hidden"
            style={{
              background: T.surface,
              border: `1px solid ${T.surfaceBorder}`,
              boxShadow: "0 2px 40px rgba(0,0,0,0.3)",
            }}
          >
            <div className="px-4">
              <AnimatePresence mode="popLayout">
                {filtered.map((venue, i) => (
                  <div
                    key={venue.id}
                    style={{ borderBottom: i < filtered.length - 1 ? `1px solid ${T.line}` : "none" }}
                  >
                    <VenueRow venue={venue} index={i} />
                  </div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* ── Count ── */}
          <motion.p
            key={city}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center mt-5 mb-10 text-[9px] tracking-[0.25em] uppercase font-light"
            style={{ color: T.ivoryDim }}
          >
            {filtered.length} établissement{filtered.length > 1 ? "s" : ""}
          </motion.p>

          {/* ── Decorative divider ── */}
          <div className="w-6 h-px mx-auto mb-8" style={{ background: T.goldBorder }} />

          {/* ── Actions ── */}
          <div className="space-y-3">
            {/* Primary CTA — Gold gradient */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleVCard}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-[14px] text-[11px] font-bold tracking-[0.08em] uppercase transition-all duration-300"
              style={{
                background: `linear-gradient(135deg, ${T.gold} 0%, #B8964E 100%)`,
                color: T.bg,
                boxShadow: "0 4px 24px rgba(201,169,110,0.2)",
              }}
            >
              <Download size={14} strokeWidth={2.5} />
              Enregistrer le contact
            </motion.button>

            {/* Secondary actions */}
            <div className="grid grid-cols-3 gap-2">
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
                  className="flex flex-col items-center gap-2 py-4 rounded-[14px] transition-all duration-300"
                  style={{
                    background: T.surface,
                    border: `1px solid ${T.surfaceBorder}`,
                  }}
                >
                  <Icon size={16} strokeWidth={1.8} style={{ color: T.ivoryMid }} />
                  <span
                    className="text-[8.5px] font-semibold tracking-[0.1em] uppercase"
                    style={{ color: T.ivoryDim }}
                  >
                    {label}
                  </span>
                </a>
              ))}
            </div>

            {/* Tertiary actions */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { onClick: () => setQrOpen(true), icon: QrCode, label: "QR Code" },
                { onClick: handleShare, icon: Share2, label: "Partager" },
              ].map(({ onClick, icon: Icon, label }) => (
                <motion.button
                  key={label}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClick}
                  className="flex items-center justify-center gap-2.5 py-3 rounded-[12px] text-[10px] font-medium tracking-[0.06em] transition-all duration-300"
                  style={{
                    background: T.surface,
                    border: `1px solid ${T.surfaceBorder}`,
                    color: T.ivoryMid,
                  }}
                >
                  <Icon size={13} strokeWidth={1.8} />
                  {label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* ── Footer ── */}
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="text-center mt-16"
          >
            <div className="w-4 h-px mx-auto mb-5" style={{ background: T.line }} />
            <p
              className="text-[7.5px] tracking-[0.4em] uppercase font-medium"
              style={{ color: T.ivoryDim }}
            >
              Powered by IWASP
            </p>
          </motion.footer>
        </div>

        <QRModal open={qrOpen} onClose={() => setQrOpen(false)} />
      </div>
    </CardLayout>
  );
}
