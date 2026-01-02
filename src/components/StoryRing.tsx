/**
 * StoryRing - Cercle animé autour de la photo de profil (style Instagram)
 * Affiche un contour coloré quand une story est active
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { StoryViewer } from "./StoryViewer";
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
  story?: Story | null;
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
  whatsappNumber,
  email,
  size = "lg",
  className,
}: StoryRingProps) {
  const [showViewer, setShowViewer] = useState(false);
  const hasStory = !!story;
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
        whileHover={{ scale: hasStory ? 1.02 : 1 }}
        whileTap={{ scale: hasStory ? 0.98 : 1 }}
        onClick={() => hasStory && setShowViewer(true)}
        className={cn(
          "relative rounded-full focus:outline-none",
          hasStory && "cursor-pointer",
          !hasStory && "cursor-default",
          className
        )}
        disabled={!hasStory}
      >
        {/* Animated gradient ring for active story */}
        {hasStory && (
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
            hasStory && ringPadding[size]
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

          {/* Story indicator dot */}
          {hasStory && (
            <motion.div
              className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-gradient-to-br from-rose-500 to-purple-600 border-2 border-background"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 10 }}
            />
          )}
        </div>
      </motion.button>

      {/* Story Viewer Modal */}
      {showViewer && story && (
        <StoryViewer
          story={story}
          ownerName={`${firstName} ${lastName}`}
          whatsappNumber={whatsappNumber}
          email={email}
          onClose={() => setShowViewer(false)}
          onView={handleStoryView}
        />
      )}
    </>
  );
}
