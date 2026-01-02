import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import nfcDemoVideo from "@/assets/nfc-demo-video.mp4";

/**
 * Index - Page d'accueil ultra-luxe i-wasp
 * 
 * Design minimaliste noir & or centré sur la vidéo NFC.
 * Expérience "Palace" avec Playfair Display.
 */

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Hero Section - Vidéo comme pièce centrale */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-16 md:py-24">
        <div className="max-w-xl mx-auto text-center space-y-10">
          
          {/* Titre élégant */}
          <h1 className="font-playfair text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            Le Futur du Networking
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">
              au Maroc
            </span>
          </h1>

          {/* Vidéo NFC - Pièce centrale */}
          <div className="relative mx-auto max-w-xs">
            {/* Ombre dorée flottante */}
            <div 
              className="absolute inset-0 rounded-[2rem] blur-3xl opacity-40"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(251, 191, 36, 0.6) 0%, rgba(245, 158, 11, 0.3) 40%, transparent 70%)',
                transform: 'translateY(8px) scale(1.05)',
              }}
            />
            
            {/* Cadre smartphone premium */}
            <div className="relative bg-gradient-to-b from-zinc-800 to-zinc-900 p-1.5 rounded-[2rem] shadow-2xl">
              <video
                src={nfcDemoVideo}
                autoPlay
                loop
                muted
                playsInline
                className="w-full aspect-[9/16] object-cover rounded-[1.75rem]"
              />
            </div>
          </div>

          {/* CTA Buttons - Élégants et minimalistes */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-600 hover:via-yellow-500 hover:to-amber-600 text-black font-semibold gap-2 px-8 py-6 text-base rounded-xl shadow-lg shadow-amber-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/40 hover:scale-[1.02]"
              onClick={() => navigate("/order/type")}
            >
              Commander ma Carte
              <ArrowRight className="w-4 h-4" />
            </Button>
            
            <Button 
              size="lg"
              variant="outline"
              className="border-2 border-amber-500/60 bg-transparent text-amber-400 hover:bg-amber-500/10 hover:border-amber-400 font-medium gap-2 px-8 py-6 text-base rounded-xl transition-all duration-300"
              onClick={() => navigate("/templates")}
            >
              Voir les Templates
            </Button>
          </div>

          {/* Signature subtile */}
          <p className="text-zinc-600 text-sm font-light tracking-widest uppercase">
            i-wasp · Tap. Connect. Empower.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Index;
