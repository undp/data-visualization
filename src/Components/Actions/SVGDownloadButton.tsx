import { Button } from '@undp/design-system-react/Button';
import { cn } from '@undp/design-system-react/cn';
import type { JSX } from 'react';
import { ImageDown } from '@/Components/Icons';
import { svgDownload } from '@/Utils/svgDownload';

interface Props {
  buttonContent?: string | JSX.Element;
  buttonType?:
    | 'link'
    | 'primary'
    | 'secondary'
    | 'background'
    | 'error'
    | 'tertiary'
    | 'warning'
    | 'success'
    | 'info'
    | 'quaternary'
    | 'surface'
    | 'outline'
    | 'icon'
    | 'surface-hard'
    | 'background-soft'
    | 'foreground'
    | 'foreground-soft';
  nodeID: string | HTMLElement;
  filename?: string;
  buttonSmall?: boolean;
  className?: string;
}

export function SVGDownloadButton(props: Props) {
  const {
    nodeID,
    filename = 'image',
    buttonContent,
    buttonType = 'surface',
    buttonSmall,
    className = '',
  } = props;
  return (
    <Button
      variant={buttonType}
      className={cn(
        'undp-viz-download-button border border-stroke',
        buttonSmall ? 'p-2' : 'py-4 px-6',
        className,
      )}
      onClick={() => {
        if (typeof nodeID === 'string') {
          if (document.getElementById(nodeID)) {
            svgDownload(document.getElementById(nodeID) as HTMLElement, filename);
          } else {
            console.error('Cannot find the html element');
          }
        } else {
          svgDownload(nodeID as HTMLElement, filename);
        }
      }}
      aria-label='Click to download the graph as svg'
    >
      {buttonContent || <ImageDown />}
    </Button>
  );
}
