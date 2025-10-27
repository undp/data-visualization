import { useRef } from 'react';

import GeoHubMapsEl from './GeoHubMapsEl';

import { GeoHubGraphType, GraphSettingsDataType } from '@/Types';
import { GraphHeader } from '@/Components/Elements/GraphHeader';
import { GraphContainer } from '@/Components/Elements/GraphContainer';

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
    <GraphContainer
      className={graphSettings?.classNames?.graphContainer}
      style={graphSettings?.styles?.graphContainer}
      id={graphSettings?.graphID}
      ref={graphParentDiv}
      aria-label={graphSettings?.ariaLabel}
      backgroundColor={graphSettings?.backgroundColor ?? false}
      theme={graphSettings?.theme || 'light'}
      language={graphSettings?.language || 'en'}
      width={graphSettings?.width}
      height={graphSettings?.height}
      padding={graphSettings?.padding}
    >
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
    </GraphContainer>
  );
}
