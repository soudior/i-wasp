/**
 * Layout Component
 * Wrapper avec Navbar et Footer pour les pages publiques
 */

import { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

interface LayoutProps {
  children: ReactNode;
  className?: string;
  hideNavbar?: boolean;
  hideFooter?: boolean;
}

export const Layout = ({ 
  children, 
  className = "",
  hideNavbar = false,
  hideFooter = false 
}: LayoutProps) => {
  return (
    <div className={`min-h-screen flex flex-col bg-background ${className}`}>
      {!hideNavbar && <Navbar />}
      <main className="flex-1">
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
};

export default Layout;
