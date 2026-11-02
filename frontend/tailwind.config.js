/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        // Montserrat has no Telugu/Tamil glyphs; the browser falls back per-character to Noto.
        sans: ['Montserrat', '"Noto Sans Telugu"', '"Noto Sans Tamil"', 'system-ui', 'sans-serif'],
      },
      colors: {
        surface: '#F3F7FA',
        navy: {
          50: '#EEF3F8', 100: '#D9E3EE', 200: '#B3C6DA', 600: '#1F4A75',
          700: '#143A60', 800: '#0F2F4F', 900: '#0B2540',
        },
        teal: {
          50: '#E8F7F6', 100: '#C8EDEA', 500: '#14A19A', 600: '#0E8680', 700: '#0B6B67',
        },
        // Score colours: lower = ok (green), intermediate = mid (amber), higher = high (red)
        ok:   { DEFAULT: '#15803D', soft: '#ECFDF3', border: '#B8EBCB' },
        mid:  { DEFAULT: '#B45309', soft: '#FFF7E6', border: '#FAD9A0', ring: '#F59E0B' },
        high: { DEFAULT: '#B91C1C', soft: '#FEF2F2', border: '#F9C6C6', ring: '#DC2626' },
      },
      boxShadow: {
        card: '0 12px 32px -14px rgba(11, 37, 64, 0.22), 0 2px 6px -2px rgba(11, 37, 64, 0.06)',
        btn: '0 3px 0 0 #07182a, 0 10px 18px -8px rgba(11, 37, 64, 0.45)',
        'btn-pressed': '0 1px 0 0 #07182a, 0 4px 8px -4px rgba(11, 37, 64, 0.4)',
      },
      keyframes: {
        'step-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: { 'step-in': 'step-in 280ms ease-out both' },
    },
  },
  plugins: [],
};
