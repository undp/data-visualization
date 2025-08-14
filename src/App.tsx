import { UnitChart } from './Components/Graphs/UnitChart';
import './styles/styles.css';
import '@undp/design-system-react/style.css';

function App() {
  return (
    <>
      <UnitChart
        data={[
          {
            label: 'Male',
            value: 3,
          },
          {
            label: 'Female',
            value: 8,
          },
        ]}
        showStrokeForWhiteDots
        animate
      />
    </>
  );
}

export default App;
