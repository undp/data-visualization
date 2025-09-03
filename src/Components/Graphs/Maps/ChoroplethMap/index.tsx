import { useState, useRef, useEffect } from 'react';
import { cn } from '@undp/design-system-react/cn';
import { SliderUI } from '@undp/design-system-react/SliderUI';
import { Spinner } from '@undp/design-system-react/Spinner';
import { format } from 'date-fns/format';
import { parse } from 'date-fns/parse';
import { ascending, sort } from 'd3-array';
import uniqBy from 'lodash.uniqby';

import { Graph } from './Graph';

import {
  ChoroplethMapDataType,
  Languages,
  SourcesDataType,
  StyleObject,
  ClassNameObject,
  ScaleDataType,
  MapProjectionTypes,
  ZoomInteractionTypes,
  CustomLayerDataType,
  AnimateDataType,
  TimelineDataType,
} from '@/Types';
import { GraphFooter } from '@/Components/Elements/GraphFooter';
import { GraphHeader } from '@/Components/Elements/GraphHeader';
import { Colors } from '@/Components/ColorPalette';
import { fetchAndParseJSON } from '@/Utils/fetchAndParseData';
import { getUniqValue } from '@/Utils/getUniqValue';
import { getJenks } from '@/Utils/getJenks';
import { Pause, Play } from '@/Components/Icons';
import { getSliderMarks } from '@/Utils/getSliderMarks';

interface Props {
  // Data
  /** Array of data objects */
  data: ChoroplethMapDataType[];

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
  /** Colors for the choropleth map */
  colors?: string[];
  /** Domain of colors for the graph */
  colorDomain?: number[] | string[];
  /** Title for the color legend */
  colorLegendTitle?: string;
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
  /** Scale for the colors */
  scaleType?: Exclude<ScaleDataType, 'linear'>;
  /** Toggles if the color scaling is categorical or not */
  categorical?: boolean;
  /** Toggle visibility of color scale. */
  showColorScale?: boolean;
  /** Property in the property object in mapData geoJson object is used to match to the id in the data object */
  mapProperty?: string;
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

export function ChoroplethMap(props: Props) {
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
    colorDomain,
    colorLegendTitle,
    scaleType = 'threshold',
    scale = 0.95,
    centerPoint,
    padding,
    mapBorderWidth = 0.5,
    mapNoDataColor = Colors.light.graphNoData,
    backgroundColor = false,
    mapBorderColor = Colors.light.grays['gray-500'],
    relativeHeight,
    tooltip,
    onSeriesMouseOver,
    isWorldMap = true,
    showColorScale = true,
    zoomScaleExtend = [0.8, 6],
    zoomTranslateExtend,
    graphID,
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
  } = props;
  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);
  const [play, setPlay] = useState(timeline.autoplay);
  const uniqDatesSorted = sort(
    uniqBy(
      data.filter(d => d.date !== undefined && d.date !== null),
      d => d.date,
    ).map(d => parse(`${d.date}`, timeline.dateFormat || 'yyyy', new Date()).getTime()),
    (a, b) => ascending(a, b),
  );
  const [index, setIndex] = useState(timeline.autoplay ? 0 : uniqDatesSorted.length - 1);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [mapShape, setMapShape] = useState<any>(undefined);

  const graphDiv = useRef<HTMLDivElement>(null);
  const graphParentDiv = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      setSvgWidth(width || entries[0].target.clientWidth || 760);
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
      setMapShape(mapData);
    }
  }, [mapData]);

  const domain =
    colorDomain ||
    (scaleType === 'categorical'
      ? getUniqValue(data, 'x')
      : getJenks(
          data.map(d => d.x as number | null | undefined),
          colors?.length || 4,
        ));

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
          }This is a choropleth map where geographic areas are colored in proportion to a specific variable.${
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
            <div
              className='flex flex-col grow justify-center leading-0'
              ref={graphDiv}
              aria-label='Map area'
            >
              {(width || svgWidth) && (height || svgHeight) && mapShape ? (
                <Graph
                  data={data.filter(d =>
                    timeline.enabled
                      ? d.date ===
                        format(new Date(uniqDatesSorted[index]), timeline.dateFormat || 'yyyy')
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
                  colors={
                    colors ||
                    (scaleType === 'categorical'
                      ? Colors[theme].sequentialColors[
                          `neutralColorsx0${domain.length as 4 | 5 | 6 | 7 | 8 | 9}`
                        ]
                      : Colors[theme].sequentialColors[
                          `neutralColorsx0${(domain.length + 1) as 4 | 5 | 6 | 7 | 8 | 9}`
                        ])
                  }
                  colorLegendTitle={colorLegendTitle}
                  mapBorderWidth={mapBorderWidth}
                  mapNoDataColor={mapNoDataColor}
                  categorical={scaleType === 'categorical'}
                  mapBorderColor={mapBorderColor}
                  tooltip={tooltip}
                  onSeriesMouseOver={onSeriesMouseOver}
                  isWorldMap={isWorldMap}
                  showColorScale={showColorScale}
                  zoomScaleExtend={zoomScaleExtend}
                  zoomTranslateExtend={zoomTranslateExtend}
                  onSeriesMouseClick={onSeriesMouseClick}
                  mapProperty={mapProperty}
                  highlightedIds={highlightedIds}
                  resetSelectionOnDoubleClick={resetSelectionOnDoubleClick}
                  styles={styles}
                  classNames={classNames}
                  detailsOnClick={detailsOnClick}
                  mapProjection={mapProjection || (isWorldMap ? 'naturalEarth' : 'mercator')}
                  zoomInteraction={zoomInteraction}
                  dimmedOpacity={dimmedOpacity}
                  animate={
                    animate === true
                      ? { duration: 0.5, once: true, amount: 0.5 }
                      : animate || { duration: 0, once: true, amount: 0 }
                  }
                  customLayers={customLayers}
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
