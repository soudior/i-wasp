/**
 * MultiStoryViewer - Affichage plein écran immersif des stories (style Instagram Premium)
 * Défilement automatique, navigation tactile fluide, animations premium
 * Avec tracking analytics détaillé
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { X, MessageCircle, ChevronLeft, ChevronRight, Eye, Pause, Play, Volume2, VolumeX, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useStoryAnalytics } from "@/hooks/useStoryAnalytics";

interface Story {
  id: string;
  content_type: "image" | "text" | "video";
  image_url?: string;
  video_url?: string;
  text_content?: string;
  text_background_color?: string;
  created_at: string;
  expires_at: string;
  view_count: number;
}

interface MultiStoryViewerProps {
  stories: Story[];
  ownerName: string;
  ownerPhoto?: string;
  whatsappNumber?: string;
  email?: string;
  onClose: () => void;
  onView?: (storyId: string) => void;
  startIndex?: number;
}

const STORY_DURATION = 5000; // 5 seconds per story

export function MultiStoryViewer({
  stories,
  ownerName,
  ownerPhoto,
  whatsappNumber,
  email,
  onClose,
  onView,
  startIndex = 0,
}: MultiStoryViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [viewedStories, setViewedStories] = useState<Set<string>>(new Set());
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const storyStartTime = useRef<number>(Date.now());
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  
  const { trackEvent } = useStoryAnalytics();

  const currentStory = stories[currentIndex];
  const dragX = useMotionValue(0);
  const dragOpacity = useTransform(dragX, [-200, 0, 200], [0.5, 1, 0.5]);
  const dragScale = useTransform(dragX, [-200, 0, 200], [0.9, 1, 0.9]);

  // Cleanup function for interval
  const clearProgressInterval = useCallback(() => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
  }, []);

  // Auto-advance timer
  useEffect(() => {
    if (isPaused || isDragging) {
      clearProgressInterval();
      return;
    }

    const startTime = Date.now() - (progress / 100) * STORY_DURATION;
    storyStartTime.current = startTime;
    
    progressInterval.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / STORY_DURATION) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        clearProgressInterval();
        const duration = Date.now() - storyStartTime.current;
        trackEvent(currentStory.id, 'complete_view', duration);
        goToNext();
      }
    }, 16); // ~60fps for smooth progress

    return clearProgressInterval;
  }, [currentIndex, isPaused, isDragging, currentStory?.id]);

  // Record view when story changes
  useEffect(() => {
    if (currentStory && !viewedStories.has(currentStory.id)) {
      trackEvent(currentStory.id, 'view');
      if (onView) {
        onView(currentStory.id);
      }
      setViewedStories((prev) => new Set(prev).add(currentStory.id));
    }
  }, [currentStory?.id, onView, viewedStories, trackEvent]);

  // Reset progress when story changes
  useEffect(() => {
    setProgress(0);
    storyStartTime.current = Date.now();
    
    // Handle video
    if (videoRef.current && currentStory?.content_type === "video") {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [currentIndex]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const goToNext = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onClose();
    }
  }, [currentIndex, stories.length, onClose]);

  const goToPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      setProgress(0);
    }
  }, [currentIndex]);

  const handleReplyWhatsApp = useCallback(() => {
    if (!whatsappNumber) return;
    
    const duration = Date.now() - storyStartTime.current;
    trackEvent(currentStory.id, 'whatsapp_click', duration);
    
    const cleanNumber = whatsappNumber.replace(/[^\d+]/g, "").replace(/^\+/, "");
    const message = encodeURIComponent(
      `Bonjour ${ownerName}, j'ai vu votre story et je souhaite en savoir plus !`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, "_blank");
  }, [whatsappNumber, ownerName, currentStory?.id, trackEvent]);

  // Touch handling for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    setIsPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchStartX.current - touchEndX;
    const diffY = touchStartY.current - touchEndY;

    // Only navigate if horizontal swipe is dominant
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
      if (diffX > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    } else if (Math.abs(diffY) > 100 && diffY < 0) {
      // Swipe down to close
      onClose();
    }
    
    setIsPaused(false);
  };

  // Long press to pause
  const handleTouchStartPause = () => {
    setIsPaused(true);
  };

  const handleTouchEndPause = () => {
    setIsPaused(false);
  };

  // Click to navigate (left/right halves)
  const handleClick = (e: React.MouseEvent) => {
    if (isDragging) return;
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const halfWidth = rect.width / 2;

    if (clickX < halfWidth) {
      goToPrev();
    } else {
      goToNext();
    }
  };

  // Drag handling
  const handleDragEnd = (_: any, info: PanInfo) => {
    setIsDragging(false);
    setIsPaused(false);
    
    if (Math.abs(info.offset.x) > 100) {
      if (info.offset.x > 0) {
        goToPrev();
      } else {
        goToNext();
      }
    }
    
    if (info.offset.y > 150) {
      onClose();
    }
  };

  const timeAgo = formatDistanceToNow(new Date(currentStory.created_at), {
    addSuffix: true,
    locale: fr,
  });

  // Calculate time remaining
  const expiresAt = new Date(currentStory.expires_at);
  const now = new Date();
  const hoursRemaining = Math.max(0, Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60)));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
        style={{ touchAction: 'none' }}
      >
        {/* Blurred background */}
        <motion.div
          className="absolute inset-0 overflow-hidden"
          style={{ opacity: dragOpacity }}
        >
          {currentStory.content_type === "image" && currentStory.image_url && (
            <img
              src={currentStory.image_url}
              alt=""
              className="w-full h-full object-cover blur-3xl scale-150 opacity-30"
            />
          )}
          {currentStory.content_type === "text" && (
            <div
              className="w-full h-full opacity-30"
              style={{ backgroundColor: currentStory.text_background_color || "#1D1D1F" }}
            />
          )}
        </motion.div>

        {/* Story container */}
        <motion.div
          ref={containerRef}
          className="relative w-full h-full max-w-lg mx-auto flex flex-col"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragStart={() => { setIsDragging(true); setIsPaused(true); }}
          onDragEnd={handleDragEnd}
          style={{ x: dragX, scale: dragScale }}
          onClick={handleClick}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Progress bars */}
          <div className="absolute top-0 left-0 right-0 z-20 p-3 pt-[env(safe-area-inset-top,12px)]">
            <div className="flex gap-1">
              {stories.map((_, idx) => (
                <div 
                  key={idx} 
                  className="flex-1 h-[3px] bg-white/20 rounded-full overflow-hidden backdrop-blur-sm"
                >
                  <motion.div
                    className="h-full bg-white rounded-full"
                    initial={false}
                    animate={{
                      width: idx < currentIndex
                        ? "100%"
                        : idx === currentIndex
                        ? `${progress}%`
                        : "0%",
                    }}
                    transition={{ 
                      duration: idx === currentIndex ? 0.016 : 0.3,
                      ease: "linear" 
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Header */}
          <motion.div
            className="absolute top-8 left-0 right-0 z-20 flex items-center justify-between px-4 pt-[env(safe-area-inset-top,0px)]"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              {/* Profile ring */}
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-500 p-[2px]">
                  <div className="w-full h-full rounded-full bg-black" />
                </div>
                {ownerPhoto ? (
                  <img
                    src={ownerPhoto}
                    alt={ownerName}
                    className="relative w-11 h-11 rounded-full object-cover border-2 border-black"
                  />
                ) : (
                  <div className="relative w-11 h-11 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center border-2 border-black">
                    <span className="text-white font-semibold">
                      {ownerName[0]?.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              
              <div>
                <p className="text-white font-semibold text-sm">{ownerName}</p>
                <div className="flex items-center gap-2">
                  <p className="text-white/60 text-xs">{timeAgo}</p>
                  {hoursRemaining <= 6 && (
                    <span className="text-amber-400 text-xs">• {hoursRemaining}h restantes</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Mute button for videos */}
              {currentStory.content_type === "video" && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMuted(!isMuted);
                    if (videoRef.current) {
                      videoRef.current.muted = !isMuted;
                    }
                  }}
                  className="w-9 h-9 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white"
                >
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </motion.button>
              )}
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPaused(!isPaused);
                }}
                className="w-9 h-9 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white"
              >
                {isPaused ? <Play size={16} /> : <Pause size={16} />}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="w-9 h-9 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white"
              >
                <X size={18} />
              </motion.button>
            </div>
          </motion.div>

          {/* Story content */}
          <div className="flex-1 flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStory.id}
                initial={{ opacity: 0, scale: 1.1, x: 50 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: -50 }}
                transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
                className="w-full h-full flex items-center justify-center"
              >
                {/* Image story */}
                {currentStory.content_type === "image" && currentStory.image_url && (
                  <motion.img
                    src={currentStory.image_url}
                    alt="Story"
                    className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
                    layoutId={`story-image-${currentStory.id}`}
                  />
                )}

                {/* Video story */}
                {currentStory.content_type === "video" && currentStory.video_url && (
                  <video
                    ref={videoRef}
                    src={currentStory.video_url}
                    className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                  />
                )}

                {/* Text story */}
                {currentStory.content_type === "text" && currentStory.text_content && (
                  <motion.div
                    className="w-full h-full flex items-center justify-center p-8 rounded-2xl"
                    style={{
                      backgroundColor: currentStory.text_background_color || "#1D1D1F",
                    }}
                    initial={{ rotateY: -15 }}
                    animate={{ rotateY: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <motion.p 
                      className="text-white text-xl sm:text-2xl md:text-3xl font-semibold text-center leading-relaxed max-w-xl"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                    >
                      {currentStory.text_content}
                    </motion.p>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation arrows (desktop only) */}
          <div
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 hidden md:block"
            onClick={(e) => e.stopPropagation()}
          >
            <AnimatePresence>
              {currentIndex > 0 && (
                <motion.button
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
                  whileTap={{ scale: 0.9 }}
                  onClick={goToPrev}
                  className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white"
                >
                  <ChevronLeft size={22} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <div
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 hidden md:block"
            onClick={(e) => e.stopPropagation()}
          >
            <AnimatePresence>
              {currentIndex < stories.length - 1 && (
                <motion.button
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
                  whileTap={{ scale: 0.9 }}
                  onClick={goToNext}
                  className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white"
                >
                  <ChevronRight size={22} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom section */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 z-20 pb-[env(safe-area-inset-bottom,24px)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Stats bar */}
            <div className="flex items-center justify-between px-4 mb-4">
              <div className="flex items-center gap-4">
                <motion.div 
                  className="flex items-center gap-1.5 text-white/70"
                  whileHover={{ scale: 1.05 }}
                >
                  <Eye size={16} />
                  <span className="text-sm font-medium">
                    {currentStory.view_count}
                  </span>
                </motion.div>
                
                <span className="text-white/40 text-sm">
                  {currentIndex + 1} / {stories.length}
                </span>
              </div>

              {/* Share button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  // Share functionality
                  if (navigator.share) {
                    navigator.share({
                      title: `Story de ${ownerName}`,
                      text: currentStory.text_content || `Découvrez la story de ${ownerName}`,
                    });
                  }
                }}
                className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white"
              >
                <Share2 size={16} />
              </motion.button>
            </div>

            {/* Reply button */}
            {whatsappNumber && (
              <div className="px-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleReplyWhatsApp}
                  className="w-full py-3.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-2xl font-medium flex items-center justify-center gap-2 shadow-lg shadow-green-500/25"
                >
                  <MessageCircle size={20} />
                  Répondre via WhatsApp
                </motion.button>
              </div>
            )}
          </motion.div>

          {/* Pause indicator */}
          <AnimatePresence>
            {isPaused && !isDragging && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30"
              >
                <div className="w-16 h-16 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center">
                  <Pause size={32} className="text-white" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Story preview thumbnails (desktop) */}
        {stories.length > 1 && (
          <motion.div
            className="hidden lg:flex absolute bottom-8 left-1/2 -translate-x-1/2 gap-2 z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onClick={(e) => e.stopPropagation()}
          >
            {stories.map((s, idx) => (
              <motion.button
                key={s.id}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCurrentIndex(idx)}
                className={cn(
                  "w-12 h-16 rounded-lg overflow-hidden border-2 transition-all",
                  idx === currentIndex
                    ? "border-white scale-110"
                    : "border-white/30 opacity-60 hover:opacity-100"
                )}
              >
                {s.content_type === "image" && s.image_url ? (
                  <img src={s.image_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div
                    className="w-full h-full"
                    style={{ backgroundColor: s.text_background_color || "#1D1D1F" }}
                  />
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
