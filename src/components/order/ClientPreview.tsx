/**
 * ClientPreview - Final client preview before payment
 * Shows both digital card preview and physical card preview
 * 
 * IWASP Premium: Cette preview doit rassurer le client
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOrderFunnel } from "@/contexts/OrderFunnelContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Smartphone,
  CreditCard,
  Eye,
  Phone,
  Mail,
  MapPin,
  Globe,
  Sparkles,
  CheckCircle2
} from "lucide-react";
import iwaspLogo from "@/assets/iwasp-logo-white.png";

interface ClientPreviewProps {
  compact?: boolean;
}

export function ClientPreview({ compact = false }: ClientPreviewProps) {
  const [open, setOpen] = useState(false);
  const { state } = useOrderFunnel();
  
  const selectedPalette = state.designConfig?.cardColor || "#1A1A1A";
  const isLightColor = selectedPalette === "#FFFFFF";
  
  const colorName = {
    "#1A1A1A": "Noir Élégant",
    "#FFFFFF": "Blanc Minimal",
    "#0F172A": "Bleu Nuit"
  }[selectedPalette] || "Personnalisé";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={compact ? "outline" : "default"} 
          className={compact ? "gap-2" : "gap-2 w-full h-14 text-lg rounded-full"}
          size={compact ? "sm" : "lg"}
        >
          <Eye className="h-5 w-5" />
          {compact ? "Aperçu" : "Aperçu final client"}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-5 w-5 text-accent" />
            Aperçu final de votre commande
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="digital" className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="digital" className="gap-2">
              <Smartphone className="h-4 w-4" />
              Carte Digitale
            </TabsTrigger>
            <TabsTrigger value="physical" className="gap-2">
              <CreditCard className="h-4 w-4" />
              Carte Physique
            </TabsTrigger>
          </TabsList>
          
          {/* Digital Card Preview */}
          <TabsContent value="digital" className="mt-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="text-center text-sm text-muted-foreground mb-4">
                Voici ce que vos contacts verront quand ils scanneront votre carte NFC
              </div>
              
              {/* Phone mockup */}
              <div className="relative mx-auto w-[280px]">
                {/* Phone frame */}
                <div className="relative bg-card border-4 border-foreground/20 rounded-[2.5rem] p-4 shadow-elevated">
                  {/* Dynamic island */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full" />
                  
                  {/* Screen content */}
                  <div className="mt-8 rounded-2xl overflow-hidden bg-gradient-to-b from-background to-card min-h-[400px] p-4">
                    {/* Header with logo */}
                    <div className="flex justify-between items-start mb-6">
                      <Badge variant="secondary" className="text-xs">
                        IWASP
                      </Badge>
                      <div className="text-right text-xs text-muted-foreground">
                        Carte NFC
                      </div>
                    </div>
                    
                    {/* Profile preview */}
                    <div className="text-center space-y-3 mb-6">
                      {/* Profile photo placeholder */}
                      <div className="mx-auto w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-2xl font-bold text-muted-foreground">
                          {state.personalInfo?.firstName?.charAt(0) || "?"}
                          {state.personalInfo?.lastName?.charAt(0) || ""}
                        </span>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold">
                          {state.personalInfo?.firstName} {state.personalInfo?.lastName}
                        </h3>
                        {state.personalInfo?.title && (
                          <p className="text-sm text-muted-foreground">
                            {state.personalInfo.title}
                          </p>
                        )}
                        {state.personalInfo?.company && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {state.personalInfo.company}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {/* Action buttons preview */}
                    <div className="space-y-2">
                      {state.personalInfo?.phone && (
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                          <Phone className="h-4 w-4 text-accent" />
                          <span className="text-sm">Appeler</span>
                        </div>
                      )}
                      {state.personalInfo?.email && (
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                          <Mail className="h-4 w-4 text-accent" />
                          <span className="text-sm">Email</span>
                        </div>
                      )}
                      {state.digitalInfo?.address && (
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                          <MapPin className="h-4 w-4 text-accent" />
                          <span className="text-sm">Localisation</span>
                        </div>
                      )}
                      {state.digitalInfo?.website && (
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                          <Globe className="h-4 w-4 text-accent" />
                          <span className="text-sm">Site web</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Footer */}
                    <div className="mt-6 text-center">
                      <p className="text-[10px] text-muted-foreground/60">
                        Powered by IWASP
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-2 text-sm text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                Carte digitale prête à être activée
              </div>
            </motion.div>
          </TabsContent>
          
          {/* Physical Card Preview */}
          <TabsContent value="physical" className="mt-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="text-center text-sm text-muted-foreground mb-4">
                Voici votre carte NFC physique telle qu'elle sera imprimée
              </div>
              
              {/* Physical card mockup */}
              <div className="flex justify-center">
                <motion.div
                  className="relative"
                  style={{ perspective: "1000px" }}
                  whileHover={{ rotateY: 5, rotateX: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Card */}
                  <div
                    className="relative w-[320px] aspect-[1.586/1] rounded-2xl overflow-hidden"
                    style={{
                      backgroundColor: selectedPalette,
                      boxShadow: `0 20px 40px -10px ${selectedPalette}40, 0 0 0 1px ${isLightColor ? "#e5e5e5" : "transparent"}`
                    }}
                  >
                    {/* IWASP logo - top right */}
                    <div className="absolute top-4 right-4">
                      <img
                        src={iwaspLogo}
                        alt="IWASP"
                        className="h-4 object-contain"
                        style={{
                          filter: isLightColor ? "invert(1)" : "none",
                          opacity: 0.6
                        }}
                      />
                    </div>
                    
                    {/* Client logo - centered */}
                    {state.designConfig?.logoUrl ? (
                      <div className="absolute inset-0 flex items-center justify-center p-8">
                        <img
                          src={state.designConfig.logoUrl}
                          alt="Logo"
                          className="max-w-[60%] max-h-[60%] object-contain"
                        />
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div 
                          className="text-center px-4"
                          style={{ color: isLightColor ? "#1A1A1A" : "#FFFFFF" }}
                        >
                          <p className="text-lg font-semibold opacity-60">
                            {state.personalInfo?.company || "Votre Logo"}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {/* NFC indicator */}
                    <div className="absolute bottom-4 left-4">
                      <div 
                        className="flex items-center gap-1 text-xs opacity-40"
                        style={{ color: isLightColor ? "#1A1A1A" : "#FFFFFF" }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-4h2v2h-2zm0-2h2V7h-2z"/>
                        </svg>
                        NFC
                      </div>
                    </div>
                  </div>
                  
                  {/* Card shadow */}
                  <div 
                    className="absolute -bottom-2 left-4 right-4 h-8 rounded-full blur-xl opacity-30"
                    style={{ backgroundColor: selectedPalette }}
                  />
                </motion.div>
              </div>
              
              {/* Card specs */}
              <Card className="bg-muted/30">
                <CardContent className="pt-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Couleur</p>
                      <p className="font-medium flex items-center gap-2">
                        <span
                          className="w-4 h-4 rounded-full border"
                          style={{ 
                            backgroundColor: selectedPalette,
                            borderColor: isLightColor ? "#e5e5e5" : selectedPalette
                          }}
                        />
                        {colorName}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Quantité</p>
                      <p className="font-medium">
                        {state.orderOptions?.quantity} carte{(state.orderOptions?.quantity || 0) > 1 ? "s" : ""}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Format</p>
                      <p className="font-medium">CR80 (85.6 × 54 mm)</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Finition</p>
                      <p className="font-medium">Mat premium</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex items-center justify-center gap-2 text-sm text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                Prêt pour impression
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
        
        {/* Confirmation */}
        <div className="mt-6 pt-4 border-t">
          <Button 
            onClick={() => setOpen(false)} 
            className="w-full btn-iwasp"
          >
            Confirmer et continuer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ClientPreview;
