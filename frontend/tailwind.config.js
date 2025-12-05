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
        primary: "#6366f1",      // Refined Indigo - professional yet vibrant
        secondary: "#ec4899",    // Rose Pink - elegant accent
        accent: "#8b5cf6",       // Rich Purple - depth and sophistication
        success: "#10b981",      // Emerald - clear positive feedback
        danger: "#ef4444",       // Coral Red - attention without aggression
        warning: "#f59e0b",      // Warm Amber
        info: "#3b82f6",         // Clear Blue
        background: {
          DEFAULT: "#f8fafc",    // Soft white with blue undertone
          dark: "#0f172a",       // Deep slate - professional dark mode
        },
        surface: {
          DEFAULT: "#ffffff",    // Pure white for cards
          dark: "#1e293b",       // Elevated dark surfaces
        },
        text: {
          DEFAULT: "#0f172a",    // Rich slate for readability
          dark: "#f1f5f9",       // Soft white for dark mode
        },
        muted: {
          DEFAULT: "#64748b",    // Balanced slate
          dark: "#94a3b8",       // Light slate for dark mode
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
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
