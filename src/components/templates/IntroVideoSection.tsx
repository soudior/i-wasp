/**
 * IntroVideoSection - Section vidéo d'introduction pour templates premium
 * Design: Glassmorphism noir & or avec auto-play muted loop
 */

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

interface IntroVideoSectionProps {
  videoUrl: string;
  posterUrl?: string;
  title?: string;
  subtitle?: string;
  aspectRatio?: "16/9" | "4/3" | "1/1" | "9/16";
}

export function IntroVideoSection({ 
  videoUrl, 
  posterUrl,
  title,
  subtitle,
  aspectRatio = "16/9"
}: IntroVideoSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(false);

  // Aspect ratio classes
  const aspectClasses = {
    "16/9": "aspect-video",
    "4/3": "aspect-[4/3]",
    "1/1": "aspect-square",
    "9/16": "aspect-[9/16]"
  };

  // Force autoplay on mount
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tryPlay = async () => {
      try {
        video.muted = true;
        video.playsInline = true;
        await video.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    };

    tryPlay();
  }, [videoUrl]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-8"
    >
      {/* Section Header */}
      {(title || subtitle) && (
        <div className="text-center mb-4">
          {title && (
            <h3 className="text-sm uppercase tracking-[0.2em] text-[#d4af37] font-medium">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-xs text-white/50 mt-1">{subtitle}</p>
          )}
        </div>
      )}

      {/* Video Container */}
      <div 
        className="relative rounded-2xl overflow-hidden bg-black/50 backdrop-blur-sm border border-[#d4af37]/20"
        style={{
          boxShadow: "0 8px 32px rgba(212,175,55,0.15)"
        }}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
        onTouchStart={() => setShowControls(true)}
      >
        <div className={aspectClasses[aspectRatio]}>
          <video
            ref={videoRef}
            src={videoUrl}
            poster={posterUrl}
            loop
            muted
            playsInline
            autoPlay
            className="absolute inset-0 w-full h-full object-cover"
            onClick={togglePlay}
            style={{
              WebkitTransform: "translate3d(0,0,0)",
              transform: "translate3d(0,0,0)"
            }}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

          {/* Controls Overlay */}
          <motion.div
            initial={false}
            animate={{ opacity: showControls || !isPlaying ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {/* Play/Pause Button */}
            <motion.button
              onClick={togglePlay}
              whileTap={{ scale: 0.95 }}
              className="w-16 h-16 rounded-full flex items-center justify-center transition-all"
              style={{
                background: "rgba(212,175,55,0.3)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(212,175,55,0.5)"
              }}
            >
              {isPlaying ? (
                <Pause size={24} className="text-white" />
              ) : (
                <Play size={24} className="text-white ml-1" />
              )}
            </motion.button>
          </motion.div>

          {/* Mute Button */}
          <motion.button
            initial={false}
            animate={{ opacity: showControls ? 1 : 0.6 }}
            onClick={toggleMute}
            className="absolute bottom-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all"
            style={{
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.2)"
            }}
          >
            {isMuted ? (
              <VolumeX size={18} className="text-white/80" />
            ) : (
              <Volume2 size={18} className="text-[#d4af37]" />
            )}
          </motion.button>

          {/* Gold Border Accent */}
          <div className="absolute inset-0 rounded-2xl border border-[#d4af37]/10 pointer-events-none" />
        </div>
      </div>
    </motion.section>
  );
}

export default IntroVideoSection;
