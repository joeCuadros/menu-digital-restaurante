/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#241F1B',
        paper: '#FFFFFF',
        stone: {
          DEFAULT: '#EDE7DD',
          light: '#F6F3EC',
        },
        mustard: {
          50: '#FDF6E3',
          200: '#F3D98B',
          400: '#E3A008',
          500: '#C88A06',
          600: '#9C6C05',
        },
        rocoto: {
          50: '#FBEAE7',
          400: '#C24B3C',
          500: '#B23A2E',
          600: '#8E2E24',
        },
        sage: {
          50: '#EAF1EC',
          400: '#5D9271',
          500: '#4C7A5D',
          600: '#3B5F49',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(36, 31, 27, 0.06), 0 6px 16px rgba(36, 31, 27, 0.08)',
      },
    },
  },
  plugins: [],
}
