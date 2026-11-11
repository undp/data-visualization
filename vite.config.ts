import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { viteStaticCopy } from 'vite-plugin-static-copy';

const entries = {
  // Main entry point
  index: path.resolve(import.meta.dirname, 'src/index.ts'),

  // Bar Graph Components
  BarGraph: path.resolve(import.meta.dirname, 'src/Components/Graphs/BarGraph/index.tsx'),

  // Individual Graph Components
  CirclePackingGraph: path.resolve(
    import.meta.dirname,
    'src/Components/Graphs/CirclePackingGraph/index.tsx',
  ),
  DonutChart: path.resolve(import.meta.dirname, 'src/Components/Graphs/DonutChart/index.tsx'),
  DumbbellChart: path.resolve(import.meta.dirname, 'src/Components/Graphs/DumbbellChart/index.tsx'),
  BeeSwarmChart: path.resolve(import.meta.dirname, 'src/Components/Graphs/BeeSwarmChart/index.tsx'),
  ScatterPlot: path.resolve(import.meta.dirname, 'src/Components/Graphs/ScatterPlot/index.tsx'),
  SlopeChart: path.resolve(import.meta.dirname, 'src/Components/Graphs/SlopeChart/index.tsx'),
  BulletChart: path.resolve(import.meta.dirname, 'src/Components/Graphs/BulletChart/index.tsx'),
  AreaChart: path.resolve(import.meta.dirname, 'src/Components/Graphs/StackedAreaChart/index.tsx'),
  TreeMapGraph: path.resolve(import.meta.dirname, 'src/Components/Graphs/TreeMapGraph/index.tsx'),
  UnitChart: path.resolve(import.meta.dirname, 'src/Components/Graphs/UnitChart/index.tsx'),
  HeatMap: path.resolve(import.meta.dirname, 'src/Components/Graphs/HeatMap/index.tsx'),
  StripChart: path.resolve(import.meta.dirname, 'src/Components/Graphs/StripChart/index.tsx'),
  ParetoChart: path.resolve(import.meta.dirname, 'src/Components/Graphs/ParetoChart/index.tsx'),
  ButterflyChart: path.resolve(
    import.meta.dirname,
    'src/Components/Graphs/ButterflyChart/index.tsx',
  ),
  Histogram: path.resolve(import.meta.dirname, 'src/Components/Graphs/Histogram/index.tsx'),
  SankeyChart: path.resolve(import.meta.dirname, 'src/Components/Graphs/SankeyChart/index.tsx'),
  RadarChart: path.resolve(import.meta.dirname, 'src/Components/Graphs/RadarChart/index.tsx'),
  WaterfallChart: path.resolve(
    import.meta.dirname,
    'src/Components/Graphs/WaterfallChart/index.tsx',
  ),

  // Line Chart Components
  DualAxisLineChart: path.resolve(
    import.meta.dirname,
    'src/Components/Graphs/LineCharts/DualAxisLineChart/index.tsx',
  ),
  LineChartWithConfidenceInterval: path.resolve(
    import.meta.dirname,
    'src/Components/Graphs/LineCharts/LineChartWithConfidenceInterval/index.tsx',
  ),
  SimpleLineChart: path.resolve(
    import.meta.dirname,
    'src/Components/Graphs/LineCharts/LineChart/index.tsx',
  ),
  MultiLineChart: path.resolve(
    import.meta.dirname,
    'src/Components/Graphs/LineCharts/MultiLineChart/index.tsx',
  ),
  MultiLineAltChart: path.resolve(
    import.meta.dirname,
    'src/Components/Graphs/LineCharts/MultiLineAltChart/index.tsx',
  ),
  DifferenceLineChart: path.resolve(
    import.meta.dirname,
    'src/Components/Graphs/LineCharts/DifferenceLineChart/index.tsx',
  ),
  SparkLine: path.resolve(
    import.meta.dirname,
    'src/Components/Graphs/LineCharts/SparkLine/index.tsx',
  ),

  // Map Components
  BiVariateChoroplethMap: path.resolve(
    import.meta.dirname,
    'src/Components/Graphs/Maps/BiVariateMap/index.tsx',
  ),
  ChoroplethMap: path.resolve(
    import.meta.dirname,
    'src/Components/Graphs/Maps/ChoroplethMap/index.tsx',
  ),
  DotDensityMap: path.resolve(
    import.meta.dirname,
    'src/Components/Graphs/Maps/DotDensityMap/index.tsx',
  ),
  HybridMap: path.resolve(import.meta.dirname, 'src/Components/Graphs/Maps/HybridMap/index.tsx'),
  ThreeDGlobe: path.resolve(
    import.meta.dirname,
    'src/Components/Graphs/Maps/ThreeDGlobe/index.tsx',
  ),
  GeoHubMap: path.resolve(
    import.meta.dirname,
    'src/Components/Graphs/Maps/GeoHubMaps/SimpleMap/index.tsx',
  ),
  GeoHubCompareMaps: path.resolve(
    import.meta.dirname,
    'src/Components/Graphs/Maps/GeoHubMaps/CompareMaps/index.tsx',
  ),
  GeoHubMapWithLayerSelection: path.resolve(
    import.meta.dirname,
    'src/Components/Graphs/Maps/GeoHubMaps/MapWithLayerSelection/index.tsx',
  ),

  // Stat Card Components
  BasicStatCard: path.resolve(import.meta.dirname, 'src/Components/Graphs/StatCard/index.tsx'),
  StatCardFromData: path.resolve(
    import.meta.dirname,
    'src/Components/Graphs/StatCard/StatCardFromData.tsx',
  ),

  // Data Components
  DataTable: path.resolve(import.meta.dirname, 'src/Components/Graphs/DataTable/index.tsx'),
  DataCards: path.resolve(import.meta.dirname, 'src/Components/Graphs/DataCards/index.tsx'),

  // Dashboard Components
  MultiGraphDashboard: path.resolve(
    import.meta.dirname,
    'src/Components/Dashboard/MultiGraphDashboard.tsx',
  ),
  PerformanceIntensiveMultiGraphDashboard: path.resolve(
    import.meta.dirname,
    'src/Components/Dashboard/PerformanceIntensive/MultiGraphDashboard.tsx',
  ),
  MultiGraphDashboardWideToLongFormat: path.resolve(
    import.meta.dirname,
    'src/Components/Dashboard/MultiGraphDashboardWideToLongFormat.tsx',
  ),
  SingleGraphDashboard: path.resolve(
    import.meta.dirname,
    'src/Components/Dashboard/SingleGraphDashboard.tsx',
  ),
  SingleGraphDashboardGeoHubMaps: path.resolve(
    import.meta.dirname,
    'src/Components/Dashboard/PerformanceIntensive/SingleGraphDashboardGeoHubMaps.tsx',
  ),
  SingleGraphDashboardThreeDGraphs: path.resolve(
    import.meta.dirname,
    'src/Components/Dashboard/PerformanceIntensive/SingleGraphDashboardThreeDGraphs.tsx',
  ),
  GriddedGraphs: path.resolve(import.meta.dirname, 'src/Components/Dashboard/GriddedGraphs.tsx'),
  ScrollStory: path.resolve(import.meta.dirname, 'src/Components/Dashboard/ScrollStory.tsx'),
  PerformanceIntensiveScrollStory: path.resolve(
    import.meta.dirname,
    'src/Components/Dashboard/PerformanceIntensive/ScrollStory.tsx',
  ),

  // Dashboard from Config Components
  MultiGraphDashboardFromConfig: path.resolve(
    import.meta.dirname,
    'src/Components/Dashboard/MultiGraphDashboardFromConfig.tsx',
  ),
  PerformanceIntensiveMultiGraphDashboardFromConfig: path.resolve(
    import.meta.dirname,
    'src/Components/Dashboard/PerformanceIntensive/MultiGraphDashboardFromConfig.tsx',
  ),
  MultiGraphDashboardWideToLongFormatFromConfig: path.resolve(
    import.meta.dirname,
    'src/Components/Dashboard/MultiGraphDashboardWideToLongFormatFromConfig.tsx',
  ),
  SingleGraphDashboardFromConfig: path.resolve(
    import.meta.dirname,
    'src/Components/Dashboard/SingleGraphDashboardFromConfig.tsx',
  ),
  SingleGraphDashboardGeoHubMapsFromConfig: path.resolve(
    import.meta.dirname,
    'src/Components/Dashboard/PerformanceIntensive/SingleGraphDashboardGeoHubMapsFromConfig.tsx',
  ),
  SingleGraphDashboardThreeDGraphsFromConfig: path.resolve(
    import.meta.dirname,
    'src/Components/Dashboard/PerformanceIntensive/SingleGraphDashboardThreeDGraphsFromConfig.tsx',
  ),
  GriddedGraphsFromConfig: path.resolve(
    import.meta.dirname,
    'src/Components/Dashboard/GriddedGraphsFromConfig.tsx',
  ),

  // Action/Button Components
  ImageDownloadButton: path.resolve(
    import.meta.dirname,
    'src/Components/Actions/ImageDownloadButton.tsx',
  ),
  SVGDownloadButton: path.resolve(
    import.meta.dirname,
    'src/Components/Actions/SVGDownloadButton.tsx',
  ),
  CsvDownloadButton: path.resolve(
    import.meta.dirname,
    'src/Components/Actions/CsvDownloadButton.tsx',
  ),
  CopyTextButton: path.resolve(import.meta.dirname, 'src/Components/Actions/CopyTextButton.tsx'),

  // Color Palette
  Colors: path.resolve(import.meta.dirname, 'src/Components/ColorPalette/index.ts'),

  // Design Elements
  ColorLegend: path.resolve(import.meta.dirname, 'src/Components/Elements/ColorLegend.tsx'),
  ColorLegendWithMouseOver: path.resolve(
    import.meta.dirname,
    'src/Components/Elements/ColorLegendWithMouseOver.tsx',
  ),
  LinearColorLegend: path.resolve(
    import.meta.dirname,
    'src/Components/Elements/LinearColorLegend.tsx',
  ),
  ThresholdColorLegendWithMouseOver: path.resolve(
    import.meta.dirname,
    'src/Components/Elements/ThresholdColorLegendWithMouseOver.tsx',
  ),
  GraphFooter: path.resolve(import.meta.dirname, 'src/Components/Elements/GraphFooter.tsx'),
  GraphHeader: path.resolve(import.meta.dirname, 'src/Components/Elements/GraphHeader.tsx'),

  // Typography Components
  FootNote: path.resolve(import.meta.dirname, 'src/Components/Typography/FootNote.tsx'),
  string2HTML: path.resolve(import.meta.dirname, 'src/Utils/string2HTML.ts'),
  GraphDescription: path.resolve(
    import.meta.dirname,
    'src/Components/Typography/GraphDescription.tsx',
  ),
  GraphTitle: path.resolve(import.meta.dirname, 'src/Components/Typography/GraphTitle.tsx'),
  Source: path.resolve(import.meta.dirname, 'src/Components/Typography/Source.tsx'),

  // Utility Functions
  utils: path.resolve(import.meta.dirname, 'src/Utils/index.ts'),

  // Data Processing Utils
  fetchAndParseData: path.resolve(import.meta.dirname, 'src/Utils/fetchAndParseData.ts'),
  transformData: path.resolve(import.meta.dirname, 'src/Utils/transformData/index.ts'),

  // Types
  Types: path.resolve(import.meta.dirname, 'src/Types.ts'),
};

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    viteStaticCopy({
      targets: [{ src: 'src/styles/*', dest: 'styles', rename: { stripBase: 2 } }],
    }),
    dts({
      include: ['src/'],
      entryRoot: 'src',
      tsconfigPath: './tsconfig.json',
      staticImport: true,
      insertTypesEntry: true,
      bundleTypes: true,
      exclude: ['**/*.mdx', '**/*.test.tsx', 'stories'],
    }),
  ],
  build: {
    cssCodeSplit: false,
    outDir: 'dist',
    emptyOutDir: true,
    lib: {
      entry: entries,
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => {
        if (format === 'cjs') return `${entryName}.cjs`; // CJS uses .cjs
        return `${entryName}.js`; // ESM uses .js
      },
    },
    rollupOptions: {
      input: entries,
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'maplibre-gl',
        'react-globe.gl',
        'three',
        'pmtiles',
        '@dnd-kit/core',
        '@dnd-kit/modifiers',
        /^@undp\/design-system-react(\/.*)?/,
        'dom-to-svg',
        'tw-animate-css',
        'marked',
        'math-expression-evaluator',
        'handlebars',
      ],
      output: {
        manualChunks: undefined,
        externalLiveBindings: false,
        exports: 'named',
        assetFileNames: (assetInfo) => {
          if (assetInfo.names.includes('data-viz.css')) {
            return 'style.css';
          }
          return 'assets/[name][extname]';
        },
      },
      treeshake: true,
    },
    sourcemap: true,
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
    alias: { '@': path.resolve(import.meta.dirname, './src') },
  },
});
