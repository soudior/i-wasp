import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useAnimationControls } from "framer-motion";

// Noir Haute Couture palette
const NOIR_COUTURE = {
  bg: "#0A0A0A",
  surface: "#111111",
  ivory: "#F6F5F2",
  ash: "#9B9B9B",
  gold: "#AF8E56",
  border: "rgba(246, 245, 242, 0.08)",
};

// Real partners with elegant typography styles
const partners = [
  { 
    name: "Groupe Rodin", 
    display: "RODIN",
    subtitle: "BOULOGNE",
    style: "serif" as const,
  },
  { 
    name: "Christian Dior", 
    display: "DIOR",
    subtitle: null,
    style: "elegant" as const,
  },
  { 
    name: "MC Optique", 
    display: "MC",
    subtitle: "OPTIQUE",
    style: "modern" as const,
  },
  { 
    name: "YourFlowers", 
    display: "YOUR",
    subtitle: "FLOWERS",
    style: "script" as const,
  },
  { 
    name: "Herbalism Marrakech", 
    display: "HERBALISM",
    subtitle: "MARRAKECH",
    style: "organic" as const,
  },
  { 
    name: "Maison B Optic", 
    display: "MAISON B",
    subtitle: "OPTIC",
    style: "luxury" as const,
  },
  { 
    name: "Atlas Private Bank", 
    display: "ATLAS",
    subtitle: "PRIVATE BANK",
    style: "classic" as const,
  },
  { 
    name: "Royal Mansour", 
    display: "ROYAL",
    subtitle: "MANSOUR",
    style: "palace" as const,
  },
];

// Style configurations for each partner type
const logoStyles: Record<string, { 
  fontClass: string; 
  subtitleClass: string;
}> = {
  serif: {
    fontClass: "font-serif text-xl md:text-2xl font-light tracking-[0.2em]",
    subtitleClass: "text-[8px] tracking-[0.3em] mt-1",
  },
  elegant: {
    fontClass: "font-serif text-2xl md:text-3xl font-extralight tracking-[0.4em] italic",
    subtitleClass: "text-[8px] tracking-[0.2em] mt-1",
  },
  modern: {
    fontClass: "font-sans text-2xl md:text-3xl font-bold tracking-tight",
    subtitleClass: "text-[9px] tracking-[0.15em] font-light mt-0.5",
  },
  script: {
    fontClass: "font-serif text-lg md:text-xl font-light italic tracking-wide",
    subtitleClass: "text-[9px] tracking-[0.2em] font-normal not-italic mt-1",
  },
  organic: {
    fontClass: "font-serif text-base md:text-lg font-light tracking-[0.15em]",
    subtitleClass: "text-[8px] tracking-[0.25em] mt-1 opacity-70",
  },
  luxury: {
    fontClass: "font-serif text-lg md:text-xl font-light tracking-[0.25em]",
    subtitleClass: "text-[9px] tracking-[0.2em] mt-1",
  },
  classic: {
    fontClass: "font-serif text-xl md:text-2xl font-light tracking-[0.15em]",
    subtitleClass: "text-[7px] tracking-[0.3em] mt-1.5 opacity-60",
  },
  palace: {
    fontClass: "font-serif text-lg md:text-xl font-light tracking-[0.3em]",
    subtitleClass: "text-[8px] tracking-[0.25em] mt-1",
  },
};

// Partner Logo Component
function PartnerLogo({ partner }: { partner: typeof partners[0] }) {
  const style = logoStyles[partner.style];
  
  return (
    <div 
      className="flex-shrink-0 px-8 md:px-12 flex flex-col items-center justify-center text-center"
    >
      <div 
        className="transition-colors duration-500"
        style={{ color: NOIR_COUTURE.bg }}
      >
        <span className={style.fontClass}>
          {partner.display}
        </span>
        {partner.subtitle && (
          <div 
            className={style.subtitleClass}
            style={{ color: NOIR_COUTURE.ash }}
          >
            {partner.subtitle}
          </div>
        )}
      </div>
    </div>
  );
}

export function PartnersSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const contentY = useTransform(scrollYProgress, [0, 1], [10, -10]);

  // Double the partners array for seamless infinite scroll
  const duplicatedPartners = [...partners, ...partners];

  return (
    <section 
      ref={sectionRef}
      className="py-12 md:py-16 relative overflow-hidden"
      style={{ backgroundColor: NOIR_COUTURE.ivory }}
    >
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mb-8 px-6"
        style={{ y: contentY }}
      >
        <span 
          className="inline-block text-[10px] tracking-[0.4em] uppercase mb-4"
          style={{ color: NOIR_COUTURE.ash }}
        >
          Ils nous font confiance
        </span>
      </motion.div>

      {/* Infinite Scroll Carousel */}
      <div 
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Gradient masks for smooth edges */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-20 md:w-32 z-10 pointer-events-none"
          style={{
            background: `linear-gradient(to right, ${NOIR_COUTURE.ivory}, transparent)`,
          }}
        />
        <div 
          className="absolute right-0 top-0 bottom-0 w-20 md:w-32 z-10 pointer-events-none"
          style={{
            background: `linear-gradient(to left, ${NOIR_COUTURE.ivory}, transparent)`,
          }}
        />

        {/* Scrolling container with CSS animation for pause support */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="overflow-hidden"
        >
          <div
            className="flex items-center carousel-scroll"
            style={{
              width: "fit-content",
              animationPlayState: isHovered ? "paused" : "running",
            }}
          >
            {/* Render partners multiple times for seamless loop */}
            {[...duplicatedPartners, ...duplicatedPartners].map((partner, index) => (
              <motion.div
                key={`${partner.name}-${index}`}
                animate={{ 
                  scale: isHovered ? 1.05 : 1,
                }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <PartnerLogo partner={partner} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CSS Keyframes for infinite scroll */}
        <style>{`
          @keyframes scroll-left {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .carousel-scroll {
            animation: scroll-left 35s linear infinite;
          }
        `}</style>
      </div>

      {/* Decorative line */}
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 h-px mx-auto max-w-24 origin-center"
          style={{ backgroundColor: NOIR_COUTURE.bg, opacity: 0.1 }}
        />
      </div>
    </section>
  );
}
