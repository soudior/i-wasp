import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const templates = [
  {
    id: "executive",
    name: "Executive",
    description: "Design sobre et professionnel pour dirigeants et cadres",
    gradient: "from-slate-900 via-slate-800 to-slate-900",
    features: ["Style premium", "Bordures dorées", "Typographie élégante"],
    popular: true,
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Élégance épurée et design minimaliste moderne",
    gradient: "from-neutral-900 via-neutral-800 to-neutral-900",
    features: ["Ultra épuré", "Focus sur l'essentiel", "Lignes fines"],
    popular: false,
  },
  {
    id: "modern",
    name: "Modern",
    description: "Design contemporain avec touches futuristes",
    gradient: "from-zinc-900 via-zinc-800 to-zinc-900",
    features: ["Effets de verre", "Dégradés subtils", "Animations fluides"],
    popular: false,
  },
  {
    id: "creative",
    name: "Creative",
    description: "Pour les professionnels créatifs et artistes",
    gradient: "from-stone-900 via-stone-800 to-stone-900",
    features: ["Layout unique", "Touches artistiques", "Personnalisable"],
    popular: false,
  },
  {
    id: "tech",
    name: "Tech",
    description: "Design high-tech pour l'industrie technologique",
    gradient: "from-gray-900 via-gray-800 to-gray-900",
    features: ["Style cyberpunk", "Effets néon", "Typographie moderne"],
    popular: false,
  },
  {
    id: "luxe",
    name: "Luxe",
    description: "L'expression ultime du raffinement",
    gradient: "from-amber-950 via-stone-900 to-amber-950",
    features: ["Accents or", "Textures riches", "Ultra premium"],
    popular: true,
  },
];

const Templates = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-up">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Templates <span className="text-gradient-gold">premium</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Choisissez parmi notre collection exclusive de templates conçus par des designers de renom
            </p>
          </div>

          {/* Templates grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {templates.map((template, index) => (
              <div key={template.id} className="relative animate-fade-up" style={{ animationDelay: `${index * 0.1}s` }}>
                {template.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-gold text-primary-foreground text-xs font-medium rounded-full z-10">
                    Populaire
                  </div>
                )}

                <Card
                  variant="premium"
                  className="overflow-hidden group cursor-pointer hover:border-primary/50 transition-all duration-500"
                >
                  {/* Preview */}
                  <div className={`aspect-[4/5] bg-gradient-to-br ${template.gradient} relative overflow-hidden`}>
                    {/* Card mockup */}
                    <div className="absolute inset-0 flex items-center justify-center p-6">
                      <div className="w-full max-w-[200px] rounded-xl border border-border/20 bg-background/5 backdrop-blur-sm p-6 transform group-hover:scale-105 transition-transform duration-500">
                        <div className="w-12 h-12 rounded-xl bg-primary/20 mb-4" />
                        <div className="space-y-2">
                          <div className="w-3/4 h-3 rounded bg-foreground/30" />
                          <div className="w-1/2 h-2 rounded bg-foreground/20" />
                        </div>
                        <div className="mt-6 space-y-2">
                          <div className="w-full h-2 rounded bg-foreground/10" />
                          <div className="w-full h-2 rounded bg-foreground/10" />
                        </div>
                        <div className="mt-6 flex gap-2">
                          <div className="flex-1 h-8 rounded-lg bg-primary/30" />
                          <div className="flex-1 h-8 rounded-lg bg-foreground/10" />
                        </div>
                      </div>
                    </div>

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Info */}
                  <div className="p-6">
                    <h3 className="font-display text-xl font-semibold text-foreground mb-2">{template.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{template.description}</p>

                    {/* Features */}
                    <ul className="space-y-2 mb-6">
                      {template.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-secondary-foreground">
                          <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                            <Check size={10} className="text-primary" />
                          </div>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Link to="/create">
                      <Button variant="chrome" className="w-full">
                        Utiliser ce template
                      </Button>
                    </Link>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Templates;
