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
      <div className="overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        <div className="flex gap-2 min-w-max">
          {menuData.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap transition-all duration-300"
              style={{
                backgroundColor: activeCategory === category.id ? '#3D2B1F' : 'rgba(61, 43, 31, 0.08)',
                color: activeCategory === category.id ? '#FDF5E6' : '#3D2B1F',
                fontWeight: activeCategory === category.id ? 600 : 500,
              }}
              whileTap={{ scale: 0.95 }}
            >
              {category.icon}
              <span className="text-sm">{category.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Menu Card */}
      <motion.div
        className="mt-4 rounded-3xl overflow-hidden"
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid rgba(217, 119, 6, 0.2)',
          boxShadow: '0 10px 40px rgba(61, 43, 31, 0.1)',
        }}
      >
        {/* Header */}
        <div
          className="px-5 py-4 text-center"
          style={{
            background: 'linear-gradient(135deg, #3D2B1F 0%, #2A1F16 100%)',
          }}
        >
          <h3
            className="font-serif text-lg font-semibold"
            style={{ color: '#D97706' }}
          >
            {activeMenu?.label}
          </h3>
        </div>

        {/* Menu Items */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="p-5 space-y-3"
          >
            {activeMenu?.items.map((item, index) => (
              <motion.div
                key={item.name}
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                {/* Item Name */}
                <span
                  className="font-medium"
                  style={{ color: '#3D2B1F' }}
                >
                  {item.name}
                </span>
                
                {/* Dotted Line */}
                <div
                  className="flex-1 border-b-2 border-dotted mx-2"
                  style={{ borderColor: 'rgba(61, 43, 31, 0.2)' }}
                />
                
                {/* Price Badge */}
                <span
                  className="px-3 py-1 rounded-full text-sm font-semibold"
                  style={{
                    backgroundColor: 'rgba(217, 119, 6, 0.15)',
                    color: '#D97706',
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
