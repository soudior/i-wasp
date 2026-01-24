/**
 * KÔYA Restaurant Gallery Carousel
 * Premium swipeable gallery with touch gestures
 */

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Camera } from "lucide-react";

// Import gallery images
import gallery1 from "@/assets/koya/gallery-1.jpg";
import gallery2 from "@/assets/koya/gallery-2.jpg";
import gallery3 from "@/assets/koya/gallery-3.jpg";
import gallery4 from "@/assets/koya/gallery-4.jpg";

const GALLERY_IMAGES = [
  { src: gallery1, title: "Salle Principale", description: "Ambiance chaleureuse et raffinée" },
  { src: gallery2, title: "Rooftop Bar", description: "Vue panoramique sur Marrakech" },
  { src: gallery3, title: "Cuisine Fusion", description: "Sushis & créations signatures" },
  { src: gallery4, title: "Espace VIP", description: "Intimité et élégance" },
];

// KÔYA Brand Colors
const KOYA_COLORS = {
  gold: "#d4a574",
  goldDark: "#b8860b",
  textMuted: "rgba(255,255,255,0.5)",
};

interface KoyaGalleryProps {
  autoPlayInterval?: number;
}

export function KoyaGallery({ autoPlayInterval = 4000 }: KoyaGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = useCallback((newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) nextIndex = GALLERY_IMAGES.length - 1;
      if (nextIndex >= GALLERY_IMAGES.length) nextIndex = 0;
      return nextIndex;
    });
  }, []);

  // Auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1);
    }, autoPlayInterval);
    return () => clearInterval(timer);
  }, [paginate, autoPlayInterval]);

  return (
    <div className="space-y-3">
      {/* Section Header */}
      <div className="flex items-center gap-2 px-1">
        <Camera size={14} style={{ color: KOYA_COLORS.gold }} />
        <span className="text-sm font-medium text-white">
          Notre Univers
        </span>
      </div>

      {/* Carousel Container */}
      <div 
        className="relative overflow-hidden rounded-2xl"
        style={{
          background: "rgba(0,0,0,0.3)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="aspect-[16/10] relative">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);
                if (swipe < -swipeConfidenceThreshold) {
                  paginate(1);
                } else if (swipe > swipeConfidenceThreshold) {
                  paginate(-1);
                }
              }}
              className="absolute inset-0"
            >
              <img
                src={GALLERY_IMAGES[currentIndex].src}
                alt={GALLERY_IMAGES[currentIndex].title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              
              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 
                    className="font-semibold text-lg"
                    style={{ color: KOYA_COLORS.gold }}
                  >
                    {GALLERY_IMAGES[currentIndex].title}
                  </h3>
                  <p className="text-white/80 text-sm">
                    {GALLERY_IMAGES[currentIndex].description}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <button
            onClick={() => paginate(-1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-transform active:scale-95 z-10"
            style={{
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(8px)",
              border: `1px solid ${KOYA_COLORS.gold}30`,
            }}
            aria-label="Previous"
          >
            <ChevronLeft size={20} style={{ color: KOYA_COLORS.gold }} />
          </button>
          <button
            onClick={() => paginate(1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-transform active:scale-95 z-10"
            style={{
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(8px)",
              border: `1px solid ${KOYA_COLORS.gold}30`,
            }}
            aria-label="Next"
          >
            <ChevronRight size={20} style={{ color: KOYA_COLORS.gold }} />
          </button>
        </div>

        {/* Dot Indicators */}
        <div className="flex items-center justify-center gap-2 py-3">
          {GALLERY_IMAGES.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className="w-2 h-2 rounded-full transition-all"
              style={{
                backgroundColor: index === currentIndex ? KOYA_COLORS.gold : "rgba(255,255,255,0.3)",
                transform: index === currentIndex ? "scale(1.3)" : "scale(1)",
              }}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
