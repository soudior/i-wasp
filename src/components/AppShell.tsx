/**
 * App Shell - Mobile-first layout wrapper
 * 
 * Provides:
 * - iOS-style navigation on mobile
 * - Desktop navbar on larger screens
 * - Safe area handling
 * - Smooth page transitions
 */

import React from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { MobileTabBar } from "@/components/MobileTabBar";
import { MobileHeader } from "@/components/MobileHeader";

export function AppShell({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  
  // Routes where we hide standard navigation
  const isPublicCard = location.pathname.startsWith("/c/");
  const isAuthPage = ["/login", "/signup"].includes(location.pathname);
  const isCheckout = location.pathname === "/checkout";
  const isOrderConfirmation = location.pathname === "/order-confirmation";
  
  // Show desktop navbar except on public card pages
  const showDesktopNav = !isPublicCard;
  
  // Show mobile navigation (tab bar + header)
  const showMobileNav = !isPublicCard && !isAuthPage && !isCheckout && !isOrderConfirmation;

  return (
    <div className="min-h-mobile-screen bg-background">
      {/* Desktop Navigation */}
      {showDesktopNav && (
        <div className="hidden md:block">
          <Navbar />
        </div>
      )}
      
      {/* Mobile Header */}
      {showMobileNav && <MobileHeader />}
      
      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className={showMobileNav ? "mobile-content md:pt-0 md:pb-0" : ""}
        >
          {children}
        </motion.main>
      </AnimatePresence>
      
      {/* Mobile Tab Bar */}
      {showMobileNav && <MobileTabBar />}
    </div>
  );
}
