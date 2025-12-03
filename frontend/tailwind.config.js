/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: "#6366f1", // Vibrant Indigo
        secondary: "#ec4899", // Hot Pink
        accent: "#f59e0b", // Amber
        success: "#10b981", // Emerald
        danger: "#ef4444", // Red
        warning: "#f59e0b", // Amber
        info: "#3b82f6", // Blue
        background: {
          DEFAULT: "#fafafa", // Very Light Gray
          dark: "#0a0a0a", // Almost Black
        },
        surface: {
          DEFAULT: "#f5f5f5", // Light Gray
          dark: "#1a1a1a", // Dark Gray
        },
        text: {
          DEFAULT: "#1f2937", // Dark Gray
          dark: "#f9fafb", // Very Light Gray
        },
        muted: {
          DEFAULT: "#6b7280", // Medium Gray
          dark: "#9ca3af", // Light Gray
        },
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
        'bounce-slow': 'bounce 3s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      },
      boxShadow: {
        'neon': '0 0 5px theme("colors.primary"), 0 0 20px theme("colors.primary")',
        'neon-pink': '0 0 5px theme("colors.secondary"), 0 0 20px theme("colors.secondary")',
        'neon-amber': '0 0 5px theme("colors.accent"), 0 0 20px theme("colors.accent")',
      }
    },
  },
  plugins: [],
}
