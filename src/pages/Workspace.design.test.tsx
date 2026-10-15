import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Dashboard from "./Dashboard";
import Settings from "./Settings";
import Orders from "./Orders";
import OrderDetails from "./OrderDetails";
import { getOrderStatusColor, getOrderStatusLabel, type OrderStatus } from "@/hooks/useOrders";
import { formatPrice } from "@/lib/pricing";

// Isolated, synthetic view states. No real account, client data or network calls.
// Business hooks are stubbed at their boundary; the rendered controls stay real.
const state = vi.hoisted(() => ({
  cardsLoading: false,
  ordersLoading: false,
  orderLoading: false,
  orderError: false,
  orders: [] as Array<Record<string, unknown>>,
  order: null as Record<string, unknown> | null,
  mutation: vi.fn(() => { throw new Error("Mutations are forbidden in presentation tests"); }),
}));

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: state.mutation,
    auth: { updateUser: state.mutation },
    functions: { invoke: state.mutation },
    storage: { from: state.mutation },
  },
}));
vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({ user: { id: "presentation-test", email: "preview@example.invalid", user_metadata: { first_name: "Compte test" } }, signOut: state.mutation }),
}));
vi.mock("@/components/Navbar", () => ({ Navbar: () => <nav aria-label="Navigation de test" /> }));
vi.mock("@/components/Footer", () => ({ Footer: () => <footer /> }));
vi.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key: string) => key }) }));
vi.mock("@/hooks/useCards", () => ({
  useCards: () => ({ data: [], isLoading: state.cardsLoading }),
  useUpdateCard: () => ({ mutateAsync: state.mutation }),
  useDeleteCard: () => ({ mutateAsync: state.mutation }),
}));
vi.mock("@/hooks/useLeads", () => ({ useLeads: () => ({ data: [] }) }));
vi.mock("@/hooks/useScans", () => ({ useScans: () => ({ data: [] }) }));
vi.mock("@/hooks/useOrders", async (importOriginal) => ({
  ...await importOriginal<typeof import("@/hooks/useOrders")>(),
  useUserOrders: () => ({ data: state.orders, isLoading: state.ordersLoading }),
  useOrder: () => ({ data: state.order, isLoading: state.orderLoading, error: state.orderError }),
}));
vi.mock("@/hooks/useSubscription", () => ({ useSubscription: () => ({ isPremium: false }) }));
vi.mock("@/hooks/usePushNotifications", () => ({ useSendPushNotification: () => ({ sendNotification: state.mutation, isLoading: false }) }));
vi.mock("@/hooks/usePushSubscribers", () => ({ usePushSubscribers: () => ({ data: { total: 0, byCard: {} } }) }));
vi.mock("@/hooks/usePushNotificationLogs", () => ({
  usePushNotificationLogs: () => ({ data: [] }),
  useCreatePushNotificationLog: () => ({ mutateAsync: state.mutation }),
}));
vi.mock("@/hooks/useScheduledNotifications", () => ({
  useScheduledNotifications: () => ({ data: [] }),
  useCreateScheduledNotification: () => ({ mutateAsync: state.mutation, isPending: false }),
  useDeleteScheduledNotification: () => ({ mutateAsync: state.mutation }),
}));
vi.mock("@/lib/wallet", () => ({ generateAppleWalletPass: state.mutation, generateGoogleWalletPass: state.mutation }));
vi.mock("@/lib/invoiceGenerator", () => ({ generateInvoicePDF: state.mutation, downloadInvoice: state.mutation }));
vi.mock("@/hooks/useHapticFeedback", () => ({
  useHapticFeedback: () => ({ impactLight: state.mutation, impactMedium: state.mutation, notificationSuccess: state.mutation, notificationError: state.mutation }),
}));
vi.mock("@/components/onboarding/OnboardingTour", () => ({ useOnboardingTour: () => ({ restartTour: state.mutation }) }));

const syntheticOrder = (status = "shipped") => ({
  id: "synthetic-order",
  order_number: "TEST-2026-0001",
  created_at: "2026-01-01T12:00:00Z",
  paid_at: "2026-01-02T12:00:00Z",
  production_started_at: "2026-01-03T12:00:00Z",
  shipped_at: "2026-01-04T12:00:00Z",
  delivered_at: null,
  status,
  quantity: 2,
  unit_price_cents: 15000,
  total_price_cents: 30000,
  order_type: "standard",
  payment_method: "cod",
  shipping_name: "Destinataire de test",
  shipping_address: "Adresse fictive de test",
  shipping_postal_code: "00000",
  shipping_city: "Ville de test",
  shipping_country: "MA",
  tracking_number: "TRACKING-SYNTHETIC-0001",
});

describe("workspace presentation regression", () => {
  let container: HTMLDivElement;
  let root: Root;
  let network: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
    state.cardsLoading = false;
    state.ordersLoading = false;
    state.orderLoading = false;
    state.orderError = false;
    state.orders = [];
    state.order = null;
    state.mutation.mockClear();
    network = vi.fn(() => { throw new Error("Network is forbidden in presentation tests"); });
    vi.stubGlobal("fetch", network);
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
    expect(network).not.toHaveBeenCalled();
    expect(state.mutation).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });

  const render = async (page: React.ReactNode, path = "/") => {
    await act(async () => root.render(
      <MemoryRouter initialEntries={[path]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes><Route path="*" element={page} /></Routes>
      </MemoryRouter>,
    ));
  };
  const button = (label: string) => [...container.querySelectorAll("button")].find(element => element.textContent?.trim() === label);

  it("keeps dashboard creation and settings links in the empty state", async () => {
    await render(<Dashboard />);
    expect(container.querySelector(".brand-dashboard .workspace-main")).not.toBeNull();
    expect(container.querySelector("h1")?.textContent).toBe("Compte test");
    expect(container.querySelectorAll('a[href="/create"]')).toHaveLength(2);
    expect(container.querySelector('a[href="/settings"]')).not.toBeNull();
    expect(container.querySelector('a[href="/nfc-studio"]')).not.toBeNull();
    expect(container.textContent).toContain("Créez votre première carte");
    expect(container.querySelectorAll(".workspace-metric")).toHaveLength(4);
  });

  it("keeps dashboard loading separate from the empty state", async () => {
    state.cardsLoading = true;
    await render(<Dashboard />);
    expect(container.textContent).not.toContain("Créez votre première carte");
    expect(container.querySelector(".animate-pulse")).not.toBeNull();
  });

  it("keeps section navigation and disabled campaign/export controls", async () => {
    await render(<Dashboard />);
    await act(async () => button("Leads")?.click());
    expect(container.textContent).toContain("Aucun lead pour le moment");
    expect(button("Export CSV")?.disabled).toBe(true);
    await act(async () => button("Campagnes")?.click());
    expect(container.querySelectorAll(".workspace-campaign")).toHaveLength(4);
    expect(button("Premium requis")?.disabled).toBe(true);
    expect(button("Envoyer")?.disabled).toBe(true);
    expect(container.querySelector('a[href="/order/offre"]')).not.toBeNull();
  });

  it("keeps orders empty and loading states plus checkout destinations", async () => {
    await render(<Orders />);
    expect(container.querySelector(".brand-orders")).not.toBeNull();
    expect(container.textContent).toContain("Aucune commande");
    expect(container.querySelectorAll('a[href="/checkout"]')).toHaveLength(2);
    state.ordersLoading = true;
    await render(<Orders />);
    expect(container.textContent).not.toContain("Aucune commande");
    expect(container.querySelector(".animate-spin")).not.toBeNull();
  });

  it("preserves order links, prices and real functional status classes", async () => {
    state.orders = ["pending", "paid", "in_production", "shipped", "delivered"].map(status => ({ ...syntheticOrder(status), id: status }));
    await render(<Orders />);
    for (const order of state.orders) {
      const link = container.querySelector(`a[href="/orders/${order.id}"]`);
      expect(link).not.toBeNull();
      expect(link?.textContent).toContain(formatPrice(30000));
      const label = getOrderStatusLabel(order.status as OrderStatus);
      const badge = [...(link?.querySelectorAll("div") ?? [])].find(element => element.textContent?.trim() === label && element.classList.contains("rounded-full"));
      expect(badge).toBeDefined();
      for (const className of getOrderStatusColor(order.status as OrderStatus).split(" ")) {
        expect(badge?.classList.contains(className)).toBe(true);
      }
    }
  });

  it("keeps order detail loading and unavailable states", async () => {
    state.orderLoading = true;
    await render(<OrderDetails />);
    expect(container.querySelector(".brand-order-detail .animate-spin")).not.toBeNull();
    state.orderLoading = false;
    state.orderError = true;
    await render(<OrderDetails />);
    expect(container.querySelector("h1")?.textContent).toBe("Commande introuvable");
    expect(button("Voir mes commandes")).toBeDefined();
  });

  it("keeps detail totals, tracking, timeline status and invoice/support actions", async () => {
    state.order = syntheticOrder();
    await render(<OrderDetails />);
    expect(container.querySelector("h1")?.textContent).toBe("Commande TEST-2026-0001");
    expect(container.textContent).toContain(formatPrice(30000));
    expect(container.querySelector(".workspace-tracking-number")?.textContent).toBe("TRACKING-SYNTHETIC-0001");
    expect(container.querySelectorAll(".bg-green-500")).toHaveLength(6);
    expect(container.querySelectorAll(".bg-primary.animate-pulse")).toHaveLength(1);
    expect(button("Télécharger la facture")?.disabled).toBe(false);
    expect(container.querySelector('a[href="mailto:support@iwasp.ma"]')).not.toBeNull();
  });

  it("keeps settings labels, upload accept types and password gate", async () => {
    await render(<Settings />);
    expect(container.querySelector(".brand-settings")).not.toBeNull();
    expect(container.querySelector("h1")?.textContent).toBe("Paramètres du compte");
    for (const input of container.querySelectorAll(".workspace-input")) {
      expect(container.querySelector(`label[for="${input.id}"]`)?.textContent?.trim()).toBeTruthy();
    }
    expect(container.querySelector('input[type="file"]')?.getAttribute("accept")).toBe(".png,.svg,.jpg,.jpeg,.webp");
    expect(button("Modifier le mot de passe")?.disabled).toBe(true);
    expect(container.textContent).toContain("preview@example.invalid");
    expect(container.querySelector(".workspace-danger-action")?.textContent).toContain("Supprimer définitivement mon compte");
    const preview = [...container.querySelectorAll("div")].find(element => element.classList.contains("aspect-[1.586]"));
    expect(preview?.getAttribute("style")).toContain("linear-gradient(135deg, #0A0D0C, #050807)");
    expect(preview?.getAttribute("style")).toContain("rgba(165, 169, 180, 0.15)");
    expect(preview?.querySelector("img")).toBeNull();
  });
});
