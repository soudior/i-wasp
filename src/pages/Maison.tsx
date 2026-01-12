/**
 * Maison — Histoire & Philosophie i-wasp
 * Style: Haute Couture Digitale, Éditorial, Minimalisme extrême
 */

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CoutureNavbar } from "@/components/CoutureNavbar";
import { CoutureFooter } from "@/components/CoutureFooter";
import { COUTURE } from "@/lib/hauteCouturePalette";

// Animation lente, luxueuse
const slowFade = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 1.2 }
};

const slowFadeDelay = (delay: number) => ({
  ...slowFade,
  transition: { duration: 1.2, delay }
});

export default function Maison() {
  return (
    <div 
      className="min-h-screen"
      style={{ backgroundColor: COUTURE.silk }}
    >
      <CoutureNavbar />
      
      {/* ═══════════════════════════════════════════════════════════════════
          HERO — Une phrase, rien d'autre
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="min-h-screen flex items-center justify-center px-8 pt-20 relative overflow-hidden">
        {/* Honeycomb texture - ultra subtle */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100' viewBox='0 0 56 100'%3E%3Cpath d='M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100' fill='none' stroke='%23080808' stroke-width='0.5' stroke-opacity='0.03'/%3E%3C/svg%3E")`,
            backgroundSize: '56px 100px',
          }}
        />
        
        <motion.div 
          className="text-center max-w-[800px] relative z-10"
          {...slowFade}
        >
          <span 
            className="text-[10px] uppercase tracking-[0.4em] mb-8 block font-light"
            style={{ color: COUTURE.textMuted }}
          >
            La Maison
          </span>
          
          <h1 
            className="font-display text-4xl md:text-5xl lg:text-6xl font-light leading-[1.1] tracking-tight"
            style={{ color: COUTURE.jet }}
          >
            Nous ne fabriquons pas
            <br />
            <span className="italic">des cartes.</span>
          </h1>
          
          <motion.p 
            className="mt-12 text-lg md:text-xl font-light leading-relaxed max-w-[500px] mx-auto"
            style={{ color: COUTURE.textSecondary }}
            {...slowFadeDelay(0.3)}
          >
            Nous façonnons des identités.
          </motion.p>
        </motion.div>
        
        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-16 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <div 
            className="w-px h-16"
            style={{ 
              background: `linear-gradient(to bottom, ${COUTURE.jet}20, transparent)` 
            }}
          />
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          MANIFESTE — Texte éditorial
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-32 md:py-48 px-8 relative">
        <div className="max-w-[600px] mx-auto">
          <motion.div {...slowFade}>
            <p 
              className="text-xl md:text-2xl font-light leading-[1.8] mb-12"
              style={{ 
                color: COUTURE.jet,
                letterSpacing: '0.01em',
              }}
            >
              Dans un monde saturé de bruit, nous avons choisi le silence.
            </p>
            
            <p 
              className="text-base md:text-lg font-light leading-[2] mb-12"
              style={{ color: COUTURE.textSecondary }}
            >
              i-wasp est née d'une conviction simple : votre identité professionnelle 
              mérite la même attention qu'une pièce de haute couture. Pas un logo de plus. 
              Pas un gadget technologique. Une extension de vous-même — sobre, précise, durable.
            </p>
            
            <p 
              className="text-base md:text-lg font-light leading-[2]"
              style={{ color: COUTURE.textSecondary }}
            >
              Chaque détail a été pensé pour disparaître. Ce qui reste, c'est l'essentiel : 
              vous, et la connexion que vous créez.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          VALEURS — Trois mots, trois lignes
      ═══════════════════════════════════════════════════════════════════ */}
      <section 
        className="py-32 md:py-48 px-8"
        style={{ backgroundColor: COUTURE.jet }}
      >
        <div className="max-w-[800px] mx-auto">
          <motion.div 
            className="text-center mb-24"
            {...slowFade}
          >
            <span 
              className="text-[10px] uppercase tracking-[0.4em] font-light"
              style={{ color: COUTURE.textMuted }}
            >
              Nos principes
            </span>
          </motion.div>
          
          <div className="space-y-16 md:space-y-24">
            {[
              { word: "Sobre", description: "Ce qui n'est pas nécessaire n'existe pas." },
              { word: "Précise", description: "Chaque pixel a une raison d'être." },
              { word: "Intemporelle", description: "Nous ne suivons pas les tendances. Nous les ignorons." },
            ].map((value, i) => (
              <motion.div 
                key={value.word}
                className="flex flex-col md:flex-row md:items-baseline gap-4 md:gap-12"
                {...slowFadeDelay(i * 0.15)}
              >
                <h3 
                  className="font-display text-3xl md:text-4xl font-light italic"
                  style={{ color: COUTURE.silk }}
                >
                  {value.word}
                </h3>
                <p 
                  className="text-base font-light"
                  style={{ color: COUTURE.textMuted }}
                >
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          CITATION — Une phrase iconique
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-32 md:py-48 px-8 relative overflow-hidden">
        {/* Honeycomb texture */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100' viewBox='0 0 56 100'%3E%3Cpath d='M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100' fill='none' stroke='%23080808' stroke-width='0.5' stroke-opacity='0.03'/%3E%3C/svg%3E")`,
            backgroundSize: '56px 100px',
          }}
        />
        
        <motion.div 
          className="max-w-[700px] mx-auto text-center relative z-10"
          {...slowFade}
        >
          <blockquote 
            className="font-display text-2xl md:text-3xl lg:text-4xl font-light italic leading-[1.4]"
            style={{ color: COUTURE.jet }}
          >
            "Le luxe, c'est ce qui dure
            <br />
            quand tout le reste disparaît."
          </blockquote>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          ORIGINE — Le nom
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-32 md:py-48 px-8">
        <div className="max-w-[600px] mx-auto">
          <motion.div {...slowFade}>
            <span 
              className="text-[10px] uppercase tracking-[0.4em] mb-8 block font-light"
              style={{ color: COUTURE.textMuted }}
            >
              Pourquoi i-wasp
            </span>
            
            <p 
              className="text-xl md:text-2xl font-light leading-[1.8] mb-8"
              style={{ color: COUTURE.jet }}
            >
              L'abeille construit avec précision.
              <br />
              Elle crée des structures parfaites.
            </p>
            
            <p 
              className="text-base font-light leading-[2]"
              style={{ color: COUTURE.textSecondary }}
            >
              Le nid d'abeille est notre signature invisible — une géométrie parfaite, 
              une efficacité silencieuse. Comme votre identité chez nous : structurée 
              avec soin, visible seulement par sa qualité.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          CTA — Un seul, discret
      ═══════════════════════════════════════════════════════════════════ */}
      <section 
        className="py-32 md:py-48 px-8"
        style={{ 
          borderTop: `1px solid ${COUTURE.border}` 
        }}
      >
        <motion.div 
          className="max-w-[500px] mx-auto text-center"
          {...slowFade}
        >
          <p 
            className="text-lg md:text-xl font-light mb-12"
            style={{ color: COUTURE.textSecondary }}
          >
            Prêt à créer votre identité ?
          </p>
          
          <Link 
            to="/order/offre"
            className="inline-block text-sm uppercase tracking-[0.2em] font-medium transition-all duration-500 pb-2"
            style={{ 
              color: COUTURE.jet,
              borderBottom: `1px solid ${COUTURE.jet}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = COUTURE.gold;
              e.currentTarget.style.borderColor = COUTURE.gold;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = COUTURE.jet;
              e.currentTarget.style.borderColor = COUTURE.jet;
            }}
          >
            Découvrir
          </Link>
        </motion.div>
      </section>

      <CoutureFooter />
    </div>
  );
}
