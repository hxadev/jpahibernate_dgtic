/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        sidebar: '#0f172a',
        primary: {
          DEFAULT: '#2563eb',
          hover: '#1d4ed8',
        },
        success: '#059669',
        warning: '#f59e0b',
        danger: '#dc2626',
        accent: '#ea580c',
      },
      borderRadius: {
        card: '12px',
      },
    },
  },
  plugins: [],
};
