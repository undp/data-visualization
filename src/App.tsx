import { SingleGraphDashboard } from './Components/Dashboard/SingleGraphDashboard';
import './styles/styles.css';
import '@undp/design-system-react/style.css';

function App() {
  return (
    <SingleGraphDashboard
      dataSettings={{
        dataURL:
          'https://raw.githubusercontent.com/UNDP-Data/dv-energy-ndc-data-repository/refs/heads/main/data/key-insights/gdp_and_gdp_per_capita.csv',
        fileType: 'csv',
      }}
      graphType='multiLineChart'
      graphDataConfiguration={[
        { columnId: 'Year', chartConfigId: 'date' },
        { columnId: ['BaseCase', 'RA', 'RA+SDG'], chartConfigId: 'y' },
      ]}
      advancedDataSelectionOptions={[
        {
          label: 'Select indicator',
          options: [
            {
              label: 'GDP at MER',
              dataConfiguration: [
                {
                  columnId: ['BaseCase', 'RA', 'RA+SDG'],
                  chartConfigId: 'y',
                },
                {
                  columnId: 'Year',
                  chartConfigId: 'date',
                },
              ],
              graphSettings: {
                graphTitle: 'GDP at MER',
                graphDescription: 'Trillion US$',
                suffix: 'T',
                prefix: '$',
                tooltip: `
                  <div class="font-bold p-2 bg-primary-gray-300 uppercase text-xs">
                    {{data.Year}}
                  </div>
                  <div class="p-2 flex min-w-[240px] justify-between items-center">
                    <div class="flex items-center gap-1">
                      <span class='w-2 h-2 rounded-full inline'></span>
                      BaseCase
                    </div>
                    <div class="font-bold">\${{y.[0]}}T</div>
                  </div>
                  <div class="p-2 flex justify-between items-center">
                    <div class="flex items-center gap-1">
                      <span class='w-2 h-2 rounded-full inline'></span>
                      RA
                    </div>
                    <div class="font-bold">\${{y.[1]}}T</div>
                  </div>
                  <div class="p-2 flex justify-between items-center">
                    <div class="flex items-center gap-1">
                      <span class='w-2 h-2 rounded-full inline'></span>
                      RA + SDG
                    </div>
                    <div class="font-bold">\${{y.[2]}}T</div>
                  </div>
                `,
              },
            },
            {
              label: 'GDP per capita',
              dataConfiguration: [
                {
                  columnId: ['BaseCase_per_capita', 'RA_per_capita', 'RA+SDG_per_capita'],
                  chartConfigId: 'y',
                },
                {
                  columnId: 'Year',
                  chartConfigId: 'date',
                },
              ],
              graphSettings: {
                graphTitle: 'GDP per capita',
                graphDescription: 'Thousand US$',
                suffix: 'K',
                prefix: '$',
                tooltip: `
                  <div class="font-bold p-2 bg-primary-gray-300 uppercase text-xs">
                    {{data.Year}}
                  </div>
                  <div class="p-2 flex min-w-[240px] justify-between items-center">
                    <div class="flex items-center gap-1">
                      <span class='w-2 h-2 rounded-full inline'></span>
                      BaseCase
                    </div>
                    <div class="font-bold">\${{y.[0]}}K</div>
                  </div>
                  <div class="p-2 flex justify-between items-center">
                    <div class="flex items-center gap-1">
                      <span class='w-2 h-2 rounded-full inline'></span>
                      RA
                    </div>
                    <div class="font-bold">\${{y.[1]}}K</div>
                  </div>
                  <div class="p-2 flex justify-between items-center">
                    <div class="flex items-center gap-1">
                      <span class='w-2 h-2 rounded-full inline'></span>
                      RA + SDG
                    </div>
                    <div class="font-bold">\${{y.[2]}}K</div>
                  </div>
                `,
              },
            },
          ],
          ui: 'radio',
        },
      ]}
      graphSettings={{
        showValues: false,
        graphTitle: 'GDP at MER',
        graphDescription: 'Trillion US$',
        showColorLegendAtTop: true,
        showDots: false,
        labels: ['BaseCase', 'RA', 'RA + SDG'],
        suffix: 'T',
        prefix: '$',
        padding: '0',
        tooltip: `
                  <div class="font-bold p-2 bg-primary-gray-300 uppercase text-xs">
                    {{data.Year}}
                  </div>
                  <div class="p-2 flex min-w-[240px] justify-between items-center">
                    <div class="flex items-center gap-1">
                      <span class='w-2 h-2 rounded-full inline'></span>
                      BaseCase
                    </div>
                    <div class="font-bold">\${{y.[0]}}T</div>
                  </div>
                  <div class="p-2 flex justify-between items-center">
                    <div class="flex items-center gap-1">
                      <span class='w-2 h-2 rounded-full inline'></span>
                      RA
                    </div>
                    <div class="font-bold">\${{y.[1]}}T</div>
                  </div>
                  <div class="p-2 flex justify-between items-center">
                    <div class="flex items-center gap-1">
                      <span class='w-2 h-2 rounded-full inline'></span>
                      RA + SDG
                    </div>
                    <div class="font-bold">\${{y.[2]}}T</div>
                  </div>
                `,
        styles: {
          tooltip: {
            padding: '0',
            minWidth: '150px',
          },
        },
      }}
    />
  );
}

export default App;
