import barGraph from './config/barGraph.json';
import animatedBarGraph from './config/animatedBarGraph.json';
import stackedBarGraph from './config/stackedBarGraph.json';
import animatedStackedBarGraph from './config/animatedStackedBarGraph.json';
import groupedBarGraph from './config/groupedBarGraph.json';
import animatedGroupedBarGraph from './config/animatedGroupedBarGraph.json';
import circlePacking from './config/circlePacking.json';
import treeMap from './config/treeMap.json';
import donutGraph from './config/donutGraph.json';
import beeswarmChart from './config/beeswarmChart.json';
import butterflyChart from './config/butterflyChart.json';
import animatedButterflyChart from './config/animatedButterflyChart.json';
import dataCards from './config/dataCards.json';
import dataTable from './config/dataTable.json';
import dumbbellChart from './config/dumbbellChart.json';
import animatedDumbbellChart from './config/animatedDumbbellChart.json';
import differenceLineChart from './config/differenceLineChart.json';
import dualAxisLineChart from './config/dualAxisLineChart.json';
import lineChart from './config/lineChart.json';
import lineChartWithInterval from './config/lineChartWithInterval.json';
import sparkline from './config/sparkline.json';
import multiLineChart from './config/multiLineChart.json';
import multiLineAltChart from './config/multiLineAltChart.json';
import paretoChart from './config/paretoChart.json';
import sankeyChart from './config/sankeyChart.json';
import scatterPlot from './config/scatterPlot.json';
import animatedScatterPlot from './config/animatedScatterPlot.json';
import slopeChart from './config/slopeChart.json';
import stripChart from './config/stripChart.json';
import stackedAreaChart from './config/stackedAreaChart.json';
import bulletChart from './config/bulletChart.json';
import statCard from './config/statCard.json';
import unitChart from './config/unitChart.json';
import choroplethMap from './config/choroplethMap.json';
import animatedChoroplethMap from './config/animatedChoroplethMap.json';
import biVariateChoroplethMap from './config/biVariateChoroplethMap.json';
import animatedBiVariateChoroplethMap from './config/animatedBivariateChoroplethMap.json';
import dotDensityMap from './config/dotDensityMap.json';
import animatedDotDensityMap from './config/animatedDotDensityMap.json';
import radarChart from './config/radarChart.json';
import geoHubMap from './config/geoHubMap.json';
import geoHubMapWithLayerSelection from './config/geoHubMapWithLayerSelection.json';
import geoHubCompareMap from './config/geoHubCompareMap.json';
import griddedChartExtraParam from './config/griddedChartExtraParam.json';

export function GraphSettingsSelector(
  graph: string,
  onlySettings: boolean,
  forGriddedGraph: boolean,
) {
  const configFiles = {
    'Bar graph': barGraph,
    'Bar graph (animated)': animatedBarGraph,
    'Stacked bar graph': stackedBarGraph,
    'Stacked bar graph (animated)': animatedStackedBarGraph,
    'Grouped bar graph': groupedBarGraph,
    'Grouped bar graph (animated)': animatedGroupedBarGraph,
    'Donut graph': donutGraph,
    'Tree map': treeMap,
    'Circle packing': circlePacking,
    'Beeswarm chart': beeswarmChart,
    'Butterfly chart': butterflyChart,
    'Butterfly chart (animated)': animatedButterflyChart,
    'Data cards': dataCards,
    'Data table': dataTable,
    'Dumbbell graph': dumbbellChart,
    'Dumbbell graph (animated)': animatedDumbbellChart,
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
    'Choropleth map (animated)': animatedChoroplethMap,
    'Bi-variate choropleth map': biVariateChoroplethMap,
    'Bi-variate choropleth map (animated)': animatedBiVariateChoroplethMap,
    'Dot density map': dotDensityMap,
    'Dot density map (animated)': animatedDotDensityMap,
    'Bullet chart': bulletChart,
    'Radar chart': radarChart,
    'GeoHub Map': geoHubMap,
    'GeoHub map with layer selection': geoHubMapWithLayerSelection,
    'GeoHub compare map': geoHubCompareMap,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return typeof (configFiles as any)[graph] === 'string'
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (configFiles as any)[graph]
    : JSON.stringify(
        onlySettings
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (configFiles as any)[graph].graphSettings
          : forGriddedGraph
            ? {
                ...griddedChartExtraParam,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ...(configFiles as any)[graph],
              }
            : // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (configFiles as any)[graph],
        null,
        2,
      );
}
