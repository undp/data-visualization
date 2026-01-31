import '@undp/design-system-react/style.css';
import './styles/styles.css';
import { A, H3, P } from '@undp/design-system-react/Typography';

function App() {
  return (
    <div
      style={{
        height: '90vh',
        maxWidth: '712px',
        margin: '0 auto',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <img width='56' alt='undp-logo' src='/undp-logo-blue.svg' />
      <H3 style={{ textAlign: 'center', paddingTop: '24px' }}>UNDP Data Visualization Library</H3>
      <P style={{ textAlign: 'center' }}>
        This visualization library for react, developed by the United Nations Development Programme,
        offers various interactive visualizations such as graphs, maps, and animated charts. You can
        access the documentation{' '}
        <A href='https://dataviz.design.undp.org/' target='_blank' rel='noreferrer'>
          here
        </A>
        .
      </P>
      <P
        style={{
          textAlign: 'center',
        }}
      >
        For any feedback or inquiries, please feel free to reach out to us at{' '}
        <A href='mailto:data@undp.org' target='_blank' rel='noreferrer'>
          data@undp.org
        </A>
      </P>
    </div>
  );
}

export default App;
