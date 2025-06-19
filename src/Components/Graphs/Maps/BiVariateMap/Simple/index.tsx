import { useEffect, useRef, useState } from 'react';
import { cn } from '@undp/design-system-react';

import WorldMapData from '../../WorldMapData/data.json';

import { Graph } from './Graph';

import {
  BivariateMapDataType,
  Languages,
  SourcesDataType,
  StyleObject,
  ClassNameObject,
  MapProjectionTypes,
  ZoomInteractionTypes,
} from '@/Types';
import { GraphHeader } from '@/Components/Elements/GraphHeader';
import { GraphFooter } from '@/Components/Elements/GraphFooter';
import { Colors } from '@/Components/ColorPalette';
import { fetchAndParseJSON } from '@/Utils/fetchAndParseData';
import { getJenks } from '@/Utils/getJenks';

interface Props {
  // Data
  /** Array of data objects. */
  data: BivariateMapDataType[];

  // Titles, Labels, and Sources
  /** Title of the graph */
  graphTitle?: string | React.ReactNode;
  /** Description of the graph */
  graphDescription?: string | React.ReactNode;
  /** Footnote for the graph */
  footNote?: string | React.ReactNode;
  /** Source data for the graph */
  sources?: SourcesDataType[];
  /** Accessibility label */
  ariaLabel?: string;

  // Colors and Styling
  /** Colors for the choropleth map. Array must be 5x5 */
  colors?: string[][];
  /** Title for the first color legend */
  xColorLegendTitle?: string;
  /** Title for the second color legend */
  yColorLegendTitle?: string;
  /** Domain of x-colors for the map */
  xDomain?: number[];
  /** Domain of y-colors for the map */
  yDomain?: number[];
  /** Color for the areas where data is no available */
  mapNoDataColor?: string;
  /** Background color of the graph */
  backgroundColor?: string | boolean;
  /** Custom styles for the graph. Each object should be a valid React CSS style object. */
  styles?: StyleObject;
  /** Custom class names */
  classNames?: ClassNameObject;

  // Size and Spacing
  /** Width of the graph */
  width?: number;
  /** Height of the graph */
  height?: number;
  /** Minimum height of the graph */
  minHeight?: number;
  /** Relative height scaling factor. This overwrites the height props */
  relativeHeight?: number;
  /** Padding around the graph. Defaults to 0 if no backgroundColor is mentioned else defaults to 1rem */
  padding?: string;

  // Graph Parameters
  /** Map data as an object in geoJson format */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mapData?: any;
  /** Scaling factor for the map. Multiplies the scale number to scale. */
  scale?: number;
  /** Center point of the map */
  centerPoint?: [number, number];
  /** Defines the zoom mode for the map */
  zoomInteraction?: ZoomInteractionTypes;
  /** Stroke width of the regions in the map */
  mapBorderWidth?: number;
  /** Stroke color of the regions in the map */
  mapBorderColor?: string;
  /** Toggle if the map is a world map */
  isWorldMap?: boolean;
  /** Map projection type */
  mapProjection?: MapProjectionTypes;
  /** Extend of the allowed zoom in the map */
  zoomScaleExtend?: [number, number];
  /** Extend of the allowed panning in the map */
  zoomTranslateExtend?: [[number, number], [number, number]];
  /** Countries or regions to be highlighted */
  highlightedIds?: string[];
  /** Property in the property object in mapData geoJson object is used to match to the id in the data object */
  mapProperty?: string;
  /** Toggle visibility of color scale. This is only applicable if the data props hae color parameter */
  showColorScale?: boolean;
  /** Toggles the visibility of Antarctica in the default map. Only applicable for the default map. */
  showAntarctica?: boolean;
  /** Enable graph download option as png */
  graphDownload?: boolean;
  /** Enable data download option as a csv */
  dataDownload?: boolean;
  /** Reset selection on double-click. Only applicable when used in a dashboard context with filters. */
  resetSelectionOnDoubleClick?: boolean;

  // Interactions and Callbacks
  /** Tooltip content. If the type is string then this uses the [handlebar](../?path=/docs/misc-handlebars-templates-and-custom-helpers--docs) template to display the data */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tooltip?: string | ((_d: any) => React.ReactNode);
  /** Details displayed on the modal when user clicks of a data point. If the type is string then this uses the [handlebar](../?path=/docs/misc-handlebars-templates-and-custom-helpers--docs) template to display the data */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  detailsOnClick?: string | ((_d: any) => React.ReactNode);
  /** Callback for mouse over event */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseOver?: (_d: any) => void;
  /** Callback for mouse click event */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseClick?: (_d: any) => void;

  // Configuration and Options
  /** Language setting  */
  language?: Languages;
  /** Color theme */
  theme?: 'light' | 'dark';
  /** Unique ID for the graph */
  graphID?: string;
}

export function BiVariateChoroplethMap(props: Props) {
  const {
    data,
    mapData,
    graphTitle,
    colors = Colors.light.bivariateColors.colors05x05,
    sources,
    graphDescription,
    height,
    width,
    footNote,
    xDomain,
    yDomain,
    xColorLegendTitle = 'X Color key',
    yColorLegendTitle = 'Y Color key',
    tooltip,
    scale = 0.95,
    centerPoint,
    padding,
    mapBorderWidth = 0.5,
    mapNoDataColor = Colors.light.graphNoData,
    backgroundColor = false,
    mapBorderColor = Colors.light.grays['gray-500'],
    relativeHeight,
    onSeriesMouseOver,
    isWorldMap = true,
    zoomScaleExtend = [0.8, 6],
    zoomTranslateExtend,
    graphID,
    showColorScale = true,
    highlightedIds = [],
    onSeriesMouseClick,
    mapProperty = 'ISO3',
    graphDownload = false,
    dataDownload = false,
    showAntarctica = false,
    language = 'en',
    minHeight = 0,
    theme = 'light',
    ariaLabel,
    resetSelectionOnDoubleClick = true,
    detailsOnClick,
    styles,
    classNames,
    mapProjection,
    zoomInteraction = 'button',
  } = props;

  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [mapShape, setMapShape] = useState<any>(undefined);

  const graphDiv = useRef<HTMLDivElement>(null);
  const graphParentDiv = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      setSvgWidth(width || entries[0].contentRect.width || 760);
      setSvgHeight(height || entries[0].target.clientHeight || 480);
    });
    if (graphDiv.current) {
      setSvgHeight(graphDiv.current.clientHeight || 480);
      setSvgWidth(graphDiv.current.clientWidth || 760);
      if (!width) resizeObserver.observe(graphDiv.current);
    }
    return () => resizeObserver.disconnect();
  }, [width, height]);
  useEffect(() => {
    if (typeof mapData === 'string') {
      const fetchData = fetchAndParseJSON(mapData);
      fetchData.then(d => {
        setMapShape(d);
      });
    } else {
      setMapShape(mapData || WorldMapData);
    }
  }, [mapData]);

  if (xDomain && yDomain)
    if (xDomain.length !== colors[0].length - 1 || yDomain.length !== colors.length - 1) {
      console.error("the xDomain and yDomain array length don't match to the color array length");
      return null;
    }
  return (
    <div
      className={`${theme || 'light'} flex  ${width ? 'w-fit grow-0' : 'w-full grow'}`}
      dir={language === 'he' || language === 'ar' ? 'rtl' : undefined}
    >
      <div
        className={cn(
          `${
            !backgroundColor
              ? 'bg-transparent '
              : backgroundColor === true
                ? 'bg-primary-gray-200 dark:bg-primary-gray-650 '
                : ''
          }ml-auto mr-auto flex flex-col grow h-inherit ${language || 'en'}`,
          classNames?.graphContainer,
        )}
        style={{
          ...(styles?.graphContainer || {}),
          ...(backgroundColor && backgroundColor !== true ? { backgroundColor } : {}),
        }}
        id={graphID}
        ref={graphParentDiv}
        aria-label={
          ariaLabel ||
          `${
            graphTitle ? `The graph shows ${graphTitle}. ` : ''
          }This is bi-variate choropleth map where geographic areas are colored in proportion to two variables.${
            graphDescription ? ` ${graphDescription}` : ''
          }`
        }
      >
        <div
          className='flex grow'
          style={{ padding: backgroundColor ? padding || '1rem' : padding || 0 }}
        >
          <div className='flex flex-col w-full gap-4 grow justify-between'>
            {graphTitle || graphDescription || graphDownload || dataDownload ? (
              <GraphHeader
                styles={{
                  title: styles?.title,
                  description: styles?.description,
                }}
                classNames={{
                  title: classNames?.title,
                  description: classNames?.description,
                }}
                graphTitle={graphTitle}
                graphDescription={graphDescription}
                width={width}
                graphDownload={graphDownload ? graphParentDiv.current : undefined}
                dataDownload={
                  dataDownload
                    ? data.map(d => d.data).filter(d => d !== undefined).length > 0
                      ? data.map(d => d.data).filter(d => d !== undefined)
                      : data.filter(d => d !== undefined)
                    : null
                }
              />
            ) : null}
            <div
              className='flex flex-col grow justify-center leading-0'
              ref={graphDiv}
              aria-label='Map area'
            >
              {(width || svgWidth) && (height || svgHeight) && mapShape ? (
                <Graph
                  data={data}
                  mapData={
                    showAntarctica
                      ? mapShape
                      : {
                          ...mapShape,
                          features: mapShape.features.filter(
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            (el: any) => el.properties.NAME !== 'Antarctica',
                          ),
                        }
                  }
                  xDomain={
                    xDomain ||
                    getJenks(
                      data.map(d => d.x as number | null | undefined),
                      colors[0].length,
                    )
                  }
                  yDomain={
                    yDomain ||
                    getJenks(
                      data.map(d => d.y as number | null | undefined),
                      colors.length,
                    )
                  }
                  width={width || svgWidth}
                  height={Math.max(
                    minHeight,
                    height ||
                      (relativeHeight
                        ? minHeight
                          ? (width || svgWidth) * relativeHeight > minHeight
                            ? (width || svgWidth) * relativeHeight
                            : minHeight
                          : (width || svgWidth) * relativeHeight
                        : svgHeight),
                  )}
                  scale={scale}
                  centerPoint={centerPoint}
                  colors={colors}
                  xColorLegendTitle={xColorLegendTitle}
                  yColorLegendTitle={yColorLegendTitle}
                  mapBorderWidth={mapBorderWidth}
                  mapNoDataColor={mapNoDataColor}
                  mapBorderColor={mapBorderColor}
                  tooltip={tooltip}
                  onSeriesMouseOver={onSeriesMouseOver}
                  isWorldMap={isWorldMap}
                  zoomScaleExtend={zoomScaleExtend}
                  zoomTranslateExtend={zoomTranslateExtend}
                  onSeriesMouseClick={onSeriesMouseClick}
                  mapProperty={mapProperty}
                  highlightedIds={highlightedIds}
                  resetSelectionOnDoubleClick={resetSelectionOnDoubleClick}
                  styles={styles}
                  showColorScale={showColorScale}
                  classNames={classNames}
                  mapProjection={mapProjection || (isWorldMap ? 'naturalEarth' : 'mercator')}
                  detailsOnClick={detailsOnClick}
                  zoomInteraction={zoomInteraction}
                />
              ) : null}
            </div>
            {sources || footNote ? (
              <GraphFooter
                styles={{ footnote: styles?.footnote, source: styles?.source }}
                classNames={{
                  footnote: classNames?.footnote,
                  source: classNames?.source,
                }}
                sources={sources}
                footNote={footNote}
                width={width}
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
