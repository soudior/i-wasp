import { motion } from "framer-motion";
import { ArrowUpRight, Building2, BriefcaseBusiness, Palette } from "lucide-react";
import { Link } from "react-router-dom";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { HOME, reveal, staggerParent } from "./theme";
import executive from "@/assets/cards/iwasp-collection-executive-1920x1080.webp";
import creative from "@/assets/cards/iwasp-collection-creative-1920x1080.webp";
import hospitality from "@/assets/cards/iwasp-collection-hospitality-1920x1080.webp";

const MODELS = [
  { name: "Executive", finish: "Métal noir brossé · Gravure champagne", image: executive, icon: BriefcaseBusiness, span: "lg:col-span-2" },
  { name: "Studio", finish: "Ivoire soft-touch · Minimalisme éditorial", image: creative, icon: Palette, span: "" },
  { name: "Hospitality", finish: "Bleu nuit · Détails dorés", image: hospitality, icon: Building2, span: "lg:col-span-3" },
];

export function ModelsSection() {
  const { shouldReduceMotion } = useReducedMotion();

  return (
    <section id="modeles" className="relative px-6 py-24 sm:py-28" style={{ background: HOME.bgElevated }}>
      <div className="mx-auto max-w-6xl">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={staggerParent(shouldReduceMotion)}>
          <motion.div variants={reveal(shouldReduceMotion)} className="mb-14 flex flex-col justify-between gap-7 md:flex-row md:items-end">
            <div>
              <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.4em]" style={{ color: HOME.accent, opacity: 0.7 }}>Trois univers · Une signature</p>
              <h2 className="font-display text-4xl font-normal tracking-tight sm:text-5xl" style={{ color: HOME.text }}>Une carte à votre image.</h2>
              <p className="mt-4 max-w-xl font-body text-base font-light sm:text-lg" style={{ color: HOME.textMuted }}>Chaque finition est mise en scène dans son véritable univers. Votre identité, vos couleurs, votre matière.</p>
            </div>
            <Link to="/order/offre" className="inline-flex items-center gap-3 self-start border-b border-[#DCC7B0]/40 pb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[#DCC7B0]">Créer ma finition <ArrowUpRight className="h-4 w-4" aria-hidden /></Link>
          </motion.div>

          <div className="grid gap-5 lg:grid-cols-3">
            {MODELS.map(({ name, finish, image, icon: Icon, span }) => (
              <motion.article key={name} variants={reveal(shouldReduceMotion)} className={`group relative min-h-[360px] overflow-hidden rounded-[2rem] border border-white/[0.08] bg-black ${span}`}>
                <img src={image} alt={`Carte NFC i-wasp ${name} photographiée dans son univers`} width={1920} height={1080} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" aria-hidden />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-5 p-6 sm:p-8">
                  <div>
                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-black/40 backdrop-blur"><Icon className="h-4 w-4 text-[#DCC7B0]" aria-hidden /></div>
                    <h3 className="font-display text-2xl text-white">{name}</h3>
                    <p className="mt-1 text-xs font-light text-white/60">{finish}</p>
                  </div>
                  <span className="rounded-full border border-white/10 bg-black/45 px-3 py-2 font-mono text-[8px] uppercase tracking-[0.2em] text-white/60 backdrop-blur">NFC intégré</span>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default ModelsSection;
