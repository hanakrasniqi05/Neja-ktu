module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false,
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        'very-light-blue': '#90E0EF',
        'light-blue': '#48CAE4',
        'teal-blue': '#00B4D8',
        'blue': '#0096C7',
        'dark-blue': '#023E8A',
        'very-dark-blue': '#02002c',

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
        fadeIn: 'fadeIn 1s ease-in-out',
        float: 'float 6s ease-in-out infinite',
        'fade-up': 'fadeUp 0.5s ease-out forwards',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
