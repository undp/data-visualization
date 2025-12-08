import { useEffect, useEffectEvent, useMemo, useRef, useState } from 'react';
import { SliderUI } from '@undp/design-system-react/SliderUI';
import { Spinner } from '@undp/design-system-react/Spinner';
import { format } from 'date-fns/format';
import { parse } from 'date-fns/parse';

import { Graph } from './Graph';

import {
  BivariateMapDataType,
  Languages,
  SourcesDataType,
  StyleObject,
  ClassNameObject,
  MapProjectionTypes,
  ZoomInteractionTypes,
  CustomLayerDataType,
  AnimateDataType,
  TimelineDataType,
} from '@/Types';
import { GraphHeader } from '@/Components/Elements/GraphHeader';
import { GraphFooter } from '@/Components/Elements/GraphFooter';
import { Colors } from '@/Components/ColorPalette';
import { fetchAndParseJSON } from '@/Utils/fetchAndParseData';
import { getJenks } from '@/Utils/getJenks';
import { Pause, Play } from '@/Components/Icons';
import { getSliderMarks } from '@/Utils/getSliderMarks';
import { GraphArea, GraphContainer } from '@/Components/Elements/GraphContainer';

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
  /** Map data as an object in geoJson format or a url for geoJson */
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
  /** Defines the opacity of the non-highlighted data */
  dimmedOpacity?: number;
  /** Toggles if the graph animates in when loaded.  */
  animate?: boolean | AnimateDataType;
  /** Property in the property object in mapData geoJson object is used to match to the id in the data object */
  mapProperty?: string;
  /** Toggle visibility of color scale. */
  showColorScale?: boolean;
  /** Toggle if color scale is collapsed by default. */
  collapseColorScaleByDefault?: boolean;
  /** Toggles the visibility of Antarctica in the default map. Only applicable for the default map. */
  showAntarctica?: boolean;
  /** Optional SVG <g> element or function that renders custom content behind or in front of the graph. */
  customLayers?: CustomLayerDataType[];
  /** Configures playback and slider controls for animating the chart over time. The data must have a key date for it to work properly. */
  timeline?: TimelineDataType;
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
    graphTitle,
    mapData = 'https://raw.githubusercontent.com/UNDP-Data/dv-country-geojson/refs/heads/main/worldMap.json',
    colors = Colors.light.bivariateColors.colors05x05,
    sources,
    graphDescription,
    height,
    width,
    footNote = 'The designations employed and the presentation of material on this map do not imply the expression of any opinion whatsoever on the part of the Secretariat of the United Nations or UNDP concerning the legal status of any country, territory, city or area or its authorities, or concerning the delimitation of its frontiers or boundaries.',
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
    animate = false,
    dimmedOpacity = 0.3,
    customLayers = [],
    timeline = { enabled: false, autoplay: false, showOnlyActiveDate: true },
    collapseColorScaleByDefault,
  } = props;

  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);
  const [play, setPlay] = useState(timeline.autoplay);
  const uniqDatesSorted = useMemo(() => {
    const dates = [
      ...new Set(data.map(d => parse(`${d}`, timeline.dateFormat || 'yyyy', new Date()).getTime())),
    ];
    dates.sort((a, b) => a - b);
    return dates;
  }, [data, timeline.dateFormat]);
  const [index, setIndex] = useState(timeline.autoplay ? 0 : uniqDatesSorted.length - 1);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [mapShape, setMapShape] = useState<any>(undefined);

  const graphDiv = useRef<HTMLDivElement>(null);
  const graphParentDiv = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      setSvgWidth(entries[0].target.clientWidth || 620);
      setSvgHeight(entries[0].target.clientHeight || 480);
    });
    if (graphDiv.current) {
      resizeObserver.observe(graphDiv.current);
    }
    return () => resizeObserver.disconnect();
  }, []);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onUpdateShape = useEffectEvent((shape: any) => {
    setMapShape(shape);
  });
  useEffect(() => {
    if (typeof mapData === 'string') {
      const fetchData = fetchAndParseJSON(mapData);
      fetchData.then(d => {
        onUpdateShape(d);
      });
    } else {
      onUpdateShape(mapData);
    }
  }, [mapData]);

  useEffect(() => {
    const interval = setInterval(
      () => {
        setIndex(i => (i < uniqDatesSorted.length - 1 ? i + 1 : 0));
      },
      (timeline.speed || 2) * 1000,
    );
    if (!play) clearInterval(interval);
    return () => clearInterval(interval);
  }, [uniqDatesSorted, play, timeline.speed]);

  const markObj = getSliderMarks(
    uniqDatesSorted,
    index,
    timeline.showOnlyActiveDate,
    timeline.dateFormat || 'yyyy',
  );

  if (xDomain && yDomain)
    if (xDomain.length !== colors[0].length - 1 || yDomain.length !== colors.length - 1) {
      console.error("the xDomain and yDomain array length don't match to the color array length");
      return null;
    }
  return (
    <GraphContainer
      className={classNames?.graphContainer}
      style={styles?.graphContainer}
      id={graphID}
      ref={graphParentDiv}
      aria-label={ariaLabel}
      backgroundColor={backgroundColor}
      theme={theme}
      language={language}
      minHeight={minHeight}
      width={width}
      height={height}
      relativeHeight={relativeHeight}
      padding={padding}
    >
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
          graphDownload={graphDownload ? graphParentDiv : undefined}
          dataDownload={
            dataDownload
              ? data.map(d => d.data).filter(d => d !== undefined).length > 0
                ? data.map(d => d.data).filter(d => d !== undefined)
                : data.filter(d => d !== undefined)
              : null
          }
        />
      ) : null}
      {timeline.enabled && uniqDatesSorted.length > 0 && markObj ? (
        <div className='flex gap-6 items-center' dir='ltr'>
          <button
            type='button'
            onClick={() => {
              setPlay(!play);
            }}
            className='p-0 border-0 cursor-pointer bg-transparent'
            aria-label={play ? 'Click to pause animation' : 'Click to play animation'}
          >
            {play ? <Pause /> : <Play />}
          </button>
          <SliderUI
            min={uniqDatesSorted[0]}
            max={uniqDatesSorted[uniqDatesSorted.length - 1]}
            marks={markObj}
            step={null}
            defaultValue={uniqDatesSorted[uniqDatesSorted.length - 1]}
            value={uniqDatesSorted[index]}
            onChangeComplete={nextValue => {
              setIndex(uniqDatesSorted.indexOf(nextValue as number));
            }}
            onChange={nextValue => {
              setIndex(uniqDatesSorted.indexOf(nextValue as number));
            }}
            aria-label='Time slider. Use arrow keys to adjust selected time period.'
          />
        </div>
      ) : null}
      <GraphArea ref={graphDiv}>
        {svgWidth && svgHeight && mapShape ? (
          <Graph
            data={data.filter(d =>
              timeline.enabled
                ? d.date === format(new Date(uniqDatesSorted[index]), timeline.dateFormat || 'yyyy')
                : d,
            )}
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
            width={svgWidth}
            height={svgHeight}
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
            animate={
              animate === true
                ? { duration: 0.5, once: true, amount: 0.5 }
                : animate || { duration: 0, once: true, amount: 0 }
            }
            dimmedOpacity={dimmedOpacity}
            customLayers={customLayers}
            collapseColorScaleByDefault={collapseColorScaleByDefault}
          />
        ) : (
          <div
            style={{
              height: `${Math.max(
                minHeight,
                height ||
                  (relativeHeight
                    ? minHeight
                      ? (width || svgWidth) * relativeHeight > minHeight
                        ? (width || svgWidth) * relativeHeight
                        : minHeight
                      : (width || svgWidth) * relativeHeight
                    : svgHeight),
              )}px`,
            }}
            className='flex items-center justify-center'
          >
            <Spinner aria-label='Loading graph' />
          </div>
        )}
      </GraphArea>
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
    </GraphContainer>
  );
}
