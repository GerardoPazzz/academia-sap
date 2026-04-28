/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'void': '#0a0a0f',
        'surface': '#12121a',
        'surface-light': '#1a1a24',
        'neon-cyan': '#00f0ff',
        'neon-magenta': '#ff00aa',
        'neon-purple': '#8b5cf6',
        'text-primary': '#e0e0e0',
        'text-muted': '#6b7280',
      },
      fontFamily: {
        'display': ['Rajdhani', 'sans-serif'],
        'body': ['Space Grotesk', 'sans-serif'],
      },
      boxShadow: {
        'neon-cyan': '0 0 20px rgba(0, 240, 255, 0.3), 0 0 40px rgba(0, 240, 255, 0.1)',
        'neon-magenta': '0 0 20px rgba(255, 0, 170, 0.3), 0 0 40px rgba(255, 0, 170, 0.1)',
        'glow': '0 0 30px rgba(0, 240, 255, 0.4)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'gradient': 'gradient 8s ease infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        gradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
    },
  },
  plugins: [],
}
