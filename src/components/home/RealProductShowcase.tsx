import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight, Radio, Smartphone, UserRoundCheck } from "lucide-react";
import productLifestyle from "@/assets/cards/iwasp-nfc-lifestyle-hero-1920x1080.jpg";

const facts = [
  { icon: Radio, text: "Un geste NFC" },
  { icon: Smartphone, text: "Aucune application requise" },
  { icon: UserRoundCheck, text: "Profil modifiable" },
];

export function RealProductShowcase() {
  return (
    <section aria-labelledby="product-in-action" className="relative overflow-hidden px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="grid overflow-hidden rounded-[2rem] border border-[#DCC7B0]/15 bg-[#0A0A0A] lg:grid-cols-[1.35fr_0.65fr]"
        >
          <div className="relative min-h-[320px] overflow-hidden sm:min-h-[460px]">
            <img
              src={productLifestyle}
              alt="Carte NFC i-wasp noire mate posée sur un smartphone"
              width={1920}
              height={1080}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-[#0A0A0A]/70" />
          </div>

          <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-14">
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#DCC7B0]/70">
              Le produit, en situation
            </p>
            <h2 id="product-in-action" className="mt-5 font-display text-4xl leading-tight text-[#FDFCFB] sm:text-5xl">
              Un contact.
              <span className="block italic text-[#DCC7B0]">Votre présence s’ouvre.</span>
            </h2>
            <p className="mt-6 font-body text-sm font-light leading-7 text-[#FDFCFB]/60">
              Approchez la carte d’un smartphone compatible : votre profil professionnel s’ouvre dans le navigateur et reste actualisable sans réimprimer la carte.
            </p>
            <ul className="mt-8 space-y-3">
              {facts.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-sm text-[#FDFCFB]/70">
                  <Icon className="h-4 w-4 text-[#DCC7B0]" aria-hidden />
                  {text}
                </li>
              ))}
            </ul>
            <Link
              to="/order/offre"
              className="mt-10 inline-flex w-fit items-center gap-3 border-b border-[#DCC7B0]/50 pb-2 font-mono text-[10px] uppercase tracking-[0.24em] text-[#DCC7B0] transition-colors hover:text-white"
            >
              Choisir ma carte <ArrowUpRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default RealProductShowcase;
