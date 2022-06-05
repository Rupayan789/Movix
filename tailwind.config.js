module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "regal-dark":
          "linear-gradient(90deg, rgba(56,59,69,1) 0%, rgba(1,4,15,1) 100%)",
        "regal-violet":
          "linear-gradient(73deg, rgba(59,7,41,1) 0%, rgba(40,16,98,1) 100%)",
          "regal-blue":"linear-gradient(73deg, rgba(16,170,176,1) 0%, rgba(87,32,219,1) 100%)"
      },
      colors: {
        "light-dark": "#545862",
        "bee-dark":"#281062"
      },
    },
  },
  plugins: [],
};
