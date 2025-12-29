import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const templates = [
  {
    id: "executive",
    name: "Executive",
    description: "Pour les dirigeants et cadres supérieurs",
    gradient: "from-slate-900 to-slate-800",
    accent: "gold",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Élégance épurée et sophistiquée",
    gradient: "from-neutral-900 to-neutral-800",
    accent: "white",
  },
  {
    id: "modern",
    name: "Modern",
    description: "Design contemporain audacieux",
    gradient: "from-zinc-900 to-zinc-800",
    accent: "chrome",
  },
  {
    id: "creative",
    name: "Creative",
    description: "Pour les professionnels créatifs",
    gradient: "from-stone-900 to-stone-800",
    accent: "rose",
  },
];

export function TemplatesSection() {
  return (
    <section className="py-24 bg-secondary/30 relative overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Templates <span className="text-gradient-gold">premium</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choisissez parmi notre collection de templates exclusifs conçus par des designers de renom
          </p>
        </motion.div>

        {/* Templates grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {templates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card variant="premium" className="group cursor-pointer hover:border-primary/50 transition-all duration-500 overflow-hidden">
                {/* Preview */}
                <div className={`aspect-[3/4] bg-gradient-to-br ${template.gradient} relative overflow-hidden`}>
                  {/* Decorative elements */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-32 rounded-lg border border-border/30 bg-background/5 backdrop-blur-sm flex flex-col items-center justify-center gap-2 p-4">
                      <div className="w-10 h-10 rounded-full bg-primary/20" />
                      <div className="w-16 h-2 rounded bg-foreground/20" />
                      <div className="w-12 h-2 rounded bg-foreground/10" />
                    </div>
                  </div>
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Shine effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 animate-shimmer" />
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-display font-semibold text-foreground mb-1">
                    {template.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {template.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <Link to="/templates">
            <Button variant="gold" size="lg">
              Voir tous les templates
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
