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
      <h3 className='undp-viz-typography' style={{ textAlign: 'center', paddingTop: '24px' }}>
        UNDP Data Visualization Library
      </h3>
      <p className='undp-viz-typography' style={{ textAlign: 'center' }}>
        This open-source graphing library, developed by the United Nations Development Programme,
        offers ready-to-use charts, including bar charts, line charts, area charts, and more. You
        can access the documentation{' '}
        <a
          href='https://data-viz.data.undp.org/'
          target='_blank'
          rel='noreferrer'
          className='undp-viz-style'
        >
          here
        </a>
        .
      </p>
      <p
        className='undp-viz-typography'
        style={{
          fontSize: '16px',
          textAlign: 'center',
        }}
      >
        For any feedback or inquiries, please feel free to reach out to us at{' '}
        <a href='mailto:data@undp.org' target='_blank' rel='noreferrer' className='undp-viz-style'>
          data@undp.org
        </a>
      </p>
    </div>
  );
}

export default App;
