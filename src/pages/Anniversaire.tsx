/**
 * Carte Anniversaire Surprise — Expérience immersive plein écran
 * Route: /anniversaire/:id
 *
 * Placeholder data pour l'instant — l'utilisateur uploadera ses médias
 * depuis le dashboard plus tard.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Volume2,
  VolumeX,
  Share2,
  ChevronLeft,
  ChevronRight,
  Cake,
  RotateCcw,
} from "lucide-react";


// ─────────────────────────────────────────────────────────────
// PLACEHOLDER DATA — sera remplacé par les données du dashboard
// ─────────────────────────────────────────────────────────────
type BirthdayData = {
  name: string;
  message: string;
  media: Array<{ type: "image" | "video"; url: string }>;
  music?: string;
};

const SAMPLE_DATA: Record<string, BirthdayData> = {
  default: {
    name: "Maman",
    message:
      "Chaque année qui passe est un cadeau pour nous tous. Merci d'être la lumière de notre famille. Que cette nouvelle année t'apporte santé, bonheur et tous les rêves que tu portes en toi. Je t'aime infiniment. 🤍",
    media: [
      { type: "image", url: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=1600&q=80" },
      { type: "image", url: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=1600&q=80" },
      { type: "image", url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1600&q=80" },
      { type: "image", url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80" },
      { type: "image", url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1600&q=80" },
    ],
    music: undefined, // à uploader
  },
};

// ─────────────────────────────────────────────────────────────
// Confetti helpers
// ─────────────────────────────────────────────────────────────
function fireConfettiBurst() {
  const gold = ["#D4AF37", "#F5E6A8", "#FFD700", "#FFFFFF", "#B8860B"];
  const duration = 2500;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 65,
      origin: { x: 0, y: 0.9 },
      colors: gold,
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 65,
      origin: { x: 1, y: 0.9 },
      colors: gold,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

function fireFinalExplosion() {
  const gold = ["#D4AF37", "#F5E6A8", "#FFD700", "#FFFFFF", "#B8860B", "#FFC0CB"];
  confetti({
    particleCount: 200,
    spread: 160,
    startVelocity: 55,
    origin: { y: 0.6 },
    colors: gold,
    scalar: 1.2,
  });
  setTimeout(() => {
    confetti({
      particleCount: 120,
      spread: 100,
      origin: { x: 0.2, y: 0.7 },
      colors: gold,
    });
    confetti({
      particleCount: 120,
      spread: 100,
      origin: { x: 0.8, y: 0.7 },
      colors: gold,
    });
  }, 250);
}

// ─────────────────────────────────────────────────────────────
// Sous-composants
// ─────────────────────────────────────────────────────────────
function GoldParticles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 6,
        duration: 6 + Math.random() * 6,
        size: 2 + Math.random() * 4,
      })),
    []
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-[#D4AF37]/70 shadow-[0_0_8px_rgba(212,175,55,0.6)]"
          style={{ left: `${p.left}%`, width: p.size, height: p.size, top: "-10px" }}
          initial={{ y: "-10vh", opacity: 0 }}
          animate={{ y: "110vh", opacity: [0, 1, 1, 0] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

function IntroScreen({ name, onEnter }: { name: string; onEnter: () => void }) {
  useEffect(() => {
    const t = setTimeout(fireConfettiBurst, 400);
    return () => clearTimeout(t);
  }, []);

  const title = `Joyeux Anniversaire ${name}`;
  const letters = title.split("");

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-black via-[#0a0a0a] to-black text-center px-6"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8 } }}
    >
      <GoldParticles />

      {/* Ballons */}
      <div className="pointer-events-none absolute inset-0">
        {["#D4AF37", "#F5E6A8", "#FFFFFF", "#B8860B"].map((c, i) => (
          <motion.div
            key={i}
            className="absolute bottom-[-80px] rounded-full"
            style={{
              left: `${15 + i * 22}%`,
              width: 60,
              height: 75,
              background: `radial-gradient(circle at 30% 30%, ${c}, ${c}88)`,
              boxShadow: `0 8px 30px ${c}55`,
            }}
            initial={{ y: 0 }}
            animate={{ y: "-120vh", x: [0, 20, -20, 0] }}
            transition={{
              duration: 10 + i * 2,
              delay: i * 0.6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 1 }}
        className="text-xs uppercase tracking-[0.4em] text-[#D4AF37] mb-6"
      >
        🎉 Une surprise pour toi
      </motion.p>

      <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light text-white leading-tight max-w-4xl">
        {letters.map((l, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0)" }}
            transition={{ delay: 0.5 + i * 0.05, duration: 0.6 }}
            className={l === " " ? "inline-block w-2 sm:w-4" : "inline-block"}
            style={
              l !== " "
                ? {
                    background: "linear-gradient(180deg, #FFFFFF 0%, #D4AF37 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }
                : undefined
            }
          >
            {l}
          </motion.span>
        ))}
        <motion.span
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 + letters.length * 0.05 + 0.2, type: "spring" }}
          className="inline-block ml-2"
        >
          🎂
        </motion.span>
      </h1>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 + letters.length * 0.05 + 0.6, duration: 0.8 }}
        onClick={onEnter}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        className="mt-12 px-10 py-4 rounded-full border border-[#D4AF37]/60 bg-white/5 backdrop-blur-md text-white text-sm uppercase tracking-[0.3em] hover:bg-[#D4AF37]/20 hover:border-[#D4AF37] transition-all"
      >
        Ouvrir le cadeau
      </motion.button>
    </motion.div>
  );
}

function Gallery({
  media,
  index,
  setIndex,
}: {
  media: BirthdayData["media"];
  index: number;
  setIndex: (i: number) => void;
}) {
  const touchStart = useRef<number | null>(null);
  const item = media[index];

  useEffect(() => {
    if (item?.type === "image") {
      const t = setTimeout(() => setIndex((index + 1) % media.length), 5000);
      return () => clearTimeout(t);
    }
  }, [index, item, media.length, setIndex]);

  const next = () => setIndex((index + 1) % media.length);
  const prev = () => setIndex((index - 1 + media.length) % media.length);

  return (
    <div
      className="relative w-full aspect-[4/5] sm:aspect-[16/10] max-w-3xl mx-auto rounded-2xl overflow-hidden bg-black shadow-[0_30px_80px_rgba(212,175,55,0.15)] border border-[#D4AF37]/20"
      onTouchStart={(e) => (touchStart.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchStart.current === null) return;
        const diff = e.changedTouches[0].clientX - touchStart.current;
        if (Math.abs(diff) > 50) (diff < 0 ? next : prev)();
        touchStart.current = null;
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1.15 }}
          exit={{ opacity: 0, scale: 1.2 }}
          transition={{ opacity: { duration: 0.8 }, scale: { duration: 6, ease: "linear" } }}
          className="absolute inset-0"
        >
          {item.type === "image" ? (
            <img src={item.url} alt="" className="w-full h-full object-cover" />
          ) : (
            <video
              src={item.url}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          )}
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 backdrop-blur text-white hover:bg-black/60"
        aria-label="Précédent"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 backdrop-blur text-white hover:bg-black/60"
        aria-label="Suivant"
      >
        <ChevronRight size={20} />
      </button>

      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
        {media.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-1 rounded-full transition-all ${
              i === index ? "w-8 bg-[#D4AF37]" : "w-4 bg-white/40"
            }`}
            aria-label={`Photo ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

function CandleCake({ onBlow }: { onBlow: () => void }) {
  const [blown, setBlown] = useState(false);
  const handle = () => {
    if (blown) return;
    setBlown(true);
    onBlow();
  };
  return (
    <button
      onClick={handle}
      className="group relative flex flex-col items-center gap-3 mt-8"
      aria-label="Souffler la bougie"
    >
      <div className="relative">
        <Cake
          size={72}
          className="text-[#D4AF37] drop-shadow-[0_0_20px_rgba(212,175,55,0.5)] group-hover:scale-110 transition-transform"
        />
        {!blown && (
          <motion.div
            className="absolute top-[-14px] left-1/2 -translate-x-1/2 w-2 h-4 rounded-full"
            style={{
              background: "radial-gradient(circle at 50% 20%, #FFF8B8, #FF8C00 70%, transparent)",
              boxShadow: "0 0 20px #FFA500, 0 0 40px #FF8C00",
            }}
            animate={{ scaleY: [1, 1.2, 0.9, 1], opacity: [0.9, 1, 0.85, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </div>
      <span className="text-xs uppercase tracking-[0.3em] text-[#D4AF37]">
        {blown ? "Vœu exaucé ✨" : "Tape pour souffler"}
      </span>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// Page principale
// ─────────────────────────────────────────────────────────────
export default function Anniversaire() {
  const { id } = useParams<{ id: string }>();
  const data = SAMPLE_DATA[id || "default"] || SAMPLE_DATA.default;

  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (started && audioRef.current && data.music) {
      audioRef.current.volume = 0.4;
      if (!muted) audioRef.current.play().catch(() => {});
    }
  }, [started, muted, data.music]);

  const toggleMute = () => {
    setMuted((m) => {
      const next = !m;
      if (audioRef.current) {
        audioRef.current.muted = next;
        if (!next) audioRef.current.play().catch(() => {});
      }
      return next;
    });
  };

  const handleShare = async () => {
    const url = window.location.href;
    const shareData = {
      title: `Joyeux Anniversaire ${data.name}`,
      text: `Un souvenir pour ${data.name} 🎉`,
      url,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        /* cancelled */
      }
    } else {
      await navigator.clipboard.writeText(url);
      alert("Lien copié dans le presse-papier ✨");
    }
  };

  const replay = () => {
    setStarted(false);
    setIndex(0);
    setTimeout(() => setStarted(true), 100);
  };

  useEffect(() => {
    document.title = `Joyeux Anniversaire ${data.name} — I-WASP`;
  }, [data.name]);

  return (
    <>


      <div className="relative min-h-dvh w-full overflow-x-hidden bg-black text-white font-sans">
        {data.music && (
          <audio ref={audioRef} src={data.music} loop preload="auto" />
        )}

        <AnimatePresence>
          {!started && <IntroScreen name={data.name} onEnter={() => setStarted(true)} />}
        </AnimatePresence>

        {started && (
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="relative min-h-dvh px-4 sm:px-6 py-10 pb-24"
          >
            <GoldParticles />

            {/* Top controls */}
            <div className="relative z-10 flex items-center justify-between mb-6 max-w-3xl mx-auto">
              <button
                onClick={toggleMute}
                className="p-3 rounded-full bg-white/5 border border-white/10 backdrop-blur hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/40 transition"
                aria-label={muted ? "Activer le son" : "Couper le son"}
              >
                {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <p className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37]/80">
                Un souvenir pour toi
              </p>
              <button
                onClick={handleShare}
                className="p-3 rounded-full bg-white/5 border border-white/10 backdrop-blur hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/40 transition"
                aria-label="Partager"
              >
                <Share2 size={18} />
              </button>
            </div>

            {/* Title */}
            <div className="relative z-10 text-center mb-8">
              <h1 className="font-serif text-3xl sm:text-5xl font-light">
                <span
                  style={{
                    background: "linear-gradient(180deg, #FFFFFF 0%, #D4AF37 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Joyeux Anniversaire {data.name}
                </span>
              </h1>
              <div className="mx-auto mt-3 h-px w-24 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
            </div>

            {/* Gallery */}
            <div className="relative z-10">
              <Gallery media={data.media} index={index} setIndex={setIndex} />
            </div>

            {/* Message */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 1 }}
              className="relative z-10 max-w-2xl mx-auto mt-12 text-center px-4"
            >
              <p className="font-serif text-lg sm:text-xl leading-relaxed text-white/90 italic">
                « {data.message} »
              </p>
            </motion.div>

            {/* Cake blow */}
            <div className="relative z-10 flex justify-center">
              <CandleCake onBlow={fireFinalExplosion} />
            </div>

            {/* Actions */}
            <div className="relative z-10 flex flex-wrap justify-center gap-3 mt-10">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#D4AF37] text-black text-sm font-medium tracking-wide hover:bg-[#F5E6A8] transition-all shadow-[0_10px_30px_rgba(212,175,55,0.35)]"
              >
                <Share2 size={16} /> Partager ce souvenir
              </button>
              <button
                onClick={replay}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 text-white text-sm tracking-wide hover:border-[#D4AF37]/60 hover:bg-white/5 transition-all"
              >
                <RotateCcw size={16} /> Rejouer le montage
              </button>
            </div>

            {/* Footer */}
            <div className="relative z-10 mt-16 text-center">
              <p className="text-[10px] uppercase tracking-[0.4em] text-white/40">
                Créé avec 🤍 sur I-WASP.COM
              </p>
            </div>
          </motion.main>
        )}
      </div>
    </>
  );
}
