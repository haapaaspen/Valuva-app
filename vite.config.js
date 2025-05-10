import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

export default defineConfig({
  base: './',
  plugins: [svelte()],
  server: {
    fs: {
      allow: ['..']
    }
  },
  resolve: {
    alias: {
      '$lib': path.resolve('./src/lib'),
      '$components': path.resolve('./src/components')
    }
  },
  build: {
    outDir: 'build',
    rollupOptions: {
      input: {
        index: path.resolve('./src/app.html'),
      },
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    },
    minify: false,
    emptyOutDir: true
  }
}); 