/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('@spartan-ng/ui-core/hlm-tailwind-preset')],
  content: [
    './src/**/*.{html,ts}',
    './spartan-library/**/*.{html,ts}',
  ],
  theme: {
    extend: {
      colors: {
        // Color primario
        primary: {
          50:  '#eefffc',
          100: '#c3fffa',
          200: '#88fff6',
          300: '#44fff1',
          400: '#0cedde', // Color por defecto
          500: '#00d6cb',
          600: '#00ada6',
          700: '#008986',
          800: '#036c6b',
          900: '#085958',
          950: '#003537'
        },
        // Color primario
        secondary: {
          50:  '#f7f6fc',
          100: '#f1eef9',
          200: '#e5dff5',
          300: '#d0c5ed',
          400: '#b8a3e2', // Color por defecto
          500: '#9f7ed4',
          600: '#8c5ec5',
          700: '#7d4fb2',
          800: '#694196',
          900: '#57377b',
          950: '#372253'
        },
      }
    },
  },
  plugins: [],
  darkMode: 'class'
}

