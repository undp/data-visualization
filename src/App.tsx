import './styles/styles.css';
import '@undp/design-system-react/style.css';
import { SimpleBarGraph } from './Components/Graphs/BarGraph';

function App() {
  return (
    <SimpleBarGraph
      filterNA={false}
      data={[
        {
          date: '2020',
          label: 'Category 1',
          size: 7,
        },
        {
          date: '2021',
          label: 'Category 1',
          size: -12,
        },
        {
          date: '2022',
          label: 'Category 1',
          size: 5,
        },
        {
          date: '2023',
          label: 'Category 1',
          size: 14,
        },
        {
          date: '2024',
          label: 'Category 1',
          size: 9,
        },
        {
          date: '2020',
          label: 'Category 2',
          size: 8,
        },
        {
          date: '2021',
          label: 'Category 2',
          size: 15,
        },
        {
          date: '2022',
          label: 'Category 2',
          size: 6,
        },
        {
          date: '2023',
          label: 'Category 2',
          size: 13,
        },
        {
          date: '2024',
          label: 'Category 2',
          size: 10,
        },
        {
          date: '2020',
          label: 'Category 3',
          size: 9,
        },
        {
          date: '2021',
          label: 'Category 3',
          size: 14,
        },
        {
          date: '2022',
          label: 'Category 3',
          size: 8,
        },
        {
          date: '2023',
          label: 'Category 3',
          size: 17,
        },
        {
          date: '2024',
          label: 'Category 3',
          size: 12,
        },
        {
          date: '2020',
          label: 'Category 4',
          size: 10,
        },
        {
          date: '2021',
          label: 'Category 4',
          size: 11,
        },
        {
          date: '2022',
          label: 'Category 4',
          size: 13,
        },
        {
          date: '2023',
          label: 'Category 4',
          size: undefined,
        },
        {
          date: '2024',
          label: 'Category 4',
          size: 7,
        },
      ]}
      timeline={{
        enabled: true,
        autoplay: false,
        showOnlyActiveDate: true,
        speed: 1000,
      }}
      animate
      sortData='desc'
      onSeriesMouseClick={function WJ() {}}
      onSeriesMouseOver={function WJ() {}}
    />
  );
}

export default App;
