import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

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
  containerClass: string;
}> = {
  serif: {
    fontClass: "font-serif text-xl md:text-2xl font-light tracking-[0.2em]",
    subtitleClass: "text-[8px] tracking-[0.3em] mt-1",
    containerClass: "",
  },
  elegant: {
    fontClass: "font-serif text-2xl md:text-3xl font-extralight tracking-[0.4em] italic",
    subtitleClass: "text-[8px] tracking-[0.2em] mt-1",
    containerClass: "",
  },
  modern: {
    fontClass: "font-sans text-2xl md:text-3xl font-bold tracking-tight",
    subtitleClass: "text-[9px] tracking-[0.15em] font-light mt-0.5",
    containerClass: "",
  },
  script: {
    fontClass: "font-serif text-lg md:text-xl font-light italic tracking-wide",
    subtitleClass: "text-[9px] tracking-[0.2em] font-normal not-italic mt-1",
    containerClass: "",
  },
  organic: {
    fontClass: "font-serif text-base md:text-lg font-light tracking-[0.15em]",
    subtitleClass: "text-[8px] tracking-[0.25em] mt-1 opacity-70",
    containerClass: "",
  },
  luxury: {
    fontClass: "font-serif text-lg md:text-xl font-light tracking-[0.25em]",
    subtitleClass: "text-[9px] tracking-[0.2em] mt-1",
    containerClass: "",
  },
  classic: {
    fontClass: "font-serif text-xl md:text-2xl font-light tracking-[0.15em]",
    subtitleClass: "text-[7px] tracking-[0.3em] mt-1.5 opacity-60",
    containerClass: "",
  },
  palace: {
    fontClass: "font-serif text-lg md:text-xl font-light tracking-[0.3em]",
    subtitleClass: "text-[8px] tracking-[0.25em] mt-1",
    containerClass: "",
  },
};

export function PartnersSection() {
  const sectionRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const contentY = useTransform(scrollYProgress, [0, 1], [20, -20]);

  return (
    <section 
      ref={sectionRef}
      className="py-24 md:py-32 relative overflow-hidden"
      style={{ backgroundColor: NOIR_COUTURE.ivory }}
    >
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
          style={{ y: contentY }}
        >
          <span 
            className="inline-block text-[10px] tracking-[0.4em] uppercase mb-4"
            style={{ color: NOIR_COUTURE.ash }}
          >
            Ils nous font confiance
          </span>
        </motion.div>

        {/* Partners Grid - 4 columns on desktop */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 md:gap-x-12 md:gap-y-16"
          style={{ y: contentY }}
        >
          {partners.map((partner, index) => {
            const style = logoStyles[partner.style];
            return (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.08,
                  ease: [0.22, 1, 0.36, 1] 
                }}
                className="flex items-center justify-center"
              >
                <div 
                  className={`group cursor-default flex flex-col items-center justify-center text-center transition-all duration-500 hover:scale-105 ${style.containerClass}`}
                >
                  {/* Logo as elegant typography */}
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
              </motion.div>
            );
          })}
        </motion.div>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-20 h-px mx-auto max-w-24 origin-center"
          style={{ backgroundColor: NOIR_COUTURE.bg, opacity: 0.1 }}
        />
      </div>
    </section>
  );
}
