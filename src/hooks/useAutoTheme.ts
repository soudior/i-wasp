import { useEffect } from 'react';
import { useTheme } from 'next-themes';

interface UseAutoThemeOptions {
  darkStart?: number;  // Heure de début du mode sombre (0-23)
  darkEnd?: number;    // Heure de fin du mode sombre (0-23)
  enabled?: boolean;   // Activer/désactiver le mode automatique
}

export function useAutoTheme({
  darkStart = 19, // 19h00 par défaut
  darkEnd = 7,    // 07h00 par défaut
  enabled = true
}: UseAutoThemeOptions = {}) {
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    if (!enabled || theme === 'light' || theme === 'dark') {
      // Si l'utilisateur a explicitement choisi un thème, ne pas interférer
      // sauf si enabled est true et theme est 'system'
      if (!enabled) return;
      if (theme !== 'system') return;
    }

    const checkTime = () => {
      const hour = new Date().getHours();
      
      // Logique pour gérer le passage de minuit
      const isDarkTime = darkStart > darkEnd
        ? hour >= darkStart || hour < darkEnd  // Ex: 19h-7h
        : hour >= darkStart && hour < darkEnd; // Ex: 7h-19h (inversé)
      
      const targetTheme = isDarkTime ? 'dark' : 'light';
      
      // Appliquer seulement si le thème actuel est 'system' ou si nous forçons
      if (theme === 'system') {
        document.documentElement.classList.toggle('dark', isDarkTime);
      }
    };

    // Vérifier immédiatement
    checkTime();

    // Vérifier toutes les minutes
    const interval = setInterval(checkTime, 60000);

    return () => clearInterval(interval);
  }, [darkStart, darkEnd, enabled, theme, setTheme]);

  return { theme };
}
