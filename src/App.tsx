import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import PublicCard from "./pages/PublicCard";
import AdminClients from "./pages/AdminClients";
import FirstCardSetup from "./pages/FirstCardSetup";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function LegacyCardRedirect() {
  const { slug } = useParams<{ slug: string }>();
  return <Navigate to={`/card/${slug ?? ""}`} replace />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public NFC Card - Main feature */}
            <Route path="/" element={<Navigate to="/admin" replace />} />
            <Route path="/c/:slug" element={<LegacyCardRedirect />} />
            <Route path="/card/:slug" element={<PublicCard />} />
            
            {/* Auth */}
            <Route path="/login" element={<Login />} />
            
            {/* First card setup */}
            <Route path="/setup" element={<FirstCardSetup />} />
            
            {/* Admin - Client management */}
            <Route path="/admin" element={<AdminClients />} />
            <Route path="/admin/clients" element={<AdminClients />} />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
