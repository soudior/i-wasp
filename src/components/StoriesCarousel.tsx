/**
 * StoriesCarousel - Carousel horizontal de stories multi-utilisateurs (style Instagram)
 * Affiche les stories de plusieurs utilisateurs dans une bande horizontale scrollable
 */

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { StoryRing } from "./StoryRing";
import { MultiStoryViewer } from "./MultiStoryViewer";
import { supabase } from "@/integrations/supabase/client";
import { useReducedMotion } from "@/hooks/useReducedMotion";

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

interface UserWithStories {
  id: string;
  firstName: string;
  lastName: string;
  photoUrl?: string;
  whatsappNumber?: string;
  email?: string;
  stories: Story[];
  isOwn?: boolean; // For "Your Story" at the beginning
}

interface StoriesCarouselProps {
  users?: UserWithStories[];
  showAddStory?: boolean;
  onAddStory?: () => void;
  currentUserId?: string;
  currentUserPhoto?: string;
  currentUserName?: string;
  className?: string;
  variant?: "default" | "compact" | "premium";
  cardIds?: string[]; // Fetch stories for these card IDs
}

// Fetch stories for multiple cards
async function fetchStoriesForCards(cardIds: string[]): Promise<Map<string, Story[]>> {
  const storiesMap = new Map<string, Story[]>();
  
  if (!cardIds.length) return storiesMap;
  
  try {
    const { data, error } = await supabase
      .from("card_stories")
      .select("*")
      .in("card_id", cardIds)
      .eq("is_active", true)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    
    // Group by card_id
    data?.forEach((story) => {
      const existing = storiesMap.get(story.card_id) || [];
      existing.push(story as Story);
      storiesMap.set(story.card_id, existing);
    });
  } catch (err) {
    console.error("Error fetching stories:", err);
  }
  
  return storiesMap;
}

export function StoriesCarousel({
  users: propUsers,
  showAddStory = false,
  onAddStory,
  currentUserId,
  currentUserPhoto,
  currentUserName = "Vous",
  className,
  variant = "default",
  cardIds,
}: StoriesCarouselProps) {
  const [users, setUsers] = useState<UserWithStories[]>(propUsers || []);
  const [selectedUser, setSelectedUser] = useState<UserWithStories | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Animation optimization for low-power devices
  const { shouldReduceMotion, durationMultiplier } = useReducedMotion();
  
  // Optimized transitions based on device capability
  const optimizedTransition = useMemo(() => ({
    duration: shouldReduceMotion ? 0.1 : 0.2,
    ease: "easeOut" as const,
  }), [shouldReduceMotion]);
  
  // Stagger delay for list animations
  const staggerDelay = shouldReduceMotion ? 0 : 0.05;

  // Fetch stories if cardIds provided
  useEffect(() => {
    if (cardIds && cardIds.length > 0) {
      // This would require fetching card details too
      // For now, use propUsers
    }
  }, [cardIds]);

  // Use propUsers when provided
  useEffect(() => {
    if (propUsers) {
      setUsers(propUsers);
    }
  }, [propUsers]);

  // Check scroll position
  const updateScrollButtons = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;
    
    updateScrollButtons();
    scrollEl.addEventListener("scroll", updateScrollButtons);
    window.addEventListener("resize", updateScrollButtons);
    
    return () => {
      scrollEl.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [users]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = direction === "left" ? -200 : 200;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const handleUserClick = (user: UserWithStories) => {
    if (user.isOwn && !user.stories.length) {
      onAddStory?.();
    } else if (user.stories.length > 0) {
      setSelectedUser(user);
    }
  };

  const handleStoryView = async (storyId: string) => {
    try {
      await supabase.rpc("increment_story_view", { p_story_id: storyId });
    } catch (error) {
      console.error("Error incrementing story view:", error);
    }
  };

  // Filter users with stories (or own story slot)
  const usersWithContent = users.filter(u => u.stories.length > 0 || u.isOwn);

  // Size variants
  const sizeConfig = {
    default: { ring: "md" as const, gap: "gap-4", padding: "px-4 py-3" },
    compact: { ring: "sm" as const, gap: "gap-3", padding: "px-3 py-2" },
    premium: { ring: "lg" as const, gap: "gap-5", padding: "px-5 py-4" },
  };

  const config = sizeConfig[variant];

  if (usersWithContent.length === 0 && !showAddStory) {
    return null;
  }

  return (
    <>
      <div className={cn("relative", className)}>
        {/* Background gradient for premium variant */}
        {variant === "premium" && (
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background pointer-events-none" />
        )}

        {/* Scroll container */}
        <div className="relative">
          {/* Left scroll button */}
          <AnimatePresence mode={shouldReduceMotion ? "wait" : "sync"}>
            {canScrollLeft && (
              <motion.button
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
                animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
                transition={optimizedTransition}
                onClick={() => scroll("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-background/90 backdrop-blur-sm border border-border/50 shadow-lg flex items-center justify-center text-foreground hover:bg-accent transition-colors hidden md:flex"
              >
                <ChevronLeft size={18} />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Right scroll button */}
          <AnimatePresence mode={shouldReduceMotion ? "wait" : "sync"}>
            {canScrollRight && usersWithContent.length > 4 && (
              <motion.button
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
                animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
                transition={optimizedTransition}
                onClick={() => scroll("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-background/90 backdrop-blur-sm border border-border/50 shadow-lg flex items-center justify-center text-foreground hover:bg-accent transition-colors hidden md:flex"
              >
                <ChevronRight size={18} />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Stories row */}
          <div
            ref={scrollRef}
            className={cn(
              "flex overflow-x-auto scrollbar-hide scroll-smooth",
              config.gap,
              config.padding
            )}
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {/* Add Story button (Your Story) */}
            {showAddStory && (
              <motion.div
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
                animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                transition={optimizedTransition}
                className="flex flex-col items-center flex-shrink-0"
              >
                <button
                  onClick={onAddStory}
                  className={cn(
                    "relative rounded-full focus:outline-none group",
                    config.ring === "sm" && "w-14 h-14",
                    config.ring === "md" && "w-20 h-20",
                    config.ring === "lg" && "w-28 h-28"
                  )}
                >
                  {/* Photo with add button */}
                  <div className="relative w-full h-full">
                    {currentUserPhoto ? (
                      <img
                        src={currentUserPhoto}
                        alt={currentUserName}
                        className="w-full h-full rounded-full object-cover border-2 border-border/30"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center border-2 border-border/30">
                        <span className="text-muted-foreground font-semibold">
                          {currentUserName[0]?.toUpperCase()}
                        </span>
                      </div>
                    )}
                    
                    {/* Plus button - disable hover/tap animations in reduced motion mode */}
                    <motion.div
                      className={cn(
                        "absolute rounded-full bg-primary border-2 border-background flex items-center justify-center shadow-lg",
                        config.ring === "sm" && "-bottom-0.5 -right-0.5 w-5 h-5",
                        config.ring === "md" && "-bottom-0.5 -right-0.5 w-6 h-6",
                        config.ring === "lg" && "-bottom-1 -right-1 w-7 h-7"
                      )}
                      whileHover={shouldReduceMotion ? undefined : { scale: 1.1 }}
                      whileTap={shouldReduceMotion ? undefined : { scale: 0.9 }}
                    >
                      <Plus size={config.ring === "sm" ? 12 : config.ring === "md" ? 14 : 16} className="text-primary-foreground" />
                    </motion.div>
                  </div>
                </button>
                
                <span className={cn(
                  "mt-1.5 text-center truncate max-w-[70px]",
                  config.ring === "sm" && "text-[10px]",
                  config.ring === "md" && "text-xs",
                  config.ring === "lg" && "text-sm",
                  "text-muted-foreground"
                )}>
                  Votre story
                </span>
              </motion.div>
            )}

            {/* User stories */}
            {usersWithContent.map((user, index) => (
              <motion.div
                key={user.id}
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8, x: 20 }}
                animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, x: 0 }}
                transition={optimizedTransition}
                className="flex flex-col items-center flex-shrink-0"
              >
                <button
                  onClick={() => handleUserClick(user)}
                  className="focus:outline-none"
                >
                  <StoryRing
                    photoUrl={user.photoUrl}
                    firstName={user.firstName}
                    lastName={user.lastName}
                    stories={user.stories}
                    whatsappNumber={user.whatsappNumber}
                    email={user.email}
                    size={config.ring}
                    showLabel={false}
                  />
                </button>
                
                <span className={cn(
                  "mt-1.5 text-center truncate max-w-[70px]",
                  config.ring === "sm" && "text-[10px]",
                  config.ring === "md" && "text-xs",
                  config.ring === "lg" && "text-sm",
                  user.stories.length > 0 ? "text-foreground" : "text-muted-foreground"
                )}>
                  {user.firstName}
                </span>
              </motion.div>
            ))}

            {/* Empty state placeholder slots */}
            {usersWithContent.length < 3 && !showAddStory && (
              <>
                {Array.from({ length: 3 - usersWithContent.length }).map((_, i) => (
                  <div
                    key={`placeholder-${i}`}
                    className={cn(
                      "flex-shrink-0 rounded-full border-2 border-dashed border-border/30",
                      config.ring === "sm" && "w-14 h-14",
                      config.ring === "md" && "w-20 h-20",
                      config.ring === "lg" && "w-28 h-28"
                    )}
                  />
                ))}
              </>
            )}
          </div>

          {/* Fade edges for scroll indication */}
          {canScrollLeft && (
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none hidden md:block" />
          )}
          {canScrollRight && usersWithContent.length > 4 && (
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none hidden md:block" />
          )}
        </div>

        {/* Border bottom for separation */}
        {variant !== "compact" && (
          <div className="border-b border-border/30 mt-2" />
        )}
      </div>

      {/* Story Viewer Modal */}
      {selectedUser && (
        <MultiStoryViewer
          stories={selectedUser.stories}
          ownerName={`${selectedUser.firstName} ${selectedUser.lastName}`}
          ownerPhoto={selectedUser.photoUrl}
          whatsappNumber={selectedUser.whatsappNumber}
          email={selectedUser.email}
          onClose={() => setSelectedUser(null)}
          onView={handleStoryView}
        />
      )}
    </>
  );
}

// Demo component with sample data
export function StoriesCarouselDemo() {
  const sampleUsers: UserWithStories[] = [
    {
      id: "1",
      firstName: "Marie",
      lastName: "Dupont",
      photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      whatsappNumber: "+33612345678",
      stories: [
        {
          id: "s1",
          content_type: "image",
          image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
          created_at: new Date(Date.now() - 3600000).toISOString(),
          expires_at: new Date(Date.now() + 82800000).toISOString(),
          view_count: 42,
        },
        {
          id: "s2",
          content_type: "text",
          text_content: "Nouvelle collection disponible ! 🎉",
          text_background_color: "#E11D48",
          created_at: new Date(Date.now() - 7200000).toISOString(),
          expires_at: new Date(Date.now() + 79200000).toISOString(),
          view_count: 28,
        },
      ],
    },
    {
      id: "2",
      firstName: "Pierre",
      lastName: "Martin",
      photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      stories: [
        {
          id: "s3",
          content_type: "image",
          image_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800",
          created_at: new Date(Date.now() - 1800000).toISOString(),
          expires_at: new Date(Date.now() + 84600000).toISOString(),
          view_count: 15,
        },
      ],
    },
    {
      id: "3",
      firstName: "Sophie",
      lastName: "Bernard",
      photoUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
      whatsappNumber: "+33698765432",
      stories: [
        {
          id: "s4",
          content_type: "text",
          text_content: "-30% sur tout le magasin aujourd'hui !",
          text_background_color: "#7C3AED",
          created_at: new Date(Date.now() - 5400000).toISOString(),
          expires_at: new Date(Date.now() + 81000000).toISOString(),
          view_count: 89,
        },
      ],
    },
    {
      id: "4",
      firstName: "Lucas",
      lastName: "Petit",
      photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
      stories: [
        {
          id: "s5",
          content_type: "image",
          image_url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800",
          created_at: new Date(Date.now() - 900000).toISOString(),
          expires_at: new Date(Date.now() + 85500000).toISOString(),
          view_count: 7,
        },
      ],
    },
    {
      id: "5",
      firstName: "Emma",
      lastName: "Dubois",
      photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      stories: [
        {
          id: "s6",
          content_type: "image",
          image_url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800",
          created_at: new Date(Date.now() - 2700000).toISOString(),
          expires_at: new Date(Date.now() + 83700000).toISOString(),
          view_count: 34,
        },
        {
          id: "s7",
          content_type: "text",
          text_content: "Événement spécial ce weekend !",
          text_background_color: "#059669",
          created_at: new Date(Date.now() - 4500000).toISOString(),
          expires_at: new Date(Date.now() + 81900000).toISOString(),
          view_count: 56,
        },
      ],
    },
  ];

  return (
    <div className="space-y-8 p-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Default</h3>
        <StoriesCarousel
          users={sampleUsers}
          showAddStory
          currentUserPhoto="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
          currentUserName="Vous"
          onAddStory={() => console.log("Add story clicked")}
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Compact</h3>
        <StoriesCarousel
          users={sampleUsers}
          variant="compact"
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Premium</h3>
        <StoriesCarousel
          users={sampleUsers}
          showAddStory
          variant="premium"
          currentUserPhoto="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
          onAddStory={() => console.log("Add story clicked")}
        />
      </div>
    </div>
  );
}
