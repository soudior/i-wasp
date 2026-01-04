import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { NFCTapAnimation3D } from "@/components/NFCTapAnimation3D";
import { 
  Wifi, 
  RefreshCw, 
  BarChart3, 
  Smartphone, 
  CheckCircle2, 
  ArrowRight, 
  Star,
  Zap,
  Users,
  Shield
} from "lucide-react";

const features = [
  {
    icon: Wifi,
    title: "NFC + QR Code",
    description: "Compatibilité universelle avec tous les smartphones modernes.",
  },
  {
    icon: RefreshCw,
    title: "Mise à jour temps réel",
    description: "Modifiez votre profil sans réimprimer votre carte.",
  },
  {
    icon: BarChart3,
    title: "Analytics intégrées",
    description: "Suivez qui scanne votre carte et quand.",
  },
  {
    icon: Smartphone,
    title: "Profil digital",
    description: "Votre mini-site accessible d'un simple tap.",
  },
];

const testimonials = [
  {
    name: "Sarah M.",
    role: "Directrice Commerciale",
    content: "iWasp a transformé notre façon de réseauter. Nos commerciaux adorent.",
    rating: 5,
  },
  {
    name: "Karim B.",
    role: "Agent Immobilier",
    content: "Mes clients sont impressionnés. C'est devenu ma signature professionnelle.",
    rating: 5,
  },
  {
    name: "Emma D.",
    role: "Consultante",
    content: "Simple, élégant, efficace. Exactement ce qu'il me fallait.",
    rating: 5,
  },
];

const stats = [
  { value: "10K+", label: "Cartes actives" },
  { value: "500K+", label: "Scans mensuels" },
  { value: "98%", label: "Satisfaction" },
  { value: "24/7", label: "Support" },
];

export default function HomeSaaS() {
  return (
    <div className="min-h-screen bg-iwasp-bg">
      {/* Hero Section with 3D Animation */}
      <section className="relative pt-24 pb-12 md:pt-32 md:pb-20 px-4 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-gold-500/5 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold-500/10 rounded-full blur-[120px]" />
        
        <div className="relative max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left: Text content */}
            <div className="text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-iwasp-card border border-gold-500/20 mb-6">
                <Zap className="w-4 h-4 text-gold-500" />
                <span className="text-sm font-medium text-gold-500">La carte de visite du futur</span>
              </div>
              
              {/* Headline */}
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-5 text-white leading-tight">
                Une carte NFC.
                <span className="block text-gold-500">Un profil qui évolue.</span>
              </h1>
              
              {/* Subheadline */}
              <p className="text-lg md:text-xl text-iwasp-gray max-w-lg mx-auto lg:mx-0 mb-8">
                Créez votre carte de visite NFC intelligente. Mettez à jour votre profil en temps réel, 
                sans jamais réimprimer.
              </p>
              
              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4 mb-8">
                <Link to="/order/type">
                  <Button size="lg" className="bg-gold-500 hover:bg-gold-600 text-black font-semibold px-8 py-6 text-lg gap-2">
                    Créer ma Carte NFC
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/demo">
                  <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/5 px-8 py-6 text-lg">
                    Voir une démo
                  </Button>
                </Link>
              </div>
              
              {/* Trust badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-iwasp-gray text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>Compatible iPhone & Android</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>Livraison rapide</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>Satisfait ou remboursé</span>
                </div>
              </div>
            </div>

            {/* Right: 3D NFC Animation */}
            <div className="relative h-[350px] md:h-[450px] lg:h-[500px]">
              <NFCTapAnimation3D 
                cardColor="#0a0a0a"
                accentColor="#D4AF37"
                className="w-full h-full"
                autoPlay={true}
              />
              
              {/* Floating badge */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 lg:left-auto lg:right-4 lg:translate-x-0">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-iwasp-card/80 backdrop-blur-sm border border-gold-500/20 text-xs text-gold-400">
                  <Wifi className="w-3 h-3" />
                  <span>Animation 3D interactive</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4 border-y border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-gold-500 mb-1">{stat.value}</p>
                <p className="text-iwasp-gray text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-iwasp-gray text-lg max-w-xl mx-auto">
              Une solution complète pour moderniser votre networking professionnel.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-iwasp-card border border-white/5 hover:border-gold-500/20 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-gold-500" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-iwasp-gray text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/features">
              <Button variant="outline" className="border-white/10 text-white hover:bg-white/5">
                Voir toutes les fonctionnalités
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 bg-iwasp-card/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Comment ça marche
            </h2>
            <p className="text-iwasp-gray text-lg">
              En 3 étapes simples, passez au networking du futur.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Créez votre profil", desc: "Remplissez vos informations et personnalisez votre page." },
              { step: "2", title: "Recevez votre carte", desc: "Votre carte NFC premium livrée chez vous en quelques jours." },
              { step: "3", title: "Scannez & partagez", desc: "Vos contacts scannent et accèdent à votre profil instantanément." },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gold-500 flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-black">{item.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-iwasp-gray">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ils nous font confiance
            </h2>
            <p className="text-iwasp-gray text-lg">
              Des professionnels de tous secteurs ont adopté iWasp.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-iwasp-card border border-white/5"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-gold-500 text-gold-500" />
                  ))}
                </div>
                <p className="text-white mb-6">"{testimonial.content}"</p>
                <div>
                  <p className="text-white font-medium">{testimonial.name}</p>
                  <p className="text-iwasp-gray text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Teams */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-iwasp-card to-iwasp-bg border border-white/5">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-500 text-sm font-medium mb-6">
                  <Users className="w-4 h-4" />
                  Pour les équipes
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  iWasp Business
                </h2>
                <p className="text-iwasp-gray mb-6">
                  Équipez toute votre équipe avec des cartes NFC personnalisées. 
                  Dashboard centralisé, analytics équipe, branding entreprise.
                </p>
                <Link to="/enterprise">
                  <Button className="bg-gold-500 hover:bg-gold-600 text-black font-semibold">
                    Découvrir l'offre Business
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
              <div className="hidden md:block">
                <div className="p-6 rounded-2xl bg-iwasp-bg border border-white/10">
                  <div className="space-y-3">
                    {[
                      { name: "Équipe Marketing", count: "12 cartes" },
                      { name: "Équipe Commerciale", count: "24 cartes" },
                      { name: "Direction", count: "6 cartes" },
                    ].map((team, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                        <span className="text-white">{team.name}</span>
                        <span className="text-iwasp-gray text-sm">{team.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-gold-500/10 to-iwasp-card border border-gold-500/20">
            <Shield className="w-12 h-12 text-gold-500 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Prêt à passer au NFC ?
            </h2>
            <p className="text-iwasp-gray mb-8 max-w-xl mx-auto">
              Rejoignez des milliers de professionnels qui ont déjà modernisé leur networking avec iWasp.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/order/type">
                <Button size="lg" className="bg-gold-500 hover:bg-gold-600 text-black font-semibold px-8">
                  Créer ma Carte NFC
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/5">
                  Voir les tarifs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
