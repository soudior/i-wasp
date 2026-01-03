/**
 * AutoplayStoriesHero - Stories 24h autoplay on scan
 * 
 * Instant visual impact: Stories launch automatically (muted, playsinline)
 * when the NFC card is scanned. Creates a premium, Instagram-like experience.
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, ChevronRight, Clock, Eye, MessageCircle, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";

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

interface AutoplayStoriesHeroProps {
  cardId?: string;
  stories?: Story[];
  ownerName: string;
  ownerPhoto?: string;
  whatsappNumber?: string;
  onClose?: () => void;
  autoStart?: boolean;
  className?: string;
}

export function AutoplayStoriesHero({
  cardId,
  stories: propStories,
  ownerName,
  ownerPhoto,
  whatsappNumber,
  onClose,
  autoStart = true,
  className = "",
}: AutoplayStoriesHeroProps) {
  const [stories, setStories] = useState<Story[]>(propStories || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(autoStart);
  const [isLoading, setIsLoading] = useState(!propStories);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentStory = stories[currentIndex];
  const DURATION = currentStory?.content_type === "video" ? 15000 : 5000;

  // Fetch stories from Supabase
  useEffect(() => {
    if (propStories) {
      setStories(propStories);
      setIsLoading(false);
      return;
    }

    if (!cardId) {
      setIsLoading(false);
      return;
    }

    const fetchStories = async () => {
      try {
        const { data, error } = await supabase
          .from("card_stories")
          .select("*")
          .eq("card_id", cardId)
          .eq("is_active", true)
          .gt("expires_at", new Date().toISOString())
          .order("created_at", { ascending: false })
          .limit(10);

        if (error) throw error;
        setStories((data || []) as Story[]);
      } catch (err) {
        console.error("Error fetching stories:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStories();
  }, [cardId, propStories]);

  // Auto-advance timer
  useEffect(() => {
    if (!isPlaying || stories.length === 0) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / DURATION) * 100, 100);
      setProgress(newProgress);
      
      if (newProgress >= 100) {
        clearInterval(interval);
        if (currentIndex < stories.length - 1) {
          setCurrentIndex(prev => prev + 1);
          setProgress(0);
        } else if (onClose) {
          onClose();
        } else {
          setCurrentIndex(0);
          setProgress(0);
        }
      }
    }, 50);

    return () => clearInterval(interval);
  }, [currentIndex, stories.length, isPlaying, DURATION, onClose]);

  // Record view
  useEffect(() => {
    const recordView = async () => {
      if (currentStory) {
        try {
          await supabase.rpc("increment_story_view", { p_story_id: currentStory.id });
        } catch (err) {
          console.error("Error recording view:", err);
        }
      }
    };
    recordView();
  }, [currentStory]);

  const handleReplyWhatsApp = useCallback(() => {
    if (!whatsappNumber) return;
    const cleanNumber = whatsappNumber.replace(/[^\d+]/g, "").replace(/^\+/, "");
    const message = encodeURIComponent(`Bonjour ${ownerName}, j'ai vu votre story !`);
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, "_blank");
  }, [whatsappNumber, ownerName]);

  const goToNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setProgress(0);
    } else if (onClose) {
      onClose();
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setProgress(0);
    }
  };

  if (isLoading) {
    return (
      <div className={`relative aspect-[9/16] bg-black rounded-3xl flex items-center justify-center ${className}`}>
        <motion.div
          className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  if (stories.length === 0) {
    return null;
  }

  const timeAgo = formatDistanceToNow(new Date(currentStory.created_at), { 
    addSuffix: true, 
    locale: fr 
  });

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`relative aspect-[9/16] bg-black rounded-3xl overflow-hidden ${className}`}
      style={{
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(212, 175, 55, 0.2)",
      }}
    >
      {/* Progress bars */}
      <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 p-3 bg-gradient-to-b from-black/60 to-transparent">
        {stories.map((_, idx) => (
          <div key={idx} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-amber-400"
              style={{
                width: idx < currentIndex ? "100%" : idx === currentIndex ? `${progress}%` : "0%",
              }}
              transition={{ duration: 0.1 }}
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="absolute top-10 left-0 right-0 z-20 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          {ownerPhoto && (
            <div className="w-10 h-10 rounded-full border-2 border-amber-400 overflow-hidden">
              <img src={ownerPhoto} alt={ownerName} className="w-full h-full object-cover" />
            </div>
          )}
          <div>
            <p className="text-white text-sm font-semibold">{ownerName}</p>
            <div className="flex items-center gap-1 text-white/60 text-xs">
              <Clock size={10} />
              <span>{timeAgo}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {currentStory.content_type === "video" && (
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white"
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Navigation areas */}
      <button
        onClick={goToPrev}
        className="absolute left-0 top-20 bottom-24 w-1/3 z-10"
        disabled={currentIndex === 0}
      />
      <button
        onClick={goToNext}
        className="absolute right-0 top-20 bottom-24 w-1/3 z-10"
      />

      {/* Story content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStory.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {currentStory.content_type === "image" && currentStory.image_url && (
            <img
              src={currentStory.image_url}
              alt="Story"
              className="w-full h-full object-cover"
            />
          )}
          
          {currentStory.content_type === "video" && currentStory.video_url && (
            <video
              ref={videoRef}
              src={currentStory.video_url}
              muted={isMuted}
              autoPlay
              playsInline
              loop
              className="w-full h-full object-cover"
            />
          )}
          
          {currentStory.content_type === "text" && currentStory.text_content && (
            <div 
              className="w-full h-full flex items-center justify-center p-8"
              style={{ backgroundColor: currentStory.text_background_color || "#d4af37" }}
            >
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-white text-2xl font-semibold text-center leading-relaxed"
              >
                {currentStory.text_content}
              </motion.p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* View count */}
      <div className="absolute bottom-24 left-4 flex items-center gap-2 text-white/60 z-20">
        <Eye size={14} />
        <span className="text-xs">{currentStory.view_count} vues</span>
      </div>

      {/* Navigation indicator */}
      {stories.length > 1 && (
        <div className="absolute bottom-24 right-4 flex items-center gap-1 text-white/60 z-20">
          <span className="text-xs">{currentIndex + 1}/{stories.length}</span>
          <ChevronRight size={14} />
        </div>
      )}

      {/* Reply button */}
      {whatsappNumber && (
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute bottom-4 left-4 right-4 z-20"
        >
          <motion.button
            onClick={handleReplyWhatsApp}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold transition-colors"
          >
            <MessageCircle size={18} />
            Répondre via WhatsApp
          </motion.button>
        </motion.div>
      )}

      {/* Gold shimmer overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-10 opacity-20"
        style={{
          background: "radial-gradient(ellipse at top, rgba(212,175,55,0.15) 0%, transparent 50%)",
        }}
      />
    </motion.div>
  );
}

export default AutoplayStoriesHero;
