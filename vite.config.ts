import path from 'path';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from '@nabla/vite-plugin-eslint';
import dts from 'vite-plugin-dts';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    dts({
      include: ['src/'],
      exclude: ['**/*.mdx', '**/*.test.tsx', 'stories'],
      rollupTypes: true,
    }),
    react(),
    eslint(),
    tailwindcss(),
  ],
  build: {
    cssCodeSplit: false,
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'undpViz',
      fileName: format => {
        if (format === 'es') return 'index.js'; // ES Module
        if (format === 'cjs') return 'index.cjs'; // CommonJS Module
        return 'index.umd.js'; // UMD Module
      },
      formats: ['es', 'cjs', 'umd'],
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'maplibre-gl', 'xlsx'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'maplibre-gl': 'maplibreGl',
          xlsx: 'XLSX',
        },
        assetFileNames: assetInfo => {
          if (assetInfo.names && assetInfo.names.includes('data-viz.css')) {
            return 'style.css';
          }
          return 'assets/[name][extname]';
        },
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
  server: {
    cors: {
      origin: '*',
      methods: ['GET'],
      preflightContinue: false,
      optionsSuccessStatus: 204,
    },
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
});
