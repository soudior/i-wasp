/**
 * Login - Apple Cupertino style
 * Minimal, functional authentication
 * Supports returnTo parameter for seamless flow continuation
 */

import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useGuestCard } from "@/contexts/GuestCardContext";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const { signIn, signUp, user, loading } = useAuth();
  const { hasGuestCard } = useGuestCard();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const returnTo = searchParams.get("returnTo") || "/dashboard";

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && user) {
      // If user has a guest card and returnTo is finalize, go there
      if (hasGuestCard && returnTo.includes("finalize")) {
        navigate(returnTo, { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [user, loading, navigate, hasGuestCard, returnTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    if (password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setIsLoading(true);
    
    if (mode === "signup") {
      const { error } = await signUp(email, password);
      setIsLoading(false);

      if (error) {
        if (error.message.includes("already registered")) {
          toast.error("Cet email est déjà utilisé");
        } else {
          toast.error(error.message);
        }
        return;
      }

      toast.success("Compte créé !");
      // Navigate will happen via useEffect when user state updates
    } else {
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
      navigate(returnTo);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center" style={{ backgroundColor: "#F5F5F7" }}>
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: "#007AFF" }} />
      </div>
    );
  }

  return (
    <div 
      className="min-h-dvh flex flex-col items-center justify-center p-6"
      style={{ backgroundColor: "#F5F5F7" }}
    >
      {/* Back button if coming from guest flow */}
      {hasGuestCard && (
        <div className="w-full max-w-sm mb-4">
          <button
            onClick={() => navigate("/create")}
            className="flex items-center gap-2 text-sm"
            style={{ color: "#007AFF" }}
          >
            <ArrowLeft size={16} />
            Retour à ma carte
          </button>
        </div>
      )}

      {/* Card */}
      <div 
        className="w-full max-w-sm rounded-2xl p-8 shadow-sm"
        style={{ backgroundColor: "#FFFFFF" }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 
            className="text-2xl font-semibold tracking-tight"
            style={{ color: "#1D1D1F" }}
          >
            {mode === "signup" ? "Créer un compte" : "Connexion"}
          </h1>
          {hasGuestCard && (
            <p 
              className="text-sm mt-2"
              style={{ color: "#8E8E93" }}
            >
              Pour sauvegarder votre carte
            </p>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label 
              htmlFor="email" 
              className="text-sm font-medium"
              style={{ color: "#1D1D1F" }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@exemple.com"
              required
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
              style={{ 
                backgroundColor: "#F5F5F7",
                color: "#1D1D1F",
                border: "1px solid transparent"
              }}
            />
          </div>

          <div className="space-y-2">
            <label 
              htmlFor="password" 
              className="text-sm font-medium"
              style={{ color: "#1D1D1F" }}
            >
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
              style={{ 
                backgroundColor: "#F5F5F7",
                color: "#1D1D1F",
                border: "1px solid transparent"
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl font-medium text-sm transition-all active:scale-[0.98] disabled:opacity-50"
            style={{
              backgroundColor: "#007AFF",
              color: "#FFFFFF",
            }}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mx-auto" />
            ) : mode === "signup" ? (
              "Créer mon compte"
            ) : (
              "Se connecter"
            )}
          </button>
        </form>

        {/* Toggle mode */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="text-sm"
            style={{ color: "#007AFF" }}
          >
            {mode === "login" ? "Pas encore de compte ? Créer un compte" : "Déjà un compte ? Se connecter"}
          </button>
        </div>
      </div>
    </div>
  );
}
