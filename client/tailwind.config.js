/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        Primary: "#08D9D6",
        Secondary: "#252A34",
        Tertiary: "#FF2E63",
        Quaternary: "#EAEAEA",
        LandingBg: "#395B64",
        hoverBg: "#2E333F",
      },
    },
  },

  plugins: [],
};
