import { H3, P, A } from '@undp/design-system-react';
import './styles/styles.css';
import '@undp/design-system-react/style.css';

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
        This open-source graphing library, developed by the United Nations Development Programme,
        offers ready-to-use charts, including bar charts, line charts, area charts, and more. You
        can access the documentation{' '}
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
