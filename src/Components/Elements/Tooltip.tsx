import { cn } from '@undp/design-system-react/cn';
import { createPortal } from 'react-dom';

import { string2HTML } from '@/Utils/string2HTML';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: string | ((_d: any) => React.ReactNode);
  xPos: number;
  yPos: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  if (
    (typeof body === 'function' && (body(data) === null || body(data) === undefined)) ||
    body === ''
  ) {
    return null;
  }
  return createPortal(
    <div className='undp-container'>
      <div
        className={cn(
          'graph-tooltip block p-2 fixed z-[1000] bg-primary-gray-200 dark:bg-primary-gray-600 border border-primary-gray-300 dark:border-primary-gray-500',
          className,
        )}
        style={{
          ...backgroundStyle,
          top: `${yPos < window.innerHeight / 2 ? yPos - 10 : yPos + 10}px`,
          left: `${xPos > window.innerWidth / 2 ? xPos - 10 : xPos + 10}px`,
          transform: `translate(${
            xPos > window.innerWidth / 2 ? '-100%' : '0%'
          },${yPos > window.innerHeight / 2 ? '-100%' : '0%'})`,
        }}
      >
        <div
          className='text-sm leading-normal text-primary-black dark:text-primary-gray-100 m-0'
          dangerouslySetInnerHTML={
            typeof body === 'string' ? { __html: string2HTML(body, data) } : undefined
          }
        >
          {typeof body === 'function' ? body(data) : null}
        </div>
      </div>
    </div>,
    document.body,
  );
}
