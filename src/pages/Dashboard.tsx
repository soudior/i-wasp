import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Plus, CreditCard, Users, Eye, TrendingUp, 
  Settings, MoreVertical, Wallet, Share2, QrCode
} from "lucide-react";

const mockCards = [
  {
    id: "1",
    name: "Alexandre Dubois",
    title: "Directeur Général",
    company: "Prestige Corp",
    views: 234,
    leads: 45,
    status: "active",
  },
  {
    id: "2",
    name: "Marie Laurent",
    title: "Designer UX",
    company: "Creative Studio",
    views: 156,
    leads: 23,
    status: "active",
  },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
          >
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
                Tableau de bord
              </h1>
              <p className="text-muted-foreground">
                Gérez vos cartes digitales et suivez vos statistiques
              </p>
            </div>
            <Link to="/create">
              <Button variant="gold">
                <Plus size={18} />
                Nouvelle carte
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            {[
              { label: "Cartes actives", value: "2", icon: CreditCard, change: "+1" },
              { label: "Vues totales", value: "390", icon: Eye, change: "+12%" },
              { label: "Leads capturés", value: "68", icon: Users, change: "+8" },
              { label: "Taux de conversion", value: "17.4%", icon: TrendingUp, change: "+2.1%" },
            ].map((stat, index) => (
              <Card key={stat.label} variant="premium" className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <stat.icon size={20} className="text-primary" />
                  </div>
                  <span className="text-xs text-primary font-medium">{stat.change}</span>
                </div>
                <p className="font-display text-2xl font-bold text-foreground mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </Card>
            ))}
          </motion.div>

          {/* Cards list */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="font-display text-xl font-semibold text-foreground mb-4">
              Mes cartes
            </h2>
            
            <div className="space-y-4">
              {mockCards.map((card) => (
                <Card key={card.id} variant="premium" className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Avatar */}
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="font-display text-xl font-bold text-primary">
                        {card.name.charAt(0)}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <h3 className="font-display text-lg font-semibold text-foreground">
                        {card.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {card.title} • {card.company}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="font-semibold text-foreground">{card.views}</p>
                        <p className="text-xs text-muted-foreground">Vues</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-foreground">{card.leads}</p>
                        <p className="text-xs text-muted-foreground">Leads</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" title="Apple/Google Wallet">
                        <Wallet size={16} />
                      </Button>
                      <Button variant="outline" size="icon" title="Partager">
                        <Share2 size={16} />
                      </Button>
                      <Button variant="outline" size="icon" title="QR Code">
                        <QrCode size={16} />
                      </Button>
                      <Button variant="outline" size="icon" title="Paramètres">
                        <Settings size={16} />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}

              {/* Add new card */}
              <Link to="/create">
                <Card variant="default" className="p-6 border-dashed hover:border-primary/50 transition-colors cursor-pointer group">
                  <div className="flex items-center justify-center gap-3 text-muted-foreground group-hover:text-primary transition-colors">
                    <Plus size={20} />
                    <span className="font-medium">Créer une nouvelle carte</span>
                  </div>
                </Card>
              </Link>
            </div>
          </motion.div>

          {/* Recent leads */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12"
          >
            <h2 className="font-display text-xl font-semibold text-foreground mb-4">
              Leads récents
            </h2>
            
            <Card variant="premium">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Contact</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Email</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Carte scannée</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                      <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: "Jean Martin", email: "j.martin@email.com", card: "Alexandre Dubois", date: "Il y a 2h" },
                      { name: "Sophie Bernard", email: "s.bernard@corp.com", card: "Alexandre Dubois", date: "Il y a 5h" },
                      { name: "Pierre Dupont", email: "p.dupont@startup.io", card: "Marie Laurent", date: "Hier" },
                    ].map((lead, index) => (
                      <tr key={index} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                              <span className="text-sm font-medium text-foreground">
                                {lead.name.charAt(0)}
                              </span>
                            </div>
                            <span className="font-medium text-foreground">{lead.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground">{lead.email}</td>
                        <td className="p-4 text-muted-foreground">{lead.card}</td>
                        <td className="p-4 text-muted-foreground">{lead.date}</td>
                        <td className="p-4 text-right">
                          <Button variant="ghost" size="icon">
                            <MoreVertical size={16} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
