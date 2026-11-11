import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        // Black / Dark Neutrals
        black: {
          DEFAULT: "#000000",
          deep: "#08080A",
          surface: "#121215",
          border: "#242429",
          muted: "#8E8E93",
        },
        // White / Light Neutrals
        white: {
          DEFAULT: "#FFFFFF",
          pure: "#FFFFFF",
          off: "#F4F4F6",
        },
        // Brand Red & Crimson
        brand: {
          50: "#FEF2F2",
          100: "#FEE2E2",
          500: "#EF4444",
          600: "#DC2626", // Primary
          700: "#B91C1C",
          800: "#991B1B", // Crimson
          900: "#7F1D1D", // Dark butchery red
          950: "#450A0A",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
