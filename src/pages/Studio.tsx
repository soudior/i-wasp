/**
 * i-WASP STUDIO — Centre de Contrôle Ultra-Luxe
 * Dashboard premium avec preview en temps réel
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  User, 
  Users, 
  Bell, 
  Leaf, 
  Save, 
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  Globe,
  Instagram,
  Linkedin,
  MessageCircle,
  Crown,
  Zap,
  TrendingUp,
  Target,
  RefreshCw,
  Check,
  ExternalLink,
  TreePine,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { motion, AnimatePresence } from "framer-motion";

// Tabs configuration
const tabs = [
  { id: "studio", label: "Studio", icon: User },
  { id: "leads", label: "Mes Leads", icon: Users },
  { id: "automation", label: "Push & Ads", icon: Bell },
  { id: "eco", label: "Écologie", icon: Leaf },
];

// Mock leads data
const mockLeads = [
  { name: "Sophia Laurent", company: "LVMH", role: "Directrice Acquisition", score: 98, date: "Il y a 2h" },
  { name: "Alexandre Moreau", company: "Ferrari", role: "Brand Manager", score: 94, date: "Il y a 5h" },
  { name: "Isabella Chen", company: "Cartier", role: "VP Marketing", score: 91, date: "Hier" },
  { name: "Marcus Van Der Berg", company: "Porsche", role: "CEO Europe", score: 89, date: "Hier" },
];

const Studio = () => {
  const [activeTab, setActiveTab] = useState("studio");
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  // Profile form state
  const [profile, setProfile] = useState({
    name: "Julian de Wasp",
    title: "Directeur de l'Innovation",
    bio: "Bâtisseur d'empires digitaux. Leader visionnaire.",
    email: "julian@i-wasp.com",
    phone: "+33 6 00 00 00 00",
    company: "i-WASP",
    website: "https://i-wasp.com",
    instagram: "@juliandewasp",
    linkedin: "juliandewasp",
  });
  
  // Automation settings
  const [automation, setAutomation] = useState({
    pushEnabled: true,
    adsSync: false,
    weeklyReport: true,
    leadAlerts: true,
  });

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    setLastSaved(new Date());
  };

  return (
    <div className="min-h-screen bg-iwasp-midnight">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-iwasp-midnight/90 backdrop-blur-xl border-b border-iwasp-emerald/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="p-2 rounded-xl hover:bg-iwasp-emerald/10 transition-colors">
                <ArrowLeft className="w-5 h-5 text-iwasp-silver" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border-2 border-iwasp-bronze flex items-center justify-center">
                  <span className="font-display text-lg text-iwasp-bronze italic">W</span>
                </div>
                <div>
                  <h1 className="text-sm font-semibold text-iwasp-cream tracking-[0.15em] uppercase">i-WASP</h1>
                  <p className="text-xs text-iwasp-silver tracking-[0.2em] uppercase">Studio</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {lastSaved && (
                <span className="text-xs text-iwasp-silver flex items-center gap-2">
                  <Check className="w-3 h-3 text-iwasp-emerald-glow" />
                  Synchronisé
                </span>
              )}
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-iwasp-bronze hover:bg-iwasp-bronze-light text-iwasp-midnight font-medium gap-2 rounded-xl"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Synchronisation...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Enregistrer
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-[1fr,380px] gap-8">
          {/* Main content */}
          <div>
            {/* Hero section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 flex items-start gap-6"
            >
              {/* Bronze accent bar */}
              <div className="w-4 h-32 rounded-full bg-gradient-to-b from-iwasp-bronze to-iwasp-bronze/30 hidden sm:block" />
              
              <div>
                <h2 className="font-display text-4xl sm:text-5xl font-normal text-iwasp-cream mb-2">
                  <span className="italic">Améliorez</span>
                  <br />
                  votre
                  <br />
                  <span className="text-iwasp-bronze">Influence.</span>
                </h2>
                <p className="text-iwasp-silver mt-4 max-w-md">
                  Gérez chaque aspect de votre présence i-Wasp en temps réel.
                </p>
              </div>
            </motion.div>

            {/* Tabs */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2 -mx-2 px-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-iwasp-bronze text-iwasp-midnight"
                      : "bg-iwasp-midnight-elevated border border-iwasp-emerald/10 text-iwasp-silver hover:border-iwasp-bronze/30 hover:text-iwasp-cream"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <AnimatePresence mode="wait">
              {activeTab === "studio" && (
                <motion.div
                  key="studio"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  {/* Name & Title */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs text-iwasp-silver tracking-[0.15em] uppercase">
                        Nom de Prestige
                      </label>
                      <Input
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="bg-iwasp-midnight-elevated border-iwasp-emerald/20 text-iwasp-cream placeholder:text-iwasp-silver/50 focus:border-iwasp-bronze rounded-xl h-12"
                        placeholder="Votre nom"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-iwasp-silver tracking-[0.15em] uppercase">
                        Titre / Rang
                      </label>
                      <Input
                        value={profile.title}
                        onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                        className="bg-iwasp-midnight-elevated border-iwasp-emerald/20 text-iwasp-cream placeholder:text-iwasp-silver/50 focus:border-iwasp-bronze rounded-xl h-12"
                        placeholder="Votre titre"
                      />
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="space-y-2">
                    <label className="text-xs text-iwasp-silver tracking-[0.15em] uppercase">
                      Manifeste Personnel (Bio)
                    </label>
                    <Textarea
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      className="bg-iwasp-midnight-elevated border-iwasp-emerald/20 text-iwasp-cream placeholder:text-iwasp-silver/50 focus:border-iwasp-bronze rounded-xl min-h-[100px] resize-none"
                      placeholder="Votre histoire en quelques mots..."
                    />
                  </div>

                  {/* Contact fields */}
                  <div className="pt-6 border-t border-iwasp-emerald/10">
                    <h3 className="text-sm text-iwasp-cream font-medium mb-4 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-iwasp-bronze" />
                      Coordonnées
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs text-iwasp-silver tracking-[0.1em] uppercase flex items-center gap-2">
                          <Mail className="w-3 h-3" /> Email
                        </label>
                        <Input
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          className="bg-iwasp-midnight-elevated border-iwasp-emerald/20 text-iwasp-cream focus:border-iwasp-bronze rounded-xl h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-iwasp-silver tracking-[0.1em] uppercase flex items-center gap-2">
                          <Phone className="w-3 h-3" /> Téléphone
                        </label>
                        <Input
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          className="bg-iwasp-midnight-elevated border-iwasp-emerald/20 text-iwasp-cream focus:border-iwasp-bronze rounded-xl h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-iwasp-silver tracking-[0.1em] uppercase flex items-center gap-2">
                          <Building2 className="w-3 h-3" /> Entreprise
                        </label>
                        <Input
                          value={profile.company}
                          onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                          className="bg-iwasp-midnight-elevated border-iwasp-emerald/20 text-iwasp-cream focus:border-iwasp-bronze rounded-xl h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-iwasp-silver tracking-[0.1em] uppercase flex items-center gap-2">
                          <Globe className="w-3 h-3" /> Site web
                        </label>
                        <Input
                          value={profile.website}
                          onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                          className="bg-iwasp-midnight-elevated border-iwasp-emerald/20 text-iwasp-cream focus:border-iwasp-bronze rounded-xl h-11"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Social links */}
                  <div className="pt-6 border-t border-iwasp-emerald/10">
                    <h3 className="text-sm text-iwasp-cream font-medium mb-4 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-iwasp-bronze" />
                      Réseaux Sociaux
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs text-iwasp-silver tracking-[0.1em] uppercase flex items-center gap-2">
                          <Instagram className="w-3 h-3" /> Instagram
                        </label>
                        <Input
                          value={profile.instagram}
                          onChange={(e) => setProfile({ ...profile, instagram: e.target.value })}
                          className="bg-iwasp-midnight-elevated border-iwasp-emerald/20 text-iwasp-cream focus:border-iwasp-bronze rounded-xl h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-iwasp-silver tracking-[0.1em] uppercase flex items-center gap-2">
                          <Linkedin className="w-3 h-3" /> LinkedIn
                        </label>
                        <Input
                          value={profile.linkedin}
                          onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                          className="bg-iwasp-midnight-elevated border-iwasp-emerald/20 text-iwasp-cream focus:border-iwasp-bronze rounded-xl h-11"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "leads" && (
                <motion.div
                  key="leads"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  {/* Leads header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-display text-iwasp-cream">Vos Contacts Prestigieux</h3>
                      <p className="text-sm text-iwasp-silver">Leads extraits de vos interactions NFC</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-display text-iwasp-bronze">{mockLeads.length}</div>
                      <div className="text-xs text-iwasp-silver uppercase tracking-wider">Ce mois</div>
                    </div>
                  </div>

                  {/* Leads list */}
                  <div className="space-y-3">
                    {mockLeads.map((lead, index) => (
                      <motion.div
                        key={lead.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 rounded-2xl bg-iwasp-midnight-elevated border border-iwasp-emerald/10 hover:border-iwasp-bronze/30 transition-all group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-iwasp-bronze/20 to-iwasp-emerald/10 flex items-center justify-center">
                              <span className="font-display text-lg text-iwasp-bronze">{lead.name.charAt(0)}</span>
                            </div>
                            <div>
                              <h4 className="font-medium text-iwasp-cream">{lead.name}</h4>
                              <p className="text-sm text-iwasp-silver">{lead.role} · {lead.company}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2 justify-end">
                              <div className="text-sm font-medium text-iwasp-emerald-glow">{lead.score}%</div>
                              <div className="w-2 h-2 rounded-full bg-iwasp-emerald-glow" />
                            </div>
                            <p className="text-xs text-iwasp-silver mt-1">{lead.date}</p>
                          </div>
                        </div>
                        
                        {/* Quick actions */}
                        <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="sm" className="text-iwasp-silver hover:text-iwasp-cream hover:bg-iwasp-emerald/10 text-xs gap-1">
                            <Mail className="w-3 h-3" /> Email
                          </Button>
                          <Button variant="ghost" size="sm" className="text-iwasp-silver hover:text-iwasp-cream hover:bg-iwasp-emerald/10 text-xs gap-1">
                            <MessageCircle className="w-3 h-3" /> WhatsApp
                          </Button>
                          <Button variant="ghost" size="sm" className="text-iwasp-silver hover:text-iwasp-cream hover:bg-iwasp-emerald/10 text-xs gap-1">
                            <Linkedin className="w-3 h-3" /> LinkedIn
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Export CTA */}
                  <div className="p-6 rounded-2xl bg-gradient-to-r from-iwasp-emerald/10 to-iwasp-bronze/10 border border-iwasp-emerald/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-iwasp-cream mb-1">Exporter vers CRM</h4>
                        <p className="text-sm text-iwasp-silver">Synchronisez vos leads avec Salesforce, HubSpot ou Pipedrive</p>
                      </div>
                      <Button className="bg-iwasp-bronze hover:bg-iwasp-bronze-light text-iwasp-midnight gap-2">
                        <ExternalLink className="w-4 h-4" />
                        Connecter
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "automation" && (
                <motion.div
                  key="automation"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  {/* Automation header */}
                  <div className="p-6 rounded-2xl bg-gradient-to-r from-iwasp-midnight-elevated to-iwasp-emerald/5 border border-iwasp-emerald/20">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-iwasp-bronze/20 flex items-center justify-center">
                        <Zap className="w-6 h-6 text-iwasp-bronze" />
                      </div>
                      <div>
                        <h3 className="text-lg font-display text-iwasp-cream">Automation Active</h3>
                        <p className="text-sm text-iwasp-silver">i-Wasp travaille pour vous 24/7</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-display text-iwasp-bronze">847</div>
                        <div className="text-xs text-iwasp-silver">Push envoyés</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-display text-iwasp-bronze">23%</div>
                        <div className="text-xs text-iwasp-silver">Taux d'ouverture</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-display text-iwasp-bronze">12</div>
                        <div className="text-xs text-iwasp-silver">Conversions</div>
                      </div>
                    </div>
                  </div>

                  {/* Settings */}
                  <div className="space-y-4">
                    {[
                      { key: "pushEnabled", icon: Bell, title: "Notifications Push", desc: "Envoyez des messages aux personnes qui ont tapé votre carte" },
                      { key: "adsSync", icon: Target, title: "Sync Publicitaire", desc: "Synchronisez vos leads avec Meta Ads et Google Ads" },
                      { key: "weeklyReport", icon: TrendingUp, title: "Rapport Hebdomadaire", desc: "Recevez un résumé de vos performances chaque lundi" },
                      { key: "leadAlerts", icon: Users, title: "Alertes Lead VIP", desc: "Soyez notifié instantanément pour les leads à haut score" },
                    ].map((setting) => (
                      <div 
                        key={setting.key}
                        className="p-5 rounded-2xl bg-iwasp-midnight-elevated border border-iwasp-emerald/10 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-iwasp-emerald/10 flex items-center justify-center">
                            <setting.icon className="w-5 h-5 text-iwasp-emerald-glow" />
                          </div>
                          <div>
                            <h4 className="font-medium text-iwasp-cream">{setting.title}</h4>
                            <p className="text-sm text-iwasp-silver">{setting.desc}</p>
                          </div>
                        </div>
                        <Switch
                          checked={automation[setting.key as keyof typeof automation]}
                          onCheckedChange={(checked) => 
                            setAutomation({ ...automation, [setting.key]: checked })
                          }
                          className="data-[state=checked]:bg-iwasp-bronze"
                        />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "eco" && (
                <motion.div
                  key="eco"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  {/* Eco impact hero */}
                  <div className="p-8 rounded-3xl bg-gradient-to-br from-iwasp-emerald/20 to-iwasp-midnight-elevated border border-iwasp-emerald/30 text-center">
                    <div className="w-20 h-20 rounded-full bg-iwasp-emerald/20 flex items-center justify-center mx-auto mb-6">
                      <TreePine className="w-10 h-10 text-iwasp-emerald-glow" />
                    </div>
                    <h3 className="font-display text-3xl text-iwasp-cream mb-2">
                      Impact <span className="italic text-iwasp-emerald-glow">Positif</span>
                    </h3>
                    <p className="text-iwasp-silver max-w-md mx-auto">
                      Votre engagement avec i-Wasp contribue à un monde plus durable. Voici votre empreinte.
                    </p>
                  </div>

                  {/* Stats grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { value: "2,847", label: "Cartes papier économisées", icon: "📄" },
                      { value: "14", label: "Arbres préservés", icon: "🌳" },
                      { value: "89kg", label: "CO₂ évité", icon: "💨" },
                      { value: "∞", label: "Mises à jour sans réimpression", icon: "♻️" },
                    ].map((stat) => (
                      <div 
                        key={stat.label}
                        className="p-6 rounded-2xl bg-iwasp-midnight-elevated border border-iwasp-emerald/10 text-center"
                      >
                        <div className="text-3xl mb-2">{stat.icon}</div>
                        <div className="text-2xl font-display text-iwasp-emerald-glow mb-1">{stat.value}</div>
                        <div className="text-xs text-iwasp-silver">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Certificate */}
                  <div className="p-6 rounded-2xl bg-iwasp-midnight border border-iwasp-emerald/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-iwasp-emerald/10 flex items-center justify-center">
                          <Leaf className="w-6 h-6 text-iwasp-emerald-glow" />
                        </div>
                        <div>
                          <h4 className="font-medium text-iwasp-cream">Certificat Éco-Responsable</h4>
                          <p className="text-sm text-iwasp-silver">Téléchargez votre certificat d'impact</p>
                        </div>
                      </div>
                      <Button variant="outline" className="border-iwasp-emerald/30 text-iwasp-cream hover:bg-iwasp-emerald/10">
                        Télécharger
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Preview sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-28">
              <div className="text-center mb-4">
                <span className="text-xs text-iwasp-silver tracking-[0.15em] uppercase">Aperçu en direct</span>
              </div>
              
              {/* Phone mockup */}
              <div className="relative mx-auto w-72">
                {/* Glow */}
                <div className="absolute inset-0 bg-iwasp-bronze/15 rounded-[3rem] blur-2xl" />
                
                {/* Phone frame */}
                <div className="relative bg-iwasp-midnight rounded-[2.5rem] p-3 border border-iwasp-bronze/20 shadow-2xl">
                  {/* Screen */}
                  <div className="bg-gradient-to-b from-iwasp-midnight-elevated to-iwasp-midnight rounded-[2rem] overflow-hidden aspect-[9/16]">
                    {/* Dynamic island */}
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-full z-10" />
                    
                    {/* Profile preview */}
                    <div className="pt-14 px-5">
                      {/* Avatar */}
                      <div className="w-20 h-20 rounded-full mx-auto mb-4 relative">
                        <div className="absolute inset-0 rounded-full border-2 border-iwasp-bronze" />
                        <div className="absolute inset-1 rounded-full bg-gradient-to-br from-iwasp-bronze/30 to-iwasp-emerald/20 flex items-center justify-center">
                          <Crown className="w-8 h-8 text-iwasp-bronze" />
                        </div>
                      </div>
                      
                      {/* Name & title */}
                      <h3 className="font-display text-lg text-center text-iwasp-cream italic mb-1">
                        {profile.name || "Votre nom"}
                      </h3>
                      <p className="text-xs text-center text-iwasp-silver tracking-[0.1em] uppercase mb-4">
                        {profile.title || "Votre titre"}
                      </p>
                      
                      {/* Bio */}
                      <p className="text-xs text-center text-iwasp-silver/80 mb-6 leading-relaxed">
                        {profile.bio || "Votre manifeste..."}
                      </p>
                      
                      {/* Action buttons preview */}
                      <div className="space-y-2">
                        <div className="h-10 rounded-xl bg-iwasp-bronze/20 border border-iwasp-bronze/30 flex items-center justify-center text-xs text-iwasp-bronze">
                          Appeler
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {[Mail, MessageCircle, Linkedin].map((Icon, i) => (
                            <div key={i} className="h-10 rounded-xl bg-iwasp-emerald/10 border border-iwasp-emerald/20 flex items-center justify-center">
                              <Icon className="w-4 h-4 text-iwasp-emerald-glow" />
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Company */}
                      {profile.company && (
                        <div className="mt-6 pt-4 border-t border-iwasp-emerald/10 text-center">
                          <p className="text-xs text-iwasp-silver/60">{profile.company}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Sync indicator */}
              <div className="mt-6 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-iwasp-emerald/10 border border-iwasp-emerald/20">
                  <div className="w-2 h-2 rounded-full bg-iwasp-emerald-glow animate-pulse" />
                  <span className="text-xs text-iwasp-silver">Synchronisé en temps réel</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Studio;
