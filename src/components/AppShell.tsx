/**
 * App Shell - Route-based Layout System
 * 
 * Strict separation of layouts:
 * - /card/[slug] → CardLayout (isolated, no nav)
 * - /c/[slug] → CardLayout (isolated, no nav) 
 * - /dashboard, /leads, /orders, /create, /edit → DashboardLayout
 * - /checkout, /order-confirmation, /cart → CheckoutLayout
 * - / → InstitutionalLayout
 * - /login, /signup → Minimal (no layout)
 */

import React from "react";
import { useLocation } from "react-router-dom";
import { CardLayout } from "@/layouts/CardLayout";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { CheckoutLayout } from "@/layouts/CheckoutLayout";
import { InstitutionalLayout } from "@/layouts/InstitutionalLayout";

export function AppShell({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const path = location.pathname;

  // Card view - Completely isolated (both /c/ and /card/)
  if (path.startsWith("/c/") || path.startsWith("/card/")) {
    return <CardLayout>{children}</CardLayout>;
  }

  // Dashboard routes
  if (
    path === "/dashboard" ||
    path === "/leads" ||
    path === "/orders" ||
    path.startsWith("/orders/") ||
    path === "/create" ||
    path === "/edit" ||
    path.startsWith("/admin")
  ) {
    return <DashboardLayout>{children}</DashboardLayout>;
  }

  // Checkout flow
  if (
    path === "/checkout" ||
    path === "/cart" ||
    path === "/order-confirmation"
  ) {
    return <CheckoutLayout>{children}</CheckoutLayout>;
  }

  // Auth pages - Minimal, no layout wrapper
  if (path === "/login" || path === "/signup") {
    return <div className="min-h-dvh bg-background">{children}</div>;
  }

  // Default: Institutional layout for / and other public pages
  return <InstitutionalLayout>{children}</InstitutionalLayout>;
}
