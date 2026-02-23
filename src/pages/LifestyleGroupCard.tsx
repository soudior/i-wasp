/**
 * Nommos Group – Ultra-Premium Multi-Venue Digital Card
 * Route: /card/lifestyle-group
 * 
 * Design: Contemporary luxury — clean, organized, intuitive
 * Typography: Playfair Display (serif) + Inter (sans-serif)
 * Palette: Deep obsidian, champagne gold, warm ivory
 */

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe, Instagram, MapPin, Phone, Mail, Download,
  QrCode, Share2, MessageCircle,
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
  bg: "#060608",
  surface: "rgba(255,255,255,0.035)",
  surfaceBorder: "rgba(255,255,255,0.06)",
  ivory: "#F5F0EA",
  ivoryMid: "rgba(245,240,234,0.55)",
  ivoryDim: "rgba(245,240,234,0.22)",
  gold: "#C9A96E",
  goldSoft: "rgba(201,169,110,0.1)",
  goldBorder: "rgba(201,169,110,0.18)",
  line: "rgba(255,255,255,0.04)",
} as const;

const serif = "'Playfair Display', 'Georgia', serif";
const sans = "'Inter', 'SF Pro Display', -apple-system, sans-serif";

// ─── Venue Card ──────────────────────────────────────────────
function VenueCard({ venue, index }: { venue: Venue; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ delay: 0.03 * index, duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      className="rounded-[16px] overflow-hidden"
      style={{
        background: T.surface,
        border: `1px solid ${T.surfaceBorder}`,
      }}
    >
      {/* Top: Logo + info */}
      <div className="flex items-center gap-3.5 px-4 py-3.5">
        <div
          className="w-12 h-12 rounded-[12px] overflow-hidden flex-shrink-0"
          style={{ border: `1px solid ${T.surfaceBorder}` }}
        >
          <img src={venue.logo} alt={venue.name} className="w-12 h-12 object-cover" loading="lazy" />
        </div>
        <div className="flex-1 min-w-0">
          <p
            className="text-[14px] font-medium tracking-[-0.01em] truncate"
            style={{ color: T.ivory, fontFamily: serif }}
          >
            {venue.name}
          </p>
          <p
            className="text-[10px] mt-0.5 tracking-[0.04em] uppercase"
            style={{ color: T.ivoryDim }}
          >
            {venue.subtitle} · {venue.city}
          </p>
        </div>
      </div>

      {/* Bottom: Quick links */}
      <div className="flex border-t" style={{ borderColor: T.line }}>
        {[
          { href: venue.website, icon: Globe, label: "Site" },
          { href: venue.instagram, icon: Instagram, label: "Insta" },
          { href: venue.googleMaps, icon: MapPin, label: "Maps" },
        ].map(({ href, icon: Icon, label }, i) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[9px] font-semibold tracking-[0.08em] uppercase transition-colors duration-200"
            style={{
              color: T.gold,
              borderRight: i < 2 ? `1px solid ${T.line}` : "none",
            }}
          >
            <Icon size={11} strokeWidth={2} />
            {label}
          </a>
        ))}
      </div>
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
              style={{ color: T.ivoryMid, fontFamily: sans }}
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

// ─── Section Label ───────────────────────────────────────────
function SectionLabel({ children, delay = 0 }: { children: string; delay?: number }) {
  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.4 }}
      className="text-[8.5px] tracking-[0.3em] uppercase font-semibold mb-4"
      style={{ color: T.ivoryDim }}
    >
      {children}
    </motion.p>
  );
}

// ─── Main ────────────────────────────────────────────────────
export default function LifestyleGroupCard() {
  const [qrOpen, setQrOpen] = useState(false);
  const [city, setCity] = useState<CityFilter>("all");
  const [introComplete, setIntroComplete] = useState(false);

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
          fontFamily: sans,
        }}
      >
        {/* ── Intro overlay ── */}
        <AnimatePresence>
          {!introComplete && (
            <motion.div
              className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6"
              style={{ background: T.bg }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {/* Logo reveal */}
              <motion.div
                className="w-20 h-20 rounded-[18px] overflow-hidden"
                style={{ border: `1px solid ${T.goldBorder}` }}
                initial={{ scale: 0.7, opacity: 0, filter: "blur(12px)" }}
                animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <img src={nommosGroupLogo} alt="N" className="w-full h-full object-cover" />
              </motion.div>

              {/* Brand */}
              <motion.p
                className="text-[20px] font-normal tracking-[0.05em]"
                style={{ color: T.ivory, fontFamily: serif }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                Nommos Group
              </motion.p>

              {/* Gold line */}
              <motion.div
                className="w-8 h-px"
                style={{ background: T.gold }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              />

              {/* Auto-dismiss */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0 }}
                transition={{ delay: 1.4 }}
                onAnimationComplete={() => setIntroComplete(true)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="max-w-[420px] mx-auto px-5 pt-14 pb-12">

          {/* ── Header ── */}
          <motion.header
            initial={{ opacity: 0, y: -10 }}
            animate={introComplete ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center mb-10"
          >
            <div
              className="w-16 h-16 mx-auto mb-5 rounded-[14px] overflow-hidden"
              style={{ border: `1px solid ${T.surfaceBorder}` }}
            >
              <img src={nommosGroupLogo} alt="Nommos Group" className="w-16 h-16 object-cover" />
            </div>
            <h1
              className="text-[20px] font-normal tracking-[0.03em]"
              style={{ color: T.ivory, fontFamily: serif }}
            >
              Nommos Group
            </h1>
            <p
              className="mt-2 text-[10px] tracking-[0.2em] uppercase font-light"
              style={{ color: T.ivoryDim }}
            >
              Marrakech · Tanger
            </p>
          </motion.header>

          {/* ── Quick Contact ── */}
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={introComplete ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="mb-10"
          >
            <SectionLabel delay={0.2}>Contact</SectionLabel>

            {/* Primary CTA */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleVCard}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-[12px] text-[11px] font-bold tracking-[0.06em] uppercase mb-3"
              style={{
                background: `linear-gradient(135deg, ${T.gold} 0%, #B8964E 100%)`,
                color: T.bg,
                boxShadow: "0 4px 20px rgba(201,169,110,0.18)",
              }}
            >
              <Download size={14} strokeWidth={2.5} />
              Enregistrer le contact
            </motion.button>

            {/* Contact grid */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { href: `tel:${GROUP_PHONE.replace(/\s/g, "")}`, icon: Phone, label: "Appeler" },
                { href: `https://wa.me/${GROUP_WHATSAPP}`, icon: MessageCircle, label: "WhatsApp", external: true },
                { href: `mailto:${GROUP_EMAIL}`, icon: Mail, label: "Email" },
                { onClick: handleShare, icon: Share2, label: "Partager" },
              ].map(({ href, onClick, icon: Icon, label, external }: any) => {
                const style = {
                  background: T.surface,
                  border: `1px solid ${T.surfaceBorder}`,
                };
                const inner = (
                  <>
                    <Icon size={16} strokeWidth={1.8} style={{ color: T.ivoryMid }} />
                    <span className="text-[7.5px] font-semibold tracking-[0.08em] uppercase" style={{ color: T.ivoryDim }}>
                      {label}
                    </span>
                  </>
                );

                if (onClick) {
                  return (
                    <button
                      key={label}
                      onClick={onClick}
                      className="flex flex-col items-center gap-1.5 py-3 rounded-[12px] transition-colors duration-200"
                      style={style}
                    >
                      {inner}
                    </button>
                  );
                }
                return (
                  <a
                    key={label}
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className="flex flex-col items-center gap-1.5 py-3 rounded-[12px] transition-colors duration-200"
                    style={style}
                  >
                    {inner}
                  </a>
                );
              })}
            </div>
          </motion.section>

          {/* ── Venues ── */}
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={introComplete ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.25, duration: 0.4 }}
          >
            {/* Section label + filter pills on same row */}
            <div className="flex items-center justify-between mb-4">
              <p
                className="text-[8.5px] tracking-[0.3em] uppercase font-semibold"
                style={{ color: T.ivoryDim }}
              >
                Nos adresses
              </p>
              <div className="flex gap-1">
                {pills.map(({ label, value }) => (
                  <button
                    key={value}
                    onClick={() => setCity(value)}
                    className="px-3 py-1 rounded-full text-[8px] font-semibold tracking-[0.1em] uppercase transition-all duration-200"
                    style={{
                      background: city === value ? T.goldSoft : "transparent",
                      color: city === value ? T.gold : T.ivoryDim,
                      border: `1px solid ${city === value ? T.goldBorder : "transparent"}`,
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Venue cards grid */}
            <div className="space-y-2.5">
              <AnimatePresence mode="popLayout">
                {filtered.map((venue, i) => (
                  <VenueCard key={venue.id} venue={venue} index={i} />
                ))}
              </AnimatePresence>
            </div>

            {/* Count */}
            <motion.p
              key={city}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mt-4 text-[9px] tracking-[0.15em] uppercase"
              style={{ color: T.ivoryDim }}
            >
              {filtered.length} établissement{filtered.length > 1 ? "s" : ""}
            </motion.p>
          </motion.section>

          {/* ── QR Code ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={introComplete ? { opacity: 1 } : {}}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="mt-8 flex justify-center"
          >
            <button
              onClick={() => setQrOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-[9px] font-medium tracking-[0.06em] transition-all duration-200"
              style={{
                background: T.surface,
                border: `1px solid ${T.surfaceBorder}`,
                color: T.ivoryMid,
              }}
            >
              <QrCode size={13} strokeWidth={1.8} />
              Afficher le QR Code
            </button>
          </motion.div>

          {/* ── Footer ── */}
          <footer className="text-center mt-14">
            <div className="w-4 h-px mx-auto mb-4" style={{ background: T.line }} />
            <p
              className="text-[7px] tracking-[0.35em] uppercase font-medium"
              style={{ color: T.ivoryDim }}
            >
              Powered by IWASP
            </p>
          </footer>
        </div>

        <QRModal open={qrOpen} onClose={() => setQrOpen(false)} />
      </div>
    </CardLayout>
  );
}
