/**
 * ImportedDataPreview - Real-time preview of imported website data
 * Shows how imported data will be applied to the selected template
 * Features: Stories 24h preview, products grid, color application
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, Image, ShoppingBag, Palette, MapPin, 
  Phone, Instagram, Edit3, ChevronRight, Play,
  Globe, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImportedWebsiteData } from "@/contexts/OrderFunnelContext";
import { cn } from "@/lib/utils";

interface ImportedDataPreviewProps {
  data: ImportedWebsiteData;
  selectedTemplate?: string;
  onEditData?: () => void;
  className?: string;
}

export function ImportedDataPreview({ 
  data, 
  selectedTemplate,
  onEditData,
  className 
}: ImportedDataPreviewProps) {
  const [activeTab, setActiveTab] = useState<"stories" | "products" | "info">("stories");
  const [selectedStory, setSelectedStory] = useState<number | null>(null);

  const hasStories = (data.storyImages?.length || 0) > 0;
  const hasProducts = (data.products?.length || 0) > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-3xl border-2 border-[#d4af37]/30 bg-gradient-to-br from-black via-zinc-900/95 to-black overflow-hidden",
        className
      )}
      style={{
        boxShadow: "0 20px 60px rgba(212,175,55,0.12)",
      }}
    >
      {/* Header */}
      <div className="p-6 border-b border-[#d4af37]/20 bg-gradient-to-r from-[#d4af37]/10 via-transparent to-[#d4af37]/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {data.logo && (
              <img 
                src={data.logo} 
                alt="Logo" 
                className="h-12 w-12 object-contain rounded-xl bg-white/10 p-1"
              />
            )}
            <div>
              <h3 className="font-bold text-lg text-white">
                Prévisualisation en temps réel
              </h3>
              <p className="text-sm text-[#d4af37]">
                {data.brandName || "Votre marque"} • Template {selectedTemplate || "en attente"}
              </p>
            </div>
          </div>
          
          {onEditData && (
            <Button
              variant="outline"
              size="sm"
              onClick={onEditData}
              className="border-[#d4af37]/50 text-[#d4af37] hover:bg-[#d4af37]/10 gap-2"
            >
              <Edit3 size={14} />
              Modifier
            </Button>
          )}
        </div>

        {/* Color Preview */}
        {data.colors?.primary && (
          <div className="mt-4 flex items-center gap-3">
            <span className="text-xs text-white/50">Couleurs appliquées:</span>
            <div className="flex gap-2">
              <div 
                className="w-6 h-6 rounded-full border-2 border-white/20 shadow-lg"
                style={{ backgroundColor: data.colors.primary }}
                title="Couleur principale"
              />
              {data.colors.secondary && (
                <div 
                  className="w-6 h-6 rounded-full border-2 border-white/20 shadow-lg"
                  style={{ backgroundColor: data.colors.secondary }}
                  title="Couleur secondaire"
                />
              )}
              {data.colors.accent && (
                <div 
                  className="w-6 h-6 rounded-full border-2 border-white/20 shadow-lg"
                  style={{ backgroundColor: data.colors.accent }}
                  title="Couleur d'accent"
                />
              )}
            </div>
            <Check size={14} className="text-emerald-400 ml-2" />
            <span className="text-xs text-emerald-400">Style Glassmorphism Noir & Or conservé</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10">
        {[
          { id: "stories", label: "Stories 24h", icon: Sparkles, count: data.storyImages?.length || 0 },
          { id: "products", label: "Produits", icon: ShoppingBag, count: data.products?.length || 0 },
          { id: "info", label: "Infos", icon: Globe, count: 0 },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-all",
              activeTab === tab.id 
                ? "text-[#d4af37] border-b-2 border-[#d4af37] bg-[#d4af37]/5" 
                : "text-white/50 hover:text-white/80"
            )}
          >
            <tab.icon size={16} />
            {tab.label}
            {tab.count > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-[#d4af37]/20 text-[#d4af37] text-[10px]">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {/* Stories Tab */}
          {activeTab === "stories" && (
            <motion.div
              key="stories"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
            >
              {hasStories ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="stories-ring-gold w-10 h-10">
                      <div className="w-full h-full rounded-full bg-[#d4af37]/20 flex items-center justify-center">
                        <Sparkles size={16} className="text-[#d4af37]" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Stories 24h générées</p>
                      <p className="text-xs text-white/50">
                        {data.storyImages?.length} images prêtes à être publiées
                      </p>
                    </div>
                  </div>

                  {/* Stories Grid */}
                  <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
                    {data.storyImages?.slice(0, 6).map((image, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => setSelectedStory(selectedStory === index ? null : index)}
                        className={cn(
                          "relative flex-shrink-0 w-20 h-28 rounded-xl overflow-hidden group",
                          selectedStory === index && "ring-2 ring-[#d4af37] ring-offset-2 ring-offset-black"
                        )}
                      >
                        {/* Gold Ring Border */}
                        <div className="absolute inset-0 rounded-xl p-[2px] bg-gradient-to-b from-[#d4af37] via-[#f7dc6f] to-[#d4af37]">
                          <div className="w-full h-full rounded-[10px] overflow-hidden">
                            <img 
                              src={image} 
                              alt={`Story ${index + 1}`}
                              className="w-full h-full object-cover transition-transform group-hover:scale-110"
                            />
                          </div>
                        </div>

                        {/* Play Indicator */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play size={20} className="text-white fill-white" />
                        </div>

                        {/* Story Number */}
                        <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-black/70 flex items-center justify-center">
                          <span className="text-[10px] text-[#d4af37] font-bold">{index + 1}</span>
                        </div>
                      </motion.button>
                    ))}

                    {(data.storyImages?.length || 0) > 6 && (
                      <div className="flex-shrink-0 w-20 h-28 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                        <span className="text-sm text-white/50">+{(data.storyImages?.length || 0) - 6}</span>
                      </div>
                    )}
                  </div>

                  {/* Selected Story Preview */}
                  <AnimatePresence>
                    {selectedStory !== null && data.storyImages?.[selectedStory] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4"
                      >
                        <div className="relative aspect-[9/16] max-w-[200px] mx-auto rounded-2xl overflow-hidden border-2 border-[#d4af37]/30">
                          <img 
                            src={data.storyImages[selectedStory]} 
                            alt={`Story ${selectedStory + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-3 left-3 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#d4af37] to-[#b8860b] flex items-center justify-center">
                              {data.logo ? (
                                <img src={data.logo} alt="" className="w-6 h-6 rounded-full object-cover" />
                              ) : (
                                <Sparkles size={14} className="text-black" />
                              )}
                            </div>
                            <span className="text-xs text-white font-medium drop-shadow-lg">
                              {data.brandName || "Votre marque"}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Image className="w-12 h-12 mx-auto mb-3 text-white/20" />
                  <p className="text-sm text-white/50">Aucune image importée pour les Stories</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Products Tab */}
          {activeTab === "products" && (
            <motion.div
              key="products"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
            >
              {hasProducts ? (
                <div className="grid grid-cols-2 gap-3">
                  {data.products?.slice(0, 4).map((product, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative rounded-xl overflow-hidden border border-white/10 bg-white/5 group hover:border-[#d4af37]/30 transition-all"
                    >
                      {/* Product Image */}
                      <div className="aspect-square overflow-hidden">
                        {product.image ? (
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#d4af37]/20 to-transparent flex items-center justify-center">
                            <ShoppingBag size={24} className="text-[#d4af37]/40" />
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-3">
                        <p className="text-sm font-medium text-white truncate">{product.name}</p>
                        {product.price && (
                          <p className="text-xs text-[#d4af37] font-bold mt-1">{product.price}</p>
                        )}
                        {product.category && (
                          <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full bg-[#d4af37]/10 text-[#d4af37]">
                            {product.category}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-white/20" />
                  <p className="text-sm text-white/50">Aucun produit importé</p>
                </div>
              )}

              {(data.products?.length || 0) > 4 && (
                <div className="mt-4 text-center">
                  <span className="text-xs text-white/50">
                    +{(data.products?.length || 0) - 4} autres produits
                  </span>
                </div>
              )}
            </motion.div>
          )}

          {/* Info Tab */}
          {activeTab === "info" && (
            <motion.div
              key="info"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-3"
            >
              {data.phone && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                  <Phone size={16} className="text-emerald-400" />
                  <span className="text-sm text-white">{data.phone}</span>
                  <Check size={14} className="text-emerald-400 ml-auto" />
                </div>
              )}
              
              {data.whatsapp && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                  <Phone size={16} className="text-green-400" />
                  <span className="text-sm text-white">WhatsApp: {data.whatsapp}</span>
                  <Check size={14} className="text-emerald-400 ml-auto" />
                </div>
              )}
              
              {data.instagram && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                  <Instagram size={16} className="text-pink-400" />
                  <span className="text-sm text-white">@{data.instagram}</span>
                  <Check size={14} className="text-emerald-400 ml-auto" />
                </div>
              )}
              
              {data.googleMapsUrl && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                  <MapPin size={16} className="text-red-400" />
                  <span className="text-sm text-white">Géolocalisation</span>
                  <Check size={14} className="text-emerald-400 ml-auto" />
                </div>
              )}
              
              {data.address && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                  <MapPin size={16} className="text-white/50" />
                  <span className="text-sm text-white truncate">{data.address}</span>
                </div>
              )}

              {!data.phone && !data.whatsapp && !data.instagram && !data.googleMapsUrl && (
                <div className="text-center py-8">
                  <Globe className="w-12 h-12 mx-auto mb-3 text-white/20" />
                  <p className="text-sm text-white/50">Aucune info de contact importée</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer CTA */}
      <div className="p-4 border-t border-[#d4af37]/20 bg-gradient-to-r from-[#d4af37]/5 via-transparent to-[#d4af37]/5">
        <div className="flex items-center justify-center gap-2 text-sm text-[#d4af37]">
          <Sparkles size={14} />
          <span>Ces données seront appliquées automatiquement à votre template</span>
          <ChevronRight size={14} />
        </div>
      </div>
    </motion.div>
  );
}

export default ImportedDataPreview;