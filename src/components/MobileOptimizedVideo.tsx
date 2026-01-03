import { useState, useRef, useEffect, useCallback } from "react";
import { Play, AlertCircle } from "lucide-react";

/**
 * MobileOptimizedVideo - Composant vidéo 100% compatible iOS & Android
 * 
 * Fonctionnalités :
 * - Poster HD visible immédiatement si vidéo ne charge pas
 * - Autoplay forcé muted playsInline pour iOS
 * - Fallback poster instantané si erreur
 * - Controls natifs sur mobile
 */

interface MobileOptimizedVideoProps {
  src: string;
  webmSrc?: string; // WebM source pour Android (plus léger)
  poster?: string;
  aspectRatio?: "9/16" | "16/9" | "4/3" | "1/1";
  autoPlayOnDesktop?: boolean;
  className?: string;
  rounded?: string;
  showControlsOnMobile?: boolean;
}

export function MobileOptimizedVideo({
  src,
  webmSrc,
  poster,
  aspectRatio = "9/16",
  autoPlayOnDesktop: _autoPlayOnDesktop = true,
  className = "",
  rounded = "rounded-[1.75rem]",
  showControlsOnMobile = true,
}: MobileOptimizedVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Force: no loading spinner, show poster immediately if video fails
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showPosterFallback, setShowPosterFallback] = useState(false);
  const playAttempts = useRef(0);
  const maxPlayAttempts = 3;

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

  // iOS autoplay: force play on mount with limited retries, fallback to poster
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    playAttempts.current = 0;
    setShowPosterFallback(false);
    
    const tryPlay = async () => {
      if (playAttempts.current >= maxPlayAttempts) {
        // Max attempts reached - show poster fallback
        setShowPosterFallback(true);
        setShowPlayButton(true);
        return;
      }
      
      try {
        video.muted = true;
        await video.play();
        setIsPlaying(true);
        setShowPlayButton(false);
        setShowPosterFallback(false);
      } catch {
        playAttempts.current++;
        // Retry with exponential backoff
        setTimeout(tryPlay, 300 * playAttempts.current);
      }
    };
    
    // Start playing immediately
    tryPlay();
    setIsLoading(false);
    setHasError(false);
  }, [src]);

  const handlePlay = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      await video.play();
      setIsPlaying(true);
      setShowPlayButton(false);
    } catch (err) {
      console.warn("Video play failed:", err);
      setHasError(true);
    }
  }, []);

  const handlePause = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    setIsPlaying(false);
    setShowPlayButton(true);
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
      className={`relative w-full ${aspectClasses[aspectRatio]} min-h-[300px] bg-zinc-900 ${rounded} overflow-hidden ${className}`}
    >
      {/* HD Poster Fallback - Show immediately if video can't play */}
      {(showPosterFallback || hasError) && poster && (
        <div className="absolute inset-0 z-10">
          <img 
            src={poster} 
            alt="Aperçu vidéo" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>
      )}

      {/* Loading Skeleton - Only show briefly */}
      {isLoading && !hasError && !showPosterFallback && (
        <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center z-10">
          <div className="w-12 h-12 rounded-full border-4 border-zinc-700 border-t-amber-500 animate-spin" />
        </div>
      )}

      {/* Error State without poster */}
      {hasError && !poster && (
        <div className="absolute inset-0 bg-zinc-900 flex flex-col items-center justify-center z-20 p-6">
          <div className="relative z-10 text-center">
            <AlertCircle className="w-12 h-12 text-zinc-500 mx-auto mb-4" />
            <p className="text-zinc-400 text-sm">Vidéo non disponible</p>
            <p className="text-zinc-500 text-xs mt-1">Vérifiez votre connexion</p>
          </div>
        </div>
      )}

      {/* Video Element - Always render, no lazy loading delay */}
      <video
        ref={videoRef}
        poster={poster || fallbackPoster}
        loop
        muted
        playsInline
        autoPlay
        preload="auto"
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
          hasError ? "opacity-0" : "opacity-100"
        } transition-opacity duration-300`}
        style={{
          WebkitTransform: "translate3d(0,0,0)",
          transform: "translate3d(0,0,0)",
        }}
      >
        {webmSrc && <source src={webmSrc} type="video/webm" />}
        <source src={src} type="video/mp4" />
      </video>

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

    </div>
  );
}

export default MobileOptimizedVideo;
