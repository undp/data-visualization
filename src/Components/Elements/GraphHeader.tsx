import { RefObject } from 'react';

import { CsvDownloadButton } from '@/Components/Actions/CsvDownloadButton';
import { ImageDownloadButton } from '@/Components/Actions/ImageDownloadButton';
import { GraphDescription } from '@/Components/Typography/GraphDescription';
import { GraphTitle } from '@/Components/Typography/GraphTitle';

interface Props {
  graphTitle?: string | React.ReactNode;
  graphDescription?: string | React.ReactNode;
  width?: number;
  graphDownload?: RefObject<HTMLDivElement | null>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataDownload?: any;
  isDashboard?: boolean;
  styles?: { title?: React.CSSProperties; description?: React.CSSProperties };
  classNames?: { title?: string; description?: string };
}

export function GraphHeader(props: Props) {
  const {
    graphTitle,
    graphDescription,
    width,
    graphDownload,
    dataDownload,
    isDashboard,
    styles,
    classNames,
  } = props;
  return (
    <div
      className={`flex gap-2 justify-between pb-4 ${
        graphDescription && graphTitle ? 'items-start' : 'items-center'
      }`}
      style={{ maxWidth: width ? `${width}px` : 'none' }}
      aria-label='Graph header'
    >
      <div className='flex-col flex gap-1'>
        {graphTitle ? (
          <GraphTitle
            text={graphTitle}
            isDashboard={isDashboard}
            style={styles?.title}
            className={classNames?.title}
          />
        ) : null}
        {graphDescription ? (
          <GraphDescription
            text={graphDescription}
            style={styles?.description}
            className={classNames?.description}
          />
        ) : null}
      </div>
      {graphDownload || dataDownload ? (
        <div className='flex gap-3'>
          {graphDownload ? <ImageDownloadButton nodeID={graphDownload} buttonSmall /> : null}
          {dataDownload && dataDownload.length > 0 ? (
            <CsvDownloadButton
              csvData={dataDownload}
              buttonSmall
              headers={Object.keys(dataDownload[0]).map(d => ({
                label: d,
                key: d,
              }))}
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
