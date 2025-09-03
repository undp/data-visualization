import { Button } from '@undp/design-system-react/Button';
import { JSX } from 'react';

import { svgDownload } from '@/Utils/svgDownload';
import { ImageDown } from '@/Components/Icons';

interface Props {
  buttonContent?: string | JSX.Element;
  buttonType?:
    | 'primary'
    | 'primary-without-icon'
    | 'secondary'
    | 'secondary-without-icon'
    | 'tertiary';
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
    buttonType = 'tertiary',
    buttonSmall,
    className = '',
  } = props;
  return (
    <Button
      variant={buttonType}
      className={`undp-viz-download-button ${buttonSmall ? 'p-2' : 'py-4 px-6'} ${className}`}
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
