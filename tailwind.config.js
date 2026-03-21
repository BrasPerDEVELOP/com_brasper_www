/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primarios
        primary: '#01e8fc',
        'primary-hover': '#066ac9',
        'primary-ios': '#007aff',
        'primary-tailwind': '#3b82f6',
        // Secundarios
        secondary: '#4a52d8',
        'blue-medium': '#4484f3',
        'success-teal': '#5ED6B3',
        lime: '#e6ff00',
        purple: '#A386FF',
        'purple-dark': '#4A52D8',
        // Navegacion
        'icon-navbar': '#d7e6ff00',
        // Tokens base del theme (derivados de CSS vars)
        base: '#737683',
        heading: '#1b1f2e',
        lighter: '#f7f7f9',
        // Texto
        'on-surface': '#1b1f2e',
        'text-secondary': '#555555',
        'text-muted': '#666666',
        // Errores
        error: '#dc3545',
        'error-alt': '#f44336',
        // Fondos
        surface: '#f9f9f9',
        'surface-alt': '#f3f4f6',
        'dark-bg': '#232b4d',
        'dark-bg-alt': '#0F123E',
        'dark-bg-alt2': '#1c284c',
        // Utilidad
        disabled: '#d9d9d9',
      },
    },
  },
  plugins: [],
}
