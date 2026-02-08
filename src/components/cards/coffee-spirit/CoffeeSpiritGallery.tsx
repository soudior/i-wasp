/**
 * CoffeeSpiritGallery - Premium swipeable carousel gallery
 * Dark luxury design with glassmorphism
 */

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, Camera } from 'lucide-react';

// Gallery images
import icedLatteImage from '@/assets/coffee-spirit/iced-latte.jpg';
import strawberryShakeImage from '@/assets/coffee-spirit/strawberry-shake.jpg';
import pinkFrappeImage from '@/assets/coffee-spirit/pink-frappe.jpg';
import layeredLatteImage from '@/assets/coffee-spirit/layered-latte.jpg';
import icedCoffeeImage from '@/assets/coffee-spirit/iced-coffee.jpg';
import mojitoImage from '@/assets/coffee-spirit/mojito.jpg';
import latteArt1Image from '@/assets/coffee-spirit/latte-art-1.jpg';
import latteArt2Image from '@/assets/coffee-spirit/latte-art-2.jpg';
import americanoImage from '@/assets/coffee-spirit/americano.jpg';
import pinkLattePourImage from '@/assets/coffee-spirit/pink-latte-pour.jpg';

interface GalleryImage {
  src: string;
  alt: string;
  caption: string;
}

const galleryImages: GalleryImage[] = [
  { src: latteArt1Image, alt: 'Latte Art', caption: 'Latte Art' },
  { src: pinkLattePourImage, alt: 'Pink Latte', caption: 'Pink Latte' },
  { src: icedLatteImage, alt: 'Iced Latte', caption: 'Iced Latte' },
  { src: strawberryShakeImage, alt: 'Strawberry Shake', caption: 'Strawberry Shake' },
  { src: mojitoImage, alt: 'Mojito Frais', caption: 'Mojito Frais' },
  { src: icedCoffeeImage, alt: 'Iced Coffee', caption: 'Iced Coffee' },
  { src: pinkFrappeImage, alt: 'Pink Frappé', caption: 'Pink Frappé' },
  { src: layeredLatteImage, alt: 'Layered Latte', caption: 'Layered Latte' },
  { src: latteArt2Image, alt: 'Cappuccino Art', caption: 'Cappuccino Art' },
  { src: americanoImage, alt: 'Americano', caption: 'Americano' },
];

export function CoffeeSpiritGallery() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
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
        <Camera size={17} strokeWidth={2} style={{ color: '#C9A66B' }} />
        <h2
          className="text-lg font-semibold tracking-[-0.01em]"
          style={{ 
            color: '#FAF6F1',
            fontFamily: "'Playfair Display', serif",
          }}
        >
          Notre Univers
        </h2>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Embla Viewport */}
        <div
          ref={emblaRef}
          className="overflow-hidden rounded-[1.75rem] embla-container"
          style={{
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4), 0 8px 20px rgba(0, 0, 0, 0.3)',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          <div className="flex-safe">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className="embla-slide"
                style={{ flex: '0 0 100%', minWidth: 0 }}
              >
                <div className="relative overflow-hidden bg-[#1A1412]" style={{ aspectRatio: '4/3' }}>
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover vcard-image"
                    style={{
                      WebkitTransform: selectedIndex === index ? 'scale(1) translateZ(0)' : 'scale(1.05) translateZ(0)',
                      transform: selectedIndex === index ? 'scale(1) translateZ(0)' : 'scale(1.05) translateZ(0)',
                      transition: 'transform 0.7s ease',
                    }}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                  />
                  
                  {/* Gradient Overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(to top, rgba(10, 8, 6, 0.9) 0%, rgba(10, 8, 6, 0.3) 35%, transparent 60%)',
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
                            textShadow: '0 2px 10px rgba(0,0,0,0.5)',
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
          className="vcard-button absolute left-3 top-1/2 w-10 h-10 rounded-full flex-safe items-center-safe justify-center-safe active:scale-90 backdrop-blur-safe"
          style={{
            WebkitTransform: 'translateY(-50%)',
            transform: 'translateY(-50%)',
            background: 'rgba(26, 20, 18, 0.85)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(201, 166, 107, 0.2)',
            WebkitBackdropFilter: 'blur(12px)',
            backdropFilter: 'blur(12px)',
          }}
          aria-label="Image précédente"
        >
          <ChevronLeft size={20} strokeWidth={2} style={{ color: '#C9A66B' }} />
        </button>
        
        <button
          onClick={scrollNext}
          className="vcard-button absolute right-3 top-1/2 w-10 h-10 rounded-full flex-safe items-center-safe justify-center-safe active:scale-90 backdrop-blur-safe"
          style={{
            WebkitTransform: 'translateY(-50%)',
            transform: 'translateY(-50%)',
            background: 'rgba(26, 20, 18, 0.85)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(201, 166, 107, 0.2)',
            WebkitBackdropFilter: 'blur(12px)',
            backdropFilter: 'blur(12px)',
          }}
          aria-label="Image suivante"
        >
          <ChevronRight size={20} strokeWidth={2} style={{ color: '#C9A66B' }} />
        </button>
      </div>

      {/* Dots Indicator */}
      <div className="flex-safe justify-center-safe gap-2.5 mt-5">
        {galleryImages.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className="vcard-button rounded-full"
            style={{
              width: selectedIndex === index ? '24px' : '8px',
              height: '8px',
              minWidth: '8px',
              minHeight: '8px',
              background: selectedIndex === index 
                ? 'linear-gradient(90deg, #C9A66B 0%, #8B6914 100%)' 
                : 'rgba(250, 246, 241, 0.2)',
              transition: 'width 0.3s ease, background 0.3s ease',
            }}
            aria-label={`Aller à l'image ${index + 1}`}
          />
        ))}
      </div>
    </motion.div>
  );
}

export default CoffeeSpiritGallery;
