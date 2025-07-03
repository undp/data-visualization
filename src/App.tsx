import './styles/styles.css';
import '@undp/design-system-react/style.css';
import { DataTable } from './Components/Graphs/DataTable';

function App() {
  return (
    <DataTable
      columnData={[
        {
          columnId: 'label',
          columnTitle: 'Label',
        },
        {
          align: 'right',
          columnId: 'value1',
          columnTitle: 'Value #1',
          sortable: true,
        },
        {
          align: 'center',
          columnId: 'value2',
          columnTitle: 'Value #2',
        },
        {
          columnId: 'value3',
          columnTitle: 'Value #3',
          prefix: 'US $ ',
        },
      ]}
      data={[
        {
          label: '2020 Q1',
          value1: 3,
          value2: 3,
          value3: 3,
        },
        {
          label: '2020 Q2',
          value1: 8,
          value2: 3,
          value3: 3,
        },
        {
          label: '2020 Q3',
          value1: 11,
          value2: 3,
          value3: 3,
        },
        {
          label: '2020 Q4',
          value1: 19,
          value2: 3,
          value3: 3,
        },
      ]}
      onSeriesMouseClick={function Xs() {}}
    />
  );
}

export default App;
