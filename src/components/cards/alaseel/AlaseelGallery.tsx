/**
  * AlaseelGallery - Modern chic swipeable photo gallery
  * Glassmorphism design with premium animations
 */

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, Camera } from 'lucide-react';

// Gallery images - Real photos from Alaseel Coffee
import galleryLogo from '@/assets/alaseel/gallery-logo.jpg';
import galleryCoffee from '@/assets/alaseel/gallery-coffee.jpg';
import galleryFacade from '@/assets/alaseel/gallery-facade.jpg';
import galleryAmbiance from '@/assets/alaseel/gallery-ambiance.jpg';

interface GalleryImage {
  src: string;
  alt: string;
  caption: string;
}

const galleryImages: GalleryImage[] = [
  { src: galleryFacade, alt: 'Entrée du café Alaseel', caption: 'Thé Shop' },
  { src: galleryCoffee, alt: 'Cappuccino Alaseel', caption: 'Nos Cafés' },
  { src: galleryAmbiance, alt: 'Ambiance du café', caption: "L'Ambiance" },
  { src: galleryLogo, alt: 'Logo Alaseel', caption: 'Notre Marque' },
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
      <div className="flex items-center justify-center gap-2.5 mb-5">
        <Camera size={17} strokeWidth={2} style={{ color: '#D4A574' }} />
        <h2
          className="text-lg font-semibold tracking-[-0.01em]"
          style={{ 
            color: '#3D2C22',
            fontFamily: "'Playfair Display', serif",
          }}
        >
          Notre Galerie
        </h2>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Embla Viewport */}
        <div
          ref={emblaRef}
          className="overflow-hidden rounded-[1.75rem]"
          style={{
            boxShadow: '0 20px 50px rgba(61, 44, 34, 0.12), 0 8px 20px rgba(61, 44, 34, 0.08)',
          }}
        >
          <div className="flex">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className="flex-[0_0_100%] min-w-0 relative"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[#EDE4D8]">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover transition-transform duration-700"
                    style={{
                      transform: selectedIndex === index ? 'scale(1)' : 'scale(1.05)',
                    }}
                    loading={index === 0 ? 'eager' : 'lazy'}
                  />
                  
                  {/* Gradient Overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(to top, rgba(46, 33, 26, 0.85) 0%, rgba(46, 33, 26, 0.2) 35%, transparent 60%)',
                    }}
                  />
                  
                  {/* Caption */}
                  <AnimatePresence>
                    {selectedIndex === index && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.3 }}
                        className="absolute bottom-5 left-5 right-5"
                      >
                        <p
                          className="text-[1.1rem] font-medium tracking-wide"
                          style={{ 
                            color: '#FAF6F1',
                            fontFamily: "'Playfair Display', serif",
                            textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                          }}
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

        {/* Navigation Arrows */}
        <button
          onClick={scrollPrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center active:scale-90 transition-all duration-200 backdrop-blur-md"
          style={{
            background: 'rgba(250, 246, 241, 0.85)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)',
            border: '1px solid rgba(255,255,255,0.3)',
          }}
          aria-label="Image précédente"
        >
          <ChevronLeft size={20} strokeWidth={2} style={{ color: '#3D2C22' }} />
        </button>
        
        <button
          onClick={scrollNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center active:scale-90 transition-all duration-200 backdrop-blur-md"
          style={{
            background: 'rgba(250, 246, 241, 0.85)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)',
            border: '1px solid rgba(255,255,255,0.3)',
          }}
          aria-label="Image suivante"
        >
          <ChevronRight size={20} strokeWidth={2} style={{ color: '#3D2C22' }} />
        </button>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2.5 mt-5">
        {galleryImages.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className="rounded-full transition-all duration-300"
            style={{
              width: selectedIndex === index ? '24px' : '8px',
              height: '8px',
              background: selectedIndex === index 
                ? 'linear-gradient(90deg, #D4A574 0%, #4A3728 100%)' 
                : 'rgba(61, 44, 34, 0.15)',
            }}
            aria-label={`Aller à l'image ${index + 1}`}
          />
        ))}
      </div>
    </motion.div>
  );
}

export default AlaseelGallery;
