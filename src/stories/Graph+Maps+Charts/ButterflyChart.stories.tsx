import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import {
  CLASS_NAME_OBJECT,
  CUSTOM_LAYERS_OBJECT,
  LANGUAGE_OPTIONS,
  REF_VALUE_OBJECT,
  SOURCE_OBJECT,
  STYLE_OBJECT,
} from '../assets/constants';
import { parseValue } from '../assets/parseValue';

import { ButterflyChart } from '@/index';

type PagePropsAndCustomArgs = React.ComponentProps<typeof ButterflyChart>;

const meta: Meta<PagePropsAndCustomArgs> = {
  title: 'Graphs/Butterfly chart/Simple',
  component: ButterflyChart,
  tags: ['autodocs'],
  argTypes: {
    // Data
    data: {
      table: {
        type: {
          summary: 'ButterflyChartDataType[]',
          detail: `{
  label: string | number;
  position: number;
  radius?: number;
  color?: string;
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
    centerGap: { table: { defaultValue: { summary: '100' } } },

    // Values and Ticks
    truncateBy: { table: { defaultValue: { summary: '999' } } },
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
    showValues: { table: { defaultValue: { summary: 'true' } } },
    showTicks: { table: { defaultValue: { summary: 'true' } } },
    hideAxisLine: { table: { defaultValue: { summary: 'false' } } },
    showColorScale: { table: { defaultValue: { summary: 'false' } } },
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
      { label: '2010', leftBar: 3, rightBar: 5 },
      { label: '2012', leftBar: 8, rightBar: 10 },
      { label: '2014', leftBar: 11, rightBar: 6 },
      { label: '2016', leftBar: 19, rightBar: 17 },
      { label: '2018', leftBar: 3, rightBar: 15 },
      { label: '2020', leftBar: 8, rightBar: 7 },
      { label: '2022', leftBar: 11, rightBar: 8 },
      { label: '2024', leftBar: 19, rightBar: 9 },
    ],
  },
  render: ({ backgroundColor, animate, ...args }) => {
    return (
      <ButterflyChart
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
        backgroundColor={
          backgroundColor === 'false' ? false : backgroundColor === 'true' ? true : backgroundColor
        }
        {...args}
      />
    );
  },
};

export default meta;

type Story = StoryObj<typeof ButterflyChart>;

export const Default: Story = {};
