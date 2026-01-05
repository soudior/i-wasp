/**
 * StoryRing - Cercle animé autour de la photo de profil (style Instagram)
 * Affiche un contour coloré quand une story est active
 * Supporte plusieurs stories avec défilement automatique
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MultiStoryViewer } from "./MultiStoryViewer";
import { supabase } from "@/integrations/supabase/client";

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

interface StoryRingProps {
  photoUrl?: string;
  firstName: string;
  lastName: string;
  story?: Story | null; // Single story (backward compatible)
  stories?: Story[]; // Multiple stories
  whatsappNumber?: string;
  email?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "w-16 h-16",
  md: "w-24 h-24",
  lg: "w-32 h-32",
};

const ringPadding = {
  sm: "p-0.5",
  md: "p-1",
  lg: "p-1.5",
};

export function StoryRing({
  photoUrl,
  firstName,
  lastName,
  story,
  stories: propStories,
  whatsappNumber,
  email,
  size = "lg",
  className,
}: StoryRingProps) {
  const [showViewer, setShowViewer] = useState(false);
  
  // Support both single story and multiple stories
  const stories = propStories || (story ? [story] : []);
  const hasStories = stories.length > 0;
  const storyCount = stories.length;
  const initials = `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase();

  const handleStoryView = async (storyId: string) => {
    try {
      await supabase.rpc("increment_story_view", { p_story_id: storyId });
    } catch (error) {
      console.error("Error incrementing story view:", error);
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: hasStories ? 1.02 : 1 }}
        whileTap={{ scale: hasStories ? 0.98 : 1 }}
        onClick={() => hasStories && setShowViewer(true)}
        className={cn(
          "relative rounded-full focus:outline-none",
          hasStories && "cursor-pointer",
          !hasStories && "cursor-default",
          className
        )}
        disabled={!hasStories}
      >
        {/* Animated gradient ring for active story */}
        {hasStories && (
          <motion.div
            className={cn(
              "absolute inset-0 rounded-full",
              ringPadding[size]
            )}
            style={{
              background: "linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
            }}
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        )}

        {/* White/dark background ring */}
        <div
          className={cn(
            "relative rounded-full bg-background",
            sizeClasses[size],
            hasStories && ringPadding[size]
          )}
        >
          {/* Photo or initials */}
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={`${firstName} ${lastName}`}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                {initials}
              </span>
            </div>
          )}

          {/* Story count indicator */}
          {hasStories && (
            <motion.div
              className="absolute -bottom-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-gradient-to-br from-rose-500 to-purple-600 border-2 border-background flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 10 }}
            >
              {storyCount > 1 && (
                <span className="text-white text-[10px] font-bold">
                  {storyCount}
                </span>
              )}
            </motion.div>
          )}
        </div>
      </motion.button>

      {/* Multi Story Viewer Modal */}
      {showViewer && stories.length > 0 && (
        <MultiStoryViewer
          stories={stories}
          ownerName={`${firstName} ${lastName}`}
          ownerPhoto={photoUrl}
          whatsappNumber={whatsappNumber}
          email={email}
          onClose={() => setShowViewer(false)}
          onView={handleStoryView}
        />
      )}
    </>
  );
}
