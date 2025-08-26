import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { parseValue } from '../../assets/parseValue';
import {
  CLASS_NAME_OBJECT,
  LANGUAGE_OPTIONS,
  SOURCE_OBJECT,
  STYLE_OBJECT,
} from '../../assets/constants';

import { ThreeDGlobe } from '@/index';

type PagePropsAndCustomArgs = React.ComponentProps<typeof ThreeDGlobe>;

const meta: Meta<PagePropsAndCustomArgs> = {
  title: 'Maps/3D Globe',
  component: ThreeDGlobe,
  tags: ['autodocs'],
  argTypes: {
    // Data
    data: {
      table: {
        type: {
          detail: `{
  x?: number | string | null;
  id: string;
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
      table: { type: { summary: 'string[]' } },
    },
    colorDomain: {
      control: 'text',
      table: {
        type: {
          summary: 'number[] | string[]',
          detail:
            'If type is string[] then map uses a categorical scale else it uses threshold scale',
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
    centerPoint: {
      control: 'text',
      table: { type: { summary: '[number, number]' } },
    },
    detailsOnClick: {
      control: 'text',
      table: { type: { summary: 'string | (_d: any) => React.ReactNode' } },
    },
    tooltip: {
      control: 'text',
      table: { type: { summary: 'string | (_d: any) => React.ReactNode' } },
    },

    // Graph parameters
    scaleType: {
      control: 'inline-radio',
      options: ['categorical', 'threshold'],
      table: { type: { summary: "'categorical' | 'threshold'" } },
    },
    showColorScale: { table: { defaultValue: { summary: 'true' } } },
    highlightedIds: {
      control: 'text',
      table: { type: { summary: 'string[]' } },
    },
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
      { id: 'IND', x: 1 },
      { id: 'FIN', x: 2 },
      { id: 'IDN', x: 3 },
      { id: 'ZAF', x: 4 },
      { id: 'PER', x: 5 },
      { id: 'PAK', x: 6 },
      { id: 'USA', x: 7 },
      { id: 'SWE', x: 8 },
    ],
  },
  render: ({ colors, backgroundColor, highlightedIds, colorDomain, centerPoint, ...args }) => {
    return (
      <ThreeDGlobe
        colors={parseValue(colors)}
        highlightedIds={parseValue(highlightedIds)}
        centerPoint={parseValue(centerPoint)}
        colorDomain={parseValue(colorDomain)}
        backgroundColor={
          backgroundColor === 'false' ? false : backgroundColor === 'true' ? true : backgroundColor
        }
        {...args}
      />
    );
  },
};

export default meta;

type Story = StoryObj<typeof ThreeDGlobe>;

export const Default: Story = {};
