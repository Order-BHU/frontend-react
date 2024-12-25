/** @type {import('tailwindcss').Config} */
import tailwindcssAnimate from "tailwindcss-animate";
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        "orange-light": "hsl(38, 100%, 85%)",
        "orange-dark": "hsl(38, 100%, 55%)",
        "cbg-dark": "hsl(20, 14.3%, 4.1%)",
        "cbg-darkaccent": "hsl(20, 14.3%, 10%)",
        "cfont-dark": "rgba(156, 163, 175)",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
