/**
 * CheckoutLayout - Payment Flow Layout
 * 
 * Minimal distraction, focused on conversion
 * i-wasp branding top-right
 */

import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { IWASPBrandBadge } from "@/components/templates/IWASPBrandBadge";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CheckoutLayoutProps {
  children: ReactNode;
  backUrl?: string;
}

export function CheckoutLayout({ children, backUrl = "/cart" }: CheckoutLayoutProps) {
  return (
    <div className="min-h-dvh bg-background">
      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-50 h-14 bg-background/95 backdrop-blur border-b border-border/50 safe-top">
        <div className="h-full max-w-2xl mx-auto px-4 flex items-center justify-between">
          <Link to={backUrl}>
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
              <ArrowLeft size={16} />
              <span>Retour</span>
            </Button>
          </Link>
          <IWASPBrandBadge variant="dark" />
        </div>
      </header>
      
      {/* Main Content */}
      <main className="pt-14 safe-bottom">
        {children}
      </main>
    </div>
  );
}
