module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        'very-light-blue': '#90E0EF',
        'light-blue': '#48CAE4',
        'teal-blue': '#00B4D8',
        'blue': '#0096C7',
        'dark-blue': '#023E8A',
      },
      keyframes: {
        gradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      animation: {
        gradient: 'gradient 8s linear infinite',
        bounce: 'bounce 1s infinite',
        'fade-up': 'fadeUp 0.5s ease-out forwards',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
