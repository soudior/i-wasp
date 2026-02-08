/**
 * CoffeeSpiritGallery - Premium gallery for Coffee Spirit
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import baristaImage from '@/assets/coffee-spirit/barista.jpg';
import coffeeCupImage from '@/assets/coffee-spirit/coffee-cup.jpg';

interface GalleryImage {
  src: string;
  alt: string;
  caption: string;
}

const galleryImages: GalleryImage[] = [
  { src: baristaImage, alt: 'Notre Barista', caption: 'Le Barista' },
  { src: coffeeCupImage, alt: 'Coffee Spirit Cup', caption: 'Notre Café' },
];

export function CoffeeSpiritGallery() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handlePrev = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === 0 ? galleryImages.length - 1 : selectedIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === galleryImages.length - 1 ? 0 : selectedIndex + 1);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <h2
          className="text-lg font-semibold text-center mb-5 tracking-[-0.01em]"
          style={{ 
            color: '#FAF6F1',
            fontFamily: "'Playfair Display', serif",
          }}
        >
          Notre Univers
        </h2>
        
        <div className="grid grid-cols-2 gap-3">
          {galleryImages.map((image, index) => (
            <motion.button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className="relative aspect-square rounded-2xl overflow-hidden group"
              style={{
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div 
                className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"
              />
              <span 
                className="absolute bottom-3 left-3 text-[0.75rem] font-medium text-white/90"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {image.caption}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedIndex(null)}
          >
            <motion.button
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={24} />
            </motion.button>

            <button
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              className="absolute left-4 p-2 rounded-full bg-white/10 text-white"
            >
              <ChevronLeft size={24} />
            </button>

            <motion.img
              key={selectedIndex}
              src={galleryImages[selectedIndex].src}
              alt={galleryImages[selectedIndex].alt}
              className="max-w-[90vw] max-h-[80vh] object-contain rounded-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            />

            <button
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className="absolute right-4 p-2 rounded-full bg-white/10 text-white"
            >
              <ChevronRight size={24} />
            </button>

            <div className="absolute bottom-6 text-center text-white">
              <p className="text-lg font-medium">{galleryImages[selectedIndex].caption}</p>
              <p className="text-sm text-white/60 mt-1">
                {selectedIndex + 1} / {galleryImages.length}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default CoffeeSpiritGallery;
