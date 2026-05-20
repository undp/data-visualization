import type { Meta } from '@storybook/react-vite';

import { Colors } from '@/Components/ColorPalette';

const ColorsList = {
  Primary: {
    'blue-100': {
      color: Colors.primaryColors['blue-100'],
      name: "Colors.primaryColors['blue-100']",
    },
    'blue-200': {
      color: Colors.primaryColors['blue-200'],
      name: "Colors.primaryColors['blue-200']",
    },
    'blue-300': {
      color: Colors.primaryColors['blue-300'],
      name: "Colors.primaryColors['blue-300']",
    },
    'blue-400': {
      color: Colors.primaryColors['blue-400'],
      name: "Colors.primaryColors['blue-400']",
    },
    'blue-500': {
      color: Colors.primaryColors['blue-500'],
      name: "Colors.primaryColors['blue-500']",
    },
    'blue-600': {
      color: Colors.primaryColors['blue-600'],
      name: "Colors.primaryColors['blue-600']",
    },
    'blue-700': {
      color: Colors.primaryColors['blue-700'],
      name: "Colors.primaryColors['blue-700']",
    },
  },
  Alerts: {
    'Light Yellow': {
      color: Colors.alerts.lightYellow,
      name: 'Colors.alerts.lightYellow',
    },
    Yellow: {
      color: Colors.alerts.yellow,
      name: 'Colors.alerts.yellow',
    },
    'Dark Yellow': {
      color: Colors.alerts.darkYellow,
      name: 'Colors.alerts.darkYellow',
    },
    'Light Red': {
      color: Colors.alerts.lightRed,
      name: 'Colors.alerts.lightRed',
    },
    Red: {
      color: Colors.alerts.red,
      name: 'Colors.alerts.red',
    },
    'Dark Red': {
      color: Colors.alerts.darkRed,
      name: 'Colors.alerts.darkRed',
    },
    'Light Green': {
      color: Colors.alerts.lightGreen,
      name: 'Colors.alerts.lightGreen',
    },
    Green: {
      color: Colors.alerts.green,
      name: 'Colors.alerts.green',
    },
    'Dark Green': {
      color: Colors.alerts.darkGreen,
      name: 'Colors.alerts.darkGreen',
    },
    'Light Azure': {
      color: Colors.alerts.lightAzure,
      name: 'Colors.alerts.lightAzure',
    },
    Azure: {
      color: Colors.alerts.azure,
      name: 'Colors.alerts.azure',
    },
    'Dark Azure': {
      color: Colors.alerts.darkAzure,
      name: 'Colors.alerts.darkAzure',
    },
  },
  Gender: {
    Male: {
      color: Colors.genderColors.male,
      name: 'Colors.genderColors.male',
    },
    Female: {
      color: Colors.genderColors.female,
      name: 'Colors.genderColors.female',
    },
  },
  Location: {
    Urban: {
      color: Colors.locationColors.urban,
      name: 'Colors.locationColors.urban',
    },
    Rural: {
      color: Colors.locationColors.rural,
      name: 'Colors.locationColors.rural',
    },
  },
  SDGs: {
    'SDG 1': {
      color: Colors.sdgColors.sdg1,
      name: 'Colors.sdgColors.sdg1',
    },
    'SDG 2': {
      color: Colors.sdgColors.sdg2,
      name: 'Colors.sdgColors.sdg2',
    },
    'SDG 3': {
      color: Colors.sdgColors.sdg3,
      name: 'Colors.sdgColors.sdg3',
    },
    'SDG 4': {
      color: Colors.sdgColors.sdg4,
      name: 'Colors.sdgColors.sdg4',
    },
    'SDG 5': {
      color: Colors.sdgColors.sdg5,
      name: 'Colors.sdgColors.sdg5',
    },
    'SDG 6': {
      color: Colors.sdgColors.sdg6,
      name: 'Colors.sdgColors.sdg6',
    },
    'SDG 7': {
      color: Colors.sdgColors.sdg7,
      name: 'Colors.sdgColors.sdg7',
    },
    'SDG 8': {
      color: Colors.sdgColors.sdg8,
      name: 'Colors.sdgColors.sdg8',
    },
    'SDG 9': {
      color: Colors.sdgColors.sdg9,
      name: 'Colors.sdgColors.sdg9',
    },
    'SDG 10': {
      color: Colors.sdgColors.sdg10,
      name: 'Colors.sdgColors.sdg10',
    },
    'SDG 11': {
      color: Colors.sdgColors.sdg11,
      name: 'Colors.sdgColors.sdg11',
    },
    'SDG 12': {
      color: Colors.sdgColors.sdg12,
      name: 'Colors.sdgColors.sdg12',
    },
    'SDG 13': {
      color: Colors.sdgColors.sdg13,
      name: 'Colors.sdgColors.sdg13',
    },
    'SDG 14': {
      color: Colors.sdgColors.sdg14,
      name: 'Colors.sdgColors.sdg14',
    },
    'SDG 15': {
      color: Colors.sdgColors.sdg15,
      name: 'Colors.sdgColors.sdg15',
    },
    'SDG 16': {
      color: Colors.sdgColors.sdg16,
      name: 'Colors.sdgColors.sdg16',
    },
    'SDG 17': {
      color: Colors.sdgColors.sdg17,
      name: 'Colors.sdgColors.sdg17',
    },
  },
  'Grays (light theme)': {
    white: {
      color: Colors.light.grays.white,
      name: 'Colors.light.grays.white',
    },
    'gray-100': {
      color: Colors.light.grays['gray-100'],
      name: "Colors.light.grays['gray-100']",
    },
    'gray-200': {
      color: Colors.light.grays['gray-200'],
      name: "Colors.light.grays['gray-200']",
    },
    'gray-300': {
      color: Colors.light.grays['gray-300'],
      name: "Colors.light.grays['gray-300']",
    },
    'gray-400': {
      color: Colors.light.grays['gray-400'],
      name: "Colors.light.grays['gray-400']",
    },
    'gray-500': {
      color: Colors.light.grays['gray-500'],
      name: "Colors.light.grays['gray-500']",
    },
    'gray-550': {
      color: Colors.light.grays['gray-550'],
      name: "Colors.light.grays['gray-550']",
    },
    'gray-600': {
      color: Colors.light.grays['gray-600'],
      name: "Colors.light.grays['gray-600']",
    },
    'gray-700': {
      color: Colors.light.grays['gray-700'],
      name: "Colors.light.grays['gray-700']",
    },
    black: {
      color: Colors.light.grays.black,
      name: 'Colors.light.grays.black',
    },
  },
  'Grays (dark theme)': {
    white: {
      color: Colors.dark.grays.white,
      name: 'Colors.dark.grays.white',
    },
    'gray-100': {
      color: Colors.dark.grays['gray-100'],
      name: "Colors.dark.grays['gray-100']",
    },
    'gray-200': {
      color: Colors.dark.grays['gray-200'],
      name: "Colors.dark.grays['gray-200']",
    },
    'gray-300': {
      color: Colors.dark.grays['gray-300'],
      name: "Colors.dark.grays['gray-300']",
    },
    'gray-400': {
      color: Colors.dark.grays['gray-400'],
      name: "Colors.dark.grays['gray-400']",
    },
    'gray-500': {
      color: Colors.dark.grays['gray-500'],
      name: "Colors.dark.grays['gray-500']",
    },
    'gray-550': {
      color: Colors.dark.grays['gray-550'],
      name: "Colors.dark.grays['gray-550']",
    },
    'gray-600': {
      color: Colors.dark.grays['gray-600'],
      name: "Colors.dark.grays['gray-600']",
    },
    'gray-700': {
      color: Colors.dark.grays['gray-700'],
      name: "Colors.dark.grays['gray-700']",
    },
    black: {
      color: Colors.dark.grays.black,
      name: 'Colors.dark.grays.black',
    },
  },
};

function ColorGrid({ colors }: { colors: Record<string, { color: string; name: string }> }) {
  return (
    <div className='gap-4 flex flex-wrap'>
      {Object.entries(colors).map(([name, value]) => (
        <div key={name} className='flex items-center space-x-2 p-2 border rounded-md'>
          <div className='w-10 h-10 rounded-md border' style={{ backgroundColor: value.color }} />
          <div className='text-sm pr-2'>
            <div>
              {name} ({value.color})
            </div>
            <div className='text-xs text-gray-500 font-bold font-mono'>{value.name}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ColorPalette() {
  return (
    <div className='p-6'>
      {Object.entries(ColorsList).map(([section, colors]) => (
        <div key={section} className='mb-8'>
          <h2 className='text-xl font-semibold mb-2'>{section}</h2>
          <ColorGrid colors={colors} />
        </div>
      ))}
    </div>
  );
}

export default {
  title: 'Utilities/Colors/Primary',
  component: ColorPalette,
} as Meta;

export function Primary() {
  return <ColorPalette />;
}
