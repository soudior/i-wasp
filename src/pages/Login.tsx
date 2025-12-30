/**
 * Login - Apple Cupertino style
 * Minimal, functional authentication
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && user) {
      navigate("/admin", { replace: true });
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
    navigate("/admin");
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
            Connexion
          </h1>
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
            ) : (
              "Se connecter"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
