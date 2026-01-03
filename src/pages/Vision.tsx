import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Crown, Globe, Sparkles, Users, Zap, ArrowRight, Building2, MapPin, Bell, BarChart3 } from "lucide-react";
import phoneGold from "@/assets/phones/phone-gold.png";

export default function Vision() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section - Notre Vision */}
      <section className="relative py-20 md:py-32 px-4 overflow-hidden">
        {/* Gold gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/30 via-black to-amber-950/20" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 mb-8">
            <Globe className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-medium text-amber-400">Le Futur du Business NFC</span>
          </div>
          
          {/* Title with Gold Shimmer */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
            Dominer le Physique, Régner sur le Digital
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
            Nous voyons un monde où chaque professionnel possède la 
            <span className="text-amber-400 font-semibold"> puissance d'une multinationale</span>.
          </p>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-amber-500/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10">
                <Crown className="w-6 h-6 text-amber-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Notre Mission</h2>
            </div>
            <p className="text-lg text-gray-300 leading-relaxed">
              Notre but est de <span className="text-amber-400 font-semibold">démocratiser la donnée</span> (Data), 
              <span className="text-amber-400 font-semibold"> l'engagement</span> (Stories 24h) et 
              <span className="text-amber-400 font-semibold"> la fidélisation</span> (Push Notifications) 
              pour tous les acteurs de l'élite, des Riads de Marrakech aux guides certifiés.
            </p>
          </div>
        </div>
      </section>

      {/* The Three Powers */}
      <section className="py-16 px-4 bg-gradient-to-b from-black via-amber-950/10 to-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 mb-4">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-medium text-amber-400">Écosystème Complet</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Les Trois Pouvoirs <span className="text-amber-400">i-wasp</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: BarChart3,
                title: "La Data",
                subtitle: "Intelligence Business",
                desc: "Chaque scan génère de la valeur. Analysez, comprenez, optimisez vos interactions en temps réel.",
                features: ["Analytics avancées", "Taux de conversion", "Heatmap des scans"]
              },
              {
                icon: Zap,
                title: "L'Engagement",
                subtitle: "Stories 24h",
                desc: "Comme les géants du social, créez des moments éphémères qui captent l'attention et génèrent de l'action.",
                features: ["Stories autoplay", "Contenu dynamique", "Mise à jour instantanée"]
              },
              {
                icon: Bell,
                title: "La Fidélisation",
                subtitle: "Push Notifications",
                desc: "Recontactez vos leads, rappelez-vous à leur mémoire, transformez chaque contact en client fidèle.",
                features: ["Notifications ciblées", "CRM intégré", "Export Excel"]
              },
            ].map((power, i) => (
              <div 
                key={i}
                className="p-6 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-amber-500/20 hover:border-amber-500/40 transition-all group"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                  <power.icon className="w-8 h-8 text-amber-400" />
                </div>
                <p className="text-xs font-medium text-amber-400 mb-1">{power.subtitle}</p>
                <h3 className="text-2xl font-bold text-white mb-3">{power.title}</h3>
                <p className="text-gray-400 mb-4">{power.desc}</p>
                <ul className="space-y-2">
                  {power.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-gray-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Markets */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Phone Preview */}
            <div className="relative order-2 md:order-1">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/30 to-transparent rounded-3xl blur-3xl" />
              <img 
                src={phoneGold} 
                alt="i-wasp Gold Experience" 
                className="relative w-full max-w-sm mx-auto drop-shadow-2xl"
              />
            </div>
            
            {/* Markets */}
            <div className="order-1 md:order-2">
              <h2 className="text-3xl font-bold text-white mb-8">
                Pour l'<span className="text-amber-400">Élite</span> du Maroc
              </h2>
              
              <div className="space-y-4">
                {[
                  { icon: Building2, title: "Riads & Hébergements", desc: "Accueil digital premium pour vos guests" },
                  { icon: MapPin, title: "Guides Certifiés", desc: "Carte de visite vivante avec Stories 24h" },
                  { icon: Users, title: "Professionnels", desc: "Networking puissant avec analytics intégrées" },
                  { icon: Crown, title: "Entreprises", desc: "Flotte de cartes avec dashboard unifié" },
                ].map((market, i) => (
                  <div 
                    key={i}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-amber-500/20 hover:border-amber-500/40 transition-colors"
                  >
                    <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10">
                      <market.icon className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{market.title}</h3>
                      <p className="text-gray-400 text-sm">{market.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-amber-500/5 to-transparent border border-amber-500/20">
            <p className="text-2xl md:text-3xl font-medium text-white italic leading-relaxed mb-6">
              "Personne ne peut copier i-wasp car c'est un écosystème vivant qui rend chaque commerçant 
              <span className="text-amber-400"> plus intelligent</span>."
            </p>
            <div className="flex items-center justify-center gap-2">
              <Crown className="w-5 h-5 text-amber-400" />
              <span className="text-amber-400 font-semibold">i-wasp Philosophy</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-amber-500/10 via-amber-600/5 to-transparent border border-amber-500/30">
            <Globe className="w-12 h-12 text-amber-400 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Rejoindre l'Empire i-wasp
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Faites partie des pionniers qui transforment chaque interaction physique en opportunité digitale.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/order">
                <Button size="lg" className="gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold px-8">
                  Rejoindre l'Empire i-wasp
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="lg" className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10">
                  Notre Histoire
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
