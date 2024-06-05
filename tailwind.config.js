/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    fontFamily: {
      'open-sans': ['"Open Sans"'],
    },
    extend: {
      backgroundImage: {
        pattern: "url('/img/pattern.webp')",
      },
    },
  },
  plugins: [],
};
