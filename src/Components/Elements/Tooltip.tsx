import { cn } from '@undp/design-system-react/cn';
import { createPortal } from 'react-dom';

interface Props {
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  body: (_d: any) => React.ReactNode;
  xPos: number;
  yPos: number;
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  data: any;
  backgroundStyle?: React.CSSProperties;
  className?: string;
}

export function Tooltip(props: Props) {
  const {
    body,
    xPos,
    yPos,
    data,
    backgroundStyle = {
      maxWidth: '24rem',
      wordWrap: 'break-word',
    },
    className,
  } = props;
  if (body(data) === null || body(data) === undefined) {
    return null;
  }
  return createPortal(
    <div className='undp-container'>
      <div
        className={cn('graph-tooltip block p-2 fixed z-1000 bg-surface', className)}
        style={{
          ...backgroundStyle,
          top: `${yPos < window.innerHeight / 2 ? yPos - 10 : yPos + 10}px`,
          left: `${xPos > window.innerWidth / 2 ? xPos - 10 : xPos + 10}px`,
          transform: `translate(${
            xPos > window.innerWidth / 2 ? '-100%' : '0%'
          },${yPos > window.innerHeight / 2 ? '-100%' : '0%'})`,
        }}
      >
        <div className='text-sm leading-normal text-content-primary m-0'>{body(data)}</div>
      </div>
    </div>,
    document.body,
  );
}
