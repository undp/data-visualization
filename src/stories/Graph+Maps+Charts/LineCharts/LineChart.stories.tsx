import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import {
  CLASS_NAME_OBJECT,
  CUSTOM_LAYERS_OBJECT,
  LANGUAGE_OPTIONS,
  REF_VALUE_OBJECT,
  SOURCE_OBJECT,
  STYLE_OBJECT,
} from '../../assets/constants';

import { SimpleLineChart } from '@/index';

type PagePropsAndCustomArgs = React.ComponentProps<typeof SimpleLineChart>;

const meta: Meta<PagePropsAndCustomArgs> = {
  title: 'Graphs/Line chart',
  component: SimpleLineChart,
  tags: ['autodocs'],
  argTypes: {
    // Data
    data: {
      table: {
        type: {
          detail: `{
  date: number | string;
  y: number;
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
    lineColor: { control: 'color' },
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
    animate: {
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
    regressionLine: {
      control: 'text',
      table: {
        type: {
          summary: 'boolean | string',
          detail: 'If the type is string then string is use to define the color of the line.',
        },
      },
    },
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
  render: ({ animate, backgroundColor, regressionLine, ...args }) => {
    return (
      <SimpleLineChart
        animate={
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (animate as any) === 'false' || animate === false
            ? false
            : // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (animate as any) === 'true' || animate === true
              ? true
              : animate
                ? Number(animate)
                : animate
        }
        regressionLine={
          regressionLine === 'false' ? false : regressionLine === 'true' ? true : regressionLine
        }
        backgroundColor={
          backgroundColor === 'false' ? false : backgroundColor === 'true' ? true : backgroundColor
        }
        {...args}
      />
    );
  },
};

export default meta;

type Story = StoryObj<typeof SimpleLineChart>;

export const Default: Story = {};
