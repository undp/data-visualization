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

import { DotDensityMap } from '@/index';

type PagePropsAndCustomArgs = React.ComponentProps<typeof DotDensityMap>;

const meta: Meta<PagePropsAndCustomArgs> = {
  title: 'Maps/Dot density map/Simple',
  component: DotDensityMap,
  tags: ['autodocs'],
  argTypes: {
    // Data
    data: {
      table: {
        type: {
          detail: `{
  lat: number;
  long: number;
  radius?: number;
  color?: string | number;
  label?: string | number;
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
    showColorScale: { table: { defaultValue: { summary: 'true' } } },
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
    ...args
  }) => {
    return (
      <DotDensityMap
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
        centerPoint={parseValue(centerPoint)}
        zoomTranslateExtend={parseValue(zoomTranslateExtend)}
        zoomScaleExtend={parseValue(zoomScaleExtend)}
        colorDomain={parseValue(colorDomain, [2, 4, 6, 8])}
        backgroundColor={
          backgroundColor === 'false' ? false : backgroundColor === 'true' ? true : backgroundColor
        }
        {...args}
      />
    );
  },
};

export default meta;

type Story = StoryObj<typeof DotDensityMap>;

export const Default: Story = {};
