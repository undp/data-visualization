import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { parseValue } from '../assets/parseValue';
import {
  CLASS_NAME_OBJECT,
  LANGUAGE_OPTIONS,
  SOURCE_OBJECT,
  STYLE_OBJECT,
} from '../assets/constants';

import { HeatMap } from '@/index';

type PagePropsAndCustomArgs = React.ComponentProps<typeof HeatMap>;

const meta: Meta<PagePropsAndCustomArgs> = {
  title: 'Graphs/Heat map',
  component: HeatMap,
  tags: ['autodocs'],
  argTypes: {
    // Data
    data: {
      table: {
        type: {
          detail: `{
  row: string;
  column: string;
  value?: string | number;
  data?: object; //The data key in the object is used when downloading data and can be used to show additional points in mouseover
}`,
        },
      },
    },

    // Titles and Labels and Sources
    sources: { table: { type: { detail: SOURCE_OBJECT } } },

    // Colors and Styling
    colors: {
      control: 'text',
      table: { type: { summary: 'string[]' } },
    },
    noDataColor: { control: 'color' },
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
    truncateBy: { table: { defaultValue: { summary: '999' } } },

    // Graph parameters
    showColumnLabels: { table: { defaultValue: { summary: 'true' } } },
    showRowLabels: { table: { defaultValue: { summary: 'true' } } },
    showValues: { table: { defaultValue: { summary: 'true' } } },
    scaleType: {
      control: 'inline-radio',
      options: ['categorical', 'linear', 'threshold'],
      table: { type: { summary: "'categorical' | 'linear' | 'threshold'" } },
    },
    showColorScale: { table: { defaultValue: { summary: 'true' } } },
    showNAColor: { table: { defaultValue: { summary: 'true' } } },
    colorDomain: {
      control: 'text',
      table: { type: { summary: 'number[] | string[]' } },
    },
    graphDownload: { table: { defaultValue: { summary: 'false' } } },
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
  },
  args: {
    data: [
      { row: '2020', column: 'Q1', value: 1 },
      { row: '2020', column: 'Q2', value: 3 },
      { row: '2020', column: 'Q3', value: 4 },
      { row: '2020', column: 'Q4', value: 5 },
      { row: '2021', column: 'Q1', value: 3 },
      { row: '2021', column: 'Q2', value: 2 },
      { row: '2021', column: 'Q3', value: 1 },
      { row: '2021', column: 'Q4', value: 8 },
      { row: '2022', column: 'Q1', value: 0 },
      { row: '2022', column: 'Q2', value: 4 },
      { row: '2022', column: 'Q3', value: 8 },
      { row: '2022', column: 'Q4', value: 9 },
      { row: '2023', column: 'Q1', value: 10 },
      { row: '2023', column: 'Q2', value: 2 },
      { row: '2023', column: 'Q3', value: 1 },
      { row: '2023', column: 'Q4', value: 3 },
      { row: '2024', column: 'Q1', value: 6 },
      { row: '2024', column: 'Q2', value: 4 },
      { row: '2024', column: 'Q3', value: 5 },
      { row: '2024', column: 'Q4', value: 9 },
    ],
    colorDomain: [2, 4, 6, 8],
  },
  render: ({ colors, colorDomain, backgroundColor, ...args }) => {
    return (
      <HeatMap
        colors={parseValue(colors, colors)}
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

type Story = StoryObj<typeof HeatMap>;

export const Default: Story = {};
