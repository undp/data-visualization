import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { parseValue } from '../../assets/parseValue';
import {
  CLASS_NAME_OBJECT,
  LANGUAGE_OPTIONS,
  REF_VALUE_OBJECT,
  SOURCE_OBJECT,
  STYLE_OBJECT,
} from '../../assets/constants';

import { AnimatedGroupedBarGraph } from '@/index';

type PagePropsAndCustomArgs = React.ComponentProps<typeof AnimatedGroupedBarGraph>;

const meta: Meta<PagePropsAndCustomArgs> = {
  title: 'Animated graphs/Grouped gar graph',
  component: AnimatedGroupedBarGraph,
  tags: ['autodocs'],
  argTypes: {
    // Data
    data: {
      table: {
        type: {
          detail: `{
  label: string; 
  size: (number | null)[];
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
    dateFormat: { table: { defaultValue: { summary: 'yyyy' } } },

    // Colors and Styling
    colors: {
      control: 'text',
      table: { type: { summary: 'string[]' } },
    },
    colorDomain: {
      control: 'text',
      table: { type: { summary: 'string[]' } },
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
    barPadding: {
      control: {
        type: 'range',
        min: 0,
        max: 1,
        step: 0.1,
      },
    },

    // Values and Ticks
    truncateBy: { table: { defaultValue: { summary: '999' } } },
    refValues: { table: { type: { detail: REF_VALUE_OBJECT } } },
    noOfTicks: { table: { defaultValue: { summary: '5' } } },

    // Graph parameters
    showLabels: { table: { defaultValue: { summary: 'true' } } },
    showValues: { table: { defaultValue: { summary: 'true' } } },
    showTicks: { table: { defaultValue: { summary: 'true' } } },
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
    orientation: {
      control: 'inline-radio',
      options: ['vertical', 'horizontal'],
      table: {
        type: { summary: "'vertical' | 'horizontal'" },
        defaultValue: { summary: 'vertical' },
      },
    },
  },
  args: {
    data: [
      { label: 'Category 1', size: [7, 12, 5], date: '2020' },
      { label: 'Category 1', size: [8, 13, 6], date: '2021' },
      { label: 'Category 1', size: [6, 14, 4], date: '2022' },
      { label: 'Category 1', size: [9, 15, 7], date: '2023' },
      { label: 'Category 1', size: [10, 16, 8], date: '2024' },

      { label: 'Category 2', size: [8, 10, 9], date: '2020' },
      { label: 'Category 2', size: [9, 11, 10], date: '2021' },
      { label: 'Category 2', size: [7, 13, 8], date: '2022' },
      { label: 'Category 2', size: [8, 14, 9], date: '2023' },
      { label: 'Category 2', size: [9, 15, 10], date: '2024' },

      { label: 'Category 3', size: [9, 7, 11], date: '2020' },
      { label: 'Category 3', size: [10, 8, 12], date: '2021' },
      { label: 'Category 3', size: [11, 9, 13], date: '2022' },
      { label: 'Category 3', size: [12, 10, 14], date: '2023' },
      { label: 'Category 3', size: [13, 11, 15], date: '2024' },
    ],
    colorDomain: ['Apples', 'Mangoes', 'Oranges'],
  },
  render: ({ colors, backgroundColor, colorDomain, ...args }) => {
    return (
      <AnimatedGroupedBarGraph
        colors={parseValue(colors)}
        colorDomain={parseValue(colorDomain, ['Apples', 'Mangoes', 'Oranges'])}
        backgroundColor={
          backgroundColor === 'false' ? false : backgroundColor === 'true' ? true : backgroundColor
        }
        {...args}
      />
    );
  },
};

export default meta;

type Story = StoryObj<typeof AnimatedGroupedBarGraph>;

export const Default: Story = {};
