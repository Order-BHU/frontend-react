/** @type {import('tailwindcss').Config} */
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
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
