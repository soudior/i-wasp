/**
 * StoriesSection - Section Stories 24h universelle pour tous les templates premium
 * Style Instagram avec cercle animé, auto-scroll et visualisation plein écran
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, Eye, Plus, MessageCircle, Play, Volume2, VolumeX } from "lucide-react";
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

interface StoriesSectionProps {
  cardId?: string;
  stories?: Story[];
  ownerName: string;
  ownerPhoto?: string;
  whatsappNumber?: string;
  variant?: "default" | "minimal" | "premium";
  className?: string;
  onStoryViewed?: (storyId: string) => void;
}

// Hook pour récupérer les stories depuis Supabase
export function useCardStories(cardId?: string) {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!cardId) {
      setLoading(false);
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
        setStories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [cardId]);

  return { stories, loading };
}

// Story Ring Component
const StoryRing: React.FC<{
  story: Story;
  ownerName: string;
  ownerPhoto?: string;
  index: number;
  onClick: () => void;
}> = ({ story, ownerName, ownerPhoto, index, onClick }) => {
  const isVideo = story.content_type === "video";

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      onClick={onClick}
      className="flex flex-col items-center gap-2 min-w-[80px]"
    >
      {/* Animated gradient ring */}
      <div className="relative">
        <motion.div
          className="absolute inset-0 rounded-full p-[3px]"
          style={{
            background: "linear-gradient(135deg, #d4af37, #f5c542, #d4af37, #b8860b)",
            backgroundSize: "200% 200%",
          }}
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        
        {/* Inner container */}
        <div className="relative w-[74px] h-[74px] rounded-full bg-black p-[3px]">
          {/* Story thumbnail */}
          <div className="w-full h-full rounded-full overflow-hidden">
            {story.content_type === "image" && story.image_url && (
              <img
                src={story.image_url}
                alt="Story"
                className="w-full h-full object-cover"
              />
            )}
            {story.content_type === "video" && (
              <div 
                className="w-full h-full flex items-center justify-center"
                style={{ backgroundColor: "#1a1a1a" }}
              >
                <Play className="w-6 h-6 text-amber-400" />
              </div>
            )}
            {story.content_type === "text" && (
              <div 
                className="w-full h-full flex items-center justify-center p-2"
                style={{ backgroundColor: story.text_background_color || "#d4af37" }}
              >
                <span className="text-white text-[10px] font-medium line-clamp-2 text-center">
                  {story.text_content?.substring(0, 30)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Video indicator */}
        {isVideo && (
          <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center border-2 border-black">
            <Play className="w-2.5 h-2.5 text-black fill-black" />
          </div>
        )}
      </div>

      {/* Time ago */}
      <span className="text-[10px] text-white/60 whitespace-nowrap">
        {formatDistanceToNow(new Date(story.created_at), { 
          addSuffix: false, 
          locale: fr 
        })}
      </span>
    </motion.button>
  );
};

// Story Viewer Modal
const StoryViewerModal: React.FC<{
  stories: Story[];
  initialIndex: number;
  ownerName: string;
  whatsappNumber?: string;
  onClose: () => void;
  onView?: (storyId: string) => void;
}> = ({ stories, initialIndex, ownerName, whatsappNumber, onClose, onView }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const currentStory = stories[currentIndex];
  const DURATION = currentStory.content_type === "video" ? 15000 : 5000;

  // Auto-advance timer
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / DURATION) * 100, 100);
      setProgress(newProgress);
      
      if (newProgress >= 100) {
        clearInterval(interval);
        if (currentIndex < stories.length - 1) {
          setCurrentIndex(currentIndex + 1);
        } else {
          onClose();
        }
      }
    }, 50);

    return () => clearInterval(interval);
  }, [currentIndex, stories.length, onClose, DURATION]);

  // Record view
  useEffect(() => {
    if (onView && currentStory) {
      onView(currentStory.id);
    }
  }, [currentStory, onView]);

  const handleReplyWhatsApp = useCallback(() => {
    if (!whatsappNumber) return;
    const cleanNumber = whatsappNumber.replace(/[^\d+]/g, "").replace(/^\+/, "");
    const message = encodeURIComponent(`Bonjour ${ownerName}, j'ai vu votre story !`);
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, "_blank");
  }, [whatsappNumber, ownerName]);

  const goToNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
    }
  };

  const timeAgo = formatDistanceToNow(new Date(currentStory.created_at), { 
    addSuffix: true, 
    locale: fr 
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black"
    >
      {/* Progress bars */}
      <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 p-2">
        {stories.map((_, idx) => (
          <div key={idx} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-100"
              style={{
                width: idx < currentIndex ? "100%" : idx === currentIndex ? `${progress}%` : "0%",
              }}
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="absolute top-8 left-0 right-0 z-20 flex items-center justify-between px-4">
        <div className="flex items-center gap-2 text-white">
          <Clock size={14} className="opacity-70" />
          <span className="text-sm opacity-70">{timeAgo}</span>
        </div>
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
        >
          <X size={20} />
        </button>
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
      <div className="absolute inset-0 flex items-center justify-center">
        {currentStory.content_type === "image" && currentStory.image_url && (
          <img
            src={currentStory.image_url}
            alt="Story"
            className="max-w-full max-h-full object-contain"
          />
        )}
        
        {currentStory.content_type === "video" && currentStory.video_url && (
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              src={currentStory.video_url}
              muted={isMuted}
              autoPlay
              playsInline
              loop
              className="w-full h-full object-contain"
            />
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="absolute bottom-32 right-4 p-3 rounded-full bg-black/50 backdrop-blur-sm text-white"
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          </div>
        )}
        
        {currentStory.content_type === "text" && currentStory.text_content && (
          <div 
            className="w-full h-full flex items-center justify-center p-8"
            style={{ backgroundColor: currentStory.text_background_color || "#d4af37" }}
          >
            <p className="text-white text-2xl md:text-4xl font-semibold text-center leading-relaxed max-w-2xl">
              {currentStory.text_content}
            </p>
          </div>
        )}
      </div>

      {/* View count */}
      <div className="absolute bottom-24 left-4 flex items-center gap-2 text-white/70 z-20">
        <Eye size={16} />
        <span className="text-sm">{currentStory.view_count} vue{currentStory.view_count !== 1 ? "s" : ""}</span>
      </div>

      {/* Reply button */}
      {whatsappNumber && (
        <div className="absolute bottom-6 left-0 right-0 z-20 flex items-center justify-center px-4">
          <motion.button
            onClick={handleReplyWhatsApp}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-green-500 hover:bg-green-600 text-white font-medium transition-colors"
          >
            <MessageCircle size={18} />
            Répondre via WhatsApp
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};

// Main Stories Section Component
export function StoriesSection({
  cardId,
  stories: propStories,
  ownerName,
  ownerPhoto,
  whatsappNumber,
  variant = "default",
  className = "",
  onStoryViewed,
}: StoriesSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { stories: fetchedStories, loading } = useCardStories(cardId);
  const stories = propStories || fetchedStories;
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Auto-scroll to stories on mount
  useEffect(() => {
    if (stories.length > 0 && sectionRef.current) {
      setTimeout(() => {
        sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 500);
    }
  }, [stories.length]);

  const handleView = useCallback(async (storyId: string) => {
    try {
      await supabase.rpc("increment_story_view", { p_story_id: storyId });
      onStoryViewed?.(storyId);
    } catch (error) {
      console.error("Error incrementing story view:", error);
    }
  }, [onStoryViewed]);

  if (loading || stories.length === 0) {
    return null;
  }

  return (
    <>
      <motion.section
        ref={sectionRef}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`mb-6 ${className}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <h3 className="text-xs uppercase tracking-[0.15em] text-amber-400/80 font-medium">
              Stories 24h
            </h3>
          </div>
          <span className="text-[10px] text-white/40">
            {stories.length} activ{stories.length > 1 ? "es" : "e"}
          </span>
        </div>

        {/* Stories scroll container */}
        <div className="relative">
          {/* Gradient fade left */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
          
          {/* Stories list */}
          <div className="flex gap-4 overflow-x-auto pb-2 px-2 scrollbar-hide scroll-smooth">
            {stories.map((story, index) => (
              <StoryRing
                key={story.id}
                story={story}
                ownerName={ownerName}
                ownerPhoto={ownerPhoto}
                index={index}
                onClick={() => setSelectedIndex(index)}
              />
            ))}
            
            {/* Add story placeholder (for owners) */}
            {variant === "premium" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: stories.length * 0.1 }}
                className="flex flex-col items-center gap-2 min-w-[80px]"
              >
                <div className="w-[74px] h-[74px] rounded-full border-2 border-dashed border-white/20 flex items-center justify-center">
                  <Plus className="w-6 h-6 text-white/40" />
                </div>
                <span className="text-[10px] text-white/40">Ajouter</span>
              </motion.div>
            )}
          </div>

          {/* Gradient fade right */}
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
        </div>
      </motion.section>

      {/* Story Viewer Modal */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <StoryViewerModal
            stories={stories}
            initialIndex={selectedIndex}
            ownerName={ownerName}
            whatsappNumber={whatsappNumber}
            onClose={() => setSelectedIndex(null)}
            onView={handleView}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default StoriesSection;
