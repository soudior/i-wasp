import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";

// Primary template - IWASP Signature
const signatureTemplate = {
  id: "iwasp-signature",
  name: "IWASP Signature",
  tagline: "L'identité professionnelle dans sa forme la plus pure.",
  description: "La carte NFC officielle IWASP. Rendu écran-impression identique. Zéro compromis.",
};

// Secondary templates - Positioned as stylistic variants
const alternativeTemplates = [
  {
    id: "executive",
    name: "Série Business",
    subtitle: "Executive",
    description: "Pour les dirigeants et cadres",
    bgClass: "bg-[hsl(220,20%,8%)]", // Midnight blue
  },
  {
    id: "minimal",
    name: "Série Essential",
    subtitle: "Minimal",
    description: "L'élégance épurée",
    bgClass: "bg-[hsl(0,0%,6%)]", // Deep black
  },
  {
    id: "modern",
    name: "Série Contemporary",
    subtitle: "Modern",
    description: "Design intemporel",
    bgClass: "bg-[hsl(0,0%,12%)]", // Graphite gray
  },
];

// Flippable Card Component - Luxury minimal design
function FlippableCard() {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Click hint - minimal */}
      <button
        onClick={() => setIsFlipped(!isFlipped)}
        className="absolute -top-4 z-20 flex items-center gap-2 px-4 py-2 rounded-full bg-foreground/5 text-xs text-muted-foreground/60 font-medium tracking-wide hover:bg-foreground/10 transition-colors cursor-pointer"
      >
        <RotateCcw className="w-3 h-3" />
        Retourner
      </button>

      {/* 3D Card Container */}
      <div
        className="relative cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
        style={{
          perspective: "1200px",
          width: "340px",
          height: "214px", // 85.6/54 aspect ratio
        }}
      >
        <div
          className="relative w-full h-full transition-transform duration-700 ease-out"
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* FRONT SIDE */}
          <div
            className="absolute inset-0"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            {/* Card shadow - very subtle */}
            <div 
              className="absolute inset-0 rounded-2xl bg-black/20 blur-3xl"
              style={{ transform: "translateY(24px) scale(0.88)" }}
            />
            
            {/* Physical card body - FRONT - Deep black, no effects */}
            <div 
              className="relative w-full h-full rounded-2xl bg-[hsl(0,0%,4%)] overflow-hidden"
              style={{
                boxShadow: `
                  0 30px 60px -20px rgba(0,0,0,0.6),
                  0 0 0 1px rgba(255,255,255,0.03)
                `
              }}
            >
              {/* IWASP mark - top right, very subtle */}
              <div className="absolute top-5 right-6 flex items-center gap-2 opacity-30">
                <span className="text-[9px] text-foreground/80 font-semibold tracking-[0.2em] uppercase">IWASP</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-foreground/60">
                  <path d="M2 12a5 5 0 0 1 5-5" />
                  <path d="M2 12a9 9 0 0 1 9-9" />
                  <path d="M2 12a13 13 0 0 1 13-13" />
                  <circle cx="2" cy="12" r="1.5" fill="currentColor" />
                </svg>
              </div>
              
              {/* CENTERED CLIENT LOGO - dominant, clean circle */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full border border-foreground/10 flex items-center justify-center">
                  <span className="text-[10px] text-foreground/30 font-medium tracking-[0.15em] uppercase">Logo</span>
                </div>
              </div>

              {/* Name and title - bottom left, elegant typography */}
              <div className="absolute bottom-6 left-6">
                <p className="text-foreground/90 text-sm font-medium tracking-wide">Alexandre Dubois</p>
                <p className="text-foreground/40 text-xs tracking-wide mt-0.5">Directeur Général</p>
              </div>
            </div>
          </div>

          {/* BACK SIDE */}
          <div
            className="absolute inset-0"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            {/* Card shadow */}
            <div 
              className="absolute inset-0 rounded-2xl bg-black/20 blur-3xl"
              style={{ transform: "translateY(24px) scale(0.88)" }}
            />
            
            {/* Physical card body - BACK */}
            <div 
              className="relative w-full h-full rounded-2xl bg-[hsl(0,0%,4%)] overflow-hidden flex flex-col items-center justify-center"
              style={{
                boxShadow: `
                  0 30px 60px -20px rgba(0,0,0,0.6),
                  0 0 0 1px rgba(255,255,255,0.03)
                `
              }}
            >
              {/* NFC waves icon - centered, minimal */}
              <svg 
                width="32" 
                height="32" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1" 
                strokeLinecap="round"
                className="text-foreground/25 mb-4"
              >
                <path d="M6 8.32a7.43 7.43 0 0 1 0 7.36" />
                <path d="M9.46 6.21a11.76 11.76 0 0 1 0 11.58" />
                <path d="M12.91 4.1a16.07 16.07 0 0 1 0 15.8" />
                <circle cx="2" cy="12" r="2" fill="currentColor" />
              </svg>
              
              {/* Tap instruction */}
              <span className="text-[10px] text-foreground/20 tracking-[0.2em] uppercase font-medium">
                Approcher pour scanner
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Current side indicator - minimal dots */}
      <div className="mt-8 flex items-center gap-3">
        <div 
          className={`w-1.5 h-1.5 rounded-full transition-colors ${!isFlipped ? 'bg-foreground/60' : 'bg-foreground/15'}`}
        />
        <div 
          className={`w-1.5 h-1.5 rounded-full transition-colors ${isFlipped ? 'bg-foreground/60' : 'bg-foreground/15'}`}
        />
      </div>
    </div>
  );
}

// Minimal card preview for secondary templates
function MinimalCardPreview({ bgClass }: { bgClass: string }) {
  return (
    <div 
      className="relative w-full max-w-[200px] mx-auto"
      style={{ aspectRatio: "85.6/54" }}
    >
      {/* Subtle shadow */}
      <div 
        className="absolute inset-0 rounded-xl bg-black/15 blur-2xl"
        style={{ transform: "translateY(12px) scale(0.9)" }}
      />
      
      {/* Card body */}
      <div 
        className={`relative w-full h-full rounded-xl ${bgClass} overflow-hidden`}
        style={{
          boxShadow: `
            0 20px 40px -15px rgba(0,0,0,0.5),
            0 0 0 1px rgba(255,255,255,0.02)
          `
        }}
      >
        {/* Logo placeholder - clean circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-12 h-12 rounded-full border border-foreground/8 flex items-center justify-center">
            <span className="text-[7px] text-foreground/20 font-medium tracking-wider uppercase">Logo</span>
          </div>
        </div>

        {/* Name line - subtle */}
        <div className="absolute bottom-4 left-4">
          <div className="w-16 h-1 rounded-full bg-foreground/15" />
          <div className="w-10 h-0.5 rounded-full bg-foreground/8 mt-1.5" />
        </div>
      </div>
    </div>
  );
}

const Templates = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-32 pb-24">
        <div className="container mx-auto px-6 max-w-6xl">
          
          {/* Header - Minimal, luxe */}
          <div className="text-center mb-24">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground tracking-tight mb-6">
              Collection
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl font-light tracking-wide max-w-md mx-auto">
              Cartes NFC professionnelles
            </p>
          </div>

          {/* PRIMARY TEMPLATE - IWASP Signature - Full focus */}
          <div className="mb-32">
            {/* Signature badge - subtle, elegant */}
            <div className="flex items-center justify-center gap-3 mb-12">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-foreground/20" />
              <span className="text-[10px] text-foreground/50 font-medium tracking-[0.3em] uppercase">
                Recommandée
              </span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-foreground/20" />
            </div>

            {/* Card showcase - full width, breathing room */}
            <div className="relative bg-[hsl(0,0%,3%)] rounded-3xl overflow-hidden">
              {/* Top subtle gradient */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
              
              <div className="grid lg:grid-cols-2 gap-0">
                {/* Physical Card Preview */}
                <div className="relative min-h-[450px] lg:min-h-[550px] flex items-center justify-center p-12">
                  <FlippableCard />
                </div>

                {/* Info - elegant typography */}
                <div className="p-12 lg:p-16 flex flex-col justify-center border-l border-foreground/5">
                  <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground tracking-tight mb-4">
                    {signatureTemplate.name}
                  </h2>
                  
                  <p className="text-foreground/50 text-base md:text-lg font-light leading-relaxed mb-8 max-w-md">
                    {signatureTemplate.tagline}
                  </p>

                  <p className="text-muted-foreground text-sm leading-relaxed mb-12 max-w-md">
                    {signatureTemplate.description}
                  </p>

                  <Link to="/create">
                    <Button 
                      size="lg" 
                      className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-8 py-6 text-sm font-medium tracking-wide"
                    >
                      Créer ma carte
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Bottom subtle gradient */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/5 to-transparent" />
            </div>
          </div>

          {/* SECONDARY TEMPLATES - Less prominent */}
          <div>
            {/* Section header - very subtle */}
            <div className="flex items-center justify-center gap-4 mb-16">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-foreground/10" />
              <span className="text-[10px] text-muted-foreground/50 font-medium tracking-[0.3em] uppercase">
                Variantes
              </span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-foreground/10" />
            </div>

            {/* Templates grid - minimal, muted */}
            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {alternativeTemplates.map((template) => (
                <Link 
                  key={template.id} 
                  to="/create"
                  className="group"
                >
                  <div className="space-y-6">
                    {/* Card preview container */}
                    <div className="relative py-12 rounded-2xl bg-[hsl(0,0%,2%)] border border-foreground/5 group-hover:border-foreground/10 transition-colors duration-500">
                      <MinimalCardPreview bgClass={template.bgClass} />
                    </div>

                    {/* Info - small, subtle */}
                    <div className="text-center px-4">
                      <p className="text-[10px] text-muted-foreground/40 font-medium tracking-[0.2em] uppercase mb-2">
                        {template.name}
                      </p>
                      <h3 className="font-display text-lg font-medium text-foreground/80 mb-1">
                        {template.subtitle}
                      </h3>
                      <p className="text-sm text-muted-foreground/50 font-light">
                        {template.description}
                      </p>
                    </div>
                  </div>
                </Link>
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
