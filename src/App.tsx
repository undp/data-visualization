import { useState } from 'react';

import { SimpleBarGraph } from './Components/Graphs/BarGraph';
import './styles/styles.css';
import '@undp/design-system-react/style.css';

function App() {
  const [data, setData] = useState([
    {
      label: '2020 Q1',
      size: 3,
    },
    {
      label: '2020 Q2',
      size: 8,
    },
    {
      label: '2020 Q3',
      size: 11,
    },
    {
      label: '2020 Q4',
      size: 19,
    },
    {
      label: '2021 Q1',
      size: 3,
    },
    {
      label: '2022 Q2',
      size: 8,
    },
    {
      label: '2023 Q3',
      size: 11,
    },
    {
      label: '2024 Q4',
      size: 19,
    },
  ]);
  return (
    <>
      <div style={{ width: '100%', height: '2000px', backgroundColor: '#fff000' }} />
      <button
        onClick={() => {
          setData(data.map(d => ({ ...d, size: d.size * Math.random() * 5 })));
        }}
      >
        Click here
      </button>
      <SimpleBarGraph
        data={data}
        animate={{ duration: 10, once: false, amount: 0 }}
        height={1000}
      />
    </>
  );
}

export default App;
