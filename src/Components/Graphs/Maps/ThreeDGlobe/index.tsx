import React, { useEffect, useRef, useState } from 'react';
import { Spinner } from '@undp/design-system-react/Spinner';
import * as THREE from 'three';
import { cn } from '@undp/design-system-react/cn';
import Globe from 'react-globe.gl';

import Graph from './Graph';

import { GraphHeader } from '@/Components/Elements/GraphHeader';
import { GraphFooter } from '@/Components/Elements/GraphFooter';
import {
  ChoroplethMapDataType,
  ClassNameObject,
  Languages,
  ScaleDataType,
  SourcesDataType,
  StyleObject,
} from '@/Types';
import { fetchAndParseJSON } from '@/Utils/fetchAndParseData';
import { Colors } from '@/Components/ColorPalette';
import { getUniqValue } from '@/Utils/getUniqValue';
import { getJenks } from '@/Utils/getJenks';

type GlobeProps = React.ComponentProps<typeof Globe>;
interface Props extends Partial<Omit<GlobeProps, 'backgroundColor'>> {
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
  /** Stroke color of the regions in the map */
  mapBorderColor?: string;
  /** Center point of the map */
  centerPoint?: [number, number];
  /** Defines if the globe rotates automatically */
  autoRotate?: number | boolean;
  /** Defines the material property applied to the sphere of the globe */
  globeMaterial?: THREE.Material;
  /** Defines the colo of the glow around the globe */
  atmosphereColor?: string;
  /** Defines if the globe can be zoomed when scrolled */
  enableZoom?: boolean;
  /** Position offset of the globe relative to the canvas center */
  globeOffset?: [number, number];
  /** Defines the camera distance from Earth. This helps in defining the default size of the globe. Smaller = closer camera therefore the globe is bigger) */
  scale?: number;
  /** Defines the spacing between the country shape polygon with the sphere */
  polygonAltitude?: number;
  /** Scale for the colors */
  scaleType?: Exclude<ScaleDataType, 'linear'>;
  /** Toggles if the color scaling is categorical or not */
  categorical?: boolean;
  /** Toggle visibility of color scale. */
  showColorScale?: boolean;
  /** The max altitude of the atmosphere, in terms of globe radius units. */
  atmosphereAltitude?: number;
  /** Resolution in angular degrees of the sphere curvature. The finer the resolution, the more the globe is fragmented into smaller faces to approximate the spheric surface, at the cost of performance. */
  globeCurvatureResolution?: number;
  /** Defines the color of the light and atmosphere. */
  lightColor?: string;
  /** Property in the property object in mapData geoJson object is used to match to the id in the data object */
  mapProperty?: string;
  /** Countries or regions to be highlighted */
  highlightedIds?: string[];
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

/** For using these maps you will have to install [`three`](https://threejs.org/manual/) and [react-globe.gl](https://www.npmjs.com/package/react-globe.gl) package to your project */
export function ThreeDGlobe(props: Props) {
  const {
    data,
    mapData = 'https://raw.githubusercontent.com/UNDP-Data/dv-country-geojson/refs/heads/main/worldMap-simplified.json',
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
    padding,
    mapNoDataColor = Colors.light.graphNoData,
    backgroundColor = false,
    mapBorderColor = Colors.light.grays['gray-500'],
    relativeHeight,
    tooltip,
    graphID,
    mapProperty = 'ISO3',
    dataDownload = false,
    language = 'en',
    minHeight = 0,
    theme = 'light',
    ariaLabel,
    styles,
    classNames,
    autoRotate = true,
    enableZoom = true,
    globeMaterial,
    centerPoint = [0, 0],
    atmosphereColor = '#999',
    showColorScale = true,
    resetSelectionOnDoubleClick = true,
    detailsOnClick,
    onSeriesMouseOver,
    onSeriesMouseClick,
    highlightedIds = [],
    scale = 1,
    globeOffset = [0, 0],
    polygonAltitude = 0.01,
    globeCurvatureResolution = 4,
    atmosphereAltitude = 0.15,
    lightColor = '#dce9fe',
  } = props;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [mapShape, setMapShape] = useState<any>(undefined);

  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);

  const graphDiv = useRef<HTMLDivElement>(null);

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
        if (
          mapData ===
          'https://raw.githubusercontent.com/UNDP-Data/dv-country-geojson/refs/heads/main/worldMap-simplified.json'
        ) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const features = d.features.map((el: any) => {
            if (el.geometry.type === 'Polygon') {
              const reversed = [...el.geometry.coordinates[0]].reverse();
              const geometry = { ...el.geometry, coordinates: [reversed] };
              return { ...el, geometry };
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const coord: any = [];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            el.geometry.coordinates.forEach((c: any) => {
              const reversed = [...c[0]].reverse();
              coord.push([reversed]);
            });
            const geometry = { ...el.geometry, coordinates: coord };
            return { ...el, geometry };
          });
          setMapShape(features);
        } else setMapShape(d.features);
      });
    } else {
      setMapShape(mapData.features);
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
        aria-label={
          ariaLabel ||
          `${
            graphTitle ? `The graph shows ${graphTitle}. ` : ''
          }This is a map.${graphDescription ? ` ${graphDescription}` : ''}`
        }
      >
        <div
          className='flex grow'
          style={{ padding: backgroundColor ? padding || '1rem' : padding || 0 }}
        >
          <div className='flex flex-col w-full gap-4 grow justify-between'>
            {graphTitle || graphDescription || dataDownload ? (
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
                graphDownload={undefined}
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
                  globeOffset={globeOffset}
                  polygonData={mapShape}
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
                  mapNoDataColor={mapNoDataColor}
                  categorical={scaleType === 'categorical'}
                  mapBorderColor={mapBorderColor}
                  tooltip={tooltip}
                  mapProperty={mapProperty}
                  styles={styles}
                  classNames={classNames}
                  autoRotate={autoRotate === true ? 1.5 : autoRotate === false ? 0 : autoRotate}
                  enableZoom={enableZoom}
                  globeMaterial={globeMaterial}
                  atmosphereColor={atmosphereColor}
                  colorLegendTitle={colorLegendTitle}
                  showColorScale={showColorScale}
                  hoverStrokeColor={
                    theme === 'light'
                      ? Colors.light.grays['gray-700']
                      : Colors.light.grays['gray-300']
                  }
                  highlightedIds={highlightedIds}
                  resetSelectionOnDoubleClick={resetSelectionOnDoubleClick}
                  detailsOnClick={detailsOnClick}
                  onSeriesMouseOver={onSeriesMouseOver}
                  onSeriesMouseClick={onSeriesMouseClick}
                  scale={scale}
                  polygonAltitude={polygonAltitude}
                  centerLat={centerPoint[0]}
                  centerLng={centerPoint[1]}
                  atmosphereAltitude={atmosphereAltitude}
                  globeCurvatureResolution={globeCurvatureResolution}
                  lightColor={lightColor}
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
