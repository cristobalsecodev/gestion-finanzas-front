/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,ts,scss}'
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
        // Color secundario
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
        themeMode: {
          50:  '#f4f5f7',
          100: '#e4e5e9',
          200: '#cbcdd6',
          300: '#a7aab9',
          400: '#7b7f95',
          500: '#60637a',
          600: '#525468',
          700: '#474957',
          800: '#3f3f4b',
          900: '#383941',
          950: '#09090b'
        }
      }
    },
  },
  plugins: [],
  darkMode: 'class'
}

