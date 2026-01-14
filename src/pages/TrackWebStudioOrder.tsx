import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { 
  Search, 
  Mail, 
  Hash, 
  CheckCircle2, 
  Clock, 
  Palette, 
  Code, 
  Rocket, 
  MessageSquare,
  ArrowLeft,
  Loader2,
  Globe,
  Calendar,
  User,
  Building2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface WebStudioOrder {
  id: string;
  created_at: string;
  updated_at: string;
  status: string;
  form_data: {
    businessName?: string;
    contactName?: string;
    email?: string;
    phone?: string;
    businessType?: string;
    websiteGoal?: string;
    features?: string[];
    budget?: string;
    timeline?: string;
    currentWebsite?: string;
    additionalInfo?: string;
  };
  proposal: {
    projectName?: string;
    estimatedDelivery?: string;
    features?: string[];
    priceMAD?: number;
    priceEUR?: number;
  };
  is_express: boolean;
  deadline: string | null;
  priority: string;
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode; description: string }> = {
  new: { 
    label: "Nouvelle demande", 
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    icon: <Clock className="w-5 h-5" />,
    description: "Votre demande a été reçue et est en attente de traitement"
  },
  contacted: { 
    label: "Contacté", 
    color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    icon: <MessageSquare className="w-5 h-5" />,
    description: "Nous avons pris contact avec vous pour discuter du projet"
  },
  in_progress: { 
    label: "En cours", 
    color: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    icon: <Code className="w-5 h-5" />,
    description: "Votre site web est en cours de développement"
  },
  review: { 
    label: "En révision", 
    color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    icon: <Palette className="w-5 h-5" />,
    description: "Le site est prêt pour votre révision et feedback"
  },
  completed: { 
    label: "Terminé", 
    color: "bg-green-500/20 text-green-400 border-green-500/30",
    icon: <CheckCircle2 className="w-5 h-5" />,
    description: "Votre site web est terminé et livré"
  },
  cancelled: { 
    label: "Annulé", 
    color: "bg-red-500/20 text-red-400 border-red-500/30",
    icon: <Clock className="w-5 h-5" />,
    description: "Cette commande a été annulée"
  },
};

const timelineSteps = [
  { key: "new", label: "Demande reçue", icon: Clock },
  { key: "contacted", label: "Contact établi", icon: MessageSquare },
  { key: "in_progress", label: "Développement", icon: Code },
  { key: "review", label: "Révision", icon: Palette },
  { key: "completed", label: "Livré", icon: Rocket },
];

export default function TrackWebStudioOrder() {
  const [searchParams] = useSearchParams();
  const [searchType, setSearchType] = useState<"email" | "id">("email");
  const [searchValue, setSearchValue] = useState(searchParams.get("email") || searchParams.get("id") || "");
  const [submittedSearch, setSubmittedSearch] = useState<{ type: "email" | "id"; value: string } | null>(
    searchParams.get("email") ? { type: "email", value: searchParams.get("email")! } :
    searchParams.get("id") ? { type: "id", value: searchParams.get("id")! } : null
  );

  const { data: order, isLoading, error } = useQuery({
    queryKey: ["web-studio-order", submittedSearch],
    queryFn: async () => {
      if (!submittedSearch) return null;

      let query = supabase.from("website_proposals").select("*");

      if (submittedSearch.type === "email") {
        query = query.ilike("form_data->>email", submittedSearch.value);
      } else {
        query = query.eq("id", submittedSearch.value);
      }

      const { data, error } = await query.order("created_at", { ascending: false }).limit(1).maybeSingle();

      if (error) throw error;
      return data as WebStudioOrder | null;
    },
    enabled: !!submittedSearch,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      setSubmittedSearch({ type: searchType, value: searchValue.trim() });
    }
  };

  const getStepStatus = (stepKey: string) => {
    if (!order) return "upcoming";
    const statusOrder = ["new", "contacted", "in_progress", "review", "completed"];
    const currentIndex = statusOrder.indexOf(order.status);
    const stepIndex = statusOrder.indexOf(stepKey);
    
    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "active";
    return "upcoming";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
      {/* Header */}
      <div className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/web-studio" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Retour au Web Studio</span>
          </Link>
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            <span className="font-semibold">Suivi Web Studio</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl">Suivez votre projet</CardTitle>
              <p className="text-muted-foreground mt-2">
                Entrez votre email ou l'identifiant de votre commande
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-4">
                {/* Search Type Toggle */}
                <div className="flex gap-2 justify-center">
                  <Button
                    type="button"
                    variant={searchType === "email" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSearchType("email")}
                    className="gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Email
                  </Button>
                  <Button
                    type="button"
                    variant={searchType === "id" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSearchType("id")}
                    className="gap-2"
                  >
                    <Hash className="w-4 h-4" />
                    ID Commande
                  </Button>
                </div>

                {/* Search Input */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    {searchType === "email" ? (
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    ) : (
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    )}
                    <Input
                      type={searchType === "email" ? "email" : "text"}
                      placeholder={searchType === "email" ? "votre@email.com" : "ID de la commande"}
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      className="pl-10 h-12 bg-background/50"
                    />
                  </div>
                  <Button type="submit" size="lg" className="gap-2 h-12">
                    <Search className="w-5 h-5" />
                    Rechercher
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {/* No Results */}
        {submittedSearch && !isLoading && !order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-amber-500/30 bg-amber-500/10">
              <CardContent className="py-8 text-center">
                <Clock className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucune commande trouvée</h3>
                <p className="text-muted-foreground">
                  Vérifiez l'email ou l'identifiant saisi et réessayez.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Order Details */}
        {order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Status Banner */}
            <Card className={`border ${statusConfig[order.status]?.color || statusConfig.new.color}`}>
              <CardContent className="py-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-background/50">
                    {statusConfig[order.status]?.icon || statusConfig.new.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl font-semibold">{order.proposal?.projectName || order.form_data?.businessName}</h3>
                      <Badge className={statusConfig[order.status]?.color || statusConfig.new.color}>
                        {statusConfig[order.status]?.label || "En attente"}
                      </Badge>
                      {order.is_express && (
                        <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                          ⚡ Express
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground">
                      {statusConfig[order.status]?.description || "Votre demande est en cours de traitement"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Progression du projet</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
                  
                  <div className="space-y-6">
                    {timelineSteps.map((step, index) => {
                      const status = getStepStatus(step.key);
                      const Icon = step.icon;
                      
                      return (
                        <div key={step.key} className="flex items-center gap-4 relative">
                          <div className={`
                            w-12 h-12 rounded-full flex items-center justify-center z-10 transition-all
                            ${status === "completed" ? "bg-green-500/20 text-green-400 ring-2 ring-green-500/30" : ""}
                            ${status === "active" ? "bg-primary/20 text-primary ring-2 ring-primary/50 animate-pulse" : ""}
                            ${status === "upcoming" ? "bg-muted text-muted-foreground" : ""}
                          `}>
                            {status === "completed" ? (
                              <CheckCircle2 className="w-6 h-6" />
                            ) : (
                              <Icon className="w-5 h-5" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className={`font-medium ${status === "upcoming" ? "text-muted-foreground" : ""}`}>
                              {step.label}
                            </p>
                            {status === "active" && (
                              <p className="text-sm text-primary">En cours...</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Details */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Project Info */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-primary" />
                    Informations projet
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Entreprise</p>
                    <p className="font-medium">{order.form_data?.businessName || "Non spécifié"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Type de site</p>
                    <p className="font-medium capitalize">{order.form_data?.businessType || "Non spécifié"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Objectif</p>
                    <p className="font-medium">{order.form_data?.websiteGoal || "Non spécifié"}</p>
                  </div>
                  {order.proposal?.features && order.proposal.features.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Fonctionnalités</p>
                      <div className="flex flex-wrap gap-2">
                        {order.proposal.features.map((feature, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Timeline Info */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Dates clés
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Demande créée le</p>
                    <p className="font-medium">
                      {format(new Date(order.created_at), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Dernière mise à jour</p>
                    <p className="font-medium">
                      {format(new Date(order.updated_at), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
                    </p>
                  </div>
                  {order.deadline && (
                    <div>
                      <p className="text-sm text-muted-foreground">Date limite estimée</p>
                      <p className="font-medium text-primary">
                        {format(new Date(order.deadline), "d MMMM yyyy", { locale: fr })}
                      </p>
                    </div>
                  )}
                  {order.proposal?.estimatedDelivery && (
                    <div>
                      <p className="text-sm text-muted-foreground">Livraison estimée</p>
                      <p className="font-medium text-green-400">
                        {order.proposal.estimatedDelivery}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Contact Info */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Contact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Nom</p>
                    <p className="font-medium">{order.form_data?.contactName || "Non spécifié"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{order.form_data?.email || "Non spécifié"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Help Section */}
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="py-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h3 className="font-semibold mb-1">Besoin d'aide ?</h3>
                    <p className="text-sm text-muted-foreground">
                      Notre équipe est disponible pour répondre à vos questions
                    </p>
                  </div>
                  <Button asChild>
                    <a 
                      href="https://wa.me/212600000000" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Nous contacter
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
