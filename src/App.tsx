import { MultiLineChart } from './Components/Graphs/LineCharts/MultiLineChart';
import './styles/styles.css';
import '@undp/design-system-react/style.css';

function App() {
  return (
    <>
      <MultiLineChart
        animate
        data={[
          {
            date: '2020',
            y: [3, 5],
          },
          {
            date: '2021',
            y: [8, 5],
          },
          {
            date: '2022',
            y: [11, 5],
          },
          {
            date: '2023',
            y: [19, 5],
          },
          {
            date: '2024',
            y: [3, 5],
          },
          {
            date: '2025',
            y: [8, 5],
          },
          {
            date: '2026',
            y: [11, 5],
          },
          {
            date: '2027',
            y: [19, 5],
          },
        ]}
        labels={['Apples', 'Oranges']}
        labelsToBeHidden={['Oranges']}
      />
    </>
  );
}

export default App;
