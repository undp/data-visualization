import { P } from '@undp/design-system-react/Typography';

import { GeoHubCompareMaps } from '../../Graphs/Maps/GeoHubMaps/CompareMaps';
import { GeoHubMap } from '../../Graphs/Maps/GeoHubMaps/SimpleMap';
import { GeoHubMapWithLayerSelection } from '../../Graphs/Maps/GeoHubMaps/MapWithLayerSelection';

import { GraphSettingsDataType, GeoHubGraphType } from '@/Types';

interface Props {
  graph: GeoHubGraphType;
  settings?: GraphSettingsDataType;
  debugMode?: boolean;
}

function GeoHubMapsEl(props: Props) {
  const { settings, graph, debugMode } = props;
  if (debugMode) {
    // eslint-disable-next-line no-console
    console.log(`Graph: ${graph}`);
    // eslint-disable-next-line no-console
    console.log('Settings:', settings);
  }
  const graphComponents: Record<GeoHubGraphType, React.ElementType | null> = {
    geoHubCompareMap: GeoHubCompareMaps,
    geoHubMap: GeoHubMap,
    geoHubMapWithLayerSelection: GeoHubMapWithLayerSelection,
  };
  const getGraphProps = (graphType: GeoHubGraphType) => {
    switch (graphType) {
      case 'geoHubCompareMap':
        return {
          theme: settings?.theme,
          graphTitle: settings?.graphTitle,
          sources: settings?.sources,
          graphDescription: settings?.graphDescription,
          footNote: settings?.footNote,
          backgroundColor: settings?.backgroundColor,
          padding: settings?.padding,
          width: settings?.width,
          height: settings?.height,
          relativeHeight: settings?.relativeHeight,
          graphID: settings?.graphID,
          mapStyles: settings?.mapStyles as [string, string],
          center: settings?.center,
          zoomLevel: settings?.zoomLevel,
          language: settings?.language,
          minHeight: settings?.minHeight,
          ariaLabel: settings?.ariaLabel,
          styles: settings?.styles,
          classNames: settings?.classNames,
          mapLegend: settings?.mapLegend,
        };
      case 'geoHubMap':
        return {
          theme: settings?.theme,
          mapStyle: settings?.mapStyle,
          center: settings?.center,
          zoomLevel: settings?.zoomLevel,
          graphTitle: settings?.graphTitle,
          sources: settings?.sources,
          graphDescription: settings?.graphDescription,
          footNote: settings?.footNote,
          backgroundColor: settings?.backgroundColor,
          padding: settings?.padding,
          width: settings?.width,
          height: settings?.height,
          relativeHeight: settings?.relativeHeight,
          graphID: settings?.graphID,
          language: settings?.language,
          minHeight: settings?.minHeight,
          includeLayers: settings?.includeLayers,
          excludeLayers: settings?.excludeLayers,
          ariaLabel: settings?.ariaLabel,
          uiMode: settings?.uiMode,
          styles: settings?.styles,
          classNames: settings?.classNames,
          mapLegend: settings?.mapLegend,
        };
      case 'geoHubMapWithLayerSelection':
        return {
          theme: settings?.theme,
          mapStyle: settings?.mapStyle,
          center: settings?.center,
          zoomLevel: settings?.zoomLevel,
          graphTitle: settings?.graphTitle,
          sources: settings?.sources,
          graphDescription: settings?.graphDescription,
          footNote: settings?.footNote,
          backgroundColor: settings?.backgroundColor,
          padding: settings?.padding,
          width: settings?.width,
          height: settings?.height,
          relativeHeight: settings?.relativeHeight,
          graphID: settings?.graphID,
          language: settings?.language,
          minHeight: settings?.minHeight,
          layerSelection: settings?.layerSelection,
          excludeLayers: settings?.excludeLayers,
          ariaLabel: settings?.ariaLabel,
          uiMode: settings?.uiMode,
          mapLegend: settings?.mapLegend,
        };
      default:
        return {};
    }
  };
  const GraphComponent = graphComponents[graph];
  const graphProps = getGraphProps(graph);
  return (
    <div
      className={`grow my-0 mx-auto flex flex-col h-inherit ${settings?.width ? 'w-fit' : 'w-full'} justify-center ${settings?.theme || 'light'}`}
      style={{ minHeight: 'inherit' }}
    >
      {GraphComponent ? (
        <GraphComponent {...graphProps} />
      ) : (
        <P
          size='sm'
          marginBottom='none'
          className='p-2 text-center text-accent-dark-red dark:text-accent-red'
        >
          {`Invalid chart type: ${graph}`}
        </P>
      )}
    </div>
  );
}

export default GeoHubMapsEl;
