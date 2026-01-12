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
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        playfair: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
      },
      colors: {
        /* ═══════════════════════════════════════════════════════════════
           i-WASP DESIGN SYSTEM — LUXE MAX
           Ultra-Luxe Premium — Blue Night & Cyan
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
           PALETTE LUXE MAX — Blue Night & Cyan
           ══════════════════════════════════════════════════════════════ */
        iwasp: {
          /* Blue Night Luxury */
          midnight: "#020819",               /* Blue night fond */
          "midnight-elevated": "#0A1020",    /* Surface élevée */
          "midnight-surface": "#0F1628",     /* Cards */
          cream: "#E8ECF4",                  /* Off-white */
          white: "#F0F4FA",                  /* Near white */
          
          /* Cyan Accent */
          cyan: "#4DF3FF",                   /* Cyan principal */
          "cyan-light": "#7DF7FF",           /* Cyan clair */
          "cyan-glow": "#2ED3E0",            /* Cyan profond */
          blue: "#4A7BFF",                   /* Bleu électrique */
          
          /* Text hierarchy */
          silver: "#8A9AB4",                 /* Texte secondaire */
          muted: "#5A6A84",                  /* Texte tertiaire */
          
          /* Legacy compatibility - mapped to new palette */
          bronze: "#4DF3FF",
          "bronze-light": "#7DF7FF",
          titanium: "#8A9AB4",
          platinum: "#E8ECF4",
          emerald: "#0F1628",
          "emerald-glow": "#1A2030",
          gold: "#4DF3FF",
          "gold-light": "#7DF7FF",
        },
        
        /* ══════════════════════════════════════════════════════════════
           PALETTE LUXE MAX — Direct Access
           ══════════════════════════════════════════════════════════════ */
        luxe: {
          void: "#020819",                    /* Blue night fond */
          deep: "#0A1020",                    /* Elevated surface */
          surface: "#0F1628",                 /* Cards and panels */
          glow: "#1A2030",                    /* Subtle highlight */
          cyan: "#4DF3FF",                    /* Primary accent */
          "cyan-light": "#7DF7FF",            /* Light accent */
          "cyan-dark": "#2ED3E0",             /* Dark accent */
          blue: "#4A7BFF",                    /* Blue alt */
          silver: "#8A9AB4",                  /* Secondary text */
          mist: "#5A6A84",                    /* Muted text */
          white: "#E8ECF4",                   /* Primary text */
          pure: "#F0F4FA",                    /* Headlines */
        },
        
        /* ══════════════════════════════════════════════════════════════
           PALETTE CARTE NFC — Ultra-Luxe
           ══════════════════════════════════════════════════════════════ */
        carte: {
          recto: "#020819",                  /* Blue night base */
          verso: "#0A1020",                  /* Elevated surface */
          texture: "#0F1628",                /* Texture subtile */
          logo: "#E8ECF4",                   /* Logo off-white */
          texte: "#E8ECF4",                  /* Texte off-white */
          secondaire: "#8A9AB4",             /* Texte secondaire */
          accent: "#4DF3FF",                 /* Cyan accent */
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