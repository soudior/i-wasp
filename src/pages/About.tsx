import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Zap, Shield, Target, Crown, ArrowRight, Sparkles, BarChart3, Bell, Wifi } from "lucide-react";
import cardBlackMatte from "@/assets/cards/card-black-matte.webp";
import phoneBlack from "@/assets/phones/phone-black.webp";

export default function About() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section - L'Origine de la Révolution */}
      <section className="relative py-20 md:py-32 px-4 overflow-hidden">
        {/* Gold gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-black to-black" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-amber-600/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 mb-8">
            <Crown className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-medium text-amber-400">L'Origine de la Révolution</span>
          </div>
          
          {/* Title with Gold Shimmer */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
            i-wasp : L'Aube d'une Nouvelle Ère de Connexion
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto mb-12">
            i-wasp est née d'une <span className="text-amber-400 font-semibold">obsession</span> : 
            transformer chaque interaction physique en une opportunité digitale mesurable.
          </p>
          
          <p className="text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto">
            Nous avons osé fusionner la logistique des géants du web avec l'élégance du contact humain. 
            <span className="text-white font-medium"> i-wasp n'est pas une carte, c'est votre centre de commandement.</span>
          </p>
        </div>
      </section>

      {/* Visual Section - NFC Cards */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Card Image */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-transparent rounded-3xl blur-2xl" />
              <img 
                src={cardBlackMatte} 
                alt="Carte NFC i-wasp Premium" 
                className="relative w-full max-w-md mx-auto drop-shadow-2xl"
              />
            </div>
            
            {/* Features */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white mb-8">
                La Puissance d'une <span className="text-amber-400">Multinationale</span>
              </h2>
              
              {[
                { icon: BarChart3, title: "Dashboard Analytics", desc: "Statistiques en temps réel de vos scans et conversions" },
                { icon: Bell, title: "Push Notifications", desc: "Recontactez vos leads directement depuis l'app" },
                { icon: Wifi, title: "Magic Import", desc: "Générez votre profil en 3 secondes depuis une URL" },
                { icon: Shield, title: "vCard Gold V4", desc: "Standard professionnel avec logo et tous vos réseaux" },
              ].map((feature, i) => (
                <div 
                  key={i}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-amber-500/20 hover:border-amber-500/40 transition-colors"
                >
                  <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10">
                    <feature.icon className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{feature.title}</h3>
                    <p className="text-gray-400 text-sm">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-black via-amber-950/10 to-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 mb-4">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-medium text-amber-400">Dashboard Gold</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Votre Centre de <span className="text-amber-400">Commandement</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Visualisez vos performances, gérez vos leads et optimisez votre stratégie de networking en temps réel.
            </p>
          </div>
          
          {/* Phone Preview */}
          <div className="relative max-w-sm mx-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/30 to-transparent rounded-3xl blur-3xl" />
            <img 
              src={phoneBlack} 
              alt="Dashboard i-wasp Gold" 
              className="relative w-full drop-shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Nos <span className="text-amber-400">Trois Piliers</span>
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
                className="p-6 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-amber-500/20 hover:border-amber-500/40 transition-all group"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <value.icon className="w-7 h-7 text-amber-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{value.title}</h3>
                <p className="text-gray-400">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-amber-500/10 via-amber-600/5 to-transparent border border-amber-500/30">
            <Crown className="w-12 h-12 text-amber-400 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Prêt à Rejoindre l'Empire ?
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Rejoignez les centaines de professionnels qui ont déjà adopté les cartes NFC i-wasp.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/order">
                <Button size="lg" className="gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold px-8">
                  Rejoindre l'Empire i-wasp
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/vision">
                <Button variant="outline" size="lg" className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10">
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
