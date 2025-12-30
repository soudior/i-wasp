/**
 * DashboardLayout - Client Management Layout
 * 
 * Minimal navigation for authenticated users
 * Clean, functional interface
 */

import { ReactNode } from "react";
import { useLocation, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  CreditCard, 
  Users, 
  Package,
  Settings,
  LogOut
} from "lucide-react";
import { IWASPBrandBadge } from "@/components/templates/IWASPBrandBadge";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

interface DashboardLayoutProps {
  children: ReactNode;
}

const navItems = [
  { path: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { path: "/create", label: "Cartes", icon: CreditCard },
  { path: "/leads", label: "Contacts", icon: Users },
  { path: "/orders", label: "Commandes", icon: Package },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const { signOut } = useAuth();

  return (
    <div className="min-h-dvh bg-background flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border/50 bg-surface-1">
        {/* Logo */}
        <div className="p-6">
          <IWASPBrandBadge variant="dark" />
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path || 
              (path !== "/dashboard" && location.pathname.startsWith(path));
            
            return (
              <Link
                key={path}
                to={path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                  isActive 
                    ? "bg-secondary text-foreground" 
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                <Icon size={18} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
        
        {/* Footer */}
        <div className="p-3 border-t border-border/50">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut()}
            className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
          >
            <LogOut size={18} />
            <span>Déconnexion</span>
          </Button>
        </div>
      </aside>
      
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 inset-x-0 z-50 h-14 bg-background/95 backdrop-blur border-b border-border/50 flex items-center justify-between px-4 safe-top">
        <IWASPBrandBadge variant="dark" />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => signOut()}
          className="text-muted-foreground"
        >
          <LogOut size={18} />
        </Button>
      </div>
      
      {/* Main Content */}
      <main className="flex-1 md:overflow-auto">
        <div className="pt-14 md:pt-0 pb-20 md:pb-0">
          {children}
        </div>
      </main>
      
      {/* Mobile Tab Bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-background/95 backdrop-blur border-t border-border/50 safe-bottom">
        <div className="flex justify-around py-2">
          {navItems.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path || 
              (path !== "/dashboard" && location.pathname.startsWith(path));
            
            return (
              <Link
                key={path}
                to={path}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-1.5 min-w-[64px]",
                  isActive 
                    ? "text-foreground" 
                    : "text-muted-foreground"
                )}
              >
                <Icon size={20} />
                <span className="text-[10px]">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
