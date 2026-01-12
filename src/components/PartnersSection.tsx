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

// Partner logos as elegant text with initials (to be replaced with actual logos)
const partners = [
  { name: "Atlas Ventures", initials: "AV" },
  { name: "Nexus Group", initials: "NG" },
  { name: "Maison Fassi", initials: "MF" },
  { name: "SB Law Partners", initials: "SB" },
  { name: "Royal Mansour", initials: "RM" },
  { name: "Banque Privée", initials: "BP" },
];

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

        {/* Partners Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 md:gap-12"
          style={{ y: contentY }}
        >
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1] 
              }}
              className="flex items-center justify-center"
            >
              <div 
                className="group cursor-default flex flex-col items-center gap-3 transition-all duration-500"
              >
                {/* Logo placeholder - elegant monogram */}
                <div 
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-105"
                  style={{ 
                    border: `1px solid ${NOIR_COUTURE.bg}15`,
                    backgroundColor: 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `${NOIR_COUTURE.gold}50`;
                    e.currentTarget.style.backgroundColor = `${NOIR_COUTURE.gold}08`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = `${NOIR_COUTURE.bg}15`;
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <span 
                    className="font-serif text-lg md:text-xl font-light tracking-wide transition-colors duration-500"
                    style={{ color: NOIR_COUTURE.bg }}
                  >
                    {partner.initials}
                  </span>
                </div>
                
                {/* Partner name */}
                <span 
                  className="text-[10px] tracking-[0.15em] uppercase text-center opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ color: NOIR_COUTURE.ash }}
                >
                  {partner.name}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 h-px mx-auto max-w-24 origin-center"
          style={{ backgroundColor: NOIR_COUTURE.bg, opacity: 0.1 }}
        />
      </div>
    </section>
  );
}
