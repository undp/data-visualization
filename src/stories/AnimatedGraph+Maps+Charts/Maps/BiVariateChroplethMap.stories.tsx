import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { parseValue } from '../../assets/parseValue';
import {
  CLASS_NAME_OBJECT,
  LANGUAGE_OPTIONS,
  SOURCE_OBJECT,
  STYLE_OBJECT,
} from '../../assets/constants';

import { AnimatedBiVariateChoroplethMap } from '@/index';

type PagePropsAndCustomArgs = React.ComponentProps<typeof AnimatedBiVariateChoroplethMap>;

const meta: Meta<PagePropsAndCustomArgs> = {
  title: 'Animated maps/Bi-variate choropleth map',
  component: AnimatedBiVariateChoroplethMap,
  tags: ['autodocs'],
  argTypes: {
    // Data
    data: {
      table: {
        type: {
          detail: `{
  x?: number | null;
  y?: number | null;
  id: string;
  date: string | number;
  data?: object; //The data key in the object is used when downloading data and can be used to show additional points in mouseover
}`,
        },
      },
    },

    // Titles and Labels and Sources
    sources: { table: { type: { detail: SOURCE_OBJECT } } },

    dateFormat: { table: { defaultValue: { summary: 'yyyy' } } },

    // Colors and Styling
    colors: {
      control: 'text',
      table: { type: { summary: 'string[][]' } },
    },
    mapNoDataColor: { control: 'color' },
    mapBorderColor: { control: 'color' },
    xDomain: {
      control: 'text',
      table: {
        type: {
          summary: 'number[]',
          detail: 'The length of array should be equal to the no. of rows in colors props',
        },
      },
    },
    yDomain: {
      control: 'text',
      table: {
        type: {
          summary: 'number[]',
          detail: 'The length of array should be equal to the no. of columns in colors props',
        },
      },
    },
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
    highlightedIds: {
      control: 'text',
      table: { type: { summary: 'string[]' } },
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
  },
  args: {
    data: [
      {
        id: 'IND',
        x: 1,
        y: 3,
        date: '2020',
      },
      {
        id: 'FIN',
        x: 2,
        y: 8,
        date: '2020',
      },
      {
        id: 'IDN',
        x: 3,
        y: 11,
        date: '2020',
      },

      {
        id: 'ZAF',
        x: 4,
        y: 19,
        date: '2021',
      },
      {
        id: 'PER',
        x: 5,
        y: 3,
        date: '2021',
      },
      {
        id: 'PAK',
        x: 6,
        y: 8,
        date: '2021',
      },

      {
        id: 'USA',
        x: 7,
        y: 11,
        date: '2022',
      },
      {
        id: 'SWE',
        x: 8,
        y: 19,
        date: '2022',
      },
      {
        id: 'BRA',
        x: 9,
        y: 5,
        date: '2022',
      },
    ],
    xDomain: [2, 4, 6, 8],
    yDomain: [2, 4, 6, 8],
  },
  render: ({
    colors,
    backgroundColor,
    xDomain,
    yDomain,
    highlightedIds,
    centerPoint,
    zoomScaleExtend,
    zoomTranslateExtend,
    ...args
  }) => {
    return (
      <AnimatedBiVariateChoroplethMap
        colors={parseValue(colors)}
        highlightedIds={parseValue(highlightedIds)}
        centerPoint={parseValue(centerPoint)}
        zoomTranslateExtend={parseValue(zoomTranslateExtend)}
        zoomScaleExtend={parseValue(zoomScaleExtend)}
        xDomain={parseValue(xDomain, [2, 4, 6, 8])}
        yDomain={parseValue(yDomain, [2, 4, 6, 8])}
        backgroundColor={
          backgroundColor === 'false' ? false : backgroundColor === 'true' ? true : backgroundColor
        }
        {...args}
      />
    );
  },
};

export default meta;

type Story = StoryObj<typeof AnimatedBiVariateChoroplethMap>;

export const Default: Story = {};
