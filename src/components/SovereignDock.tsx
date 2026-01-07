import { motion } from 'framer-motion';
import { Home, User, Flag, ShoppingBag, Wand2, Radar } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface DockItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
}

const dockItems: DockItem[] = [
  { id: 'home', label: 'Dash', icon: Home, path: '/sovereign' },
  { id: 'identity', label: 'Carte', icon: User, path: '/dashboard' },
  { id: 'legacy', label: 'Legacy', icon: Flag, path: '/legacy-map' },
  { id: 'shop', label: 'Shop', icon: ShoppingBag, path: '/produits' },
];

export function SovereignDock() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="flex items-center gap-2 px-4 py-3 rounded-[2rem] bg-black/80 backdrop-blur-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
        {dockItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => navigate(item.path)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`flex flex-col items-center gap-1 px-5 py-2 rounded-2xl transition-all duration-300 ${
                isActive 
                  ? 'bg-[#A5A9B4] text-black' 
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-black' : ''}`} />
              <span className={`text-[10px] font-semibold uppercase tracking-wider ${isActive ? 'text-black' : ''}`}>
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
