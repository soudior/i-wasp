import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

// Minimal card preview component
function CardPreview({ bgClass = "bg-[hsl(0,0%,4%)]" }: { bgClass?: string }) {
  return (
    <div 
      className="relative w-full max-w-[180px]"
      style={{ aspectRatio: "85.6/54" }}
    >
      {/* Subtle shadow */}
      <div 
        className="absolute inset-0 rounded-lg bg-black/20 blur-xl"
        style={{ transform: "translateY(10px) scale(0.9)" }}
      />
      
      {/* Card body - pure, no decorative elements */}
      <div 
        className={`relative w-full h-full rounded-lg ${bgClass} overflow-hidden`}
        style={{
          boxShadow: `
            0 15px 30px -10px rgba(0,0,0,0.5),
            0 0 0 1px rgba(255,255,255,0.02)
          `
        }}
      >
        {/* Logo placeholder - clean circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-10 h-10 rounded-full border border-foreground/8" />
        </div>

        {/* Name lines - subtle */}
        <div className="absolute bottom-3 left-3">
          <div className="w-12 h-0.5 rounded-full bg-foreground/12" />
          <div className="w-8 h-0.5 rounded-full bg-foreground/6 mt-1" />
        </div>
      </div>
    </div>
  );
}

export function TemplatesSection() {
  return (
    <section className="py-32 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-5xl">
        
        {/* Header - Minimal, elegant */}
        <div className="text-center mb-20">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground tracking-tight mb-6">
            Carte Signature
          </h2>
          <p className="text-muted-foreground text-lg font-light tracking-wide max-w-lg mx-auto">
            L'identité professionnelle dans sa forme la plus pure.
          </p>
        </div>

        {/* Single card showcase - centered, prominent */}
        <div className="flex flex-col items-center mb-16">
          {/* Card container with subtle background */}
          <div className="relative w-full max-w-md aspect-[4/3] rounded-3xl bg-[hsl(0,0%,3%)] flex items-center justify-center mb-12">
            {/* Top gradient line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/8 to-transparent" />
            
            {/* Card preview - larger, centered */}
            <div 
              className="relative w-[280px]"
              style={{ aspectRatio: "85.6/54" }}
            >
              {/* Shadow */}
              <div 
                className="absolute inset-0 rounded-xl bg-black/25 blur-2xl"
                style={{ transform: "translateY(16px) scale(0.88)" }}
              />
              
              {/* Card body */}
              <div 
                className="relative w-full h-full rounded-xl bg-[hsl(0,0%,4%)] overflow-hidden"
                style={{
                  boxShadow: `
                    0 25px 50px -15px rgba(0,0,0,0.6),
                    0 0 0 1px rgba(255,255,255,0.02)
                  `
                }}
              >
                {/* IWASP mark */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5 opacity-25">
                  <span className="text-[8px] text-foreground font-semibold tracking-[0.15em] uppercase">IWASP</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-foreground/70">
                    <path d="M2 12a5 5 0 0 1 5-5" />
                    <path d="M2 12a9 9 0 0 1 9-9" />
                    <circle cx="2" cy="12" r="1.5" fill="currentColor" />
                  </svg>
                </div>
                
                {/* Logo placeholder */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="w-14 h-14 rounded-full border border-foreground/10 flex items-center justify-center">
                    <span className="text-[8px] text-foreground/25 font-medium tracking-wider uppercase">Logo</span>
                  </div>
                </div>

                {/* Name */}
                <div className="absolute bottom-4 left-4">
                  <div className="w-16 h-0.5 rounded-full bg-foreground/15" />
                  <div className="w-10 h-0.5 rounded-full bg-foreground/8 mt-1.5" />
                </div>
              </div>
            </div>

            {/* Bottom gradient line */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/5 to-transparent" />
          </div>

          {/* Features - minimal list */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mb-12 text-sm text-muted-foreground/60">
            <span className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-foreground/30" />
              NFC intégré
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-foreground/30" />
              Qualité premium
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-foreground/30" />
              Design personnalisé
            </span>
          </div>
        </div>

        {/* CTA - elegant button */}
        <div className="text-center">
          <Link to="/templates">
            <Button 
              size="lg" 
              className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-10 py-6 text-sm font-medium tracking-wide"
            >
              Voir la collection
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
