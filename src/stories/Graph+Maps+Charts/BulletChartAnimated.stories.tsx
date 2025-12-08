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

import { BulletChart } from '@/index';

type PagePropsAndCustomArgs = React.ComponentProps<typeof BulletChart>;

const meta: Meta<PagePropsAndCustomArgs> = {
  title: 'Graphs/Bullet chart/Chart with timeline',
  component: BulletChart,
  tags: ['autodocs'],
  argTypes: {
    // Data
    data: {
      table: {
        type: {
          detail: `{
  label: string; 
  size?: number | null;
  target?: number | null;
  qualitativeRange?: number[] | null;
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
    barColor: {
      control: 'color',
    },
    targetColor: {
      control: 'color',
    },
    targetStyle: {
      control: 'inline-radio',
      table: {
        type: {
          summary: 'background | line',
        },
        defaultValue: {
          summary: 'line',
        },
      },
      options: ['background', 'line'],
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
    measureBarWidthFactor: {
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
  dateFormat?: string; // Available formats can be found here: https://date-fns.org/docs/format
}`,
        },
      },
      defaultValue: { summary: '{ enabled: false, autoplay: false, showOnlyActiveDate: true }' },
    },
  },
  args: {
    data: [
      { label: 'Apple', size: 3, target: 5, qualitativeRange: [1, 2, 3], date: '2020' },
      { label: 'Banana', size: 8, target: 5, qualitativeRange: [5, 2, 3], date: '2020' },
      { label: 'Cherry', size: 11, target: 5, qualitativeRange: [1, 2, 3], date: '2020' },
      { label: 'Date', size: 19, target: 5, qualitativeRange: [1, 2, 3], date: '2020' },
      { label: 'Apple', size: 12, target: 15, qualitativeRange: [1, 2, 3], date: '2021' },
      { label: 'Banana', size: 16, target: 10, qualitativeRange: [5, 2, 3], date: '2021' },
      { label: 'Cherry', size: 11, target: 15, qualitativeRange: [1, 2, 3], date: '2021' },
      { label: 'Date', size: 19, target: 5, qualitativeRange: [1, 2, 3], date: '2021' },
      { label: 'Apple', size: 15, target: 8, qualitativeRange: [1, 2, 3], date: '2022' },
      { label: 'Banana', size: 17, target: 4, qualitativeRange: [5, 2, 3], date: '2022' },
      { label: 'Cherry', size: 14, target: 2, qualitativeRange: [1, 2, 3], date: '2022' },
      { label: 'Date', size: 13, target: 9, qualitativeRange: [1, 2, 3], date: '2022' },
    ],
  },
  render: ({
    labelOrder,
    highlightedDataPoints,
    backgroundColor,
    colorDomain,
    animate,
    ...args
  }) => {
    return (
      <BulletChart
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

type Story = StoryObj<typeof BulletChart>;

export const Default: Story = {};
