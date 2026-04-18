/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  root: __dirname,

  plugins: [react()],

  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../../shared/src'),
    },
  },

  server: {
    port: 4201,
  },

  preview: {
    port: 4201,
  },

  build: {
    outDir: path.resolve(__dirname, '../../dist/apps/store'),
    emptyOutDir: true,
  },
});
