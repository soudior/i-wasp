/**
 * Brand Assets i-Wasp
 * Source unique de vérité visuelle pour impression Evolis
 */

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useIsAdmin } from "@/hooks/useAdmin";
import { 
  useBrandAssets, 
  useUploadBrandAsset, 
  ASSET_LABELS, 
  BRAND_COLORS 
} from "@/hooks/useBrandAssets";
import { EVOLIS_SPECS } from "@/contexts/BrandContext";
import { PhysicalCardPreview } from "@/components/PhysicalCardPreview";
import { 
  Upload, 
  Download, 
  FileImage, 
  FileText, 
  Palette, 
  Lock, 
  CheckCircle2,
  AlertTriangle,
  Package,
  Printer,
  Info
} from "lucide-react";
import { toast } from "sonner";

const ASSET_TYPES = ["logo_svg", "logo_png", "logo_pdf", "card_front", "card_back"];

export default function BrandAssets() {
  const { data: isAdmin } = useIsAdmin();
  const { data: assets, isLoading } = useBrandAssets();
  const uploadMutation = useUploadBrandAsset();
  const [uploading, setUploading] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const getAsset = (type: string) => assets?.find(a => a.asset_type === type);

  const handleFileSelect = async (assetType: string, file: File) => {
    setUploading(assetType);
    try {
      await uploadMutation.mutateAsync({ file, assetType });
    } finally {
      setUploading(null);
    }
  };

  const handleDownloadPack = async () => {
    if (!assets || assets.length === 0) {
      toast.error("Aucun asset disponible");
      return;
    }

    // Download each file
    for (const asset of assets) {
      const link = document.createElement("a");
      link.href = asset.file_url;
      link.download = asset.file_name;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      await new Promise(r => setTimeout(r, 500));
    }

    toast.success("Téléchargement du pack lancé");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-32 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Lock className="h-5 w-5 text-primary" />
              <Badge variant="outline" className="border-primary text-primary">
                Source officielle
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">
              Brand Assets i-Wasp
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Référence unique pour l'identité visuelle et l'impression Evolis.
              Ces fichiers ne doivent jamais être modifiés par les templates.
            </p>
          </motion.div>

          {/* Warning Banner */}
          <motion.div
            className="bg-primary/10 border border-primary/30 rounded-xl p-4 mb-8 flex items-start gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <AlertTriangle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-primary">Référence officielle impression Evolis</p>
              <p className="text-sm text-muted-foreground">
                Aucune modification automatique autorisée. Les templates web référencent ces assets sans les altérer.
              </p>
            </div>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Assets Upload Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileImage className="h-5 w-5 text-primary" />
                    Fichiers officiels
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {ASSET_TYPES.map((type) => {
                    const asset = getAsset(type);
                    const isUploading = uploading === type;
                    
                    return (
                      <div
                        key={type}
                        className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                      >
                        <div className="flex items-center gap-3">
                          {type.includes("logo") ? (
                            <FileImage className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <FileText className="h-5 w-5 text-muted-foreground" />
                          )}
                          <div>
                            <p className="font-medium text-sm">
                              {ASSET_LABELS[type]}
                            </p>
                            {asset ? (
                              <p className="text-xs text-muted-foreground">
                                {asset.file_name}
                              </p>
                            ) : (
                              <p className="text-xs text-muted-foreground/50">
                                Non uploadé
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {asset && (
                            <>
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                              <a
                                href={asset.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Button variant="ghost" size="sm">
                                  <Download className="h-4 w-4" />
                                </Button>
                              </a>
                            </>
                          )}

                          {isAdmin && (
                            <>
                              <input
                                type="file"
                                ref={(el) => (fileInputRefs.current[type] = el)}
                                className="hidden"
                                accept={
                                  type.includes("svg")
                                    ? ".svg"
                                    : type.includes("png")
                                    ? ".png"
                                    : ".pdf"
                                }
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleFileSelect(type, file);
                                }}
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => fileInputRefs.current[type]?.click()}
                                disabled={isUploading}
                              >
                                {isUploading ? (
                                  <span className="animate-pulse">...</span>
                                ) : (
                                  <Upload className="h-4 w-4" />
                                )}
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </motion.div>

            {/* Colors Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5 text-primary" />
                    Codes couleur officiels
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {BRAND_COLORS.map((color) => (
                    <div
                      key={color.hex}
                      className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50"
                    >
                      <div
                        className="w-12 h-12 rounded-lg border border-border flex-shrink-0"
                        style={{ backgroundColor: color.hex }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{color.name}</p>
                          <code className="text-xs bg-background px-2 py-0.5 rounded">
                            {color.hex}
                          </code>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {color.usage}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(color.hex);
                          toast.success(`${color.hex} copié`);
                        }}
                      >
                        Copier
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Evolis Technical Specs */}
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Printer className="h-5 w-5 text-primary" />
                  Fiche technique imprimante Evolis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="p-3 rounded-lg bg-secondary/50">
                    <p className="text-xs text-muted-foreground mb-1">Format carte</p>
                    <p className="font-medium">{EVOLIS_SPECS.format}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/50">
                    <p className="text-xs text-muted-foreground mb-1">Dimensions</p>
                    <p className="font-medium">{EVOLIS_SPECS.dimensions}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/50">
                    <p className="text-xs text-muted-foreground mb-1">Fond perdu</p>
                    <p className="font-medium">{EVOLIS_SPECS.bleed}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/50">
                    <p className="text-xs text-muted-foreground mb-1">Marges de sécurité</p>
                    <p className="font-medium">{EVOLIS_SPECS.safeMargin}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/50">
                    <p className="text-xs text-muted-foreground mb-1">Mode couleur</p>
                    <p className="font-medium">{EVOLIS_SPECS.colorMode}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/50">
                    <p className="text-xs text-muted-foreground mb-1">Résolution</p>
                    <p className="font-medium">{EVOLIS_SPECS.resolution}</p>
                  </div>
                </div>
                <div className="mt-4 p-3 rounded-lg bg-secondary/50">
                  <p className="text-xs text-muted-foreground mb-1">Noir recommandé</p>
                  <p className="font-medium">{EVOLIS_SPECS.blackRecommended}</p>
                </div>
                <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
                  <Info className="h-4 w-4" />
                  <span>Ces spécifications sont associées aux fichiers recto/verso pour impression directe</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Physical Card Preview */}
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <PhysicalCardPreview showSpecs={false} />
          </motion.div>

          {/* Download Pack Button */}
          <motion.div
            className="mt-10 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
          >
            <Separator className="mb-10" />
            
            <Button
              size="lg"
              onClick={handleDownloadPack}
              disabled={!assets || assets.length === 0}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 h-14 text-lg gap-3"
            >
              <Package className="h-5 w-5" />
              Télécharger pack impression Evolis
            </Button>
            
            <p className="text-sm text-muted-foreground mt-4">
              Contient : Logo (SVG, PNG, PDF) + Carte recto/verso + Fiche couleurs
            </p>
          </motion.div>

          {/* Read-only notice for non-admins */}
          {!isAdmin && (
            <motion.div
              className="mt-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Badge variant="secondary" className="gap-2">
                <Lock className="h-3 w-3" />
                Mode lecture seule
              </Badge>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
