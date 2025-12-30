/**
 * InstitutionalLayout - Main Site Layout
 * 
 * For / and public pages
 * i-wasp branding, minimal navigation
 */

import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { IWASPBrandBadge } from "@/components/templates/IWASPBrandBadge";
import { Button } from "@/components/ui/button";

interface InstitutionalLayoutProps {
  children: ReactNode;
}

export function InstitutionalLayout({ children }: InstitutionalLayoutProps) {
  return (
    <div className="min-h-dvh bg-background">
      {/* Header - Minimal, functional */}
      <header className="fixed top-0 inset-x-0 z-50 bg-background/95 backdrop-blur border-b border-border/30 safe-top">
        <div className="h-14 max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <IWASPBrandBadge variant="dark" />
          </Link>
          
          <nav className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                Connexion
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" className="bg-foreground text-background hover:bg-foreground/90">
                Démarrer
              </Button>
            </Link>
          </nav>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="pt-14">
        {children}
      </main>
      
      {/* Footer - Minimal */}
      <footer className="border-t border-border/30 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <IWASPBrandBadge variant="dark" />
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} i-wasp. Infrastructure NFC métier.
          </p>
        </div>
      </footer>
    </div>
  );
}
