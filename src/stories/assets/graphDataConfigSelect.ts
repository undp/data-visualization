export function GraphDataConfigSelector(graph: string) {
  const chartExamples = {
    'Bar graph': `[
  // ----Required objects---- //
  {
    columnId: 'Column 1',
    chartConfigId: 'size',
  },
  {
    columnId: 'Column 2',
    chartConfigId: 'label',
  },
  // ----Not required objects---- //
  {
    columnId: 'Column 3',
    chartConfigId: 'color',
  }
]`,
    'Data table': `// No configuration required`,
    'Data cards': `// No configuration required`,
    'Stacked bar graph': `[
  // ----Required objects---- //
  {
    columnId: ['Column 1', 'Column 2', 'Column 3'],
    chartConfigId: 'size',
  },
  {
    columnId: 'Column 4',
    chartConfigId: 'label',
  }
]`,
    'Grouped bar graph': `[
  // ----Required objects---- //
  {
    columnId: ['Column 1', 'Column 2', 'Column 3'],
    chartConfigId: 'size',
  },
  {
    columnId: 'Column 4',
    chartConfigId: 'label',
  }
]`,
    'Bullet chart': `[
  // ----Required objects---- //
  {
    columnId: 'Column 1',
    chartConfigId: 'size',
  },
  {
    columnId: 'Column 2',
    chartConfigId: 'label',
  },
  // ----Not required objects---- //
  {
    columnId: 'Column 3',
    chartConfigId: 'target',
  }
  {
    columnId: ['Column 1', 'Column 2', 'Column 3'],
    chartConfigId: 'qualitativeRange',
  }
]`,
    'Line chart': `[
  // ----Required objects---- //
  {
    columnId: 'Column 1',
    chartConfigId: 'date',
  },
  {
    columnId: 'Column 2',
    chartConfigId: 'y',
  }
]`,
    Sparkline: `[
  // ----Required objects---- //
  {
    columnId: 'Column 1',
    chartConfigId: 'date',
  },
  {
    columnId: 'Column 2',
    chartConfigId: 'y',
  }
]`,
    'Dual axis line chart': `[
  // ----Required objects---- //
  {
    columnId: 'Column 1',
    chartConfigId: 'date',
  },
  {
    columnId: 'Column 2',
    chartConfigId: 'y1',
  },
  {
    columnId: 'Column 3',
    chartConfigId: 'y2',
  }
]`,
    'Difference line chart': `[
  // ----Required objects---- //
  {
    columnId: 'Column 1',
    chartConfigId: 'date',
  },
  {
    columnId: 'Column 2',
    chartConfigId: 'y1',
  },
  {
    columnId: 'Column 3',
    chartConfigId: 'y2',
  }
]`,
    'Line chart with interval': `[
  // ----Required objects---- //
  {
    columnId: 'Column 1',
    chartConfigId: 'date',
  },
  {
    columnId: 'Column 2',
    chartConfigId: 'y',
  },
  {
    columnId: 'Column 3',
    chartConfigId: 'yMin',
  },
  {
    columnId: 'Column 4',
    chartConfigId: 'yMax',
  }
]`,
    'Multi-line chart': `[
  // ----Required objects---- //
  {
    columnId: 'Column 1',
    chartConfigId: 'date',
  },
  {
    columnId: ['Column 2', 'Column 3', 'Column 4'],
    chartConfigId: 'y',
  }
]`,
    'Multi-line chart alternative': `[
  // ----Required objects---- //
  {
    columnId: 'Column 1',
    chartConfigId: 'date',
  },
  {
    columnId: 'Column 2,
    chartConfigId: 'y',
  },
  {
    columnId: 'Column 3,
    chartConfigId: 'label',
  },
  // ----Not required objects---- //
  {
    columnId: 'Column 3',
    chartConfigId: 'color',
  }
]`,
    'Choropleth map': `[
  // ----Required objects---- //
  {
    columnId: 'Column 1',
    chartConfigId: 'x',
  },
  {
    columnId: 'Column 2',
    chartConfigId: 'id',
  }
]`,
    'Bi-variate choropleth map': `[
  // ----Required objects---- //
  {
    columnId: 'Column 1',
    chartConfigId: 'x',
  },
  {
    columnId: 'Column 2',
    chartConfigId: 'y',
  },
  {
    columnId: 'Column 3',
    chartConfigId: 'id',
  }
]`,
    'Dot density map': `[
  // ----Required objects---- //
  {
    columnId: 'Column 1',
    chartConfigId: 'lat',
  },
  {
    columnId: 'Column 2',
    chartConfigId: 'long',
  },
  // ----Not required objects---- //
  {
    columnId: 'Column 3',
    chartConfigId: 'color',
  },
  {
    columnId: 'Column 4',
    chartConfigId: 'radius',
  },
  {
    columnId: 'Column 5',
    chartConfigId: 'label',
  }
]`,
    'Donut graph': `[
  // ----Required objects---- //
  {
    columnId: 'Column 1',
    chartConfigId: 'size',
  },
  {
    columnId: 'Column 2',
    chartConfigId: 'label',
  }
]`,
    'Slope chart': `[
  // ----Required objects---- //
  {
    columnId: 'Column 1',
    chartConfigId: 'y1',
  },
  {
    columnId: 'Column 2',
    chartConfigId: 'y2',
  },
  {
    columnId: 'Column 3',
    chartConfigId: 'label',
  },
  // ----Not required objects---- //
  {
    columnId: 'Column 4',
    chartConfigId: 'color',
  }
]`,
    'Scatter plot': `[
  // ----Required objects---- //
  {
    columnId: 'Column 1',
    chartConfigId: 'x',
  },
  {
    columnId: 'Column 2',
    chartConfigId: 'y',
  },
  // ----Not required objects---- //
  {
    columnId: 'Column 3',
    chartConfigId: 'color',
  },
  {
    columnId: 'Column 4',
    chartConfigId: 'radius',
  },
  {
    columnId: 'Column 5',
    chartConfigId: 'label',
  }
]`,
    'Dumbbell graph': `[
  // ----Required objects---- //
  {
    columnId: ['Column 1', 'Column 2', 'Column 3'],
    chartConfigId: 'x',
  },
  {
    columnId: 'Column 4',
    chartConfigId: 'label',
  }
]`,
    'Tree map': `[
  // ----Required objects---- //
  {
    columnId: 'Column 1',
    chartConfigId: 'size',
  },
  {
    columnId: 'Column 2',
    chartConfigId: 'label',
  },
  // ----Not required objects---- //
  {
    columnId: 'Column 3',
    chartConfigId: 'color',
  }
]`,
    'Circle packing': `[
  // ----Required objects---- //
  {
    columnId: 'Column 1',
    chartConfigId: 'size',
  },
  {
    columnId: 'Column 2',
    chartConfigId: 'label',
  },
  // ----Not required objects---- //
  {
    columnId: 'Column 3',
    chartConfigId: 'color',
  }
]`,
    'Heat map': `[
  // ----Required objects---- //
  {
    columnId: 'Column 1',
    chartConfigId: 'row',
  },
  {
    columnId: 'Column 2',
    chartConfigId: 'column',
  },
  {
    columnId: 'Column 3',
    chartConfigId: 'value',
  }
]`,
    'Strip chart': `[
  // ----Required objects---- //
  {
    columnId: 'Column 1',
    chartConfigId: 'position',
  },
  {
    columnId: 'Column 2',
    chartConfigId: 'label',
  },
  // ----Not required objects---- //
  {
    columnId: 'Column 3',
    chartConfigId: 'color',
  }
]`,
    'Beeswarm chart': `[
  // ----Required objects---- //
  {
    columnId: 'Column 1',
    chartConfigId: 'position',
  },
  {
    columnId: 'Column 2',
    chartConfigId: 'label',
  },
  // ----Not required objects---- //
  {
    columnId: 'Column 3',
    chartConfigId: 'color',
  },
  {
    columnId: 'Column 4',
    chartConfigId: 'radius',
  }
]`,
    'Butterfly chart': `[
  // ----Required objects---- //
  {
    columnId: 'Column 1',
    chartConfigId: 'label',
  },
  {
    columnId: 'Column 2',
    chartConfigId: 'leftBar',
  },
  {
    columnId: 'Column 3',
    chartConfigId: 'rightBar',
  }
]`,
    'Sankey chart': `[
  // ----Required objects---- //
  {
    columnId: 'Column 1',
    chartConfigId: 'source',
  },
  {
    columnId: 'Column 2',
    chartConfigId: 'target',
  },
  {
    columnId: 'Column 3',
    chartConfigId: 'value',
  }
]`,
    Histogram: `[
  // ----Required objects---- //
  {
    columnId: 'Column 1',
    chartConfigId: 'value',
  }
]`,
    'Spark line': `[
  // ----Required objects---- //
  {
    columnId: 'Column 1',
    chartConfigId: 'date',
  },
  {
    columnId: 'Column 2',
    chartConfigId: 'y',
  }
]`,
    'Pareto chart': `[
  // ----Required objects---- //
  {
    columnId: 'Column 1',
    chartConfigId: 'label',
  },
  {
    columnId: 'Column 2',
    chartConfigId: 'bar',
  },
  {
    columnId: 'Column 3',
    chartConfigId: 'line',
  }
]`,
    'Stat card': `[
  // ----Required objects---- //
  {
    columnId: 'Column 1',
    chartConfigId: 'value',
  }
]`,
    'Unit chart': `[
  // ----Required objects---- //
  {
    columnId: 'Column 1',
    chartConfigId: 'label',
  },
  {
    columnId: 'Column 2',
    chartConfigId: 'value',
  }
]`,
    'Bar graph (animated)': `[
  // ----Required objects---- //
  {
    columnId: 'Column 1',
    chartConfigId: 'size',
  },
  {
    columnId: 'Column 2',
    chartConfigId: 'label',
  },
  {
    columnId: 'Column 4',
    chartConfigId: 'date',
  },
  // ----Not required objects---- //
  {
    columnId: 'Column 3',
    chartConfigId: 'color',
  }
]`,
    'Stacked bar graph (animated)': `[
  // ----Required objects---- //
  {
    columnId: ['Column 1', 'Column 2', 'Column 3'],
    chartConfigId: 'size',
  },
  {
    columnId: 'Column 4',
    chartConfigId: 'label',
  },
  {
    columnId: 'Column 5',
    chartConfigId: 'date',
  }
]`,
    'Grouped bar graph (animated)': `[
  // ----Required objects---- //
  {
    columnId: ['Column 1', 'Column 2', 'Column 3'],
    chartConfigId: 'size',
  },
  {
    columnId: 'Column 4',
    chartConfigId: 'label',
  },
  {
    columnId: 'Column 5',
    chartConfigId: 'date',
  }
]`,
    'Butterfly chart (animated)': `[
  // ----Required objects---- //
  {
    columnId: 'Column 1',
    chartConfigId: 'label',
  },
  {
    columnId: 'Column 2',
    chartConfigId: 'leftBar',
  },
  {
    columnId: 'Column 3',
    chartConfigId: 'rightBar',
  },
  {
    columnId: 'Column 4',
    chartConfigId: 'date',
  }
]`,
    'Dumbbell graph (animated)': `[
  // ----Required objects---- //
  {
    columnId: ['Column 1', 'Column 2', 'Column 3'],
    chartConfigId: 'x',
  },
  {
    columnId: 'Column 4',
    chartConfigId: 'label',
  },
  {
    columnId: 'Column 5',
    chartConfigId: 'date',
  }
]`,
    'Choropleth map (animated)': `[
  // ----Required objects---- //
  {
    columnId: 'Column 1',
    chartConfigId: 'x',
  },
  {
    columnId: 'Column 2',
    chartConfigId: 'id',
  },
  {
    columnId: 'Column 3',
    chartConfigId: 'date',
  }
]`,
    'Bi-variate choropleth map (animated)': `[
  // ----Required objects---- //
  {
    columnId: 'Column 1',
    chartConfigId: 'x',
  },
  {
    columnId: 'Column 2',
    chartConfigId: 'y',
  },
  {
    columnId: 'Column 3',
    chartConfigId: 'id',
  },
  {
    columnId: 'Column 4',
    chartConfigId: 'date',
  }
]`,
    'Dot density map (animated)': `[
  // ----Required objects---- //
  {
    columnId: 'Column 1',
    chartConfigId: 'lat',
  },
  {
    columnId: 'Column 2',
    chartConfigId: 'long',
  },
  {
    columnId: 'Column 6',
    chartConfigId: 'date',
  },
  // ----Not required objects---- //
  {
    columnId: 'Column 3',
    chartConfigId: 'color',
  },
  {
    columnId: 'Column 4',
    chartConfigId: 'radius',
  },
  {
    columnId: 'Column 5',
    chartConfigId: 'label',
  }
]`,
    'Scatter plot (animated)': `[
  // ----Required objects---- //
  {
    columnId: 'Column 1',
    chartConfigId: 'x',
  },
  {
    columnId: 'Column 2',
    chartConfigId: 'y',
  },
  {
    columnId: 'Column 6',
    chartConfigId: 'date',
  },
  // ----Not required objects---- //
  {
    columnId: 'Column 3',
    chartConfigId: 'color',
  },
  {
    columnId: 'Column 4',
    chartConfigId: 'radius',
  },
  {
    columnId: 'Column 5',
    chartConfigId: 'label',
  }
]`,
    'Stacked area chart': `[
  // ----Required objects---- //
  {
    columnId: 'Column 1',
    chartConfigId: 'date',
  },
  {
    columnId: ['Column 2', 'Column 3', 'Column 4'],
    chartConfigId: 'y',
  },
]`,
    'GeoHub maps': `// No configuration required`,
    'GeoHub compare maps': `// No configuration required`,
    'GeoHub maps with layer selection': `// No configuration required`,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (chartExamples as any)[graph];
}
