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

import { GroupedBarGraph } from '@/index';

type PagePropsAndCustomArgs = React.ComponentProps<typeof GroupedBarGraph>;

const meta: Meta<PagePropsAndCustomArgs> = {
  title: 'Graphs/Bar graph/Grouped/Simple',
  component: GroupedBarGraph,
  tags: ['autodocs'],
  argTypes: {
    // Data
    data: {
      table: {
        type: {
          detail: `{
  label: string; 
  size: (number | null)[];
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
    graphDownload: { table: { defaultValue: { summary: 'false' } } },
    dataDownload: { table: { defaultValue: { summary: 'false' } } },
    filterNA: { table: { defaultValue: { summary: 'true' } } },
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
        defaultValue: { summary: '{ enabled: false, autoplay: false, showOnlyActiveDate: true }' },
      },
    },
  },
  args: {
    data: [
      { label: '2020 Q1', size: [3, 4, 5] },
      { label: '2020 Q2', size: [8, 9, 10] },
      { label: '2020 Q3', size: [6, 7, 8] },
      { label: '2020 Q4', size: [5, 6, 7] },
    ],
    colorDomain: ['Apples', 'Mangoes', 'Oranges'],
  },
  render: ({ colors, labelOrder, backgroundColor, colorDomain, animate, ...args }) => {
    return (
      <GroupedBarGraph
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
        colors={parseValue(colors)}
        labelOrder={parseValue(labelOrder)}
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

type Story = StoryObj<typeof GroupedBarGraph>;

export const Default: Story = {};
