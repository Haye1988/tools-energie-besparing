import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Totaaladvies Brand Colors
        totaaladvies: {
          orange: "#FF7A00", // Primary CTA
          "orange-dark": "#E66A00",
          "orange-light": "#FF9933",
          blue: "#002542", // Dark blue - text, headers
          "blue-light": "#0BA9F3", // Light blue - accents, links
          "blue-lighter": "#4DC3F7",
          red: "#CC3366", // Secondary CTA
          "red-dark": "#B82A5A",
          gray: {
            light: "#F4F4F4",
            medium: "#69727D",
            dark: "#33373D",
          },
        },
        primary: {
          DEFAULT: "#FF7A00",
          50: "#FFF4E6",
          100: "#FFE9CC",
          200: "#FFD399",
          300: "#FFBD66",
          400: "#FFA733",
          500: "#FF7A00",
          600: "#E66A00",
          700: "#CC5A00",
          800: "#B34A00",
          900: "#993A00",
        },
        success: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
        },
      },
      borderRadius: {
        "card": "18px",
        "input": "12px",
        "button": "9999px",
      },
      boxShadow: {
        "card": "0 4px 8px -2px rgba(0, 0, 0, 0.06), 0 2px 4px -1px rgba(0, 0, 0, 0.04)",
        "card-hover": "0 8px 16px -4px rgba(0, 0, 0, 0.1), 0 4px 8px -2px rgba(0, 0, 0, 0.06)",
        "button": "0 2px 4px rgba(255, 122, 0, 0.2)",
        "button-hover": "0 4px 8px rgba(255, 122, 0, 0.3)",
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #0BA9F3 0%, #FFFFFF 100%)",
        "gradient-card-success": "linear-gradient(135deg, #dcfce7 0%, #f0fdf4 100%)",
        "gradient-card-warning": "linear-gradient(135deg, #FEF3C7 0%, #FFFBEB 100%)",
        "gradient-card-info": "linear-gradient(135deg, #DBEAFE 0%, #EFF6FF 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in",
        "slide-up": "slideUp 0.3s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "scale-in": "scaleIn 0.2s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      maxWidth: {
        "container": "1280px",
      },
    },
  },
  plugins: [],
};
export default config;

