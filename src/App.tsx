import './styles/styles.css';
import '@undp/design-system-react/style.css';
import { ThreeDGlobe } from './Components/Graphs/Maps/ThreeDGlobe';

function App() {
  return (
    <ThreeDGlobe
      data={[
        {
          id: 'IND',
          x: 1,
        },
        {
          id: 'FIN',
          x: 2,
        },
        {
          id: 'IDN',
          x: 3,
        },
        {
          id: 'ZAF',
          x: 4,
        },
        {
          id: 'PER',
          x: 5,
        },
        {
          id: 'PAK',
          x: 6,
        },
        {
          id: 'USA',
          x: 7,
        },
        {
          id: 'SWE',
          x: 8,
        },
        {
          id: 'RUS',
          x: 10,
        },
      ]}
      highlightedIds={['IND', 'USA']}
    />
  );
}

export default App;
