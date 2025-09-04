import { P } from '@undp/design-system-react/Typography';

import { ThreeDGlobe } from '../../Graphs/Maps/ThreeDGlobe';

import { getValues } from '@/Utils/getValues';
import { GraphConfigurationDataType, GraphSettingsDataType, ThreeDGraphType } from '@/Types';

interface Props {
  graph: ThreeDGraphType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  graphData: any;
  settings?: GraphSettingsDataType;
  debugMode?: boolean;
  graphDataConfiguration?: GraphConfigurationDataType[];
  readableHeader: {
    value: string;
    label: string;
  }[];
  updateFilters?: (_d: string) => void;
}

function ThreeDGraphEl(props: Props) {
  const {
    settings,
    graph,
    graphData,
    debugMode,
    graphDataConfiguration,
    readableHeader,
    updateFilters,
  } = props;
  if (debugMode) {
    // eslint-disable-next-line no-console
    console.log(`Graph: ${graph}`);
    // eslint-disable-next-line no-console
    console.log('Transformed data:', graphData);
    // eslint-disable-next-line no-console
    console.log('Settings:', settings);
  }
  if (typeof graphData === 'string')
    return (
      <div
        className={`flex my-0 mx-auto grow flex-col justify-center ${
          settings?.width ? 'w-fit' : 'w-full'
        }`}
        style={{ height: 'inherit' }}
      >
        <P
          size='sm'
          marginBottom='none'
          className='p-2 text-center text-accent-dark-red dark:text-accent-red'
        >
          {graphData}
        </P>
      </div>
    );
  const graphComponents: Record<ThreeDGraphType, React.ElementType | null> = {
    threeDGlobe: ThreeDGlobe,
  };
  const getGraphProps = (graphType: ThreeDGraphType) => {
    switch (graphType) {
      case 'threeDGlobe':
        return {
          globeOffset: settings?.globeOffset,
          polygonAltitude: settings?.polygonAltitude,
          highlightedIds: settings?.highlightedIds,
          scale: settings?.scale,
          theme: settings?.theme,
          resetSelectionOnDoubleClick: settings?.resetSelectionOnDoubleClick,
          graphTitle: settings?.graphTitle,
          mapData: settings?.mapData,
          graphDescription: settings?.graphDescription,
          footNote: settings?.footNote,
          width: settings?.width,
          height: settings?.height,
          sources: settings?.sources,
          colorDomain: settings?.colorDomain as string[] | number[],
          colors: settings?.colors as string[] | undefined,
          colorLegendTitle:
            Object.keys(settings || {}).indexOf('colorLegendTitle') !== -1
              ? settings?.colorLegendTitle
              : getValues('x', graphDataConfiguration || [], readableHeader || []),
          scaleType: settings?.scaleType,
          data: graphData,
          centerPoint: settings?.centerPoint,
          backgroundColor: settings?.backgroundColor,
          mapNoDataColor: settings?.mapNoDataColor,
          mapBorderColor: settings?.mapBorderColor,
          relativeHeight: settings?.relativeHeight,
          padding: settings?.padding,
          tooltip: settings?.tooltip,
          showColorScale: settings?.showColorScale,
          graphID: settings?.graphID,
          dataDownload: settings?.dataDownload,
          mapProperty: settings?.mapProperty,
          language: settings?.language,
          minHeight: settings?.minHeight,
          ariaLabel: settings?.ariaLabel,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onSeriesMouseClick: (el: any) => {
            updateFilters?.(el.id);
          },
          detailsOnClick: settings?.detailsOnClick,
          styles: settings?.styles,
          classNames: settings?.classNames,
          categorical: settings?.categorical,
          autoRotate: settings?.autoRotate,
          globeMaterial: settings?.globeMaterial,
          atmosphereColor: settings?.atmosphereColor,
          enableZoom: settings?.enableZoom,
          atmosphereAltitude: settings?.atmosphereAltitude,
          globeCurvatureResolution: settings?.globeCurvatureResolution,
          lightColor: settings?.lightColor,
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

export default ThreeDGraphEl;
