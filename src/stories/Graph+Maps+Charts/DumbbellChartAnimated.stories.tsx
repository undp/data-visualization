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

import { DumbbellChart } from '@/index';

type PagePropsAndCustomArgs = React.ComponentProps<typeof DumbbellChart>;

const meta: Meta<PagePropsAndCustomArgs> = {
  title: 'Graphs/Dumbbell chart/Chart with timeline',
  component: DumbbellChart,
  tags: ['autodocs'],
  argTypes: {
    // Data
    data: {
      control: 'object',
      table: {
        type: {
          summary: 'DumbbellChartDataType[]',
          detail: `{
  label: string; 
  x: (number | null)[];
  date?: string | number; //The date key is needed when time line feature needs to be used
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
    colors: { control: 'text' },
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
    truncateBy: {
      control: 'number',
      table: { defaultValue: { summary: '999' } },
    },
    refValues: { table: { type: { detail: REF_VALUE_OBJECT } } },
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
    labelOrder: {
      control: 'text',
      table: { type: { summary: 'string[]' } },
    },
    showTicks: { table: { defaultValue: { summary: 'true' } } },
    arrowConnector: { table: { defaultValue: { summary: 'false' } } },
    connectorStrokeWidth: { table: { defaultValue: { summary: '2' } } },
    filterNA: { table: { defaultValue: { summary: 'true' } } },
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
    sortParameter: {
      control: 'text',
      table: { type: { summary: "'number' | 'diff'" } },
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
  dateFormat?: string; // Available formats can be found here: https://date-fns.org/docs/format
}`,
        },
      },
      defaultValue: { summary: '{ enabled: false, autoplay: false, showOnlyActiveDate: true }' },
    },
  },
  args: {
    data: [
      {
        label: 'Category 1',
        x: [3, 6],
        date: '2020',
      },
      {
        label: 'Category 1',
        x: [8, 2],
        date: '2021',
      },
      {
        label: 'Category 1',
        x: [11, 5],
        date: '2022',
      },
      {
        label: 'Category 1',
        x: [19, 7],
        date: '2023',
      },
      {
        label: 'Category 2',
        x: [3, 4],
        date: '2020',
      },
      {
        label: 'Category 2',
        x: [8, 12],
        date: '2021',
      },
      {
        label: 'Category 2',
        x: [11, 15],
        date: '2022',
      },
      {
        label: 'Category 2',
        x: [19, 5],
        date: '2023',
      },
      {
        label: 'Category 3',
        x: [5, 9],
        date: '2020',
      },
      {
        label: 'Category 3',
        x: [7, 14],
        date: '2021',
      },
      {
        label: 'Category 3',
        x: [10, 13],
        date: '2022',
      },
      {
        label: 'Category 3',
        x: [12, 6],
        date: '2023',
      },
      {
        label: 'Category 4',
        x: [4, 8],
        date: '2020',
      },
      {
        label: 'Category 4',
        x: [6, 11],
        date: '2021',
      },
      {
        label: 'Category 4',
        x: [9, 12],
        date: '2022',
      },
      {
        label: 'Category 4',
        x: [14, 10],
        date: '2023',
      },
    ],
    colorDomain: ['Apple', 'Oranges'],
    timeline: {
      enabled: true,
      autoplay: false,
      showOnlyActiveDate: false,
      speed: 2,
      dateFormat: 'yyyy',
    },
    animate: true,
  },
  render: ({ labelOrder, backgroundColor, colorDomain, sortParameter, animate, ...args }) => {
    return (
      <DumbbellChart
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
        labelOrder={parseValue(labelOrder)}
        colorDomain={parseValue(colorDomain, ['Apple', 'Oranges'])}
        sortParameter={
          !sortParameter
            ? undefined
            : sortParameter === 'diff'
              ? 'diff'
              : // eslint-disable-next-line @typescript-eslint/no-explicit-any
                /^\d+$/.test(sortParameter as any)
                ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  parseInt(sortParameter as any, 10)
                : undefined
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

type Story = StoryObj<typeof DumbbellChart>;

export const Default: Story = {};
