import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import {
  CLASS_NAME_OBJECT,
  LANGUAGE_OPTIONS,
  REF_VALUE_OBJECT,
  SOURCE_OBJECT,
  STYLE_OBJECT,
} from '../../assets/constants';
import { parseValue } from '../../assets/parseValue';

import { MultiLineAltChart } from '@/index';

type PagePropsAndCustomArgs = React.ComponentProps<typeof MultiLineAltChart>;

const meta: Meta<PagePropsAndCustomArgs> = {
  title: 'Graphs/Multi-line chart (Alternative)',
  component: MultiLineAltChart,
  tags: ['autodocs'],
  argTypes: {
    // Data
    data: {
      table: {
        type: {
          detail: `{
  date: number | string;
  y: number;
  label: string | number;
  color?: string;
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
    refValues: { table: { type: { detail: REF_VALUE_OBJECT } } },
    noOfXTicks: { table: { defaultValue: { summary: '5' } } },
    noOfYTicks: { table: { defaultValue: { summary: '5' } } },
    minDate: { control: 'text' },
    maxDate: { control: 'text' },

    // Graph parameters
    animateLine: {
      control: 'text',
      table: {
        type: {
          summary: 'boolean | number',
          detail:
            'If the type is number then it uses the number as the time in seconds for animation.',
        },
      },
    },
    dateFormat: { table: { defaultValue: { summary: 'yyyy' } } },
    curveType: {
      control: 'radio',
      options: ['linear', 'curve', 'step', 'stepAfter', 'stepBefore'],
      table: {
        type: {
          summary: "'linear' | 'curve' | 'step' | 'stepAfter' | 'stepBefore'",
        },
        defaultValue: { summary: 'curve' },
      },
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
    highlightedLines: { control: 'text' },
    dataDownload: { table: { defaultValue: { summary: 'false' } } },

    // Interactions and Callbacks
    onSeriesMouseOver: { action: 'seriesMouseOver' },
    tooltip: {
      control: 'text',
      table: { type: { summary: 'string | (_d: any) => React.ReactNode' } },
    },

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
      { date: '2020', label: 'Q1', y: 1 },
      { date: '2020', label: 'Q2', y: 3 },
      { date: '2020', label: 'Q3', y: 4 },
      { date: '2020', label: 'Q4', y: 5 },
      { date: '2021', label: 'Q1', y: 3 },
      { date: '2021', label: 'Q2', y: 2 },
      { date: '2021', label: 'Q3', y: 1 },
      { date: '2021', label: 'Q4', y: 8 },
      { date: '2022', label: 'Q1', y: 0 },
      { date: '2022', label: 'Q2', y: 4 },
      { date: '2022', label: 'Q3', y: 8 },
      { date: '2022', label: 'Q4', y: 9 },
      { date: '2023', label: 'Q1', y: 10 },
      { date: '2023', label: 'Q2', y: 2 },
      { date: '2023', label: 'Q3', y: 1 },
      { date: '2023', label: 'Q4', y: 3 },
      { date: '2024', label: 'Q1', y: 6 },
      { date: '2024', label: 'Q2', y: 4 },
      { date: '2024', label: 'Q3', y: 5 },
      { date: '2024', label: 'Q4', y: 9 },
    ],
  },
  render: ({ animateLine, backgroundColor, highlightedLines, colors, ...args }) => {
    return (
      <MultiLineAltChart
        animateLine={
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (animateLine as any) === 'false' || animateLine === false
            ? false
            : // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (animateLine as any) === 'true' || animateLine === true
              ? true
              : animateLine
                ? Number(animateLine)
                : animateLine
        }
        colors={parseValue(colors, colors)}
        highlightedLines={parseValue(highlightedLines)}
        backgroundColor={
          backgroundColor === 'false' ? false : backgroundColor === 'true' ? true : backgroundColor
        }
        {...args}
      />
    );
  },
};

export default meta;

type Story = StoryObj<typeof MultiLineAltChart>;

export const Default: Story = {};
