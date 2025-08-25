import type { Preview } from '@storybook/react';
import '@undp/design-system-react/style.css';
import '../src/styles/styles.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // Add the docs configuration
    docs: { controls: { sort: 'none' } },
    options: {
      storyBookName: 'UNDP data viz library',
      storySort: {
        order: [
          'Getting started',
          'Graphs',
          ['Bar graph', '*'],
          'Maps',
          ['Choropleth map', 'Dot density map', 'GeoHub maps', ['Simple', '*']],
          'Dashboard',
          [
            'Single graphs with filters',
            'Multi graph dashboard',
            'Small multiples or gridded graph',
            'Multi graph dashboard (wide to long)',
            'From JSON config',
            'Data types',
            [
              'graphType',
              'graphSettings',
              'dataSettings',
              'dataSettings (wide to long)',
              'dataTransform',
              'dataFilters',
              'graphDataConfiguration',
              'filters',
              'dataSelectionOptions',
              'advancedDataSelectionOptions',
              'dashboardLayout',
              'dashboardLayout (wide to long)',
              '*',
            ],
            '*',
          ],
          'Scroll story',
          'Utilities',
          ['Colors', 'Data fetching', 'Data transformation', 'Downloads', 'Validate schema', '*'],
          ['Data fetching', 'Data transformation', 'Colors', 'Downloads', '*'],
          '*',
        ],
      },
    },
  },
};

export default preview;
