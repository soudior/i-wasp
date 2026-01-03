/**
 * Signup - iWasp Style
 * Dark theme with gold accent (#FFC700)
 * Step 1 of onboarding: Account creation
 */

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Loader2, ArrowRight, Mail, Lock, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { signUp, user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/onboarding", { replace: true });
    }
  }, [user, loading, navigate]);

  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/onboarding`,
        },
      });
      if (error) {
        toast.error("Erreur de connexion Google");
      }
    } catch {
      toast.error("Erreur de connexion");
    } finally {
      setIsGoogleLoading(false);
    }
  };

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

    if (error) {
      setIsLoading(false);
      if (error.message.includes("already registered")) {
        toast.error("Cet email est déjà utilisé");
      } else {
        toast.error("Erreur lors de la création du compte");
      }
      return;
    }

    // Send welcome email in background
    try {
      const dashboardUrl = `${window.location.origin}/dashboard`;
      await supabase.functions.invoke("send-welcome-email", {
        body: { email, firstName, lastName, dashboardUrl },
      });
    } catch {
      // Silent fail
    }

    setIsLoading(false);
    toast.success("Compte créé avec succès !");
    navigate("/onboarding");
  };

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-[#0B0B0B]">
        <Loader2 className="h-8 w-8 animate-spin text-[#FFC700]" />
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center p-6 bg-[#0B0B0B] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#FFC700]/10 rounded-full blur-[120px]" />

      <div className="relative z-10 w-full max-w-md">
        {/* Welcome Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#FFC700]/20 mb-6">
            <span className="text-3xl font-bold text-[#FFC700]">iW</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">
            Bienvenue sur iWasp
          </h1>
          <p className="text-[#E5E5E5]/70 text-lg leading-relaxed">
            Simplifie le partage de ton identité professionnelle grâce au NFC.
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#1F1F1F] rounded-2xl p-8 border border-[#E5E5E5]/10">
          <h2 className="text-xl font-semibold text-white mb-6 text-center">
            Créer un compte
          </h2>

          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={isGoogleLoading || isLoading}
            className="w-full py-4 rounded-xl font-medium text-sm flex items-center justify-center gap-3 mb-6 bg-white text-[#0B0B0B] disabled:opacity-50 transition-all hover:bg-[#E5E5E5]"
          >
            {isGoogleLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continuer avec Google
              </>
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-[#E5E5E5]/10" />
            <span className="text-xs text-[#E5E5E5]/50">ou par email</span>
            <div className="flex-1 h-px bg-[#E5E5E5]/10" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-sm text-[#E5E5E5]/70 flex items-center gap-2">
                  <User size={14} />
                  Prénom
                </label>
                <input
                  type="text"
                  placeholder="Jean"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#0B0B0B] border border-[#E5E5E5]/10 text-white placeholder:text-[#E5E5E5]/30 focus:border-[#FFC700]/50 focus:outline-none transition-colors"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-[#E5E5E5]/70 flex items-center gap-2">
                  <User size={14} />
                  Nom
                </label>
                <input
                  type="text"
                  placeholder="Dupont"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#0B0B0B] border border-[#E5E5E5]/10 text-white placeholder:text-[#E5E5E5]/30 focus:border-[#FFC700]/50 focus:outline-none transition-colors"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-[#E5E5E5]/70 flex items-center gap-2">
                <Mail size={14} />
                Email *
              </label>
              <input
                type="email"
                placeholder="vous@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-[#0B0B0B] border border-[#E5E5E5]/10 text-white placeholder:text-[#E5E5E5]/30 focus:border-[#FFC700]/50 focus:outline-none transition-colors"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-[#E5E5E5]/70 flex items-center gap-2">
                <Lock size={14} />
                Mot de passe *
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-[#0B0B0B] border border-[#E5E5E5]/10 text-white placeholder:text-[#E5E5E5]/30 focus:border-[#FFC700]/50 focus:outline-none transition-colors"
                disabled={isLoading}
              />
              <p className="text-xs text-[#E5E5E5]/40">Minimum 6 caractères</p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-xl font-bold text-[#0B0B0B] bg-[#FFC700] hover:bg-[#FFC700]/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 mt-6"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Créer mon compte
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#E5E5E5]/10 text-center">
            <p className="text-sm text-[#E5E5E5]/60">
              Déjà un compte ?{" "}
              <Link to="/login" className="text-[#FFC700] font-medium hover:underline">
                Se connecter
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-[#E5E5E5]/50 hover:text-[#E5E5E5]/70">
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
