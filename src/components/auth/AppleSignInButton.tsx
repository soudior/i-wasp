/**
 * Bouton « Continuer avec Apple » conforme aux Human Interface Guidelines :
 * fond noir, logo Apple blanc, hauteur ≥ 44pt, coins arrondis, libellé localisé.
 * (Réf. Apple HIG « Sign in with Apple » — variante fond noir.)
 */

import { Loader2 } from "lucide-react";

interface AppleSignInButtonProps {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
  /** Libellé : première connexion vs bouton générique. */
  label?: string;
  className?: string;
}

export function AppleSignInButton({
  onClick,
  loading = false,
  disabled = false,
  label = "Continuer avec Apple",
  className = "",
}: AppleSignInButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading || disabled}
      aria-label={label}
      className={`w-full py-3.5 min-h-[48px] rounded-xl font-medium text-sm flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:pointer-events-none touch-manipulation select-none active:scale-[0.98] transition-transform duration-75 ${className}`}
      style={{
        backgroundColor: "#000000",
        color: "#FFFFFF",
        border: "1px solid #000000",
      }}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          {/* Logo Apple officiel (glyphe) */}
          <svg width="16" height="18" viewBox="0 0 14 18" aria-hidden="true" focusable="false">
            <path
              fill="#FFFFFF"
              d="M11.6 9.53c-.02-1.86 1.52-2.75 1.59-2.79-.87-1.27-2.22-1.44-2.7-1.46-1.15-.12-2.24.68-2.83.68-.58 0-1.48-.66-2.43-.64-1.25.02-2.4.73-3.05 1.85-1.3 2.26-.33 5.6.93 7.43.62.9 1.36 1.9 2.32 1.87.93-.04 1.28-.6 2.41-.6 1.12 0 1.44.6 2.42.58 1-.02 1.63-.91 2.24-1.81.71-1.04 1-2.05 1.01-2.1-.02-.01-1.93-.74-1.95-2.94zM9.76 3.76c.51-.62.86-1.49.76-2.35-.74.03-1.63.49-2.16 1.11-.47.55-.89 1.43-.78 2.27.83.06 1.67-.42 2.18-1.03z"
            />
          </svg>
          {label}
        </>
      )}
    </button>
  );
}
