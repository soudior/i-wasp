import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";

const testimonials = [
  {
    name: "Marie Fontaine",
    title: "CEO, Studio Design",
    content:
      "IWASP a transformé ma façon de networker. Plus besoin de cartes papier, un simple toucher suffit. Mes clients sont impressionnés.",
    rating: 5,
  },
  {
    name: "Thomas Laurent",
    title: "Avocat d'affaires",
    content:
      "L'intégration Apple Wallet est incroyable. Ma carte est toujours accessible depuis mon écran verrouillé. Professionnel et élégant.",
    rating: 5,
  },
  {
    name: "Sophie Mercier",
    title: "Directrice Marketing",
    content:
      "La capture de leads automatique m'a permis de suivre mes contacts efficacement. L'analyse des scans est un vrai plus.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Ils nous <span className="text-gradient-gold">font confiance</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Découvrez ce que nos utilisateurs disent de leur expérience IWASP
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={testimonial.name} className="animate-fade-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <Card variant="premium" className="h-full p-8">
                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} size={16} className="fill-primary text-primary" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-secondary-foreground leading-relaxed mb-6">"{testimonial.content}"</p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                    <span className="font-display font-bold text-primary">{testimonial.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
