import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: [
    '../src/stories/*.mdx',
    '../src/stories/Utilities/**/*.mdx',
    '../src/stories/GraphsFromConfig/**/*.mdx',
    '../src/stories/Dashboards/*.mdx',
    '../src/stories/Dashboards/PageSections/ComplexDataTypes/*.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-docs',
    'storybook/actions',
    'storybook/viewport',
    'storybook/highlight',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  staticDirs: ['../public'],
  managerHead: () => `
    
    <meta charset="utf-8" />

    <title>UNDP data viz library</title>
    <meta name="description" content="Documentation and examples for UNDP data viz library" />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="UNDP data viz library" />
    <meta property="og:url" content="https://dataviz.design.undp.org/" />
    <meta property="og:title" content="Documentation | UNDP data viz library" />
    <meta property="og:description" content="Documentation and examples for UNDP data viz library" />
    <meta property="og:image" content="https://dataviz.design.undp.org/Cover.png" />

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="https://dataviz.design.undp.org/" />
    <meta name="twitter:title" content="Documentation | UNDP data viz library" />
    <meta name="twitter:description" content="Documentation and examples for UNDP data viz library" />
    <meta name="twitter:image" content="https://dataviz.design.undp.org/Cover.png" />

    <!-- Favicon -->
    <link rel="icon" href="./favicon.ico" />
  `,
};
export default config;
