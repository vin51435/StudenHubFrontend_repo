import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@src': '/src',
      '@styles': '/src/assets/styles',
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@styles/scss.import.scss" as *;`,
      },
    },
  },
  server: {
    port: 3000,
  },
  esbuild: {
    loader: 'tsx',
  },
});
