import { useRef } from 'react';
import { cn } from '@undp/design-system-react/cn';

import GeoHubMapsEl from './GeoHubMapsEl';

import { GeoHubGraphType, GraphSettingsDataType } from '@/Types';
import { GraphHeader } from '@/Components/Elements/GraphHeader';

interface Props {
  graphSettings?: GraphSettingsDataType;
  graphType: GeoHubGraphType;
  debugMode?: boolean;
  uiMode?: 'light' | 'normal';
}

export function SingleGraphDashboardGeoHubMaps(props: Props) {
  const { graphSettings, graphType, debugMode, uiMode = 'normal' } = props;
  const graphParentDiv = useRef<HTMLDivElement>(null);
  return (
    <div
      className={`${graphSettings?.theme || 'light'} flex ${
        graphSettings?.width ? 'w-fit grow-0' : 'w-full grow'
      }${graphSettings?.height ? '' : ' h-full'}`}
      dir={graphSettings?.language === 'he' || graphSettings?.language === 'ar' ? 'rtl' : undefined}
    >
      <div
        className={cn(
          `${
            !graphSettings?.backgroundColor
              ? 'bg-transparent '
              : graphSettings?.backgroundColor === true
                ? 'bg-primary-gray-200 dark:bg-primary-gray-650 '
                : ''
          }ml-auto mr-auto flex flex-col grow h-inherit ${graphSettings?.language || 'en'}`,
          graphSettings?.classNames?.graphContainer,
        )}
        style={{
          ...(graphSettings?.styles?.graphContainer || {}),
          ...(graphSettings?.backgroundColor && graphSettings?.backgroundColor !== true
            ? { backgroundColor: graphSettings?.backgroundColor }
            : {}),
        }}
        id={graphSettings?.graphID}
        ref={graphParentDiv}
      >
        <div
          style={{
            padding: graphSettings?.backgroundColor
              ? graphSettings?.padding || '1rem'
              : graphSettings?.padding || 0,
            flexGrow: 1,
            display: 'flex',
          }}
        >
          <div className='flex flex-col w-full gap-4 grow justify-between'>
            <GraphHeader
              styles={{
                title: graphSettings?.styles?.title,
                description: graphSettings?.styles?.description,
              }}
              classNames={{
                title: graphSettings?.classNames?.title,
                description: graphSettings?.classNames?.description,
              }}
              graphTitle={graphSettings?.graphTitle}
              graphDescription={graphSettings?.graphDescription}
              width={graphSettings?.width}
            />
            <GeoHubMapsEl
              graph={graphType}
              debugMode={debugMode}
              settings={{
                ...(graphSettings || {}),
                graphTitle: undefined,
                graphDescription: undefined,
                graphDownload: false,
                dataDownload: false,
                backgroundColor: undefined,
                padding: '0',
                uiMode,
                theme: graphSettings?.theme,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
