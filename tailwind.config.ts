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
        playfair: ['Playfair Display', 'Georgia', 'serif'],
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
          noir: "hsl(var(--nuit-noir))",           /* #0E0E11 */
          "gris-profond": "hsl(var(--nuit-gris-profond))", /* #15171C */
          "gris-struct": "hsl(var(--nuit-gris-struct))",   /* #8E8E93 */
          blanc: "hsl(var(--nuit-blanc))",         /* #FFFFFF */
          accent: "hsl(var(--nuit-accent))",       /* #3CFF6B */
        },
        
        /* ══════════════════════════════════════════════════════════════
           IWASP SIGNATURE COLORS
           ══════════════════════════════════════════════════════════════ */
        iwasp: {
          noir: "hsl(var(--iwasp-noir))",          /* #0E0E11 - Noir profond */
          charbon: "hsl(var(--iwasp-charbon))",    /* #15171C - Gris charbon */
          vert: "hsl(var(--iwasp-vert))",          /* #3CFF6B - Vert signature */
          blanc: "hsl(var(--iwasp-blanc))",        /* #FFFFFF - Blanc pur */
          gris: "hsl(var(--iwasp-gris))",          /* #8E8E93 - Gris structurel */
        },
        
        /* ══════════════════════════════════════════════════════════════
           PALETTE 2 — "Blanc pur"
           ══════════════════════════════════════════════════════════════ */
        blanc: {
          pur: "hsl(var(--blanc-pur))",            /* #FFFFFF */
          ivoire: "hsl(var(--blanc-ivoire))",      /* #F9FAFB */
          "gris-clair": "hsl(var(--blanc-gris-clair))",   /* #E5E7EB */
          "gris-struct": "hsl(var(--blanc-gris-struct))", /* #9CA3AF */
          noir: "hsl(var(--blanc-noir))",          /* #0E0E11 */
          accent: "hsl(var(--blanc-accent))",      /* #3CFF6B */
        },
        
        /* ══════════════════════════════════════════════════════════════
           PALETTE 3 — "Carte matière" (carte physique NFC)
           ══════════════════════════════════════════════════════════════ */
        carte: {
          blanc: "hsl(var(--carte-blanc))",        /* #F9FAFB */
          chaud: "hsl(var(--carte-chaud))",        /* #F3F4F6 */
          "gris-leger": "hsl(var(--carte-gris-leger))",   /* #E5E7EB */
          "gris-struct": "hsl(var(--carte-gris-struct))", /* #9CA3AF */
          "noir-doux": "hsl(var(--carte-noir-doux))",     /* #15171C */
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "0.875rem",    /* 14px - IWASP standard */
        "2xl": "1rem",      /* 16px */
        "3xl": "1.125rem",  /* 18px - IWASP cards */
        "4xl": "1.5rem",    /* 24px */
        full: "9999px",     /* Pill shape */
      },
      letterSpacing: {
        tighter: "-0.02em",
        tight: "-0.01em",   /* IWASP default for titles */
      },
      transitionDuration: {
        fast: "180ms",
        normal: "200ms",
        slow: "220ms",
      },
      transitionTimingFunction: {
        "iwasp": "cubic-bezier(0.42, 0, 0.58, 1)",
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
        "accordion-down": "accordion-down 200ms ease-in-out",
        "accordion-up": "accordion-up 200ms ease-in-out",
        "fade-in": "fade-in 200ms ease-in-out both",
        "fade-up": "fade-up 200ms ease-in-out both",
        "fade-down": "fade-down 200ms ease-in-out both",
        "fade-left": "fade-left 200ms ease-in-out both",
        "fade-right": "fade-right 200ms ease-in-out both",
        "scale-in": "scale-in 180ms ease-in-out both",
        "scale-up": "scale-up 200ms ease-in-out both",
        "float-3d": "float-3d 8s ease-in-out infinite",
        "float-subtle": "float-subtle 3s ease-in-out infinite",
        "pulse-glow": "pulse-glow 4s ease-in-out infinite",
        "shimmer": "shimmer 3s ease-in-out infinite",
        "spin-slow": "spin-slow 20s linear infinite",
        "card-enter": "card-enter 220ms cubic-bezier(0.42, 0, 0.58, 1) both",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-iwasp': 'linear-gradient(135deg, hsl(138 100% 62%), hsl(138 100% 55%))',
      },
      boxShadow: {
        'glass': '0 4px 20px hsl(0 0% 0% / 0.35), 0 0 0 1px hsl(0 0% 100% / 0.03)',
        'elevated': '0 8px 32px hsl(0 0% 0% / 0.4), 0 0 0 1px hsl(0 0% 100% / 0.05)',
        'iwasp': '0 4px 20px hsl(138 100% 62% / 0.2)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;