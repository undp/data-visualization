import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { parseValue } from '../../assets/parseValue';
import {
  CLASS_NAME_OBJECT,
  LANGUAGE_OPTIONS,
  SOURCE_OBJECT,
  STYLE_OBJECT,
} from '../../assets/constants';

import { GeoHubMap } from '@/index';

type PagePropsAndCustomArgs = React.ComponentProps<typeof GeoHubMap>;

const meta: Meta<PagePropsAndCustomArgs> = {
  title: 'Maps/GeoHub maps/Simple',
  component: GeoHubMap,
  tags: ['autodocs'],
  argTypes: {
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
    styles: { table: { type: { detail: STYLE_OBJECT } } },
    classNames: { table: { type: { detail: CLASS_NAME_OBJECT } } },

    // Size and Spacing
    mapStyle: {
      control: 'text',
      table: {
        type: {
          summary: 'string | { style: string; name: string }[]',
          detail:
            'If the type is string, otherwise it creates and dropdown and provide end user to select the map style they would like to',
        },
      },
    },
    mapLegend: {
      control: 'text',
      table: {
        type: {
          summary:
            'string | React.ReactNode | { mapStyleName: string; legend: string | React.ReactNode }[]',
          detail:
            'If the mapStyle is string, mapLegend can be string or ReactNode. mapLegend with type string is show as innerHTML. If the mapStyle is not string, mapLegend is of type { mapStyleName: string; legend: string | React.ReactNode }[] where mapStyleName corresponds to the each name in the mapStyle.',
        },
      },
    },
    minHeight: { table: { defaultValue: { summary: '0' } } },

    // Values and Ticks
    center: {
      control: 'text',
      table: { type: { summary: '[number, number]' } },
    },

    // Graph parameters
    includeLayers: { control: 'text' },
    excludeLayers: { control: 'text' },

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
    uiMode: {
      control: 'inline-radio',
      options: ['light', 'normal'],
      table: {
        type: { summary: "'light' | 'normal'" },
        defaultValue: { summary: 'light' },
      },
    },
  },
  args: {
    mapStyle:
      'https://api.maptiler.com/maps/hybrid/style.json?key=YbCPLULzWdf1NplssEIc#0.8/-14.45028/20.54042',
  },
  render: ({ center, backgroundColor, mapStyle, includeLayers, excludeLayers, ...args }) => {
    return (
      <GeoHubMap
        mapStyle={
          !mapStyle
            ? 'https://api.maptiler.com/maps/hybrid/style.json?key=YbCPLULzWdf1NplssEIc#0.8/-14.45028/20.54042'
            : parseValue(mapStyle, mapStyle)
        }
        center={parseValue(center)}
        includeLayers={parseValue(includeLayers)}
        excludeLayers={parseValue(excludeLayers)}
        backgroundColor={
          backgroundColor === 'false' ? false : backgroundColor === 'true' ? true : backgroundColor
        }
        {...args}
      />
    );
  },
};

export default meta;

type Story = StoryObj<typeof GeoHubMap>;

export const Default: Story = {};
