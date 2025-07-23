import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { parseValue } from '../assets/parseValue';
import {
  CLASS_NAME_OBJECT,
  CUSTOM_LAYERS_OBJECT,
  LANGUAGE_OPTIONS,
  REF_VALUE_OBJECT,
  SOURCE_OBJECT,
  STYLE_OBJECT,
} from '../assets/constants';

import { AnimatedScatterPlot } from '@/index';

type PagePropsAndCustomArgs = React.ComponentProps<typeof AnimatedScatterPlot>;

const meta: Meta<PagePropsAndCustomArgs> = {
  title: 'Animated graphs/Scatter plot',
  component: AnimatedScatterPlot,
  tags: ['autodocs'],
  argTypes: {
    // Data
    data: {
      table: {
        type: {
          detail: `{
  label: string; 
  size: number;
  color?: string;
  date: string | number;
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
    refXValues: { table: { type: { detail: REF_VALUE_OBJECT } } },
    refYValues: { table: { type: { detail: REF_VALUE_OBJECT } } },
    noOfXTicks: { table: { defaultValue: { summary: '5' } } },
    noOfYTicks: { table: { defaultValue: { summary: '5' } } },

    // Graph parameters
    showLabels: { table: { defaultValue: { summary: 'false' } } },
    showColorScale: { table: { defaultValue: { summary: 'true' } } },
    showNAColor: { table: { defaultValue: { summary: 'true' } } },
    highlightedDataPoints: {
      control: 'text',
      table: { type: { summary: '(string | number)[]' } },
    },
    annotations: {
      control: 'object',
      table: {
        type: {
          detail: `{
  text: string;
  maxWidth?: number;
  xCoordinate?: number | string;
  yCoordinate?: number | string;
  xOffset?: number;
  yOffset?: number;
  align?: 'center' | 'left' | 'right';
  color?: string;
  fontWeight?: 'regular' | 'bold' | 'medium';
  showConnector?: boolean | number;
  connectorRadius?: number;
  classNames?: {
    connector?: string;
    text?: string;
  };
  styles?: {
    connector?: React.CSSProperties;
    text?: React.CSSProperties;
  };
}`,
        },
      },
    },
    highlightAreaSettings: {
      control: 'object',
      table: {
        type: {
          detail: `{
  coordinates: [number | string | null, number | string | null];
  style?: React.CSSProperties;
  className?: string;
  color?: string;
  strokeWidth?: number;
}`,
        },
      },
    },
    customHighlightAreaSettings: {
      control: 'object',
      table: {
        type: {
          detail: `{
  coordinates: (number | string)[];
  closePath?: boolean;
  style?: React.CSSProperties;
  className?: string;
  color?: string;
  strokeWidth?: number;
}`,
        },
      },
    },
    graphDownload: { table: { defaultValue: { summary: 'false' } } },
    labelColor: { control: 'color' },
    dataDownload: { table: { defaultValue: { summary: 'false' } } },
    resetSelectionOnDoubleClick: {
      control: 'boolean',
      table: { defaultValue: { summary: 'true' } },
    },
    detailsOnClick: {
      control: 'text',
      table: { type: { summary: 'string | (_d: any) => React.ReactNode' } },
    },
    tooltip: {
      control: 'text',
      table: { type: { summary: 'string | (_d: any) => React.ReactNode' } },
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
    dateFormat: { table: { defaultValue: { summary: 'yyyy' } } },
  },
  args: {
    data: [
      {
        label: 'Item 1',
        x: 1,
        y: 3,
        date: '2020',
      },
      {
        label: 'Item 2',
        x: 2,
        y: 8,
        date: '2020',
      },
      {
        label: 'Item 3',
        x: 3,
        y: 11,
        date: '2020',
      },
      {
        label: 'Item 4',
        x: 4,
        y: 19,
        date: '2020',
      },
      {
        label: 'Item 5',
        x: 5,
        y: 3,
        date: '2020',
      },

      {
        label: 'Item 1',
        x: 6,
        y: 8,
        date: '2021',
      },
      {
        label: 'Item 2',
        x: 7,
        y: 11,
        date: '2021',
      },
      {
        label: 'Item 3',
        x: 8,
        y: 19,
        date: '2021',
      },
      {
        label: 'Item 4',
        x: 9,
        y: 7,
        date: '2021',
      },
      {
        label: 'Item 5',
        x: 10,
        y: 12,
        date: '2021',
      },

      {
        label: 'Item 1',
        x: 11,
        y: 14,
        date: '2022',
      },
      {
        label: 'Item 2',
        x: 12,
        y: 9,
        date: '2022',
      },
      {
        label: 'Item 3',
        x: 13,
        y: 16,
        date: '2022',
      },
      {
        label: 'Item 4',
        x: 14,
        y: 18,
        date: '2022',
      },
      {
        label: 'Item 5',
        x: 15,
        y: 5,
        date: '2022',
      },
    ],
  },
  render: ({ colors, highlightedDataPoints, backgroundColor, colorDomain, ...args }) => {
    return (
      <AnimatedScatterPlot
        colors={parseValue(colors, colors)}
        highlightedDataPoints={parseValue(highlightedDataPoints)}
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

type Story = StoryObj<typeof AnimatedScatterPlot>;

export const Default: Story = {};
