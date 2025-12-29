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
  features: [
    "Official NFC card identity",
    "1:1 screen-to-print rendering",
    "Premium backgrounds",
    "Locked quality standards",
  ],
  badges: ["Signature", "Recommended", "Print-ready"],
};

// Secondary templates - Alternative styles with solid matte colors
const alternativeTemplates = [
  {
    id: "executive",
    name: "Executive",
    description: "Design sobre et professionnel pour dirigeants et cadres",
    bgColor: "bg-slate-900",
    cardColor: "bg-slate-800",
    features: ["Style premium", "Bordures dorées"],
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Élégance épurée et design minimaliste moderne",
    bgColor: "bg-neutral-900",
    cardColor: "bg-neutral-800",
    features: ["Ultra épuré", "Focus sur l'essentiel"],
  },
  {
    id: "modern",
    name: "Modern",
    description: "Design contemporain avec touches futuristes",
    bgColor: "bg-zinc-900",
    cardColor: "bg-zinc-800",
    features: ["Effets de verre", "Animations fluides"],
  },
  {
    id: "creative",
    name: "Creative",
    description: "Pour les professionnels créatifs et artistes",
    bgColor: "bg-stone-900",
    cardColor: "bg-stone-800",
    features: ["Layout unique", "Touches artistiques"],
  },
  {
    id: "tech",
    name: "Tech",
    description: "Design high-tech pour l'industrie technologique",
    bgColor: "bg-gray-900",
    cardColor: "bg-gray-800",
    features: ["Style cyberpunk", "Typographie moderne"],
  },
  {
    id: "luxe",
    name: "Luxe",
    description: "L'expression ultime du raffinement",
    bgColor: "bg-amber-950",
    cardColor: "bg-stone-900",
    features: ["Accents or", "Ultra premium"],
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
              NFC Cards <span className="text-gradient-gold">Collection</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Choose your physical NFC card design
            </p>
          </div>

          {/* PRIMARY TEMPLATE - IWASP Signature - Large showcase */}
          <div className="mb-20 animate-fade-up">
            <div className="flex items-center gap-3 mb-8">
              <Crown className="w-7 h-7 text-primary" />
              <h2 className="font-display text-2xl font-bold text-foreground">
                Official Card
              </h2>
            </div>

            <Card
              variant="premium"
              className="overflow-hidden border-primary/40 relative"
            >
              <div className="grid lg:grid-cols-2 gap-0">
                {/* Physical Card Preview - Front & Back */}
                <div className="bg-secondary relative overflow-hidden min-h-[420px] lg:min-h-[520px] flex items-center justify-center p-10">
                  {/* Subtle surface texture */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--secondary))_0%,hsl(var(--background))_100%)]" />
                  
                  {/* Badges - positioned above the cards */}
                  <div className="absolute top-6 left-6 z-10 flex flex-wrap gap-2">
                    {signatureTemplate.badges.map((badge) => (
                      <Badge
                        key={badge}
                        className="bg-primary text-primary-foreground border-0 shadow-lg px-3 py-1 text-sm font-semibold"
                      >
                        {badge === "Signature" && <Star className="w-3.5 h-3.5 mr-1.5" />}
                        {badge === "Print-ready" && <Printer className="w-3.5 h-3.5 mr-1.5" />}
                        {badge}
                      </Badge>
                    ))}
                  </div>

                  {/* Front & Back Cards Display */}
                  <div className="relative flex items-center justify-center gap-6">
                    {/* FRONT CARD */}
                    <div 
                      className="relative"
                      style={{ 
                        transform: "rotateY(-8deg) rotateX(3deg)",
                        transformStyle: "preserve-3d"
                      }}
                    >
                      {/* Label */}
                      <div className="absolute -top-6 left-0 right-0 text-center">
                        <span className="text-xs text-muted-foreground/60 font-medium tracking-wider uppercase">Front</span>
                      </div>
                      
                      {/* Card shadow */}
                      <div 
                        className="absolute inset-0 rounded-2xl bg-black/25 blur-xl"
                        style={{ transform: "translateY(16px) translateZ(-20px) scale(0.94)" }}
                      />
                      
                      {/* Physical card body - FRONT */}
                      <div 
                        className="relative w-[280px] aspect-[85.6/54] rounded-2xl bg-card border border-border/50 overflow-hidden"
                        style={{
                          boxShadow: `
                            0 20px 40px -12px rgba(0,0,0,0.35),
                            0 10px 20px -8px rgba(0,0,0,0.25),
                            inset 0 1px 0 rgba(255,255,255,0.1)
                          `
                        }}
                      >
                        {/* Matte surface */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />
                        
                        {/* IWASP ))) mark - LOCKED top-right */}
                        <div className="absolute top-3 right-3 flex items-center gap-1 opacity-50">
                          <span className="text-[9px] text-muted-foreground font-semibold tracking-widest">IWASP</span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-muted-foreground">
                            <path d="M2 12a5 5 0 0 1 5-5" />
                            <path d="M2 12a9 9 0 0 1 9-9" />
                            <circle cx="2" cy="12" r="1.5" fill="currentColor" />
                          </svg>
                        </div>
                        
                        {/* CENTERED CLIENT LOGO - dominant */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div 
                            className="w-36 h-20 rounded-lg border-2 border-dashed border-muted-foreground/20 flex items-center justify-center"
                          >
                            <span className="text-sm text-muted-foreground/50 font-semibold tracking-wide">YOUR LOGO</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* BACK CARD */}
                    <div 
                      className="relative"
                      style={{ 
                        transform: "rotateY(8deg) rotateX(3deg)",
                        transformStyle: "preserve-3d"
                      }}
                    >
                      {/* Label */}
                      <div className="absolute -top-6 left-0 right-0 text-center">
                        <span className="text-xs text-muted-foreground/60 font-medium tracking-wider uppercase">Back</span>
                      </div>
                      
                      {/* Card shadow */}
                      <div 
                        className="absolute inset-0 rounded-2xl bg-black/25 blur-xl"
                        style={{ transform: "translateY(16px) translateZ(-20px) scale(0.94)" }}
                      />
                      
                      {/* Physical card body - BACK */}
                      <div 
                        className="relative w-[280px] aspect-[85.6/54] rounded-2xl bg-card border border-border/50 overflow-hidden flex flex-col items-center justify-center"
                        style={{
                          boxShadow: `
                            0 20px 40px -12px rgba(0,0,0,0.35),
                            0 10px 20px -8px rgba(0,0,0,0.25),
                            inset 0 1px 0 rgba(255,255,255,0.1)
                          `
                        }}
                      >
                        {/* Matte surface */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />
                        
                        {/* NFC waves icon - centered */}
                        <svg 
                          width="32" 
                          height="32" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="1.5" 
                          strokeLinecap="round"
                          className="text-muted-foreground/50 mb-2"
                        >
                          <path d="M6 8.32a7.43 7.43 0 0 1 0 7.36" />
                          <path d="M9.46 6.21a11.76 11.76 0 0 1 0 11.58" />
                          <path d="M12.91 4.1a16.07 16.07 0 0 1 0 15.8" />
                          <circle cx="2" cy="12" r="2" fill="currentColor" />
                        </svg>
                        
                        {/* Tap gesture */}
                        <svg
                          width="48"
                          height="48"
                          viewBox="0 0 48 48"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-muted-foreground/30"
                        >
                          <rect x="16" y="8" width="16" height="32" rx="2" />
                          <line x1="16" y1="12" x2="32" y2="12" />
                          <line x1="16" y1="36" x2="32" y2="36" />
                          <circle cx="24" cy="24" r="1.5" fill="currentColor" />
                        </svg>
                        
                        {/* Powered by IWASP - bottom subtle */}
                        <span className="absolute bottom-3 text-[8px] text-muted-foreground/40 tracking-widest uppercase">
                          Powered by IWASP
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-10 lg:p-12 flex flex-col justify-center bg-card">
                  <h3 className="font-display text-4xl font-bold text-foreground mb-5">
                    {signatureTemplate.name}
                  </h3>
                  <p className="text-lg text-muted-foreground mb-8 whitespace-pre-line leading-relaxed">
                    {signatureTemplate.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-4 mb-10">
                    {signatureTemplate.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-4 text-secondary-foreground text-lg">
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <Check size={14} className="text-primary" />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link to="/create">
                    <Button variant="default" size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg">
                      <Crown className="w-5 h-5 mr-2" />
                      Create Signature Card
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>

          {/* SECONDARY TEMPLATES - Alternative styles */}
          <div className="animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center gap-3 mb-8">
              <h2 className="font-display text-xl font-semibold text-muted-foreground">
                Alternative Styles
              </h2>
              <Badge variant="outline" className="text-xs text-muted-foreground">
                Optional variants
              </Badge>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {alternativeTemplates.map((template, index) => (
                <div key={template.id} className="animate-fade-up" style={{ animationDelay: `${(index + 1) * 0.1}s` }}>
                  <Card
                    variant="elevated"
                    className="overflow-hidden group cursor-pointer opacity-85 hover:opacity-100 transition-all duration-300"
                  >
                    {/* Physical card preview - solid matte background */}
                    <div className={`aspect-[4/3] ${template.bgColor} relative overflow-hidden flex items-center justify-center p-8`}>
                      
                      {/* Physical card with depth */}
                      <div 
                        className="relative w-full max-w-[200px] aspect-[85.6/54]"
                        style={{ 
                          transform: "rotateX(3deg)",
                          transformStyle: "preserve-3d"
                        }}
                      >
                        {/* Soft shadow */}
                        <div 
                          className="absolute inset-0 rounded-xl bg-black/40 blur-xl"
                          style={{ transform: "translateY(12px) scale(0.92)" }}
                        />
                        
                        {/* Card body - simplified */}
                        <div 
                          className={`relative w-full h-full rounded-xl ${template.cardColor} border border-white/10 p-4 flex flex-col justify-between`}
                          style={{
                            boxShadow: `
                              0 15px 35px -10px rgba(0,0,0,0.5),
                              0 8px 16px -6px rgba(0,0,0,0.3),
                              inset 0 1px 0 rgba(255,255,255,0.05)
                            `
                          }}
                        >
                          {/* Logo placeholder - larger, cleaner */}
                          <div className="w-14 h-9 rounded bg-white/10 border border-white/10 flex items-center justify-center">
                            <span className="text-[8px] text-white/40 font-medium">LOGO</span>
                          </div>
                          
                          {/* Minimal content indicator */}
                          <div className="space-y-1">
                            <div className="w-16 h-1.5 rounded bg-white/20" />
                            <div className="w-10 h-1 rounded bg-white/10" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Info - simplified */}
                    <div className="p-5">
                      <h3 className="font-display text-lg font-semibold text-foreground mb-1.5">{template.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{template.description}</p>

                      {/* Features - reduced */}
                      <ul className="space-y-1.5 mb-5">
                        {template.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <div className="w-3 h-3 rounded-full bg-muted flex items-center justify-center">
                              <Check size={8} className="text-muted-foreground" />
                            </div>
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <Link to="/create">
                        <Button variant="outline" className="w-full" size="sm">
                          Use this style
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
