/**
 * NFC Demo Page
 * 
 * Showcases the 3D NFC tap animation
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Palette, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { NFCTapAnimation3D } from "@/components/NFCTapAnimation3D";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const colorPresets = [
  { name: "Noir Mat", card: "#0B0B0B", accent: "#D4AF37" },
  { name: "Blanc Luxe", card: "#F5F5F7", accent: "#1D1D1F" },
  { name: "Bleu Nuit", card: "#0F172A", accent: "#3B82F6" },
  { name: "Émeraude", card: "#064E3B", accent: "#10B981" },
  { name: "Bordeaux", card: "#450A0A", accent: "#F59E0B" },
];

export default function NFCDemo3D() {
  const [selectedPreset, setSelectedPreset] = useState(colorPresets[0]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft size={20} />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Animation NFC 3D
              </h1>
              <p className="text-muted-foreground">
                Visualisez l'expérience de tap NFC en temps réel
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Animation Panel */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <NFCTapAnimation3D
                  cardColor={selectedPreset.card}
                  accentColor={selectedPreset.accent}
                  className="w-full"
                />
              </motion.div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                {[
                  { icon: "📱", title: "Compatible iOS & Android" },
                  { icon: "⚡", title: "Connexion instantanée" },
                  { icon: "🔒", title: "100% sécurisé" },
                ].map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="text-center p-4 rounded-xl bg-card/50 border border-border/50"
                  >
                    <span className="text-2xl mb-2 block">{feature.icon}</span>
                    <span className="text-xs text-muted-foreground">{feature.title}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Controls Panel */}
            <div className="space-y-6">
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
                <div className="flex items-center gap-2 mb-4">
                  <Palette size={18} className="text-primary" />
                  <h3 className="font-semibold">Personnaliser</h3>
                </div>

                <div className="space-y-4">
                  <Label className="text-sm text-muted-foreground">
                    Couleur de la carte
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {colorPresets.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => setSelectedPreset(preset)}
                        className={`flex items-center gap-2 p-3 rounded-lg border transition-all ${
                          selectedPreset.name === preset.name
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-muted-foreground/50"
                        }`}
                      >
                        <div className="flex gap-1">
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: preset.card }}
                          />
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: preset.accent }}
                          />
                        </div>
                        <span className="text-xs font-medium truncate">
                          {preset.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </Card>

              {/* CTA */}
              <Card className="p-6 bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30">
                <h3 className="font-semibold mb-2">
                  Prêt à créer votre carte ?
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Commandez votre carte NFC personnalisée et impressionnez vos contacts.
                </p>
                <Link to="/order/type">
                  <Button className="w-full gap-2">
                    <Play size={16} />
                    Commander ma carte
                  </Button>
                </Link>
              </Card>

              {/* Info */}
              <div className="p-4 rounded-xl bg-muted/30 border border-border/30">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Comment ça marche ?</strong>
                  <br />
                  Approchez simplement votre téléphone de la carte NFC IWASP. 
                  La connexion se fait instantanément, sans application à installer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
