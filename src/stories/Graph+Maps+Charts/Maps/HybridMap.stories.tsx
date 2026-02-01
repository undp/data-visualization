import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { parseValue } from '../../assets/parseValue';
import {
  CLASS_NAME_OBJECT,
  CUSTOM_LAYERS_OBJECT,
  LANGUAGE_OPTIONS,
  SOURCE_OBJECT,
  STYLE_OBJECT,
} from '../../assets/constants';

import { HybridMap } from '@/index';

type PagePropsAndCustomArgs = React.ComponentProps<typeof HybridMap>;

const meta: Meta<PagePropsAndCustomArgs> = {
  title: 'Maps/Hybrid map (choropleth + dot density)/Simple',
  component: HybridMap,
  tags: ['autodocs'],
  argTypes: {
    // Data
    data: {
      table: {
        type: {
          detail: `{
  id?: string; //The id key is needed for choropleth map
  x?: number | string | null; //The x key is needed for choropleth map   
  lat?: number; //The lat key is needed for dot density map
  long?: number; //The long key is needed for dot density map
  radius?: number; //The radius key will be applied to the dots in dot density map
  label?: string | number; //The label key will be applied to the dots in dot density map
  date?: string | number; //The date key is needed when time line feature needs to be used
  data?: object; //The data key in the object is used when downloading data and can be used to show additional points in mouseover
}`,
        },
      },
    },

    // Titles and Labels and Sources

    graphTitle: {
      control: 'text',
      table: {
        type: {
          summary: 'string | React.ReactNode',
        },
      },
    },
    customLayers: {
      table: {
        type: {
          summary: 'CustomLayersDataType[]',
          detail: CUSTOM_LAYERS_OBJECT,
        },
      },
    },
    graphDescription: {
      control: 'text',
      table: {
        type: {
          summary: 'string | React.ReactNode',
        },
      },
    },
    footNote: {
      control: 'text',
      table: {
        type: {
          summary: 'string | React.ReactNode',
        },
      },
    },
    sources: { table: { type: { detail: SOURCE_OBJECT } } },
    mapNoDataColor: { control: 'color' },
    mapBorderColor: { control: 'color' },

    // Colors and Styling
    colors: {
      control: 'text',
      table: {
        type: {
          summary: 'string | string[]',
          detail: 'Requires a array if color key is present in the data else requires a string',
        },
      },
    },
    colorDomain: { control: 'text' },
    backgroundColor: {
      control: 'text',
      table: {
        type: {
          summary: 'string | boolean',
          detail: 'If type is string then background uses the string as color',
        },
      },
    },
    styles: { table: { type: { detail: STYLE_OBJECT } } },
    classNames: { table: { type: { detail: CLASS_NAME_OBJECT } } },

    // Size and Spacing
    minHeight: { table: { defaultValue: { summary: '0' } } },

    // Values and Ticks
    mapData: { control: 'object' },
    mapProjection: {
      control: 'select',
      options: ['mercator', 'equalEarth', 'naturalEarth', 'orthographic', 'albersUSA'],
      table: {
        type: {
          summary: "'mercator' | 'equalEarth' | 'naturalEarth' | 'orthographic' | 'albersUSA'",
        },
      },
    },
    choroplethScaleType: {
      control: 'inline-radio',
      options: ['categorical', 'threshold'],
      table: { type: { summary: "'categorical' | 'threshold'" } },
    },
    showColorScale: { table: { defaultValue: { summary: 'true' } } },
    highlightedIds: {
      control: 'text',
      table: { type: { summary: 'string[]' } },
    },
    zoomInteraction: {
      control: 'inline-radio',
      options: ['scroll', 'ctrlScroll', 'button', 'noZoom'],
      table: {
        type: {
          summary: "'scroll' | 'ctrlScroll' | 'button' | 'noZoom'",
        },
        defaultValue: { summary: 'button' },
      },
    },
    detailsOnClick: {
      control: 'text',
      table: { type: { summary: 'string | (_d: any) => React.ReactNode' } },
    },
    tooltip: {
      control: 'text',
      table: { type: { summary: 'string | (_d: any) => React.ReactNode' } },
    },
    centerPoint: {
      control: 'text',
      table: { type: { summary: '[number, number]' } },
    },
    projectionRotate: {
      control: 'text',
      table: {
        type: { summary: '[number,number] | [number, number, number]' },
        defaultValue: { summary: '[0, 0]' },
      },
    },
    zoomTranslateExtend: {
      control: 'text',
      table: { type: { summary: '[[number, number], [number, number]]' } },
    },
    zoomScaleExtend: {
      control: 'text',
      table: { type: { summary: '[number, number]' } },
    },

    // Graph parameters
    animate: {
      control: 'text',
      table: {
        type: {
          summary: 'boolean | {duration: number; once: boolean; amount: `some` | `all` | number}',
          detail:
            'duration defines the time of the animation. once defines if the animation is triggered every time the element is in the view port. amount defines the amount of an element that should enter the viewport to be considered "entered". Either "some", "all" or a number between 0 and 1. ',
        },
      },
    },
    highlightedDataPoints: {
      control: 'text',
      table: { type: { summary: '(string | number)[]' } },
    },
    graphDownload: { table: { defaultValue: { summary: 'false' } } },
    dataDownload: { table: { defaultValue: { summary: 'false' } } },
    resetSelectionOnDoubleClick: {
      control: 'boolean',
      table: { defaultValue: { summary: 'true' } },
    },
    rewindCoordinatesInMapData: {
      control: 'boolean',
      table: { defaultValue: { summary: 'true' } },
    },

    // Interactions and Callbacks
    onSeriesMouseOver: { action: 'seriesMouseOver' },
    onSeriesMouseClick: { action: 'seriesMouseClick' },

    // Configuration and Options
    language: {
      control: 'select',
      options: LANGUAGE_OPTIONS,
      table: {
        type: {
          summary:
            "'en' | 'ar' | 'az' | 'bn' | 'cy' | 'he' | 'hi' | 'jp' | 'ka' | 'km' | 'ko' | 'my' | 'ne' | 'zh' | 'custom'",
        },
        defaultValue: { summary: 'en' },
      },
    },
    theme: {
      control: 'inline-radio',
      options: ['light', 'dark'],
      table: {
        type: { summary: "'light' | 'dark'" },
        defaultValue: { summary: 'light' },
      },
    },
    timeline: {
      control: 'object',
      table: {
        type: {
          summary: 'TimelineDataType',
          detail: `{
  autoplay: boolean;
  enabled: boolean;
  showOnlyActiveDate: boolean;
  speed?: number;
  dateFormat?: string; // Available formats can be found here: https://date-fns.org/docs/format
}`,
        },
      },
      defaultValue: { summary: '{ enabled: false, autoplay: false, showOnlyActiveDate: true }' },
    },
  },
  args: {
    data: [
      { id: 'IND', x: 1 },
      { id: 'FIN', x: 2 },
      { id: 'IDN', x: 3 },
      { id: 'ZAF', x: 4 },
      { id: 'PER', x: 5 },
      { id: 'PAK', x: 6 },
      { id: 'USA', x: 7 },
      { id: 'SWE', x: 8 },
      { lat: 20, long: 10 },
      { lat: 25, long: 26 },
      { lat: 0, long: 0 },
      { lat: 15, long: 5 },
      { lat: 10, long: 20 },
    ],
  },
  render: ({
    colors,
    backgroundColor,
    colorDomain,
    highlightedDataPoints,
    centerPoint,
    zoomScaleExtend,
    zoomTranslateExtend,
    animate,
    highlightedIds,
    projectionRotate,
    ...args
  }) => {
    return (
      <HybridMap
        animate={
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (animate as any) === 'false' || animate === false
            ? false
            : // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (animate as any) === 'true' || animate === true
              ? true
              : animate
                ? parseValue(animate)
                : animate
        }
        colors={parseValue(colors, colors)}
        highlightedDataPoints={parseValue(highlightedDataPoints)}
        highlightedIds={parseValue(highlightedIds)}
        centerPoint={parseValue(centerPoint)}
        zoomTranslateExtend={parseValue(zoomTranslateExtend)}
        zoomScaleExtend={parseValue(zoomScaleExtend)}
        colorDomain={parseValue(colorDomain, [2, 4, 6, 8])}
        backgroundColor={
          backgroundColor === 'false' ? false : backgroundColor === 'true' ? true : backgroundColor
        }
        projectionRotate={parseValue(projectionRotate)}
        {...args}
      />
    );
  },
};

export default meta;

type Story = StoryObj<typeof HybridMap>;

export const Default: Story = {};
