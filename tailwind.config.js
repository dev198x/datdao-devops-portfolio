/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
        sans: ['Inter', '-apple-system', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Flat, professional palette: slate neutrals + a single navy-blue accent.
        // Note: the "neutral" scale does NOT follow the usual 50=lightest/950=darkest
        // Tailwind convention. Each step is pinned to a semantic role components already
        // reference (text-neutral-200 = primary body text, border-neutral-700 = default
        // border, text-neutral-400 = secondary text), so class names did not need to change.
        primary: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          400: '#1E40AF',
          500: '#1D4ED8',
          700: '#1E40AF',
          900: '#1E3A8A',
          DEFAULT: '#1D4ED8',
        },
        accent: {
          500: '#1D4ED8',
          700: '#1E40AF',
          DEFAULT: '#1D4ED8',
        },
        neutral: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#0F172A',
          300: '#334155',
          400: '#475569',
          500: '#64748B',
          600: '#CBD5E1',
          700: '#E2E8F0',
          800: '#F1F5F9',
          900: '#F8FAFC',
          950: '#FFFFFF',
        },
        bg: {
          page: '#FFFFFF',
          surface: '#F8FAFC',
          elevated: '#FFFFFF',
        },
        // Blog components hardcode Tailwind's built-in gray/green scales directly
        // (bg-gray-900, text-green-400, ...). Overriding them here recolors those pages
        // without touching every class. Same "semantic role over lightness order" approach.
        gray: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#0F172A',
          400: '#475569',
          500: '#64748B',
          600: '#94A3B8',
          700: '#E2E8F0',
          800: '#F1F5F9',
          900: '#FFFFFF',
        },
        green: {
          200: '#1E40AF',
          300: '#3B82F6',
          400: '#1D4ED8',
          500: '#1D4ED8',
          600: '#1E40AF',
        },
      },
      spacing: {
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        6: '24px',
        8: '32px',
        12: '48px',
        16: '64px',
        24: '96px',
        32: '128px',
      },
      borderRadius: {
        sm: '4px',
        md: '6px',
        lg: '8px',
        xl: '8px',
        '2xl': '10px',
        DEFAULT: '6px',
      },
      // Flat design: no elevation. Tokens are kept (so existing classes still resolve) but
      // render as nothing; separation comes from 1px borders and spacing.
      boxShadow: {
        sm: 'none',
        card: 'none',
        'card-hover': 'none',
        modal: '0 8px 24px rgba(15, 23, 42, 0.12)',
        glow: 'none',
      },
      keyframes: {
        'typewriter': {
          from: { width: '0' },
          to: { width: '100%' },
        },
        'blink': {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        },
        'glitch': {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        },
        'scanline': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
      },
      animation: {
        'typewriter': 'typewriter 2s steps(40, end)',
        'blink': 'blink 1s infinite',
        'glitch': 'glitch 0.3s ease-in-out',
        'scanline': 'scanline 8s linear infinite',
      },
    },
  },
  plugins: [],
}
