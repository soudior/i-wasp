/**
 * Adventures Wheels — Premium NFC Landing Page
 * Mobile-first, WhatsApp-optimized conversion page.
 */

import { useState, useMemo } from "react";
import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Phone,
  MessageCircle,
  Instagram,
  Facebook,
  MapPin,
  Star,
  Clock,
  Mountain,
  Zap,
  Bike,
  Users,
  Award,
  Shield,
  Globe,
} from "lucide-react";

import heroQuad from "@/assets/adventures/hero-quad.jpg";
import expQuad from "@/assets/adventures/exp-quad.jpg";
import expEnduro from "@/assets/adventures/exp-enduro.jpg";
import expMoby from "@/assets/adventures/exp-moby.jpg";
import gal1 from "@/assets/adventures/gal-1.jpg";
import gal2 from "@/assets/adventures/gal-2.jpg";
import gal3 from "@/assets/adventures/gal-3.jpg";
import gal4 from "@/assets/adventures/gal-4.jpg";

// ─────────────────────────────────────────────────────────────
// CONFIG — Tout est éditable ici
// ─────────────────────────────────────────────────────────────
const CONFIG = {
  brand: "Adventures Wheels",
  tagline: {
    fr: "Vis l'Atlas autrement",
    en: "Live the Atlas your way",
    es: "Vive el Atlas de otra manera",
  },
  subtitle: {
    fr: "Randonnées quad, moto enduro et mobylette · Agafay & Atlas",
    en: "Quad, enduro & moped tours · Agafay & Atlas",
    es: "Excursiones en quad, enduro y ciclomotor · Agafay y Atlas",
  },
  whatsapp:
    "https://wa.me/212667038588?text=Bonjour%2C%20je%20souhaite%20réserver%20une%20randonnée",
  phone: "+212667038588",
  instagram: "https://www.instagram.com/adventureswheels.marrakech/",
  facebook:
    "https://www.facebook.com/adventurewheelsquadenduromarrakech",
  googleReview: "https://g.page/r/", // À remplacer par le lien de la fiche Google
  location: "Agafay · Atlas · Marrakech",
};

// ─────────────────────────────────────────────────────────────
// i18n minimal
// ─────────────────────────────────────────────────────────────
const T = {
  fr: {
    bookWhatsapp: "Réserver sur WhatsApp",
    call: "Appeler",
    trust: ["+2 000 aventuriers", "Guides locaux experts", "Matériel haut de gamme", "Note Google 5★"],
    experiences: "Nos expériences",
    expSub: "Choisis ton terrain de jeu",
    book: "Réserver",
    seminar: "Séminaire & Team Building",
    seminarText:
      "Offrez à votre équipe une aventure mémorable dans l'Atlas. Formules sur-mesure pour groupes et entreprises.",
    quote: "Demander un devis",
    gallery: "L'aventure en images",
    reviews: "Ils ont vécu l'aventure",
    leaveReview: "Laisser un avis Google",
    followUs: "Suivez-nous",
    rights: "Tous droits réservés",
    duration: "Durée",
    levelAll: "Tous niveaux",
    levelPro: "Pilotes confirmés",
    levelChill: "À ton rythme",
    expList: [
      {
        title: "Quad",
        desc: "Sensations garanties sur les pistes du désert d'Agafay.",
        duration: "1h à 4h",
        level: "Tous niveaux",
        icon: Mountain,
        img: expQuad,
      },
      {
        title: "Moto Enduro",
        desc: "Pure adrénaline sur les sentiers techniques de l'Atlas.",
        duration: "Demi-journée à 3 jours",
        level: "Pilotes confirmés",
        icon: Zap,
        img: expEnduro,
      },
      {
        title: "Mobylette",
        desc: "Découvre les villages berbères à ton rythme, en toute liberté.",
        duration: "2h à journée",
        level: "Débutants bienvenus",
        icon: Bike,
        img: expMoby,
      },
    ],
    reviewsList: [
      {
        name: "Julien M.",
        text: "Expérience incroyable dans l'Atlas, guide au top, matériel impec. À refaire !",
      },
      {
        name: "Sofia R.",
        text: "Le coucher de soleil sur Agafay en quad… inoubliable. Merci à toute l'équipe.",
      },
      {
        name: "Karim L.",
        text: "Pro, ponctuels, passionnés. Le top à Marrakech pour les amateurs de sensations.",
      },
    ],
  },
  en: {
    bookWhatsapp: "Book on WhatsApp",
    call: "Call",
    trust: ["+2,000 adventurers", "Expert local guides", "Premium gear", "5★ Google rated"],
    experiences: "Our experiences",
    expSub: "Pick your playground",
    book: "Book",
    seminar: "Corporate & Team Building",
    seminarText:
      "Give your team an unforgettable Atlas adventure. Custom packages for groups and companies.",
    quote: "Request a quote",
    gallery: "Adventure in pictures",
    reviews: "They lived the adventure",
    leaveReview: "Leave a Google review",
    followUs: "Follow us",
    rights: "All rights reserved",
    duration: "Duration",
    levelAll: "All levels",
    levelPro: "Experienced riders",
    levelChill: "At your pace",
    expList: [
      {
        title: "Quad",
        desc: "Pure thrills on the tracks of Agafay desert.",
        duration: "1h to 4h",
        level: "All levels",
        icon: Mountain,
        img: expQuad,
      },
      {
        title: "Enduro Bike",
        desc: "Adrenaline on the technical trails of the Atlas.",
        duration: "Half-day to 3 days",
        level: "Experienced",
        icon: Zap,
        img: expEnduro,
      },
      {
        title: "Moped",
        desc: "Discover Berber villages at your own pace.",
        duration: "2h to full day",
        level: "Beginners welcome",
        icon: Bike,
        img: expMoby,
      },
    ],
    reviewsList: [
      { name: "Julien M.", text: "Incredible experience, top guide, perfect gear. Will be back!" },
      { name: "Sofia R.", text: "Sunset on Agafay by quad… unforgettable. Thank you team." },
      { name: "Karim L.", text: "Pro, punctual, passionate. The best in Marrakech for thrill lovers." },
    ],
  },
  es: {
    bookWhatsapp: "Reservar por WhatsApp",
    call: "Llamar",
    trust: ["+2 000 aventureros", "Guías locales expertos", "Equipo premium", "5★ en Google"],
    experiences: "Nuestras experiencias",
    expSub: "Elige tu terreno",
    book: "Reservar",
    seminar: "Empresas & Team Building",
    seminarText:
      "Ofrece a tu equipo una aventura inolvidable en el Atlas. Paquetes a medida.",
    quote: "Solicitar presupuesto",
    gallery: "La aventura en imágenes",
    reviews: "Vivieron la aventura",
    leaveReview: "Dejar una reseña en Google",
    followUs: "Síguenos",
    rights: "Todos los derechos reservados",
    duration: "Duración",
    levelAll: "Todos los niveles",
    levelPro: "Pilotos expertos",
    levelChill: "A tu ritmo",
    expList: [
      {
        title: "Quad",
        desc: "Sensaciones puras en las pistas del desierto de Agafay.",
        duration: "1h a 4h",
        level: "Todos los niveles",
        icon: Mountain,
        img: expQuad,
      },
      {
        title: "Moto Enduro",
        desc: "Adrenalina pura en los senderos del Atlas.",
        duration: "Medio día a 3 días",
        level: "Pilotos expertos",
        icon: Zap,
        img: expEnduro,
      },
      {
        title: "Ciclomotor",
        desc: "Descubre los pueblos bereberes a tu ritmo.",
        duration: "2h a día completo",
        level: "Principiantes bienvenidos",
        icon: Bike,
        img: expMoby,
      },
    ],
    reviewsList: [
      { name: "Julien M.", text: "Experiencia increíble, guía top, equipo perfecto. ¡Volveré!" },
      { name: "Sofia R.", text: "Atardecer en Agafay en quad… inolvidable. Gracias al equipo." },
      { name: "Karim L.", text: "Profesionales, puntuales, apasionados. Lo mejor de Marrakech." },
    ],
  },
};

type Lang = "fr" | "en" | "es";

const galleryImages = [gal1, gal2, gal3, gal4, expQuad, expEnduro];

export default function AdventuresWheels() {
  const [lang, setLang] = useState<Lang>("fr");
  const t = T[lang];
  const tagline = CONFIG.tagline[lang];
  const subtitle = CONFIG.subtitle[lang];

  const trustIcons = useMemo(() => [Users, Shield, Award, Star], []);

  useEffect(() => {
    document.title = "Randonnée quad Marrakech · Adventures Wheels";
    const setMeta = (name: string, content: string) => {
      let m = document.querySelector(`meta[name="${name}"]`);
      if (!m) {
        m = document.createElement("meta");
        m.setAttribute("name", name);
        document.head.appendChild(m);
      }
      m.setAttribute("content", content);
    };
    setMeta(
      "description",
      "Randonnée quad, moto enduro et mobylette à Marrakech, désert d'Agafay et Atlas. Réservation directe sur WhatsApp.",
    );
    setMeta("theme-color", "#0D0D0D");
  }, []);

  const buildBookMessage = (exp: string) =>
    `https://wa.me/212667038588?text=${encodeURIComponent(
      `Bonjour, je souhaite réserver une randonnée ${exp}.`,
    )}`;

  const quoteLink = `https://wa.me/212667038588?text=${encodeURIComponent(
    "Bonjour, je souhaite un devis pour un séminaire / team building.",
  )}`;

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F5F1EA] font-sans antialiased">


      {/* ─── Language Switcher ─── */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-1 bg-black/50 backdrop-blur-md rounded-full px-2 py-1 border border-white/10">
        <Globe className="w-3.5 h-3.5 text-[#E8732A] ml-1" />
        {(["fr", "en", "es"] as Lang[]).map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={`px-2 py-0.5 text-xs font-semibold rounded-full transition ${
              lang === l ? "bg-[#E8732A] text-black" : "text-white/70"
            }`}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      {/* ─── HERO ─── */}
      <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
        <img
          src={heroQuad}
          alt="Quad dans le désert d'Agafay"
          className="absolute inset-0 w-full h-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black" />

        {/* Logo */}
        <div className="absolute top-6 left-5 z-10 flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-[#E8732A] flex items-center justify-center shadow-lg shadow-[#E8732A]/30">
            <Mountain className="w-5 h-5 text-black" />
          </div>
          <div className="leading-tight">
            <div className="font-black text-sm tracking-wider uppercase">
              Adventures
            </div>
            <div className="text-[10px] tracking-[0.3em] text-[#D9C4A3] -mt-0.5">
              WHEELS
            </div>
          </div>
        </div>

        {/* Hero content */}
        <div className="absolute inset-x-0 bottom-0 px-6 pb-28 pt-20 flex flex-col items-start z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4 max-w-md"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-[#E8732A]/40">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E8732A] animate-pulse" />
              <span className="text-[11px] tracking-[0.2em] uppercase text-[#D9C4A3]">
                Marrakech · Agafay · Atlas
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl font-black leading-[0.95] tracking-tight">
              {tagline}
            </h1>
            <p className="text-base text-white/80 leading-relaxed">{subtitle}</p>

            <a
              href={CONFIG.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center justify-center gap-3 w-full bg-[#E8732A] hover:bg-[#FF8537] text-black font-bold text-base py-4 px-6 rounded-2xl shadow-[0_10px_40px_-10px_rgba(232,115,42,0.6)] transition-all active:scale-[0.98]"
            >
              <MessageCircle className="w-5 h-5" />
              {t.bookWhatsapp}
            </a>

            <a
              href={`tel:${CONFIG.phone}`}
              className="inline-flex items-center justify-center gap-2 w-full bg-white/5 backdrop-blur-md border border-white/15 text-white font-semibold text-sm py-3 px-6 rounded-2xl transition-all active:scale-[0.98]"
            >
              <Phone className="w-4 h-4" />
              {t.call} · {CONFIG.phone}
            </a>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
          <div className="w-6 h-10 rounded-full border border-white/30 flex items-start justify-center p-1.5">
            <div className="w-1 h-2 rounded-full bg-white/60 animate-bounce" />
          </div>
        </div>
      </section>

      {/* ─── TRUST BAND ─── */}
      <section className="px-5 py-8 border-y border-white/5 bg-black">
        <div className="grid grid-cols-2 gap-4">
          {t.trust.map((label, i) => {
            const Icon = trustIcons[i];
            return (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-2.5"
              >
                <div className="w-9 h-9 rounded-full bg-[#E8732A]/15 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-[#E8732A]" />
                </div>
                <span className="text-xs font-medium text-white/80 leading-tight">
                  {label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ─── EXPÉRIENCES ─── */}
      <section className="px-5 py-16">
        <div className="mb-8">
          <div className="text-[#E8732A] text-xs tracking-[0.3em] uppercase font-bold mb-2">
            01 · {t.experiences}
          </div>
          <h2 className="text-3xl font-black leading-tight">{t.expSub}</h2>
        </div>

        <div className="space-y-5">
          {t.expList.map((exp, i) => {
            const Icon = exp.icon;
            return (
              <motion.div
                key={exp.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group relative rounded-3xl overflow-hidden bg-white/[0.03] backdrop-blur-sm border border-white/10"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={exp.img}
                    alt={exp.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-[#E8732A] flex items-center justify-center shadow-lg">
                    <Icon className="w-5 h-5 text-black" />
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-2xl font-black">{exp.title}</h3>
                    <span className="text-[10px] tracking-widest uppercase text-[#D9C4A3]">
                      {exp.level}
                    </span>
                  </div>
                  <p className="text-sm text-white/70 leading-relaxed">{exp.desc}</p>

                  <div className="flex items-center gap-2 text-xs text-white/50">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{t.duration} : {exp.duration}</span>
                  </div>

                  <a
                    href={buildBookMessage(exp.title)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center justify-center gap-2 w-full bg-[#E8732A] hover:bg-[#FF8537] text-black font-bold text-sm py-3.5 rounded-xl transition active:scale-[0.98]"
                  >
                    <MessageCircle className="w-4 h-4" />
                    {t.book}
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ─── SÉMINAIRE B2B ─── */}
      <section className="px-5 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden p-8 bg-gradient-to-br from-[#E8732A]/20 via-[#D9C4A3]/5 to-transparent border border-[#E8732A]/30 backdrop-blur-sm"
        >
          <div className="text-[#E8732A] text-xs tracking-[0.3em] uppercase font-bold mb-3">
            02 · B2B
          </div>
          <h2 className="text-3xl font-black leading-tight mb-3">{t.seminar}</h2>
          <p className="text-sm text-white/70 leading-relaxed mb-6">
            {t.seminarText}
          </p>
          <a
            href={quoteLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full bg-white text-black font-bold text-sm py-4 rounded-xl transition active:scale-[0.98]"
          >
            <Users className="w-4 h-4" />
            {t.quote}
          </a>
        </motion.div>
      </section>

      {/* ─── GALERIE ─── */}
      <section className="px-5 py-12">
        <div className="mb-6">
          <div className="text-[#E8732A] text-xs tracking-[0.3em] uppercase font-bold mb-2">
            03 · Gallery
          </div>
          <h2 className="text-3xl font-black leading-tight">{t.gallery}</h2>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {galleryImages.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={`relative rounded-2xl overflow-hidden ${
                i === 0 ? "col-span-2 aspect-[16/10]" : "aspect-square"
              }`}
            >
              <img
                src={img}
                alt={`Aventure ${i + 1}`}
                loading="lazy"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── AVIS ─── */}
      <section className="px-5 py-16 bg-gradient-to-b from-transparent to-[#E8732A]/5">
        <div className="mb-6">
          <div className="text-[#E8732A] text-xs tracking-[0.3em] uppercase font-bold mb-2">
            04 · Reviews
          </div>
          <h2 className="text-3xl font-black leading-tight">{t.reviews}</h2>
          <div className="flex items-center gap-2 mt-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#E8732A] text-[#E8732A]" />
              ))}
            </div>
            <span className="text-sm text-white/70">5.0 · Google</span>
          </div>
        </div>

        <div className="space-y-3">
          {t.reviewsList.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl bg-white/[0.04] backdrop-blur-sm border border-white/10 p-5"
            >
              <div className="flex mb-2">
                {[...Array(5)].map((_, j) => (
                  <Star
                    key={j}
                    className="w-3.5 h-3.5 fill-[#E8732A] text-[#E8732A]"
                  />
                ))}
              </div>
              <p className="text-sm text-white/80 leading-relaxed mb-3">
                "{r.text}"
              </p>
              <div className="text-xs font-semibold text-[#D9C4A3]">— {r.name}</div>
            </motion.div>
          ))}
        </div>

        <a
          href={CONFIG.googleReview}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center justify-center gap-2 w-full bg-white text-black font-bold text-sm py-4 rounded-xl transition active:scale-[0.98]"
        >
          <Star className="w-4 h-4 fill-current" />
          {t.leaveReview}
        </a>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="px-5 pt-12 pb-32 border-t border-white/5 bg-black">
        <div className="text-center space-y-5">
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#E8732A] flex items-center justify-center">
              <Mountain className="w-4 h-4 text-black" />
            </div>
            <span className="font-black tracking-wider uppercase text-sm">
              Adventures Wheels
            </span>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-white/60">
            <MapPin className="w-3.5 h-3.5 text-[#E8732A]" />
            {CONFIG.location}
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <a
              href={CONFIG.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#E8732A] hover:text-black transition"
            >
              <Instagram className="w-4.5 h-4.5" />
            </a>
            <a
              href={CONFIG.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#E8732A] hover:text-black transition"
            >
              <Facebook className="w-4.5 h-4.5" />
            </a>
            <a
              href={`tel:${CONFIG.phone}`}
              aria-label="Phone"
              className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#E8732A] hover:text-black transition"
            >
              <Phone className="w-4.5 h-4.5" />
            </a>
          </div>

          <div className="pt-4 text-[10px] text-white/30 tracking-widest uppercase">
            © {new Date().getFullYear()} Adventures Wheels · {t.rights}
          </div>
        </div>
      </footer>

      {/* ─── FLOATING WHATSAPP CTA ─── */}
      <a
        href={CONFIG.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 left-5 right-5 z-50 flex items-center justify-center gap-2.5 bg-[#25D366] text-white font-bold text-base py-4 rounded-2xl shadow-[0_15px_40px_-10px_rgba(37,211,102,0.7)] active:scale-[0.98] transition-all"
        style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom, 0px))" }}
      >
        <MessageCircle className="w-5 h-5" />
        {t.bookWhatsapp}
      </a>
    </div>
  );
}
