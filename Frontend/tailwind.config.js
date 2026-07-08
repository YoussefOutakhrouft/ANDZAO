// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1E4620",
        secondary: "#8B5A2B",
        background: "#FAFAF5",
        surface: "#F5F5F5",
        accent: "#6E473B"
      }
    }
  },
  plugins: []
};
