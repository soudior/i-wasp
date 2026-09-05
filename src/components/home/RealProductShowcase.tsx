import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight, Radio, Smartphone, UserRoundCheck, WalletCards } from "lucide-react";
import nfcTapVisual from "@/assets/cards/iwasp-nfc-tap-realistic-1920x1080.webp";
import walletVisual from "@/assets/cards/iwasp-wallet-realistic-1920x1080.webp";

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
          className="overflow-hidden rounded-[2rem] border border-[#DCC7B0]/15 bg-[#0A0A0A]"
        >
          <div className="grid lg:grid-cols-[0.7fr_1.3fr]">
            <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-14">
              <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#DCC7B0]/70">Le produit, en action</p>
              <h2 id="product-in-action" className="mt-5 font-display text-4xl leading-tight text-[#FDFCFB] sm:text-5xl">
                Du geste NFC
                <span className="block italic text-[#DCC7B0]">jusqu’au Wallet.</span>
              </h2>
              <p className="mt-6 font-body text-sm font-light leading-7 text-[#FDFCFB]/60">Une démonstration concrète : la carte déclenche votre profil, puis votre identité reste accessible dans Apple Wallet.</p>
              <ul className="mt-8 space-y-3">
                {facts.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-3 text-sm text-[#FDFCFB]/70">
                    <Icon className="h-4 w-4 text-[#DCC7B0]" aria-hidden />
                    {text}
                  </li>
                ))}
              </ul>
              <Link to="/order/offre" className="mt-10 inline-flex w-fit items-center gap-3 border-b border-[#DCC7B0]/50 pb-2 font-mono text-[10px] uppercase tracking-[0.24em] text-[#DCC7B0] transition-colors hover:text-white">
                Choisir ma carte <ArrowUpRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
            <figure className="relative min-h-[330px] overflow-hidden sm:min-h-[480px]">
              <img src={nfcTapVisual} alt="Carte i-wasp approchée d’un smartphone pour déclencher le NFC" width={1920} height={1080} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/70 via-transparent to-transparent" aria-hidden />
              <figcaption className="absolute bottom-6 right-6 rounded-full border border-white/10 bg-black/60 px-4 py-2 font-mono text-[9px] uppercase tracking-[0.22em] text-white/80 backdrop-blur-md">01 · Approcher</figcaption>
            </figure>
          </div>

          <div className="grid border-t border-white/[0.06] lg:grid-cols-[1.25fr_0.75fr]">
            <figure className="relative min-h-[330px] overflow-hidden sm:min-h-[460px]">
              <img src={walletVisual} alt="Pass digital i-wasp présenté dans le Wallet d’un iPhone" width={1920} height={1080} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-black/25" aria-hidden />
              <figcaption className="absolute bottom-6 left-6 rounded-full border border-white/10 bg-black/60 px-4 py-2 font-mono text-[9px] uppercase tracking-[0.22em] text-white/80 backdrop-blur-md">02 · Garder dans Wallet</figcaption>
            </figure>
            <div className="flex flex-col justify-center p-8 sm:p-12">
              <WalletCards className="h-8 w-8 text-[#DCC7B0]" aria-hidden />
              <h3 className="mt-6 font-display text-3xl text-white sm:text-4xl">Toujours à portée de main.</h3>
              <p className="mt-5 text-sm font-light leading-7 text-white/60">Le véritable pass Apple Wallet conserve votre carte digitale et son QR dans l’iPhone, prêt à être présenté à tout moment.</p>
              <div className="mt-7 flex items-center gap-3 text-xs text-white/70">
                <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden />
                Pass signé · QR canonique i-wasp
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default RealProductShowcase;
