/**
 * Dashboard Skeleton Loaders
 * Composants skeleton cohérents pour le Dashboard IWASP
 * Style Apple-like, minimaliste, animations fluides
 */

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// ============================================================================
// STATS SKELETON - Grille de métriques
// ============================================================================
export function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-foreground/5 rounded-2xl overflow-hidden mb-16 sm:mb-24">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-background p-6 sm:p-10 space-y-4">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-10 sm:h-12 w-20 sm:w-28" />
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// CARD SKELETON - Carte digitale
// ============================================================================
interface CardSkeletonProps {
  className?: string;
}

export function DashboardCardSkeleton({ className }: CardSkeletonProps) {
  return (
    <div 
      className={cn(
        "p-6 sm:p-8 border border-foreground/10 rounded-2xl",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5 sm:gap-8">
          {/* Avatar */}
          <Skeleton className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex-shrink-0" />
          
          {/* Info */}
          <div className="space-y-3">
            <Skeleton className="h-6 sm:h-7 w-40 sm:w-52" />
            <Skeleton className="h-4 w-32 sm:w-40" />
            <div className="flex items-center gap-4 pt-1">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="hidden sm:flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <Skeleton className="h-10 w-10 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function DashboardCardListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <DashboardCardSkeleton key={i} />
      ))}
    </div>
  );
}

// ============================================================================
// LEAD SKELETON - Ligne de lead
// ============================================================================
export function LeadItemSkeleton() {
  return (
    <div className="flex items-center justify-between p-5 border border-foreground/10 rounded-xl">
      <div className="flex items-center gap-4">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <Skeleton className="h-4 w-20" />
    </div>
  );
}

export function LeadListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <LeadItemSkeleton key={i} />
      ))}
    </div>
  );
}

// ============================================================================
// ORDER SKELETON - Ligne de commande
// ============================================================================
export function OrderItemSkeleton() {
  return (
    <div className="flex items-center justify-between p-5 border border-foreground/10 rounded-xl">
      <div className="flex items-center gap-4">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-4 w-36" />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-5 w-5" />
      </div>
    </div>
  );
}

export function OrderListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <OrderItemSkeleton key={i} />
      ))}
    </div>
  );
}

// ============================================================================
// STATS BAR SKELETON - Barre de statistiques
// ============================================================================
export function StatsBarSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="p-4 border border-foreground/10 rounded-xl space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-8 w-12" />
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// LINK STATS SKELETON - Top liens
// ============================================================================
export function LinkStatsSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-12" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// HEADER SKELETON - En-tête bienvenue
// ============================================================================
export function DashboardHeaderSkeleton() {
  return (
    <div className="mb-16 sm:mb-24 space-y-4">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-12 sm:h-16 w-48 sm:w-72" />
      <Skeleton className="h-5 w-64 sm:w-96" />
    </div>
  );
}

// ============================================================================
// FULL DASHBOARD SKELETON - Page complète
// ============================================================================
export function FullDashboardSkeleton() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-24 px-6 sm:px-12">
      <div className="max-w-[1400px] mx-auto">
        <DashboardHeaderSkeleton />
        <DashboardStatsSkeleton />
        
        {/* Tabs skeleton */}
        <div className="flex gap-6 sm:gap-12 mb-12 sm:mb-16 border-b border-foreground/5 pb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-5 w-20" />
          ))}
        </div>
        
        {/* Cards section skeleton */}
        <div className="space-y-10">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-10 w-40" />
          </div>
          <DashboardCardListSkeleton count={2} />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// NOTIFICATION SKELETON - Panneau de notification
// ============================================================================
export function NotificationPanelSkeleton() {
  return (
    <div className="p-6 border border-foreground/10 rounded-2xl space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton className="w-12 h-12 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
      <Skeleton className="h-10 w-full rounded-xl" />
    </div>
  );
}

// ============================================================================
// CAMPAIGN SECTION SKELETON
// ============================================================================
export function CampaignSectionSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <NotificationPanelSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
