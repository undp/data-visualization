import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import {
  CLASS_NAME_OBJECT,
  LANGUAGE_OPTIONS,
  SOURCE_OBJECT,
  STYLE_OBJECT,
} from '../../assets/constants';

import { BasicStatCard } from '@/index';

type PagePropsAndCustomArgs = React.ComponentProps<typeof BasicStatCard>;

const meta: Meta<PagePropsAndCustomArgs> = {
  title: 'Graphs/Basic stat card',
  component: BasicStatCard,
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
    backgroundColor: {
      control: 'text',
      table: {
        type: {
          summary: 'string | boolean',
          detail: 'If type is string then background uses the string as color',
        },
        defaultValue: { summary: 'false' },
      },
    },
    layout: {
      control: 'inline-radio',
      options: ['primary', 'secondary'],
      table: {
        type: {
          summary: 'primary | secondary',
        },
        defaultValue: { summary: 'primary' },
      },
    },
    styles: { table: { type: { detail: STYLE_OBJECT } } },
    verticalAlign: {
      control: 'inline-radio',
      options: ['center', 'top', 'bottom'],
      table: {
        type: { summary: "'center' | 'top' | 'bottom'" },
        defaultValue: { summary: 'center' },
      },
    },
    headingFontSize: { table: { defaultValue: { summary: '4.375rem' } } },
    classNames: { table: { type: { detail: CLASS_NAME_OBJECT } } },
    // Graph parameters
    centerAlign: { table: { defaultValue: { summary: 'false' } } },
    textBackground: { table: { defaultValue: { summary: 'false' } } },
    value: {
      control: 'text',
      table: { type: { summary: 'number | string' } },
    },
    year: {
      control: 'text',
      table: { type: { summary: 'number | string' } },
    },
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
  args: { value: 20 },
  render: ({ backgroundColor, ...args }) => {
    return (
      <BasicStatCard
        backgroundColor={
          backgroundColor === 'false' ? false : backgroundColor === 'true' ? true : backgroundColor
        }
        {...args}
      />
    );
  },
};

export default meta;

type Story = StoryObj<typeof BasicStatCard>;

export const Default: Story = {};
