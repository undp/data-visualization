import { SingleGraphDashboard } from './Components/Dashboard/SingleGraphDashboard';
import './styles/styles.css';
import '@undp/design-system-react/style.css';

function App() {
  return (
    <SingleGraphDashboard
      dataSettings={{
        data: [
          { Country: 'Country A', Value: 8, Region: 'Region A', Category: 'Category A' },
          { Country: 'Country C', Value: 42, Region: 'Region C', Category: 'Category B' },
          { Country: 'Country D', Value: 10, Region: 'Region D', Category: 'Category C' },
        ],
      }}
      graphType='barChart'
      graphDataConfiguration={[
        { columnId: 'Country', chartConfigId: 'label' },
        { columnId: 'Value', chartConfigId: 'size' },
      ]}
      filters={[
        {
          column: 'Region',
          singleSelect: false,
          clearable: true,
          label: 'Filter by column name',
        },
      ]}
      graphSettings={{
        graphTitle: <div>hello</div>,
        graphDescription: 'Description of the graph',
        sources: [
          {
            source: 'Organization ABC',
            link: 'www.example.com',
          },
        ],
        footNote: 'Footnote of the graph',
        padding: '16px 32px 16px 16px',
      }}
    />
  );
}

export default App;
