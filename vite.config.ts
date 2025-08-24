import path from 'path';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from '@nabla/vite-plugin-eslint';
import dts from 'vite-plugin-dts';
import tailwindcss from '@tailwindcss/vite';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    dts({
      include: ['src/'],
      exclude: ['**/*.mdx', '**/*.test.tsx', 'stories'],
      rollupTypes: true,
    }),
    visualizer({ filename: 'stats.html', open: true }),
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
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'maplibre-gl',
        'xlsx',
        'react-globe.gl',
        'three',
        'pmtiles',
        '@dnd-kit/core',
        '@dnd-kit/modifiers',
        '@undp/design-system-react',
        'dom-to-svg',
        'tailwindcss-animate',
        'tailwind-merge',
        'tailwind-animate',
        'file-saver',
        'marked',
        'math-expression-evaluator',
        'handlebars',
        'ajv',
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'maplibre-gl': 'maplibreGl',
          xlsx: 'XLSX',
          'react-globe.gl': 'Globe',
          three: 'THREE',
          pmtiles: 'pmtiles',
          '@dnd-kit/core': 'DndKitCore',
          '@dnd-kit/modifiers': 'DndKitModifiers',
          '@undp/design-system-react': 'UndpDesignSystemReact',
          'dom-to-svg': 'domToSvg',
          'tailwindcss-animate': 'tailwindcssAnimate',
          'tailwind-merge': 'tailwindMerge',
          'tailwind-animate': 'tailwindAnimate',
          'file-saver': 'saveAs',
          marked: 'marked',
          'math-expression-evaluator': 'Mexp',
          handlebars: 'Handlebars',
          ajv: 'Ajv',
        },
        assetFileNames: assetInfo => {
          if (assetInfo.names && assetInfo.names.includes('data-viz.css')) {
            return 'style.css';
          }
          return 'assets/[name][extname]';
        },
      },
      treeshake: true,
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
