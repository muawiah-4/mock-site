import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        steel: {
          50: "#f4f5f6",
          100: "#e8eaeb",
          200: "#d6d9db",
          300: "#c2c6c8",
          400: "#a6abaf",
          500: "#888e92",
          600: "#6b7276",
          700: "#53585c",
          800: "#3a3e41",
          900: "#232527",
        },
        navy: {
          50: "#eaf1f8",
          100: "#cfe0ee",
          200: "#9ec0dd",
          300: "#5f92bd",
          400: "#2f6699",
          500: "#1c3f5e",
          600: "#15324c",
          700: "#0f253a",
          800: "#0a1a29",
          900: "#060f18",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "SF Pro Text",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      letterSpacing: {
        tightest: "-0.05em",
      },
    },
  },
  plugins: [],
};

export default config;
