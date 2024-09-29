import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
  },
});
