/**
 * ComingSoon — Page "Bientôt Disponible"
 * Style: Haute Couture Digitale - Noir & Or
 */

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Bell, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CoutureNavbar } from "@/components/CoutureNavbar";
import { CoutureFooter } from "@/components/CoutureFooter";
import { SEOHead } from "@/components/SEOHead";

// Palette Luxe
const LUXE = {
  noir: "#0A0A0A",
  noirSoft: "#121212",
  ivoire: "#F5F5F5",
  or: "#B8956C",
  orLight: "#D4B896",
  gris: "#6B6B6B",
};

export default function ComingSoon() {
  SEOHead({
    title: "Bientôt Disponible | i-wasp",
    description: "Cette fonctionnalité arrive bientôt. Restez à l'écoute pour découvrir les nouvelles innovations i-wasp.",
    canonical: "/coming-soon"
  });

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: LUXE.noir }}>
      <CoutureNavbar />
      
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-20 sm:py-32 relative overflow-hidden">
        {/* Background elements */}
        <motion.div
          className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full blur-[150px] pointer-events-none"
          style={{ backgroundColor: `${LUXE.or}10` }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Floating particles */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full pointer-events-none"
            style={{
              backgroundColor: LUXE.or,
              left: `${20 + (i * 15)}%`,
              top: `${30 + (i % 3) * 20}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
        
        {/* Content */}
        <motion.div 
          className="text-center relative z-10 max-w-xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Icon */}
          <motion.div
            className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-8 rounded-2xl flex items-center justify-center"
            style={{ 
              backgroundColor: `${LUXE.or}15`,
              border: `1px solid ${LUXE.or}30`,
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <Sparkles className="w-10 h-10 sm:w-12 sm:h-12" style={{ color: LUXE.or }} />
          </motion.div>
          
          {/* Decorative line */}
          <motion.div
            className="w-12 h-px mx-auto mb-6"
            style={{ backgroundColor: LUXE.or }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          />
          
          {/* Title */}
          <h1 
            className="font-display text-3xl sm:text-4xl md:text-5xl font-light tracking-tight mb-4"
            style={{ color: LUXE.ivoire }}
          >
            Bientôt
            <span className="italic" style={{ color: LUXE.or }}> disponible</span>
          </h1>
          
          {/* Description */}
          <p 
            className="text-base sm:text-lg font-light leading-relaxed mb-10 max-w-md mx-auto"
            style={{ color: LUXE.gris }}
          >
            Cette fonctionnalité est en cours de développement. 
            Nous travaillons pour vous offrir une expérience exceptionnelle.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/">
              <Button
                className="min-h-[48px] px-8 text-[11px] uppercase tracking-[0.2em] font-light rounded-sm transition-all duration-500"
                style={{ 
                  backgroundColor: LUXE.or,
                  color: LUXE.noir,
                }}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour à l'accueil
              </Button>
            </Link>
            
            <Button
              variant="outline"
              className="min-h-[48px] px-8 text-[11px] uppercase tracking-[0.2em] font-light rounded-sm transition-all duration-500"
              style={{ 
                borderColor: `${LUXE.or}40`,
                color: LUXE.ivoire,
                backgroundColor: 'transparent',
              }}
              onClick={() => {
                window.open('https://wa.me/212661381626?text=Je souhaite être notifié des nouvelles fonctionnalités i-wasp', '_blank');
              }}
            >
              <Bell className="w-4 h-4 mr-2" />
              Me notifier
            </Button>
          </div>
          
          {/* Bottom decorative line */}
          <motion.div
            className="w-8 h-px mx-auto mt-12"
            style={{ backgroundColor: `${LUXE.or}50` }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          />
        </motion.div>
      </main>
      
      <CoutureFooter />
    </div>
  );
}
