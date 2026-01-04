/**
 * ═══════════════════════════════════════════════════════════════════════════
 * RESET PASSWORD — NOUVEAU MOT DE PASSE i-WASP
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Page de callback après clic sur le lien email
 * Permet de définir un nouveau mot de passe
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, ArrowLeft, AlertCircle, Lock, CheckCircle, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const passwordSchema = z.string().min(6, "6 caractères minimum").max(72, "72 caractères max");

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidSession, setIsValidSession] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check if user has a valid recovery session
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      // User should have a session from the recovery link
      if (session) {
        setIsValidSession(true);
      } else {
        setIsValidSession(false);
      }
    };

    checkSession();

    // Listen for auth state changes (recovery link creates a session)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsValidSession(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    setErrorMessage(null);
    
    // Validate password
    const validation = passwordSchema.safeParse(password);
    if (!validation.success) {
      setErrorMessage(validation.error.errors[0].message);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas");
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        console.error("Update password error:", error);
        setErrorMessage(error.message);
        toast.error("Erreur lors de la mise à jour");
      } else {
        setIsSuccess(true);
        toast.success("Mot de passe mis à jour !");
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 2000);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setErrorMessage("Erreur inattendue");
    } finally {
      setIsLoading(false);
    }
  };

  // Password strength indicator
  const passwordStrength = {
    length: password.length >= 6,
    hasLetter: /[a-zA-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
  };
  const strengthCount = Object.values(passwordStrength).filter(Boolean).length;

  // Loading state while checking session
  if (isValidSession === null) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Invalid session - link expired or already used
  if (!isValidSession) {
    return (
      <div className="min-h-dvh flex flex-col bg-background">
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
          <div className="container mx-auto px-6 py-4 flex items-center justify-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
                <span className="text-background font-bold text-sm">iW</span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground mb-4">
              Lien expiré
            </h1>
            <p className="text-muted-foreground mb-8">
              Ce lien de réinitialisation a expiré ou a déjà été utilisé.
            </p>
            <Link 
              to="/forgot-password"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:brightness-110 transition-all"
            >
              Demander un nouveau lien
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
              <span className="text-background font-bold text-sm">iW</span>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {isSuccess ? (
            /* Success State */
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground mb-4">
                Mot de passe mis à jour !
              </h1>
              <p className="text-muted-foreground mb-4">
                Votre mot de passe a été modifié avec succès.
              </p>
              <p className="text-sm text-muted-foreground">
                Redirection vers le tableau de bord...
              </p>
            </div>
          ) : (
            /* Form State */
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Lock className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground mb-2">
                  Nouveau mot de passe
                </h1>
                <p className="text-muted-foreground">
                  Choisissez un nouveau mot de passe sécurisé.
                </p>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/30 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-destructive" />
                  <p className="text-sm text-destructive">{errorMessage}</p>
                </div>
              )}

              {/* Form Card */}
              <div className="rounded-2xl bg-card border border-border p-8">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* New Password */}
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-foreground">
                      Nouveau mot de passe
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="6 caractères minimum"
                        required
                        disabled={isLoading}
                        autoComplete="new-password"
                        autoFocus
                        className="w-full px-4 py-3 pr-12 rounded-xl text-base bg-secondary text-foreground placeholder:text-muted-foreground outline-none border border-transparent focus:border-primary transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    
                    {/* Password strength */}
                    {password.length > 0 && (
                      <div className="flex gap-1.5 mt-2">
                        {[1, 2, 3].map((level) => (
                          <div
                            key={level}
                            className={`h-1 flex-1 rounded-full transition-colors ${
                              strengthCount >= level
                                ? strengthCount === 3
                                  ? "bg-green-500"
                                  : strengthCount === 2
                                  ? "bg-primary"
                                  : "bg-orange-500"
                                : "bg-secondary"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                      Confirmer le mot de passe
                    </label>
                    <input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Répétez le mot de passe"
                      required
                      disabled={isLoading}
                      autoComplete="new-password"
                      className={`w-full px-4 py-3 rounded-xl text-base bg-secondary text-foreground placeholder:text-muted-foreground outline-none border transition-colors ${
                        confirmPassword && password !== confirmPassword
                          ? "border-destructive"
                          : "border-transparent focus:border-primary"
                      }`}
                    />
                    {confirmPassword && password !== confirmPassword && (
                      <p className="text-xs text-destructive">Les mots de passe ne correspondent pas</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !password || !confirmPassword}
                    className="w-full py-3.5 min-h-[48px] rounded-xl font-semibold text-base disabled:opacity-50 disabled:pointer-events-none touch-manipulation select-none active:scale-[0.98] transition-all bg-primary text-primary-foreground hover:brightness-110"
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                    ) : (
                      "Mettre à jour le mot de passe"
                    )}
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
