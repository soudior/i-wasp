/**
 * AlaseelMenu - Interactive tabbed menu component
 * Premium coffee shop menu with categories
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
        <div className="flex gap-2 min-w-max">
          {menuData.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-full whitespace-nowrap transition-all duration-300 active:scale-95"
              style={{
                backgroundColor: activeCategory === category.id ? '#5D4037' : 'rgba(93, 64, 55, 0.08)',
                color: activeCategory === category.id ? '#F5E6D3' : '#5D4037',
                fontWeight: activeCategory === category.id ? 600 : 500,
                boxShadow: activeCategory === category.id ? '0 4px 15px rgba(93, 64, 55, 0.25)' : 'none',
              }}
              whileTap={{ scale: 0.95 }}
            >
              {category.icon}
              <span className="text-[0.8rem]">{category.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Menu Card */}
      <motion.div
        className="mt-3 rounded-[1.5rem] overflow-hidden"
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid rgba(93, 64, 55, 0.15)',
          boxShadow: '0 12px 40px rgba(93, 64, 55, 0.08)',
        }}
        layout
      >
        {/* Header */}
        <div
          className="px-5 py-3.5 text-center"
          style={{
            background: 'linear-gradient(135deg, #5D4037 0%, #4E342E 100%)',
          }}
        >
          <h3
            className="font-serif text-base font-semibold tracking-wide"
            style={{ color: '#F5E6D3' }}
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
            className="p-4 space-y-2.5"
          >
            {activeMenu?.items.map((item, index) => (
              <motion.div
                key={item.name}
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.025 }}
              >
                {/* Item Name */}
                <span
                  className="text-[0.9rem] font-medium"
                  style={{ color: '#5D4037' }}
                >
                  {item.name}
                </span>
                
                {/* Dotted Line */}
                <div
                  className="flex-1 border-b-[1.5px] border-dotted mx-1.5"
                  style={{ borderColor: 'rgba(93, 64, 55, 0.15)' }}
                />
                
                {/* Price Badge */}
                <span
                  className="px-2.5 py-1 rounded-full text-[0.75rem] font-bold tracking-tight"
                  style={{
                    backgroundColor: 'rgba(93, 64, 55, 0.12)',
                    color: '#5D4037',
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
