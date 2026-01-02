/**
 * StoryViewer - Affichage plein écran des stories (style Instagram)
 * Auto-fermeture après 5 secondes, réponse via WhatsApp/Email
 */

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle, Mail, Clock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

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

interface StoryViewerProps {
  story: Story;
  ownerName: string;
  whatsappNumber?: string;
  email?: string;
  onClose: () => void;
  onView?: (storyId: string) => void;
}

export function StoryViewer({
  story,
  ownerName,
  whatsappNumber,
  email,
  onClose,
  onView,
}: StoryViewerProps) {
  const [progress, setProgress] = useState(0);
  const DURATION = 5000; // 5 seconds

  // Auto-close timer
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / DURATION) * 100, 100);
      setProgress(newProgress);
      
      if (newProgress >= 100) {
        clearInterval(interval);
        onClose();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [onClose]);

  // Record view
  useEffect(() => {
    if (onView) {
      onView(story.id);
    }
  }, [story.id, onView]);

  const handleReplyWhatsApp = useCallback(() => {
    if (!whatsappNumber) return;
    const cleanNumber = whatsappNumber.replace(/[^\d+]/g, "").replace(/^\+/, "");
    const message = encodeURIComponent(`Bonjour ${ownerName}, j'ai vu votre story et je souhaite en savoir plus !`);
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, "_blank");
  }, [whatsappNumber, ownerName]);

  const handleReplyEmail = useCallback(() => {
    if (!email) return;
    const subject = encodeURIComponent(`Suite à votre story`);
    const body = encodeURIComponent(`Bonjour ${ownerName},\n\nJ'ai vu votre story et je souhaite en savoir plus.\n\nCordialement`);
    window.open(`mailto:${email}?subject=${subject}&body=${body}`, "_blank");
  }, [email, ownerName]);

  const timeAgo = formatDistanceToNow(new Date(story.created_at), { 
    addSuffix: true, 
    locale: fr 
  });

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black"
        onClick={onClose}
      >
        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 z-10 p-2">
          <div className="h-1 bg-white/30 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Header */}
        <div className="absolute top-6 left-0 right-0 z-10 flex items-center justify-between px-4">
          <div className="flex items-center gap-2 text-white">
            <Clock size={14} className="opacity-70" />
            <span className="text-sm opacity-70">{timeAgo}</span>
          </div>
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

        {/* Story content */}
        <div 
          className="absolute inset-0 flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          {story.content_type === "image" && story.image_url && (
            <img
              src={story.image_url}
              alt="Story"
              className="max-w-full max-h-full object-contain"
            />
          )}
          
          {story.content_type === "text" && story.text_content && (
            <div 
              className="w-full h-full flex items-center justify-center p-8"
              style={{ backgroundColor: story.text_background_color || "#1D1D1F" }}
            >
              <p className="text-white text-2xl md:text-4xl font-semibold text-center leading-relaxed max-w-2xl">
                {story.text_content}
              </p>
            </div>
          )}
        </div>

        {/* View count */}
        <div className="absolute bottom-24 left-4 flex items-center gap-2 text-white/70">
          <Eye size={16} />
          <span className="text-sm">{story.view_count} vue{story.view_count !== 1 ? "s" : ""}</span>
        </div>

        {/* Reply buttons */}
        <div className="absolute bottom-6 left-0 right-0 z-10 flex items-center justify-center gap-3 px-4">
          {whatsappNumber && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleReplyWhatsApp();
              }}
              className="bg-green-500 hover:bg-green-600 text-white rounded-full gap-2"
            >
              <MessageCircle size={18} />
              Répondre via WhatsApp
            </Button>
          )}
          {email && !whatsappNumber && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleReplyEmail();
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full gap-2"
            >
              <Mail size={18} />
              Répondre par email
            </Button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
