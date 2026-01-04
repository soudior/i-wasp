/**
 * Admin Dashboard - Unified control panel for IWASP Admin
 * Quick access to all admin tools
 */

import { useNavigate } from "react-router-dom";
import { AdminGuard } from "@/components/AdminGuard";
import { useAuth } from "@/contexts/AuthContext";
import { useAllOrders } from "@/hooks/useAdmin";
import { motion } from "framer-motion";
import {
  Zap,
  Printer,
  CreditCard,
  Package,
  Users,
  FileImage,
  Settings,
  TrendingUp,
  Clock,
  CheckCircle2,
  Truck,
  AlertCircle
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface QuickAction {
  title: string;
  description: string;
  icon: React.ElementType;
  path: string;
  color: string;
  badge?: string;
}

const quickActions: QuickAction[] = [
  {
    title: "Création vCard",
    description: "Créer une carte digitale instantanément",
    icon: Zap,
    path: "/admin/instant",
    color: "#FFC700",
    badge: "Instantané"
  },
  {
    title: "Impression Evolis",
    description: "Générer PDF pour carte physique",
    icon: Printer,
    path: "/admin/evolis",
    color: "#22C55E"
  },
  {
    title: "Gestion cartes",
    description: "Créer et gérer toutes les cartes",
    icon: CreditCard,
    path: "/admin/creator",
    color: "#3B82F6"
  },
  {
    title: "Commandes",
    description: "Suivi et gestion des commandes",
    icon: Package,
    path: "/admin/orders",
    color: "#A855F7"
  },
  {
    title: "Clients",
    description: "Base de données clients",
    icon: Users,
    path: "/admin/clients",
    color: "#EC4899"
  },
  {
    title: "Brand Assets",
    description: "Logos et fichiers officiels",
    icon: FileImage,
    path: "/brand-assets",
    color: "#F97316"
  }
];

function OrderStats() {
  const { data: orders, isLoading } = useAllOrders();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div 
            key={i}
            className="h-24 rounded-xl animate-pulse"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
          />
        ))}
      </div>
    );
  }

  const stats = [
    {
      label: "En attente",
      count: orders?.filter(o => o.status === "pending").length || 0,
      icon: Clock,
      color: "#FFC700"
    },
    {
      label: "En production",
      count: orders?.filter(o => o.status === "in_production").length || 0,
      icon: Settings,
      color: "#3B82F6"
    },
    {
      label: "Expédiées",
      count: orders?.filter(o => o.status === "shipped").length || 0,
      icon: Truck,
      color: "#A855F7"
    },
    {
      label: "Livrées",
      count: orders?.filter(o => o.status === "delivered").length || 0,
      icon: CheckCircle2,
      color: "#22C55E"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl p-4 border"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderColor: `${stat.color}30`
          }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${stat.color}20` }}
            >
              <stat.icon size={20} style={{ color: stat.color }} />
            </div>
            <div>
              <p 
                className="text-2xl font-bold"
                style={{ color: '#F5F5F5' }}
              >
                {stat.count}
              </p>
              <p 
                className="text-xs"
                style={{ color: 'rgba(245, 245, 245, 0.5)' }}
              >
                {stat.label}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function AdminDashboardContent() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div 
      className="min-h-dvh w-full"
      style={{ backgroundColor: '#0B0B0B' }}
    >
      {/* Header */}
      <header 
        className="sticky top-0 z-10 backdrop-blur border-b px-4 py-4"
        style={{ 
          backgroundColor: 'rgba(11, 11, 11, 0.95)',
          borderColor: 'rgba(255, 199, 0, 0.2)'
        }}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'rgba(255, 199, 0, 0.15)' }}
            >
              <TrendingUp size={20} style={{ color: '#FFC700' }} />
            </div>
            <div>
              <h1 
                className="text-lg font-bold"
                style={{ color: '#F5F5F5' }}
              >
                Admin Dashboard
              </h1>
              <p 
                className="text-xs"
                style={{ color: 'rgba(245, 245, 245, 0.5)' }}
              >
                {user?.email}
              </p>
            </div>
          </div>
          <Badge 
            className="px-3 py-1"
            style={{ backgroundColor: 'rgba(255, 199, 0, 0.15)', color: '#FFC700' }}
          >
            IWASP Admin
          </Badge>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Order Stats */}
        <section>
          <h2 
            className="text-sm font-medium mb-4 flex items-center gap-2"
            style={{ color: 'rgba(245, 245, 245, 0.7)' }}
          >
            <Package size={16} />
            Aperçu commandes
          </h2>
          <OrderStats />
        </section>

        {/* Quick Actions */}
        <section>
          <h2 
            className="text-sm font-medium mb-4 flex items-center gap-2"
            style={{ color: 'rgba(245, 245, 245, 0.7)' }}
          >
            <Zap size={16} />
            Actions rapides
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.path}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card 
                  className="cursor-pointer border transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    borderColor: 'rgba(245, 245, 245, 0.1)'
                  }}
                  onClick={() => navigate(action.path)}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${action.color}20` }}
                      >
                        <action.icon size={24} style={{ color: action.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 
                            className="font-semibold truncate"
                            style={{ color: '#F5F5F5' }}
                          >
                            {action.title}
                          </h3>
                          {action.badge && (
                            <Badge 
                              className="text-xs px-2 py-0"
                              style={{ 
                                backgroundColor: `${action.color}20`,
                                color: action.color
                              }}
                            >
                              {action.badge}
                            </Badge>
                          )}
                        </div>
                        <p 
                          className="text-sm mt-1"
                          style={{ color: 'rgba(245, 245, 245, 0.5)' }}
                        >
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Pro Tips */}
        <section>
          <Card 
            className="border"
            style={{ 
              backgroundColor: 'rgba(255, 199, 0, 0.05)',
              borderColor: 'rgba(255, 199, 0, 0.2)'
            }}
          >
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <AlertCircle size={20} style={{ color: '#FFC700' }} />
                <div>
                  <h3 
                    className="font-medium mb-1"
                    style={{ color: '#FFC700' }}
                  >
                    Workflow recommandé
                  </h3>
                  <ol 
                    className="text-sm space-y-1"
                    style={{ color: 'rgba(245, 245, 245, 0.7)' }}
                  >
                    <li>1. <strong>Créer vCard</strong> → /admin/instant (carte digitale immédiate)</li>
                    <li>2. <strong>Imprimer</strong> → /admin/evolis (PDF pour Evolis)</li>
                    <li>3. <strong>Livrer</strong> → Carte physique + NFC activé</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <AdminGuard>
      <AdminDashboardContent />
    </AdminGuard>
  );
}
