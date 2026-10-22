import { useState, type FormEvent } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface FunnelAuthStepProps {
  accent: string;
  ink: string;
  surface: string;
  text: string;
  muted: string;
  suggestedEmail?: string;
}

/**
 * Inline sign-in kept on the checkout step so the funnel state stays in place.
 */
export function FunnelAuthStep({ accent, ink, surface, text, muted, suggestedEmail }: FunnelAuthStepProps) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [email, setEmail] = useState(suggestedEmail ?? "");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (busy) return;
    setMessage(null);
    if (password.length < 6) {
      setMessage("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    setBusy(true);
    try {
      if (mode === "login") {
        const { error } = await signIn(email.trim(), password);
        if (error) setMessage("Email ou mot de passe incorrect.");
        return;
      }
      const { error, requiresEmailConfirmation } = await signUp(email.trim(), password, firstName.trim(), lastName.trim());
      if (error) {
        setMessage("Impossible de créer le compte. Essayez de vous connecter.");
        return;
      }
      if (requiresEmailConfirmation) {
        setMessage("Compte créé. Ouvrez l’email de confirmation, puis connectez-vous ici.");
        setMode("login");
      }
    } finally {
      setBusy(false);
    }
  };

  const fieldStyle = {
    width: "100%",
    minHeight: 48,
    fontSize: 16,
    padding: "12px 14px",
    borderRadius: 12,
    border: `1px solid ${muted}`,
    background: "transparent",
    color: text,
  } as const;

  return (
    <form onSubmit={submit} className="space-y-3 p-4" style={{ background: surface, borderRadius: 16 }}>
      <p className="text-sm" style={{ color: text }}>
        Connectez-vous pour finaliser votre commande
      </p>
      <p className="text-xs" style={{ color: muted }}>
        Votre commande reste affichée. Aucun paiement n’est lancé avant la connexion.
      </p>
      {mode === "signup" && (
        <div className="grid grid-cols-2 gap-2">
          <input aria-label="Prénom" autoComplete="given-name" placeholder="Prénom" value={firstName} onChange={(event) => setFirstName(event.target.value)} style={fieldStyle} />
          <input aria-label="Nom" autoComplete="family-name" placeholder="Nom" value={lastName} onChange={(event) => setLastName(event.target.value)} style={fieldStyle} />
        </div>
      )}
      <input aria-label="Email" type="email" autoComplete="email" inputMode="email" required placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} style={fieldStyle} />
      <input aria-label="Mot de passe" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} required placeholder="Mot de passe" value={password} onChange={(event) => setPassword(event.target.value)} style={fieldStyle} />
      {message && <p className="text-sm" style={{ color: text }}>{message}</p>}
      <button
        type="submit"
        disabled={busy}
        className="w-full"
        style={{ minHeight: 48, borderRadius: 12, background: accent, color: ink, fontSize: 16 }}
      >
        {busy ? "Vérification..." : mode === "login" ? "Se connecter" : "Créer mon compte"}
      </button>
      <button
        type="button"
        className="w-full text-sm"
        style={{ minHeight: 44, color: muted }}
        onClick={() => { setMode(mode === "login" ? "signup" : "login"); setMessage(null); }}
      >
        {mode === "login" ? "Créer un compte" : "J’ai déjà un compte"}
      </button>
    </form>
  );
}
