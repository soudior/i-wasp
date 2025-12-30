/**
 * CardLayout - Isolated NFC Card View Layout
 * 
 * RULES (per spec):
 * - NO header
 * - NO footer
 * - NO menu
 * - NO links to home
 * - NO Lovable branding
 * - NO global components
 * - Full height page
 * - Card centered
 * - Mobile-first only
 */

import { ReactNode } from "react";

interface CardLayoutProps {
  children: ReactNode;
}

export function CardLayout({ children }: CardLayoutProps) {
  return (
    <div className="min-h-dvh bg-background">
      {children}
    </div>
  );
}
