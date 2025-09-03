import './styles/styles.css';
import '@undp/design-system-react/style.css';
import { CirclePackingGraph } from './Components/Graphs/CirclePackingGraph';

function App() {
  return (
    <CirclePackingGraph
      data={[
        {
          label: '2010',
          size: 3,
        },
        {
          label: '2012',
          size: 8,
        },
        {
          label: '2014',
          size: 11,
        },
        {
          label: '2016',
          size: 19,
        },
        {
          label: '2018',
          size: 3,
        },
        {
          label: '2020',
          size: 8,
        },
        {
          label: '2022',
          size: 11,
        },
        {
          label: '2024',
          size: 19,
        },
      ]}
      onSeriesMouseClick={function WJ() {}}
      onSeriesMouseOver={function WJ() {}}
    />
  );
}

export default App;
