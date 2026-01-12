import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"], // Theme fixe - Haute Couture light
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
        display: ['DM Sans', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        body: ['DM Sans', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        accent: ['Cormorant Garamond', 'Georgia', 'serif'],
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['DM Sans', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
      },
      colors: {
        /* ═══════════════════════════════════════════════════════════════
           i-WASP DESIGN SYSTEM — HAUTE COUTURE DIGITALE
           Quiet Luxury — Silk, Jet Black, Sanded Gold
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
           PALETTE HAUTE COUTURE
           ══════════════════════════════════════════════════════════════ */
        couture: {
          /* Silk - Warm whites */
          silk: "#FBFBFA",
          "silk-warm": "#F8F7F4",
          "silk-pure": "#FFFFFF",
          
          /* Jet Black */
          jet: "#080808",
          "jet-soft": "#1A1A1A",
          "jet-muted": "#2D2D2D",
          
          /* Sanded Gold - Matte, not shiny */
          gold: "#AF8E56",
          "gold-light": "#C4A672",
          "gold-muted": "#D4C4A8",
          
          /* Text hierarchy */
          text: "#080808",
          "text-secondary": "#5A5A58",
          "text-muted": "#9A9A98",
          "text-subtle": "#BDBDBB",
          
          /* Borders */
          border: "rgba(8, 8, 8, 0.06)",
          "border-hover": "rgba(8, 8, 8, 0.12)",
          "border-active": "rgba(175, 142, 86, 0.4)",
          
          /* Status */
          success: "#4A7C59",
          error: "#8B4049",
        },
        
        /* ══════════════════════════════════════════════════════════════
           IWASP PALETTE — Mapped to Haute Couture
           ══════════════════════════════════════════════════════════════ */
        iwasp: {
          cream: "#FBFBFA",
          white: "#FFFFFF",
          midnight: "#080808",
          "midnight-elevated": "#1A1A1A",
          "midnight-surface": "#2D2D2D",
          
          /* Gold accent */
          gold: "#AF8E56",
          "gold-light": "#C4A672",
          cyan: "#AF8E56",
          "cyan-light": "#C4A672",
          "cyan-glow": "#D4C4A8",
          blue: "#5A5A58",
          
          silver: "#5A5A58",
          muted: "#9A9A98",
          
          /* Legacy compatibility */
          bronze: "#AF8E56",
          "bronze-light": "#C4A672",
          titanium: "#5A5A58",
          platinum: "#FBFBFA",
          emerald: "#F8F7F4",
          "emerald-glow": "#FBFBFA",
        },
        
        /* ══════════════════════════════════════════════════════════════
           LUXE PALETTE — Mapped to Haute Couture
           ══════════════════════════════════════════════════════════════ */
        luxe: {
          void: "#FBFBFA",
          deep: "#F8F7F4",
          surface: "#FFFFFF",
          glow: "#F5F5F3",
          cyan: "#AF8E56",
          "cyan-light": "#C4A672",
          "cyan-dark": "#8A7345",
          blue: "#5A5A58",
          silver: "#5A5A58",
          mist: "#9A9A98",
          white: "#080808",
          pure: "#080808",
        },
        
        /* ══════════════════════════════════════════════════════════════
           CARTE NFC PALETTE
           ══════════════════════════════════════════════════════════════ */
        carte: {
          recto: "#FBFBFA",
          verso: "#F8F7F4",
          texture: "#FFFFFF",
          logo: "#080808",
          texte: "#080808",
          secondaire: "#5A5A58",
          accent: "#AF8E56",
        },
        
        /* Legacy aliases */
        "deep-black": "#080808",
        "anthracite": "#1A1A1A",
        "anthracite-dark": "#2D2D2D",
        "anthracite-light": "rgba(175, 142, 86, 0.08)",
        "soft-gold": "#AF8E56",
        "off-white": "#FBFBFA",
        "soft-gray": "#5A5A58",
        "muted-gray": "#9A9A98",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "0px",        /* Angles droits */
        "2xl": "0px",
        "3xl": "0px",
        "4xl": "0px",
        full: "0px",      /* Pas de pill shape */
      },
      letterSpacing: {
        tighter: "-0.02em",
        tight: "-0.01em",
        normal: "0.02em",
        wide: "0.15em",
        wider: "0.25em",
        widest: "0.35em",
        ultra: "0.5em",
      },
      transitionDuration: {
        fast: "600ms",
        normal: "1000ms",
        slow: "1500ms",
        slower: "2000ms",
      },
      transitionTimingFunction: {
        "iwasp": "cubic-bezier(0.22, 1, 0.36, 1)",
        "luxury": "cubic-bezier(0.22, 1, 0.36, 1)",
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
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "shimmer": {
          "0%": { transform: "translateX(-100%) rotate(45deg)" },
          "100%": { transform: "translateX(100%) rotate(45deg)" },
        },
        "hex-rotate": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(180deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 600ms cubic-bezier(0.22, 1, 0.36, 1)",
        "accordion-up": "accordion-up 600ms cubic-bezier(0.22, 1, 0.36, 1)",
        "fade-in": "fade-in-slow 1500ms cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "fade-up": "fade-in-slow 1500ms cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "shimmer": "shimmer 2000ms cubic-bezier(0.22, 1, 0.36, 1)",
        "hex-rotate": "hex-rotate 800ms cubic-bezier(0.22, 1, 0.36, 1) forwards",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-iwasp': 'linear-gradient(135deg, #AF8E56, #C4A672)',
      },
      boxShadow: {
        'glass': '0 2px 12px rgba(8, 8, 8, 0.03)',
        'elevated': '0 8px 32px rgba(8, 8, 8, 0.05)',
        'iwasp': '0 4px 20px rgba(175, 142, 86, 0.1)',
        'gold-subtle': '0 0 30px rgba(175, 142, 86, 0.08)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
