import { SingleGraphDashboard } from './Components/Dashboard/SingleGraphDashboard';
import './styles/styles.css';
import '@undp/design-system-react/style.css';

function App() {
  return (
    <>
      <SingleGraphDashboard
        graphType='geoHubMap'
        graphSettings={{
          graphTitle: 'Population Density Map',
          graphDescription: 'This map shows population density by region.',
          footNote: 'Data from national census 2021',
          ariaLabel: 'Population density map visualization',
          backgroundColor: '#ffffff',
          width: 800,
          height: 600,
          minHeight: 400,
          relativeHeight: 1.2,
          padding: '1rem',
          mapStyle: [
            {
              style:
                'https://api.maptiler.com/maps/hybrid/style.json?key=YbCPLULzWdf1NplssEIc#0.8/-14.45028/20.54042',
              name: 'Light',
            },
          ],
          center: [78.9629, 20.5937],
          zoomLevel: 4,
          language: 'en',
          theme: 'light',
          uiMode: 'normal',
          graphID: 'population-density-map',
        }}
      />
    </>
  );
}

export default App;
