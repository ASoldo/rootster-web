/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {},
      backgroundColor: {
        "black-80": "rgba(0, 0, 0, 0.8)",
        primary: "#1e90ff",
      },
    },
  },
  plugins: [],
};
