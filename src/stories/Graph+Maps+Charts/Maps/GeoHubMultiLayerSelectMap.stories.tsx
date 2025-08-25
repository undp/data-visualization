import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { parseValue } from '../../assets/parseValue';
import {
  CLASS_NAME_OBJECT,
  LANGUAGE_OPTIONS,
  SOURCE_OBJECT,
  STYLE_OBJECT,
} from '../../assets/constants';

import { GeoHubMapWithLayerSelection } from '@/index';

type PagePropsAndCustomArgs = React.ComponentProps<typeof GeoHubMapWithLayerSelection>;

const meta: Meta<PagePropsAndCustomArgs> = {
  title: 'Maps/GeoHub maps/Map with layer selection',
  component: GeoHubMapWithLayerSelection,
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
    minHeight: { table: { defaultValue: { summary: '0' } } },
    layerSelection: {
      control: 'text',
      table: { type: { summary: '{ layerID: string[]; name: string }[]' } },
    },
    mapLegend: {
      control: 'text',
      table: {
        type: {
          summary: '{ mapStyleName: string; legend: string | React.ReactNode }[]',
          detail:
            'mapLegend is of type { mapStyleName: string; legend: string | React.ReactNode }[] where mapStyleName corresponds to the each name in the layerSelection.',
        },
      },
    },

    // Values and Ticks
    center: {
      control: 'text',
      table: { type: { summary: '[number, number]' } },
    },

    // Graph parameters
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

    layerSelection: [
      {
        name: 'Population',
        layerID: ['layer-1', 'layer-2'],
      },
      {
        name: 'Female Population',
        layerID: ['layer-3', 'layer-4'],
      },
    ],
  },
  render: ({ center, backgroundColor, excludeLayers, layerSelection, ...args }) => {
    return (
      <GeoHubMapWithLayerSelection
        layerSelection={parseValue(layerSelection, [
          {
            name: 'Population',
            layerID: ['layer-1', 'layer-2'],
          },
          {
            name: 'Female Population',
            layerID: ['layer-3', 'layer-4'],
          },
        ])}
        center={parseValue(center)}
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

type Story = StoryObj<typeof GeoHubMapWithLayerSelection>;

export const Default: Story = {};
