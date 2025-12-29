/**
 * Mobile Layout Hook
 * 
 * Provides utilities for mobile-first layout management:
 * - Safe area detection
 * - Viewport height handling (100dvh)
 * - Bottom padding for tab bar
 * - Header offset calculations
 */

import { useState, useEffect } from "react";

interface SafeAreaInsets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

interface MobileLayoutState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  safeAreaInsets: SafeAreaInsets;
  viewportHeight: number;
  hasNotch: boolean;
  tabBarHeight: number;
  headerHeight: number;
  contentPadding: {
    top: number;
    bottom: number;
  };
}

export function useMobileLayout(): MobileLayoutState {
  const [state, setState] = useState<MobileLayoutState>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    safeAreaInsets: { top: 0, right: 0, bottom: 0, left: 0 },
    viewportHeight: typeof window !== "undefined" ? window.innerHeight : 0,
    hasNotch: false,
    tabBarHeight: 64,
    headerHeight: 48,
    contentPadding: { top: 0, bottom: 0 },
  });

  useEffect(() => {
    const updateLayout = () => {
      const width = window.innerWidth;
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;
      const isDesktop = width >= 1024;

      // Get safe area insets from CSS env variables
      const computedStyle = getComputedStyle(document.documentElement);
      const safeAreaInsets = {
        top: parseInt(computedStyle.getPropertyValue("--sat") || "0") || 0,
        right: parseInt(computedStyle.getPropertyValue("--sar") || "0") || 0,
        bottom: parseInt(computedStyle.getPropertyValue("--sab") || "0") || 0,
        left: parseInt(computedStyle.getPropertyValue("--sal") || "0") || 0,
      };

      // Detect notch/Dynamic Island
      const hasNotch = safeAreaInsets.top > 20;

      // Calculate content padding
      const tabBarHeight = isMobile ? 64 : 0;
      const headerHeight = isMobile ? 48 : 0;
      
      setState({
        isMobile,
        isTablet,
        isDesktop,
        safeAreaInsets,
        viewportHeight: window.innerHeight,
        hasNotch,
        tabBarHeight,
        headerHeight,
        contentPadding: {
          top: isMobile ? headerHeight + safeAreaInsets.top : 0,
          bottom: isMobile ? tabBarHeight + safeAreaInsets.bottom : 0,
        },
      });
    };

    // Initial update
    updateLayout();

    // Listen for resize and orientation changes
    window.addEventListener("resize", updateLayout);
    window.addEventListener("orientationchange", updateLayout);

    // Set CSS variables for safe areas
    const setCSSVariables = () => {
      document.documentElement.style.setProperty(
        "--sat",
        "env(safe-area-inset-top, 0px)"
      );
      document.documentElement.style.setProperty(
        "--sar",
        "env(safe-area-inset-right, 0px)"
      );
      document.documentElement.style.setProperty(
        "--sab",
        "env(safe-area-inset-bottom, 0px)"
      );
      document.documentElement.style.setProperty(
        "--sal",
        "env(safe-area-inset-left, 0px)"
      );
    };
    setCSSVariables();

    return () => {
      window.removeEventListener("resize", updateLayout);
      window.removeEventListener("orientationchange", updateLayout);
    };
  }, []);

  return state;
}

/**
 * Calculate the available content height excluding mobile navigation
 */
export function useContentHeight(): string {
  const { isMobile, contentPadding } = useMobileLayout();
  
  if (!isMobile) return "100vh";
  
  const totalPadding = contentPadding.top + contentPadding.bottom;
  return `calc(100dvh - ${totalPadding}px)`;
}
