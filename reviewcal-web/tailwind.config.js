/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#101827",
          900: "#162238",
          800: "#1e3354",
          700: "#26476f"
        },
        amberSearch: "#f6a400"
      },
      boxShadow: {
        soft: "0 16px 40px rgba(16, 24, 39, 0.08)"
      }
    }
  },
  plugins: []
};
