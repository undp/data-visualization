import { ExpandIcon, X } from '../Icons';

interface Props {
  setExpanded: (value: boolean) => void;
}

export function LegendExpandButton(props: Props) {
  const { setExpanded } = props;
  return (
    <button
      type='button'
      className='p-1 border-0 rounded-sm text-content-secondary bg-surface-sm map-legend-button cursor-pointer hover:bg-surface-md'
      onClick={() => {
        setExpanded(true);
      }}
    >
      <ExpandIcon />
    </button>
  );
}

export function LegendCollapseButton(props: Props) {
  const { setExpanded } = props;
  return (
    <button
      type='button'
      className='bg-surface-sm/70 border border-stroke rounded-full w-6 h-6 p-[3px] cursor-pointer z-10 absolute right-[-0.75rem] top-[-0.75rem] hover:bg-surface-sm'
      onClick={() => {
        setExpanded(false);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          setExpanded(false);
        }
      }}
    >
      <X />
    </button>
  );
}
