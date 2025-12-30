import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Target, Heart, Zap, Shield, Users, Lightbulb, ArrowRight } from "lucide-react";

const values = [
  {
    icon: Zap,
    title: "Innovation",
    description: "Nous repoussons les limites de la technologie NFC pour créer des expériences uniques.",
  },
  {
    icon: Heart,
    title: "Excellence",
    description: "Chaque carte est fabriquée avec un souci du détail et une qualité irréprochable.",
  },
  {
    icon: Shield,
    title: "Confiance",
    description: "Vos données sont protégées. Nous respectons votre vie privée et celle de vos contacts.",
  },
  {
    icon: Users,
    title: "Proximité",
    description: "Un accompagnement personnalisé pour chaque client, de la conception à la livraison.",
  },
];

const team = [
  {
    name: "Youssef Amrani",
    role: "CEO & Fondateur",
    bio: "Entrepreneur passionné par l'innovation digitale et les technologies sans contact.",
  },
  {
    name: "Sofia Benali",
    role: "Directrice Produit",
    bio: "Expert en expérience utilisateur avec 10 ans d'expérience dans le digital.",
  },
  {
    name: "Karim Tazi",
    role: "Lead Développeur",
    bio: "Architecte logiciel spécialisé dans les solutions NFC et IoT.",
  },
  {
    name: "Amina Cherkaoui",
    role: "Responsable Commercial",
    bio: "Connecte les entreprises marocaines aux solutions digitales innovantes.",
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-semibold text-foreground mb-6">
            À propos d'i-wasp
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Nous révolutionnons l'échange de coordonnées professionnelles au Maroc 
            grâce à la technologie NFC. Une carte, un geste, une connexion.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 bg-muted/30 border-y border-border/30">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-foreground/10">
              <Target className="w-6 h-6 text-foreground" />
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
              Notre Mission
            </h2>
          </div>
          <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
            <p>
              Chez i-wasp, nous croyons que l'échange de coordonnées professionnelles 
              devrait être aussi simple qu'une poignée de main. Fini les cartes de visite 
              en papier qui s'accumulent et finissent à la poubelle.
            </p>
            <p>
              Notre mission est de fournir aux professionnels marocains et africains 
              des outils digitaux élégants et durables pour créer des connexions 
              significatives. Une seule carte NFC remplace des milliers de cartes 
              papier, tout en offrant une expérience mémorable.
            </p>
            <p>
              Nous accompagnons les hôtels, les entreprises et les indépendants 
              dans leur transition vers le networking digital, avec un service 
              personnalisé et une qualité premium.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-3 rounded-xl bg-foreground/10">
              <Lightbulb className="w-6 h-6 text-foreground" />
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
              Nos Valeurs
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value) => (
              <div 
                key={value.title}
                className="p-6 rounded-2xl border border-border/50 bg-card/50 hover:border-border transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-foreground/5">
                    <value.icon className="w-5 h-5 text-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {value.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 bg-muted/30 border-y border-border/30">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-3 rounded-xl bg-foreground/10">
              <Users className="w-6 h-6 text-foreground" />
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
              Notre Équipe
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <div 
                key={member.name}
                className="p-6 rounded-2xl border border-border/50 bg-background text-center"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-foreground/10 to-foreground/5 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-semibold text-foreground">
                    {member.name.split(" ").map(n => n[0]).join("")}
                  </span>
                </div>
                <h3 className="font-semibold text-foreground mb-1">
                  {member.name}
                </h3>
                <p className="text-sm text-primary font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-sm text-muted-foreground">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
            Prêt à passer au digital ?
          </h2>
          <p className="text-muted-foreground mb-8">
            Rejoignez les centaines de professionnels qui ont déjà adopté les cartes NFC i-wasp.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/#pricing">
              <Button size="lg" className="gap-2">
                Commander maintenant
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg">
                Nous contacter
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
