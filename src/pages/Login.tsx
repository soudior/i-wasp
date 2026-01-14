/**
 * ═══════════════════════════════════════════════════════════════════════════
 * LOGIN — CONNEXION PREMIUM i-WASP
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Comportements VERROUILLÉS :
 * - UN SEUL TAP déclenche l'action
 * - Google OAuth avec redirection correcte
 * - Gestion du paramètre redirect pour continuité du tunnel
 * - Messages d'erreur clairs et visibles
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useGuestCard } from "@/contexts/GuestCardContext";
import { toast } from "sonner";
import { Loader2, ArrowLeft, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { signIn, signUp, user, loading } = useAuth();
  const { hasGuestCard } = useGuestCard();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Support both "returnTo" and "redirect" params
  const returnTo = searchParams.get("returnTo") || searchParams.get("redirect") || "/dashboard";

  // Show message if redirected from protected route
  useEffect(() => {
    const redirect = searchParams.get("redirect");
    if (redirect) {
      setErrorMessage("Veuillez vous connecter pour continuer");
    }
  }, [searchParams]);

  useEffect(() => {
    if (!loading && user) {
      // Clear error and redirect
      setErrorMessage(null);
      if (hasGuestCard && returnTo.includes("finalize")) {
        navigate(returnTo, { replace: true });
      } else if (returnTo && returnTo !== "/dashboard") {
        navigate(returnTo, { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [user, loading, navigate, hasGuestCard, returnTo]);

  const handleGoogleLogin = async () => {
    // Prevent double-tap
    if (isGoogleLoading || isLoading) return;
    
    setIsGoogleLoading(true);
    setErrorMessage(null);
    
    try {
      // Build redirect URL - use the current origin + returnTo path
      const redirectUrl = `${window.location.origin}${returnTo}`;
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });
      
      if (error) {
        console.error("Google OAuth error:", error);
        if (error.message.includes("403")) {
          setErrorMessage("Erreur 403 : Vérifiez la configuration Google OAuth");
        } else {
          setErrorMessage(`Erreur de connexion Google: ${error.message}`);
        }
        toast.error("Erreur de connexion Google");
      }
    } catch (err) {
      console.error("Google login error:", err);
      setErrorMessage("Erreur inattendue lors de la connexion Google");
      toast.error("Erreur de connexion");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent double submission
    if (isLoading || isGoogleLoading) return;
    
    setErrorMessage(null);
    
    if (!email || !password) {
      setErrorMessage("Veuillez remplir tous les champs");
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Le mot de passe doit contenir au moins 6 caractères");
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setIsLoading(true);
    
    if (mode === "signup") {
      const { error } = await signUp(email, password);
      setIsLoading(false);

      if (error) {
        if (error.message.includes("already registered")) {
          setErrorMessage("Cet email est déjà utilisé. Essayez de vous connecter.");
          toast.error("Cet email est déjà utilisé");
        } else {
          setErrorMessage(`Erreur: ${error.message}`);
          toast.error("Erreur lors de la création du compte");
        }
        return;
      }

      toast.success("Compte créé avec succès !");
      // Auto-redirect handled by useEffect
    } else {
      const { error } = await signIn(email, password);
      setIsLoading(false);

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          setErrorMessage("Email ou mot de passe incorrect");
          toast.error("Email ou mot de passe incorrect");
        } else {
          setErrorMessage(`Erreur: ${error.message}`);
          toast.error("Erreur de connexion");
        }
        return;
      }

      toast.success("Connexion réussie");
      // Redirect handled by useEffect
    }
  };

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
      {hasGuestCard && (
        <div className="w-full max-w-sm mb-4">
          <button
            onClick={() => navigate("/create")}
            className="flex items-center gap-2 text-sm touch-manipulation active:opacity-70"
            style={{ color: "#007AFF" }}
          >
            <ArrowLeft size={16} />
            Retour à ma carte
          </button>
        </div>
      )}

      <div 
        className="w-full max-w-sm rounded-2xl p-8 shadow-sm"
        style={{ backgroundColor: "#FFFFFF" }}
      >
        <div className="text-center mb-6">
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

        {/* Error Message - Visible and Clear */}
        {errorMessage && (
          <div 
            className="mb-6 p-4 rounded-xl flex items-start gap-3"
            style={{ backgroundColor: "#FEF2F2", border: "1px solid #FCA5A5" }}
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#DC2626" }} />
            <p className="text-sm" style={{ color: "#DC2626" }}>
              {errorMessage}
            </p>
          </div>
        )}

        {/* Google OAuth Button - Single tap, min 48px height, disabled during loading */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isGoogleLoading || isLoading}
          className="w-full py-3.5 min-h-[48px] rounded-xl font-medium text-sm flex items-center justify-center gap-3 mb-6 disabled:opacity-50 disabled:pointer-events-none touch-manipulation select-none active:scale-[0.98] transition-transform duration-75"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            color: "#1D1D1F",
            border: "1px solid rgba(212,175,55,0.3)",
            boxShadow: "0 4px 20px rgba(212,175,55,0.1), inset 0 1px 0 rgba(255,255,255,0.5)",
          }}
        >
          {isGoogleLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continuer avec Google
            </>
          )}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px" style={{ backgroundColor: "#E5E5E7" }} />
          <span className="text-xs" style={{ color: "#8E8E93" }}>ou</span>
          <div className="flex-1 h-px" style={{ backgroundColor: "#E5E5E7" }} />
        </div>

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
              autoComplete="email"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none touch-manipulation"
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
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none touch-manipulation"
              style={{ 
                backgroundColor: "#F5F5F7",
                color: "#1D1D1F",
                border: "1px solid transparent"
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || isGoogleLoading}
            className="w-full py-3.5 min-h-[48px] rounded-xl font-medium text-sm disabled:opacity-50 disabled:pointer-events-none touch-manipulation select-none active:scale-[0.98] transition-transform duration-75"
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

        {/* Forgot password link */}
        {mode === "login" && (
          <div className="mt-4 text-center">
            <a
              href="/forgot-password"
              className="text-sm touch-manipulation active:opacity-70"
              style={{ color: "#8E8E93" }}
            >
              Mot de passe oublié ?
            </a>
          </div>
        )}

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => {
              setMode(mode === "login" ? "signup" : "login");
              setErrorMessage(null);
            }}
            className="text-sm touch-manipulation active:opacity-70"
            style={{ color: "#007AFF" }}
          >
            {mode === "login" ? "Pas encore de compte ? Créer un compte" : "Déjà un compte ? Se connecter"}
          </button>
        </div>
      </div>

      {/* Help text for OAuth */}
      <p className="mt-6 text-xs text-center max-w-sm" style={{ color: "#8E8E93" }}>
        En continuant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
      </p>
    </div>
  );
}
