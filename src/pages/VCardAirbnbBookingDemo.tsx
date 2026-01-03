/**
 * Demo page for VCardAirbnbBookingTemplate
 * Shows sample rental property with all features
 */

import VCardAirbnbBookingTemplate from "@/components/templates/VCardAirbnbBookingTemplate";
import type { VCardAirbnbBookingData, NearbyPlace } from "@/components/templates/VCardAirbnbBookingTemplate";

// Sample nearby places
const DEMO_NEARBY_PLACES: NearbyPlace[] = [
  {
    name: "Le Jardin Secret",
    type: "attraction",
    description: "Magnifique jardin historique au cœur de la médina",
    distance: "5 min à pied",
    url: "https://www.lejardinsecretmarrakech.com/",
  },
  {
    name: "Café Nomad",
    type: "restaurant",
    description: "Rooftop avec vue panoramique, cuisine marocaine moderne",
    distance: "3 min à pied",
    url: "https://www.cafenomad.ma/",
  },
  {
    name: "Hammam de la Rose",
    type: "activity",
    description: "Spa traditionnel marocain, soins et massages",
    distance: "8 min à pied",
    url: "https://hammamdelarose.com/",
  },
  {
    name: "Souk des Épices",
    type: "shop",
    description: "Épices, artisanat et souvenirs authentiques",
    distance: "2 min à pied",
  },
];

// Sample demo data
const DEMO_DATA: VCardAirbnbBookingData = {
  // Property info
  propertyName: "Riad Lumière d'Orient",
  propertyType: "Riad de charme · 4 chambres",
  tagline: "Votre havre de paix au cœur de la médina",
  
  // Photos (using placeholder URLs - in production, use real images)
  photos: [
    "https://images.unsplash.com/photo-1590073242678-70ee3fc28f8e?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop",
  ],
  
  // Location
  address: "42 Derb Sidi Bouamar, Médina de Marrakech",
  city: "Marrakech",
  directionsUrl: "https://maps.app.goo.gl/example123",
  latitude: 31.6295,
  longitude: -7.9811,
  
  // Contact
  hostName: "Famille Benali",
  phone: "+212 6 12 34 56 78",
  whatsapp: "212612345678",
  email: "contact@riad-lumiere.com",
  
  // Reviews
  airbnbReviewsUrl: "https://www.airbnb.com/rooms/example",
  bookingReviewsUrl: "https://www.booking.com/hotel/example",
  googleReviewsUrl: "https://maps.app.goo.gl/example",
  rating: 4.9,
  reviewCount: 127,
  
  // Booking platforms
  airbnbUrl: "https://www.airbnb.com/rooms/example",
  bookingUrl: "https://www.booking.com/hotel/example",
  directBookingUrl: "https://riad-lumiere.com/reserver",
  
  // Stay info
  checkInTime: "15h00",
  checkOutTime: "11h00",
  checkInInstructions: "Sonnez à la porte principale. Notre équipe vous accueillera avec un thé à la menthe traditionnel. Pour les arrivées tardives, appelez-nous 30 minutes avant.",
  keyBoxCode: "2847",
  
  // WiFi
  wifiSsid: "RiadLumiere_Guest",
  wifiPassword: "Bienvenue2025!",
  wifiSecurity: "WPA",
  
  // Nearby places
  nearbyPlaces: DEMO_NEARBY_PLACES,
  
  // Website
  website: "https://riad-lumiere.com",
  
  // NFC Card URL
  nfcCardUrl: "https://i-wasp.com/c/riad-lumiere",
};

export default function VCardAirbnbBookingDemo() {
  return (
    <VCardAirbnbBookingTemplate
      data={DEMO_DATA}
      cardId="demo-vcard-airbnb"
    />
  );
}
