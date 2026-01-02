import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Download, 
  Share2, 
  ArrowLeft, 
  Award,
  CheckCircle2
} from "lucide-react";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import iwaspLogo from "@/assets/iwasp-logo.png";

const CertificatPartenaire = () => {
  const [searchParams] = useSearchParams();
  const salonName = searchParams.get("salon") || "Nom du Salon";
  const city = searchParams.get("city") || "Casablanca";
  const [currentDate] = useState(new Date().toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long'
  }));

  const handleDownload = () => {
    toast.success("Capture d'écran pour télécharger le certificat");
  };

  const handleShare = () => {
    const text = `🏆 ${salonName} est maintenant un Salon Connecté & Revendeur Agréé i-wasp Nails!\n\nRéservez votre manucure connectée chez nous.\n\n#iwaspNails #SalonConnecté`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-amber-500/20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/devenir-partenaire" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Link>
          <div className="flex gap-2">
            <Button 
              onClick={handleShare}
              variant="outline" 
              size="sm"
              className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10"
            >
              <Share2 className="h-4 w-4 mr-1" />
              Partager
            </Button>
            <Button 
              onClick={handleDownload}
              size="sm"
              className="bg-gradient-to-r from-amber-500 to-yellow-500 text-black"
            >
              <Download className="h-4 w-4 mr-1" />
              Télécharger
            </Button>
          </div>
        </div>
      </header>

      {/* Certificate Display */}
      <div className="pt-24 pb-16 px-4 flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl"
        >
          {/* Certificate Frame */}
          <div className="relative bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] rounded-lg p-2 shadow-2xl">
            {/* Outer gold border */}
            <div className="absolute inset-0 rounded-lg border-4 border-amber-600/60" />
            
            {/* Inner certificate */}
            <div className="relative bg-gradient-to-b from-[#1a1a1a] via-[#0d0d0d] to-[#1a1a1a] rounded p-8 md:p-12 border border-amber-500/30">
              
              {/* Decorative corners */}
              <div className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-amber-500/70 rounded-tl" />
              <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-amber-500/70 rounded-tr" />
              <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-amber-500/70 rounded-bl" />
              <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-amber-500/70 rounded-br" />

              {/* Content */}
              <div className="text-center space-y-6 relative z-10">
                {/* Logo */}
                <div className="flex items-center justify-center gap-3 mb-8">
                  <img src={iwaspLogo} alt="i-wasp" className="h-10" />
                  <span className="text-amber-400 font-semibold text-lg">Nails</span>
                </div>

                {/* Title */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-serif italic text-amber-400 mb-2">
                    Certificat Officiel
                  </h1>
                  <h2 className="text-xl md:text-2xl font-bold tracking-widest text-amber-500 uppercase">
                    Partenariat Exclusif
                  </h2>
                </div>

                {/* Divider */}
                <div className="flex items-center justify-center gap-4 py-4">
                  <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-500/50" />
                  <Award className="h-6 w-6 text-amber-400" />
                  <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-500/50" />
                </div>

                {/* Certificate text */}
                <div className="space-y-4">
                  <p className="text-gray-400">Ce certificat est remis à :</p>
                  <h3 className="text-2xl md:text-3xl font-bold text-white font-serif">
                    {salonName}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    En reconnaissance de leur collaboration officielle avec i-wasp Nails en tant :
                  </p>
                  <div className="bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 py-3 px-6 rounded-lg border border-amber-500/30">
                    <p className="text-amber-400 font-bold text-lg tracking-wide">
                      "SALON CONNECTÉ & REVENDEUR AGRÉÉ"
                    </p>
                  </div>
                </div>

                {/* Bottom section */}
                <div className="flex items-center justify-between pt-8 mt-8 border-t border-amber-500/20">
                  {/* Seal */}
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                      <CheckCircle2 className="h-8 w-8 text-black" />
                    </div>
                  </div>

                  {/* Date & Location */}
                  <div className="text-center">
                    <p className="text-gray-400 text-sm">{city}, Maroc</p>
                    <p className="text-amber-400 font-semibold">{currentDate}</p>
                  </div>

                  {/* QR Code */}
                  <div className="bg-white p-2 rounded">
                    <QRCodeSVG 
                      value={`https://iwasp.ma/partenaire/${salonName.toLowerCase().replace(/\s+/g, '-')}`}
                      size={60}
                      level="M"
                    />
                  </div>
                </div>

                {/* Signature */}
                <div className="pt-4">
                  <p className="text-gray-500 text-xs italic">L'Équipe i-wasp</p>
                </div>
              </div>

              {/* Decorative patterns in corners */}
              <div className="absolute top-8 left-8 opacity-10">
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                  <path d="M30 0C30 16.569 16.569 30 0 30C16.569 30 30 43.431 30 60C30 43.431 43.431 30 60 30C43.431 30 30 16.569 30 0Z" fill="currentColor" className="text-amber-500"/>
                </svg>
              </div>
              <div className="absolute top-8 right-8 opacity-10">
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                  <path d="M30 0C30 16.569 16.569 30 0 30C16.569 30 30 43.431 30 60C30 43.431 43.431 30 60 30C43.431 30 30 16.569 30 0Z" fill="currentColor" className="text-amber-500"/>
                </svg>
              </div>
              <div className="absolute bottom-8 left-8 opacity-10">
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                  <path d="M30 0C30 16.569 16.569 30 0 30C16.569 30 30 43.431 30 60C30 43.431 43.431 30 60 30C43.431 30 30 16.569 30 0Z" fill="currentColor" className="text-amber-500"/>
                </svg>
              </div>
              <div className="absolute bottom-8 right-8 opacity-10">
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                  <path d="M30 0C30 16.569 16.569 30 0 30C16.569 30 30 43.431 30 60C30 43.431 43.431 30 60 30C43.431 30 30 16.569 30 0Z" fill="currentColor" className="text-amber-500"/>
                </svg>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Instructions */}
      <div className="pb-16 px-4">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-gray-400 text-sm">
            💡 Astuce : Faites une capture d'écran ou utilisez le bouton "Télécharger" pour sauvegarder votre certificat.
            Vous pouvez l'imprimer et l'afficher dans votre salon.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CertificatPartenaire;
