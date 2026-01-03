/**
 * EliteDashboard - i-wasp V1 Elite Command Center
 * 
 * The ultimate dashboard for NFC business card management.
 * Features: Real-time analytics, Lead CRM, Push Notifications, AI Coach
 * Design: Glassmorphism Noir & Or - World Domination standard
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Crown, Bell, TrendingUp, Users, Eye, Phone, Mail,
  Download, Settings, Sparkles, ChevronRight, Send,
  Zap, Shield, Globe, Clock, ArrowUpRight, CheckCircle2,
  MessageCircle, BarChart3, Target, Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Mock data for elite dashboard
const MOCK_STATS = {
  totalScans: 1247,
  monthlyScans: 342,
  conversionRate: 68.5,
  leadsCollected: 89,
  avgScanTime: "2.3s",
  topPerformingCard: "Guide Marrakech Elite",
};

const MOCK_LEADS = [
  { id: "1", name: "Sarah M.", email: "sarah.m@gmail.com", date: "Il y a 2h", source: "NFC Scan", score: 95 },
  { id: "2", name: "Ahmed K.", email: "ahmed.k@outlook.com", date: "Il y a 5h", source: "QR Code", score: 82 },
  { id: "3", name: "Marie L.", email: "marie.l@yahoo.fr", date: "Hier", source: "NFC Scan", score: 78 },
  { id: "4", name: "Thomas B.", email: "thomas.b@gmail.com", date: "Hier", source: "NFC Scan", score: 91 },
];

const MOCK_SCAN_DATA = [
  { day: "Lun", scans: 42 },
  { day: "Mar", scans: 58 },
  { day: "Mer", scans: 35 },
  { day: "Jeu", scans: 67 },
  { day: "Ven", scans: 89 },
  { day: "Sam", scans: 72 },
  { day: "Dim", scans: 45 },
];

interface EliteDashboardProps {
  userName?: string;
  isGold?: boolean;
  className?: string;
}

export function EliteDashboard({ 
  userName = "Karim Benjelloun",
  isGold = true,
  className = "" 
}: EliteDashboardProps) {
  const [activeSection, setActiveSection] = useState<"analytics" | "leads" | "push" | "settings">("analytics");
  const [showPushModal, setShowPushModal] = useState(false);
  const [aiTip, setAiTip] = useState("");
  const chartRef = useRef<HTMLDivElement>(null);

  // AI Coach tips rotation
  useEffect(() => {
    const tips = [
      "💡 Votre carte performe 35% mieux que la moyenne. Continuez à poster des Stories 24h !",
      "📈 Astuce : Placez votre carte près de la caisse pour augmenter les scans de 50%.",
      "🎯 Votre Story actuelle génère beaucoup de clics WhatsApp. Postez-en une similaire !",
      "⚡ Les scans du weekend sont 40% plus élevés. Préparez une offre spéciale !",
    ];
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    setAiTip(randomTip);
  }, []);

  const maxScans = Math.max(...MOCK_SCAN_DATA.map(d => d.scans));

  return (
    <div className={cn("min-h-screen bg-[#0a0a0a] text-white", className)}>
      {/* Elite Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/80 border-b border-amber-500/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Brand + User */}
            <div className="flex items-center gap-4">
              <motion.div 
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                  <Crown className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">{userName}</h1>
                  <div className="flex items-center gap-1">
                    {isGold && (
                      <span className="px-2 py-0.5 bg-gradient-to-r from-amber-400 to-amber-600 text-black text-[10px] font-bold rounded-full flex items-center gap-1">
                        <Sparkles size={8} />
                        GOLD ELITE
                      </span>
                    )}
                    <span className="text-[10px] text-amber-400/60">Certifié i-wasp</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Push Notification Button - Gold Feature */}
            {isGold && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Button
                  onClick={() => setShowPushModal(true)}
                  className="relative overflow-hidden bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold gap-2"
                >
                  <Bell className="w-4 h-4" />
                  Envoyer une Notification
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats Cards - Key Metrics */}
        <motion.div 
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Total Scans */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-zinc-900 to-black border-amber-500/20 p-5">
            <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/10 rounded-full blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <Eye className="w-4 h-4 text-amber-400" />
                </div>
                <span className="text-xs text-white/50">Scans Totaux</span>
              </div>
              <p className="text-3xl font-bold text-white mb-1">{MOCK_STATS.totalScans.toLocaleString()}</p>
              <div className="flex items-center gap-1 text-green-400 text-xs">
                <ArrowUpRight size={12} />
                <span>+{MOCK_STATS.monthlyScans} ce mois</span>
              </div>
            </div>
          </Card>

          {/* Conversion Rate */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-zinc-900 to-black border-amber-500/20 p-5">
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <Target className="w-4 h-4 text-green-400" />
                </div>
                <span className="text-xs text-white/50">Taux de Conversion</span>
              </div>
              <p className="text-3xl font-bold text-white mb-1">{MOCK_STATS.conversionRate}%</p>
              <div className="flex items-center gap-1 text-amber-400 text-xs">
                <Award size={12} />
                <span>Top 10% des guides</span>
              </div>
            </div>
          </Card>

          {/* Leads Collected */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-zinc-900 to-black border-amber-500/20 p-5">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-xs text-white/50">Leads Récupérés</span>
              </div>
              <p className="text-3xl font-bold text-white mb-1">{MOCK_STATS.leadsCollected}</p>
              <div className="flex items-center gap-1 text-blue-400 text-xs">
                <Mail size={12} />
                <span>Emails collectés</span>
              </div>
            </div>
          </Card>

          {/* Performance Score */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-amber-900/30 to-black border-amber-500/30 p-5">
            <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/20 rounded-full blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/30 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-amber-400" />
                </div>
                <span className="text-xs text-white/50">Score Elite</span>
              </div>
              <p className="text-3xl font-bold text-amber-400 mb-1">A+</p>
              <div className="flex items-center gap-1 text-amber-400/70 text-xs">
                <CheckCircle2 size={12} />
                <span>Performance maximale</span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* AI Coach Tip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="relative overflow-hidden bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-amber-500/30 p-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-black" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-amber-400 mb-1">Coach i-wasp Elite</h3>
                <p className="text-white/80 text-sm leading-relaxed">{aiTip}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Performance Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-zinc-900 to-black border-amber-500/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Performance des Scans</h3>
                  <p className="text-xs text-white/50">7 derniers jours</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-green-400 text-sm">
                <TrendingUp size={16} />
                <span>+25% vs semaine dernière</span>
              </div>
            </div>

            {/* Chart */}
            <div ref={chartRef} className="flex items-end gap-3 h-48">
              {MOCK_SCAN_DATA.map((data, index) => (
                <motion.div
                  key={data.day}
                  className="flex-1 flex flex-col items-center gap-2"
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                  style={{ originY: 1 }}
                >
                  <div 
                    className="w-full rounded-t-lg bg-gradient-to-t from-amber-600 to-amber-400 relative overflow-hidden"
                    style={{ height: `${(data.scans / maxScans) * 100}%`, minHeight: 20 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20" />
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-white font-medium">
                      {data.scans}
                    </span>
                  </div>
                  <span className="text-xs text-white/50">{data.day}</span>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Leads CRM Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-zinc-900 to-black border-amber-500/20 overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Leads & CRM</h3>
                    <p className="text-xs text-white/50">{MOCK_LEADS.length} contacts récupérés</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 gap-2">
                  <Download size={14} />
                  Exporter Excel
                </Button>
              </div>
            </div>

            {/* Leads List */}
            <div className="divide-y divide-white/5">
              {MOCK_LEADS.map((lead, index) => (
                <motion.div
                  key={lead.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors"
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400/20 to-amber-600/20 border border-amber-500/30 flex items-center justify-center">
                    <span className="text-sm font-medium text-amber-400">
                      {lead.name.charAt(0)}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{lead.name}</p>
                    <p className="text-xs text-white/50 truncate">{lead.email}</p>
                  </div>

                  {/* Source */}
                  <div className="hidden sm:block">
                    <span className="text-xs text-white/40">{lead.source}</span>
                  </div>

                  {/* Score */}
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full",
                          lead.score >= 90 ? "bg-green-500" : lead.score >= 70 ? "bg-amber-500" : "bg-red-500"
                        )}
                        style={{ width: `${lead.score}%` }}
                      />
                    </div>
                    <span className="text-xs text-white/60">{lead.score}</span>
                  </div>

                  {/* Time */}
                  <div className="flex items-center gap-1 text-white/40">
                    <Clock size={12} />
                    <span className="text-xs">{lead.date}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="w-8 h-8 text-green-400 hover:text-green-300 hover:bg-green-500/10">
                      <MessageCircle size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" className="w-8 h-8 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10">
                      <Mail size={16} />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </main>

      {/* Push Notification Modal */}
      <AnimatePresence>
        {showPushModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowPushModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md bg-gradient-to-br from-zinc-900 to-black border border-amber-500/30 rounded-3xl overflow-hidden"
            >
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                    <Bell className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Push Notification</h3>
                    <p className="text-sm text-white/50">Recontactez vos {MOCK_LEADS.length} leads</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm text-white/70 mb-2 block">Message</label>
                  <textarea
                    className="w-full h-24 p-4 rounded-xl bg-black/50 border border-white/10 text-white placeholder:text-white/30 focus:border-amber-500/50 resize-none"
                    placeholder="Bonjour ! Nous avons une offre spéciale pour vous..."
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 border-white/10 text-white hover:bg-white/5"
                    onClick={() => setShowPushModal(false)}
                  >
                    Annuler
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold hover:from-amber-400 hover:to-amber-500 gap-2"
                  >
                    <Send size={16} />
                    Envoyer à {MOCK_LEADS.length} leads
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default EliteDashboard;
