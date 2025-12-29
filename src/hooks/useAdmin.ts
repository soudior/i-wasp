import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { Order, OrderStatus, OrderUpdate } from "./useOrders";

// Check if current user has admin role
export function useIsAdmin() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["isAdmin", user?.id],
    queryFn: async () => {
      if (!user) return false;
      
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      
      if (error) {
        console.error("Error checking admin role:", error);
        return false;
      }
      
      return !!data;
    },
    enabled: !!user,
  });
}

// Fetch all orders (admin only)
export function useAllOrders() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["adminOrders"],
    queryFn: async () => {
      if (!user) throw new Error("Not authenticated");
      
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Order[];
    },
    enabled: !!user,
  });
}

// Admin update order status
export function useAdminUpdateOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ orderId, updates }: { orderId: string; updates: OrderUpdate }) => {
      const { data, error } = await supabase
        .from("orders")
        .update(updates)
        .eq("id", orderId)
        .select()
        .single();
      
      if (error) throw error;
      return data as Order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminOrders"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Commande mise à jour");
    },
    onError: (error) => {
      console.error("Error updating order:", error);
      toast.error("Erreur lors de la mise à jour");
    },
  });
}

// Confirm COD order (change status from pending to paid)
export function useConfirmCODOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (orderId: string) => {
      const { data, error } = await supabase
        .from("orders")
        .update({ 
          status: "paid" as OrderStatus,
          paid_at: new Date().toISOString()
        })
        .eq("id", orderId)
        .select()
        .single();
      
      if (error) throw error;
      return data as Order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminOrders"] });
      toast.success("Commande confirmée - prête pour production");
    },
    onError: (error) => {
      console.error("Error confirming order:", error);
      toast.error("Erreur lors de la confirmation");
    },
  });
}

// Start production
export function useStartProduction() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (orderId: string) => {
      const { data, error } = await supabase
        .from("orders")
        .update({ 
          status: "in_production" as OrderStatus,
          production_started_at: new Date().toISOString()
        })
        .eq("id", orderId)
        .select()
        .single();
      
      if (error) throw error;
      return data as Order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminOrders"] });
      toast.success("Production démarrée");
    },
    onError: (error) => {
      console.error("Error starting production:", error);
      toast.error("Erreur lors du démarrage production");
    },
  });
}

// Mark as shipped
export function useMarkShipped() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ orderId, trackingNumber }: { orderId: string; trackingNumber?: string }) => {
      const { data, error } = await supabase
        .from("orders")
        .update({ 
          status: "shipped" as OrderStatus,
          shipped_at: new Date().toISOString(),
          tracking_number: trackingNumber
        })
        .eq("id", orderId)
        .select()
        .single();
      
      if (error) throw error;
      return data as Order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminOrders"] });
      toast.success("Commande expédiée");
    },
    onError: (error) => {
      console.error("Error marking shipped:", error);
      toast.error("Erreur lors de l'expédition");
    },
  });
}

// Mark as delivered
export function useMarkDelivered() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (orderId: string) => {
      const { data, error } = await supabase
        .from("orders")
        .update({ 
          status: "delivered" as OrderStatus,
          delivered_at: new Date().toISOString()
        })
        .eq("id", orderId)
        .select()
        .single();
      
      if (error) throw error;
      return data as Order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminOrders"] });
      toast.success("Commande livrée");
    },
    onError: (error) => {
      console.error("Error marking delivered:", error);
      toast.error("Erreur");
    },
  });
}
