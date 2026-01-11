import React, { useState, useRef, useCallback } from 'react';
import { Upload, Download, Check, Image, Smartphone, Monitor, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface IconSize {
  name: string;
  size: number;
  platform: 'ios' | 'android' | 'both';
  description: string;
}

const ICON_SIZES: IconSize[] = [
  // iOS sizes
  { name: 'apple-icon-180x180', size: 180, platform: 'ios', description: 'iPhone @3x' },
  { name: 'apple-icon-167x167', size: 167, platform: 'ios', description: 'iPad Pro @2x' },
  { name: 'apple-icon-152x152', size: 152, platform: 'ios', description: 'iPad @2x' },
  { name: 'apple-icon-120x120', size: 120, platform: 'ios', description: 'iPhone @2x' },
  { name: 'apple-icon-76x76', size: 76, platform: 'ios', description: 'iPad @1x' },
  // Android sizes
  { name: 'icon-512x512', size: 512, platform: 'android', description: 'Play Store' },
  { name: 'icon-192x192', size: 192, platform: 'android', description: 'xxxhdpi' },
  { name: 'icon-144x144', size: 144, platform: 'android', description: 'xxhdpi' },
  { name: 'icon-96x96', size: 96, platform: 'android', description: 'xhdpi' },
  { name: 'icon-72x72', size: 72, platform: 'android', description: 'hdpi' },
  { name: 'icon-48x48', size: 48, platform: 'android', description: 'mdpi' },
];

interface GeneratedIcon {
  name: string;
  size: number;
  dataUrl: string;
  platform: 'ios' | 'android' | 'both';
}

export function IconGenerator() {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [generatedIcons, setGeneratedIcons] = useState<GeneratedIcon[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedPlatform, setSelectedPlatform] = useState<'all' | 'ios' | 'android'>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        if (img.width < 1024 || img.height < 1024) {
          toast.warning(`Image ${img.width}x${img.height}px - Recommandé: 1024x1024px minimum`);
        }
        setSourceImage(e.target?.result as string);
        setGeneratedIcons([]);
        setProgress(0);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, []);

  const generateIcons = useCallback(async () => {
    if (!sourceImage || !canvasRef.current) return;

    setIsGenerating(true);
    setProgress(0);
    setGeneratedIcons([]);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new window.Image();
    img.src = sourceImage;

    await new Promise((resolve) => {
      img.onload = resolve;
    });

    const filteredSizes = ICON_SIZES.filter(
      (icon) => selectedPlatform === 'all' || icon.platform === selectedPlatform
    );

    const icons: GeneratedIcon[] = [];

    for (let i = 0; i < filteredSizes.length; i++) {
      const iconSize = filteredSizes[i];
      
      canvas.width = iconSize.size;
      canvas.height = iconSize.size;
      
      // Clear canvas
      ctx.clearRect(0, 0, iconSize.size, iconSize.size);
      
      // Draw resized image with high quality
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, iconSize.size, iconSize.size);

      const dataUrl = canvas.toDataURL('image/png', 1.0);
      
      icons.push({
        name: iconSize.name,
        size: iconSize.size,
        dataUrl,
        platform: iconSize.platform,
      });

      setProgress(((i + 1) / filteredSizes.length) * 100);
      
      // Small delay for visual feedback
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    setGeneratedIcons(icons);
    setIsGenerating(false);
    toast.success(`${icons.length} icônes générées avec succès`);
  }, [sourceImage, selectedPlatform]);

  const downloadIcon = useCallback((icon: GeneratedIcon) => {
    const link = document.createElement('a');
    link.href = icon.dataUrl;
    link.download = `${icon.name}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`${icon.name}.png téléchargée`);
  }, []);

  const downloadAllIcons = useCallback(async () => {
    for (const icon of generatedIcons) {
      const link = document.createElement('a');
      link.href = icon.dataUrl;
      link.download = `${icon.name}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
    toast.success('Toutes les icônes ont été téléchargées');
  }, [generatedIcons]);

  const clearAll = useCallback(() => {
    setSourceImage(null);
    setGeneratedIcons([]);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const iosIcons = generatedIcons.filter((i) => i.platform === 'ios');
  const androidIcons = generatedIcons.filter((i) => i.platform === 'android');

  return (
    <div className="space-y-6">
      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Upload Section */}
      <Card className="border-dashed border-2">
        <CardContent className="p-6">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          {!sourceImage ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-12 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Upload className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Importer une icône 1024×1024
              </h3>
              <p className="text-sm text-muted-foreground text-center max-w-sm">
                PNG ou JPG recommandé. L'image sera redimensionnée automatiquement vers toutes les tailles requises.
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="relative">
                <img
                  src={sourceImage}
                  alt="Source icon"
                  className="w-32 h-32 rounded-2xl shadow-lg object-cover"
                />
                <button
                  onClick={clearAll}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground">Image source chargée</p>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Platform Selection */}
      {sourceImage && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2 justify-center"
        >
          <Button
            variant={selectedPlatform === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPlatform('all')}
          >
            <Monitor className="w-4 h-4 mr-2" />
            Tous ({ICON_SIZES.length})
          </Button>
          <Button
            variant={selectedPlatform === 'ios' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPlatform('ios')}
          >
            <Smartphone className="w-4 h-4 mr-2" />
            iOS ({ICON_SIZES.filter((i) => i.platform === 'ios').length})
          </Button>
          <Button
            variant={selectedPlatform === 'android' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPlatform('android')}
          >
            <Smartphone className="w-4 h-4 mr-2" />
            Android ({ICON_SIZES.filter((i) => i.platform === 'android').length})
          </Button>
        </motion.div>
      )}

      {/* Generate Button */}
      {sourceImage && generatedIcons.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center"
        >
          <Button
            size="lg"
            onClick={generateIcons}
            disabled={isGenerating}
            className="min-w-[200px]"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Génération...
              </>
            ) : (
              <>
                <Image className="w-5 h-5 mr-2" />
                Générer les icônes
              </>
            )}
          </Button>
        </motion.div>
      )}

      {/* Progress */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-center text-muted-foreground">
              Génération en cours... {Math.round(progress)}%
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Generated Icons */}
      <AnimatePresence>
        {generatedIcons.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Download All Button */}
            <div className="flex justify-center gap-3">
              <Button onClick={downloadAllIcons} size="lg">
                <Download className="w-5 h-5 mr-2" />
                Télécharger tout ({generatedIcons.length} icônes)
              </Button>
              <Button variant="outline" onClick={clearAll}>
                Recommencer
              </Button>
            </div>

            {/* iOS Icons */}
            {iosIcons.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Smartphone className="w-5 h-5" />
                    iOS ({iosIcons.length} icônes)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {iosIcons.map((icon, index) => (
                      <motion.div
                        key={icon.name}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex flex-col items-center gap-2 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer group"
                        onClick={() => downloadIcon(icon)}
                      >
                        <div className="relative">
                          <img
                            src={icon.dataUrl}
                            alt={icon.name}
                            className="rounded-xl shadow-md"
                            style={{
                              width: Math.min(icon.size, 64),
                              height: Math.min(icon.size, 64),
                            }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                            <Download className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-xs font-medium">{icon.size}×{icon.size}</p>
                          <p className="text-[10px] text-muted-foreground">
                            {ICON_SIZES.find((s) => s.name === icon.name)?.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Android Icons */}
            {androidIcons.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Smartphone className="w-5 h-5" />
                    Android ({androidIcons.length} icônes)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                    {androidIcons.map((icon, index) => (
                      <motion.div
                        key={icon.name}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex flex-col items-center gap-2 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer group"
                        onClick={() => downloadIcon(icon)}
                      >
                        <div className="relative">
                          <img
                            src={icon.dataUrl}
                            alt={icon.name}
                            className="rounded-xl shadow-md"
                            style={{
                              width: Math.min(icon.size, 64),
                              height: Math.min(icon.size, 64),
                            }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                            <Download className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-xs font-medium">{icon.size}×{icon.size}</p>
                          <p className="text-[10px] text-muted-foreground">
                            {ICON_SIZES.find((s) => s.name === icon.name)?.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Success Message */}
            <div className="flex items-center justify-center gap-2 text-sm text-green-600 dark:text-green-400">
              <Check className="w-4 h-4" />
              Icônes prêtes pour App Store Connect et Google Play Console
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
