import { ScrollStory } from './Components/Dashboard/ScrollStory';
import './styles/styles.css';
import '@undp/design-system-react/style.css';

function App() {
  return (
    <>
      <ScrollStory
        chapters={[
          {
            dataSettings: {
              data: [
                {
                  Country: 'Country A',
                  Value1: 20,
                  Value: 8,
                  Region: 'Region A',
                  Category: 'Category A',
                },
                {
                  Country: 'Country C',
                  Value1: 20,
                  Value: 42,
                  Region: 'Region C',
                  Category: 'Category B',
                },
                {
                  Country: 'Country D',
                  Value1: 20,
                  Value: 10,
                  Region: 'Region D',
                  Category: 'Category C',
                },
              ],
            },
            graphType: 'barChart',
            graphSettings: {
              graphTitle: 'Title of the graph',
              graphDescription: 'Description of the graph',
              sources: [
                {
                  source: 'Organization ABC',
                  link: 'www.example.com',
                },
              ],
              footNote: 'Footnote of the graph',
              padding: '16px 32px 16px 16px',
            },
            graphDataConfiguration: [
              { columnId: 'Country', chartConfigId: 'label' },
              { columnId: 'Value', chartConfigId: 'size' },
            ],
            sections: [
              {
                graphDataConfiguration: [
                  { columnId: 'Country', chartConfigId: 'label' },
                  { columnId: 'Value', chartConfigId: 'size' },
                ],
                infoBox: { description: 'Welcome to the journey!' },
              },
              {
                graphDataConfiguration: [
                  { columnId: 'Country', chartConfigId: 'label' },
                  { columnId: 'Value1', chartConfigId: 'size' },
                ],
                infoBox: { description: 'Welcome to the journey!' },
              },
            ],
          },
        ]}
        infoWidth='480px'
        infoPosition='right'
        infoBackgroundColor='rgba(255,255,255,0.8)'
      />
    </>
  );
}

export default App;
