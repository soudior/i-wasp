/**
 * Gallery Carousel for London Barber
 * Premium carousel showcasing haircut results
 */

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Camera } from "lucide-react";

// Import gallery images
import haircut1 from "@/assets/gallery/haircut-1.jpg";
import haircut2 from "@/assets/gallery/haircut-2.jpg";
import haircut3 from "@/assets/gallery/haircut-3.jpg";
import haircut4 from "@/assets/gallery/haircut-4.jpg";

const GALLERY_IMAGES = [
  { src: haircut1, title: "Modern Fade", description: "Dégradé moderne" },
  { src: haircut2, title: "Beard Styling", description: "Taille de barbe" },
  { src: haircut3, title: "Textured Top", description: "Coupe texturée" },
  { src: haircut4, title: "Classic Pompadour", description: "Pompadour classique" },
];

interface GalleryCarouselProps {
  brandColors: {
    primary: string;
    secondary: string;
    text: string;
    textLight: string;
  };
}

export function GalleryCarousel({ brandColors }: GalleryCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
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
      scale: 0.9,
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
    }, 4000);
    return () => clearInterval(timer);
  }, [paginate]);

  return (
    <div className="space-y-3">
      {/* Section Header */}
      <div className="flex items-center gap-2 px-1">
        <Camera size={14} style={{ color: brandColors.primary }} />
        <span className="text-sm font-medium" style={{ color: brandColors.text }}>
          Nos réalisations
        </span>
      </div>

      {/* Carousel Container */}
      <div className="relative overflow-hidden rounded-2xl bg-black/5">
        <div className="aspect-square relative">
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
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-white font-semibold text-lg">
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
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg transition-transform hover:scale-110 z-10"
          >
            <ChevronLeft size={18} className="text-gray-800" />
          </button>
          <button
            onClick={() => paginate(1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg transition-transform hover:scale-110 z-10"
          >
            <ChevronRight size={18} className="text-gray-800" />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="absolute bottom-16 left-0 right-0 flex justify-center gap-1.5 z-10">
          {GALLERY_IMAGES.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex 
                  ? "bg-white w-4" 
                  : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
