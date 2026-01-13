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

const testimonials = [
  {
    quote: "Ma carte i-wasp a transformé mes premiers contacts. À chaque événement, je laisse une impression inoubliable.",
    author: "Mehdi Alaoui",
    role: "Fondateur",
    company: "Atlas Ventures",
  },
  {
    quote: "L'élégance de la carte reflète parfaitement l'image de notre cabinet. Nos clients sont impressionnés.",
    author: "Sofia Benjelloun",
    role: "Avocate Associée",
    company: "SB Law Partners",
  },
  {
    quote: "Plus de cartes papier perdues. Un simple geste et mon profil complet est partagé instantanément.",
    author: "Youssef Tazi",
    role: "Directeur Commercial",
    company: "Nexus Group",
  },
  {
    quote: "Une solution premium qui correspond à notre positionnement haut de gamme. Indispensable.",
    author: "Leila Fassi",
    role: "CEO",
    company: "Maison Fassi",
  },
];

export function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const honeycombY = useTransform(scrollYProgress, [0, 1], [0, -30]);

  return (
    <section 
      ref={sectionRef}
      className="py-16 md:py-24 relative overflow-hidden"
      style={{ backgroundColor: NOIR_COUTURE.bg }}
    >
      {/* Honeycomb texture with parallax */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        style={{
          y: honeycombY,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100' viewBox='0 0 56 100'%3E%3Cpath d='M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100' fill='none' stroke='${encodeURIComponent("#1a1a1a")}' stroke-width='0.5' stroke-opacity='0.035'/%3E%3C/svg%3E")`,
          backgroundSize: '56px 100px',
        }}
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12"
        >
          <span 
            className="inline-block text-xs tracking-[0.3em] uppercase mb-6"
            style={{ color: NOIR_COUTURE.ash }}
          >
            Témoignages
          </span>
          <h2 
            className="font-serif text-3xl md:text-4xl lg:text-5xl font-light tracking-tight"
            style={{ color: NOIR_COUTURE.ivory }}
          >
            Ceux qui nous font{" "}
            <span className="italic" style={{ color: NOIR_COUTURE.gold }}>
              confiance
            </span>
          </h2>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.15,
                ease: [0.22, 1, 0.36, 1] 
              }}
              className="group"
            >
              <div 
                className="h-full p-8 md:p-10 rounded-2xl transition-all duration-700"
                style={{ 
                  backgroundColor: NOIR_COUTURE.surface,
                  border: `1px solid ${NOIR_COUTURE.border}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(246, 245, 242, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = NOIR_COUTURE.border;
                }}
              >
                {/* Quote Mark */}
                <div 
                  className="mb-6 font-serif text-5xl leading-none opacity-20"
                  style={{ color: NOIR_COUTURE.gold }}
                >
                  "
                </div>

                {/* Quote Text */}
                <blockquote 
                  className="font-serif text-lg md:text-xl font-light leading-relaxed mb-8 italic"
                  style={{ color: NOIR_COUTURE.ivory }}
                >
                  {testimonial.quote}
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-4">
                  {/* Avatar Placeholder - Gold ring */}
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ 
                      border: `1px solid ${NOIR_COUTURE.gold}40`,
                      backgroundColor: 'rgba(175, 142, 86, 0.1)',
                    }}
                  >
                    <span 
                      className="font-serif text-sm font-light"
                      style={{ color: NOIR_COUTURE.gold }}
                    >
                      {testimonial.author.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>

                  <div>
                    <p 
                      className="font-medium text-sm tracking-wide"
                      style={{ color: NOIR_COUTURE.ivory }}
                    >
                      {testimonial.author}
                    </p>
                    <p 
                      className="text-xs tracking-wide mt-0.5"
                      style={{ color: NOIR_COUTURE.ash }}
                    >
                      {testimonial.role} · {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom accent line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 h-px mx-auto max-w-32 origin-center"
          style={{ backgroundColor: NOIR_COUTURE.gold, opacity: 0.3 }}
        />
      </div>
    </section>
  );
}
