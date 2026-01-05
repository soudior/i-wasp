/**
 * MultiStoryViewer - Affichage plein écran des stories multiples (style Instagram)
 * Défilement automatique, navigation tactile, barres de progression
 * Avec tracking analytics détaillé
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle, ChevronLeft, ChevronRight, Eye, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useStoryAnalytics } from "@/hooks/useStoryAnalytics";

interface Story {
  id: string;
  content_type: "image" | "text";
  image_url?: string;
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
  const [viewedStories, setViewedStories] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const storyStartTime = useRef<number>(Date.now());
  
  const { trackEvent } = useStoryAnalytics();

  const currentStory = stories[currentIndex];

  // Auto-advance timer
  useEffect(() => {
    if (isPaused) return;

    const startTime = Date.now();
    storyStartTime.current = startTime;
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / STORY_DURATION) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        clearInterval(interval);
        // Track complete view
        const duration = Date.now() - storyStartTime.current;
        trackEvent(currentStory.id, 'complete_view', duration);
        goToNext();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [currentIndex, isPaused, currentStory?.id]);

  // Record view when story changes
  useEffect(() => {
    if (currentStory && !viewedStories.has(currentStory.id)) {
      // Track view event
      trackEvent(currentStory.id, 'view');
      
      // Also call legacy onView callback
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
  }, [currentIndex]);

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
    }
  }, [currentIndex]);

  const handleReplyWhatsApp = useCallback(() => {
    if (!whatsappNumber) return;
    
    // Track WhatsApp click
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
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
  };

  // Click to navigate (left/right halves)
  const handleClick = (e: React.MouseEvent) => {
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

  const timeAgo = formatDistanceToNow(new Date(currentStory.created_at), {
    addSuffix: true,
    locale: fr,
  });

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black"
        ref={containerRef}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Progress bars */}
        <div className="absolute top-0 left-0 right-0 z-10 p-2 flex gap-1">
          {stories.map((_, idx) => (
            <div key={idx} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white"
                style={{
                  width:
                    idx < currentIndex
                      ? "100%"
                      : idx === currentIndex
                      ? `${progress}%`
                      : "0%",
                }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div
          className="absolute top-6 left-0 right-0 z-10 flex items-center justify-between px-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-3">
            {ownerPhoto ? (
              <img
                src={ownerPhoto}
                alt={ownerName}
                className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {ownerName[0]?.toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <p className="text-white font-medium text-sm">{ownerName}</p>
              <p className="text-white/60 text-xs">{timeAgo}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsPaused(!isPaused);
              }}
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              {isPaused ? <Play size={18} /> : <Pause size={18} />}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Story content */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStory.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full flex items-center justify-center"
            >
              {currentStory.content_type === "image" && currentStory.image_url && (
                <img
                  src={currentStory.image_url}
                  alt="Story"
                  className="max-w-full max-h-full object-contain"
                />
              )}

              {currentStory.content_type === "text" && currentStory.text_content && (
                <div
                  className="w-full h-full flex items-center justify-center p-8"
                  style={{
                    backgroundColor: currentStory.text_background_color || "#1D1D1F",
                  }}
                >
                  <p className="text-white text-2xl md:text-4xl font-semibold text-center leading-relaxed max-w-2xl">
                    {currentStory.text_content}
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation arrows (desktop) */}
        <div
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 hidden md:block"
          onClick={(e) => e.stopPropagation()}
        >
          {currentIndex > 0 && (
            <button
              onClick={goToPrev}
              className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
          )}
        </div>

        <div
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 hidden md:block"
          onClick={(e) => e.stopPropagation()}
        >
          {currentIndex < stories.length - 1 && (
            <button
              onClick={goToNext}
              className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          )}
        </div>

        {/* Story counter */}
        <div
          className="absolute bottom-24 left-4 flex items-center gap-4 text-white/70"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-2">
            <Eye size={16} />
            <span className="text-sm">
              {currentStory.view_count} vue{currentStory.view_count !== 1 ? "s" : ""}
            </span>
          </div>
          <span className="text-sm">
            {currentIndex + 1} / {stories.length}
          </span>
        </div>

        {/* Reply button */}
        {whatsappNumber && (
          <div
            className="absolute bottom-6 left-0 right-0 z-10 flex items-center justify-center px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              onClick={handleReplyWhatsApp}
              className="bg-green-500 hover:bg-green-600 text-white rounded-full gap-2"
            >
              <MessageCircle size={18} />
              Répondre via WhatsApp
            </Button>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
