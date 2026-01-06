/**
 * StoryRing - Cercle animé autour de la photo de profil (style Instagram Premium)
 * Affiche un contour coloré animé quand une story est active
 * Supporte plusieurs stories avec défilement automatique
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MultiStoryViewer } from "./MultiStoryViewer";
import { supabase } from "@/integrations/supabase/client";
import { Plus } from "lucide-react";

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
  stories?: Story[];
  whatsappNumber?: string;
  email?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showLabel?: boolean;
}

const sizeClasses = {
  sm: "w-14 h-14",
  md: "w-20 h-20",
  lg: "w-28 h-28",
  xl: "w-36 h-36",
};

const ringThickness = {
  sm: 2,
  md: 3,
  lg: 3,
  xl: 4,
};

const innerPadding = {
  sm: "p-[3px]",
  md: "p-[4px]",
  lg: "p-[5px]",
  xl: "p-[6px]",
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
  showLabel = false,
}: StoryRingProps) {
  const [showViewer, setShowViewer] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [pulseKey, setPulseKey] = useState(0);
  
  // Support both single story and multiple stories
  const stories = propStories || (story ? [story] : []);
  const hasStories = stories.length > 0;
  const storyCount = stories.length;
  const initials = `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase();

  // Periodic pulse animation
  useEffect(() => {
    if (!hasStories) return;
    const interval = setInterval(() => {
      setPulseKey(prev => prev + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, [hasStories]);

  const handleStoryView = async (storyId: string) => {
    try {
      await supabase.rpc("increment_story_view", { p_story_id: storyId });
    } catch (error) {
      console.error("Error incrementing story view:", error);
    }
  };

  // Calculate segment angles for multiple stories indicator
  const segments = Math.min(storyCount, 8);
  const segmentAngle = 360 / segments;
  const gapAngle = segments > 1 ? 8 : 0;

  return (
    <>
      <div className={cn("flex flex-col items-center gap-2", className)}>
        <motion.button
          whileHover={{ scale: hasStories ? 1.05 : 1 }}
          whileTap={{ scale: hasStories ? 0.95 : 1 }}
          onClick={() => hasStories && setShowViewer(true)}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          className={cn(
            "relative rounded-full focus:outline-none",
            hasStories && "cursor-pointer",
            !hasStories && "cursor-default",
            sizeClasses[size]
          )}
          disabled={!hasStories}
        >
          {/* Outer glow effect when stories exist */}
          {hasStories && (
            <motion.div
              key={pulseKey}
              className="absolute inset-[-8px] rounded-full"
              initial={{ opacity: 0.6, scale: 1 }}
              animate={{ opacity: 0, scale: 1.3 }}
              transition={{ duration: 2, ease: "easeOut" }}
              style={{
                background: "radial-gradient(circle, rgba(236, 72, 153, 0.4) 0%, transparent 70%)",
              }}
            />
          )}

          {/* Animated gradient ring with segments */}
          {hasStories && (
            <div className="absolute inset-0 rounded-full">
              {/* Base rotating gradient */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(
                    from 0deg,
                    #f09433 0deg,
                    #e6683c 60deg,
                    #dc2743 120deg,
                    #cc2366 180deg,
                    #bc1888 240deg,
                    #833ab4 300deg,
                    #f09433 360deg
                  )`,
                  padding: `${ringThickness[size]}px`,
                }}
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <div className="w-full h-full rounded-full bg-background" />
              </motion.div>

              {/* Segment indicators for multiple stories */}
              {storyCount > 1 && (
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                  {Array.from({ length: segments }).map((_, i) => {
                    const startAngle = i * segmentAngle + gapAngle / 2;
                    const endAngle = (i + 1) * segmentAngle - gapAngle / 2;
                    const startRad = (startAngle - 90) * (Math.PI / 180);
                    const endRad = (endAngle - 90) * (Math.PI / 180);
                    const radius = 48;
                    const x1 = 50 + radius * Math.cos(startRad);
                    const y1 = 50 + radius * Math.sin(startRad);
                    const x2 = 50 + radius * Math.cos(endRad);
                    const y2 = 50 + radius * Math.sin(endRad);
                    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

                    return (
                      <path
                        key={i}
                        d={`M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`}
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.8)"
                        strokeWidth="1"
                        strokeLinecap="round"
                      />
                    );
                  })}
                </svg>
              )}

              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 rounded-full overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
                  }}
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                />
              </motion.div>
            </div>
          )}

          {/* Inner content container */}
          <div
            className={cn(
              "relative w-full h-full rounded-full bg-background overflow-hidden",
              hasStories && innerPadding[size]
            )}
          >
            {/* Photo or initials */}
            <div className="relative w-full h-full rounded-full overflow-hidden">
              {photoUrl ? (
                <motion.img
                  src={photoUrl}
                  alt={`${firstName} ${lastName}`}
                  className="w-full h-full object-cover"
                  animate={{
                    scale: isHovered && hasStories ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                  <span className={cn(
                    "text-white font-semibold",
                    size === "sm" && "text-sm",
                    size === "md" && "text-lg",
                    size === "lg" && "text-xl",
                    size === "xl" && "text-2xl"
                  )}>
                    {initials}
                  </span>
                </div>
              )}

              {/* Hover overlay */}
              {hasStories && (
                <motion.div
                  className="absolute inset-0 bg-black/20 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    className="w-8 h-8 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center"
                    animate={{ scale: isHovered ? [1, 1.2, 1] : 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Plus size={16} className="text-white" />
                  </motion.div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Story count badge */}
          {hasStories && storyCount > 1 && (
            <motion.div
              className={cn(
                "absolute rounded-full bg-gradient-to-br from-rose-500 to-purple-600 border-2 border-background flex items-center justify-center shadow-lg",
                size === "sm" && "-bottom-0.5 -right-0.5 min-w-[16px] h-[16px] px-1",
                size === "md" && "-bottom-0.5 -right-0.5 min-w-[18px] h-[18px] px-1",
                size === "lg" && "-bottom-1 -right-1 min-w-[22px] h-[22px] px-1.5",
                size === "xl" && "-bottom-1 -right-1 min-w-[26px] h-[26px] px-2"
              )}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", damping: 12, delay: 0.2 }}
            >
              <span className={cn(
                "text-white font-bold",
                size === "sm" && "text-[9px]",
                size === "md" && "text-[10px]",
                size === "lg" && "text-xs",
                size === "xl" && "text-sm"
              )}>
                {storyCount > 9 ? "9+" : storyCount}
              </span>
            </motion.div>
          )}

          {/* Live indicator for single story */}
          {hasStories && storyCount === 1 && (
            <motion.div
              className={cn(
                "absolute rounded-full bg-gradient-to-br from-green-400 to-emerald-500 border-2 border-background",
                size === "sm" && "-bottom-0.5 -right-0.5 w-3 h-3",
                size === "md" && "-bottom-0.5 -right-0.5 w-4 h-4",
                size === "lg" && "-bottom-1 -right-1 w-5 h-5",
                size === "xl" && "-bottom-1 -right-1 w-6 h-6"
              )}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.8, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}
        </motion.button>

        {/* Optional label */}
        {showLabel && (
          <motion.span
            className={cn(
              "text-xs font-medium truncate max-w-full",
              hasStories ? "text-foreground" : "text-muted-foreground"
            )}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {firstName}
          </motion.span>
        )}
      </div>

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
