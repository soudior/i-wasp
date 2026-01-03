import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import nfcCardWaxSeal from "@/assets/nfc-card-wax-seal.png";
import nfcEnvelopesLuxury from "@/assets/nfc-envelopes-luxury.png";

const stats = [
  { value: "10K+", label: "Professionnels" },
  { value: "4.9/5", label: "Note moyenne" },
  { value: "50K+", label: "Cartes créées" },
];

const WHATSAPP_FREE_URL = "https://wa.me/33626424394?text=Bonjour%20👋%0AJe%20souhaite%20commencer%20gratuitement%20avec%20une%20carte%20NFC%20i-wasp.";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-background">
      {/* Simple grid background */}
      <div className="absolute inset-0 bg-grid opacity-30" />

      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-12 items-center">
          <div className="space-y-8 max-w-xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-sm text-muted-foreground font-medium">Technologie NFC Premium</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-semibold leading-[1.1] tracking-tight">
              <span className="text-foreground">Partagez vos contacts</span>
              <br />
              <span className="text-primary">en un seul geste</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg text-muted-foreground leading-relaxed">
              Une carte NFC premium. Un achat unique. Votre profil digital inclus à vie.
              <span className="block mt-2 text-muted-foreground/70">
                Compatible tous smartphones · Apple & Google Wallet
              </span>
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-start gap-4 pt-2">
              <div className="flex flex-col items-start">
                <a 
                  href={WHATSAPP_FREE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button 
                    size="lg" 
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 rounded-full transition-colors"
                  >
                    Commencer gratuitement
                    <ArrowRight size={18} className="ml-2" />
                  </Button>
                </a>
                <span className="text-sm text-muted-foreground mt-2 ml-2">Sans inscription</span>
              </div>
              <Link to="/demo">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-border text-foreground hover:bg-muted px-8 py-6 rounded-full font-medium transition-colors"
                >
                  Voir une démo
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 pt-6 border-t border-border">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-2xl font-display font-semibold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="relative">
              {/* Main card image */}
              <img
                src={nfcCardWaxSeal}
                alt="Carte NFC IWASP premium noir mat avec cachet de cire"
                className="relative z-10 w-full h-auto rounded-3xl shadow-2xl"
                loading="lazy"
              />
              
              {/* Floating envelopes */}
              <div className="absolute -bottom-8 -right-8 lg:-right-16 w-40 lg:w-56 z-20">
                <img
                  src={nfcEnvelopesLuxury}
                  alt="Enveloppes NFC premium avec cachet de cire"
                  className="w-full h-auto rounded-2xl shadow-xl"
                  loading="lazy"
                />
              </div>
              
              {/* Premium badge */}
              <div className="absolute top-4 right-4 lg:top-8 lg:right-8 flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/90 backdrop-blur-sm border border-border">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-xs font-medium text-foreground">NFC Premium</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
