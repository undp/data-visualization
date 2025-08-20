import { create } from 'storybook/theming';

export const customTheme = create({
  base:
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light',
  brandTitle: 'UNDP Design system for React',
  brandUrl: 'https://www.undp.org/',
  brandImage: 'https://design.undp.org/images/undp-logo-blue.svg',
});
