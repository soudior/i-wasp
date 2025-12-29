import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  { name: "Marie Fontaine", title: "CEO, Studio Design", content: "IWASP a transformé ma façon de networker. Plus besoin de cartes papier, un simple toucher suffit. Mes clients sont impressionnés.", rating: 5, avatar: "M" },
  { name: "Thomas Laurent", title: "Avocat d'affaires", content: "L'intégration Apple Wallet est incroyable. Ma carte est toujours accessible depuis mon écran verrouillé. Professionnel et élégant.", rating: 5, avatar: "T" },
  { name: "Sophie Mercier", title: "Directrice Marketing", content: "La capture de leads automatique m'a permis de suivre mes contacts efficacement. L'analyse des scans est un vrai plus.", rating: 5, avatar: "S" },
];

export function TestimonialsSection() {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-surface-1" />
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full bg-amber-500/[0.03] blur-[120px]" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-6">Témoignages</span>
          <h2 className="font-display text-4xl md:text-5xl font-semibold mb-6">Ils nous font confiance</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Découvrez ce que nos utilisateurs disent de leur expérience IWASP</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              className="group"
            >
              <div className="h-full p-8 rounded-2xl bg-surface-2/50 border border-foreground/5 hover:border-amber-500/20 transition-all duration-500 relative">
                <Quote size={32} className="text-amber-500/20 mb-6" />
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-foreground/80 leading-relaxed mb-8">"{testimonial.content}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500/30 to-amber-600/20 flex items-center justify-center">
                    <span className="font-display font-bold text-amber-400">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
