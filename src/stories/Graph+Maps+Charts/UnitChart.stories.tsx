import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { parseValue } from '../assets/parseValue';
import {
  CLASS_NAME_OBJECT,
  LANGUAGE_OPTIONS,
  SOURCE_OBJECT,
  STYLE_OBJECT,
} from '../assets/constants';

import { UnitChart } from '@/index';

type PagePropsAndCustomArgs = React.ComponentProps<typeof UnitChart>;

const meta: Meta<PagePropsAndCustomArgs> = {
  title: 'Graphs/Unit chart',
  component: UnitChart,
  tags: ['autodocs'],
  argTypes: {
    // Data
    data: {
      table: {
        type: {
          detail: `{
  label: number | string;
  value: number;
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
    // Values and Ticks

    // Graph parameters
    showColorScale: { table: { defaultValue: { summary: 'true' } } },
    graphDownload: { table: { defaultValue: { summary: 'false' } } },
    size: { table: { defaultValue: { summary: '200' } } },
    totalNoOfDots: { table: { defaultValue: { summary: '100' } } },
    unitPadding: { table: { defaultValue: { summary: '3' } } },
    gridSize: { table: { defaultValue: { summary: '10' } } },
    dataDownload: { table: { defaultValue: { summary: 'false' } } },

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
      { label: 'Male', value: 3 },
      { label: 'Female', value: 8 },
    ],
  },
  render: ({ colors, backgroundColor, ...args }) => {
    return (
      <UnitChart
        colors={parseValue(colors, colors)}
        backgroundColor={
          backgroundColor === 'false' ? false : backgroundColor === 'true' ? true : backgroundColor
        }
        {...args}
      />
    );
  },
};

export default meta;

type Story = StoryObj<typeof UnitChart>;

export const Default: Story = {};
