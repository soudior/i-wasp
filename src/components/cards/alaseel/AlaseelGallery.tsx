/**
 * AlaseelGallery - Premium swipeable photo gallery carousel
 * Optimized for mobile with touch gestures and smooth animations
 */

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, Camera } from 'lucide-react';

// Gallery images
import galleryInterior from '@/assets/alaseel/gallery-interior.jpg';
import galleryLatte from '@/assets/alaseel/gallery-latte.jpg';
import galleryTea from '@/assets/alaseel/gallery-tea.jpg';
import galleryTerrace from '@/assets/alaseel/gallery-terrace.jpg';

interface GalleryImage {
  src: string;
  alt: string;
  caption: string;
}

const galleryImages: GalleryImage[] = [
  { src: galleryInterior, alt: 'Intérieur du café', caption: 'Notre Espace' },
  { src: galleryLatte, alt: 'Latte art', caption: 'Latte Art' },
  { src: galleryTea, alt: 'Thé à la menthe', caption: 'Thé Marocain' },
  { src: galleryTerrace, alt: 'Terrasse', caption: 'Notre Terrasse' },
];

export function AlaseelGallery() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="w-full"
    >
      {/* Section Header */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <Camera size={18} style={{ color: '#5D4037' }} />
        <h2
          className="font-serif text-lg font-bold tracking-tight"
          style={{ color: '#5D4037' }}
        >
          Notre Galerie
        </h2>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Embla Viewport */}
        <div
          ref={emblaRef}
          className="overflow-hidden rounded-[1.5rem]"
          style={{
            boxShadow: '0 12px 40px rgba(93, 64, 55, 0.15)',
          }}
        >
          <div className="flex">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className="flex-[0_0_100%] min-w-0 relative"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                    loading={index === 0 ? 'eager' : 'lazy'}
                  />
                  
                  {/* Gradient Overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(to top, rgba(62, 39, 35, 0.7) 0%, transparent 50%)',
                    }}
                  />
                  
                  {/* Caption */}
                  <AnimatePresence>
                    {selectedIndex === index && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-4 left-4 right-4"
                      >
                        <p
                          className="text-lg font-serif font-bold"
                          style={{ color: '#F5E6D3' }}
                        >
                          {image.caption}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows - Only show on larger touch targets */}
        <button
          onClick={scrollPrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center active:scale-90 transition-transform"
          style={{
            backgroundColor: 'rgba(245, 230, 211, 0.9)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
          }}
          aria-label="Image précédente"
        >
          <ChevronLeft size={20} style={{ color: '#5D4037' }} />
        </button>
        
        <button
          onClick={scrollNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center active:scale-90 transition-transform"
          style={{
            backgroundColor: 'rgba(245, 230, 211, 0.9)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
          }}
          aria-label="Image suivante"
        >
          <ChevronRight size={20} style={{ color: '#5D4037' }} />
        </button>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-4">
        {galleryImages.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className="w-2 h-2 rounded-full transition-all duration-300"
            style={{
              backgroundColor: selectedIndex === index ? '#5D4037' : 'rgba(93, 64, 55, 0.2)',
              transform: selectedIndex === index ? 'scale(1.3)' : 'scale(1)',
            }}
            aria-label={`Aller à l'image ${index + 1}`}
          />
        ))}
      </div>
    </motion.div>
  );
}

export default AlaseelGallery;
