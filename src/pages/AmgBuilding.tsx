import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Phone,
  MessageCircle,
  Mail,
  Calendar,
  MapPin,
  Instagram,
  Globe,
  Download,
  UserPlus,
  Building2,
  Sparkles,
  ShieldCheck,
  Clock,
  Star,
  ArrowRight,
  QrCode,
  FileText,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

/* ============================================================
   CONFIG — Modifie ici les infos du commercial et des projets
   ============================================================ */
const CONFIG = {
  brand: {
    name: "AMG BUILDING",
    tagline: "Promoteur & Constructeur immobilier d'exception — Marrakech",
    website: "https://amg-building.com",
    instagram: "https://instagram.com/amgbuilding",
    address: "Marrakech, Maroc",
    mapsUrl: "https://maps.google.com/?q=AMG+Building+Marrakech",
  },
  agent: {
    name: "Nom du Commercial",
    role: "Conseiller Commercial Immobilier Haut de Gamme",
    photo: "", // URL de la photo professionnelle
    phone: "+212600000000",
    whatsapp: "212600000000",
    email: "commercial@amg-building.com",
    calendar: "https://calendly.com/amg-building",
  },
  projects: [
    {
      name: "M-ROAD Residence",
      location: "Marrakech",
      typology: "Appartements & Duplex",
      image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
    },
    {
      name: "Le Petit Ambassadeur",
      location: "Marrakech",
      typology: "Studios & Appartements",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    },
    {
      name: "Ambassadeurs 6 & 7",
      location: "Marrakech",
      typology: "Appartements premium",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    },
    {
      name: "Ambassadeurs 5",
      location: "Marrakech",
      typology: "Villas & Duplex d'exception",
      image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80",
    },
  ],
  testimonials: [
    {
      name: "Karim B.",
      role: "Investisseur",
      text: "Service impeccable, accompagnement haut de gamme et transparence totale. Je recommande.",
    },
    {
      name: "Sofia L.",
      role: "Acquéreuse villa",
      text: "J'ai trouvé la villa de mes rêves grâce à un suivi personnalisé du début à la fin.",
    },
  ],
};

const WA_MESSAGE = encodeURIComponent(
  "Bonjour, je viens de scanner votre carte NFC AMG Building. Je souhaite avoir plus d'informations sur vos projets immobiliers à Marrakech."
);

const leadSchema = z.object({
  name: z.string().trim().min(2, "Nom requis").max(100),
  phone: z.string().trim().min(6, "Téléphone requis").max(30),
  budget: z.string().trim().max(50).optional(),
  property_type: z.string().trim().max(50).optional(),
  objective: z.string().trim().max(50).optional(),
  message: z.string().trim().max(1000).optional(),
});

/* ============================================================
   vCard generation
   ============================================================ */
function downloadVCard() {
  const { agent, brand } = CONFIG;
  const vcard = `BEGIN:VCARD
VERSION:3.0
N:;${agent.name};;;
FN:${agent.name}
ORG:${brand.name}
TITLE:${agent.role}
TEL;TYPE=CELL:${agent.phone}
EMAIL:${agent.email}
URL:${brand.website}
ADR;TYPE=WORK:;;${brand.address};;;;
END:VCARD`;
  const blob = new Blob([vcard], { type: "text/vcard" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${agent.name.replace(/\s+/g, "_")}.vcf`;
  a.click();
  URL.revokeObjectURL(url);
  toast.success("Contact enregistré sur votre téléphone");
}

/* ============================================================
   Page
   ============================================================ */
export default function AmgBuilding() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    budget: "",
    property_type: "",
    objective: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const initials = useMemo(() => {
    const [a, b] = CONFIG.agent.name.split(" ");
    return `${a?.[0] ?? ""}${b?.[0] ?? ""}`.toUpperCase();
  }, []);

  const tel = `tel:${CONFIG.agent.phone}`;
  const wa = `https://wa.me/${CONFIG.agent.whatsapp}?text=${WA_MESSAGE}`;
  const mail = `mailto:${CONFIG.agent.email}`;
  const rdv = CONFIG.agent.calendar;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = leadSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("amg_leads" as any).insert({
      name: parsed.data.name,
      phone: parsed.data.phone,
      budget: parsed.data.budget || null,
      property_type: parsed.data.property_type || null,
      objective: parsed.data.objective || null,
      message: parsed.data.message || null,
      source: "nfc",
    } as any);
    setSubmitting(false);
    if (error) {
      toast.error("Erreur lors de l'envoi. Réessayez.");
      return;
    }
    toast.success("Merci ! Je reviens vers vous très rapidement.");
    setForm({ name: "", phone: "", budget: "", property_type: "", objective: "", message: "" });
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white overflow-x-hidden">
      {/* SEO */}
      <title>{`${CONFIG.agent.name} — Conseiller AMG Building Marrakech`}</title>
      <meta
        name="description"
        content="Conseiller commercial AMG Building. Accédez aux projets immobiliers d'exception à Marrakech : villas, appartements et résidences haut de gamme."
      />

      {/* Ambient gold glow */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full bg-[#C9A961]/10 blur-[120px]" />
        <div className="absolute top-1/3 -right-32 w-[420px] h-[420px] rounded-full bg-[#C9A961]/5 blur-[140px]" />
      </div>

      <main className="relative z-10 max-w-md mx-auto px-5 pt-8 pb-32">
        {/* Logo / Brand */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#C9A961]" />
            <span className="text-[11px] font-light tracking-[0.4em] text-[#C9A961]">
              {CONFIG.brand.name}
            </span>
          </div>
          <p className="text-[10px] tracking-widest text-white/40 mt-1 uppercase">
            Marrakech · Real Estate
          </p>
        </motion.div>

        {/* HERO */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative"
        >
          <div
            className="rounded-3xl p-6 border border-white/10 backdrop-blur-xl"
            style={{
              background:
                "linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(201,169,97,0.04) 100%)",
            }}
          >
            {/* Photo */}
            <div className="relative flex justify-center mb-5">
              <div className="absolute inset-0 flex justify-center">
                <div className="w-32 h-32 rounded-full bg-[#C9A961]/30 blur-2xl" />
              </div>
              <div className="relative w-28 h-28 rounded-full overflow-hidden ring-2 ring-[#C9A961]/40 shadow-2xl">
                {CONFIG.agent.photo ? (
                  <img
                    src={CONFIG.agent.photo}
                    alt={CONFIG.agent.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] text-3xl font-light tracking-widest text-[#C9A961]">
                    {initials}
                  </div>
                )}
              </div>
            </div>

            <div className="text-center">
              <h1 className="text-2xl font-light tracking-tight text-white">
                {CONFIG.agent.name}
              </h1>
              <p className="text-[13px] text-[#C9A961] mt-1 tracking-wide">
                {CONFIG.agent.role}
              </p>
              <div className="my-5 h-px w-12 bg-gradient-to-r from-transparent via-[#C9A961]/60 to-transparent mx-auto" />
              <p className="text-[13px] leading-relaxed text-white/70 italic px-2">
                « Votre accès privilégié aux projets immobiliers d'exception à Marrakech. »
              </p>
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-2 gap-2.5 mt-6">
              <a
                href={tel}
                className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#C9A961] text-black text-sm font-medium hover:bg-[#d4b56e] transition active:scale-[0.98]"
              >
                <Phone className="w-4 h-4" /> Appeler
              </a>
              <a
                href={wa}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-white/[0.06] border border-white/10 text-white text-sm font-medium hover:bg-white/10 transition active:scale-[0.98]"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
              <button
                onClick={downloadVCard}
                className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-white/[0.06] border border-white/10 text-white text-sm font-medium hover:bg-white/10 transition active:scale-[0.98]"
              >
                <UserPlus className="w-4 h-4" /> Contact
              </button>
              <a
                href={rdv}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-white/[0.06] border border-white/10 text-white text-sm font-medium hover:bg-white/10 transition active:scale-[0.98]"
              >
                <Calendar className="w-4 h-4" /> RDV
              </a>
            </div>
          </div>
        </motion.section>

        {/* CRÉDIBILITÉ */}
        <Section title="Notre savoir-faire" delay={0.2}>
          <div className="grid grid-cols-1 gap-2.5">
            {[
              { icon: Building2, text: "Projets immobiliers haut de gamme à Marrakech" },
              { icon: Sparkles, text: "Villas, appartements, duplex et résidences premium" },
              { icon: ShieldCheck, text: "Accompagnement de A à Z, en toute confidentialité" },
              { icon: Star, text: "Conseil personnalisé et expérience client moderne" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08]"
              >
                <div className="w-9 h-9 rounded-xl bg-[#C9A961]/15 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-4 h-4 text-[#C9A961]" />
                </div>
                <p className="text-[13px] text-white/80 leading-snug">{item.text}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* POURQUOI ME CONTACTER */}
        <Section title="Pourquoi me contacter ?" delay={0.25}>
          <div className="p-5 rounded-2xl bg-gradient-to-br from-white/[0.05] to-transparent border border-white/[0.08]">
            <p className="text-[13.5px] leading-relaxed text-white/75">
              Je vous accompagne dans la sélection du bien le plus adapté à votre objectif :
              résidence principale, investissement locatif, villa d'exception ou projet
              patrimonial. Mon rôle est de vous faire gagner du temps, de sécuriser votre choix
              et de vous donner accès aux meilleures opportunités AMG Building.
            </p>
          </div>
        </Section>

        {/* PROJETS */}
        <Section title="Découvrir nos projets" delay={0.3}>
          <div className="grid grid-cols-1 gap-4">
            {CONFIG.projects.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl overflow-hidden border border-white/[0.08] bg-white/[0.03]"
              >
                <div className="relative h-40">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-base font-light text-white tracking-wide">{p.name}</h3>
                    <p className="text-[11px] text-[#C9A961] mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {p.location}
                    </p>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-[12px] text-white/60 mb-3">{p.typology}</p>
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={`${wa}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11.5px] py-2.5 rounded-lg bg-[#C9A961]/15 text-[#C9A961] text-center font-medium hover:bg-[#C9A961]/25 transition"
                    >
                      Disponibilités
                    </a>
                    <a
                      href={`${wa}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11.5px] py-2.5 rounded-lg bg-white/[0.06] border border-white/10 text-white/80 text-center font-medium hover:bg-white/10 transition flex items-center justify-center gap-1"
                    >
                      <FileText className="w-3 h-3" /> Brochure
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* FORMULAIRE */}
        <Section title="Vous cherchez un bien à Marrakech ?" delay={0.35}>
          <p className="text-[13px] text-white/60 mb-4 leading-relaxed">
            Envoyez-moi votre budget, votre objectif et le type de bien recherché. Je vous
            réponds avec une sélection personnalisée.
          </p>
          <form
            onSubmit={handleSubmit}
            className="space-y-2.5 p-5 rounded-2xl bg-white/[0.04] border border-white/[0.08]"
          >
            <Input
              placeholder="Nom complet *"
              value={form.name}
              onChange={(v) => setForm({ ...form, name: v })}
            />
            <Input
              placeholder="Téléphone *"
              type="tel"
              value={form.phone}
              onChange={(v) => setForm({ ...form, phone: v })}
            />
            <Input
              placeholder="Budget (ex: 3 000 000 MAD)"
              value={form.budget}
              onChange={(v) => setForm({ ...form, budget: v })}
            />
            <Select
              value={form.property_type}
              onChange={(v) => setForm({ ...form, property_type: v })}
              placeholder="Type de bien recherché"
              options={["Appartement", "Duplex", "Villa", "Studio", "Résidence", "Autre"]}
            />
            <Select
              value={form.objective}
              onChange={(v) => setForm({ ...form, objective: v })}
              placeholder="Objectif"
              options={[
                "Habiter",
                "Investir",
                "Location courte durée",
                "Villa personnelle",
              ]}
            />
            <textarea
              placeholder="Votre message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={3}
              maxLength={1000}
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#C9A961]/50"
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-[#C9A961] text-black text-sm font-semibold tracking-wide hover:bg-[#d4b56e] transition active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? "Envoi..." : "Recevoir ma sélection privée"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </Section>

        {/* PREUVE SOCIALE */}
        <Section title="Pourquoi nos clients nous choisissent" delay={0.4}>
          <div className="grid grid-cols-2 gap-2.5 mb-4">
            {[
              { icon: ShieldCheck, label: "Accompagnement pro" },
              { icon: Sparkles, label: "Conseil transparent" },
              { icon: Clock, label: "Réponse rapide" },
              { icon: Star, label: "Suivi personnalisé" },
            ].map((b, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-center"
              >
                <b.icon className="w-4 h-4 text-[#C9A961] mx-auto mb-1.5" />
                <p className="text-[11px] text-white/70">{b.label}</p>
              </div>
            ))}
          </div>
          <div className="space-y-2.5">
            {CONFIG.testimonials.map((t, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-gradient-to-br from-white/[0.05] to-transparent border border-white/[0.08]"
              >
                <div className="flex gap-0.5 mb-2">
                  {[...Array(5)].map((_, k) => (
                    <Star key={k} className="w-3 h-3 fill-[#C9A961] text-[#C9A961]" />
                  ))}
                </div>
                <p className="text-[12.5px] text-white/75 italic leading-relaxed">"{t.text}"</p>
                <p className="text-[11px] text-[#C9A961] mt-2">
                  — {t.name} · {t.role}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* DIGITAL FUTURISTE */}
        <Section title="Une expérience immobilière connectée" delay={0.45}>
          <div
            className="relative p-5 rounded-2xl border border-[#C9A961]/20 overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, rgba(201,169,97,0.08) 0%, rgba(0,0,0,0.4) 100%)",
            }}
          >
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#C9A961]/20 blur-3xl" />
            <div className="relative">
              <QrCode className="w-7 h-7 text-[#C9A961] mb-3" />
              <p className="text-[13px] text-white/80 leading-relaxed">
                Grâce à cette carte NFC, vous accédez instantanément à mon contact, aux projets
                AMG Building, aux brochures, aux disponibilités et à la prise de rendez-vous.
              </p>
            </div>
          </div>
        </Section>

        {/* LIENS RAPIDES */}
        <Section title="Plus d'infos" delay={0.5}>
          <div className="grid grid-cols-2 gap-2.5">
            <ExternalLink href={CONFIG.brand.website} icon={Globe} label="Site officiel" />
            <ExternalLink href={CONFIG.brand.instagram} icon={Instagram} label="Instagram" />
            <ExternalLink href={CONFIG.brand.mapsUrl} icon={MapPin} label="Localisation" />
            <ExternalLink href={mail} icon={Mail} label="Email" />
          </div>
        </Section>

        {/* Footer */}
        <footer className="mt-12 text-center">
          <div className="h-px w-16 bg-[#C9A961]/30 mx-auto mb-4" />
          <p className="text-[10px] tracking-[0.3em] text-white/30 uppercase">
            {CONFIG.brand.name}
          </p>
          <p className="text-[10px] text-white/20 mt-1">{CONFIG.brand.tagline}</p>
        </footer>
      </main>

      {/* STICKY BOTTOM BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-2xl bg-black/70 border-t border-white/10">
        <div className="max-w-md mx-auto grid grid-cols-4 gap-1 px-2 py-2.5">
          <StickyBtn href={tel} icon={Phone} label="Appel" />
          <StickyBtn href={wa} icon={MessageCircle} label="WhatsApp" external />
          <StickyBtn href={rdv} icon={Calendar} label="RDV" external />
          <StickyBtn href={wa} icon={Download} label="Brochure" external />
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Sub-components
   ============================================================ */
function Section({
  title,
  children,
  delay = 0,
}: {
  title: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay }}
      className="mt-10"
    >
      <h2 className="text-[11px] tracking-[0.3em] uppercase text-[#C9A961] mb-4 px-1">
        {title}
      </h2>
      {children}
    </motion.section>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#C9A961]/50"
    />
  );
}

function Select({
  value,
  onChange,
  placeholder,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: string[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-[#C9A961]/50 appearance-none"
    >
      <option value="" className="bg-black">
        {placeholder}
      </option>
      {options.map((o) => (
        <option key={o} value={o} className="bg-black">
          {o}
        </option>
      ))}
    </select>
  );
}

function ExternalLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-2 p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/80 text-[12.5px] hover:bg-white/[0.08] transition"
    >
      <Icon className="w-4 h-4 text-[#C9A961]" />
      {label}
    </a>
  );
}

function StickyBtn({
  href,
  icon: Icon,
  label,
  external = false,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className="flex flex-col items-center gap-1 py-2 rounded-xl hover:bg-white/5 transition active:scale-95"
    >
      <Icon className="w-4 h-4 text-[#C9A961]" />
      <span className="text-[10px] text-white/70">{label}</span>
    </a>
  );
}
