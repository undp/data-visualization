import { useEffect, useMemo, useState } from 'react';
import flattenDeep from 'lodash.flattendeep';
import { cn, createFilter, DropdownSelect } from '@undp/design-system-react';

import { MapEl } from './MapEl';

import { GraphHeader } from '@/Components/Elements/GraphHeader';
import { GraphFooter } from '@/Components/Elements/GraphFooter';
import {
  ClassNameObject,
  Languages,
  MapLegendDataType,
  SourcesDataType,
  StyleObject,
} from '@/Types';

interface Props {
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
  /** URL for mapStyle JSON  */
  mapStyle: string;
  /** Starting center point of the map */
  center?: [number, number];
  /** Starting zoom level of the map */
  zoomLevel?: number;
  /** List of the layers that the user select and switch between sing a drop down */
  layerSelection: { layerID: string[]; name: string }[];
  /** Defines the legend for the map. mapLegend is of type { mapStyleName: string; legend: string | React.ReactNode }[] where mapStyleName corresponds to the each name in the layerSelection. */
  mapLegend?: MapLegendDataType[];
  /** List of layer IDs to be excluded from the visualization */
  excludeLayers?: string[];

  // Configuration and Options
  /** Language setting  */
  language?: Languages;
  /** Color theme */
  theme?: 'light' | 'dark';
  /** Theme for the UI elements */
  uiMode?: 'light' | 'normal';
  /** Unique ID for the graph */
  graphID?: string;
}

/** For using these maps you will have to install [`maplibre`](https://maplibre.org/maplibre-gl-js/docs/#npm) and [pmtiles](https://www.npmjs.com/package/pmtiles) package to your project */
export function GeoHubMapWithLayerSelection(props: Props) {
  const {
    mapStyle,
    graphTitle,
    height,
    width,
    relativeHeight,
    sources,
    graphDescription,
    footNote,
    padding,
    backgroundColor = false,
    center,
    zoomLevel,
    graphID,
    language = 'en',
    minHeight = 0,
    theme = 'light',
    layerSelection,
    excludeLayers = [],
    ariaLabel,
    uiMode = 'normal',
    styles,
    classNames,
    mapLegend = [],
  } = props;

  const [selectedLayer, setSelectedLayer] = useState(layerSelection[0].layerID);

  useEffect(() => {
    setSelectedLayer(layerSelection[0].layerID);
  }, [layerSelection]);

  const filterConfig = useMemo(
    () => ({
      ignoreCase: true,
      ignoreAccents: true,
      trim: true,
    }),
    [],
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
            <DropdownSelect
              options={layerSelection.map(d => ({
                label: d.name,
                value: d.layerID,
              }))}
              size='sm'
              isClearable={false}
              variant={uiMode}
              isRtl={language === 'he' || language === 'ar'}
              isSearchable
              filterOption={createFilter(filterConfig)}
              defaultValue={{
                label: layerSelection[0].name,
                value: layerSelection[0].layerID,
              }}
              controlShouldRenderValue
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(el: any) => {
                if (el) setSelectedLayer(el.value);
              }}
            />
            <MapEl
              mapStyle={mapStyle}
              center={center}
              zoomLevel={zoomLevel}
              width={width}
              height={height}
              relativeHeight={relativeHeight}
              minHeight={minHeight}
              selectedLayer={selectedLayer}
              layerIdList={flattenDeep(layerSelection.map(d => d.layerID))}
              excludeLayers={excludeLayers}
              mapLegend={
                (mapLegend as MapLegendDataType[]).find(
                  d =>
                    d.mapStyleName ===
                    layerSelection.find(el => el.layerID === selectedLayer)?.name,
                )?.legend
              }
            />
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
