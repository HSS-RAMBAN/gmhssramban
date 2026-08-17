/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#f6f7f9',
          100: '#eceef2',
          200: '#d5d9e1',
          300: '#b0b8c6',
          400: '#828ea3',
          500: '#5f6b80',
          600: '#475268',
          700: '#3a4356',
          800: '#323a4a',
          900: '#1f2533',
          950: '#131826',
        },
        brand: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
        saffron: {
          50: '#fdf6ed',
          100: '#fae8cf',
          200: '#f4cd97',
          300: '#eeae5e',
          400: '#e8903a',
          500: '#d9731e',
          600: '#bc5616',
          700: '#963f16',
          800: '#7a3418',
          900: '#622c17',
        },
        moss: {
          50: '#f1f6f1',
          100: '#e0ece1',
          200: '#c2d8c4',
          300: '#98bd9b',
          400: '#6c9a71',
          500: '#4c7d52',
          600: '#3a6440',
          700: '#305236',
          800: '#28422e',
          900: '#223829',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['"Fraunces"', 'Georgia', 'serif'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(46,16,101,0.04), 0 4px 16px rgba(46,16,101,0.06)',
        card: '0 1px 3px rgba(46,16,101,0.05), 0 8px 24px rgba(46,16,101,0.08)',
        lift: '0 2px 6px rgba(46,16,101,0.06), 0 16px 40px rgba(46,16,101,0.14)',
        glow: '0 0 40px rgba(139,92,246,0.15)',
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-down': {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fade-in 0.4s ease both',
        'scale-in': 'scale-in 0.3s cubic-bezier(0.22, 1, 0.36, 1) both',
        'slide-down': 'slide-down 0.25s ease both',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        'float-slow': 'float-slow 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
