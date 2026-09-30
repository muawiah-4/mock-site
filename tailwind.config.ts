import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Dark section surfaces — values live in app/globals.css as RGB
        // channels so opacity modifiers work (e.g. bg-dark/90).
        dark: {
          DEFAULT: "rgb(var(--bg-dark) / <alpha-value>)",
          2: "rgb(var(--bg-dark-2) / <alpha-value>)",
        },
      },
      boxShadow: {
        // Photo / media blocks resting on the light page.
        media: "0 30px 80px -40px rgba(20, 23, 26, 0.45)",
        // Floating surfaces: dropdowns, glass panels, story cards.
        float: "0 24px 60px -24px rgba(20, 23, 26, 0.35)",
        // Hover lift on product cards; also the mobile menu sheet.
        lift: "0 30px 70px -30px rgba(20, 23, 26, 0.35)",
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
