import { cn } from '@undp/design-system-react/cn';
import { createPortal } from 'react-dom';

import { string2HTML } from '@/Utils/string2HTML';

interface Props {
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  body: string | ((_d: any) => React.ReactNode);
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
  if (
    (typeof body === 'function' && (body(data) === null || body(data) === undefined)) ||
    body === ''
  ) {
    return null;
  }
  return createPortal(
    <div className='undp-container'>
      <div
        className={cn('graph-tooltip block p-2 fixed z-[1000] bg-surface', className)}
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
          className='text-sm leading-normal text-content-primary m-0'
          // biome-ignore lint/security/noDangerouslySetInnerHtmlWithChildren: Allow setInnerHTML here
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Allow setInnerHTML here
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
