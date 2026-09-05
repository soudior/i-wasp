import { motion } from "framer-motion";
import { Radio, Smartphone } from "lucide-react";
import nfcTapVisual from "@/assets/cards/iwasp-nfc-tap-realistic-1920x1080.webp";

export function HeroProductVisual() {
  return (
    <div className="relative w-full max-w-[680px]">
      <div className="absolute -inset-8 -z-10 rounded-[3rem] bg-[#DCC7B0]/10 blur-3xl" aria-hidden />
      <motion.figure
        initial={{ opacity: 0, rotateY: -7, y: 24 }}
        animate={{ opacity: 1, rotateY: 0, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#090909] shadow-[0_40px_100px_-28px_rgba(0,0,0,0.9)]"
      >
        <img
          src={nfcTapVisual}
          alt="Une carte NFC i-wasp noire mate approchée d’un smartphone"
          width={1920}
          height={1080}
          fetchPriority="high"
          decoding="async"
          className="aspect-video h-auto w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" aria-hidden />
        <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-7">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-[#DCC7B0]">Le geste qui connecte</p>
            <p className="mt-2 max-w-sm font-display text-xl text-white sm:text-2xl">Approchez. Le profil s’ouvre.</p>
          </div>
          <div className="hidden shrink-0 items-center gap-2 rounded-full border border-white/10 bg-black/55 px-4 py-2 text-[10px] text-white/75 backdrop-blur-md sm:flex">
            <Radio className="h-4 w-4 text-[#DCC7B0]" aria-hidden />
            NFC instantané
          </div>
        </figcaption>
      </motion.figure>
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-5 right-5 flex items-center gap-3 rounded-2xl border border-[#DCC7B0]/20 bg-[#101010]/95 px-4 py-3 shadow-2xl backdrop-blur-xl sm:right-8"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#DCC7B0]/10">
          <Smartphone className="h-4 w-4 text-[#DCC7B0]" aria-hidden />
        </span>
        <span>
          <span className="block font-mono text-[8px] uppercase tracking-[0.22em] text-white/40">Sans application</span>
          <span className="mt-1 block text-xs text-white/85">Compatible iPhone & Android</span>
        </span>
      </motion.div>
    </div>
  );
}

export default HeroProductVisual;
