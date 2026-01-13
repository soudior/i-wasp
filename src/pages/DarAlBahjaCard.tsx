/**
 * Dar Al Bahja - Villa Marrakech
 * Carte digitale NFC premium pour location de villa de luxe
 * Powered by i-wasp.com CORPORATION
 */

import { VCardAirbnbBookingTemplate, VCardAirbnbBookingData } from "@/components/templates/VCardAirbnbBookingTemplate";

const DAR_AL_BAHJA_DATA: VCardAirbnbBookingData = {
  // Property info
  propertyName: "Dar Al Bahja",
  propertyType: "Villa de Luxe",
  tagline: "Votre havre de paix à Marrakech",
  coverPhoto: "/images/dar-al-bahja/hero.jpg",
  
  // Photos gallery
  photos: [
    "/images/dar-al-bahja/hero.jpg",
    "/images/dar-al-bahja/villa-1.jpg",
    "/images/dar-al-bahja/villa-2.jpg",
    "/images/dar-al-bahja/villa-3.jpg",
    "/images/dar-al-bahja/villa-4.jpg",
    "/images/dar-al-bahja/villa-5.jpg",
    "/images/dar-al-bahja/villa-6.jpg",
    "/images/dar-al-bahja/villa-7.jpg",
  ],
  
  // Location
  address: "Marrakech, Maroc",
  city: "Marrakech",
  directionsUrl: "https://maps.google.com/?q=Marrakech,Maroc",
  
  // Contact
  hostName: "Dar Al Bahja",
  phone: "+212 600 000 000", // À personnaliser
  whatsapp: "+212600000000", // À personnaliser
  email: "contact@daralbahja.com", // À personnaliser
  
  // Reviews
  rating: 4.9,
  reviewCount: 127,
  airbnbReviewsUrl: "https://airbnb.com", // À personnaliser
  bookingReviewsUrl: "https://booking.com", // À personnaliser
  googleReviewsUrl: "https://google.com/maps", // À personnaliser
  
  // Booking platforms
  airbnbUrl: "https://airbnb.com", // À personnaliser
  bookingUrl: "https://booking.com", // À personnaliser
  
  // Stay info
  checkInTime: "15:00",
  checkOutTime: "11:00",
  checkInInstructions: "Accueil personnalisé à votre arrivée. Notre équipe vous attend pour vous faire découvrir la villa.",
  
  // WiFi
  wifiSsid: "DarAlBahja_Guest",
  wifiPassword: "bienvenue2024",
  wifiSecurity: "WPA",
  
  // Nearby places
  nearbyPlaces: [
    {
      name: "Jardin Majorelle",
      type: "attraction",
      description: "Célèbre jardin botanique",
      distance: "15 min",
    },
    {
      name: "Médina de Marrakech",
      type: "attraction", 
      description: "Cœur historique de la ville",
      distance: "20 min",
    },
    {
      name: "Restaurant La Mamounia",
      type: "restaurant",
      description: "Gastronomie marocaine raffinée",
      distance: "10 min",
    },
    {
      name: "Palais Bahia",
      type: "attraction",
      description: "Palais du 19ème siècle",
      distance: "25 min",
    },
  ],
  
  // NFC Card URL
  nfcCardUrl: "https://i-wasp.com/card/dar-al-bahja",
};

export default function DarAlBahjaCard() {
  return <VCardAirbnbBookingTemplate data={DAR_AL_BAHJA_DATA} />;
}
