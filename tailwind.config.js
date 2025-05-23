import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  variants: {
    extend: {
      textOpacity: ['dark']
    }
  },
  theme: {
    extend: {},
  },
  plugins: [tailwindcss(),],
});
