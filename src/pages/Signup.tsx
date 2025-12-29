import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, Lock, User, ArrowRight, Sparkles } from "lucide-react";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setIsLoading(true);
    const { error } = await signUp(email, password, firstName, lastName);
    setIsLoading(false);

    if (error) {
      if (error.message.includes("already registered")) {
        toast.error("Cet email est déjà utilisé");
      } else {
        toast.error(error.message);
      }
      return;
    }

    toast.success("Compte créé avec succès !");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center py-12">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] orb opacity-30 animate-pulse-glow" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] orb opacity-20" />
      
      {/* Noise overlay */}
      <div className="noise" />

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <Link to="/" className="inline-flex items-center gap-2">
            <motion.div 
              className="relative w-10 h-10 rounded-xl bg-foreground flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles size={20} className="text-background" />
            </motion.div>
            <span className="font-display text-2xl font-bold text-foreground">IWASP</span>
          </Link>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="card-glass p-8"
        >
          <div className="text-center mb-8">
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">
              Créer un compte
            </h1>
            <p className="text-muted-foreground text-sm">
              Rejoignez IWASP et créez votre identité digitale
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="flex items-center gap-2 text-sm">
                  <User size={14} className="text-chrome" />
                  Prénom
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Jean"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="bg-surface-2 border-border/50 focus:border-foreground/30 h-12"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="flex items-center gap-2 text-sm">
                  <User size={14} className="text-chrome" />
                  Nom
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Dupont"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="bg-surface-2 border-border/50 focus:border-foreground/30 h-12"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2 text-sm">
                <Mail size={14} className="text-chrome" />
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="vous@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-surface-2 border-border/50 focus:border-foreground/30 h-12"
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2 text-sm">
                <Lock size={14} className="text-chrome" />
                Mot de passe *
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-surface-2 border-border/50 focus:border-foreground/30 h-12"
                disabled={isLoading}
                required
              />
              <p className="text-xs text-muted-foreground">
                Minimum 6 caractères
              </p>
            </div>

            <Button
              type="submit"
              variant="chrome"
              className="w-full h-12 text-base"
              disabled={isLoading}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 rounded-full border-2 border-background/30 border-t-background"
                />
              ) : (
                <>
                  Créer mon compte
                  <ArrowRight size={18} className="ml-2" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border/50 text-center">
            <p className="text-sm text-muted-foreground">
              Déjà un compte ?{" "}
              <Link
                to="/login"
                className="text-foreground font-medium hover:text-chrome transition-colors"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Back to home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-6"
        >
          <Link
            to="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Retour à l'accueil
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
