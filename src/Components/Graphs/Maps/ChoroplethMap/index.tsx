import { Spinner } from '@undp/design-system-react/Spinner';
import type { FeatureCollection } from 'geojson';
import { useRef } from 'react';
import { Colors } from '@/Components/ColorPalette';
import { GraphArea, GraphContainer } from '@/Components/Elements/GraphContainer';
import { GraphFooter } from '@/Components/Elements/GraphFooter';
import { GraphHeader } from '@/Components/Elements/GraphHeader';
import { Timeline } from '@/Components/Elements/Timeline';
import { useElementSize } from '@/hooks/useElementSize';
import { useMapShapeData } from '@/hooks/useMapShapeData';
import { useTimeline } from '@/hooks/useTimeline';
import type {
  AnimateDataType,
  ChoroplethMapDataType,
  ClassNameObject,
  CustomLayerDataType,
  Languages,
  MapOverlayDataType,
  MapProjectionTypes,
  NumberFormatOptions,
  ScaleDataType,
  SourcesDataType,
  StyleObject,
  TimelineDataType,
  ZoomInteractionTypes,
} from '@/Types';
import { getJenks } from '@/Utils/getJenks';
import { getUniqValue } from '@/Utils/getUniqValue';
import { Graph } from './Graph';

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
  mapData?: FeatureCollection | string;
  /** Detail if any other map needs to be overlayed over the main map */
  mapOverlay?: MapOverlayDataType;
  /** Defines if the coordinates in the map data should be rewinded or not. Try to change this is the visualization shows countries as holes instead of shapes. */
  rewindCoordinatesInMapData?: boolean;
  /** Scaling factor for the map. Multiplies the scale number to scale. */
  scale?: number;
  /** Toggle if the map is centered and zoomed to the highlighted ids. */
  zoomAndCenterByHighlightedIds?: boolean;
  /** Center point of the map */
  centerPoint?: [number, number];
  /** Controls the rotation of the map projection, in degrees, applied before rendering. Useful for shifting the antimeridian to focus the map on different regions */
  projectionRotate?: [number, number] | [number, number, number];
  /** Defines the zoom mode for the map */
  zoomInteraction?: ZoomInteractionTypes;
  /** Stroke width of the regions in the map */
  mapBorderWidth?: number;
  /** Stroke color of the regions in the map */
  mapBorderColor?: string;
  /** Toggle if the UN border are shown. */
  showUNBorder?: boolean;
  /** Toggle if the coastal border is shown. Only applicable if default world map is used */
  showCostalBorder?: boolean;
  /** Toggle if the map is a world map */
  isWorldMap?: boolean;
  /** Toggle if the disputed areas are interactive. The way it works is it check for a property name `iso3cd` in map shape data if it starts with 'x' then the area is considered disputed. */
  isDisputedAreasInteractive?: boolean;
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
  /** Toggle visibility of color scale. */
  showColorScale?: boolean;
  /** Toggle if color scale is collapsed by default. */
  collapseColorScaleByDefault?: boolean;
  /** Property in the property object in mapData geoJson object is used to match to the id in the data object */
  mapProperty?: string;
  /** Show Aksai Chin as striped */
  showAksaiChinAsStriped?: boolean;
  /** Optional SVG <g> element or function that renders custom content behind or in front of the graph. */
  customLayers?: CustomLayerDataType[];
  /** Configures playback and slider controls for animating the chart over time. The data must have a key date for it to work properly. */
  timeline?: TimelineDataType;
  /** Configuration options for controlling number formatting, localization, precision, and zero padding. */
  numberDisplayOptions?: Omit<NumberFormatOptions, 'suffix' | 'prefix'>;
  /** Enable graph download option as png */
  graphDownload?: boolean;
  /** Enable data download option as a csv */
  dataDownload?: boolean;
  /** Reset selection on double-click. Only applicable when used in a dashboard context with filters. */
  resetSelectionOnDoubleClick?: boolean;

  // Interactions and Callbacks
  /** Tooltip content. If the type is string then this uses the [handlebar](../?path=/docs/misc-handlebars-templates-and-custom-helpers--docs) template to display the data */
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  tooltip?: string | ((_d: any) => React.ReactNode);
  /** Details displayed on the modal when user clicks of a data point. If the type is string then this uses the [handlebar](../?path=/docs/misc-handlebars-templates-and-custom-helpers--docs) template to display the data */
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  detailsOnClick?: string | ((_d: any) => React.ReactNode);
  /** Callback for mouse over event */
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  onSeriesMouseOver?: (_d: any) => void;
  /** Callback for mouse click event */
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
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
    mapData,
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
    highlightedIds,
    onSeriesMouseClick,
    mapProperty = 'isoclr3',
    graphDownload = false,
    dataDownload = false,
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
    projectionRotate = [-10, 0],
    zoomAndCenterByHighlightedIds = false,
    rewindCoordinatesInMapData = true,
    mapOverlay,
    numberDisplayOptions,
    showCostalBorder = false,
    showUNBorder,
    showAksaiChinAsStriped = true,
    isDisputedAreasInteractive = false,
  } = props;
  const { graphDiv, svgWidth, svgHeight } = useElementSize<HTMLDivElement>();
  const { uniqDatesSorted, index, setIndex, play, setPlay, markObj, activeDate } = useTimeline(
    data,
    timeline,
  );
  const { mapShape, mapBorderShape, overlayMapShape } = useMapShapeData(
    mapData,
    mapOverlay?.mapData,
    rewindCoordinatesInMapData,
    showCostalBorder,
    showUNBorder,
  );
  const graphParentDiv = useRef<HTMLDivElement>(null);

  const domain =
    colorDomain ||
    (scaleType === 'categorical'
      ? getUniqValue(data, 'x')
      : getJenks(
          data.map((d) => d.x as number | null | undefined),
          colors?.length || 4,
        ));
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
      {graphTitle || graphDescription ? (
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
        />
      ) : null}
      {timeline.enabled && uniqDatesSorted.length > 0 && markObj ? (
        <Timeline
          play={play}
          setPlay={setPlay}
          uniqDatesSorted={uniqDatesSorted}
          markObj={markObj}
          index={index}
          setIndex={setIndex}
          color={timeline.color}
        />
      ) : null}
      <GraphArea ref={graphDiv}>
        {svgWidth && svgHeight && mapShape && (mapBorderShape || mapData) ? (
          <Graph
            data={data.filter((d) => (timeline.enabled ? `${d.date}` === activeDate : d))}
            mapData={mapShape}
            mapBorderData={
              mapBorderShape
                ? {
                    ...mapBorderShape,
                    features: mapBorderShape.features.filter(
                      (el) => el.properties?.iso3cd !== 'ATA',
                    ),
                  }
                : mapBorderShape
            }
            colorDomain={domain}
            width={svgWidth}
            height={svgHeight}
            scale={scale}
            centerPoint={centerPoint}
            colors={
              colors ||
              (scaleType === 'categorical'
                ? Colors[theme].categoricalColors.colors
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
            showColorScale={showColorScale}
            zoomScaleExtend={zoomScaleExtend}
            zoomTranslateExtend={zoomTranslateExtend}
            onSeriesMouseClick={onSeriesMouseClick}
            mapProperty={!mapData && !mapProperty ? 'isoclr3' : mapProperty}
            highlightedIds={highlightedIds}
            resetSelectionOnDoubleClick={resetSelectionOnDoubleClick}
            styles={styles}
            overlayMapData={overlayMapShape}
            overlayMapBorderColor={mapOverlay?.mapBorderColor}
            overlayMapBorderWidth={mapOverlay?.mapBorderWidth}
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
            zoomAndCenterByHighlightedIds={zoomAndCenterByHighlightedIds}
            collapseColorScaleByDefault={collapseColorScaleByDefault}
            projectionRotate={projectionRotate}
            numberDisplayOptions={numberDisplayOptions}
            graphDownload={graphDownload ? graphParentDiv : undefined}
            dataDownload={
              dataDownload
                ? data.map((d) => d.data).filter((d) => d !== undefined).length > 0
                  ? data.map((d) => d.data).filter((d) => d !== undefined)
                  : data.filter((d) => d !== undefined)
                : null
            }
            showUNBorder={showUNBorder ?? true}
            showAksaiChinAsStriped={showAksaiChinAsStriped}
            isDisputedAreasInteractive={isDisputedAreasInteractive}
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
