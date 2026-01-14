/**
 * Prévisualisation live du site web généré
 * Affiche un rendu visuel basé sur la proposition IA
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Smartphone, 
  Monitor, 
  ChevronLeft, 
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  Menu,
  X
} from "lucide-react";

interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

interface Typography {
  headingFont: string;
  bodyFont: string;
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

interface Proposal {
  siteName: string;
  tagline: string;
  colorPalette: ColorPalette;
  typography: Typography;
  pages: Page[];
  features?: string[];
  estimatedPages: number;
  complexity: string;
}

interface WebsitePreviewProps {
  proposal: Proposal;
  logoUrl?: string;
}

export function WebsitePreview({ proposal, logoUrl }: WebsitePreviewProps) {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"mobile" | "desktop">("mobile");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { colorPalette, typography, pages, siteName, tagline } = proposal;
  const currentPage = pages[currentPageIndex];

  const nextPage = () => {
    setCurrentPageIndex((prev) => (prev + 1) % pages.length);
  };

  const prevPage = () => {
    setCurrentPageIndex((prev) => (prev - 1 + pages.length) % pages.length);
  };

  const renderSection = (section: Section, index: number) => {
    const items = section.items || [];
    switch (section.type) {
      case "hero":
        return (
          <div
            key={index}
            className="relative py-12 px-4 text-center"
            style={{
              background: `linear-gradient(135deg, ${colorPalette.primary} 0%, ${colorPalette.primary}dd 100%)`,
            }}
          >
            <motion.h1
              className="text-2xl font-bold mb-3"
              style={{ color: colorPalette.background, fontFamily: typography.headingFont }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {section.title}
            </motion.h1>
            <p
              className="text-sm opacity-90 mb-4"
              style={{ color: colorPalette.background, fontFamily: typography.bodyFont }}
            >
              {section.content}
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {items.slice(0, 3).map((item, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full text-xs"
                  style={{
                    backgroundColor: `${colorPalette.background}20`,
                    color: colorPalette.background,
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        );

      case "features":
        return (
          <div
            key={index}
            className="py-8 px-4"
            style={{ backgroundColor: colorPalette.secondary }}
          >
            <h2
              className="text-lg font-semibold mb-2 text-center"
              style={{ color: colorPalette.text, fontFamily: typography.headingFont }}
            >
              {section.title}
            </h2>
            <p
              className="text-xs text-center mb-4 opacity-70"
              style={{ color: colorPalette.text, fontFamily: typography.bodyFont }}
            >
              {section.content}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {items.map((item, i) => (
                <div
                  key={i}
                  className="text-center p-3 rounded-lg"
                  style={{ backgroundColor: colorPalette.background }}
                >
                  <div
                    className="w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: colorPalette.accent, color: colorPalette.primary }}
                  >
                    {i + 1}
                  </div>
                  <span
                    className="text-[10px] block"
                    style={{ color: colorPalette.text }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      case "products":
      case "services":
        return (
          <div
            key={index}
            className="py-8 px-4"
            style={{ backgroundColor: colorPalette.background }}
          >
            <h2
              className="text-lg font-semibold mb-2"
              style={{ color: colorPalette.text, fontFamily: typography.headingFont }}
            >
              {section.title}
            </h2>
            <p
              className="text-xs mb-4 opacity-70"
              style={{ color: colorPalette.text, fontFamily: typography.bodyFont }}
            >
              {section.content}
            </p>
            <div className="space-y-2">
              {items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-lg"
                  style={{ backgroundColor: colorPalette.secondary }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex-shrink-0"
                    style={{ backgroundColor: `${colorPalette.primary}20` }}
                  />
                  <span
                    className="text-sm"
                    style={{ color: colorPalette.text }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      case "about":
      case "team":
        return (
          <div
            key={index}
            className="py-8 px-4"
            style={{ backgroundColor: colorPalette.background }}
          >
            <h2
              className="text-lg font-semibold mb-2"
              style={{ color: colorPalette.text, fontFamily: typography.headingFont }}
            >
              {section.title}
            </h2>
            <p
              className="text-xs mb-4"
              style={{ color: colorPalette.text, fontFamily: typography.bodyFont }}
            >
              {section.content}
            </p>
            <div className="flex gap-2 flex-wrap">
              {items.map((item, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-full text-xs"
                  style={{
                    backgroundColor: colorPalette.primary,
                    color: colorPalette.background,
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        );

      case "gallery":
        return (
          <div
            key={index}
            className="py-8 px-4"
            style={{ backgroundColor: colorPalette.secondary }}
          >
            <h2
              className="text-lg font-semibold mb-4 text-center"
              style={{ color: colorPalette.text, fontFamily: typography.headingFont }}
            >
              {section.title}
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {items.slice(0, 4).map((item, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${colorPalette.primary}15` }}
                >
                  <span
                    className="text-[9px] text-center px-2 opacity-60"
                    style={{ color: colorPalette.text }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      case "contact":
        return (
          <div
            key={index}
            className="py-8 px-4"
            style={{ backgroundColor: colorPalette.background }}
          >
            <h2
              className="text-lg font-semibold mb-2"
              style={{ color: colorPalette.text, fontFamily: typography.headingFont }}
            >
              {section.title}
            </h2>
            <p
              className="text-xs mb-4 opacity-70"
              style={{ color: colorPalette.text, fontFamily: typography.bodyFont }}
            >
              {section.content}
            </p>
            <div className="space-y-3">
              <div
                className="flex items-center gap-3 p-3 rounded-lg"
                style={{ backgroundColor: colorPalette.secondary }}
              >
                <MapPin size={16} style={{ color: colorPalette.primary }} />
                <span className="text-xs" style={{ color: colorPalette.text }}>
                  Adresse à définir
                </span>
              </div>
              <div
                className="flex items-center gap-3 p-3 rounded-lg"
                style={{ backgroundColor: colorPalette.secondary }}
              >
                <Phone size={16} style={{ color: colorPalette.primary }} />
                <span className="text-xs" style={{ color: colorPalette.text }}>
                  Téléphone
                </span>
              </div>
              <div
                className="flex items-center gap-3 p-3 rounded-lg"
                style={{ backgroundColor: colorPalette.secondary }}
              >
                <Mail size={16} style={{ color: colorPalette.primary }} />
                <span className="text-xs" style={{ color: colorPalette.text }}>
                  Email
                </span>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div
            key={index}
            className="py-6 px-4"
            style={{ backgroundColor: colorPalette.background }}
          >
            <h2
              className="text-lg font-semibold mb-2"
              style={{ color: colorPalette.text }}
            >
              {section.title}
            </h2>
            <p className="text-xs" style={{ color: colorPalette.text }}>
              {section.content}
            </p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("mobile")}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "mobile" ? "bg-[#D4A853]/20" : "bg-white/5"
            }`}
          >
            <Smartphone
              size={16}
              className={viewMode === "mobile" ? "text-[#D4A853]" : "text-gray-400"}
            />
          </button>
          <button
            onClick={() => setViewMode("desktop")}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "desktop" ? "bg-[#D4A853]/20" : "bg-white/5"
            }`}
          >
            <Monitor
              size={16}
              className={viewMode === "desktop" ? "text-[#D4A853]" : "text-gray-400"}
            />
          </button>
        </div>

        {/* Page navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={prevPage}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <ChevronLeft size={14} className="text-gray-400" />
          </button>
          <span className="text-xs text-gray-400 min-w-[80px] text-center">
            {currentPage.name}
          </span>
          <button
            onClick={nextPage}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <ChevronRight size={14} className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* Preview frame */}
      <motion.div
        className={`mx-auto rounded-2xl overflow-hidden shadow-2xl ${
          viewMode === "mobile" ? "w-[280px]" : "w-full"
        }`}
        style={{
          backgroundColor: colorPalette.background,
          border: "8px solid #1a1a1a",
        }}
        layout
      >
        {/* Browser bar */}
        <div
          className="flex items-center gap-2 px-3 py-2"
          style={{ backgroundColor: "#1a1a1a" }}
        >
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <div className="w-2 h-2 rounded-full bg-green-500" />
          </div>
          <div
            className="flex-1 text-[9px] text-center px-2 py-1 rounded"
            style={{ backgroundColor: "#2a2a2a", color: "#888" }}
          >
            {siteName.toLowerCase().replace(/\s+/g, "-")}.fr
          </div>
        </div>

        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{
            backgroundColor: colorPalette.background,
            borderBottom: `1px solid ${colorPalette.text}10`,
          }}
        >
          <div className="flex items-center gap-2">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="w-6 h-6 object-contain" />
            ) : (
              <div
                className="w-6 h-6 rounded flex items-center justify-center text-[8px] font-bold"
                style={{ backgroundColor: colorPalette.primary, color: colorPalette.background }}
              >
                {siteName.charAt(0)}
              </div>
            )}
            <span
              className="text-xs font-semibold"
              style={{ color: colorPalette.text, fontFamily: typography.headingFont }}
            >
              {siteName}
            </span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1"
          >
            {mobileMenuOpen ? (
              <X size={16} style={{ color: colorPalette.text }} />
            ) : (
              <Menu size={16} style={{ color: colorPalette.text }} />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="px-4 py-2"
              style={{ backgroundColor: colorPalette.secondary }}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              {pages.map((page, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCurrentPageIndex(i);
                    setMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left py-2 text-xs ${
                    i === currentPageIndex ? "font-semibold" : ""
                  }`}
                  style={{
                    color: i === currentPageIndex ? colorPalette.primary : colorPalette.text,
                  }}
                >
                  {page.name}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Page content */}
        <div
          className="overflow-y-auto"
          style={{
            maxHeight: viewMode === "mobile" ? "400px" : "500px",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPageIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {currentPage.sections.map((section, i) => renderSection(section, i))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div
          className="px-4 py-3 text-center"
          style={{
            backgroundColor: colorPalette.primary,
            color: colorPalette.background,
          }}
        >
          <p className="text-[9px] opacity-80">{tagline}</p>
          <p className="text-[8px] opacity-50 mt-1">© 2026 {siteName}</p>
        </div>
      </motion.div>

      {/* Page dots */}
      <div className="flex justify-center gap-1.5">
        {pages.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPageIndex(i)}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === currentPageIndex ? "bg-[#D4A853]" : "bg-white/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
