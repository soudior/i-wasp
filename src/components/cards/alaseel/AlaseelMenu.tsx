/**
  * AlaseelMenu - Modern chic tabbed menu component
  * Ultra-premium coffee shop menu with glassmorphism
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
    icon: <Coffee size={16} />,
    items: [
      { name: 'Normal', price: '13 dh' },
      { name: 'Italian', price: '14 dh' },
      { name: 'Royal', price: '15 dh' },
      { name: 'Espresso', price: '13 dh' },
      { name: 'Romano', price: '15 dh' },
      { name: 'Ristretto', price: '14 dh' },
      { name: 'Americano', price: '15 dh' },
      { name: 'Large', price: '17 dh' },
    ],
  },
  {
    id: 'milk-coffee',
    label: 'Café au Lait',
    icon: <Sparkles size={16} />,
    items: [
      { name: 'Cappuccino', price: '18 dh' },
      { name: 'Latte', price: '20 dh' },
      { name: 'Flat White', price: '20 dh' },
      { name: 'Macchiato', price: '15 dh' },
      { name: 'Mocha', price: '22 dh' },
      { name: 'Cortado', price: '18 dh' },
      { name: 'Ness Ness', price: '15 dh' },
      { name: 'Spanish Latte', price: '22 dh' },
      { name: 'Cinnamon Latte', price: '25 dh' },
    ],
  },
  {
    id: 'ice-coffee',
    label: 'Ice Coffee',
    icon: <IceCream size={16} />,
    items: [
      { name: 'Ice Espresso', price: '20 dh' },
      { name: 'Ice Americano', price: '20 dh' },
      { name: 'Iced Latte', price: '20 dh' },
    ],
  },
  {
    id: 'cocktails',
    label: 'Cocktails',
    icon: <Sparkles size={16} />,
    items: [
      { name: 'Mojito', price: '25 dh' },
      { name: 'Matcha', price: '30 dh' },
      { name: "Jus d'Orange", price: '20 dh' },
      { name: 'Ginger Lemon', price: '25 dh' },
    ],
  },
  {
    id: 'tea',
    label: 'Thé',
    icon: <Leaf size={16} />,
    items: [
      { name: 'Menthe', price: '15 dh' },
      { name: 'Spiced Tea', price: '20 dh' },
      { name: 'Lipton Ice Tea', price: '20 dh' },
      { name: 'Verveine', price: '18 dh' },
      { name: 'Cannelle', price: '25 dh' },
    ],
  },
];

export function AlaseelMenu() {
  const [activeCategory, setActiveCategory] = useState('hot-coffee');
  const activeMenu = menuData.find((cat) => cat.id === activeCategory);

  return (
    <div className="w-full">
      {/* Category Tabs - Horizontal Scrollable */}
      <div className="overflow-x-auto pb-3 -mx-5 px-5 scrollbar-hide">
        <div className="flex gap-2.5 min-w-max">
          {menuData.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap transition-all duration-300 active:scale-95"
              style={{
                background: activeCategory === category.id 
                  ? 'linear-gradient(145deg, #4A3728 0%, #3D2C22 100%)' 
                  : 'rgba(61, 44, 34, 0.04)',
                color: activeCategory === category.id ? '#FAF6F1' : '#5D4037',
                fontWeight: activeCategory === category.id ? 500 : 400,
                boxShadow: activeCategory === category.id 
                  ? '0 6px 20px rgba(61, 44, 34, 0.2), inset 0 1px 0 rgba(255,255,255,0.08)' 
                  : 'inset 0 0 0 1px rgba(61, 44, 34, 0.08)',
                letterSpacing: '0.02em',
              }}
              whileTap={{ scale: 0.95 }}
            >
              {category.icon}
              <span className="text-[0.78rem]">{category.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Menu Card */}
      <motion.div
        className="mt-4 rounded-[1.75rem] overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #ffffff 0%, #FDFBF9 100%)',
          border: '1px solid rgba(61, 44, 34, 0.06)',
          boxShadow: '0 20px 50px rgba(61, 44, 34, 0.06), 0 8px 16px rgba(61, 44, 34, 0.04)',
        }}
        layout
      >
        {/* Header */}
        <div
          className="px-6 py-4 text-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, #4A3728 0%, #3D2C22 100%)',
          }}
        >
          {/* Subtle shimmer */}
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%)',
            }}
          />
          <h3
            className="text-[0.95rem] font-medium tracking-[0.08em] uppercase relative z-10"
            style={{ color: '#FAF6F1' }}
          >
            {activeMenu?.label}
          </h3>
        </div>

        {/* Menu Items */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="p-5 space-y-3"
          >
            {activeMenu?.items.map((item, index) => (
              <motion.div
                key={item.name}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.025 }}
              >
                {/* Item Name */}
                <span
                  className="text-[0.88rem] font-normal"
                  style={{ color: '#3D2C22' }}
                >
                  {item.name}
                </span>
                
                {/* Dotted Line */}
                <div
                  className="flex-1 border-b border-dashed mx-2"
                  style={{ borderColor: 'rgba(61, 44, 34, 0.1)' }}
                />
                
                {/* Price Badge */}
                <span
                  className="px-3 py-1.5 rounded-xl text-[0.72rem] font-semibold tracking-wide"
                  style={{
                    background: 'linear-gradient(145deg, rgba(212, 165, 116, 0.15) 0%, rgba(212, 165, 116, 0.08) 100%)',
                    color: '#4A3728',
                    border: '1px solid rgba(212, 165, 116, 0.2)',
                  }}
                >
                  {item.price}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default AlaseelMenu;
