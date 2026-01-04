/**
 * ═══════════════════════════════════════════════════════════════════════════
 * FORGOT PASSWORD — RÉINITIALISATION MOT DE PASSE i-WASP
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Thème DARK Premium (#0B0B0B)
 * Utilise Supabase Auth resetPasswordForEmail
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, ArrowLeft, AlertCircle, Mail, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const emailSchema = z.string().trim().email("Email invalide");

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    setErrorMessage(null);
    
    // Validate email
    const validation = emailSchema.safeParse(email);
    if (!validation.success) {
      setErrorMessage(validation.error.errors[0].message);
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        console.error("Reset password error:", error);
        setErrorMessage("Erreur lors de l'envoi. Réessayez.");
        toast.error("Erreur lors de l'envoi");
      } else {
        setIsSuccess(true);
        toast.success("Email envoyé !");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setErrorMessage("Erreur inattendue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link 
            to="/login"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Retour</span>
          </Link>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
              <span className="text-background font-bold text-sm">iW</span>
            </div>
          </div>
          
          <div className="w-20" />
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
                Email envoyé !
              </h1>
              <p className="text-muted-foreground mb-8">
                Si un compte existe avec l'adresse <strong className="text-foreground">{email}</strong>, 
                vous recevrez un lien de réinitialisation.
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Vérifiez votre boîte de réception et vos spams.
              </p>
              <Link 
                to="/login"
                className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour à la connexion
              </Link>
            </div>
          ) : (
            /* Form State */
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground mb-2">
                  Mot de passe oublié ?
                </h1>
                <p className="text-muted-foreground">
                  Entrez votre email pour recevoir un lien de réinitialisation.
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
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-foreground">
                      Adresse email
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
                      autoFocus
                      className="w-full px-4 py-3 rounded-xl text-base bg-secondary text-foreground placeholder:text-muted-foreground outline-none border border-transparent focus:border-primary transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 min-h-[48px] rounded-xl font-semibold text-base disabled:opacity-50 disabled:pointer-events-none touch-manipulation select-none active:scale-[0.98] transition-all bg-primary text-primary-foreground hover:brightness-110"
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                    ) : (
                      "Envoyer le lien"
                    )}
                  </button>
                </form>

                <p className="mt-6 text-center text-sm text-muted-foreground">
                  Vous vous souvenez ?{" "}
                  <Link to="/login" className="text-primary font-medium hover:underline">
                    Se connecter
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
