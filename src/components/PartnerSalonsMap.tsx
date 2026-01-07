/**
 * PartnerSalonsMap - Carte interactive des salons partenaires NFC Nails
 */

import { useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Phone, 
  Clock, 
  Star, 
  Navigation,
  Sparkles,
  ChevronRight
} from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom marker icon for salons
const salonIcon = new L.DivIcon({
  className: "custom-salon-marker",
  html: `<div style="
    background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(236, 72, 153, 0.4);
    border: 3px solid white;
  ">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
      <path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z"/>
    </svg>
  </div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
});

interface PartnerSalon {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  hours: string;
  rating: number;
  specialties: string[];
  lat: number;
  lng: number;
  certified: boolean;
}

// Demo partner salons data
const partnerSalons: PartnerSalon[] = [
  {
    id: "1",
    name: "Nail Art Studio Paris",
    address: "15 Rue de Rivoli",
    city: "Paris",
    phone: "+33 1 42 36 XX XX",
    hours: "10h-19h",
    rating: 4.9,
    specialties: ["NFC Nails", "Nail Art", "Gel UV"],
    lat: 48.8566,
    lng: 2.3522,
    certified: true
  },
  {
    id: "2",
    name: "Beauty Lounge Marrakech",
    address: "Avenue Mohammed V",
    city: "Marrakech",
    phone: "+212 5 24 XX XX XX",
    hours: "9h-20h",
    rating: 4.8,
    specialties: ["NFC Nails", "Manucure", "Pédicure"],
    lat: 31.6295,
    lng: -7.9811,
    certified: true
  },
  {
    id: "3",
    name: "Ongles & Co Lyon",
    address: "45 Rue de la République",
    city: "Lyon",
    phone: "+33 4 72 XX XX XX",
    hours: "9h30-18h30",
    rating: 4.7,
    specialties: ["NFC Nails", "Semi-permanent", "Nail Art"],
    lat: 45.7640,
    lng: 4.8357,
    certified: true
  },
  {
    id: "4",
    name: "Prestige Nails Casablanca",
    address: "Boulevard Anfa",
    city: "Casablanca",
    phone: "+212 5 22 XX XX XX",
    hours: "10h-19h",
    rating: 4.9,
    specialties: ["NFC Nails", "Luxe", "Baby Boomer"],
    lat: 33.5731,
    lng: -7.5898,
    certified: true
  },
  {
    id: "5",
    name: "Glam Nails Bordeaux",
    address: "12 Cours de l'Intendance",
    city: "Bordeaux",
    phone: "+33 5 56 XX XX XX",
    hours: "10h-19h",
    rating: 4.6,
    specialties: ["NFC Nails", "Extensions", "French"],
    lat: 44.8378,
    lng: -0.5792,
    certified: true
  }
];

// Stealth palette
const STEALTH = {
  bg: "#050807",
  bgAlt: "#0A0D0C",
  accent: "#A5A9B4",
  accentLight: "#D1D5DB",
  border: "rgba(165, 169, 180, 0.12)",
  glass: "rgba(255, 255, 255, 0.02)"
};

// Map controller component
function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  map.flyTo(center, 12, { duration: 1.5 });
  return null;
}

export function PartnerSalonsMap() {
  const [selectedSalon, setSelectedSalon] = useState<PartnerSalon | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([35, 0]);
  const [zoom] = useState(3);

  const handleSalonClick = (salon: PartnerSalon) => {
    setSelectedSalon(salon);
    setMapCenter([salon.lat, salon.lng]);
  };

  return (
    <section className="py-16 px-6" style={{ backgroundColor: STEALTH.bgAlt }}>
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
            style={{ 
              backgroundColor: `${STEALTH.accent}10`, 
              border: `1px solid ${STEALTH.border}` 
            }}
          >
            <MapPin className="w-4 h-4" style={{ color: "#ec4899" }} />
            <span className="text-sm" style={{ color: STEALTH.accentLight }}>Réseau certifié</span>
          </div>
          <h2 
            className="text-3xl sm:text-4xl font-bold text-white mb-4"
            style={{ fontFamily: "'Bodoni Moda', serif" }}
          >
            Salons <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">partenaires</span>
          </h2>
          <p className="max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Trouvez un salon certifié i-Wasp près de chez vous pour votre pose d'ongles NFC
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Salons List */}
          <div className="lg:col-span-1 space-y-3 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
            {partnerSalons.map((salon, index) => (
              <motion.div
                key={salon.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleSalonClick(salon)}
                className={`p-4 rounded-2xl cursor-pointer transition-all ${
                  selectedSalon?.id === salon.id 
                    ? 'ring-2 ring-pink-500' 
                    : 'hover:bg-white/5'
                }`}
                style={{
                  background: selectedSalon?.id === salon.id 
                    ? 'linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)'
                    : STEALTH.glass,
                  border: `1px solid ${selectedSalon?.id === salon.id ? 'rgba(236, 72, 153, 0.3)' : STEALTH.border}`
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-white text-sm">{salon.name}</h3>
                    <p className="text-xs" style={{ color: STEALTH.accent }}>{salon.city}</p>
                  </div>
                  {salon.certified && (
                    <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-[10px] border-none">
                      <Sparkles className="w-2.5 h-2.5 mr-1" />
                      Certifié
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-3 text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    {salon.rating}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {salon.hours}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1 mt-2">
                  {salon.specialties.slice(0, 2).map((spec) => (
                    <span 
                      key={spec}
                      className="text-[10px] px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-2 rounded-2xl overflow-hidden relative"
            style={{ height: 500, border: `1px solid ${STEALTH.border}` }}
          >
            <MapContainer
              center={mapCenter}
              zoom={zoom}
              style={{ height: "100%", width: "100%" }}
              className="z-0"
            >
              <TileLayer
                attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
                url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
              />
              {selectedSalon && <MapController center={[selectedSalon.lat, selectedSalon.lng]} />}
              
              {partnerSalons.map((salon) => (
                <Marker
                  key={salon.id}
                  position={[salon.lat, salon.lng]}
                  icon={salonIcon}
                  eventHandlers={{
                    click: () => handleSalonClick(salon)
                  }}
                >
                  <Popup className="custom-popup">
                    <div className="p-1 min-w-[200px]">
                      <h3 className="font-bold text-sm mb-1">{salon.name}</h3>
                      <p className="text-xs text-gray-600 mb-2">{salon.address}, {salon.city}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                        <Phone className="w-3 h-3" />
                        {salon.phone}
                      </div>
                      <a 
                        href={`https://www.google.com/maps/dir/?api=1&destination=${salon.lat},${salon.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-pink-600 font-medium hover:underline"
                      >
                        <Navigation className="w-3 h-3" />
                        Itinéraire
                      </a>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>

            {/* Selected salon overlay */}
            <AnimatePresence>
              {selectedSalon && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute bottom-4 left-4 right-4 p-4 rounded-xl backdrop-blur-lg z-[1000]"
                  style={{ 
                    background: 'rgba(5, 8, 7, 0.9)',
                    border: `1px solid ${STEALTH.border}`
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-white">{selectedSalon.name}</h3>
                      <p className="text-sm" style={{ color: STEALTH.accent }}>
                        {selectedSalon.address}, {selectedSalon.city}
                      </p>
                    </div>
                    <a 
                      href={`tel:${selectedSalon.phone.replace(/\s/g, '')}`}
                      className="flex-shrink-0"
                    >
                      <Button 
                        size="sm" 
                        className="gap-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white border-none"
                      >
                        <Phone className="w-4 h-4" />
                        Appeler
                      </Button>
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* CTA to become partner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Vous êtes prothésiste ongulaire ?
          </p>
          <a href="https://wa.me/33626424394?text=Bonjour%20👋%0AJe%20souhaite%20devenir%20salon%20partenaire%20i-Wasp%20NFC%20Nails" target="_blank" rel="noopener noreferrer">
            <Button 
              variant="outline" 
              className="rounded-full gap-2"
              style={{ borderColor: STEALTH.border, color: 'white' }}
            >
              Devenir salon partenaire
              <ChevronRight className="w-4 h-4" />
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export default PartnerSalonsMap;
