/**
 * AlaseelMenu - Ultra-Premium Luxury Menu Component
 * Refined glassmorphism with elegant typography and gold accents
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, IceCream, Leaf, Sparkles } from 'lucide-react';

interface MenuItem {
  name: string;
  price: string;
}

interface MenuCategory {
  id: string;
  label: string;
  icon: React.ReactNode;
  items: MenuItem[];
}

const menuData: MenuCategory[] = [
  {
    id: 'hot-coffee',
    label: 'Hot Coffee',
    icon: <Coffee size={15} strokeWidth={1.5} />,
    items: [
      { name: 'Normal', price: '13' },
      { name: 'Italian', price: '14' },
      { name: 'Royal', price: '15' },
      { name: 'Espresso', price: '13' },
      { name: 'Romano', price: '15' },
      { name: 'Ristretto', price: '14' },
      { name: 'Americano', price: '15' },
      { name: 'Large', price: '17' },
    ],
  },
  {
    id: 'milk-coffee',
    label: 'Café au Lait',
    icon: <Sparkles size={15} strokeWidth={1.5} />,
    items: [
      { name: 'Cappuccino', price: '18' },
      { name: 'Latte', price: '20' },
      { name: 'Flat White', price: '20' },
      { name: 'Macchiato', price: '15' },
      { name: 'Mocha', price: '22' },
      { name: 'Cortado', price: '18' },
      { name: 'Ness Ness', price: '15' },
      { name: 'Spanish Latte', price: '22' },
      { name: 'Cinnamon Latte', price: '25' },
    ],
  },
  {
    id: 'ice-coffee',
    label: 'Ice Coffee',
    icon: <IceCream size={15} strokeWidth={1.5} />,
    items: [
      { name: 'Ice Espresso', price: '20' },
      { name: 'Ice Americano', price: '20' },
      { name: 'Iced Latte', price: '20' },
    ],
  },
  {
    id: 'cocktails',
    label: 'Cocktails',
    icon: <Sparkles size={15} strokeWidth={1.5} />,
    items: [
      { name: 'Mojito', price: '25' },
      { name: 'Matcha', price: '30' },
      { name: "Jus d'Orange", price: '20' },
      { name: 'Ginger Lemon', price: '25' },
    ],
  },
  {
    id: 'tea',
    label: 'Thé',
    icon: <Leaf size={15} strokeWidth={1.5} />,
    items: [
      { name: 'Menthe', price: '15' },
      { name: 'Spiced Tea', price: '20' },
      { name: 'Lipton Ice Tea', price: '20' },
      { name: 'Verveine', price: '18' },
      { name: 'Cannelle', price: '25' },
    ],
  },
];

export function AlaseelMenu() {
  const [activeCategory, setActiveCategory] = useState('hot-coffee');
  const activeMenu = menuData.find((cat) => cat.id === activeCategory);

  return (
    <div className="w-full">
      {/* Premium Category Navigation */}
      <div className="overflow-x-auto pb-4 -mx-5 px-5 scrollbar-hide">
        <div className="flex gap-2 min-w-max">
          {menuData.map((category, index) => (
            <motion.button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className="relative flex items-center gap-2.5 px-5 py-3 rounded-2xl whitespace-nowrap transition-all duration-500"
              style={{
                background: activeCategory === category.id 
                  ? 'linear-gradient(135deg, #2C1810 0%, #1A0F0A 100%)' 
                  : 'rgba(44, 24, 16, 0.03)',
                color: activeCategory === category.id ? '#F5EDE4' : '#5D4037',
                fontWeight: activeCategory === category.id ? 500 : 400,
                boxShadow: activeCategory === category.id 
                  ? '0 8px 32px rgba(44, 24, 16, 0.25), inset 0 1px 0 rgba(255,255,255,0.06)' 
                  : 'none',
                border: activeCategory === category.id 
                  ? '1px solid rgba(212, 165, 116, 0.15)'
                  : '1px solid rgba(44, 24, 16, 0.06)',
              }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {/* Active indicator glow */}
              {activeCategory === category.id && (
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(212, 165, 116, 0.1) 0%, transparent 50%)',
                  }}
                  layoutId="activeTab"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span 
                className="relative z-10 transition-transform duration-300"
                style={{ 
                  color: activeCategory === category.id ? '#D4A574' : 'inherit',
                }}
              >
                {category.icon}
              </span>
              <span className="relative z-10 text-[0.8rem] tracking-wide">
                {category.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Premium Menu Card */}
      <motion.div
        className="mt-2 rounded-[2rem] overflow-hidden relative"
        style={{
          background: 'linear-gradient(180deg, #FFFDFB 0%, #FAF6F1 100%)',
          border: '1px solid rgba(44, 24, 16, 0.04)',
          boxShadow: '0 25px 60px rgba(44, 24, 16, 0.08), 0 10px 20px rgba(44, 24, 16, 0.04)',
        }}
        layout
      >
        {/* Decorative corner accent */}
        <div 
          className="absolute top-0 right-0 w-32 h-32 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at top right, rgba(212, 165, 116, 0.08) 0%, transparent 70%)',
          }}
        />
        
        {/* Luxury Header */}
        <div
          className="relative px-6 py-5 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #1A0F0A 0%, #2C1810 50%, #1A0F0A 100%)',
          }}
        >
          {/* Diamond pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0 L40 20 L20 40 L0 20 Z' stroke='%23D4A574' stroke-width='0.5' fill='none'/%3E%3C/svg%3E")`,
              backgroundSize: '40px 40px',
            }}
          />
          
          {/* Gold shimmer line */}
          <div 
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(212, 165, 116, 0.3) 50%, transparent 100%)',
            }}
          />
          
          {/* Title with decorative elements */}
          <div className="flex items-center justify-center gap-4 relative z-10">
            <div 
              className="w-8 h-px"
              style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(212, 165, 116, 0.5) 100%)' }}
            />
            <h3
              className="text-[0.85rem] font-medium tracking-[0.2em] uppercase"
              style={{ 
                color: '#FAF6F1',
                fontFamily: "'Playfair Display', serif",
                textShadow: '0 2px 10px rgba(0,0,0,0.3)',
              }}
            >
              {activeMenu?.label}
            </h3>
            <div 
              className="w-8 h-px"
              style={{ background: 'linear-gradient(90deg, rgba(212, 165, 116, 0.5) 0%, transparent 100%)' }}
            />
          </div>
          
          {/* Bottom gold shimmer */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-px"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(212, 165, 116, 0.2) 50%, transparent 100%)',
            }}
          />
        </div>

        {/* Menu Items with Luxury Styling */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="p-6 space-y-0"
          >
            {activeMenu?.items.map((item, index) => (
              <motion.div
                key={item.name}
                className="group flex items-center py-3.5 border-b last:border-b-0"
                style={{ borderColor: 'rgba(44, 24, 16, 0.04)' }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03, duration: 0.3 }}
              >
                {/* Item Name with hover effect */}
                <span
                  className="text-[0.9rem] font-normal tracking-wide transition-all duration-300 group-hover:tracking-wider"
                  style={{ 
                    color: '#2C1810',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  {item.name}
                </span>
                
                {/* Elegant connecting line */}
                <div className="flex-1 mx-4 relative h-px">
                  <div 
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(90deg, rgba(44, 24, 16, 0.08) 0%, rgba(212, 165, 116, 0.15) 50%, rgba(44, 24, 16, 0.08) 100%)',
                    }}
                  />
                  {/* Animated dot on hover */}
                  <div 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: '#D4A574' }}
                  />
                </div>
                
                {/* Premium Price Badge */}
                <div
                  className="relative px-4 py-2 rounded-xl transition-all duration-300 group-hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, rgba(44, 24, 16, 0.03) 0%, rgba(212, 165, 116, 0.08) 100%)',
                    border: '1px solid rgba(212, 165, 116, 0.15)',
                  }}
                >
                  {/* Inner glow */}
                  <div 
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: 'linear-gradient(135deg, rgba(212, 165, 116, 0.1) 0%, transparent 100%)',
                    }}
                  />
                  <span
                    className="relative z-10 text-[0.75rem] font-semibold tracking-wider"
                    style={{ color: '#4A3728' }}
                  >
                    {item.price}
                    <span 
                      className="ml-1 text-[0.65rem] font-medium"
                      style={{ color: '#8B7355' }}
                    >
                      DH
                    </span>
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
        
        {/* Footer accent */}
        <div 
          className="h-1 w-full"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(212, 165, 116, 0.15) 50%, transparent 100%)',
          }}
        />
      </motion.div>
    </div>
  );
}

export default AlaseelMenu;
