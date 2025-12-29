import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Printer, Star } from "lucide-react";
import { Link } from "react-router-dom";

// Primary template - IWASP Signature
const signatureTemplate = {
  id: "iwasp-signature",
  name: "IWASP Signature",
  description: "The iconic IWASP design.\nIdentical screen-to-print. Zero compromise.",
  gradient: "from-background via-secondary to-background",
  features: [
    "Official NFC card identity",
    "1:1 screen-to-print rendering",
    "Premium backgrounds",
    "Locked quality standards",
  ],
  badges: ["Signature", "Recommended", "Print-ready"],
};

// Secondary templates - Alternative styles
const alternativeTemplates = [
  {
    id: "executive",
    name: "Executive",
    description: "Design sobre et professionnel pour dirigeants et cadres",
    gradient: "from-slate-900 via-slate-800 to-slate-900",
    features: ["Style premium", "Bordures dorées", "Typographie élégante"],
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Élégance épurée et design minimaliste moderne",
    gradient: "from-neutral-900 via-neutral-800 to-neutral-900",
    features: ["Ultra épuré", "Focus sur l'essentiel", "Lignes fines"],
  },
  {
    id: "modern",
    name: "Modern",
    description: "Design contemporain avec touches futuristes",
    gradient: "from-zinc-900 via-zinc-800 to-zinc-900",
    features: ["Effets de verre", "Dégradés subtils", "Animations fluides"],
  },
  {
    id: "creative",
    name: "Creative",
    description: "Pour les professionnels créatifs et artistes",
    gradient: "from-stone-900 via-stone-800 to-stone-900",
    features: ["Layout unique", "Touches artistiques", "Personnalisable"],
  },
  {
    id: "tech",
    name: "Tech",
    description: "Design high-tech pour l'industrie technologique",
    gradient: "from-gray-900 via-gray-800 to-gray-900",
    features: ["Style cyberpunk", "Effets néon", "Typographie moderne"],
  },
  {
    id: "luxe",
    name: "Luxe",
    description: "L'expression ultime du raffinement",
    gradient: "from-amber-950 via-stone-900 to-amber-950",
    features: ["Accents or", "Textures riches", "Ultra premium"],
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

          {/* PRIMARY TEMPLATE - IWASP Signature */}
          <div className="mb-16 animate-fade-up">
            <div className="flex items-center gap-3 mb-6">
              <Crown className="w-6 h-6 text-primary" />
              <h2 className="font-display text-2xl font-bold text-foreground">
                Template Officiel
              </h2>
            </div>

            <Card
              variant="premium"
              className="overflow-hidden group cursor-pointer border-primary/30 hover:border-primary/60 transition-all duration-500 relative"
            >
              {/* Badges */}
              <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
                {signatureTemplate.badges.map((badge) => (
                  <Badge
                    key={badge}
                    variant="default"
                    className="bg-gradient-gold text-primary-foreground border-0 shadow-lg"
                  >
                    {badge === "Signature" && <Star className="w-3 h-3 mr-1" />}
                    {badge === "Print-ready" && <Printer className="w-3 h-3 mr-1" />}
                    {badge}
                  </Badge>
                ))}
              </div>

              <div className="grid lg:grid-cols-2 gap-0">
                {/* Preview */}
                <div className={`aspect-[4/3] lg:aspect-auto bg-gradient-to-br ${signatureTemplate.gradient} relative overflow-hidden min-h-[300px] lg:min-h-[400px]`}>
                  {/* NFC Card mockup - Signature style */}
                  <div className="absolute inset-0 flex items-center justify-center p-8">
                    <div className="w-full max-w-[320px] aspect-[85.6/54] rounded-xl border-2 border-primary/30 bg-card/80 backdrop-blur-sm p-6 transform group-hover:scale-105 transition-transform duration-500 shadow-2xl relative overflow-hidden">
                      {/* IWASP + NFC mark */}
                      <div className="absolute top-3 right-3 flex items-center gap-1.5 text-[10px] text-muted-foreground/60 font-medium tracking-wider">
                        <span>IWASP</span>
                        <div className="w-4 h-4 rounded border border-muted-foreground/30 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-sm bg-primary/40" />
                        </div>
                      </div>
                      
                      {/* Centered logo placeholder */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-32 h-20 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 flex items-center justify-center">
                          <span className="text-sm text-muted-foreground/60 font-medium">YOUR LOGO</span>
                        </div>
                      </div>
                      
                      {/* NFC zone indicator */}
                      <div className="absolute bottom-3 right-3 w-10 h-10 rounded-full border border-dashed border-primary/30 flex items-center justify-center">
                        <div className="w-5 h-5 rounded-full bg-primary/10" />
                      </div>
                    </div>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Info */}
                <div className="p-8 lg:p-10 flex flex-col justify-center">
                  <h3 className="font-display text-3xl font-bold text-foreground mb-4">
                    {signatureTemplate.name}
                  </h3>
                  <p className="text-lg text-muted-foreground mb-6 whitespace-pre-line">
                    {signatureTemplate.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {signatureTemplate.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-secondary-foreground">
                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <Check size={12} className="text-primary" />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link to="/create">
                    <Button variant="default" size="lg" className="w-full sm:w-auto bg-gradient-gold hover:opacity-90 text-primary-foreground">
                      <Crown className="w-4 h-4 mr-2" />
                      Créer ma carte Signature
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>

          {/* SECONDARY TEMPLATES - Alternative styles */}
          <div className="animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center gap-3 mb-6">
              <h2 className="font-display text-xl font-semibold text-muted-foreground">
                Styles alternatifs
              </h2>
              <Badge variant="outline" className="text-xs">
                Variantes optionnelles
              </Badge>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {alternativeTemplates.map((template, index) => (
                <div key={template.id} className="relative animate-fade-up" style={{ animationDelay: `${(index + 1) * 0.1}s` }}>
                  <Card
                    variant="premium"
                    className="overflow-hidden group cursor-pointer hover:border-border/60 transition-all duration-500 opacity-90 hover:opacity-100"
                  >
                    {/* Preview */}
                    <div className={`aspect-[4/5] bg-gradient-to-br ${template.gradient} relative overflow-hidden`}>
                      {/* Card mockup */}
                      <div className="absolute inset-0 flex items-center justify-center p-6">
                        <div className="w-full max-w-[180px] rounded-xl border border-border/20 bg-background/5 backdrop-blur-sm p-5 transform group-hover:scale-105 transition-transform duration-500">
                          <div className="w-10 h-10 rounded-lg bg-primary/20 mb-3" />
                          <div className="space-y-2">
                            <div className="w-3/4 h-2.5 rounded bg-foreground/30" />
                            <div className="w-1/2 h-2 rounded bg-foreground/20" />
                          </div>
                          <div className="mt-5 space-y-1.5">
                            <div className="w-full h-1.5 rounded bg-foreground/10" />
                            <div className="w-full h-1.5 rounded bg-foreground/10" />
                          </div>
                          <div className="mt-5 flex gap-2">
                            <div className="flex-1 h-7 rounded-lg bg-primary/30" />
                            <div className="flex-1 h-7 rounded-lg bg-foreground/10" />
                          </div>
                        </div>
                      </div>

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Info */}
                    <div className="p-5">
                      <h3 className="font-display text-lg font-semibold text-foreground mb-1.5">{template.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{template.description}</p>

                      {/* Features */}
                      <ul className="space-y-1.5 mb-4">
                        {template.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-2 text-xs text-secondary-foreground">
                            <div className="w-3.5 h-3.5 rounded-full bg-muted flex items-center justify-center">
                              <Check size={8} className="text-muted-foreground" />
                            </div>
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <Link to="/create">
                        <Button variant="outline" className="w-full" size="sm">
                          Utiliser ce style
                        </Button>
                      </Link>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Templates;
