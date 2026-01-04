import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Zap, Shield, Target, Crown, ArrowRight, Sparkles, BarChart3, Bell, Wifi } from "lucide-react";
import { IWASPLogo } from "@/components/IWASPLogo";
import { DashboardPreview } from "@/components/DashboardPreview";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 texture-honeycomb opacity-30" />
        
        <div className="relative max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border mb-8">
            <Crown className="w-4 h-4 text-foreground" />
            <span className="text-sm font-medium text-foreground">Notre Histoire</span>
          </div>
          
          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground tracking-tight">
            i-Wasp : L'Aube d'une Nouvelle Ère
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-12">
            Née d'une <span className="text-foreground font-semibold">obsession</span> : 
            transformer chaque interaction physique en une opportunité digitale mesurable.
          </p>
          
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Nous avons osé fusionner la logistique des géants du web avec l'élégance du contact humain. 
            <span className="text-foreground font-medium"> i-Wasp n'est pas une carte, c'est votre centre de commandement.</span>
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Card Preview */}
            <div className="relative">
              <div className="relative p-8 rounded-3xl bg-card border border-border shadow-lg">
                <IWASPLogo size="xl" className="justify-center mb-6" />
                <p className="text-center text-muted-foreground">
                  Design premium. Technologie invisible.
                </p>
              </div>
            </div>
            
            {/* Features */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-foreground mb-8 tracking-tight">
                La Puissance d'une Multinationale
              </h2>
              
              {[
                { icon: BarChart3, title: "Dashboard Analytics", desc: "Statistiques en temps réel de vos scans et conversions" },
                { icon: Bell, title: "Push Notifications", desc: "Recontactez vos leads directement depuis l'app" },
                { icon: Wifi, title: "Magic Import", desc: "Générez votre profil en 3 secondes depuis une URL" },
                { icon: Shield, title: "vCard Gold V4", desc: "Standard professionnel avec logo et tous vos réseaux" },
              ].map((feature, i) => (
                <div 
                  key={i}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-card border border-border hover:shadow-md transition-shadow"
                >
                  <div className="p-3 rounded-xl bg-accent">
                    <feature.icon className="w-5 h-5 text-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border mb-4">
              <Sparkles className="w-4 h-4 text-foreground" />
              <span className="text-xs font-medium text-foreground">Capture Réelle du Dashboard</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">
              Votre Centre de Commandement
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Visualisez vos performances, gérez vos leads et optimisez votre stratégie de networking en temps réel.
            </p>
          </div>
          
          {/* Real Dashboard Previews */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <DashboardPreview variant="analytics" />
            <DashboardPreview variant="leads" />
          </div>
          
          {/* Proof badge */}
          <div className="text-center mt-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border">
              <div className="w-2 h-2 rounded-full bg-foreground animate-pulse" />
              <span className="text-sm text-foreground">Interface réelle • Données en direct</span>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 bg-secondary/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12 tracking-tight">
            Nos Trois Piliers
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                icon: Zap, 
                title: "L'Antériorité", 
                desc: "Nous avons osé le faire en premier. Le premier écosystème NFC complet au Maroc."
              },
              { 
                icon: Target, 
                title: "L'Intégration", 
                desc: "VCard, Stories, WiFi, Leads, Push — tout en un seul endroit. Zéro friction."
              },
              { 
                icon: Crown, 
                title: "Le Prestige", 
                desc: "Notre identité n'est pas un gadget, c'est un standard de luxe inspiré des Riads de Marrakech."
              },
            ].map((value, i) => (
              <div 
                key={i}
                className="p-6 rounded-3xl bg-card border border-border hover:shadow-lg transition-shadow group"
              >
                <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center mb-4 group-hover:bg-foreground group-hover:text-background transition-colors">
                  <value.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="p-8 md:p-12 rounded-3xl bg-foreground text-background">
            <Crown className="w-12 h-12 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Prêt à Nous Rejoindre ?
            </h2>
            <p className="text-background/70 mb-8 max-w-xl mx-auto">
              Rejoignez les centaines de professionnels qui ont déjà adopté les cartes NFC i-Wasp.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/order/type">
                <Button size="lg" className="gap-2 bg-background text-foreground hover:bg-background/90 font-semibold px-8">
                  Commander ma Carte
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/vision">
                <Button variant="outline" size="lg" className="border-background/30 text-background hover:bg-background/10">
                  Notre Vision
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
