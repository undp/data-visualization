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

import { LineChartWithConfidenceInterval } from '@/index';

type PagePropsAndCustomArgs = React.ComponentProps<typeof LineChartWithConfidenceInterval>;

const meta: Meta<PagePropsAndCustomArgs> = {
  title: 'Graphs/Line chart with interval',
  component: LineChartWithConfidenceInterval,
  tags: ['autodocs'],
  argTypes: {
    // Data
    data: {
      table: {
        type: {
          detail: `{
  date: number | string;
  y?: number | null;
  yMin?: number | null;
  yMax?: number | null;
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
    lineColor: { control: 'color' },
    intervalAreaColor: { control: 'color' },
    intervalLineColors: { control: 'text' },
    colorLegendColors: { control: 'text' },
    colorLegendDomain: { control: 'text' },
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
    showValues: { table: { defaultValue: { summary: 'true' } } },
    showIntervalValues: { table: { defaultValue: { summary: 'false' } } },
    showIntervalDots: { table: { defaultValue: { summary: 'false' } } },
    regressionLine: {
      control: 'text',
      table: {
        type: {
          summary: 'boolean | string',
          detail: 'If the type is string then string is use to define the color of the line.',
        },
      },
    },
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
      { date: '2020', y: 3 },
      { date: '2021', y: 8 },
      { date: '2022', y: 11 },
      { date: '2023', y: 19 },
      { date: '2024', y: 3 },
      { date: '2025', y: 8 },
      { date: '2026', y: 11 },
      { date: '2027', y: 19 },
    ],
  },
  render: ({
    animateLine,
    backgroundColor,
    intervalLineColors,
    colorLegendColors,
    colorLegendDomain,
    regressionLine,
    ...args
  }) => {
    return (
      <LineChartWithConfidenceInterval
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
        backgroundColor={
          backgroundColor === 'false' ? false : backgroundColor === 'true' ? true : backgroundColor
        }
        intervalLineColors={parseValue(intervalLineColors)}
        colorLegendColors={parseValue(colorLegendColors)}
        colorLegendDomain={parseValue(colorLegendDomain)}
        regressionLine={
          regressionLine === 'false' ? false : regressionLine === 'true' ? true : regressionLine
        }
        {...args}
      />
    );
  },
};

export default meta;

type Story = StoryObj<typeof LineChartWithConfidenceInterval>;

export const Default: Story = {};
