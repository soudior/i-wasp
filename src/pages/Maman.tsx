/**
 * Maman - Cadeau digital fête des mères
 * Page émotionnelle, premium, mobile-first.
 */
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Play, Pause, RotateCcw, Share2, ChevronLeft, ChevronRight, Music } from "lucide-react";
import photo1 from "@/assets/maman/photo-1.png";
import photo2 from "@/assets/maman/photo-2.png";
import photo3 from "@/assets/maman/photo-3.png";
import photo4 from "@/assets/maman/photo-4.png";
import photo5 from "@/assets/maman/photo-5.jpeg";
import photo6 from "@/assets/maman/photo-6.jpeg";
import photo7 from "@/assets/maman/photo-7.jpeg";

// 👉 ADMIN : ajoute/remplace facilement les photos ici
const PHOTOS = [photo1, photo2, photo3, photo4, photo5, photo6, photo7];

// 👉 ADMIN : configure la musique
// Option A : place un MP3 dans /public/audio/maman.mp3 et garde AUDIO_SRC
// Option B : laisse YOUTUBE_URL — un bouton ouvrira YouTube
const AUDIO_SRC = "/audio/maman.mp3";
const YOUTUBE_URL = "https://www.youtube.com/results?search_query=Kendji+Girac+Les+Yeux+de+la+Mama";

const SLIDE_DURATION = 4500; // ms par photo (≈ 30s pour 7 photos)

export default function Maman() {
  const [opened, setOpened] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioOk = useRef<boolean>(true);

  // Auto-advance pendant lecture
  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => {
      setSlideIndex((i) => (i + 1) % PHOTOS.length);
    }, SLIDE_DURATION);
    return () => clearInterval(t);
  }, [playing]);

  const openSouvenir = () => {
    setOpened(true);
    setTimeout(() => {
      document.getElementById("message")?.scrollIntoView({ behavior: "smooth" });
    }, 250);
  };

  const launchMontage = async () => {
    setSlideIndex(0);
    setPlaying(true);
    document.getElementById("montage")?.scrollIntoView({ behavior: "smooth", block: "center" });
    if (audioRef.current && audioOk.current) {
      try {
        audioRef.current.currentTime = 0;
        await audioRef.current.play();
      } catch {
        // fallback : ouvre YouTube si audio bloqué/absent
        window.open(YOUTUBE_URL, "_blank");
      }
    }
  };

  const replay = () => {
    setSlideIndex(0);
    setPlaying(true);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };

  const pauseToggle = () => {
    setPlaying((p) => {
      const next = !p;
      if (audioRef.current) {
        if (next) audioRef.current.play().catch(() => {});
        else audioRef.current.pause();
      }
      return next;
    });
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(
      "J'ai créé un petit souvenir pour la femme la plus précieuse de ma vie. Bonne fête maman, qu'Allah te protège toujours 🤍\n" +
        window.location.href
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  return (
    <div
      className="min-h-screen w-full font-sans text-[#3b2a2f]"
      style={{
        background:
          "radial-gradient(120% 80% at 50% 0%, #fff5ee 0%, #fbe7e1 35%, #f5d9d0 70%, #f0cfc6 100%)",
      }}
    >
      {/* Petits coeurs flottants */}
      <FloatingHearts />

      {/* HERO */}
      <section className="relative flex min-h-[100svh] flex-col items-center justify-center px-6 text-center overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 30%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 70%), radial-gradient(40% 30% at 80% 80%, rgba(212,165,165,0.35) 0%, rgba(255,255,255,0) 70%)",
            filter: "blur(2px)",
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="max-w-md"
        >
          <p
            className="mb-6 text-xs tracking-[0.4em] uppercase text-[#b89178]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Un cadeau de cœur
          </p>
          <h1
            className="text-5xl sm:text-6xl leading-tight text-[#5a3a3a]"
            style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif", fontWeight: 500 }}
          >
            Bonne fête maman <span className="inline-block">💖</span>
          </h1>
          <p
            className="mt-5 text-lg text-[#7a5a5a] italic"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            À la femme la plus précieuse de ma vie
          </p>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={openSouvenir}
            className="mt-10 px-8 py-4 rounded-full text-sm tracking-[0.25em] uppercase shadow-[0_10px_40px_-10px_rgba(184,145,120,0.6)] transition-all"
            style={{
              background: "linear-gradient(135deg, #d9a98c 0%, #c98a72 100%)",
              color: "#fffaf6",
            }}
          >
            Ouvrir le souvenir
          </motion.button>
        </motion.div>

        {opened === false && (
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-8 text-[#b89178]/70"
          >
            ↓
          </motion.div>
        )}
      </section>

      <AnimatePresence>
        {opened && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {/* MESSAGE */}
            <section
              id="message"
              className="px-6 py-20 max-w-xl mx-auto text-center"
            >
              <Heart className="mx-auto mb-6 text-[#c98a72]" size={28} fill="#c98a72" />
              <p
                className="text-2xl sm:text-3xl leading-relaxed text-[#5a3a3a]"
                style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}
              >
                Une mère, c'est un trésor qu'Allah nous confie.
                <br />
                On pense toujours avoir le temps, mais chaque instant avec elle
                est une bénédiction.
                <br />
                <br />
                Maman, merci pour ton amour, tes sacrifices, tes douas et ta
                présence.
                <br />
                Qu'Allah te protège, te donne une longue vie en bonne santé et
                te récompense pour tout ce que tu as fait pour nous.
                <br />
                <br />
                <span className="text-[#c98a72] italic">Je t'aime.</span>
              </p>
            </section>

            {/* GALERIE animée */}
            <section className="px-6 pb-16 max-w-2xl mx-auto">
              <h2
                className="text-center text-sm tracking-[0.35em] uppercase text-[#b89178] mb-10"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                — Album souvenir —
              </h2>
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                {PHOTOS.map((src, i) => (
                  <motion.div
                    key={src}
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.9, delay: (i % 4) * 0.15 }}
                    className={`overflow-hidden rounded-3xl shadow-[0_15px_40px_-15px_rgba(184,120,100,0.45)] ring-1 ring-white/60 ${
                      i % 3 === 0 ? "col-span-2 aspect-[4/3]" : "aspect-[3/4]"
                    }`}
                  >
                    <img
                      src={src}
                      alt={`Souvenir ${i + 1}`}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[6000ms] hover:scale-110"
                    />
                  </motion.div>
                ))}
              </div>
            </section>

            {/* MONTAGE / Carousel auto */}
            <section
              id="montage"
              className="px-6 py-16 max-w-md mx-auto text-center"
            >
              <p
                className="text-xs tracking-[0.35em] uppercase text-[#b89178] mb-4"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Souvenir animé
              </p>
              <h3
                className="text-3xl mb-8 text-[#5a3a3a]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Pour toi, maman
              </h3>

              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[2rem] shadow-[0_25px_60px_-20px_rgba(120,60,60,0.45)] ring-1 ring-white/70 bg-black/5">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={slideIndex}
                    src={PHOTOS[slideIndex]}
                    alt="Souvenir"
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </AnimatePresence>

                {/* Voile doux */}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(58,30,30,0.45) 0%, rgba(0,0,0,0) 40%), radial-gradient(80% 50% at 50% 100%, rgba(201,138,114,0.25), transparent 70%)",
                  }}
                />

                {/* Petit cœur pulsant */}
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 1.6, repeat: Infinity }}
                  className="absolute top-4 right-4 text-white/90 drop-shadow"
                >
                  <Heart size={20} fill="#fff" />
                </motion.div>

                {/* Indicateurs */}
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                  {PHOTOS.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 rounded-full transition-all duration-500 ${
                        i === slideIndex ? "w-6 bg-white" : "w-1.5 bg-white/50"
                      }`}
                    />
                  ))}
                </div>

                {/* Nav manuelle */}
                <button
                  aria-label="Précédent"
                  onClick={() =>
                    setSlideIndex((i) => (i - 1 + PHOTOS.length) % PHOTOS.length)
                  }
                  className="absolute left-2 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-white/40 backdrop-blur text-[#5a3a3a]"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  aria-label="Suivant"
                  onClick={() => setSlideIndex((i) => (i + 1) % PHOTOS.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-white/40 backdrop-blur text-[#5a3a3a]"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              {/* Audio */}
              <audio
                ref={audioRef}
                src={AUDIO_SRC}
                preload="none"
                onError={() => {
                  audioOk.current = false;
                }}
              />

              <div className="mt-8 flex flex-col gap-3">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={launchMontage}
                  className="flex items-center justify-center gap-3 rounded-full py-4 text-sm tracking-[0.25em] uppercase shadow-[0_15px_40px_-15px_rgba(201,138,114,0.7)]"
                  style={{
                    background: "linear-gradient(135deg, #d9a98c, #c98a72)",
                    color: "#fffaf6",
                  }}
                >
                  <Music size={16} />
                  Lancer le montage avec la musique
                </motion.button>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={pauseToggle}
                    className="flex items-center justify-center gap-2 rounded-full py-3 text-xs uppercase tracking-wider bg-white/60 backdrop-blur text-[#5a3a3a] ring-1 ring-white"
                  >
                    {playing ? <Pause size={14} /> : <Play size={14} />}
                    {playing ? "Pause" : "Lire"}
                  </button>
                  <button
                    onClick={replay}
                    className="flex items-center justify-center gap-2 rounded-full py-3 text-xs uppercase tracking-wider bg-white/60 backdrop-blur text-[#5a3a3a] ring-1 ring-white"
                  >
                    <RotateCcw size={14} />
                    Rejouer
                  </button>
                  <button
                    onClick={shareWhatsApp}
                    className="flex items-center justify-center gap-2 rounded-full py-3 text-xs uppercase tracking-wider bg-[#25D366] text-white"
                  >
                    <Share2 size={14} />
                    Partager
                  </button>
                </div>

                <button
                  onClick={() => window.open(YOUTUBE_URL, "_blank")}
                  className="mt-2 text-xs underline text-[#b89178]"
                >
                  Écouter "Les Yeux de la Mama" sur YouTube
                </button>
              </div>
            </section>

            {/* Citation finale */}
            <section className="px-6 py-20 max-w-md mx-auto text-center">
              <div className="mx-auto mb-8 h-px w-16 bg-[#c98a72]/40" />
              <p
                className="text-xl sm:text-2xl italic text-[#5a3a3a] leading-relaxed"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                « Profitez de vos mères tant qu'elles sont là…
                <br />
                leur présence est une rahma. »
              </p>
              <p
                className="mt-10 text-2xl text-[#c98a72]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Bonne fête des mères maman 🤍
              </p>
              <p className="mt-12 text-[10px] tracking-[0.3em] uppercase text-[#b89178]/70">
                Fait avec amour
              </p>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FloatingHearts() {
  const hearts = Array.from({ length: 12 });
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden -z-0">
      {hearts.map((_, i) => {
        const left = (i * 83) % 100;
        const delay = (i * 1.3) % 8;
        const duration = 14 + (i % 5) * 3;
        const size = 10 + (i % 4) * 4;
        return (
          <motion.div
            key={i}
            initial={{ y: "110vh", opacity: 0 }}
            animate={{ y: "-15vh", opacity: [0, 0.5, 0.5, 0] }}
            transition={{ duration, delay, repeat: Infinity, ease: "linear" }}
            style={{ left: `${left}%` }}
            className="absolute text-[#d9a98c]/60"
          >
            <Heart size={size} fill="currentColor" />
          </motion.div>
        );
      })}
    </div>
  );
}
