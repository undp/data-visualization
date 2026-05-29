import animatedScatterPlot from './config/animatedScatterPlot.json';
import barGraph from './config/barGraph.json';
import beeswarmChart from './config/beeswarmChart.json';
import biVariateChoroplethMap from './config/biVariateChoroplethMap.json';
import bulletChart from './config/bulletChart.json';
import butterflyChart from './config/butterflyChart.json';
import choroplethMap from './config/choroplethMap.json';
import circlePacking from './config/circlePacking.json';
import dataCards from './config/dataCards.json';
import dataTable from './config/dataTable.json';
import differenceLineChart from './config/differenceLineChart.json';
import donutGraph from './config/donutGraph.json';
import dotDensityMap from './config/dotDensityMap.json';
import dualAxisLineChart from './config/dualAxisLineChart.json';
import dumbbellChart from './config/dumbbellChart.json';
import geoHubCompareMap from './config/geoHubCompareMap.json';
import geoHubMap from './config/geoHubMap.json';
import geoHubMapWithLayerSelection from './config/geoHubMapWithLayerSelection.json';
import griddedChartExtraParam from './config/griddedChartExtraParam.json';
import groupedBarGraph from './config/groupedBarGraph.json';
import lineChart from './config/lineChart.json';
import lineChartWithInterval from './config/lineChartWithInterval.json';
import multiLineAltChart from './config/multiLineAltChart.json';
import multiLineChart from './config/multiLineChart.json';
import paretoChart from './config/paretoChart.json';
import radarChart from './config/radarChart.json';
import sankeyChart from './config/sankeyChart.json';
import scatterPlot from './config/scatterPlot.json';
import slopeChart from './config/slopeChart.json';
import sparkline from './config/sparkline.json';
import stackedAreaChart from './config/stackedAreaChart.json';
import stackedBarGraph from './config/stackedBarGraph.json';
import statCard from './config/statCard.json';
import stripChart from './config/stripChart.json';
import treeMap from './config/treeMap.json';
import unitChart from './config/unitChart.json';

export function GraphSettingsSelector(
  graph: string,
  onlySettings: boolean,
  forGriddedGraph: boolean,
) {
  const configFiles = {
    'Bar graph': barGraph,
    'Stacked bar graph': stackedBarGraph,
    'Grouped bar graph': groupedBarGraph,
    'Donut graph': donutGraph,
    'Tree map': treeMap,
    'Circle packing': circlePacking,
    'Beeswarm chart': beeswarmChart,
    'Butterfly chart': butterflyChart,
    'Data cards': dataCards,
    'Data table': dataTable,
    'Dumbbell graph': dumbbellChart,
    'Difference line chart': differenceLineChart,
    'Dual axis line chart': dualAxisLineChart,
    'Line chart': lineChart,
    Sparkline: sparkline,
    'Line chart with interval': lineChartWithInterval,
    'Multi-line chart': multiLineChart,
    'Multi-line chart alternative': multiLineAltChart,
    'Pareto chart': paretoChart,
    'Sankey chart': sankeyChart,
    'Scatter plot': scatterPlot,
    'Scatter plot (animated)': animatedScatterPlot,
    'Slope chart': slopeChart,
    'Stacked area chart': stackedAreaChart,
    'Stat card': statCard,
    'Strip chart': stripChart,
    'Unit chart': unitChart,
    'Choropleth map': choroplethMap,
    'Bi-variate choropleth map': biVariateChoroplethMap,
    'Dot density map': dotDensityMap,
    'Bullet chart': bulletChart,
    'Radar chart': radarChart,
    'GeoHub Map': geoHubMap,
    'GeoHub map with layer selection': geoHubMapWithLayerSelection,
    'GeoHub compare map': geoHubCompareMap,
  };

  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  return typeof (configFiles as any)[graph] === 'string'
    ? // biome-ignore lint/suspicious/noExplicitAny: undefined data type
      (configFiles as any)[graph]
    : JSON.stringify(
        onlySettings
          ? // biome-ignore lint/suspicious/noExplicitAny: undefined data type
            (configFiles as any)[graph].graphSettings
          : forGriddedGraph
            ? {
                ...griddedChartExtraParam,
                // biome-ignore lint/suspicious/noExplicitAny: undefined data type
                ...(configFiles as any)[graph],
              }
            : // biome-ignore lint/suspicious/noExplicitAny: undefined data type
              (configFiles as any)[graph],
        null,
        2,
      );
}
