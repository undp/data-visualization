import { useState, useRef, useEffect, useEffectEvent } from 'react';
import { format } from 'date-fns/format';
import { parse } from 'date-fns/parse';
import { SliderUI } from '@undp/design-system-react/SliderUI';
import { Spinner } from '@undp/design-system-react/Spinner';
import { ascending, sort } from 'd3-array';

import { Graph } from './Graph';

import { GraphFooter } from '@/Components/Elements/GraphFooter';
import { GraphHeader } from '@/Components/Elements/GraphHeader';
import {
  HybridMapDataType,
  Languages,
  SourcesDataType,
  StyleObject,
  ClassNameObject,
  ZoomInteractionTypes,
  MapProjectionTypes,
  CustomLayerDataType,
  AnimateDataType,
  TimelineDataType,
  ScaleDataType,
} from '@/Types';
import { Colors } from '@/Components/ColorPalette';
import { fetchAndParseJSON } from '@/Utils/fetchAndParseData';
import { checkIfNullOrUndefined } from '@/Utils/checkIfNullOrUndefined';
import { Pause, Play } from '@/Components/Icons';
import { getSliderMarks } from '@/Utils/getSliderMarks';
import { uniqBy } from '@/Utils/uniqBy';
import { GraphArea, GraphContainer } from '@/Components/Elements/GraphContainer';
import { getJenks, getUniqValue } from '@/Utils';

interface Props {
  // Data
  /** Array of data objects for dot density map*/
  data: HybridMapDataType[];
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
  /** Color or array of colors for the circle */
  colors?: string[];
  /** Domain of colors for the graph for the choropleth map */
  colorDomain?: number[] | string[];
  /** Title for the legend for the dot density scale */
  dotLegendTitle?: string;
  /** Title for the color legend for the color scale */
  mapColorLegendTitle?: string;
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
  /** Maximum radius of the circle */
  radius?: number;
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
  /** Color of the dots in the dot density map */
  dotColor?: string;
  /** Border color of the dots in the dot density map */
  dotBorderColor?: string;
  /** Color of the labels */
  labelColor?: string;
  /** Toggle if the map is a world map */
  isWorldMap?: boolean;
  /** Scale for the colors of the choropleth map */
  choroplethScaleType?: Exclude<ScaleDataType, 'linear'>;
  /** Map projection type */
  mapProjection?: MapProjectionTypes;
  /** Extend of the allowed zoom in the map */
  zoomScaleExtend?: [number, number];
  /** Extend of the allowed panning in the map */
  zoomTranslateExtend?: [[number, number], [number, number]];
  /** Toggle visibility of labels */
  showLabels?: boolean;
  /** Maximum value mapped to the radius chart */
  maxRadiusValue?: number;
  /** Countries or regions to be highlighted */
  highlightedIds?: string[];
  /** Data points to highlight. Use the label value from data to highlight the data point */
  highlightedDataPoints?: (string | number)[];
  /** Defines the opacity of the non-highlighted data */
  dimmedOpacity?: number;
  /** Toggles if the graph animates in when loaded.  */
  animate?: boolean | AnimateDataType;
  /** Toggle visibility of color scale. This is only applicable if the data props hae color parameter */
  showColorScale?: boolean;
  /** Toggle if color scale is collapsed by default. */
  collapseColorScaleByDefault?: boolean;
  /** Toggles the visibility of Antarctica in the default map. Only applicable for the default map. */
  showAntarctica?: boolean;
  /** Optional SVG <g> element or function that renders custom content behind or in front of the graph. */
  customLayers?: CustomLayerDataType[];
  /** Property in the property object in mapData geoJson object is used to match to the id in the data object */
  mapProperty?: string;
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

export function HybridMap(props: Props) {
  const {
    data,
    mapData = 'https://raw.githubusercontent.com/UNDP-Data/dv-country-geojson/refs/heads/main/worldMap.json',
    graphTitle,
    colors,
    sources,
    graphDescription,
    height,
    width,
    footNote = 'The designations employed and the presentation of material on this map do not imply the expression of any opinion whatsoever on the part of the Secretariat of the United Nations or UNDP concerning the legal status of any country, territory, city or area or its authorities, or concerning the delimitation of its frontiers or boundaries.',
    mapColorLegendTitle,
    colorDomain,
    choroplethScaleType = 'threshold',
    radius = 5,
    scale = 0.95,
    centerPoint,
    padding,
    mapBorderWidth = 0.5,
    mapNoDataColor = Colors.light.graphNoData,
    backgroundColor = false,
    showLabels = false,
    mapBorderColor = Colors.light.grays['gray-500'],
    tooltip,
    relativeHeight,
    onSeriesMouseOver,
    isWorldMap = true,
    showColorScale = true,
    zoomScaleExtend = [0.8, 6],
    zoomTranslateExtend,
    graphID,
    highlightedDataPoints = [],
    onSeriesMouseClick,
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
    maxRadiusValue,
    timeline = { enabled: false, autoplay: false, showOnlyActiveDate: true },
    collapseColorScaleByDefault,
    dotColor = Colors.primaryColors['blue-600'],
    highlightedIds = [],
    mapProperty = 'ISO3',
    dotLegendTitle,
    dotBorderColor,
    labelColor = Colors.primaryColors['blue-600'],
  } = props;

  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);
  const [play, setPlay] = useState(timeline.autoplay);
  const uniqDatesSorted = sort(
    uniqBy(data, 'date', true).map(d =>
      parse(`${d}`, timeline.dateFormat || 'yyyy', new Date()).getTime(),
    ),
    (a, b) => ascending(a, b),
  );
  const [index, setIndex] = useState(timeline.autoplay ? 0 : uniqDatesSorted.length - 1);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [mapShape, setMapShape] = useState<any>(undefined);

  const graphDiv = useRef<HTMLDivElement>(null);
  const graphParentDiv = useRef<HTMLDivElement>(null);
  const domain =
    colorDomain ||
    (choroplethScaleType === 'categorical'
      ? getUniqValue(data, 'x')
      : getJenks(
          data.map(d => d.x as number | null | undefined),
          colors?.length || 4,
        ));
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
            dotColor={dotColor}
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
            colorDomain={domain}
            width={svgWidth}
            height={svgHeight}
            scale={scale}
            centerPoint={centerPoint}
            colors={
              colors ||
              (choroplethScaleType === 'categorical'
                ? Colors[theme].sequentialColors[
                    `neutralColorsx0${domain.length as 4 | 5 | 6 | 7 | 8 | 9}`
                  ]
                : Colors[theme].sequentialColors[
                    `neutralColorsx0${(domain.length + 1) as 4 | 5 | 6 | 7 | 8 | 9}`
                  ])
            }
            mapColorLegendTitle={mapColorLegendTitle}
            radius={radius}
            categorical={choroplethScaleType === 'categorical'}
            mapBorderWidth={mapBorderWidth}
            mapNoDataColor={mapNoDataColor}
            mapBorderColor={mapBorderColor}
            tooltip={tooltip}
            onSeriesMouseOver={onSeriesMouseOver}
            showLabels={showLabels}
            isWorldMap={isWorldMap}
            showColorScale={showColorScale}
            zoomScaleExtend={zoomScaleExtend}
            zoomTranslateExtend={zoomTranslateExtend}
            onSeriesMouseClick={onSeriesMouseClick}
            highlightedDataPoints={highlightedDataPoints}
            resetSelectionOnDoubleClick={resetSelectionOnDoubleClick}
            styles={styles}
            classNames={classNames}
            zoomInteraction={zoomInteraction}
            detailsOnClick={detailsOnClick}
            mapProjection={mapProjection || (isWorldMap ? 'naturalEarth' : 'mercator')}
            animate={
              animate === true
                ? { duration: 0.5, once: true, amount: 0.5 }
                : animate || { duration: 0, once: true, amount: 0 }
            }
            dimmedOpacity={dimmedOpacity}
            customLayers={customLayers}
            maxRadiusValue={
              !checkIfNullOrUndefined(maxRadiusValue)
                ? (maxRadiusValue as number)
                : Math.max(...data.map(d => d.radius).filter(d => d !== undefined && d !== null))
            }
            collapseColorScaleByDefault={collapseColorScaleByDefault}
            highlightedIds={highlightedIds}
            mapProperty={mapProperty}
            dotLegendTitle={dotLegendTitle}
            dotBorderColor={dotBorderColor}
            labelColor={labelColor}
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
