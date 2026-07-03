import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";
import typography from "@tailwindcss/typography";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./sanity/**/*.{js,ts,jsx,tsx,mdx}", // Common if you are using Sanity CMS, safe to leave in
  ],
  theme: {
    extend: {
      screens: {
        // Enforcing your exact pixel thresholds
        'xxs': '350px',
        'xs': '550px',
        'md': '768px',
        'desk': '1020px',
        'lg': '1024px',
        'xl': '1280px',
        'wide': '1600px',
      },
      colors: {
        primary: {
          "100": "#cc2221", // Dark burgundy
          "200": "#FAE2EA", // Dark burgundy
          DEFAULT: "#fb161b", // PitchMark Cherry Red
        },
        secondary: {
          DEFAULT: "#FBE843", // Yellow
        },
        black: {
          "100": "#0f172a", // Lighter charcoal (Cards, UI elements in dark mode)
          "200": "#222222", // Borders and dividers
          "300": "#888888", // Muted text for descriptions
          DEFAULT: "#0B1325", // True rich black
        },
        white: {
          "100": "#F9F6EE", // A true warm ivory tone
          DEFAULT: "#FFFFFF", // Pure white for cards and headings
        },
      },
      maxWidth: {
        
        "7.5xl": "85rem", // 1360px
        "8xl": "90rem", // 1440px (Premium desktop width)
        "9xl": "95rem", // 1520px (Ultra-wide desktop width)
        "10xl": "100rem", // 1600px (Extra-wide desktop width)
        "11xl": "105rem", // 1680px (Even wider desktop width)
        "12xl": "110rem", // 1760px (Even wider desktop width)
        "13xl": "115rem", // 1840px (Even wider desktop width)
      },
      fontFamily: {
        "work-sans": ["var(--font-work-sans)", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        100: "2px 2px 0px 0px rgb(0, 0, 0)",
        200: "2px 2px 0px 2px rgb(0, 0, 0)",
        300: "2px 2px 0px 2px rgb(204, 34, 33)", // Updated to match the new #cc2221
      },
    },
  },
  plugins: [animate, typography],
};

export default config;
