/** @type {import("tailwindcss").Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "var(--salic-primary)",
        primary2: "var(--salic-primary2)",
        secondary: "var(--salic-secondary)",
        success: "var(--salic-success)",
        "success-light": "var(--salic-success-light)",
        danger: "var(--salic-danger)",
        warning: "var(--salic-warning)",
        info: "var(--salic-info)",
        "info-light": "var(--salic-info-light)",
        light: "var(--salic-light-100)",
        dark: {
          100: "var(--salic-dark-100)",
          200: "var(--salic-dark-200)",
          300: "var(--salic-dark-300)",
        }
      },
      borderRadius: {
        DEFAULT: "6px",
      },
      borderColor: {
        DEFAULT: "#f0f0f0",
      },
      variants: {  
        borderColor: ['responsive', 'hover', 'focus', 'dark']
      },
      fontFamily: "Inter, Bahij, Arial, Roboto, sans-serif",
      fontSize: {
        xxs: ".65rem",
      }
    },
  },
  plugins: [],
}