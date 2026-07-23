import { Button } from '@undp/design-system-react/Button';
import { cn } from '@undp/design-system-react/cn';
import type { JSX, RefObject } from 'react';
import { ImageDown } from '@/Components/Icons';
import { imageDownload } from '@/Utils/imageDownload';

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
  nodeID: string | RefObject<HTMLDivElement | null>;
  filename?: string;
  buttonSmall?: boolean;
  className?: string;
}

export function ImageDownloadButton(props: Props) {
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
        'undp-viz-download-button no-underline border border-stroke',
        buttonSmall ? 'p-2' : 'py-4 px-6',
        className,
      )}
      onClick={() => {
        if (typeof nodeID === 'string') {
          if (document.getElementById(nodeID)) {
            imageDownload(document.getElementById(nodeID) as HTMLElement, filename);
          } else {
            console.error('Cannot find the html element');
          }
        } else {
          imageDownload(nodeID.current as HTMLDivElement, filename);
        }
      }}
      aria-label='Click to download the graph as image'
    >
      {buttonContent || <ImageDown />}
    </Button>
  );
}
