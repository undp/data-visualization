import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { parseValue } from '../../assets/parseValue';
import {
  CLASS_NAME_OBJECT,
  CUSTOM_LAYERS_OBJECT,
  LANGUAGE_OPTIONS,
  REF_VALUE_OBJECT,
  SOURCE_OBJECT,
  STYLE_OBJECT,
} from '../../assets/constants';

import { SimpleBarGraph } from '@/index';

type PagePropsAndCustomArgs = React.ComponentProps<typeof SimpleBarGraph>;

const meta: Meta<PagePropsAndCustomArgs> = {
  title: 'Graphs/Bar graph/Standard/Chart with timeline',
  component: SimpleBarGraph,
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
  date?: string | number; //The date key is needed when time line feature needs to be used
  data?: object;  //The data key in the object is used when downloading data and can be used to show additional points in mouseover
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
    refValues: {
      table: {
        type: {
          summary: 'ReferenceDataType[]',
          detail: REF_VALUE_OBJECT,
        },
      },
    },
    noOfTicks: { table: { defaultValue: { summary: '5' } } },

    // Graph parameters
    animate: {
      control: 'text',
      table: {
        type: {
          summary: 'boolean | {duration: number; once: boolean; amount: `some` | `all` | number}',
          detail:
            'duration defines the time of the animation. once defines if the animation is triggered every time the element is in the view port. amount defines the amount of an element that should enter the viewport to be considered "entered". Either "some", "all" or a number between 0 and 1. ',
        },
      },
    },
    showLabels: { table: { defaultValue: { summary: 'true' } } },
    showValues: { table: { defaultValue: { summary: 'true' } } },
    filterNA: { table: { defaultValue: { summary: 'true' } } },
    labelOrder: {
      control: 'text',
      table: { type: { summary: 'string[]' } },
    },
    showTicks: { table: { defaultValue: { summary: 'true' } } },
    showColorScale: { table: { defaultValue: { summary: 'true' } } },
    showNAColor: { table: { defaultValue: { summary: 'true' } } },
    highlightedDataPoints: {
      control: 'text',
      table: { type: { summary: '(string | number)[]' } },
    },
    detailsOnClick: {
      control: 'text',
      table: { type: { summary: 'string | (_d: any) => React.ReactNode' } },
    },
    tooltip: {
      control: 'text',
      table: { type: { summary: 'string | (_d: any) => React.ReactNode' } },
    },
    graphDownload: { table: { defaultValue: { summary: 'false' } } },
    dataDownload: { table: { defaultValue: { summary: 'false' } } },
    resetSelectionOnDoubleClick: {
      control: 'boolean',
      table: { defaultValue: { summary: 'true' } },
    },

    // Interactions and Callbacks
    onSeriesMouseOver: { action: 'seriesMouseOver' },
    onSeriesMouseClick: { action: 'seriesMouseClick' },

    // Configuration and Options
    sortData: {
      control: 'inline-radio',
      options: ['asc', 'desc'],
      table: { type: { summary: "'asc' | 'desc'" } },
    },
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
    timeline: {
      control: 'object',
      table: {
        type: {
          summary: 'TimelineDataType',
          detail: `{
  autoplay: boolean;
  enabled: boolean;
  showOnlyActiveDate: boolean;
  speed?: number;
  dateFormat?: string;
}`,
        },
        defaultValue: { summary: '{ enabled: false, autoplay: false, showOnlyActiveDate: true }' },
      },
    },
  },
  args: {
    data: [
      {
        date: '2020',
        label: 'Category 1',
        size: 7,
      },
      {
        date: '2021',
        label: 'Category 1',
        size: -12,
      },
      {
        date: '2022',
        label: 'Category 1',
        size: 5,
      },
      {
        date: '2023',
        label: 'Category 1',
        size: 14,
      },
      {
        date: '2024',
        label: 'Category 1',
        size: 9,
      },
      {
        date: '2020',
        label: 'Category 2',
        size: 8,
      },
      {
        date: '2021',
        label: 'Category 2',
        size: 15,
      },
      {
        date: '2022',
        label: 'Category 2',
        size: 6,
      },
      {
        date: '2023',
        label: 'Category 2',
        size: 13,
      },
      {
        date: '2024',
        label: 'Category 2',
        size: 10,
      },
      {
        date: '2020',
        label: 'Category 3',
        size: 9,
      },
      {
        date: '2021',
        label: 'Category 3',
        size: 14,
      },
      {
        date: '2022',
        label: 'Category 3',
        size: 8,
      },
      {
        date: '2023',
        label: 'Category 3',
        size: 17,
      },
      {
        date: '2024',
        label: 'Category 3',
        size: 12,
      },
      {
        date: '2020',
        label: 'Category 4',
        size: 10,
      },
      {
        date: '2021',
        label: 'Category 4',
        size: 11,
      },
      {
        date: '2022',
        label: 'Category 4',
        size: 13,
      },
      {
        date: '2023',
        label: 'Category 4',
        size: 15,
      },
      {
        date: '2024',
        label: 'Category 4',
        size: 7,
      },
    ],
    timeline: {
      enabled: true,
      autoplay: false,
      showOnlyActiveDate: false,
      speed: 2,
      dateFormat: 'yyyy',
    },
    animate: true,
  },
  render: ({
    colors,
    labelOrder,
    highlightedDataPoints,
    backgroundColor,
    colorDomain,
    animate,
    ...args
  }) => {
    return (
      <SimpleBarGraph
        animate={
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (animate as any) === 'false' || animate === false
            ? false
            : // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (animate as any) === 'true' || animate === true
              ? true
              : animate
                ? parseValue(animate)
                : animate
        }
        colors={parseValue(colors, colors)}
        labelOrder={parseValue(labelOrder)}
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

type Story = StoryObj<typeof SimpleBarGraph>;

export const Default: Story = {};
