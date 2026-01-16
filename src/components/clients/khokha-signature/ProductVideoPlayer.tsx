/**
 * ProductVideoPlayer - Video player for Khokha Signature products
 * 
 * Features:
 * - Autoplay on visible (muted)
 * - Play/Pause toggle
 * - Full-screen support
 * - Luxury styling matching brand
 */

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";

interface ProductVideoPlayerProps {
  src: string;
  poster?: string;
  className?: string;
}

// Khokha Signature colors
const KS_COLORS = {
  background: "#0A0A0A",
  card: "#111111",
  gold: "#D4AF37",
  goldLight: "#F4E4BC",
  text: "#FFFFFF",
};

export function ProductVideoPlayer({ src, poster, className = "" }: ProductVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Auto-play when visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
            setIsPlaying(true);
          } else {
            video.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(video);

    return () => observer.disconnect();
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.requestFullscreen) {
      video.requestFullscreen();
    }
  };

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted={isMuted}
        loop
        playsInline
        className="w-full h-full object-cover"
        style={{ backgroundColor: KS_COLORS.background }}
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(to top, ${KS_COLORS.background}80 0%, transparent 30%)`,
        }}
      />

      {/* Play/Pause indicator */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: showControls || !isPlaying ? 1 : 0, scale: 1 }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <motion.div
          whileTap={{ scale: 0.9 }}
          className="w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-sm pointer-events-auto cursor-pointer"
          style={{
            backgroundColor: KS_COLORS.gold + "30",
            border: `2px solid ${KS_COLORS.gold}50`,
          }}
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
        >
          {isPlaying ? (
            <Pause size={28} style={{ color: KS_COLORS.gold }} />
          ) : (
            <Play size={28} style={{ color: KS_COLORS.gold, marginLeft: 4 }} />
          )}
        </motion.div>
      </motion.div>

      {/* Video indicator badge */}
      <div
        className="absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1"
        style={{
          backgroundColor: KS_COLORS.gold,
          color: KS_COLORS.background,
        }}
      >
        <Play size={10} fill="currentColor" />
        Vidéo
      </div>

      {/* Bottom controls */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showControls ? 1 : 0 }}
        className="absolute bottom-3 right-3 flex gap-2"
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleMute();
          }}
          className="w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm"
          style={{
            backgroundColor: KS_COLORS.card + "80",
          }}
        >
          {isMuted ? (
            <VolumeX size={14} style={{ color: KS_COLORS.text }} />
          ) : (
            <Volume2 size={14} style={{ color: KS_COLORS.gold }} />
          )}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleFullscreen();
          }}
          className="w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm"
          style={{
            backgroundColor: KS_COLORS.card + "80",
          }}
        >
          <Maximize size={14} style={{ color: KS_COLORS.text }} />
        </button>
      </motion.div>
    </div>
  );
}
