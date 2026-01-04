import type { Config } from "tailwindcss";

export default {
  darkMode: false, // Dark mode désactivé - identité visuelle fixe
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
           iWASP DESIGN SYSTEM — LUXURY WHITE EDITION
           
           - Fond principal : #FFFFFF (Blanc pur)
           - Texte principal : #000000 (Noir absolu)
           - Gris subtil : #F2F2F2, #EAEAEA (Séparations)
           - Accent : Noir uniquement
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
           IWASP LUXURY WHITE COLORS (Soft Contrast)
           ══════════════════════════════════════════════════════════════ */
        iwasp: {
          bg: "#FFFFFF",                   /* Fond principal - Blanc */
          card: "#FFFFFF",                 /* Cartes - Blanc */
          secondary: "#F5F5F5",            /* Fond secondaire (doux) */
          border: "#EBEBEB",               /* Bordures subtiles */
          text: "#1A1A1A",                 /* Texte principal - Noir doux */
          "text-bold": "#000000",          /* Titres & emphase - Noir pur */
          muted: "#808080",                /* Texte secondaire */
          success: "#22C55E",              /* Succès */
          error: "#EF4444",                /* Erreur */
        },
        
        /* ══════════════════════════════════════════════════════════════
           PALETTE BLANC LUXE (Soft Contrast)
           ══════════════════════════════════════════════════════════════ */
        blanc: {
          pur: "hsl(var(--blanc-pur))",                   /* #FFFFFF */
          ivoire: "hsl(var(--blanc-ivoire))",             /* #FCFCFC */
          "gris-clair": "hsl(var(--blanc-gris-clair))",   /* #F5F5F5 */
          "gris-border": "hsl(var(--blanc-gris-border))", /* #EBEBEB */
          "gris-struct": "hsl(var(--blanc-gris-struct))", /* #808080 */
          noir: "hsl(var(--blanc-noir))",                 /* #000000 */
        },
        
        /* ══════════════════════════════════════════════════════════════
           PALETTE CARTE MATIÈRE (NFC blanche)
           ══════════════════════════════════════════════════════════════ */
        carte: {
          blanc: "hsl(var(--carte-blanc))",               /* #FFFFFF */
          chaud: "hsl(var(--carte-chaud))",               /* #FAFAFA */
          "gris-leger": "hsl(var(--carte-gris-leger))",   /* #F2F2F2 */
          "gris-struct": "hsl(var(--carte-gris-struct))", /* #737373 */
          "noir-doux": "hsl(var(--carte-noir-doux))",     /* #000000 */
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
      /* ANIMATIONS DISABLED FOR PRODUCTION - STATIC UI */
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0ms",
        "accordion-up": "accordion-up 0ms",
        "fade-in": "none",
        "fade-up": "none",
        "fade-down": "none",
        "fade-left": "none",
        "fade-right": "none",
        "scale-in": "none",
        "scale-up": "none",
        "float-3d": "none",
        "float-subtle": "none",
        "pulse-glow": "none",
        "shimmer": "none",
        "spin-slow": "none",
        "card-enter": "none",
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