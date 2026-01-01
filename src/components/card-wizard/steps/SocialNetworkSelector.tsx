/**
 * SocialNetworkSelector - Sélection élégante des réseaux sociaux
 * 
 * Design premium IWASP:
 * - Catégories visuelles
 * - Animations fluides
 * - Validation instantanée
 */

import { useState } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  socialNetworks, 
  SocialLink, 
  SocialNetwork,
  normalizeUsername,
  validateUsername 
} from "@/lib/socialNetworks";
import { 
  Plus, 
  X, 
  Check,
  ChevronUp,
  ChevronDown,
  Linkedin,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Github,
  Mail,
  Phone,
  MessageCircle,
  Send,
  Calendar,
  Globe,
  Camera,
  Music,
  Palette,
  FileText,
  BookOpen,
  Building2,
  ShoppingBag
} from "lucide-react";

interface SocialNetworkSelectorProps {
  selectedLinks: SocialLink[];
  onChange: (links: SocialLink[]) => void;
}

// Map icon names to components
const iconMap: Record<string, React.ElementType> = {
  Linkedin,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Github,
  Mail,
  Phone,
  MessageCircle,
  Send,
  Calendar,
  Globe,
  Camera,
  Music,
  Palette,
  FileText,
  BookOpen,
  Building2,
  ShoppingBag,
};

const categoryLabels: Record<string, string> = {
  classic: "Réseaux sociaux",
  professional: "Professionnel",
  creators: "Créatifs",
  business: "Business",
};

const categoryDescriptions: Record<string, string> = {
  classic: "Partagez vos profils publics",
  professional: "Communication directe",
  creators: "Portfolio & projets",
  business: "Entreprise",
};

export function SocialNetworkSelector({ selectedLinks, onChange }: SocialNetworkSelectorProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [editingNetwork, setEditingNetwork] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const categories = ["classic", "professional", "creators", "business"] as const;

  const getIconComponent = (iconName: string) => {
    return iconMap[iconName] || Globe;
  };

  const isNetworkSelected = (networkId: string) => {
    return selectedLinks.some(link => link.networkId === networkId);
  };

  const getNetworkValue = (networkId: string) => {
    return selectedLinks.find(link => link.networkId === networkId)?.value || "";
  };

  const handleNetworkToggle = (network: SocialNetwork) => {
    if (isNetworkSelected(network.id)) {
      // Remove the network
      onChange(selectedLinks.filter(link => link.networkId !== network.id));
      if (editingNetwork === network.id) {
        setEditingNetwork(null);
        setTempValue("");
        setError(null);
      }
    } else {
      // Start editing to add
      setEditingNetwork(network.id);
      setTempValue("");
      setError(null);
    }
  };

  const handleSaveNetwork = (network: SocialNetwork) => {
    const validation = validateUsername(tempValue, network.id);
    if (!validation.valid) {
      setError(validation.error || "Valeur invalide");
      return;
    }

    const normalizedValue = normalizeUsername(tempValue, network.id);
    const newLink: SocialLink = {
      id: `${network.id}-${Date.now()}`,
      networkId: network.id,
      value: normalizedValue,
    };

    // Update or add the link
    const existingIndex = selectedLinks.findIndex(l => l.networkId === network.id);
    if (existingIndex >= 0) {
      const updated = [...selectedLinks];
      updated[existingIndex] = newLink;
      onChange(updated);
    } else {
      onChange([...selectedLinks, newLink]);
    }

    setEditingNetwork(null);
    setTempValue("");
    setError(null);
  };

  const handleEditExisting = (network: SocialNetwork) => {
    const existingValue = getNetworkValue(network.id);
    setEditingNetwork(network.id);
    setTempValue(existingValue);
    setError(null);
  };

  return (
    <div className="space-y-4">
      {categories.map(category => {
        const networksInCategory = socialNetworks.filter(n => n.category === category);
        const selectedInCategory = networksInCategory.filter(n => isNetworkSelected(n.id));
        const isExpanded = expandedCategory === category;

        return (
          <motion.div
            key={category}
            initial={false}
            className="rounded-2xl border border-border/50 bg-card/50 overflow-hidden"
          >
            {/* Category Header */}
            <button
              onClick={() => setExpandedCategory(isExpanded ? null : category)}
              className="w-full p-4 flex items-center justify-between hover:bg-muted/30 transition-colors duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <span className="text-lg">
                    {category === "classic" && "📱"}
                    {category === "professional" && "💼"}
                    {category === "creators" && "🎨"}
                    {category === "business" && "🏢"}
                  </span>
                </div>
                <div className="text-left">
                  <p className="font-medium text-sm">{categoryLabels[category]}</p>
                  <p className="text-xs text-muted-foreground">{categoryDescriptions[category]}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {selectedInCategory.length > 0 && (
                  <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-full">
                    {selectedInCategory.length}
                  </span>
                )}
                <motion.span
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-muted-foreground"
                >
                  ▼
                </motion.span>
              </div>
            </button>

            {/* Networks List */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="border-t border-border/30"
                >
                  <div className="p-3 space-y-2">
                    {networksInCategory.map(network => {
                      const IconComponent = getIconComponent(network.icon);
                      const isSelected = isNetworkSelected(network.id);
                      const isEditing = editingNetwork === network.id;
                      const currentValue = getNetworkValue(network.id);

                      return (
                        <motion.div
                          key={network.id}
                          layout
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`rounded-xl p-3 transition-all duration-300 ${
                            isSelected 
                              ? "bg-accent/10 border border-accent/30" 
                              : "bg-muted/30 border border-transparent hover:border-border/50"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                isSelected ? "bg-accent text-accent-foreground" : "bg-muted"
                              }`}>
                                <IconComponent size={16} />
                              </div>
                              <div>
                                <p className="text-sm font-medium">{network.label}</p>
                                {isSelected && currentValue && !isEditing && (
                                  <p className="text-xs text-muted-foreground">@{currentValue}</p>
                                )}
                              </div>
                            </div>

                            {!isEditing && (
                              <div className="flex items-center gap-2">
                                {isSelected && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEditExisting(network)}
                                    className="h-8 px-2 text-xs"
                                  >
                                    Modifier
                                  </Button>
                                )}
                                <Button
                                  variant={isSelected ? "ghost" : "outline"}
                                  size="sm"
                                  onClick={() => handleNetworkToggle(network)}
                                  className={`h-8 w-8 p-0 ${isSelected ? "text-destructive hover:text-destructive" : ""}`}
                                >
                                  {isSelected ? <X size={14} /> : <Plus size={14} />}
                                </Button>
                              </div>
                            )}
                          </div>

                          {/* Input field when editing */}
                          <AnimatePresence>
                            {isEditing && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="mt-3 space-y-2"
                              >
                                <div className="flex gap-2">
                                  <Input
                                    placeholder={network.placeholder}
                                    value={tempValue}
                                    onChange={(e) => {
                                      setTempValue(e.target.value);
                                      setError(null);
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        handleSaveNetwork(network);
                                      }
                                      if (e.key === "Escape") {
                                        setEditingNetwork(null);
                                        setTempValue("");
                                        setError(null);
                                      }
                                    }}
                                    className="flex-1 h-10 bg-background/50 border-border/50 rounded-xl"
                                    autoFocus
                                  />
                                  <Button
                                    size="sm"
                                    onClick={() => handleSaveNetwork(network)}
                                    className="h-10 px-4 bg-accent hover:bg-accent/90 rounded-xl"
                                  >
                                    <Check size={16} />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setEditingNetwork(null);
                                      setTempValue("");
                                      setError(null);
                                    }}
                                    className="h-10 px-3 rounded-xl"
                                  >
                                    <X size={16} />
                                  </Button>
                                </div>
                                {error && (
                                  <p className="text-xs text-destructive">{error}</p>
                                )}
                                <p className="text-xs text-muted-foreground">
                                  Exemple: {network.placeholder}
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}

      {/* Selected Summary with Priority Ordering */}
      {selectedLinks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-accent/5 border border-accent/10"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-muted-foreground">Ordre d'affichage sur votre carte</p>
            <span className="text-xs text-accent/70">
              {selectedLinks.length} réseau{selectedLinks.length > 1 ? "x" : ""}
            </span>
          </div>
          
          <Reorder.Group
            axis="y"
            values={selectedLinks}
            onReorder={onChange}
            className="space-y-2"
          >
            <AnimatePresence mode="popLayout">
              {selectedLinks.map((link, index) => {
                const network = socialNetworks.find(n => n.id === link.networkId);
                if (!network) return null;
                const IconComponent = getIconComponent(network.icon);
                const isFirst = index === 0;
                const isLast = index === selectedLinks.length - 1;
                
                const moveUp = () => {
                  if (isFirst) return;
                  const newLinks = [...selectedLinks];
                  [newLinks[index - 1], newLinks[index]] = [newLinks[index], newLinks[index - 1]];
                  onChange(newLinks);
                };
                
                const moveDown = () => {
                  if (isLast) return;
                  const newLinks = [...selectedLinks];
                  [newLinks[index], newLinks[index + 1]] = [newLinks[index + 1], newLinks[index]];
                  onChange(newLinks);
                };
                
                return (
                  <Reorder.Item
                    key={link.id}
                    value={link}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                      transition: {
                        type: "spring",
                        stiffness: 350,
                        damping: 25
                      }
                    }}
                    exit={{ 
                      opacity: 0, 
                      scale: 0.9,
                      transition: { duration: 0.2 }
                    }}
                    whileDrag={{
                      scale: 1.03,
                      boxShadow: "0 10px 30px -10px rgba(0,0,0,0.3)",
                      cursor: "grabbing"
                    }}
                    dragListener={false}
                    className="flex items-center gap-3 p-3 bg-card/60 backdrop-blur-sm rounded-xl border border-border/30 shadow-sm"
                  >
                    {/* Position indicator with animation */}
                    <motion.div 
                      key={`pos-${index}`}
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-xs font-medium text-accent shrink-0"
                    >
                      {index + 1}
                    </motion.div>
                    
                    {/* Network info */}
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      <motion.div 
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                        className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0"
                      >
                        <IconComponent size={14} className="text-accent" />
                      </motion.div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{network.label}</p>
                        {link.value && (
                          <p className="text-xs text-muted-foreground truncate">@{link.value}</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Move controls with enhanced animations */}
                    <div className="flex items-center gap-1 shrink-0">
                      <motion.div
                        whileTap={{ scale: 0.9 }}
                        whileHover={{ y: isFirst ? 0 : -2 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={moveUp}
                          disabled={isFirst}
                          className={`h-8 w-8 p-0 rounded-lg transition-all duration-300 ${
                            isFirst 
                              ? "opacity-30 cursor-not-allowed" 
                              : "hover:bg-accent/10"
                          }`}
                        >
                          <ChevronUp size={16} />
                        </Button>
                      </motion.div>
                      <motion.div
                        whileTap={{ scale: 0.9 }}
                        whileHover={{ y: isLast ? 0 : 2 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={moveDown}
                          disabled={isLast}
                          className={`h-8 w-8 p-0 rounded-lg transition-all duration-300 ${
                            isLast 
                              ? "opacity-30 cursor-not-allowed" 
                              : "hover:bg-accent/10"
                          }`}
                        >
                          <ChevronDown size={16} />
                        </Button>
                      </motion.div>
                    </div>
                  </Reorder.Item>
                );
              })}
            </AnimatePresence>
          </Reorder.Group>
          
          <p className="text-xs text-muted-foreground/70 mt-3 text-center italic">
            Les réseaux apparaîtront dans cet ordre sur votre carte
          </p>
        </motion.div>
      )}
    </div>
  );
}

export default SocialNetworkSelector;
