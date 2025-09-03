import path from 'path';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from '@nabla/vite-plugin-eslint';
import dts from 'vite-plugin-dts';
import tailwindcss from '@tailwindcss/vite';
import { visualizer } from 'rollup-plugin-visualizer';

const entries = {
  // Main entry point
  index: path.resolve(__dirname, 'src/index.ts'),

  // Bar Graph Components
  BarGraph: path.resolve(__dirname, 'src/Components/Graphs/BarGraph/index.tsx'),

  // Individual Graph Components
  CirclePackingGraph: path.resolve(__dirname, 'src/Components/Graphs/CirclePackingGraph/index.tsx'),
  DonutChart: path.resolve(__dirname, 'src/Components/Graphs/DonutChart/index.tsx'),
  DumbbellChart: path.resolve(__dirname, 'src/Components/Graphs/DumbbellChart/index.tsx'),
  BeeSwarmChart: path.resolve(__dirname, 'src/Components/Graphs/BeeSwarmChart/index.tsx'),
  ScatterPlot: path.resolve(__dirname, 'src/Components/Graphs/ScatterPlot/index.tsx'),
  SlopeChart: path.resolve(__dirname, 'src/Components/Graphs/SlopeChart/index.tsx'),
  BulletChart: path.resolve(__dirname, 'src/Components/Graphs/BulletChart/index.tsx'),
  AreaChart: path.resolve(__dirname, 'src/Components/Graphs/StackedAreaChart/index.tsx'),
  TreeMapGraph: path.resolve(__dirname, 'src/Components/Graphs/TreeMapGraph/index.tsx'),
  UnitChart: path.resolve(__dirname, 'src/Components/Graphs/UnitChart/index.tsx'),
  HeatMap: path.resolve(__dirname, 'src/Components/Graphs/HeatMap/index.tsx'),
  StripChart: path.resolve(__dirname, 'src/Components/Graphs/StripChart/index.tsx'),
  ParetoChart: path.resolve(__dirname, 'src/Components/Graphs/ParetoChart/index.tsx'),
  ButterflyChart: path.resolve(__dirname, 'src/Components/Graphs/ButterflyChart/index.tsx'),
  Histogram: path.resolve(__dirname, 'src/Components/Graphs/Histogram/index.tsx'),
  SankeyChart: path.resolve(__dirname, 'src/Components/Graphs/SankeyChart/index.tsx'),
  RadarChart: path.resolve(__dirname, 'src/Components/Graphs/RadarChart/index.tsx'),

  // Line Chart Components
  DualAxisLineChart: path.resolve(
    __dirname,
    'src/Components/Graphs/LineCharts/DualAxisLineChart/index.tsx',
  ),
  LineChartWithConfidenceInterval: path.resolve(
    __dirname,
    'src/Components/Graphs/LineCharts/LineChartWithConfidenceInterval/index.tsx',
  ),
  SimpleLineChart: path.resolve(__dirname, 'src/Components/Graphs/LineCharts/LineChart/index.tsx'),
  MultiLineChart: path.resolve(
    __dirname,
    'src/Components/Graphs/LineCharts/MultiLineChart/index.tsx',
  ),
  MultiLineAltChart: path.resolve(
    __dirname,
    'src/Components/Graphs/LineCharts/MultiLineAltChart/index.tsx',
  ),
  DifferenceLineChart: path.resolve(
    __dirname,
    'src/Components/Graphs/LineCharts/DifferenceLineChart/index.tsx',
  ),
  SparkLine: path.resolve(__dirname, 'src/Components/Graphs/LineCharts/SparkLine/index.tsx'),

  // Map Components
  BiVariateChoroplethMap: path.resolve(
    __dirname,
    'src/Components/Graphs/Maps/BiVariateMap/index.tsx',
  ),
  ChoroplethMap: path.resolve(__dirname, 'src/Components/Graphs/Maps/ChoroplethMap/index.tsx'),
  DotDensityMap: path.resolve(__dirname, 'src/Components/Graphs/Maps/DotDensityMap/index.tsx'),
  ThreeDGlobe: path.resolve(__dirname, 'src/Components/Graphs/Maps/ThreeDGlobe/index.tsx'),
  GeoHubMap: path.resolve(__dirname, 'src/Components/Graphs/Maps/GeoHubMaps/SimpleMap/index.tsx'),
  GeoHubCompareMaps: path.resolve(
    __dirname,
    'src/Components/Graphs/Maps/GeoHubMaps/CompareMaps/index.tsx',
  ),
  GeoHubMapWithLayerSelection: path.resolve(
    __dirname,
    'src/Components/Graphs/Maps/GeoHubMaps/MapWithLayerSelection/index.tsx',
  ),

  // Stat Card Components
  BasicStatCard: path.resolve(__dirname, 'src/Components/Graphs/StatCard/index.tsx'),
  StatCardFromData: path.resolve(__dirname, 'src/Components/Graphs/StatCard/StatCardFromData.tsx'),

  // Data Components
  DataTable: path.resolve(__dirname, 'src/Components/Graphs/DataTable/index.tsx'),
  DataCards: path.resolve(__dirname, 'src/Components/Graphs/DataCards/index.tsx'),

  // Dashboard Components
  MultiGraphDashboard: path.resolve(__dirname, 'src/Components/Dashboard/MultiGraphDashboard.tsx'),
  PerformanceIntensiveMultiGraphDashboard: path.resolve(
    __dirname,
    'src/Components/Dashboard/PerformanceIntensive/MultiGraphDashboard.tsx',
  ),
  MultiGraphDashboardWideToLongFormat: path.resolve(
    __dirname,
    'src/Components/Dashboard/MultiGraphDashboardWideToLongFormat.tsx',
  ),
  SingleGraphDashboard: path.resolve(
    __dirname,
    'src/Components/Dashboard/SingleGraphDashboard.tsx',
  ),
  SingleGraphDashboardGeoHubMaps: path.resolve(
    __dirname,
    'src/Components/Dashboard/PerformanceIntensive/SingleGraphDashboardGeoHubMaps.tsx',
  ),
  SingleGraphDashboardThreeDGraphs: path.resolve(
    __dirname,
    'src/Components/Dashboard/PerformanceIntensive/SingleGraphDashboardThreeDGraphs.tsx',
  ),
  GriddedGraphs: path.resolve(__dirname, 'src/Components/Dashboard/GriddedGraphs.tsx'),
  ScrollStory: path.resolve(__dirname, 'src/Components/Dashboard/ScrollStory.tsx'),
  PerformanceIntensiveScrollStory: path.resolve(
    __dirname,
    'src/Components/Dashboard/PerformanceIntensive/ScrollStory.tsx',
  ),

  // Dashboard from Config Components
  MultiGraphDashboardFromConfig: path.resolve(
    __dirname,
    'src/Components/Dashboard/MultiGraphDashboardFromConfig.tsx',
  ),
  PerformanceIntensiveMultiGraphDashboardFromConfig: path.resolve(
    __dirname,
    'src/Components/Dashboard/PerformanceIntensive/MultiGraphDashboardFromConfig.tsx',
  ),
  MultiGraphDashboardWideToLongFormatFromConfig: path.resolve(
    __dirname,
    'src/Components/Dashboard/MultiGraphDashboardWideToLongFormatFromConfig.tsx',
  ),
  SingleGraphDashboardFromConfig: path.resolve(
    __dirname,
    'src/Components/Dashboard/SingleGraphDashboardFromConfig.tsx',
  ),
  SingleGraphDashboardGeoHubMapsFromConfig: path.resolve(
    __dirname,
    'src/Components/Dashboard/PerformanceIntensive/SingleGraphDashboardGeoHubMapsFromConfig.tsx',
  ),
  SingleGraphDashboardThreeDGraphsFromConfig: path.resolve(
    __dirname,
    'src/Components/Dashboard/PerformanceIntensive/SingleGraphDashboardThreeDGraphsFromConfig.tsx',
  ),
  GriddedGraphsFromConfig: path.resolve(
    __dirname,
    'src/Components/Dashboard/GriddedGraphsFromConfig.tsx',
  ),

  // Action/Button Components
  ExcelDownloadButton: path.resolve(__dirname, 'src/Components/Actions/ExcelDownloadButton.tsx'),
  ImageDownloadButton: path.resolve(__dirname, 'src/Components/Actions/ImageDownloadButton.tsx'),
  SVGDownloadButton: path.resolve(__dirname, 'src/Components/Actions/SVGDownloadButton.tsx'),
  CsvDownloadButton: path.resolve(__dirname, 'src/Components/Actions/CsvDownloadButton.tsx'),
  CopyTextButton: path.resolve(__dirname, 'src/Components/Actions/CopyTextButton.tsx'),

  // Color Palette
  Colors: path.resolve(__dirname, 'src/Components/ColorPalette/index.ts'),

  // Design Elements
  ColorLegend: path.resolve(__dirname, 'src/Components/Elements/ColorLegend.tsx'),
  ColorLegendWithMouseOver: path.resolve(
    __dirname,
    'src/Components/Elements/ColorLegendWithMouseOver.tsx',
  ),
  LinearColorLegend: path.resolve(__dirname, 'src/Components/Elements/LinearColorLegend.tsx'),
  ThresholdColorLegendWithMouseOver: path.resolve(
    __dirname,
    'src/Components/Elements/ThresholdColorLegendWithMouseOver.tsx',
  ),
  GraphFooter: path.resolve(__dirname, 'src/Components/Elements/GraphFooter.tsx'),
  GraphHeader: path.resolve(__dirname, 'src/Components/Elements/GraphHeader.tsx'),

  // Typography Components
  FootNote: path.resolve(__dirname, 'src/Components/Typography/FootNote.tsx'),
  GraphDescription: path.resolve(__dirname, 'src/Components/Typography/GraphDescription.tsx'),
  GraphTitle: path.resolve(__dirname, 'src/Components/Typography/GraphTitle.tsx'),
  Source: path.resolve(__dirname, 'src/Components/Typography/Source.tsx'),

  // Utility Functions
  utils: path.resolve(__dirname, 'src/Utils/index.ts'),

  // Data Processing Utils
  fetchAndParseData: path.resolve(__dirname, 'src/Utils/fetchAndParseData.ts'),
  transformData: path.resolve(__dirname, 'src/Utils/transformData/index.ts'),

  // Schema Validation
  validateSchema: path.resolve(__dirname, 'src/Utils/validateSchema.ts'),
  getSchema: path.resolve(__dirname, 'src/Schemas/getSchema.ts'),
  // Types
  Types: path.resolve(__dirname, 'src/Types.ts'),
};

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
      entry: entries,
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => {
        if (format === 'cjs') return `${entryName}.cjs`; // CJS uses .cjs
        return `${entryName}.js`; // ESM uses .js
      },
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
        manualChunks: undefined,
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
