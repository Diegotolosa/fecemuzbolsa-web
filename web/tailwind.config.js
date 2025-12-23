/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--fecemuz-primary)",
        accent: "var(--fecemuz-accent)",
        bg: "var(--fecemuz-bg)",
        text: "var(--fecemuz-text)",
      },
    },
  },
  plugins: [],
};


