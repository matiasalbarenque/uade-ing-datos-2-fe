import { nextui } from '@nextui-org/theme';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}', './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'],
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
  plugins: [nextui()],
};
