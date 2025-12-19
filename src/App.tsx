import '@undp/design-system-react/style.css';
import './styles/styles.css';
import { DotDensityMap } from './Components/Graphs/Maps/DotDensityMap';

function App() {
  return (
    <DotDensityMap
      data={[
        {
          lat: 20,
          long: 10,
        },
        {
          lat: 25,
          long: 26,
        },
        {
          lat: 0,
          long: 0,
        },
        {
          lat: 15,
          long: 5,
        },
        {
          lat: 10,
          long: 20,
        },
      ]}
      onSeriesMouseClick={function YJ() {}}
      onSeriesMouseOver={function YJ() {}}
    />
  );
}

export default App;
