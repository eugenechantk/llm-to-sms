/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './common/components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    fontFamily: {
      'sans': ['"Work Sans"', ...defaultTheme.fontFamily.sans],
    },
    extend: {
      fontFamily: {
        'numeric': ['"DM Mono"', ...defaultTheme.fontFamily.mono],
        'satoshi': ['Satoshi', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        'theme' : {
          5: '#0C0C0C',
          15: '#262626',
          20: '#333333',
          25: '#404040', 
          35: '#595959',
          45: '#737272',
          55: '#8D8C8C',
          65: '#A6A6A6',
          75: '#BFBFBF',
          85: '#D9D9D9',
          90: '#E5E5E5',
          95: '#F2F2F2',
        },
        'accent' : {
          60: '#D5E151',
        },
        'warning' : {
          'bg': "rgba(247,13,13, 0.2)",
          'border': "rgba(247,13,13, 0.06)",
          'text': "#F75252",
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
