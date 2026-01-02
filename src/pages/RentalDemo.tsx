/**
 * Page de démonstration du template Gestion Locative
 * Affiche un exemple de carte NFC pour logement en location
 */

import { useState } from "react";
import { RentalConciergeTemplate, RentalPropertyData } from "@/components/templates/RentalConciergeTemplate";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LogIn, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

// Demo property data with sample iCal URLs (these would be real Airbnb/Booking export links in production)
const DEMO_PROPERTY: RentalPropertyData = {
  name: "Riad Jardin Secret",
  description: "Magnifique riad traditionnel au cœur de la médina avec piscine, terrasse panoramique et décoration artisanale. Parfait pour un séjour authentique à Marrakech.",
  photos: [
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&q=80",
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
  ],
  pricePerNight: 1500,
  currency: "MAD",
  address: "12 Derb El Ferrane, Médina",
  city: "Marrakech",
  latitude: 31.6295,
  longitude: -7.9811,
  wifiSsid: "Riad-Jardin-Secret",
  wifiPassword: "bienvenue2024",
  airbnbUrl: "https://airbnb.com",
  bookingUrl: "https://booking.com",
  // Note: These iCal URLs would be real export links from Airbnb/Booking in production
  // Example Airbnb: https://www.airbnb.com/calendar/ical/12345.ics?s=abc123
  // Example Booking: https://admin.booking.com/hotel/hoteladmin/ical.html?t=xyz789
  airbnbIcalUrl: null, // Add your Airbnb iCal export URL here
  bookingIcalUrl: null, // Add your Booking.com iCal export URL here
  whatsappNumber: "+212600000000",
  hostName: "Mohamed",
  amenities: ["Piscine", "WiFi", "Climatisation", "Petit-déjeuner", "Terrasse", "Parking"],
};

export default function RentalDemo() {
  const { isAuthenticated, signInWithGoogle, signOut, loading, user } = useGoogleAuth();

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link 
            to="/templates" 
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm">Templates</span>
          </Link>
          
          <h1 className="font-display text-lg font-semibold text-white">
            Gestion Locative
          </h1>

          <div>
            {isAuthenticated ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                className="text-white/70 hover:text-white"
              >
                <LogOut size={16} className="mr-2" />
                Déconnexion
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={signInWithGoogle}
                disabled={loading}
                className="border-[#d4af37]/30 text-[#d4af37] hover:bg-[#d4af37]/10"
              >
                <LogIn size={16} className="mr-2" />
                {loading ? "Connexion..." : "Google"}
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Info banner */}
        <div className="max-w-sm mx-auto mb-6">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-center">
            <p className="text-white/60 text-sm">
              {isAuthenticated ? (
                <>
                  Connecté en tant que <span className="text-[#d4af37]">{user?.email}</span>
                  <br />
                  <span className="text-xs text-white/40">L'accès WiFi est maintenant disponible</span>
                </>
              ) : (
                <>
                  <span className="text-[#d4af37]">Mode démo</span> — Connectez-vous avec Google pour accéder au WiFi
                </>
              )}
            </p>
          </div>
        </div>

        {/* Template preview */}
        <RentalConciergeTemplate
          property={DEMO_PROPERTY}
          isAuthenticated={isAuthenticated}
          onRequestAuth={signInWithGoogle}
        />

        {/* Features list */}
        <div className="max-w-sm mx-auto mt-8 space-y-4">
          <h2 className="text-white font-semibold text-center">Fonctionnalités incluses</h2>
          <ul className="space-y-2 text-sm text-white/60">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
              Galerie photo interactive
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
              QR WiFi sécurisé (après connexion Google)
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
              Liens Airbnb & Booking
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
              Calendrier temps réel Airbnb/Booking (iCal)
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
              Géolocalisation Google/Apple Maps
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
              WhatsApp direct avec message pré-rempli
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
              Design dark premium avec touches dorées
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
