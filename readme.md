# UNDP data viz library ![npm](https://img.shields.io/npm/v/@undp/data-viz)

### Getting Started

[UNDP data viz library](https://dataviz.design.undp.org) is dedicated to providing a good development experience for data visualization specialists. Before starting, it is recommended to learn React first, and correctly install and configure Node.js v18 or above.

We also assumes that you have intermediate knowledge about HTML, CSS, and JavaScript/TypeScript, and React.

__Note: The library uses react v19__

Detailed documentation can be found [here](https://dataviz.design.undp.org)

NPM Package can be found [here](https://www.npmjs.com/package/@undp/data-viz)

### Installation

__Using npm__

```
npm i @undp/data-viz
```

__Using yarn__

```
yarn add @undp/data-viz
```

### Import

It is recommended to import what you need and the use it. For example, import the `HorizontalBarGraph` like this:

```
import { HorizontalBarGraph } from '@undp/data-viz'
```

It is also recommended to import the css because some setting expect the CSS to be imported to look good. You can import the css file like this:

```
import '@undp/data-viz/style.css';
```

### TypeScript

UNDP visualization library provides a built-in ts definition, you don't need to install any type definitions.

### Dependencies

The dependencies that are pre-installed wit the library:

* Various D3 libraries - For visualizations
  * d3-array
  * d3-delaunay
  * d3-force
  * d3-format
  * d3-geo
  * d3-hierarchy
  * d3-scale
  * d3-selection
  * d3-shape
  * d3-zoom
* Various Lodash libraries - For array and data manipulation
  * lodash.flattendeep
  * lodash.intersection
  * lodash.orderby
  * lodash.sortby
  * lodash.sum
  * lodash.uniqby
* motion - For creating animations in the animated graphs
* papaparse - For loading and parsing csv from links
* simple-statistics - For statistical functions
* xss - For cleaning up cross scripting from user-submitted HTML
* date-fns - For date formatting
* modern-screenshot - For downloading div as images
* react-csv - For generating a csv file

__Required peer dependencies__

* React (of course!) (Peer dependency)
* React-dom (of course!) (Peer dependency)
* @undp/design-system-react - For UI elements (Peer dependency)

__Optional peer dependencies__

* maplibre-gl - For Maplibre maps (Peer optional dependency: only needed when using GeoHub maps)
* pmtiles - For adding pmtiles to Maplibre maps (Peer optional dependency: only needed when using GeoHub maps)
* dnd-kit - For creating comparison maps (Peer optional dependency: only needed when using GeoHub compare maps)
* ajv - For schema validation (Peer optional dependency: only needed when validating schemas for good developer experience)
* dom-to-svg - For downloading div as svg (Peer optional dependency: only needed when using SVG download functionality)
* file-saver - For downloading files (Peer optional dependency: only needed when using XLSX download functionality)
* xlsx - For generating a xlsx file (Optional dependency: only needed when using XLSX download functionality)

### How to add a new chart or graph

Adding a new chart or graph to the library requires multiple steps:

* Add the code for the graph to `./src/Components/Elements/Graphs/` folder
* Once the code is done add the id of the graph to either `GraphTypeForGriddedGraph` or `GeoHubGraphType` in `./src/Types.tsx` depending if you want it to be available in `GriddedGraphDashboard` or not
* Add the missing settings  to `GraphSettingsDataType` in `./src/Types.tsx`
* Add the graph configuration settings in `./src/Utils/transformData/graphConfig.ts`
* Add the graph to the list in `./src/Utils/getGraphList.tsx`
* Add the graph to the `graphComponent` and `getGraphProps` functions in `./src/Components/Dashboard/GraphEl.tsx`
* Finally add an export in `./src/index.ts`

Adding documentation and stories in storybook:

* Add a new story in `./src/stories/Graph+Map+Chart` folder
* Add a graph name and id to `GraphNames` in `./src/stories/assets/constants.ts`
* Add a config file for the graph in `./src/stories/assets/config` folder
* Add the graph in `./src/stories/assets/graphSettingsSelect.ts`
* Add the graph in `./src/stories/assets/graphDataConfigSelect.ts`
