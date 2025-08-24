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
    * lodash.max
    * lodash.min
    * lodash.orderby
    * lodash.sortby
    * lodash.sum
    * lodash.uniqby
* @undp/design-system-react - For UI elements (Peer dependency)
* maplibre-gl - For Maplibre maps (Peer dependency)
* pmtiles - For adding pmtiles to Maplibre maps (Peer dependency)
* papaparse - For loading and parsing csv from links (Peer dependency)
* motion - For creating animations in the animated graphs
* dnd-kit - For creating comparison maps (Peer dependency)
* simple-statistics - For statistical functions
* xss - For cleaning up cross scripting from user-submitted HTML
* ajv - For schema validation
* date-fns - For date formatting
* html-to-image - For downloading div as images
* dom-to-svg - For downloading div as svg (Peer dependency)
* file-saver - For downloading files
* react-csv - For generating a csv file
* xlsx - For generating a xlsx file (Optional dependency)
* React (of course!) (Peer dependency)

### How to add a new chart or graph

Adding a new chart or graph to the library requires multiple steps:
* Add the code for the graph to `./src/Components/Elements/Graphs/` folder
* Once the code is done add the id of the graph to either `GraphTypeForGriddedGraph` or `GeoHubGraphType` in `./src/Types.tsx` depending if you want it to be available in `GriddedGraphDashboard` or not
* Add the missing settings  to `GraphSettingsDataType` in `./src/Types.tsx`
* Add the graph configuration settings in `./src/Utils/transformData/graphConfig.ts`
* Add the graph to the list in `./src/Utils/getGraphList.tsx`
* Add the data schema for the graph and graph settings schema to the `./src/Schemas/schemaList.tsx`. Also add the graph to the `getGraphConfigChartConfigIdEnum` variable in the same file.
* Also add the missing properties to the `SettingSchema` in `./src/Schemas/schemaList.tsx`
* Add the data schema and settings schema to the `getDataSchema` and `getSettingsSchema` functions in `./src/Schemas/getSchema.tsx`
* Add the graph to the `graphComponent` and `getGraphProps` functions in `./src/Components/Dashboard/GraphEl.tsx`
* Finally add an export in `./src/index.ts`

Adding documentation and stories in storybook:
* Add a new story in `./src/stories/Graph+Map+Chart` folder
* Add a graph name and id to `GraphNames` in `./src/stories/assets/constants.ts`
* Add a config file for the graph in `./src/stories/assets/config` folder
* Add the graph in `./src/stories/assets/graphSettingsSelect.ts`
* Add the graph in `./src/stories/assets/graphDataConfigSelect.ts`

