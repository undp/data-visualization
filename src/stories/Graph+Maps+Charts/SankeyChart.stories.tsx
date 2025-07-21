import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { parseValue } from '../assets/parseValue';
import {
  CLASS_NAME_OBJECT,
  LANGUAGE_OPTIONS,
  SOURCE_OBJECT,
  STYLE_OBJECT,
} from '../assets/constants';

import { SankeyChart } from '@/index';

type PagePropsAndCustomArgs = React.ComponentProps<typeof SankeyChart>;

const meta: Meta<PagePropsAndCustomArgs> = {
  title: 'Graphs/Sankey chart',
  component: SankeyChart,
  tags: ['autodocs'],
  argTypes: {
    // Data
    data: {
      control: 'object',
      table: {
        type: {
          detail: `{
  source: string | number;
  target: string | number;
  value: number;
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
    sourceColors: {
      control: 'text',
      table: {
        type: {
          summary: 'string | string[]',
          detail: 'Requires a array sources need to be a different colors',
        },
      },
    },
    targetColors: {
      control: 'text',
      table: {
        type: {
          summary: 'string | string[]',
          detail: 'Requires a array targets need to be a different colors',
        },
      },
    },
    sourceColorDomain: {
      control: 'text',
      table: { type: { summary: '(string | number)[]' } },
    },
    targetColorDomain: {
      control: 'text',
      table: { type: { summary: '(string | number)[]' } },
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

    // Graph parameters
    showLabels: { table: { defaultValue: { summary: 'true' } } },
    showValues: { table: { defaultValue: { summary: 'true' } } },
    sortNodes: {
      control: 'inline-radio',
      options: ['asc', 'desc', 'mostReadable', 'none'],
      table: { type: { summary: "'asc' | 'desc' | 'mostReadable' | 'none'" } },
    },
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
    highlightedSourceDataPoints: {
      control: 'text',
      table: { type: { summary: '(string | number)[]' } },
    },
    highlightedTargetDataPoints: {
      control: 'text',
      table: { type: { summary: '(string | number)[]' } },
    },
    graphDownload: { table: { defaultValue: { summary: 'false' } } },
    dataDownload: { table: { defaultValue: { summary: 'false' } } },
    resetSelectionOnDoubleClick: { table: { defaultValue: { summary: 'true' } } },
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
    graphID: {
      control: 'text',
      table: { type: { summary: 'string' } },
    },
  },
  args: {
    data: [
      { source: 'A', target: 'B', value: 10 },
      { source: 'A', target: 'C', value: 15 },
      { source: 'B', target: 'D', value: 5 },
      { source: 'C', target: 'D', value: 10 },
      { source: 'C', target: 'E', value: 5 },
      { source: 'D', target: 'F', value: 8 },
      { source: 'E', target: 'F', value: 2 },
    ],
  },
  render: ({
    sourceColors,
    sourceColorDomain,
    targetColors,
    targetColorDomain,
    highlightedSourceDataPoints,
    highlightedTargetDataPoints,
    backgroundColor,
    animate,
    ...args
  }) => {
    return (
      <SankeyChart
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
        sourceColors={parseValue(sourceColors, sourceColors)}
        sourceColorDomain={parseValue(sourceColorDomain)}
        targetColors={parseValue(targetColors, targetColors)}
        targetColorDomain={parseValue(targetColorDomain)}
        highlightedSourceDataPoints={parseValue(highlightedSourceDataPoints)}
        highlightedTargetDataPoints={parseValue(highlightedTargetDataPoints)}
        backgroundColor={
          backgroundColor === 'false' ? false : backgroundColor === 'true' ? true : backgroundColor
        }
        {...args}
      />
    );
  },
};

export default meta;

type Story = StoryObj<typeof SankeyChart>;

export const Default: Story = {};
