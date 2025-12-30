import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        display: ['SF Pro Display', 'Inter', 'system-ui', 'sans-serif'],
        body: ['SF Pro Text', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        /* ═══════════════════════════════════════════════════════════════
           i-wasp DESIGN SYSTEM — 3 PALETTES OFFICIELLES (STRICT)
           
           PALETTE 1 — "Nuit" : site, dashboard, expérience premium
           PALETTE 2 — "Blanc pur" : interface claire, cartes digitales
           PALETTE 3 — "Carte matière" : template carte physique NFC
           
           AUCUNE AUTRE COULEUR AUTORISÉE
           ═══════════════════════════════════════════════════════════════ */
        
        /* Semantic tokens */
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        glass: "hsl(var(--glass) / var(--glass-opacity))",
        surface: {
          0: "hsl(var(--surface-0))",
          1: "hsl(var(--surface-1))",
          2: "hsl(var(--surface-2))",
          3: "hsl(var(--surface-3))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        
        /* ══════════════════════════════════════════════════════════════
           PALETTE 1 — "Nuit" (défaut)
           ══════════════════════════════════════════════════════════════ */
        nuit: {
          noir: "hsl(var(--nuit-noir))",           /* #0B0B0C */
          "gris-profond": "hsl(var(--nuit-gris-profond))", /* #1C1C1E */
          "gris-struct": "hsl(var(--nuit-gris-struct))",   /* #8E8E93 */
          blanc: "hsl(var(--nuit-blanc))",         /* #F4F2EF */
          accent: "hsl(var(--nuit-accent))",       /* #8B1E1E */
        },
        
        /* ══════════════════════════════════════════════════════════════
           PALETTE 2 — "Blanc pur"
           ══════════════════════════════════════════════════════════════ */
        blanc: {
          pur: "hsl(var(--blanc-pur))",            /* #FFFFFF */
          ivoire: "hsl(var(--blanc-ivoire))",      /* #F4F2EF */
          "gris-clair": "hsl(var(--blanc-gris-clair))",   /* #D1D1D6 */
          "gris-struct": "hsl(var(--blanc-gris-struct))", /* #8E8E93 */
          noir: "hsl(var(--blanc-noir))",          /* #0B0B0C */
          accent: "hsl(var(--blanc-accent))",      /* #8B1E1E */
        },
        
        /* ══════════════════════════════════════════════════════════════
           PALETTE 3 — "Carte matière" (carte physique NFC)
           ══════════════════════════════════════════════════════════════ */
        carte: {
          blanc: "hsl(var(--carte-blanc))",        /* #F7F7F5 */
          chaud: "hsl(var(--carte-chaud))",        /* #EFEDEA */
          "gris-leger": "hsl(var(--carte-gris-leger))",   /* #E2E2E0 */
          "gris-struct": "hsl(var(--carte-gris-struct))", /* #8E8E93 */
          "noir-doux": "hsl(var(--carte-noir-doux))",     /* #1C1C1E */
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-down": {
          from: { opacity: "0", transform: "translateY(-20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-left": {
          from: { opacity: "0", transform: "translateX(20px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "fade-right": {
          from: { opacity: "0", transform: "translateX(-20px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "scale-up": {
          from: { opacity: "0", transform: "scale(0.95) translateY(20px)" },
          to: { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        "float-3d": {
          "0%, 100%": { 
            transform: "translateY(0px) rotateX(0deg) rotateY(0deg)" 
          },
          "25%": {
            transform: "translateY(-8px) rotateX(2deg) rotateY(-1deg)"
          },
          "50%": { 
            transform: "translateY(-12px) rotateX(0deg) rotateY(2deg)" 
          },
          "75%": {
            transform: "translateY(-6px) rotateX(-1deg) rotateY(0deg)"
          },
        },
        "float-subtle": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-glow": {
          "0%, 100%": { 
            opacity: "0.4",
            transform: "scale(1)"
          },
          "50%": { 
            opacity: "0.7",
            transform: "scale(1.02)"
          },
        },
        "shimmer": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(100%)" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "card-enter": {
          from: { opacity: "0", transform: "translateY(30px) rotateX(10deg)" },
          to: { opacity: "1", transform: "translateY(0) rotateX(0deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.6s ease-out both",
        "fade-up": "fade-up 0.6s ease-out both",
        "fade-down": "fade-down 0.6s ease-out both",
        "fade-left": "fade-left 0.6s ease-out both",
        "fade-right": "fade-right 0.6s ease-out both",
        "scale-in": "scale-in 0.5s ease-out both",
        "scale-up": "scale-up 0.6s ease-out both",
        "float-3d": "float-3d 8s ease-in-out infinite",
        "float-subtle": "float-subtle 3s ease-in-out infinite",
        "pulse-glow": "pulse-glow 4s ease-in-out infinite",
        "shimmer": "shimmer 3s ease-in-out infinite",
        "spin-slow": "spin-slow 20s linear infinite",
        "card-enter": "card-enter 0.8s cubic-bezier(0.16, 1, 0.3, 1) both",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'glass': '0 25px 50px -12px hsl(0 0% 0% / 0.6), 0 0 0 1px hsl(0 0% 100% / 0.05)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;