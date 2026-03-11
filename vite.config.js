import { defineConfig } from 'vite';

export default defineConfig({
  base: '/3js/',
  build: {
    outDir: 'docs',
    emptyOutDir: true,
  },
});
