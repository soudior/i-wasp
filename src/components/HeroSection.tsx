import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DigitalCard } from "@/components/DigitalCard";
import { ArrowRight, Sparkles, Wallet, Smartphone, Zap } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Deep background */}
      <div className="absolute inset-0 bg-background" />

      {/* Ambient orbs */}
      <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] rounded-full bg-glow-subtle/20 blur-[120px] opacity-60" />
      <div className="absolute bottom-1/4 -right-20 w-[400px] h-[400px] rounded-full bg-glow-subtle/15 blur-[100px] opacity-50" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-glow-subtle/10 blur-[150px] opacity-40" />

      {/* Subtle grid */}
      <div className="absolute inset-0 bg-grid opacity-30" />

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-background/50 to-background" />

      <div className="container mx-auto px-6 py-20 pt-32 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left content */}
          <div className="space-y-8 animate-fade-right">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass animate-fade-up"
              style={{ animationDelay: "0.2s" }}
            >
              <Sparkles size={14} className="text-chrome" />
              <span className="text-sm text-chrome font-medium">Nouvelle génération de networking</span>
            </div>

            {/* Headline */}
            <div className="space-y-6">
              <h1
                className="text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.1] tracking-tight animate-fade-up"
                style={{ animationDelay: "0.3s" }}
              >
                <span className="text-foreground">Votre identité</span>
                <br />
                <span className="text-chrome">digitale premium</span>
              </h1>

              <p
                className="text-xl text-muted-foreground leading-relaxed max-w-xl animate-fade-up"
                style={{ animationDelay: "0.5s" }}
              >
                Créez des cartes de visite NFC élégantes et partagez-les instantanément. Apple Wallet, Google Wallet, un
                simple toucher suffit.
              </p>
            </div>

            {/* Features list */}
            <div className="grid grid-cols-2 gap-4 animate-fade-up" style={{ animationDelay: "0.6s" }}>
              {[
                { icon: Wallet, text: "Apple & Google Wallet" },
                { icon: Smartphone, text: "NFC compatible" },
                { icon: Zap, text: "Mise à jour instantanée" },
                { icon: Sparkles, text: "Templates premium" },
              ].map((feature, index) => (
                <div
                  key={feature.text}
                  className="flex items-center gap-3 group animate-fade-up"
                  style={{ animationDelay: `${0.7 + index * 0.1}s` }}
                >
                  <div className="w-10 h-10 rounded-xl glass flex items-center justify-center group-hover:bg-foreground/10 transition-colors duration-300">
                    <feature.icon size={18} className="text-chrome" />
                  </div>
                  <span className="text-sm text-secondary-foreground">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 pt-4 animate-fade-up" style={{ animationDelay: "0.9s" }}>
              <Link to="/signup">
                <Button variant="hero" size="xl">
                  Créer ma carte
                  <ArrowRight size={20} />
                </Button>
              </Link>
              <Link to="/templates">
                <Button variant="heroOutline" size="xl">
                  Voir les templates
                </Button>
              </Link>
            </div>
          </div>

          {/* Right content - Card preview */}
          <div className="relative lg:pl-8 animate-fade-left" style={{ animationDelay: "0.4s" }}>
            {/* NFC pulse effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
              <div className="nfc-wave w-48 h-48" style={{ animationDelay: "0s" }} />
              <div className="nfc-wave w-48 h-48" style={{ animationDelay: "0.8s" }} />
              <div className="nfc-wave w-48 h-48" style={{ animationDelay: "1.6s" }} />
            </div>

            {/* Floating card */}
            <div className="relative z-10">
              <DigitalCard />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
