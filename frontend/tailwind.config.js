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
        /* Chhaap Creatives Brand Colors */
        brand: {
          50: '#fdf6f0',
          100: '#f9e8d8',
          200: '#f2ceaf',
          300: '#e9ad7e',
          400: '#df864d',
          500: '#d4692e',
          600: '#c45320',
          700: '#a23f1c',
          800: '#83341e',
          900: '#6b2d1c',
          950: '#3a140c',
        },
        brown: {
          50: '#faf6f3',
          100: '#f0e6dd',
          200: '#e0ccbb',
          300: '#cdab91',
          400: '#ba8a6b',
          500: '#ad7454',
          600: '#9f6248',
          700: '#84503d',
          800: '#6c4236',
          900: '#5c3930',
          950: '#2e1b16',
        },
        surface: {
          light: '#f5f0eb',
          DEFAULT: '#e8e0d8',
          dark: '#1a1412',
        },
        neutral: {
          light: '#f8f6f4',
          DEFAULT: '#e0e0e0',
          dark: '#121010',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'glass-light': 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 100%)',
        'glass-dark': 'linear-gradient(135deg, rgba(26,20,18,0.7) 0%, rgba(26,20,18,0.3) 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.08)',
        'glass-lg': '0 12px 48px rgba(0, 0, 0, 0.12)',
        'glass-dark': '0 8px 32px rgba(0, 0, 0, 0.3)',
        'soft': '0 2px 15px rgba(0, 0, 0, 0.05)',
        'soft-lg': '0 4px 25px rgba(0, 0, 0, 0.08)',
      },
      backdropBlur: {
        'glass': '20px',
        'glass-lg': '40px',
      },
      borderRadius: {
        'glass': '16px',
        'glass-lg': '24px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'slide-down': 'slideDown 0.3s ease-out forwards',
        'scale-in': 'scaleIn 0.3s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};