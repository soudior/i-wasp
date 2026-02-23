/**
 * Lifestyle Group NFC Card - Premium "Link in Bio" for multi-venue property
 * Route: /card/lifestyle-group
 * 
 * Venues:
 * - Nommos Beach – Resort & Pool Club Restaurant
 * - 555 Marrakech – Famous Club
 * - 555 Tanger – Marina Bay
 * - Secret Room Marrakech
 * - Sky5 Tanger – Marina Bay
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Globe, Instagram, MapPin, Phone, Mail, Download, 
  ChevronRight, ExternalLink, QrCode, X
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
  logo: string;
  website: string;
  instagram: string;
  googleMaps: string;
  gradient: string;
}

// ─── Data ────────────────────────────────────────────────────
const GROUP_NAME = "Nommos Group";
const GROUP_TAGLINE = "Marrakech & Tanger";
const GROUP_PHONE = "+212 5 00 00 00 00";
const GROUP_EMAIL = "contact@nommos.ma";
const GROUP_WEBSITE = "https://www.nommos.ma";

const VENUES: Venue[] = [
  {
    id: "nommos-beach",
    name: "Nommos Beach",
    subtitle: "Resort & Pool Club Restaurant",
    logo: nommosBeachLogo,
    website: "https://www.nommosbeachresort.com",
    instagram: "https://www.instagram.com/nommosbeach",
    googleMaps: "https://maps.app.goo.gl/nommosbeach",
    gradient: "from-sky-900/80 to-cyan-800/60",
  },
  {
    id: "nommos-marrakech",
    name: "Nommos Marrakech",
    subtitle: "Restaurant & Lounge",
    logo: nommosMarrakechLogo,
    website: "https://www.nommos.ma",
    instagram: "https://www.instagram.com/nommosmarrakech",
    googleMaps: "https://maps.app.goo.gl/nommosmarrakech",
    gradient: "from-stone-900/80 to-neutral-800/60",
  },
  {
    id: "nommos-marina-bay",
    name: "Nommos Marina Bay",
    subtitle: "Tanger",
    logo: nommosMarinaBayLogo,
    website: "https://www.nommostanger.com",
    instagram: "https://www.instagram.com/nommostanger",
    googleMaps: "https://maps.app.goo.gl/nommostanger",
    gradient: "from-teal-900/80 to-emerald-800/60",
  },
  {
    id: "lalala",
    name: "Lalala",
    subtitle: "Restaurant",
    logo: lalalaLogo,
    website: "https://www.lalalarestaurant.com",
    instagram: "https://www.instagram.com/lalalarestaurant",
    googleMaps: "https://maps.app.goo.gl/lalala",
    gradient: "from-rose-900/80 to-pink-800/60",
  },
  {
    id: "555marrakech",
    name: "555 Marrakech",
    subtitle: "Famous Club",
    logo: club555MrkLogo,
    website: "https://www.555marrakech.com",
    instagram: "https://www.instagram.com/555marrakech",
    googleMaps: "https://maps.app.goo.gl/555marrakech",
    gradient: "from-purple-900/80 to-fuchsia-800/60",
  },
  {
    id: "555tanger",
    name: "555 Tanger",
    subtitle: "Marina Bay",
    logo: club555TngLogo,
    website: "https://www.555tanger.com",
    instagram: "https://www.instagram.com/555tanger",
    googleMaps: "https://maps.app.goo.gl/555tanger",
    gradient: "from-blue-900/80 to-indigo-800/60",
  },
  {
    id: "secretroom",
    name: "Secret Room",
    subtitle: "Marrakech",
    logo: secretRoomLogo,
    website: "https://www.secretroommarrakech.com",
    instagram: "https://www.instagram.com/secretroommarrakech",
    googleMaps: "https://maps.app.goo.gl/secretroom",
    gradient: "from-neutral-900/80 to-zinc-800/60",
  },
  {
    id: "sky5-tanger",
    name: "Sky5 Tanger",
    subtitle: "Marina Bay",
    logo: sky5MarinaBayLogo,
    website: "https://www.skyfivetanger.com",
    instagram: "https://www.instagram.com/sky5tanger",
    googleMaps: "https://maps.app.goo.gl/sky5tanger",
    gradient: "from-amber-900/80 to-orange-800/60",
  },
  {
    id: "sky5-marrakech",
    name: "Sky5 Marrakech",
    subtitle: "Rooftop & Lounge",
    logo: sky5RooftopLogo,
    website: "https://www.skyfivemarrakech.com",
    instagram: "https://www.instagram.com/sky5marrakech",
    googleMaps: "https://maps.app.goo.gl/sky5marrakech",
    gradient: "from-violet-900/80 to-purple-800/60",
  },
  {
    id: "famous-beach",
    name: "Famous Beach",
    subtitle: "Pool · Day Club · Restaurant",
    logo: famousBeachLogo,
    website: "https://famousbeachmarrakech.com",
    instagram: "https://www.instagram.com/famousbeachmarrakech",
    googleMaps: "https://maps.app.goo.gl/Your1stRealLink",
    gradient: "from-sky-800/80 to-teal-700/60",
  },
  {
    id: "senses",
    name: "Senses",
    subtitle: "Café · Restaurant",
    logo: sensesLogo,
    website: "https://www.sensesmarrakech.com",
    instagram: "https://www.instagram.com/sensesmarrakech",
    googleMaps: "https://maps.app.goo.gl/YourSensesLink",
    gradient: "from-stone-800/80 to-neutral-700/60",
  },
  {
    id: "le-petit-versailles",
    name: "Le Petit Versailles",
    subtitle: "Restaurant festif · Tanger",
    logo: lePetitVersaillesLogo,
    website: "https://leptiversailles.com",
    instagram: "https://www.instagram.com/lepetittanger",
    googleMaps: "https://maps.app.goo.gl/YourLPVLink",
    gradient: "from-emerald-900/80 to-green-800/60",
  },
];

const PAGE_URL = "https://i-wasp.lovable.app/card/lifestyle-group";

// ─── Venue Card ──────────────────────────────────────────────
function VenueCard({ venue, index }: { venue: Venue; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index, duration: 0.4 }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left"
      >
        <div className={`
          relative overflow-hidden rounded-2xl border border-white/10 
          bg-gradient-to-br ${venue.gradient}
          backdrop-blur-xl transition-all duration-300
          ${expanded ? "ring-1 ring-white/20" : "hover:ring-1 hover:ring-white/10"}
        `}>
          {/* Main row */}
          <div className="flex items-center gap-4 p-4">
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-white/5 border border-white/10 flex-shrink-0">
              <img 
                src={venue.logo} 
                alt={venue.name} 
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold text-base tracking-tight truncate">
                {venue.name}
              </h3>
              <p className="text-white/50 text-xs mt-0.5">{venue.subtitle}</p>
            </div>
            <motion.div
              animate={{ rotate: expanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight size={18} className="text-white/40" />
            </motion.div>
          </div>
        </div>
      </button>

      {/* Expanded links */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="flex gap-2 px-2 pt-2 pb-1">
              <a
                href={venue.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium transition-colors"
              >
                <Globe size={14} />
                Site
              </a>
              <a
                href={venue.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium transition-colors"
              >
                <Instagram size={14} />
                Instagram
              </a>
              <a
                href={venue.googleMaps}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium transition-colors"
              >
                <MapPin size={14} />
                Maps
              </a>
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-8 max-w-xs w-full text-center"
          >
            <QRCodeSVG
              value={PAGE_URL}
              size={200}
              level="H"
              className="mx-auto"
              bgColor="#ffffff"
              fgColor="#1a1a1a"
            />
            <p className="mt-4 text-sm text-neutral-500 font-medium">
              Scannez pour accéder
            </p>
            <button
              onClick={onClose}
              className="mt-4 w-full py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-sm font-medium transition-colors"
            >
              Fermer
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Main Page ───────────────────────────────────────────────
export default function LifestyleGroupCard() {
  const [qrOpen, setQrOpen] = useState(false);

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
      <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-radial from-purple-500/8 via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-radial from-cyan-500/5 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-md mx-auto px-5 py-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            {/* Group icon */}
            <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center backdrop-blur-xl">
              <span className="text-2xl font-bold text-white tracking-tighter">N</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {GROUP_NAME}
            </h1>
            <p className="text-white/40 text-sm mt-1 tracking-widest uppercase">
              {GROUP_TAGLINE}
            </p>
          </motion.div>

          {/* Venues */}
          <div className="space-y-3">
            {VENUES.map((venue, i) => (
              <VenueCard key={venue.id} venue={venue} index={i} />
            ))}
          </div>

          {/* Divider */}
          <div className="my-8 border-t border-white/5" />

          {/* Actions */}
          <div className="space-y-3">
            {/* Contact quick actions */}
            <div className="grid grid-cols-2 gap-3">
              <a
                href={`tel:${GROUP_PHONE.replace(/\s/g, "")}`}
                className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm font-medium transition-colors"
              >
                <Phone size={16} className="text-white/60" />
                Appeler
              </a>
              <a
                href={`mailto:${GROUP_EMAIL}`}
                className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm font-medium transition-colors"
              >
                <Mail size={16} className="text-white/60" />
                Email
              </a>
            </div>

            {/* vCard download */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleDownloadVCard}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-white text-[#0a0a0a] text-sm font-semibold hover:bg-white/90 transition-colors"
            >
              <Download size={16} />
              Ajouter au contact
            </motion.button>

            {/* QR Code */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setQrOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm font-medium transition-colors"
            >
              <QrCode size={16} className="text-white/60" />
              QR Code
            </motion.button>
          </div>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center text-[10px] text-white/20 mt-10 tracking-widest uppercase"
          >
            Powered by IWASP
          </motion.p>
        </div>

        <QRModal open={qrOpen} onClose={() => setQrOpen(false)} />
      </div>
    </CardLayout>
  );
}
