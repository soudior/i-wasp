import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppShell } from "@/components/AppShell";
import Index from "./pages/Index";
import Templates from "./pages/Templates";
import CreateCard from "./pages/CreateCard";
import CardEditor from "./pages/CardEditor";
import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import OrderConfirmation from "./pages/OrderConfirmation";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PublicCard from "./pages/PublicCard";
import Checkout from "./pages/Checkout";
import Cart from "./pages/Cart";
import AdminOrders from "./pages/AdminOrders";
import AdminAnalytics from "./pages/AdminAnalytics";
import Demo from "./pages/Demo";
import HotelDemo from "./pages/HotelDemo";
import HotelDashboard from "./pages/HotelDashboard";
import LianaLanding from "./pages/LianaLanding";
import IWASPCard from "./pages/IWASPCard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppShell>
            <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/card" element={<IWASPCard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/templates" element={<Templates />} />
                <Route path="/cart" element={<Cart />} />
                <Route
                  path="/create"
                  element={
                    <ProtectedRoute>
                      <CardEditor />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/edit"
                  element={
                    <ProtectedRoute>
                      <CardEditor />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/leads"
                  element={
                    <ProtectedRoute>
                      <Leads />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <Orders />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders/:orderId"
                  element={
                    <ProtectedRoute>
                      <OrderDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/order-confirmation"
                  element={
                    <ProtectedRoute>
                      <OrderConfirmation />
                    </ProtectedRoute>
                  }
                />
                <Route path="/c/:slug" element={<PublicCard />} />
                <Route path="/demo" element={<Demo />} />
                <Route path="/liana" element={<LianaLanding />} />
                <Route path="/hotel-demo" element={<HotelDemo />} />
                <Route path="/hotel-dashboard" element={<HotelDashboard />} />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/orders"
                  element={
                    <ProtectedRoute>
                      <AdminOrders />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/analytics"
                  element={
                    <ProtectedRoute>
                      <AdminAnalytics />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppShell>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
