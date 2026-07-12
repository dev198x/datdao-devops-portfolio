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
        // GitHub Light-inspired palette. Note: the "neutral" scale below does NOT follow
        // the usual 50=lightest/950=darkest Tailwind convention — each step is pinned to
        // preserve the semantic role components already reference (e.g. text-neutral-200
        // is the primary body-text color, border-neutral-700 is the default card border),
        // so no component class names had to change when flipping from dark to light.
        primary: {
          50: '#DAFBE1',
          100: '#ACEEBB',
          500: '#1F883D',
          700: '#1A7F37',
          900: '#116329',
          DEFAULT: '#1F883D',
        },
        accent: {
          500: '#0969DA',
          700: '#0550AE',
          DEFAULT: '#0969DA',
        },
        neutral: {
          50: '#F6F8FA',
          100: '#EAEEF2',
          200: '#1F2328',
          300: '#32383F',
          400: '#57606A',
          500: '#6E7781',
          600: '#8B949E',
          700: '#D0D7DE',
          800: '#EAEEF2',
          900: '#F6F8FA',
          950: '#FFFFFF',
        },
        bg: {
          page: '#FFFFFF',
          surface: '#F6F8FA',
          elevated: '#FFFFFF',
        },
        // Blog and Case Studies components hardcode Tailwind's built-in gray/green scales
        // directly (bg-gray-900, text-green-400, etc.) instead of the custom tokens above.
        // Overriding those built-ins here recolors those pages without touching every class
        // in EnhancedBlog.tsx / EnhancedCaseStudies.tsx. Same "semantic role over numeric
        // lightness order" approach as the neutral scale above.
        gray: {
          50: '#F6F8FA',
          100: '#EAEEF2',
          200: '#D0D7DE',
          300: '#1F2328',
          400: '#57606A',
          500: '#6E7781',
          600: '#8B949E',
          700: '#D0D7DE',
          800: '#EAEEF2',
          900: '#FFFFFF',
        },
        green: {
          200: '#1A7F37',
          300: '#3FB950',
          400: '#2DA44E',
          500: '#1F883D',
          600: '#1A7F37',
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
        md: '8px',
        lg: '12px',
        xl: '16px',
        DEFAULT: '8px',
      },
      boxShadow: {
        sm: '0 1px 0 rgba(31, 35, 40, 0.04)',
        card: '0 1px 3px rgba(31, 35, 40, 0.12), 0 1px 2px rgba(31, 35, 40, 0.08)',
        'card-hover': '0 4px 12px rgba(31, 35, 40, 0.15)',
        modal: '0 12px 28px rgba(31, 35, 40, 0.2)',
        glow: '0 0 0 3px rgba(9, 105, 218, 0.15)',
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
