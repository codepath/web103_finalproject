import defaultTheme from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        // Design system swatches
        primary: '#46FF6F',
        'primary-light': '#F1FFE2',
        black: '#000000',
        dark: '#1C1C1C',
        white: '#FFFFFF',
        surface: '#EFF4F5',
        card: '#EDEDED',
        secondary: '#A6A6A6',
        tertiary: '#898989',
        muted: '#939393',
        disabled: '#7D7D7D',
        ui: {
          separator: '#D9D9D9',
          input: '#484848',
          'light-gray': '#F3F3F3',
        },
        accent: {
          green: '#E3FFE2',
          blue: '#E2FAFF',
          pink: '#FFE2EC',
          yellow: '#FFFEE2',
          red: '#FFE2E2',
          'blue-solid': '#399FFD',
        },
        // Dashboard dark-theme tokens (not in the official design system swatches)
        dashboard: '#1C1C1C',
        'dash-card': '#222327',
        dash: '#313131',
        'dash-sidebar': '#141414',
        'dash-input': '#2E3034',
        'dash-live': '#EF4444',
        'dash-neutral': '#3A3C42',
        'dash-away': '#218AF3',
        'dash-gold': '#FFD700',
      },
      fontSize: {
        // Design system type scale (Montserrat) — name matches the Figma layer name
        'display-lg': ['40px', { fontWeight: '400' }],
        'display-md': ['33px', { fontWeight: '500' }],
        'display-sm': ['30px', { fontWeight: '400' }],
        h1: ['30px', { fontWeight: '700' }],
        h2: ['20px', { fontWeight: '600' }],
        h3: ['20px', { fontWeight: '500' }],
        'body-lg': ['15px', { fontWeight: '400' }],
        'body-md': ['14px', { fontWeight: '400' }],
        caption: ['12px', { fontWeight: '400' }],
        overline: ['10px', { fontWeight: '500' }],
        tiny: ['8px', { fontWeight: '400' }],
      },
    },
  },
  plugins: [],
}
