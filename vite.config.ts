import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Serve from the repository subpath on GitHub Pages:
  // https://songyuan-henry-yan.github.io/Forest-Election-Festival/
  base: '/Forest-Election-Festival/',
});
