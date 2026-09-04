/**
 * NfcCard3D — Carte NFC hero premium
 *
 * Expérience 3D "coffret de luxe" sans WebGL :
 * - tilt piloté au pointeur via des MotionValues (aucun re-render React par mouvement)
 * - reflet lumineux + bande holographique déplacés en transform pur (compositeur GPU)
 * - tranches translateZ pour l'épaisseur physique de la carte
 * - retournement recto/verso au clic, au tap et au clavier (Entrée / Espace)
 *
 * Accessibilité & perf :
 * - prefers-reduced-motion et appareils faibles → tilt, dérive et flip animé désactivés
 * - le tilt n'écoute que les pointeurs fins (souris/stylet) : aucun coût sur mobile
 * - aucune boucle rAF, aucune animation de box-shadow ou de background
 */

import { useCallback, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";
import { Zap } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const CHAMPAGNE = "#DCC7B0";

/** Amplitude maximale du tilt, en degrés. */
const MAX_TILT = 11;

/** Ressort du tilt : rapide mais sans rebond nerveux. */
const TILT_SPRING = { stiffness: 170, damping: 20, mass: 0.6 } as const;

/** Ressort des reflets : plus mou, pour un décalage "matière". */
const SHEEN_SPRING = { stiffness: 90, damping: 22, mass: 0.9 } as const;

interface NfcCard3DProps {
  /** Nom affiché en relief sur le recto. */
  name?: string;
  /** Autorise les animations ambiantes en boucle (dérive, halo, pulsation NFC). */
  animate?: boolean;
  /** Permet le retournement recto/verso. */
  flippable?: boolean;
  className?: string;
}

export function NfcCard3D({
  name = "VOTRE NOM",
  animate = true,
  flippable = true,
  className = "",
}: NfcCard3DProps) {
  const { shouldReduceMotion } = useReducedMotion();
  const surfaceRef = useRef<HTMLButtonElement>(null);
  const [isPointerActive, setIsPointerActive] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  // Position normalisée du pointeur sur la carte (0 → 1 sur chaque axe).
  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);

  const interactive = !shouldReduceMotion;
  const ambient = animate && !shouldReduceMotion;

  const rotateX = useSpring(useTransform(pointerY, [0, 1], [MAX_TILT, -MAX_TILT]), TILT_SPRING);
  const rotateY = useSpring(useTransform(pointerX, [0, 1], [-MAX_TILT, MAX_TILT]), TILT_SPRING);

  // Reflets : uniquement des translations/rotations en px/deg → aucun repaint de gradient.
  const glareX = useSpring(useTransform(pointerX, [0, 1], [-90, 90]), SHEEN_SPRING);
  const glareY = useSpring(useTransform(pointerY, [0, 1], [-60, 60]), SHEEN_SPRING);
  const holoX = useSpring(useTransform(pointerX, [0, 1], [-150, 150]), SHEEN_SPRING);
  const holoRotate = useSpring(useTransform(pointerY, [0, 1], [-16, 16]), SHEEN_SPRING);
  const shadowX = useSpring(useTransform(pointerX, [0, 1], [16, -16]), SHEEN_SPRING);
  const shadowY = useSpring(useTransform(pointerY, [0, 1], [10, -10]), SHEEN_SPRING);

  const resetPointer = useCallback(() => {
    pointerX.set(0.5);
    pointerY.set(0.5);
  }, [pointerX, pointerY]);

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      // Le tactile ne pilote pas le tilt : on garde le scroll fluide sur mobile.
      if (event.pointerType === "touch") return;
      const bounds = surfaceRef.current?.getBoundingClientRect();
      if (!bounds) return;
      pointerX.set((event.clientX - bounds.left) / bounds.width);
      pointerY.set((event.clientY - bounds.top) / bounds.height);
    },
    [pointerX, pointerY],
  );

  const handlePointerEnter = useCallback((event: React.PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === "touch") return;
    setIsPointerActive(true);
  }, []);

  const handlePointerLeave = useCallback(() => {
    setIsPointerActive(false);
    resetPointer();
  }, [resetPointer]);

  // Le clavier oriente aussi la carte : les flèches inclinent, Entrée/Espace retourne.
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (!interactive) return;
      const step = 0.25;
      const nudge = (value: typeof pointerX, delta: number) =>
        value.set(Math.min(1, Math.max(0, value.get() + delta)));

      switch (event.key) {
        case "ArrowLeft":
          nudge(pointerX, -step);
          break;
        case "ArrowRight":
          nudge(pointerX, step);
          break;
        case "ArrowUp":
          nudge(pointerY, -step);
          break;
        case "ArrowDown":
          nudge(pointerY, step);
          break;
        default:
          return;
      }
      event.preventDefault();
    },
    [interactive, pointerX, pointerY],
  );

  const flipTransition = shouldReduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 80, damping: 15, mass: 0.9 };

  const faceBase =
    "absolute inset-0 rounded-3xl preserve-3d backface-hidden";

  return (
    <div className={`relative ${className}`}>
      {/* Halo d'ambiance — opacité/échelle animées, jamais la box-shadow */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-10 -z-10 rounded-[3rem] blur-2xl"
        style={{
          background: `radial-gradient(closest-side, rgba(220,199,176,0.22), rgba(220,199,176,0.05) 60%, transparent 78%)`,
        }}
        animate={ambient ? { opacity: [0.55, 0.9, 0.55], scale: [0.97, 1.03, 0.97] } : { opacity: 0.65 }}
        transition={ambient ? { duration: 6, repeat: Infinity, ease: "easeInOut" } : undefined}
      />

      <motion.button
        ref={surfaceRef}
        type="button"
        aria-pressed={flippable ? isFlipped : undefined}
        aria-label={
          flippable
            ? `Carte NFC ${name} — ${isFlipped ? "verso affiché" : "recto affiché"}. Activer pour retourner la carte, flèches pour l'incliner.`
            : `Carte NFC ${name}`
        }
        onClick={flippable ? () => setIsFlipped((value) => !value) : undefined}
        onKeyDown={handleKeyDown}
        onPointerMove={interactive ? handlePointerMove : undefined}
        onPointerEnter={interactive ? handlePointerEnter : undefined}
        onPointerLeave={interactive ? handlePointerLeave : undefined}
        onBlur={resetPointer}
        className={`group relative block w-[340px] h-[200px] sm:w-[400px] sm:h-[240px] cursor-pointer rounded-3xl border-0 bg-transparent p-0 text-left outline-none focus-visible:ring-2 focus-visible:ring-[#DCC7B0]/70 focus-visible:ring-offset-4 focus-visible:ring-offset-[#030303] ${
          flippable ? "" : "cursor-default"
        }`}
        style={{ perspective: 1400 }}
      >
        {/* Dérive ambiante — remise à plat dès que le pointeur prend la main */}
        <motion.div
          aria-hidden="true"
          className="h-full w-full preserve-3d"
          animate={
            ambient && !isPointerActive
              ? { rotateY: [-3.5, 3.5, -3.5], rotateX: [1.6, -1.6, 1.6] }
              : { rotateY: 0, rotateX: 0 }
          }
          transition={
            ambient && !isPointerActive
              ? { duration: 14, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
          }
        >
          {/* Tilt piloté au pointeur */}
          <motion.div
            className="h-full w-full preserve-3d"
            style={{ rotateX, rotateY, willChange: "transform" }}
          >
            {/* Ombre portée projetée, décalée à l'inverse de l'inclinaison */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-4 rounded-[2rem] bg-black/70 blur-2xl"
              style={{ x: shadowX, y: shadowY, z: -60 }}
            />

            {/* Groupe de retournement recto/verso */}
            <motion.div
              className="h-full w-full preserve-3d"
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={flipTransition}
              style={{ willChange: "transform" }}
            >
              {/* Tranches : épaisseur physique entre les deux faces (±6px).
                  Empilement symétrique pour rester juste une fois retourné. */}
              {[-4, -2, 0, 2, 4].map((depth) => (
                <div
                  key={depth}
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-3xl"
                  style={{
                    transform: `translateZ(${depth}px)`,
                    background:
                      Math.abs(depth) === 4
                        ? "linear-gradient(180deg, rgba(220,199,176,0.4) 0%, rgba(120,104,88,0.2) 45%, rgba(0,0,0,0.92) 100%)"
                        : "linear-gradient(180deg, #16130F 0%, #0A0908 60%, #050505 100%)",
                  }}
                />
              ))}

              <CardFace
                className={faceBase}
                hidden={isFlipped}
                glareX={glareX}
                glareY={glareY}
                holoX={holoX}
                holoRotate={holoRotate}
              >
                <FrontContent name={name} ambient={ambient} />
              </CardFace>

              <CardFace
                className={faceBase}
                rotated
                hidden={!isFlipped}
                glareX={glareX}
                glareY={glareY}
                holoX={holoX}
                holoRotate={holoRotate}
              >
                <BackContent />
              </CardFace>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.button>

      {flippable && (
        <p className="mt-5 text-center font-mono text-[9px] uppercase tracking-[0.3em] text-[#FDFCFB]/25">
          {isFlipped ? "Verso" : "Recto"} · Cliquez pour retourner
        </p>
      )}
    </div>
  );
}

/**
 * Une face de carte : substrat noir, reflets mobiles, puis le contenu en relief.
 * Les calques lumineux vivent dans un conteneur `overflow-hidden` séparé pour
 * ne pas aplatir le contexte 3D du contenu.
 */
function CardFace({
  children,
  className,
  rotated = false,
  hidden,
  glareX,
  glareY,
  holoX,
  holoRotate,
}: {
  children: React.ReactNode;
  className: string;
  rotated?: boolean;
  hidden: boolean;
  glareX: MotionValue<number>;
  glareY: MotionValue<number>;
  holoX: MotionValue<number>;
  holoRotate: MotionValue<number>;
}) {
  return (
    <div
      className={className}
      aria-hidden={hidden}
      style={{
        // Les faces encadrent la tranche : +6px de part et d'autre du centre.
        transform: rotated ? "rotateY(180deg) translateZ(6px)" : "translateZ(6px)",
        background: "linear-gradient(145deg, #0A0A0A 0%, #1A1A1A 40%, #0A0A0A 100%)",
        boxShadow:
          "0 30px 60px -15px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.07), inset 0 0 0 1px rgba(220,199,176,0.08)",
      }}
    >
      {/* Calques lumineux (aplatis, isolés du relief) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl backface-hidden">
        {/* Bande holographique champagne */}
        <motion.div
          className="absolute -inset-x-1/2 top-[-30%] h-[160%] opacity-70 mix-blend-screen"
          style={{
            x: holoX,
            rotate: holoRotate,
            background:
              "linear-gradient(100deg, transparent 34%, rgba(255,255,255,0.06) 44%, rgba(220,199,176,0.28) 50%, rgba(190,205,220,0.10) 56%, transparent 66%)",
          }}
        />
        {/* Reflet spéculaire suivant le pointeur */}
        <motion.div
          className="absolute left-[-50%] top-[-50%] h-[200%] w-[200%] mix-blend-screen"
          style={{
            x: glareX,
            y: glareY,
            background:
              "radial-gradient(closest-side, rgba(255,255,255,0.16) 0%, rgba(220,199,176,0.10) 38%, transparent 72%)",
          }}
        />
        {/* Grain / guillochage discret */}
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(115deg, rgba(255,255,255,0.022) 0px, rgba(255,255,255,0.022) 1px, transparent 1px, transparent 5px)",
          }}
        />
      </div>

      {children}
    </div>
  );
}

/**
 * Recto — contenu identique à l'existant, désormais étagé en profondeur.
 * Chaque calque surélevé porte `backface-hidden` : sans cela, les enfants
 * d'une face masquée resteraient visibles en miroir une fois la carte retournée.
 */
function FrontContent({ name, ambient }: { name: string; ambient: boolean }) {
  return (
    <div className="absolute inset-0 preserve-3d">
      {/* Logo W */}
      <div className="absolute left-6 top-6 backface-hidden" style={{ transform: "translateZ(22px)" }}>
        <div
          className="flex h-12 w-12 items-center justify-center rounded-full"
          style={{
            background: "linear-gradient(135deg, rgba(220,199,176,0.18) 0%, rgba(220,199,176,0.05) 100%)",
            border: "1px solid rgba(220,199,176,0.25)",
            boxShadow: "0 6px 18px rgba(0,0,0,0.5)",
          }}
        >
          <span className="font-display text-lg text-[#DCC7B0]">W</span>
        </div>
      </div>

      {/* Badge édition */}
      <div
        className="absolute right-6 top-6 text-right backface-hidden"
        style={{ transform: "translateZ(14px)" }}
      >
        <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-[#DCC7B0]/50">
          PRIVATE_ASSET_V6
        </p>
        <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.2em] text-white/30">
          LIMITED EDITION
        </p>
      </div>

      {/* Nom du propriétaire */}
      <div
        className="absolute left-6 right-6 top-1/2 backface-hidden"
        style={{ transform: "translateY(-50%) translateZ(28px)" }}
      >
        <motion.p
          key={name}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-display text-2xl tracking-[0.15em] text-white/95 sm:text-3xl"
          style={{ textShadow: "0 6px 22px rgba(0,0,0,0.65)" }}
        >
          {name.toUpperCase()}
        </motion.p>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[#DCC7B0]/70">
          SUPREME OWNER
        </p>
      </div>

      {/* Icône NFC */}
      <div className="absolute bottom-6 left-6 backface-hidden" style={{ transform: "translateZ(20px)" }}>
        <div
          className="relative flex h-10 w-10 items-center justify-center rounded-full"
          style={{
            background: "rgba(220,199,176,0.08)",
            border: "1px solid rgba(220,199,176,0.18)",
          }}
        >
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full border border-[#DCC7B0]/35"
            animate={ambient ? { scale: [1, 1.55], opacity: [0.5, 0] } : { scale: 1, opacity: 0.25 }}
            transition={ambient ? { duration: 2.4, repeat: Infinity, ease: "easeOut" } : undefined}
          />
          <Zap className="h-4 w-4 text-[#DCC7B0]/80" />
        </div>
      </div>

      {/* Numéro de série */}
      <div className="absolute bottom-6 right-6 backface-hidden" style={{ transform: "translateZ(10px)" }}>
        <p className="font-mono text-[9px] tracking-[0.2em] text-white/25">SN-4820-ABS</p>
      </div>
    </div>
  );
}

/** Verso — puce, texture QR et signature i-wasp. */
function BackContent() {
  return (
    <div className="absolute inset-0 preserve-3d">
      {/* Bande magnétique */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-6 h-9 backface-hidden"
        style={{
          background: "linear-gradient(180deg, #050505 0%, #121212 50%, #050505 100%)",
          boxShadow: "inset 0 1px 0 rgba(220,199,176,0.10)",
        }}
      />

      {/* Puce */}
      <div className="absolute bottom-8 left-6" style={{ transform: "translateZ(18px)" }}>
        <div
          className="h-9 w-12 rounded-md"
          style={{
            background: `linear-gradient(135deg, ${CHAMPAGNE} 0%, #8E7B67 45%, ${CHAMPAGNE} 100%)`,
            boxShadow: "0 4px 14px rgba(0,0,0,0.55)",
          }}
        >
          <div
            className="h-full w-full rounded-md opacity-40"
            style={{
              backgroundImage:
                "linear-gradient(90deg, transparent 45%, rgba(0,0,0,0.6) 46%, transparent 47%), linear-gradient(0deg, transparent 30%, rgba(0,0,0,0.6) 31%, transparent 32%, transparent 68%, rgba(0,0,0,0.6) 69%, transparent 70%)",
            }}
          />
        </div>
        <p className="mt-3 font-mono text-[8px] uppercase tracking-[0.3em] text-[#DCC7B0]/60">
          TAP · SCAN · CONNECT
        </p>
      </div>

      {/* Texture QR */}
      <div className="absolute bottom-8 right-6" style={{ transform: "translateZ(16px)" }}>
        <div
          className="relative h-16 w-16 rounded-md p-1"
          style={{ background: "rgba(220,199,176,0.06)", border: "1px solid rgba(220,199,176,0.18)" }}
        >
          <div
            aria-hidden
            className="h-full w-full opacity-70"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, rgba(220,199,176,0.7) 0 3px, transparent 3px 7px), repeating-linear-gradient(0deg, rgba(3,3,3,0.85) 0 3px, transparent 3px 6px)",
            }}
          />
          {["left-1 top-1", "right-1 top-1", "left-1 bottom-1"].map((corner) => (
            <span
              key={corner}
              aria-hidden
              className={`absolute ${corner} h-4 w-4 border-2 border-[#DCC7B0]/80 bg-[#0A0A0A]`}
            />
          ))}
        </div>
      </div>

      {/* Signature */}
      <div className="absolute left-6 top-[4.75rem]" style={{ transform: "translateZ(12px)" }}>
        <p className="font-display text-lg tracking-[0.18em] text-[#FDFCFB]/85">i-wasp.com</p>
        <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.28em] text-white/30">
          PROFIL TOUJOURS À JOUR
        </p>
      </div>
    </div>
  );
}

export default NfcCard3D;
