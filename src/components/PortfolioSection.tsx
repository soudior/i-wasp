import { motion, type Transition } from "framer-motion";
import { ExternalLink, CreditCard, Globe } from "lucide-react";

const luxuryEase = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 1.2, ease: luxuryEase } as Transition
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 }
  }
};

interface PortfolioItem {
  type: 'card' | 'website';
  name: string;
  role: string;
  company: string;
  image?: string;
  slug?: string;
}

const portfolioItems: PortfolioItem[] = [
  // Cartes digitales
  {
    type: 'card',
    name: 'Karim Benjelloun',
    role: 'CEO',
    company: 'Atlas Consulting',
    slug: 'karim-benjelloun'
  },
  {
    type: 'card',
    name: 'Sophie Martin',
    role: 'Directrice Générale',
    company: 'Meridian Capital',
    slug: 'sophie-martin'
  },
  {
    type: 'card',
    name: 'Ahmed El Mansouri',
    role: 'Fondateur',
    company: 'TechVentures Maroc',
    slug: 'ahmed-elmansouri'
  },
  // Sites Web Studio
  {
    type: 'website',
    name: 'Cabinet Avocats Casablanca',
    role: 'Cabinet d\'avocats',
    company: 'Site vitrine premium',
    slug: 'cabinet-avocats'
  },
  {
    type: 'website',
    name: 'Architect Studio',
    role: 'Cabinet d\'architecture',
    company: 'Site portfolio',
    slug: 'architect-studio'
  },
  {
    type: 'website',
    name: 'Clinique Dentaire Excellence',
    role: 'Clinique dentaire',
    company: 'Site médical',
    slug: 'clinique-dentaire'
  }
];

export function PortfolioSection() {
  const cards = portfolioItems.filter(item => item.type === 'card');
  const websites = portfolioItems.filter(item => item.type === 'website');

  return (
    <section className="py-32 sm:py-40 px-6 bg-[hsl(0,0%,6%)]">
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="max-w-6xl mx-auto"
      >
        <motion.div variants={fadeUp} className="text-center mb-16">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6">
            Réalisations
          </p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl tracking-wide mb-4">
            Ils nous font confiance.
          </h2>
          <p className="font-body text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Découvrez quelques exemples de cartes digitales et sites web créés pour nos clients.
          </p>
        </motion.div>

        {/* Cartes digitales */}
        <motion.div variants={fadeUp} className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <CreditCard className="w-5 h-5 text-[hsl(210,30%,60%)]" strokeWidth={1.5} />
            <h3 className="font-body text-lg tracking-wide text-foreground/90">
              Cartes digitales
            </h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {cards.map((item, index) => (
              <motion.div
                key={item.slug}
                variants={fadeUp}
                whileHover={{ y: -4, transition: { duration: 0.3 } }}
                className="group relative border border-foreground/10 bg-background/50 p-6 cursor-pointer hover:border-[hsl(210,30%,50%)]/30 transition-colors duration-500"
              >
                {/* Avatar placeholder */}
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[hsl(210,30%,50%)]/20 to-[hsl(210,30%,50%)]/5 flex items-center justify-center mb-4 border border-foreground/10">
                  <span className="font-display text-xl text-[hsl(210,30%,60%)]">
                    {item.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                
                <h4 className="font-body text-foreground mb-1">{item.name}</h4>
                <p className="font-body text-sm text-muted-foreground mb-1">{item.role}</p>
                <p className="font-body text-xs text-[hsl(210,30%,60%)]">{item.company}</p>
                
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ExternalLink className="w-4 h-4 text-[hsl(210,30%,60%)]" strokeWidth={1.5} />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Sites Web Studio */}
        <motion.div variants={fadeUp}>
          <div className="flex items-center gap-3 mb-8">
            <Globe className="w-5 h-5 text-[hsl(210,30%,60%)]" strokeWidth={1.5} />
            <h3 className="font-body text-lg tracking-wide text-foreground/90">
              Sites Web Studio IA
            </h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {websites.map((item, index) => (
              <motion.div
                key={item.slug}
                variants={fadeUp}
                whileHover={{ y: -4, transition: { duration: 0.3 } }}
                className="group relative border border-foreground/10 bg-background/50 overflow-hidden cursor-pointer hover:border-[hsl(210,30%,50%)]/30 transition-colors duration-500"
              >
                {/* Website preview placeholder */}
                <div className="h-32 bg-gradient-to-br from-[hsl(210,30%,50%)]/10 to-transparent flex items-center justify-center border-b border-foreground/10">
                  <Globe className="w-10 h-10 text-[hsl(210,30%,50%)]/30" strokeWidth={1} />
                </div>
                
                <div className="p-5">
                  <h4 className="font-body text-foreground mb-1">{item.name}</h4>
                  <p className="font-body text-sm text-muted-foreground mb-1">{item.role}</p>
                  <p className="font-body text-xs text-[hsl(210,30%,60%)]">{item.company}</p>
                </div>
                
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ExternalLink className="w-4 h-4 text-[hsl(210,30%,60%)]" strokeWidth={1.5} />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div 
          variants={fadeUp}
          className="mt-16 pt-12 border-t border-foreground/10"
        >
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <p className="font-display text-3xl sm:text-4xl text-foreground mb-2">150+</p>
              <p className="font-body text-sm text-muted-foreground">Cartes créées</p>
            </div>
            <div>
              <p className="font-display text-3xl sm:text-4xl text-foreground mb-2">40+</p>
              <p className="font-body text-sm text-muted-foreground">Sites générés</p>
            </div>
            <div>
              <p className="font-display text-3xl sm:text-4xl text-foreground mb-2">98%</p>
              <p className="font-body text-sm text-muted-foreground">Satisfaction</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
