import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import {
  CLASS_NAME_OBJECT,
  LANGUAGE_OPTIONS,
  SOURCE_OBJECT,
  STYLE_OBJECT,
} from '../assets/constants';

import { DataTable } from '@/index';

type PagePropsAndCustomArgs = React.ComponentProps<typeof DataTable>;

const meta: Meta<PagePropsAndCustomArgs> = {
  title: 'Graphs/Data table',
  component: DataTable,
  tags: ['autodocs'],
  argTypes: {
    // Data
    data: {
      control: 'object',
      table: { type: { summary: 'object[]' } },
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
    backgroundColor: {
      control: 'text',
      table: {
        type: {
          summary: 'string | boolean',
          detail: 'If type is string then background uses the string as color',
        },
      },
    },
    columnData: {
      control: 'object',
      table: {
        type: {
          detail: `{
  columnTitle?: string;
  columnId: string;
  sortable?: boolean;
  filterOptions?: string[];
  chip?: boolean;
  chipColumnId?: string;
  chipColors?: {
    value: string;
    color: string;
  }[];
  separator?: string;
  align?: 'left' | 'right' | 'center';
  suffix?: string;
  prefix?: string;
  columnWidth?: number;
}`,
        },
      },
    },
    styles: { table: { type: { detail: STYLE_OBJECT } } },
    classNames: { table: { type: { detail: CLASS_NAME_OBJECT } } },

    // Interactions and Callbacks
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
        label: '2020 Q1',
        value1: 3,
        value2: 3,
        value3: 3,
      },
      {
        label: '2020 Q2',
        value1: 8,
        value2: 3,
        value3: 3,
      },
      {
        label: '2020 Q3',
        value1: 11,
        value2: 3,
        value3: 3,
      },
      {
        label: '2020 Q4',
        value1: 19,
        value2: 3,
        value3: 3,
      },
    ],
    columnData: [
      {
        columnTitle: 'Label',
        columnId: 'label',
      },
      {
        columnTitle: 'Value #1',
        columnId: 'value1',
        sortable: true,
        align: 'right',
      },
      {
        columnTitle: 'Value #2',
        columnId: 'value2',
        align: 'center',
      },
      {
        columnTitle: 'Value #3',
        columnId: 'value3',
        prefix: 'US $ ',
      },
    ],
  },
  render: ({ backgroundColor, ...args }) => {
    return (
      <DataTable
        backgroundColor={
          backgroundColor === 'false' ? false : backgroundColor === 'true' ? true : backgroundColor
        }
        {...args}
      />
    );
  },
};

export default meta;

type Story = StoryObj<typeof DataTable>;

export const Default: Story = {};
