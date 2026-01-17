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
        // OMNIA Typography
        display: ["'Tenor Sans'", 'Georgia', 'serif'],
        body: ["'Plus Jakarta Sans'", '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ["'JetBrains Mono'", 'monospace'],
        accent: ["'Tenor Sans'", 'Georgia', 'serif'],
        serif: ["'Tenor Sans'", 'Georgia', 'serif'],
        sans: ["'Plus Jakarta Sans'", '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        // Legacy
        cinzel: ['Cinzel', 'Georgia', 'serif'],
      },
      colors: {
        /* ═══════════════════════════════════════════════════════════════
           i-wasp OMNIA EDITION — Design System
           Luxe invisible, omniprésence digitale, prestige immatériel
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
           PALETTE OMNIA — Obsidienne, Champagne, Ivoire
           ══════════════════════════════════════════════════════════════ */
        omnia: {
          // Obsidienne - Noir profond
          obsidienne: "#030303",
          "obsidienne-deep": "#000000",
          "obsidienne-elevated": "#0A0A0A",
          "obsidienne-surface": "#111111",
          
          // Champagne - Accent principal
          champagne: "#DCC7B0",
          "champagne-light": "#E8D9C7",
          "champagne-muted": "#B8A48F",
          
          // Ivoire - Texte
          ivoire: "#FDFCFB",
          "ivoire-soft": "#F5F4F2",
          "ivoire-muted": "#E0DFDD",
          
          // Text hierarchy
          text: "#FDFCFB",
          "text-secondary": "rgba(253, 252, 251, 0.6)",
          "text-muted": "rgba(253, 252, 251, 0.4)",
          "text-subtle": "rgba(253, 252, 251, 0.2)",
          
          // Borders
          border: "rgba(255, 255, 255, 0.05)",
          "border-hover": "rgba(255, 255, 255, 0.08)",
          "border-active": "rgba(220, 199, 176, 0.15)",
          
          // Glass
          glass: "rgba(255, 255, 255, 0.02)",
          "glass-elevated": "rgba(255, 255, 255, 0.03)",
        },
        
        /* ══════════════════════════════════════════════════════════════
           LEGACY PALETTES — For backward compatibility
           ══════════════════════════════════════════════════════════════ */
        couture: {
          silk: "#FDFCFB",
          "silk-warm": "#F5F4F2",
          "silk-pure": "#FFFFFF",
          jet: "#030303",
          "jet-soft": "#0A0A0A",
          "jet-muted": "#111111",
          gold: "#DCC7B0",
          "gold-light": "#E8D9C7",
          "gold-muted": "#B8A48F",
          text: "#FDFCFB",
          "text-secondary": "rgba(253, 252, 251, 0.6)",
          "text-muted": "rgba(253, 252, 251, 0.4)",
          "text-subtle": "rgba(253, 252, 251, 0.2)",
          border: "rgba(255, 255, 255, 0.05)",
          "border-hover": "rgba(255, 255, 255, 0.08)",
          "border-active": "rgba(220, 199, 176, 0.15)",
          success: "#5C8A6B",
          error: "#A65D66",
        },
        
        iwasp: {
          cream: "#FDFCFB",
          white: "#FDFCFB",
          midnight: "#030303",
          "midnight-elevated": "#0A0A0A",
          "midnight-surface": "#111111",
          gold: "#DCC7B0",
          "gold-light": "#E8D9C7",
          cyan: "#DCC7B0",
          "cyan-light": "#E8D9C7",
          "cyan-glow": "rgba(220, 199, 176, 0.08)",
          blue: "rgba(253, 252, 251, 0.4)",
          silver: "rgba(253, 252, 251, 0.6)",
          muted: "rgba(253, 252, 251, 0.4)",
          bronze: "#DCC7B0",
          "bronze-light": "#E8D9C7",
          titanium: "rgba(253, 252, 251, 0.6)",
          platinum: "#FDFCFB",
          emerald: "#FDFCFB",
          "emerald-glow": "rgba(253, 252, 251, 0.08)",
        },
        
        luxe: {
          void: "#030303",
          deep: "#000000",
          surface: "#0A0A0A",
          glow: "#111111",
          cyan: "#DCC7B0",
          "cyan-light": "#E8D9C7",
          "cyan-dark": "#B8A48F",
          blue: "rgba(253, 252, 251, 0.4)",
          silver: "rgba(253, 252, 251, 0.6)",
          mist: "rgba(253, 252, 251, 0.4)",
          white: "#FDFCFB",
          pure: "#FDFCFB",
        },
        
        carte: {
          recto: "#030303",
          verso: "#0A0A0A",
          texture: "#111111",
          logo: "#DCC7B0",
          texte: "#FDFCFB",
          secondaire: "rgba(253, 252, 251, 0.6)",
          accent: "#DCC7B0",
        },
        
        /* Legacy aliases */
        "deep-black": "#030303",
        "anthracite": "#0A0A0A",
        "anthracite-dark": "#111111",
        "anthracite-light": "rgba(220, 199, 176, 0.08)",
        "soft-gold": "#DCC7B0",
        "off-white": "#FDFCFB",
        "soft-gray": "rgba(253, 252, 251, 0.6)",
        "muted-gray": "rgba(253, 252, 251, 0.4)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        // OMNIA - Arrondis massifs
        xl: "1.5rem",
        "2xl": "2rem",
        "3xl": "3rem",
        "4xl": "4rem",
        "5xl": "5rem",
        "6xl": "6rem",
        full: "9999px",
        omnia: "4rem",
        "omnia-lg": "6rem",
      },
      letterSpacing: {
        tighter: "-0.02em",
        tight: "-0.01em",
        normal: "0em",
        wide: "0.1em",
        wider: "0.2em",
        widest: "0.3em",
        ultra: "0.5em",
        omnia: "0.15em",
      },
      transitionDuration: {
        fast: "400ms",
        normal: "800ms",
        slow: "1200ms",
        slower: "1800ms",
        silk: "1200ms",
        liquid: "1800ms",
        ethereal: "2400ms",
      },
      transitionTimingFunction: {
        silk: "cubic-bezier(0.22, 1, 0.36, 1)",
        liquid: "cubic-bezier(0.16, 1, 0.3, 1)",
        luxury: "cubic-bezier(0.22, 1, 0.36, 1)",
        iwasp: "cubic-bezier(0.22, 1, 0.36, 1)",
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
        "fade-in-slow": {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "shimmer": {
          "0%": { transform: "translateX(-100%) rotate(45deg)" },
          "100%": { transform: "translateX(100%) rotate(45deg)" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "0.6" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-10px) rotate(1deg)" },
        },
        "liquid-reveal": {
          "0%": { opacity: "0", transform: "translateY(40px) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 600ms cubic-bezier(0.22, 1, 0.36, 1)",
        "accordion-up": "accordion-up 600ms cubic-bezier(0.22, 1, 0.36, 1)",
        "fade-in": "fade-in-slow 1800ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-up": "fade-in-slow 1800ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "shimmer": "shimmer 3000ms cubic-bezier(0.22, 1, 0.36, 1) infinite",
        "glow-pulse": "glow-pulse 4000ms cubic-bezier(0.16, 1, 0.3, 1) infinite",
        "float": "float 6000ms cubic-bezier(0.16, 1, 0.3, 1) infinite",
        "liquid-reveal": "liquid-reveal 1800ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-omnia': 'linear-gradient(180deg, #030303 0%, #000000 100%)',
        'gradient-champagne': 'radial-gradient(ellipse at center, rgba(220, 199, 176, 0.03) 0%, transparent 70%)',
        'gradient-hero': 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(220, 199, 176, 0.08) 0%, transparent 50%)',
        'gradient-glow': 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(220, 199, 176, 0.05) 0%, transparent 70%)',
      },
      boxShadow: {
        'glass': '0 4px 40px rgba(0, 0, 0, 0.4)',
        'elevated': '0 20px 80px rgba(0, 0, 0, 0.6)',
        'glow-champagne': '0 0 80px rgba(220, 199, 176, 0.08)',
        'glow-champagne-intense': '0 0 120px rgba(220, 199, 176, 0.15)',
        'omnia-card': '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 80px rgba(220, 199, 176, 0.08)',
      },
      backdropBlur: {
        omnia: "50px",
        silk: "30px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
