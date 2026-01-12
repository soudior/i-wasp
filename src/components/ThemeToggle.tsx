import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ThemeMode = 'light' | 'dark' | 'system';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="theme-toggle w-10 h-10 flex items-center justify-center">
        <div className="w-5 h-5" />
      </div>
    );
  }

  const currentTheme = theme as ThemeMode;
  const isDark = resolvedTheme === "dark";

  const themes: { value: ThemeMode; icon: typeof Sun; label: string }[] = [
    { value: 'light', icon: Sun, label: 'Clair' },
    { value: 'dark', icon: Moon, label: 'Sombre' },
    { value: 'system', icon: Monitor, label: 'Auto' },
  ];

  const CurrentIcon = isDark ? Moon : Sun;

  const cycleTheme = () => {
    const order: ThemeMode[] = ['light', 'dark', 'system'];
    const currentIndex = order.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % order.length;
    setTheme(order[nextIndex]);
  };

  return (
    <div className="relative">
      {/* Main Toggle Button */}
      <motion.button
        onClick={cycleTheme}
        onContextMenu={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        className="theme-toggle w-10 h-10 flex items-center justify-center rounded-full border border-border/50 bg-card/50 backdrop-blur-sm hover:bg-muted transition-all duration-500"
        whileTap={{ scale: 0.95 }}
        aria-label={`Thème actuel: ${currentTheme}. Cliquez pour changer.`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={resolvedTheme}
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <CurrentIcon 
              size={18} 
              className="theme-toggle-icon text-foreground"
              strokeWidth={1.5}
            />
            {/* Indicator for system mode */}
            {currentTheme === 'system' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-primary"
              />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.button>

      {/* Dropdown Menu (on right-click) */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute right-0 top-full mt-2 z-50 bg-card border border-border shadow-lg min-w-[140px]"
            >
              {themes.map(({ value, icon: Icon, label }) => (
                <button
                  key={value}
                  onClick={() => {
                    setTheme(value);
                    setIsOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-widest
                    transition-all duration-300
                    ${currentTheme === value 
                      ? 'bg-muted text-foreground' 
                      : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                    }
                  `}
                >
                  <Icon size={14} strokeWidth={1.5} />
                  <span>{label}</span>
                  {currentTheme === value && (
                    <motion.div
                      layoutId="theme-indicator"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                    />
                  )}
                </button>
              ))}
              
              {/* Info about auto mode */}
              <div className="px-4 py-2 border-t border-border">
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  <span className="font-medium">Auto:</span> Mode sombre de 19h à 7h
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Compact version for navbar
export function ThemeToggleCompact() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-8 h-8" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <motion.button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors duration-300"
      whileTap={{ scale: 0.9 }}
      aria-label={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={resolvedTheme}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 90, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {isDark ? (
            <Sun size={16} strokeWidth={1.5} />
          ) : (
            <Moon size={16} strokeWidth={1.5} />
          )}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
}
