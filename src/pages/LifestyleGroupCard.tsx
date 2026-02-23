/**
 * Nommos Group NFC Card – Premium "Link in Bio" for multi-venue property
 * Route: /card/lifestyle-group
 * 
 * Features: City filter, WhatsApp, Share, vCard, QR Code
 */

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Globe, Instagram, MapPin, Phone, Mail, Download, 
  ChevronRight, QrCode, X, Share2, MessageCircle, Filter
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { CardLayout } from "@/layouts/CardLayout";
import { downloadVCard } from "@/lib/vcard";

import nommosBeachLogo from "@/assets/lifestyle/nommos-beach-logo.jpeg";
import nommosMarrakechLogo from "@/assets/lifestyle/nommos-marrakech-logo.jpeg";
import nommosMarinaBayLogo from "@/assets/lifestyle/nommos-marina-bay-logo.jpeg";
import club555MrkLogo from "@/assets/lifestyle/555-marrakech-logo.jpeg";
import club555TngLogo from "@/assets/lifestyle/555-tanger-logo.jpeg";
import secretRoomLogo from "@/assets/lifestyle/secret-room-logo.jpeg";
import sky5MarinaBayLogo from "@/assets/lifestyle/sky5-marina-bay-logo.jpeg";
import sky5RooftopLogo from "@/assets/lifestyle/sky5-rooftop-logo.jpeg";
import lalalaLogo from "@/assets/lifestyle/lalala-restaurant-logo.jpeg";
import famousBeachLogo from "@/assets/lifestyle/famous-beach-logo.jpeg";
import sensesLogo from "@/assets/lifestyle/senses-logo.jpeg";
import lePetitVersaillesLogo from "@/assets/lifestyle/le-petit-versailles-logo.jpeg";

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
  accent: string;
}

// ─── Data ────────────────────────────────────────────────────
const GROUP_NAME = "Nommos Group";
const GROUP_TAGLINE = "Marrakech · Tanger";
const GROUP_PHONE = "+212 5 00 00 00 00";
const GROUP_WHATSAPP = "+212600000000";
const GROUP_EMAIL = "contact@nommos.ma";
const GROUP_WEBSITE = "https://www.nommos.ma";

const VENUES: Venue[] = [
  {
    id: "nommos-beach",
    name: "Nommos Beach",
    subtitle: "Resort & Pool Club Restaurant",
    city: "Marrakech",
    logo: nommosBeachLogo,
    website: "https://www.nommosbeachresort.com",
    instagram: "https://www.instagram.com/nommosbeach",
    googleMaps: "https://maps.app.goo.gl/nommosbeach",
    accent: "#d4a0c0",
  },
  {
    id: "nommos-marrakech",
    name: "Nommos Marrakech",
    subtitle: "Restaurant & Lounge",
    city: "Marrakech",
    logo: nommosMarrakechLogo,
    website: "https://www.nommos.ma",
    instagram: "https://www.instagram.com/nommosmarrakech",
    googleMaps: "https://maps.app.goo.gl/nommosmarrakech",
    accent: "#c78daa",
  },
  {
    id: "nommos-marina-bay",
    name: "Nommos Marina Bay",
    subtitle: "Tanger",
    city: "Tanger",
    logo: nommosMarinaBayLogo,
    website: "https://www.nommostanger.com",
    instagram: "https://www.instagram.com/nommostanger",
    googleMaps: "https://maps.app.goo.gl/nommostanger",
    accent: "#b894c0",
  },
  {
    id: "lalala",
    name: "Lalala",
    subtitle: "Restaurant",
    city: "Marrakech",
    logo: lalalaLogo,
    website: "https://www.lalalarestaurant.com",
    instagram: "https://www.instagram.com/lalalarestaurant",
    googleMaps: "https://maps.app.goo.gl/lalala",
    accent: "#e8a87c",
  },
  {
    id: "555marrakech",
    name: "555 Marrakech",
    subtitle: "Hotel Clubbing",
    city: "Marrakech",
    logo: club555MrkLogo,
    website: "https://www.555marrakech.com",
    instagram: "https://www.instagram.com/555marrakech",
    googleMaps: "https://maps.app.goo.gl/555marrakech",
    accent: "#FFD700",
  },
  {
    id: "555tanger",
    name: "555 Tanger",
    subtitle: "Marina Bay",
    city: "Tanger",
    logo: club555TngLogo,
    website: "https://www.555tanger.com",
    instagram: "https://www.instagram.com/555tanger",
    googleMaps: "https://maps.app.goo.gl/555tanger",
    accent: "#FFD700",
  },
  {
    id: "secretroom",
    name: "Secret Room",
    subtitle: "Marrakech",
    city: "Marrakech",
    logo: secretRoomLogo,
    website: "https://www.secretroommarrakech.com",
    instagram: "https://www.instagram.com/secretroommarrakech",
    googleMaps: "https://maps.app.goo.gl/secretroom",
    accent: "#8B2252",
  },
  {
    id: "sky5-tanger",
    name: "Sky5 Tanger",
    subtitle: "Marina Bay",
    city: "Tanger",
    logo: sky5MarinaBayLogo,
    website: "https://www.skyfivetanger.com",
    instagram: "https://www.instagram.com/sky5tanger",
    googleMaps: "https://maps.app.goo.gl/sky5tanger",
    accent: "#F5A623",
  },
  {
    id: "sky5-marrakech",
    name: "Sky5 Marrakech",
    subtitle: "Rooftop & Lounge",
    city: "Marrakech",
    logo: sky5RooftopLogo,
    website: "https://www.skyfivemarrakech.com",
    instagram: "https://www.instagram.com/sky5marrakech",
    googleMaps: "https://maps.app.goo.gl/sky5marrakech",
    accent: "#F5A623",
  },
  {
    id: "famous-beach",
    name: "Famous Beach",
    subtitle: "Pool · Day Club · Restaurant",
    city: "Marrakech",
    logo: famousBeachLogo,
    website: "https://famousbeachmarrakech.com",
    instagram: "https://www.instagram.com/famousbeachmarrakech",
    googleMaps: "https://maps.app.goo.gl/Your1stRealLink",
    accent: "#FFD700",
  },
  {
    id: "senses",
    name: "Senses",
    subtitle: "Café · Restaurant",
    city: "Marrakech",
    logo: sensesLogo,
    website: "https://www.sensesmarrakech.com",
    instagram: "https://www.instagram.com/sensesmarrakech",
    googleMaps: "https://maps.app.goo.gl/YourSensesLink",
    accent: "#4A7FB5",
  },
  {
    id: "le-petit-versailles",
    name: "Le Petit Versailles",
    subtitle: "Restaurant festif · Tanger",
    city: "Tanger",
    logo: lePetitVersaillesLogo,
    website: "https://leptiversailles.com",
    instagram: "https://www.instagram.com/lepetittanger",
    googleMaps: "https://maps.app.goo.gl/YourLPVLink",
    accent: "#C9A96E",
  },
];

const PAGE_URL = "https://i-wasp.lovable.app/card/lifestyle-group";

type CityFilter = "all" | "Marrakech" | "Tanger";

// ─── Venue Card ──────────────────────────────────────────────
function VenueCard({ venue, index }: { venue: Venue; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index, duration: 0.35, ease: "easeOut" }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left"
      >
        <div
          className="relative overflow-hidden rounded-2xl border transition-all duration-300"
          style={{
            background: `linear-gradient(135deg, ${venue.accent}12 0%, ${venue.accent}06 100%)`,
            borderColor: expanded ? `${venue.accent}30` : `${venue.accent}15`,
          }}
        >
          <div className="flex items-center gap-3.5 p-3.5">
            <div
              className="w-13 h-13 rounded-xl overflow-hidden flex-shrink-0"
              style={{ boxShadow: `0 0 0 1px ${venue.accent}25` }}
            >
              <img
                src={venue.logo}
                alt={venue.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white/95 font-semibold text-[15px] tracking-tight truncate">
                {venue.name}
              </h3>
              <p className="text-white/40 text-xs mt-0.5 font-light">{venue.subtitle}</p>
            </div>
            <motion.div
              animate={{ rotate: expanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight size={16} className="text-white/25" />
            </motion.div>
          </div>
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="flex gap-2 px-1 pt-2 pb-1">
              {[
                { href: venue.website, icon: Globe, label: "Site" },
                { href: venue.instagram, icon: Instagram, label: "Insta" },
                { href: venue.googleMaps, icon: MapPin, label: "Maps" },
              ].map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 hover:scale-[1.02]"
                  style={{
                    background: `${venue.accent}15`,
                    color: venue.accent,
                  }}
                >
                  <Icon size={13} />
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-8 max-w-[280px] w-full text-center shadow-2xl"
          >
            <QRCodeSVG
              value={PAGE_URL}
              size={180}
              level="H"
              className="mx-auto"
              bgColor="#ffffff"
              fgColor="#0a0a0a"
            />
            <p className="mt-4 text-sm text-neutral-500 font-medium">
              Scan to connect
            </p>
            <button
              onClick={onClose}
              className="mt-4 w-full py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-sm font-medium transition-colors"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── City Filter Pill ────────────────────────────────────────
function CityFilterPills({ active, onChange }: { active: CityFilter; onChange: (c: CityFilter) => void }) {
  const pills: { label: string; value: CityFilter }[] = [
    { label: "All", value: "all" },
    { label: "Marrakech", value: "Marrakech" },
    { label: "Tanger", value: "Tanger" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="flex gap-2 justify-center mb-6"
    >
      {pills.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className="relative px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
          style={{
            background: active === value ? "rgba(255,255,255,0.12)" : "transparent",
            color: active === value ? "#fff" : "rgba(255,255,255,0.35)",
            border: `1px solid ${active === value ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.06)"}`,
          }}
        >
          {label}
          {active === value && (
            <motion.div
              layoutId="city-filter-active"
              className="absolute inset-0 rounded-full border border-white/20"
              transition={{ duration: 0.25 }}
            />
          )}
        </button>
      ))}
    </motion.div>
  );
}

// ─── Main Page ───────────────────────────────────────────────
export default function LifestyleGroupCard() {
  const [qrOpen, setQrOpen] = useState(false);
  const [cityFilter, setCityFilter] = useState<CityFilter>("all");

  const filteredVenues = useMemo(
    () => cityFilter === "all" ? VENUES : VENUES.filter((v) => v.city === cityFilter),
    [cityFilter]
  );

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Nommos Group – Marrakech & Tanger",
          text: "Discover the best venues in Marrakech & Tanger",
          url: PAGE_URL,
        });
      } catch {}
    } else {
      await navigator.clipboard.writeText(PAGE_URL);
    }
  };

  const handleDownloadVCard = () => {
    downloadVCard({
      firstName: "Nommos",
      lastName: "Group",
      company: "Nommos Group – Marrakech & Tanger",
      phone: GROUP_PHONE,
      email: GROUP_EMAIL,
      website: GROUP_WEBSITE,
      nfcPageUrl: PAGE_URL,
      note: "Nommos Beach · Nommos Marrakech · Nommos Marina Bay · Lalala · 555 Marrakech · 555 Tanger · Secret Room · Sky5 Tanger · Sky5 Marrakech · Famous Beach · Senses · Le Petit Versailles",
    });
  };

  return (
    <CardLayout>
      <div className="min-h-screen relative overflow-hidden" style={{ background: "#06060a" }}>
        {/* Ambient glows */}
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(168,130,255,0.06) 0%, transparent 70%)" }} />
        <div className="absolute bottom-[-100px] right-[-100px] w-[350px] h-[350px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(56,189,248,0.04) 0%, transparent 70%)" }} />

        <div className="relative z-10 max-w-md mx-auto px-5 py-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="w-[72px] h-[72px] mx-auto mb-5 rounded-2xl flex items-center justify-center" style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(20px)",
            }}>
              <span className="text-[22px] font-bold text-white/90 tracking-tighter">N</span>
            </div>
            <h1 className="text-[22px] font-bold text-white tracking-tight">
              {GROUP_NAME}
            </h1>
            <p className="text-white/30 text-xs mt-1.5 tracking-[0.2em] uppercase font-light">
              {GROUP_TAGLINE}
            </p>
          </motion.div>

          {/* City Filter */}
          <CityFilterPills active={cityFilter} onChange={setCityFilter} />

          {/* Venues count */}
          <motion.p
            key={cityFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-white/20 text-[10px] uppercase tracking-widest text-center mb-4 font-light"
          >
            {filteredVenues.length} venue{filteredVenues.length > 1 ? "s" : ""}
          </motion.p>

          {/* Venues */}
          <div className="space-y-2.5">
            <AnimatePresence mode="popLayout">
              {filteredVenues.map((venue, i) => (
                <VenueCard key={venue.id} venue={venue} index={i} />
              ))}
            </AnimatePresence>
          </div>

          {/* Divider */}
          <div className="my-8 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)" }} />

          {/* Quick Actions */}
          <div className="space-y-2.5">
            {/* Row 1: Call · WhatsApp · Email */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { href: `tel:${GROUP_PHONE.replace(/\s/g, "")}`, icon: Phone, label: "Call", color: "#34d399" },
                { href: `https://wa.me/${GROUP_WHATSAPP}`, icon: MessageCircle, label: "WhatsApp", color: "#25D366" },
                { href: `mailto:${GROUP_EMAIL}`, icon: Mail, label: "Email", color: "#818cf8" },
              ].map(({ href, icon: Icon, label, color }) => (
                <a
                  key={label}
                  href={href}
                  target={label === "WhatsApp" ? "_blank" : undefined}
                  rel={label === "WhatsApp" ? "noopener noreferrer" : undefined}
                  className="flex flex-col items-center gap-1.5 py-3 rounded-2xl transition-all duration-200 hover:scale-[1.02]"
                  style={{
                    background: `${color}08`,
                    border: `1px solid ${color}15`,
                  }}
                >
                  <Icon size={18} style={{ color: `${color}cc` }} />
                  <span className="text-white/50 text-[10px] font-medium">{label}</span>
                </a>
              ))}
            </div>

            {/* vCard */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleDownloadVCard}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-200"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)",
                color: "#06060a",
              }}
            >
              <Download size={16} />
              Save Contact
            </motion.button>

            {/* Row 2: QR · Share */}
            <div className="grid grid-cols-2 gap-2">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setQrOpen(true)}
                className="flex items-center justify-center gap-2 py-3 rounded-2xl text-white/60 text-sm font-medium transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <QrCode size={16} />
                QR Code
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleShare}
                className="flex items-center justify-center gap-2 py-3 rounded-2xl text-white/60 text-sm font-medium transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <Share2 size={16} />
                Share
              </motion.button>
            </div>
          </div>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center text-[9px] text-white/15 mt-10 tracking-[0.25em] uppercase font-light"
          >
            Powered by IWASP
          </motion.p>
        </div>

        <QRModal open={qrOpen} onClose={() => setQrOpen(false)} />
      </div>
    </CardLayout>
  );
}
