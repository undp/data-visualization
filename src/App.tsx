import { GriddedGraphs } from './Components/Dashboard/GriddedGraphs';
import './styles/styles.css';
import '@undp/design-system-react/style.css';

function App() {
  return (
    <>
      <GriddedGraphs
        graphSettings={{
          graphTitle: 'Sample Graph',
          graphDescription: 'This is a sample graph description.',
          padding: '1rem',
          noOfXTicks: 5,
          lineColors: ['#ff0000', '#f0f000'],
        }}
        showCommonColorScale
        dataSettings={{
          data: [
            {
              Region: 'Region A',
              date: 2020,
              Value1: 5,
              Value: 103,
              Category: 'Category A',
            },
            {
              Region: 'Region A',
              date: 2021,
              Value1: 5,
              Value: 97,
              Category: 'Category B',
            },
            {
              Region: 'Region A',
              date: 2022,
              Value1: 5,
              Value: 95,
              Category: 'Category B',
            },
            {
              Region: 'Region A',
              date: 2023,
              Value1: 5,
              Value: 123,
              Category: 'Category A',
            },
            {
              Region: 'Region A',
              date: 2024,
              Value1: 5,
              Value: 99,
              Category: 'Category C',
            },
            {
              Region: 'Region B',
              date: 2020,
              Value1: 5,
              Value: 96,
              Category: 'Category A',
            },
            {
              Region: 'Region B',
              date: 2021,
              Value1: 5,
              Value: 71,
              Category: 'Category B',
            },
            {
              Region: 'Region B',
              date: 2022,
              Value1: 5,
              Value: 61,
              Category: 'Category B',
            },
            {
              Region: 'Region B',
              date: 2023,
              Value1: 5,
              Value: 128,
              Category: 'Category A',
            },
            {
              Region: 'Region B',
              date: 2024,
              Value1: 5,
              Value: 75,
              Category: 'Category C',
            },
            {
              Region: 'Region C',
              date: 2020,
              Value1: 5,
              Value: 148,
              Category: 'Category C',
            },
            {
              Region: 'Region C',
              date: 2021,
              Value1: 5,
              Value: 124,
              Category: 'Category B',
            },
            {
              Region: 'Region C',
              date: 2022,
              Value1: 5,
              Value: 130,
              Category: 'Category A',
            },
            {
              Region: 'Region C',
              date: 2023,
              Value1: 5,
              Value: 60,
              Category: 'Category A',
            },
            {
              Region: 'Region C',
              date: 2024,
              Value1: 5,
              Value: 67,
              Category: 'Category B',
            },
          ],
          fileType: 'csv' as const,
        }}
        graphType='multiLineChart'
        graphDataConfiguration={[
          {
            columnId: 'date',
            chartConfigId: 'date',
          },
          {
            columnId: ['Value1', 'Value'],
            chartConfigId: 'y',
          },
        ]}
        columnGridBy='Region'
        minGraphWidth={320}
        minGraphHeight={320}
      />
    </>
  );
}

export default App;
