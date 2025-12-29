import { Smartphone, Wallet, Share2, Nfc } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Smartphone,
    title: "Créez votre carte",
    description: "Choisissez un template et personnalisez votre carte avec vos informations professionnelles.",
  },
  {
    number: "02",
    icon: Wallet,
    title: "Ajoutez au Wallet",
    description: "Intégrez votre carte à Apple Wallet ou Google Wallet pour un accès instantané.",
  },
  {
    number: "03",
    icon: Nfc,
    title: "Programmez votre NFC",
    description: "Associez votre lien unique à une carte NFC ou des ongles NFC avec NFC Tools.",
  },
  {
    number: "04",
    icon: Share2,
    title: "Partagez partout",
    description: "Un simple toucher NFC ou scan QR pour partager votre carte professionnelle.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-24 bg-secondary/20 relative overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Comment <span className="text-gradient-gold">ça marche</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Quatre étapes simples pour révolutionner votre networking
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="relative animate-fade-up" style={{ animationDelay: `${index * 0.15}s` }}>
                <div className="text-center">
                  {/* Number badge */}
                  <div className="relative inline-flex mb-6">
                    <div className="w-20 h-20 rounded-2xl bg-card border border-border flex items-center justify-center relative z-10">
                      <step.icon size={32} className="text-primary" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-gold text-primary-foreground text-sm font-bold flex items-center justify-center">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-semibold text-foreground mb-3">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
