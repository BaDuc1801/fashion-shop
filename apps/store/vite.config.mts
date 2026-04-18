/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(() => {
  const isVercel = process.env.VERCEL === '1';
  const root = isVercel ? path.resolve(__dirname) : import.meta.dirname;

  return {
    root,
    cacheDir: '../node_modules/.vite/store',
    resolve: {
      alias: {
        '@shared': path.resolve(root, '../../shared/src'),
      },
    },
    server: {
      port: 4201,
      host: 'localhost',
    },
    preview: {
      port: 4201,
      host: 'localhost',
    },
    plugins: [react()],
    build: {
      outDir: path.resolve(root, '../../dist/apps/store'),
      emptyOutDir: true,
      reportCompressedSize: true,
      commonjsOptions: {
        transformMixedEsModules: true,
      },
      rollupOptions: {
        external: ['react-router-dom'],
      },
    },
    test: {
      name: '@fashion-monorepo/store',
      watch: false,
      globals: true,
      environment: 'jsdom',
      include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      reporters: ['default'],
      coverage: {
        reportsDirectory: './test-output/vitest/coverage',
        provider: 'v8' as const,
      },
    },
  };
});
