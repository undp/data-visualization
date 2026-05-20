import type { Meta } from '@storybook/react-vite';

import { Palette } from './Palette Component';

export default { title: 'Utilities/Colors/Data viz dark theme' } as Meta;

export function Datavizdarkmode() {
  return <Palette theme='dark' />;
}
