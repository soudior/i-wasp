import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Volume2, VolumeX, AlertCircle } from "lucide-react";

/**
 * MobileOptimizedVideo - Composant vidéo 100% compatible iOS & Android
 * 
 * Fonctionnalités :
 * - Poster image visible avant lecture
 * - Bouton Play overlay (pas d'autoplay bloqué sur mobile)
 * - Fallback si la vidéo ne charge pas
 * - Loading skeleton
 * - Hauteur minimale garantie
 * - Controls natifs sur mobile
 */

interface MobileOptimizedVideoProps {
  src: string;
  poster?: string;
  aspectRatio?: "9/16" | "16/9" | "4/3" | "1/1";
  autoPlayOnDesktop?: boolean;
  className?: string;
  rounded?: string;
  showControlsOnMobile?: boolean;
}

export function MobileOptimizedVideo({
  src,
  poster,
  aspectRatio = "9/16",
  autoPlayOnDesktop = true,
  className = "",
  rounded = "rounded-[1.75rem]",
  showControlsOnMobile = true,
}: MobileOptimizedVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isInView, setIsInView] = useState(false);

  // Détecter mobile
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice = /iphone|ipad|ipod|android|webos|blackberry|windows phone/i.test(userAgent);
      const isSmallScreen = window.innerWidth < 768;
      setIsMobile(isMobileDevice || isSmallScreen);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Intersection Observer pour lazy loading
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { rootMargin: "100px", threshold: 0.1 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Autoplay sur desktop si visible
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isInView || isMobile || !autoPlayOnDesktop) return;

    const attemptAutoplay = async () => {
      try {
        video.muted = true;
        await video.play();
        setIsPlaying(true);
        setShowPlayButton(false);
      } catch {
        // Autoplay bloqué, afficher le bouton play
        setShowPlayButton(true);
      }
    };

    if (!isLoading && !hasError) {
      attemptAutoplay();
    }
  }, [isInView, isMobile, autoPlayOnDesktop, isLoading, hasError]);

  const handlePlay = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      // Sur mobile, on garde muted pour éviter les blocages
      if (isMobile) {
        video.muted = true;
      }
      
      await video.play();
      setIsPlaying(true);
      setShowPlayButton(false);
    } catch (err) {
      console.warn("Video play failed:", err);
      // Essayer avec muted
      try {
        video.muted = true;
        await video.play();
        setIsPlaying(true);
        setShowPlayButton(false);
        setIsMuted(true);
      } catch {
        setHasError(true);
      }
    }
  }, [isMobile]);

  const handlePause = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    setIsPlaying(false);
    setShowPlayButton(true);
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  }, []);

  const handleVideoClick = useCallback(() => {
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  }, [isPlaying, handlePause, handlePlay]);

  const handleLoadedData = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
  }, []);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
  }, []);

  const handleCanPlay = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Aspect ratio classes
  const aspectClasses = {
    "9/16": "aspect-[9/16]",
    "16/9": "aspect-video",
    "4/3": "aspect-[4/3]",
    "1/1": "aspect-square",
  };

  // Générer un poster de fallback (gradient)
  const fallbackPoster = `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="700" viewBox="0 0 400 700">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1a1a1a;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#2a2a2a;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="400" height="700" fill="url(#grad)"/>
    </svg>
  `)}`;

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${aspectClasses[aspectRatio]} min-h-[300px] bg-zinc-900 ${rounded} overflow-hidden ${className}`}
    >
      {/* Loading Skeleton */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 bg-zinc-900 animate-pulse flex items-center justify-center z-10">
          <div className="w-16 h-16 rounded-full border-4 border-zinc-700 border-t-amber-500 animate-spin" />
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 bg-zinc-900 flex flex-col items-center justify-center z-20 p-6">
          {poster ? (
            <img 
              src={poster} 
              alt="Aperçu vidéo" 
              className="absolute inset-0 w-full h-full object-cover opacity-50"
            />
          ) : null}
          <div className="relative z-10 text-center">
            <AlertCircle className="w-12 h-12 text-zinc-500 mx-auto mb-4" />
            <p className="text-zinc-400 text-sm">Vidéo non disponible</p>
            <p className="text-zinc-500 text-xs mt-1">Vérifiez votre connexion</p>
          </div>
        </div>
      )}

      {/* Video Element */}
      {isInView && (
        <video
          ref={videoRef}
          src={src}
          poster={poster || fallbackPoster}
          loop
          muted={isMuted}
          playsInline
          webkit-playsinline="true"
          x-webkit-airplay="allow"
          preload="metadata"
          controls={isMobile && showControlsOnMobile && isPlaying}
          onLoadedData={handleLoadedData}
          onCanPlay={handleCanPlay}
          onError={handleError}
          onPlay={() => {
            setIsPlaying(true);
            setShowPlayButton(false);
          }}
          onPause={() => {
            setIsPlaying(false);
            setShowPlayButton(true);
          }}
          onClick={handleVideoClick}
          className={`absolute inset-0 w-full h-full object-cover cursor-pointer ${
            isLoading || hasError ? "opacity-0" : "opacity-100"
          } transition-opacity duration-300`}
          style={{
            // Hardware acceleration iOS
            WebkitTransform: "translate3d(0,0,0)",
            transform: "translate3d(0,0,0)",
            WebkitBackfaceVisibility: "hidden",
            backfaceVisibility: "hidden",
          }}
        />
      )}

      {/* Play Button Overlay */}
      {showPlayButton && !hasError && !isLoading && (
        <button
          onClick={handlePlay}
          className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 backdrop-blur-[2px] transition-all duration-300 group"
          aria-label="Lire la vidéo"
        >
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/90 backdrop-blur-xl flex items-center justify-center shadow-2xl shadow-black/50 group-hover:scale-110 transition-transform duration-300">
            <Play className="w-8 h-8 md:w-10 md:h-10 text-black ml-1" fill="black" />
          </div>
        </button>
      )}

      {/* Mute Toggle (visible quand lecture en cours) */}
      {isPlaying && !isMobile && (
        <button
          onClick={toggleMute}
          className="absolute bottom-4 right-4 z-30 w-10 h-10 rounded-full bg-black/60 backdrop-blur-xl flex items-center justify-center text-white hover:bg-black/80 transition-colors"
          aria-label={isMuted ? "Activer le son" : "Couper le son"}
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5" />
          ) : (
            <Volume2 className="w-5 h-5" />
          )}
        </button>
      )}

      {/* Poster Image Fallback (affiché avant chargement) */}
      {poster && !isInView && (
        <img
          src={poster}
          alt="Aperçu"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
    </div>
  );
}

export default MobileOptimizedVideo;
