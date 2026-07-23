interface Props {
  handleZoom: (direction: 'in' | 'out') => void;
}

export function MapZoomButton(props: Props) {
  const { handleZoom } = props;
  return (
    <div className='absolute left-4 top-4 flex flex-col undp-viz-zoom-buttons'>
      <button
        type='button'
        onClick={() => handleZoom('in')}
        className='leading-0 px-2 py-3.5 text-content-secondary border border-stroke bg-surface-sm'
      >
        +
      </button>
      <button
        type='button'
        onClick={() => handleZoom('out')}
        className='leading-0 px-2 py-3.5 text-content-secondary border border-t-0 border-stroke bg-surface-sm'
      >
        –
      </button>
    </div>
  );
}
