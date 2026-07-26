import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // SISA.ing brand palette — deep blue tech theme
        sisa: {
          navy: "#0A1E3C", // primary dark — header, footer, sidebar
          "navy-2": "#1E2F4D", // card background
          bg: "#F0F4F9", // page background
          brand: "#0078D4", // buttons, links, brand
          glow: "#00A3FF", // data highlights, glow borders
          critical: "#D13438", // high severity, urgent
          warning: "#FFB900", // medium severity
          safe: "#107C10", // patched, hardened
          ink: "#1E1E1E", // primary text
          muted: "#5A5A5A", // secondary text
        },
      },
      fontFamily: {
        sans: ["var(--font-sisa)", "system-ui", "Segoe UI", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(0,163,255,0.5), 0 0 18px rgba(0,163,255,0.25)",
        card: "0 1px 3px rgba(10,30,60,0.08), 0 8px 24px rgba(10,30,60,0.06)",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 0 1px rgba(0,163,255,0.5), 0 0 12px rgba(0,163,255,0.2)" },
          "50%": { boxShadow: "0 0 0 1px rgba(0,163,255,0.8), 0 0 22px rgba(0,163,255,0.45)" },
        },
        fadeIn: {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        pulseGlow: "pulseGlow 2.4s ease-in-out infinite",
        fadeIn: "fadeIn 0.4s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
