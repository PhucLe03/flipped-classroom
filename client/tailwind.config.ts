import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#006199',        // Primary
          'blue-dark': '#004c78',
          'blue-light': '#8ACFF8',// Secondary
          yellow: '#FFD444',      // Accent
          'yellow-light': '#F4EB6C', // Supporting Accent
          'yellow-hover': '#e6bd35',
        },
      },
      fontFamily: {
        sans: ['var(--font-be-vietnam-pro)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
