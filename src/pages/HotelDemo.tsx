/**
 * Hotel Guide Demo Page
 * Showcase the Hotel & Tourist Guide template
 */

import { useState } from "react";
import { HotelGuideTemplate, HotelGuideLightTemplate, type HotelCardData } from "@/components/templates/HotelGuideTemplate";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Sun, Moon, Globe, Wifi, MapPin, Gift, Star } from "lucide-react";

// Sample hotel data
const sampleHotels: Record<string, HotelCardData> = {
  riad: {
    hotelName: "Riad Maison Bleue",
    hotelCategory: "5★ Riad",
    hotelTagline: "L'art de vivre marocain",
    conciergeName: "Mohammed",
    conciergeRole: "Chef Concierge",
    receptionPhone: "+212 5 24 38 90 00",
    wifiSsid: "MaisonBleue_Guest",
    wifiPassword: "Welcome2024",
    address: "2 Place Batha, Fès 30110, Maroc",
    dailyOffer: {
      title: "Spa & Hammam -20%",
      description: "Découvrez notre hammam traditionnel",
      validUntil: "31 Déc 2025",
    },
    placesToVisit: [
      { name: "Médina de Fès", distance: "5 min" },
      { name: "Palais Royal", distance: "10 min" },
      { name: "Tanneries Chouara", distance: "15 min" },
      { name: "Musée Dar Batha", distance: "8 min" },
    ],
    googleRating: 4.8,
    googleReviewsUrl: "https://g.page/riad-maison-bleue",
    tripAdvisorUrl: "https://tripadvisor.com/hotel-maison-bleue",
    language: "fr",
  },
  boutique: {
    hotelName: "L'Hôtel Marrakech",
    hotelCategory: "Boutique Hotel",
    hotelTagline: "Élégance & Authenticité",
    conciergeName: "Sarah",
    conciergeRole: "Guest Experience Manager",
    receptionPhone: "+212 5 24 44 22 11",
    wifiSsid: "LHotel_Premium",
    wifiPassword: "Marrakech2024",
    address: "Avenue Mohammed V, Marrakech",
    dailyOffer: {
      title: "Dîner Gourmet -15%",
      description: "Restaurant gastronomique",
    },
    placesToVisit: [
      { name: "Place Jemaa el-Fna", distance: "10 min" },
      { name: "Jardin Majorelle", distance: "15 min" },
    ],
    googleRating: 4.6,
    language: "fr",
  },
  resort: {
    hotelName: "Mazagan Beach Resort",
    hotelCategory: "5★ Resort",
    hotelTagline: "Where luxury meets the Atlantic",
    conciergeName: "Ahmed",
    conciergeRole: "VIP Concierge",
    receptionPhone: "+212 5 23 38 80 00",
    wifiSsid: "Mazagan_Guest",
    wifiPassword: "Ocean2024",
    address: "El Jadida, Morocco",
    dailyOffer: {
      title: "Golf Package",
      description: "18 holes + lunch included",
      validUntil: "15 Jan 2025",
    },
    placesToVisit: [
      { name: "Golf Course", distance: "On-site" },
      { name: "Private Beach", distance: "2 min" },
      { name: "El Jadida Medina", distance: "20 min" },
    ],
    googleRating: 4.5,
    language: "en",
  },
};

export default function HotelDemo() {
  const [selectedHotel, setSelectedHotel] = useState<keyof typeof sampleHotels>("riad");
  const [variant, setVariant] = useState<"dark" | "light">("dark");
  const [language, setLanguage] = useState<"fr" | "en" | "ar" | "es">("fr");
  
  const hotelData = { ...sampleHotels[selectedHotel], language };
  
  const TemplateComponent = variant === "dark" ? HotelGuideTemplate : HotelGuideLightTemplate;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-20 left-1/4 w-[600px] h-[600px] orb opacity-20 animate-pulse-glow" />
      <div className="noise" />
      
      <Navbar />
      
      <main className="relative z-10 pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm mb-6">
              <Building2 size={16} />
              Template Hôtellerie
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Hotel & Tourist Guide
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Carte NFC premium pour hôtels, riads et guides touristiques.
              WiFi, offres, avis, itinéraires - tout en un tap.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Preview */}
            <div className="order-2 lg:order-1 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              <div className="sticky top-24">
                <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700">
                  <TemplateComponent data={hotelData} showWalletButtons={true} />
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="order-1 lg:order-2 space-y-6 animate-fade-up" style={{ animationDelay: '0.2s' }}>
              {/* Quick Selectors */}
              <Card variant="premium">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 size={20} />
                    Choisir un hôtel
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(sampleHotels).map(([key, hotel]) => (
                      <Button
                        key={key}
                        variant={selectedHotel === key ? "default" : "outline"}
                        onClick={() => setSelectedHotel(key as keyof typeof sampleHotels)}
                        className="h-auto py-3 flex-col gap-1"
                      >
                        <span className="text-xs opacity-70">{hotel.hotelCategory}</span>
                        <span className="text-xs font-medium truncate w-full">{hotel.hotelName}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Theme */}
              <Card variant="premium">
                <CardHeader>
                  <CardTitle>Apparence</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={variant === "dark" ? "default" : "outline"}
                      onClick={() => setVariant("dark")}
                      className="gap-2"
                    >
                      <Moon size={16} />
                      Sombre
                    </Button>
                    <Button
                      variant={variant === "light" ? "default" : "outline"}
                      onClick={() => setVariant("light")}
                      className="gap-2"
                    >
                      <Sun size={16} />
                      Clair
                    </Button>
                  </div>
                  
                  <div>
                    <Label className="mb-2 block">Langue</Label>
                    <Select value={language} onValueChange={(v) => setLanguage(v as any)}>
                      <SelectTrigger>
                        <Globe size={16} className="mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="ar">العربية</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Features */}
              <Card variant="premium">
                <CardHeader>
                  <CardTitle>Fonctionnalités incluses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: Wifi, label: "WiFi instantané" },
                      { icon: MapPin, label: "Google Maps / Waze" },
                      { icon: Gift, label: "Offre du jour" },
                      { icon: Star, label: "Avis Google" },
                      { icon: Globe, label: "Multilingue" },
                      { icon: Building2, label: "Logo hôtel" },
                    ].map(({ icon: Icon, label }) => (
                      <div key={label} className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
                        <Icon size={16} className="text-amber-400" />
                        <span className="text-sm">{label}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Pricing */}
              <Card variant="premium" className="border-amber-500/20">
                <CardHeader>
                  <CardTitle className="text-amber-400">Offres commerciales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">Guest Card</span>
                        <span className="text-amber-400 font-bold">149€/an</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Petits hôtels, maisons d'hôtes</p>
                    </div>
                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">Smart Hotel ⭐</span>
                        <span className="text-amber-400 font-bold">299€/an</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Hôtels 3-4★, multilingue, stats</p>
                    </div>
                    <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">Hotel Experience</span>
                        <span className="text-amber-400 font-bold">599€/an</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Hôtels 4-5★, analytics, CRM</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
