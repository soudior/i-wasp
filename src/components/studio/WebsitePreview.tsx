/**
 * WebsitePreview - Aperçu visuel du site généré
 * Affiche un mockup interactif basé sur la proposition IA
 */

import { motion } from "framer-motion";
import { Globe, Menu, ChevronRight, Mail, Phone, MapPin, Star, Users, Sparkles } from "lucide-react";

interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

interface Section {
  type: string;
  title: string;
  content: string;
  items?: string[];
}

interface Page {
  name: string;
  slug: string;
  sections: Section[];
}

interface WebsiteProposal {
  siteName: string;
  tagline: string;
  colorPalette: ColorPalette;
  typography: {
    headingFont: string;
    bodyFont: string;
  };
  pages: Page[];
  features: string[];
  estimatedPages: number;
  complexity: "simple" | "standard" | "premium";
}

interface WebsitePreviewProps {
  proposal: WebsiteProposal;
}

export function WebsitePreview({ proposal }: WebsitePreviewProps) {
  const { colorPalette, siteName, tagline, pages } = proposal;
  const homePage = pages[0];

  const getSectionIcon = (type: string) => {
    switch (type) {
      case "hero": return <Sparkles className="w-4 h-4" />;
      case "features": return <Star className="w-4 h-4" />;
      case "about": return <Users className="w-4 h-4" />;
      case "contact": return <Mail className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl overflow-hidden border border-border shadow-xl"
    >
      {/* Browser Frame */}
      <div className="bg-muted/80 px-4 py-2 flex items-center gap-2 border-b border-border">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 mx-4">
          <div className="bg-background rounded-md px-3 py-1 text-xs text-muted-foreground flex items-center gap-2">
            <Globe className="w-3 h-3" />
            <span>{siteName.toLowerCase().replace(/\s+/g, '-')}.com</span>
          </div>
        </div>
      </div>

      {/* Website Content */}
      <div 
        className="min-h-[400px] overflow-hidden"
        style={{ backgroundColor: colorPalette.background }}
      >
        {/* Navigation */}
        <nav 
          className="px-6 py-4 flex items-center justify-between border-b"
          style={{ borderColor: `${colorPalette.text}15` }}
        >
          <span 
            className="font-bold text-lg"
            style={{ color: colorPalette.primary }}
          >
            {siteName}
          </span>
          <div className="flex items-center gap-4">
            {pages.slice(0, 4).map((page, idx) => (
              <span 
                key={idx}
                className="text-sm hidden sm:inline"
                style={{ color: colorPalette.text, opacity: 0.7 }}
              >
                {page.name}
              </span>
            ))}
            <Menu 
              className="w-5 h-5 sm:hidden" 
              style={{ color: colorPalette.text }}
            />
          </div>
        </nav>

        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="px-6 py-12 text-center"
        >
          <h1 
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ color: colorPalette.text }}
          >
            {siteName}
          </h1>
          <p 
            className="text-lg mb-6 max-w-md mx-auto"
            style={{ color: colorPalette.text, opacity: 0.7 }}
          >
            {tagline}
          </p>
          <button
            className="px-6 py-3 rounded-lg font-medium text-sm transition-transform hover:scale-105"
            style={{ 
              backgroundColor: colorPalette.primary, 
              color: colorPalette.background 
            }}
          >
            Découvrir
            <ChevronRight className="w-4 h-4 inline ml-2" />
          </button>
        </motion.div>

        {/* Section Preview */}
        {homePage?.sections.slice(1, 3).map((section, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + idx * 0.1 }}
            className="px-6 py-8 border-t"
            style={{ 
              borderColor: `${colorPalette.text}10`,
              backgroundColor: idx % 2 === 0 ? `${colorPalette.secondary}10` : 'transparent'
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${colorPalette.primary}20` }}
              >
                <span style={{ color: colorPalette.primary }}>
                  {getSectionIcon(section.type)}
                </span>
              </div>
              <h3 
                className="font-semibold"
                style={{ color: colorPalette.text }}
              >
                {section.title}
              </h3>
            </div>
            <p 
              className="text-sm line-clamp-2"
              style={{ color: colorPalette.text, opacity: 0.6 }}
            >
              {section.content}
            </p>
            {section.items && section.items.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {section.items.slice(0, 3).map((item, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 rounded text-xs"
                    style={{ 
                      backgroundColor: `${colorPalette.accent}20`,
                      color: colorPalette.accent
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        ))}

        {/* Footer Preview */}
        <div 
          className="px-6 py-6 border-t flex items-center justify-between"
          style={{ 
            borderColor: `${colorPalette.text}10`,
            backgroundColor: `${colorPalette.text}05`
          }}
        >
          <span 
            className="text-xs"
            style={{ color: colorPalette.text, opacity: 0.5 }}
          >
            © 2024 {siteName}
          </span>
          <div className="flex gap-3">
            <Mail className="w-4 h-4" style={{ color: colorPalette.text, opacity: 0.5 }} />
            <Phone className="w-4 h-4" style={{ color: colorPalette.text, opacity: 0.5 }} />
            <MapPin className="w-4 h-4" style={{ color: colorPalette.text, opacity: 0.5 }} />
          </div>
        </div>
      </div>

      {/* Preview Badge */}
      <div className="bg-muted/80 px-4 py-2 border-t border-border flex items-center justify-center gap-2">
        <Sparkles className="w-3 h-3 text-primary" />
        <span className="text-xs text-muted-foreground">
          Aperçu généré par IA • Design final personnalisable
        </span>
      </div>
    </motion.div>
  );
}
