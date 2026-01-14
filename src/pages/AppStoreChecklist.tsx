import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, 
  Circle, 
  AlertTriangle, 
  Image, 
  FileText, 
  Shield, 
  Smartphone, 
  Settings, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Apple,
  Info,
  Wand2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { IconGenerator } from "@/components/IconGenerator";

interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  required: boolean;
  checked: boolean;
  category: string;
  helpLink?: string;
}

interface ChecklistCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  items: ChecklistItem[];
  isOpen: boolean;
}

const initialCategories: ChecklistCategory[] = [
  {
    id: "icons",
    title: "Icônes de l'application",
    icon: <Image className="h-5 w-5" />,
    isOpen: true,
    items: [
      {
        id: "icon-1024",
        label: "Icône App Store (1024x1024 px)",
        description: "PNG sans transparence, coins arrondis non requis",
        required: true,
        checked: false,
        category: "icons",
        helpLink: "https://developer.apple.com/design/human-interface-guidelines/app-icons"
      },
      {
        id: "icon-180",
        label: "Icône iPhone @3x (180x180 px)",
        description: "Pour iPhone avec écran Retina HD",
        required: true,
        checked: false,
        category: "icons"
      },
      {
        id: "icon-120",
        label: "Icône iPhone @2x (120x120 px)",
        description: "Pour iPhone avec écran Retina",
        required: true,
        checked: false,
        category: "icons"
      },
      {
        id: "icon-167",
        label: "Icône iPad Pro (167x167 px)",
        description: "Pour iPad Pro 12.9\"",
        required: true,
        checked: false,
        category: "icons"
      },
      {
        id: "icon-152",
        label: "Icône iPad (152x152 px)",
        description: "Pour iPad standard",
        required: true,
        checked: false,
        category: "icons"
      }
    ]
  },
  {
    id: "screenshots",
    title: "Captures d'écran",
    icon: <Smartphone className="h-5 w-5" />,
    isOpen: false,
    items: [
      {
        id: "screen-67",
        label: "iPhone 6.7\" (1290x2796 px)",
        description: "iPhone 15 Pro Max, 15 Plus, 14 Pro Max",
        required: true,
        checked: false,
        category: "screenshots"
      },
      {
        id: "screen-65",
        label: "iPhone 6.5\" (1242x2688 px)",
        description: "iPhone 11 Pro Max, XS Max",
        required: true,
        checked: false,
        category: "screenshots"
      },
      {
        id: "screen-55",
        label: "iPhone 5.5\" (1242x2208 px)",
        description: "iPhone 8 Plus, 7 Plus, 6s Plus",
        required: true,
        checked: false,
        category: "screenshots"
      },
      {
        id: "screen-ipad",
        label: "iPad Pro 12.9\" (2048x2732 px)",
        description: "Pour l'affichage sur iPad",
        required: false,
        checked: false,
        category: "screenshots"
      },
      {
        id: "screen-count",
        label: "Minimum 3 captures par taille",
        description: "Maximum 10 captures par taille d'écran",
        required: true,
        checked: false,
        category: "screenshots"
      }
    ]
  },
  {
    id: "metadata",
    title: "Métadonnées de l'app",
    icon: <FileText className="h-5 w-5" />,
    isOpen: false,
    items: [
      {
        id: "meta-name",
        label: "Nom de l'application (≤30 caractères)",
        description: "IWASP - Carte de visite NFC",
        required: true,
        checked: false,
        category: "metadata"
      },
      {
        id: "meta-subtitle",
        label: "Sous-titre (≤30 caractères)",
        description: "Networking digital premium",
        required: false,
        checked: false,
        category: "metadata"
      },
      {
        id: "meta-description",
        label: "Description (≤4000 caractères)",
        description: "Description détaillée des fonctionnalités",
        required: true,
        checked: false,
        category: "metadata"
      },
      {
        id: "meta-keywords",
        label: "Mots-clés (≤100 caractères)",
        description: "carte visite, NFC, networking, business card",
        required: true,
        checked: false,
        category: "metadata"
      },
      {
        id: "meta-category",
        label: "Catégorie principale",
        description: "Business",
        required: true,
        checked: false,
        category: "metadata"
      },
      {
        id: "meta-whatsnew",
        label: "Notes de version",
        description: "Nouveautés de cette version",
        required: true,
        checked: false,
        category: "metadata"
      }
    ]
  },
  {
    id: "legal",
    title: "Conformité légale",
    icon: <Shield className="h-5 w-5" />,
    isOpen: false,
    items: [
      {
        id: "legal-privacy",
        label: "URL Politique de confidentialité",
        description: "https://i-wasp.com/privacy",
        required: true,
        checked: false,
        category: "legal",
        helpLink: "/privacy"
      },
      {
        id: "legal-support",
        label: "URL de support",
        description: "https://i-wasp.com/contact",
        required: true,
        checked: false,
        category: "legal",
        helpLink: "/contact"
      },
      {
        id: "legal-terms",
        label: "Conditions générales (si achat in-app)",
        description: "Requis si l'app propose des achats",
        required: false,
        checked: false,
        category: "legal",
        helpLink: "/cgv"
      },
      {
        id: "legal-age",
        label: "Classification par âge",
        description: "4+ recommandé pour les apps professionnelles",
        required: true,
        checked: false,
        category: "legal"
      },
      {
        id: "legal-gdpr",
        label: "Conformité RGPD",
        description: "Politique de données pour l'UE",
        required: true,
        checked: false,
        category: "legal"
      }
    ]
  },
  {
    id: "capabilities",
    title: "Capabilities iOS",
    icon: <Settings className="h-5 w-5" />,
    isOpen: false,
    items: [
      {
        id: "cap-nfc",
        label: "Near Field Communication Tag Reading",
        description: "Pour le partage NFC de la carte",
        required: true,
        checked: false,
        category: "capabilities"
      },
      {
        id: "cap-domains",
        label: "Associated Domains configurés",
        description: "applinks:i-wasp.com",
        required: true,
        checked: false,
        category: "capabilities"
      },
      {
        id: "cap-push",
        label: "Push Notifications (optionnel)",
        description: "Pour les notifications push",
        required: false,
        checked: false,
        category: "capabilities"
      },
      {
        id: "cap-background",
        label: "Background Modes",
        description: "Background fetch activé",
        required: false,
        checked: false,
        category: "capabilities"
      }
    ]
  },
  {
    id: "permissions",
    title: "Descriptions des permissions",
    icon: <Info className="h-5 w-5" />,
    isOpen: false,
    items: [
      {
        id: "perm-nfc",
        label: "NFCReaderUsageDescription",
        description: "IWASP utilise le NFC pour partager votre carte de visite",
        required: true,
        checked: false,
        category: "permissions"
      },
      {
        id: "perm-camera",
        label: "NSCameraUsageDescription",
        description: "Pour scanner les QR codes et photos de profil",
        required: true,
        checked: false,
        category: "permissions"
      },
      {
        id: "perm-photos",
        label: "NSPhotoLibraryUsageDescription",
        description: "Pour personnaliser votre carte de visite",
        required: true,
        checked: false,
        category: "permissions"
      },
      {
        id: "perm-contacts",
        label: "NSContactsUsageDescription",
        description: "Pour ajouter des contacts au carnet d'adresses",
        required: true,
        checked: false,
        category: "permissions"
      },
      {
        id: "perm-location",
        label: "NSLocationWhenInUseUsageDescription",
        description: "Pour personnaliser votre expérience",
        required: false,
        checked: false,
        category: "permissions"
      }
    ]
  },
  {
    id: "build",
    title: "Build & Signing",
    icon: <Apple className="h-5 w-5" />,
    isOpen: false,
    items: [
      {
        id: "build-team",
        label: "Apple Developer Team sélectionné",
        description: "Compte Apple Developer actif (99$/an)",
        required: true,
        checked: false,
        category: "build"
      },
      {
        id: "build-bundle",
        label: "Bundle ID configuré",
        description: "app.iwasp.nfc",
        required: true,
        checked: false,
        category: "build"
      },
      {
        id: "build-version",
        label: "Version et Build Number",
        description: "Ex: Version 1.0.0, Build 1",
        required: true,
        checked: false,
        category: "build"
      },
      {
        id: "build-signing",
        label: "Automatic signing activé",
        description: "Dans Xcode → Signing & Capabilities",
        required: true,
        checked: false,
        category: "build"
      },
      {
        id: "build-archive",
        label: "Archive créée sans erreurs",
        description: "Product → Archive dans Xcode",
        required: true,
        checked: false,
        category: "build"
      },
      {
        id: "build-test",
        label: "Test sur appareil physique",
        description: "Vérifier le fonctionnement NFC",
        required: true,
        checked: false,
        category: "build"
      }
    ]
  }
];

const STORAGE_KEY = "iwasp-appstore-checklist";

export default function AppStoreChecklist() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<ChecklistCategory[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialCategories;
      }
    }
    return initialCategories;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
  }, [categories]);

  const toggleItem = (categoryId: string, itemId: string) => {
    setCategories(prev => 
      prev.map(cat => 
        cat.id === categoryId 
          ? {
              ...cat,
              items: cat.items.map(item =>
                item.id === itemId ? { ...item, checked: !item.checked } : item
              )
            }
          : cat
      )
    );
  };

  const toggleCategory = (categoryId: string) => {
    setCategories(prev =>
      prev.map(cat =>
        cat.id === categoryId ? { ...cat, isOpen: !cat.isOpen } : cat
      )
    );
  };

  const allItems = categories.flatMap(cat => cat.items);
  const requiredItems = allItems.filter(item => item.required);
  const checkedRequired = requiredItems.filter(item => item.checked);
  const checkedAll = allItems.filter(item => item.checked);
  
  const progressRequired = requiredItems.length > 0 
    ? (checkedRequired.length / requiredItems.length) * 100 
    : 0;
  const progressAll = allItems.length > 0 
    ? (checkedAll.length / allItems.length) * 100 
    : 0;

  const isReady = progressRequired === 100;

  const resetChecklist = () => {
    setCategories(initialCategories);
    localStorage.removeItem(STORAGE_KEY);
  };

  const getCategoryProgress = (category: ChecklistCategory) => {
    const required = category.items.filter(item => item.required);
    const checked = required.filter(item => item.checked);
    return required.length > 0 ? (checked.length / required.length) * 100 : 100;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10">
                <Apple className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">App Store Checklist</h1>
                <p className="text-sm text-muted-foreground">Pré-soumission IWASP</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={resetChecklist}
            >
              Réinitialiser
            </Button>
          </div>

          {/* Progress Summary */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Requis</span>
              <span className="font-medium">{checkedRequired.length}/{requiredItems.length}</span>
            </div>
            <Progress value={progressRequired} className="h-2" />
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total</span>
              <span className="font-medium">{checkedAll.length}/{allItems.length}</span>
            </div>
            <Progress value={progressAll} className="h-1.5 opacity-50" />
          </div>

          {/* Status Badge */}
          <AnimatePresence mode="wait">
            {isReady ? (
              <motion.div
                key="ready"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-4"
              >
                <div className="flex items-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                  <Sparkles className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium text-green-600">
                    Prêt pour la soumission App Store !
                  </span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="pending"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-4"
              >
                <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  <span className="text-sm font-medium text-amber-600">
                    {requiredItems.length - checkedRequired.length} éléments requis restants
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {categories.map((category) => {
          const catProgress = getCategoryProgress(category);
          const isComplete = catProgress === 100;
          
          return (
            <Collapsible
              key={category.id}
              open={category.isOpen}
              onOpenChange={() => toggleCategory(category.id)}
            >
              <Card className={`transition-all duration-200 ${isComplete ? 'border-green-500/30 bg-green-500/5' : ''}`}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isComplete ? 'bg-green-500/10 text-green-500' : 'bg-muted'}`}>
                          {category.icon}
                        </div>
                        <div>
                          <CardTitle className="text-base font-semibold flex items-center gap-2">
                            {category.title}
                            {isComplete && (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            )}
                          </CardTitle>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {category.items.filter(i => i.checked).length}/{category.items.length} complétés
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-16">
                          <Progress value={catProgress} className="h-1.5" />
                        </div>
                        {category.isOpen ? (
                          <ChevronUp className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <CardContent className="pt-0 pb-4">
                    <div className="space-y-1">
                      {category.items.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={false}
                          animate={{ 
                            backgroundColor: item.checked ? 'hsl(var(--primary) / 0.05)' : 'transparent' 
                          }}
                          className="flex items-start gap-3 p-3 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => toggleItem(category.id, item.id)}
                        >
                          <div className="mt-0.5">
                            {item.checked ? (
                              <CheckCircle2 className="h-5 w-5 text-primary" />
                            ) : (
                              <Circle className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-medium ${item.checked ? 'line-through text-muted-foreground' : ''}`}>
                                {item.label}
                              </span>
                              {item.required && (
                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                  Requis
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {item.description}
                            </p>
                          </div>
                          {item.helpLink && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 shrink-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (item.helpLink?.startsWith('http')) {
                                  window.open(item.helpLink, '_blank');
                                } else {
                                  navigate(item.helpLink!);
                                }
                              }}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          );
        })}

        {/* Icon Generator Tool */}
        <Card className="mt-6 border-primary/20 bg-primary/5">
          <CardHeader className="py-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Wand2 className="h-5 w-5 text-primary" />
              Générateur d'icônes
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 pb-4">
            <p className="text-sm text-muted-foreground mb-4">
              Uploadez une image 1024×1024 et générez automatiquement toutes les tailles requises pour iOS et Android.
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <Image className="h-4 w-4 mr-2" />
                  Générer les icônes
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Wand2 className="h-5 w-5" />
                    Générateur d'icônes App Store
                  </DialogTitle>
                </DialogHeader>
                <IconGenerator />
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card className="mt-6">
          <CardHeader className="py-4">
            <CardTitle className="text-base">Liens utiles</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 pb-4 space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => window.open('https://appstoreconnect.apple.com', '_blank')}
            >
              <Apple className="h-4 w-4 mr-2" />
              App Store Connect
              <ExternalLink className="h-3 w-3 ml-auto" />
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => window.open('https://developer.apple.com/design/human-interface-guidelines/', '_blank')}
            >
              <FileText className="h-4 w-4 mr-2" />
              Human Interface Guidelines
              <ExternalLink className="h-3 w-3 ml-auto" />
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => window.open('https://developer.apple.com/app-store/review/guidelines/', '_blank')}
            >
              <Shield className="h-4 w-4 mr-2" />
              App Store Review Guidelines
              <ExternalLink className="h-3 w-3 ml-auto" />
            </Button>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="py-6">
          <Button
            className="w-full"
            size="lg"
            disabled={!isReady}
            onClick={() => window.open('https://appstoreconnect.apple.com', '_blank')}
          >
            <Apple className="h-5 w-5 mr-2" />
            {isReady ? 'Soumettre sur App Store Connect' : 'Complétez la checklist'}
          </Button>
        </div>
      </div>
    </div>
  );
}
