export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        manrope: ["Manrope", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#e052c4",
          50: "#fdf2fb",
          100: "#fae6f6",
          200: "#f5cdee",
          300: "#f0b4e5",
          400: "#e67cd4",
          500: "#e052c4",
          600: "#c43aa8",
          700: "#a42e8a",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
