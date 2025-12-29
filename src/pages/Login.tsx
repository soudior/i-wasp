import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, Lock, ArrowRight, Sparkles } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    setIsLoading(true);
    const { error } = await signIn(email, password);
    setIsLoading(false);

    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        toast.error("Email ou mot de passe incorrect");
      } else {
        toast.error(error.message);
      }
      return;
    }

    toast.success("Connexion réussie");
    navigate("/dashboard");
  };

  // Render consistent structure - use visibility for loading state
  const showLoading = loading;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
      {/* Background effects - always rendered */}
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] orb opacity-30" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] orb opacity-20" />
      <div className="noise" />

      {/* Loading spinner */}
      <div 
        className={`absolute inset-0 z-20 flex items-center justify-center bg-background transition-opacity duration-200 ${
          showLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="w-8 h-8 rounded-full border-2 border-foreground/20 border-t-foreground animate-spin" />
      </div>

      {/* Main content - always in DOM */}
      <div 
        className={`relative z-10 w-full max-w-md px-6 transition-opacity duration-200 ${
          showLoading ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 hover:scale-105 transition-transform">
            <div className="relative w-10 h-10 rounded-xl bg-foreground flex items-center justify-center">
              <Sparkles size={20} className="text-background" />
            </div>
            <span className="font-display text-2xl font-bold text-foreground">IWASP</span>
          </Link>
        </div>

        {/* Card */}
        <div className="card-glass p-8">
          <div className="text-center mb-8">
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">
              Bienvenue
            </h1>
            <p className="text-muted-foreground text-sm">
              Connectez-vous à votre compte IWASP
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2 text-sm">
                <Mail size={14} className="text-chrome" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="vous@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-surface-2 border-border/50 focus:border-foreground/30 h-12"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2 text-sm">
                <Lock size={14} className="text-chrome" />
                Mot de passe
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-surface-2 border-border/50 focus:border-foreground/30 h-12"
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              variant="chrome"
              className="w-full h-12 text-base"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <span className="w-5 h-5 rounded-full border-2 border-background/30 border-t-background animate-spin" />
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  Se connecter
                  <ArrowRight size={18} className="ml-2" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border/50 text-center">
            <p className="text-sm text-muted-foreground">
              Pas encore de compte ?{" "}
              <Link
                to="/signup"
                className="text-foreground font-medium hover:text-chrome transition-colors"
              >
                Créer un compte
              </Link>
            </p>
          </div>
        </div>

        {/* Back to home */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
