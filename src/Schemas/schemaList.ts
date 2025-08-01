export const treeMapDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      label: { oneOf: [{ type: 'string' }, { type: 'number' }] },
      size: { oneOf: [{ type: 'number' }, { type: 'null' }] },
      color: { type: 'string' },
      data: { type: 'object' },
    },
    required: ['label'],
  },
};

export const circlePackingDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      label: { oneOf: [{ type: 'string' }, { type: 'number' }] },
      size: { oneOf: [{ type: 'number' }, { type: 'null' }] },
      color: { type: 'string' },
      data: { type: 'object' },
    },
    required: ['label'],
  },
};

export const bulletChartDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      label: { oneOf: [{ type: 'string' }, { type: 'number' }] },
      size: { oneOf: [{ type: 'number' }, { type: 'null' }] },
      target: { oneOf: [{ type: 'number' }, { type: 'null' }] },
      qualitativeRange: {
        type: 'array',
        items: { oneOf: [{ type: 'number' }, { type: 'null' }] },
      },
      data: { type: 'object' },
    },
    required: ['label'],
  },
};

export const radarChartDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      label: { oneOf: [{ type: 'string' }, { type: 'number' }] },
      values: {
        type: 'array',
        items: { type: 'number' },
      },
      color: { type: 'string' },
      data: { type: 'object' },
    },
    required: ['values'],
  },
};

export const sankeyChartDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      source: { oneOf: [{ type: 'string' }, { type: 'number' }] },
      target: { oneOf: [{ type: 'string' }, { type: 'number' }] },
      value: { type: 'number' },
      data: { type: 'object' },
    },
    required: ['source', 'target', 'value'],
  },
};

export const butterflyChartDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      label: { oneOf: [{ type: 'string' }, { type: 'number' }] },
      leftBar: { oneOf: [{ type: 'number' }, { type: 'null' }] },
      rightBar: { oneOf: [{ type: 'number' }, { type: 'null' }] },
      data: { type: 'object' },
    },
    required: ['label'],
  },
};

export const animatedButterflyChartDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      label: { oneOf: [{ type: 'string' }, { type: 'number' }] },
      leftBar: { oneOf: [{ type: 'number' }, { type: 'null' }] },
      rightBar: { oneOf: [{ type: 'number' }, { type: 'null' }] },
      date: { oneOf: [{ type: 'string' }, { type: 'number' }] },
      data: { type: 'object' },
    },
    required: ['label', 'date'],
  },
};

export const barGraphDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      label: { oneOf: [{ type: 'string' }, { type: 'number' }] },
      size: { oneOf: [{ type: 'number' }, { type: 'null' }] },
      color: { oneOf: [{ type: 'string' }, { type: 'null' }] },
      data: { type: 'object' },
    },
    required: ['label'],
  },
};

export const groupedBarGraphDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      label: { oneOf: [{ type: 'string' }, { type: 'number' }] },
      size: {
        type: 'array',
        items: { oneOf: [{ type: 'number' }, { type: 'null' }] },
      },
      data: { type: 'object' },
    },
    required: ['label', 'size'],
  },
};

export const stackedBarGraphDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      label: { oneOf: [{ type: 'string' }, { type: 'number' }] },
      size: {
        type: 'array',
        items: { oneOf: [{ type: 'number' }, { type: 'null' }] },
      },
      data: { type: 'object' },
    },
    required: ['label', 'size'],
  },
};

export const animatedBarGraphDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      label: { oneOf: [{ type: 'string' }, { type: 'number' }] },
      size: { oneOf: [{ type: 'number' }, { type: 'null' }] },
      date: { oneOf: [{ type: 'string' }, { type: 'number' }] },
      color: { type: 'string' },
      data: { type: 'object' },
    },
    required: ['label', 'date'],
  },
};

export const animatedGroupedBarGraphDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      label: { oneOf: [{ type: 'string' }, { type: 'number' }] },
      size: {
        type: 'array',
        items: { oneOf: [{ type: 'number' }, { type: 'null' }] },
      },
      date: { oneOf: [{ type: 'string' }, { type: 'number' }] },
      data: { type: 'object' },
    },
    required: ['label', 'size', 'date'],
  },
};

export const animatedStackedBarGraphDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      label: { oneOf: [{ type: 'string' }, { type: 'number' }] },
      size: {
        type: 'array',
        items: { oneOf: [{ type: 'number' }, { type: 'null' }] },
      },
      date: { oneOf: [{ type: 'string' }, { type: 'number' }] },
      data: { type: 'object' },
    },
    required: ['label', 'size', 'date'],
  },
};

export const dumbbellChartDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      x: {
        type: 'array',
        items: { oneOf: [{ type: 'null' }, { type: 'number' }] },
      },
      label: { oneOf: [{ type: 'string' }, { type: 'number' }] },
      data: { type: 'object' },
    },
    required: ['x', 'label'],
  },
};

export const unitChartDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      label: { oneOf: [{ type: 'string' }, { type: 'number' }] },
      value: { type: 'number' },
      data: { type: 'object' },
    },
    required: ['value', 'label'],
  },
};

export const animatedDumbbellChartDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      x: {
        type: 'array',
        items: { oneOf: [{ type: 'number' }, { type: 'null' }] },
      },
      label: { oneOf: [{ type: 'string' }, { type: 'number' }] },
      date: { oneOf: [{ type: 'string' }, { type: 'number' }] },
      data: { type: 'object' },
    },
    required: ['x', 'label', 'date'],
  },
};

export const donutChartDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      size: { type: 'number' },
      label: { oneOf: [{ type: 'string' }, { type: 'number' }] },
      data: { type: 'object' },
    },
    required: ['size', 'label'],
  },
};

export const histogramDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      value: { type: 'number' },
      data: { type: 'object' },
    },
    required: ['value'],
  },
};

export const choroplethMapDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      x: { oneOf: [{ type: 'number' }, { type: 'string' }, { type: 'null' }] },
      id: { type: 'string' },
      data: { type: 'object' },
    },
    required: ['id'],
  },
};

export const biVariateChoroplethMapDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      x: { oneOf: [{ type: 'number' }, { type: 'null' }] },
      y: { oneOf: [{ type: 'number' }, { type: 'null' }] },
      id: { type: 'string' },
      data: { type: 'object' },
    },
    required: ['id'],
  },
};

export const animatedChoroplethMapDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      x: { oneOf: [{ type: 'number' }, { type: 'string' }, { type: 'null' }] },
      id: { type: 'string' },
      date: { oneOf: [{ type: 'string' }, { type: 'number' }] },
      data: { type: 'object' },
    },
    required: ['id', 'date'],
  },
};

export const animatedBiVariateChoroplethMapDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      x: { oneOf: [{ type: 'number' }, { type: 'null' }] },
      y: { oneOf: [{ type: 'number' }, { type: 'null' }] },
      id: { type: 'string' },
      data: { type: 'object' },
      date: { oneOf: [{ type: 'string' }, { type: 'number' }] },
    },
    required: ['id', 'date'],
  },
};

export const lineChartDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      date: { oneOf: [{ type: 'number' }, { type: 'string' }] },
      y: { type: 'number' },
      data: { type: 'object' },
    },
    required: ['date', 'y'],
  },
};

export const lineChartWithConfidenceIntervalDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      date: { oneOf: [{ type: 'number' }, { type: 'string' }] },
      y: { type: 'number' },
      yMin: { type: 'number' },
      yMax: { type: 'number' },
      data: { type: 'object' },
    },
    required: ['date'],
  },
};

export const multiLineChartDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      date: { oneOf: [{ type: 'number' }, { type: 'string' }] },
      y: {
        type: 'array',
        items: { oneOf: [{ type: 'number' }, { type: 'null' }] },
      },
      data: { type: 'object' },
    },
    required: ['date', 'y'],
  },
};

export const multiLineAltChartDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      date: { oneOf: [{ type: 'number' }, { type: 'string' }] },
      y: { oneOf: [{ type: 'number' }, { type: 'null' }] },
      label: { oneOf: [{ type: 'number' }, { type: 'string' }] },
      color: { oneOf: [{ type: 'number' }, { type: 'string' }] },
      data: { type: 'object' },
    },
    required: ['date', 'y', 'label'],
  },
};

export const areaChartDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      date: { oneOf: [{ type: 'number' }, { type: 'string' }] },
      y: {
        type: 'array',
        items: { type: 'number' },
      },
      data: { type: 'object' },
    },
    required: ['date', 'y'],
  },
};

export const scatterPlotDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      x: { oneOf: [{ type: 'number' }, { type: 'null' }] },
      y: { oneOf: [{ type: 'number' }, { type: 'null' }] },
      radius: { type: 'number' },
      color: { type: 'string' },
      label: { oneOf: [{ type: 'number' }, { type: 'string' }] },
      data: { type: 'object' },
    },
  },
};

export const animatedScatterPlotDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      x: { oneOf: [{ type: 'number' }, { type: 'null' }] },
      y: { oneOf: [{ type: 'number' }, { type: 'null' }] },
      radius: { type: 'number' },
      color: { type: 'string' },
      date: { oneOf: [{ type: 'string' }, { type: 'number' }] },
      label: { oneOf: [{ type: 'number' }, { type: 'string' }] },
      data: { type: 'object' },
    },
    required: ['label', 'date'],
  },
};

export const dualAxisLineChartDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      date: { oneOf: [{ type: 'number' }, { type: 'string' }] },
      y1: { oneOf: [{ type: 'number' }, { type: 'null' }] },
      y2: { oneOf: [{ type: 'number' }, { type: 'null' }] },
      data: { type: 'object' },
    },
    required: ['date'],
  },
};

export const differenceLineChartDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      date: { oneOf: [{ type: 'number' }, { type: 'string' }] },
      y1: { oneOf: [{ type: 'number' }] },
      y2: { oneOf: [{ type: 'number' }] },
      data: { type: 'object' },
    },
    required: ['date', 'y1', 'y2'],
  },
};

export const paretoChartDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      label: { oneOf: [{ type: 'number' }, { type: 'string' }] },
      bar: { oneOf: [{ type: 'number' }, { type: 'null' }] },
      line: { oneOf: [{ type: 'number' }, { type: 'null' }] },
      data: { type: 'object' },
    },
    required: ['label'],
  },
};

export const dotDensityMapDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      lat: { type: 'number' },
      long: { type: 'number' },
      radius: { type: 'number' },
      color: { oneOf: [{ type: 'string' }, { type: 'number' }] },
      label: { oneOf: [{ type: 'string' }, { type: 'number' }] },
      data: { type: 'object' },
    },
    required: ['lat', 'long'],
  },
};

export const animatedDotDensityMapDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      lat: { type: 'number' },
      long: { type: 'number' },
      radius: { type: 'number' },
      color: { oneOf: [{ type: 'string' }, { type: 'number' }] },
      label: { oneOf: [{ type: 'string' }, { type: 'number' }] },
      date: { oneOf: [{ type: 'string' }, { type: 'number' }] },
      data: { type: 'object' },
    },
    required: ['lat', 'long', 'date'],
  },
};

export const slopeChartDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      y1: { type: 'number' },
      y2: { type: 'number' },
      color: { oneOf: [{ type: 'string' }, { type: 'number' }] },
      label: { oneOf: [{ type: 'string' }, { type: 'number' }] },
      data: { type: 'object' },
    },
    required: ['y1', 'y2', 'label'],
  },
};

export const heatMapDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      row: { type: 'string' },
      column: { type: 'string' },
      value: { oneOf: [{ type: 'string' }, { type: 'number' }, { type: 'null' }] },
      data: { type: 'object' },
    },
    required: ['row', 'column'],
  },
};

export const beeSwarmChartDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      label: { oneOf: [{ type: 'string' }, { type: 'number' }] },
      position: { type: 'number' },
      radius: { type: 'number' },
      color: { type: 'string' },
      data: { type: 'object' },
    },
    required: ['label', 'position'],
  },
};

export const stripChartDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      label: { oneOf: [{ type: 'string' }, { type: 'number' }] },
      position: { type: 'number' },
      color: { type: 'string' },
      data: { type: 'object' },
    },
    required: ['label', 'position'],
  },
};

export const statCardDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      value: { oneOf: [{ type: 'string' }, { type: 'number' }] },
      data: { type: 'object' },
    },
    required: ['value'],
  },
};

export const sankeyChartSettingsSchema = {
  type: 'object',
  properties: {
    customLayers: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          position: {
            type: 'string',
            enum: ['before', 'after'],
          },
          layer: {
            type: 'object',
          },
        },
        required: ['layer', 'position'],
      },
    },
    precision: { type: 'number' },
    animate: {
      oneOf: [
        {
          type: 'object',
          properties: {
            duration: {
              type: 'number',
            },
            once: {
              type: 'boolean',
            },
            amount: {
              anyOf: [
                {
                  type: 'string',
                  enum: ['some', 'all'],
                },
                {
                  type: 'number',
                },
              ],
            },
          },
          required: ['duration', 'once', 'amount'],
        },
        { type: 'boolean' },
      ],
    },
    detailsOnClick: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    styles: { type: 'object' },
    classNames: { type: 'object' },
    graphTitle: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    resetSelectionOnDoubleClick: { type: 'boolean' },
    graphDescription: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    footNote: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    width: { type: 'number' },
    height: { type: 'number' },
    suffix: { type: 'string' },
    prefix: { type: 'string' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    showValues: { type: 'boolean' },
    leftMargin: { type: 'number' },
    rightMargin: { type: 'number' },
    truncateBy: { type: 'number' },
    backgroundColor: { oneOf: [{ type: 'string' }, { type: 'boolean' }] },
    padding: { type: 'string' },
    topMargin: { type: 'number' },
    bottomMargin: { type: 'number' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    showLabels: { type: 'boolean' },
    tooltip: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    graphID: { type: 'string' },
    highlightedSourceDataPoints: {
      type: 'array',
      items: { oneOf: [{ type: 'string' }, { type: 'number' }] },
    },
    highlightedTargetDataPoints: {
      type: 'array',
      items: { oneOf: [{ type: 'string' }, { type: 'number' }] },
    },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    sortNodes: {
      type: 'string',
      enum: ['asc', 'desc', 'mostReadable', 'none'],
    },
    language: {
      type: 'string',
      enum: [
        'en',
        'ar',
        'az',
        'bn',
        'cy',
        'he',
        'hi',
        'jp',
        'ka',
        'km',
        'ko',
        'my',
        'ne',
        'zh',
        'custom',
      ],
    },
    theme: {
      type: 'string',
      enum: ['light', 'dark'],
    },
    ariaLabel: { type: 'string' },
    nodePadding: { type: 'number' },
    nodeWidth: { type: 'number' },
    defaultLinkOpacity: { type: 'number', minimum: 0, maximum: 1 },
    sourceTitle: { type: 'string' },
    targetTitle: { type: 'string' },
    fillContainer: { type: 'boolean' },
    sourceColors: { oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }] },
    targetColors: { oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }] },
    sourceColorDomain: {
      type: 'array',
      items: { oneOf: [{ type: 'string' }, { type: 'number' }] },
    },
    targetColorDomain: {
      type: 'array',
      items: { oneOf: [{ type: 'string' }, { type: 'number' }] },
    },
  },
};

export const simpleBarChartSettingsSchema = {
  type: 'object',
  properties: {
    customLayers: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          position: {
            type: 'string',
            enum: ['before', 'after'],
          },
          layer: {
            type: 'object',
          },
        },
        required: ['layer', 'position'],
      },
    },
    precision: { type: 'number' },
    dimmedOpacity: { type: 'number', minimum: 0, maximum: 1 },
    animate: {
      oneOf: [
        {
          type: 'object',
          properties: {
            duration: {
              type: 'number',
            },
            once: {
              type: 'boolean',
            },
            amount: {
              anyOf: [
                {
                  type: 'string',
                  enum: ['some', 'all'],
                },
                {
                  type: 'number',
                },
              ],
            },
          },
          required: ['duration', 'once', 'amount'],
        },
        { type: 'boolean' },
      ],
    },
    detailsOnClick: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    styles: { type: 'object' },
    classNames: { type: 'object' },
    colors: { oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }] },
    labelOrder: {
      type: 'array',
      items: { type: 'string' },
    },
    filterNA: { type: 'boolean' },
    graphTitle: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    resetSelectionOnDoubleClick: { type: 'boolean' },
    graphDescription: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    footNote: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    width: { type: 'number' },
    height: { type: 'number' },
    suffix: { type: 'string' },
    prefix: { type: 'string' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    barPadding: { type: 'number' },
    showValues: { type: 'boolean' },
    showTicks: { type: 'boolean' },
    leftMargin: { type: 'number' },
    rightMargin: { type: 'number' },
    truncateBy: { type: 'number' },
    colorDomain: {
      type: 'array',
      items: { type: 'string' },
    },
    colorLegendTitle: { type: 'string' },
    backgroundColor: { oneOf: [{ type: 'string' }, { type: 'boolean' }] },
    padding: { type: 'string' },
    topMargin: { type: 'number' },
    bottomMargin: { type: 'number' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    showLabels: { type: 'boolean' },
    showColorScale: { type: 'boolean' },
    maxValue: { type: 'number' },
    minValue: { type: 'number' },
    tooltip: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    refValues: {
      type: 'array',
      items: {
        properties: {
          color: { type: 'string' },
          text: { type: 'string' },
          value: { type: 'number' },
          styles: {
            type: 'object',
            properties: {
              line: { type: 'object' },
              text: { type: 'object' },
            },
          },
          classNames: {
            type: 'object',
            properties: {
              line: { type: 'string' },
              text: { type: 'string' },
            },
          },
        },
        type: 'object',
        required: ['value', 'text'],
      },
    },
    graphID: { type: 'string' },
    highlightedDataPoints: {
      type: 'array',
      items: { oneOf: [{ type: 'string' }, { type: 'number' }] },
    },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    showNAColor: { type: 'boolean' },
    sortData: {
      type: 'string',
      enum: ['asc', 'desc'],
    },
    language: {
      type: 'string',
      enum: [
        'en',
        'ar',
        'az',
        'bn',
        'cy',
        'he',
        'hi',
        'jp',
        'ka',
        'km',
        'ko',
        'my',
        'ne',
        'zh',
        'custom',
      ],
    },
    theme: {
      type: 'string',
      enum: ['light', 'dark'],
    },
    maxBarThickness: { type: 'number' },
    minBarThickness: { type: 'number' },
    maxNumberOfBars: { type: 'number' },
    ariaLabel: { type: 'string' },
    valueColor: { type: 'string' },
    barAxisTitle: { type: 'string' },
    noOfTicks: { type: 'number' },
    orientation: {
      type: 'string',
      enum: ['vertical', 'horizontal'],
    },
  },
};

export const groupedBarChartSettingsSchema = {
  type: 'object',
  properties: {
    customLayers: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          position: {
            type: 'string',
            enum: ['before', 'after'],
          },
          layer: {
            type: 'object',
          },
        },
        required: ['layer', 'position'],
      },
    },
    precision: { type: 'number' },
    animate: {
      oneOf: [
        {
          type: 'object',
          properties: {
            duration: {
              type: 'number',
            },
            once: {
              type: 'boolean',
            },
            amount: {
              anyOf: [
                {
                  type: 'string',
                  enum: ['some', 'all'],
                },
                {
                  type: 'number',
                },
              ],
            },
          },
          required: ['duration', 'once', 'amount'],
        },
        { type: 'boolean' },
      ],
    },
    detailsOnClick: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    styles: { type: 'object' },
    classNames: { type: 'object' },
    colors: {
      type: 'array',
      items: { type: 'string' },
    },
    labelOrder: {
      type: 'array',
      items: { type: 'string' },
    },
    graphTitle: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    resetSelectionOnDoubleClick: { type: 'boolean' },
    graphDescription: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    footNote: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    width: { type: 'number' },
    height: { type: 'number' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    barPadding: { type: 'number' },
    showTicks: { type: 'boolean' },
    truncateBy: { type: 'number' },
    colorDomain: {
      type: 'array',
      items: { type: 'string' },
    },
    colorLegendTitle: { type: 'string' },
    suffix: { type: 'string' },
    prefix: { type: 'string' },
    showValues: { type: 'boolean' },
    backgroundColor: { oneOf: [{ type: 'string' }, { type: 'boolean' }] },
    padding: { type: 'string' },
    leftMargin: { type: 'number' },
    rightMargin: { type: 'number' },
    topMargin: { type: 'number' },
    bottomMargin: { type: 'number' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    showLabels: { type: 'boolean' },
    tooltip: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    refValues: {
      type: 'array',
      items: {
        properties: {
          color: { type: 'string' },
          text: { type: 'string' },
          value: { type: 'number' },
          styles: {
            type: 'object',
            properties: {
              line: { type: 'object' },
              text: { type: 'object' },
            },
          },
          classNames: {
            type: 'object',
            properties: {
              line: { type: 'string' },
              text: { type: 'string' },
            },
          },
        },
        type: 'object',
        required: ['value', 'text'],
      },
    },
    graphID: { type: 'string' },
    maxValue: { type: 'number' },
    minValue: { type: 'number' },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    language: {
      type: 'string',
      enum: [
        'en',
        'ar',
        'az',
        'bn',
        'cy',
        'he',
        'hi',
        'jp',
        'ka',
        'km',
        'ko',
        'my',
        'ne',
        'zh',
        'custom',
      ],
    },
    theme: {
      type: 'string',
      enum: ['light', 'dark'],
    },
    maxBarThickness: { type: 'number' },
    ariaLabel: { type: 'string' },
    valueColor: { type: 'string' },
    barAxisTitle: { type: 'string' },
    noOfTicks: { type: 'number' },
    orientation: {
      type: 'string',
      enum: ['vertical', 'horizontal'],
    },
  },
  required: ['colorDomain'],
};

export const stackedBarChartSettingsSchema = {
  type: 'object',
  properties: {
    customLayers: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          position: {
            type: 'string',
            enum: ['before', 'after'],
          },
          layer: {
            type: 'object',
          },
        },
        required: ['layer', 'position'],
      },
    },
    precision: { type: 'number' },
    animate: {
      oneOf: [
        {
          type: 'object',
          properties: {
            duration: {
              type: 'number',
            },
            once: {
              type: 'boolean',
            },
            amount: {
              anyOf: [
                {
                  type: 'string',
                  enum: ['some', 'all'],
                },
                {
                  type: 'number',
                },
              ],
            },
          },
          required: ['duration', 'once', 'amount'],
        },
        { type: 'boolean' },
      ],
    },
    detailsOnClick: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    styles: { type: 'object' },
    classNames: { type: 'object' },
    colors: {
      type: 'array',
      items: { type: 'string' },
    },
    labelOrder: {
      type: 'array',
      items: { type: 'string' },
    },
    graphTitle: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    resetSelectionOnDoubleClick: { type: 'boolean' },
    graphDescription: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    footNote: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    width: { type: 'number' },
    height: { type: 'number' },
    ariaLabel: { type: 'string' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    barPadding: { type: 'number' },
    showTicks: { type: 'boolean' },
    leftMargin: { type: 'number' },
    rightMargin: { type: 'number' },
    truncateBy: { type: 'number' },
    colorDomain: {
      type: 'array',
      items: { type: 'string' },
    },
    colorLegendTitle: { type: 'string' },
    backgroundColor: { oneOf: [{ type: 'string' }, { type: 'boolean' }] },
    padding: { type: 'string' },
    topMargin: { type: 'number' },
    bottomMargin: { type: 'number' },
    suffix: { type: 'string' },
    prefix: { type: 'string' },
    showValues: { type: 'boolean' },
    showLabels: { type: 'boolean' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    tooltip: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    refValues: {
      type: 'array',
      items: {
        properties: {
          color: { type: 'string' },
          text: { type: 'string' },
          value: { type: 'number' },
          styles: {
            type: 'object',
            properties: {
              line: { type: 'object' },
              text: { type: 'object' },
            },
          },
          classNames: {
            type: 'object',
            properties: {
              line: { type: 'string' },
              text: { type: 'string' },
            },
          },
        },
        type: 'object',
        required: ['value', 'text'],
      },
    },
    graphID: { type: 'string' },
    maxValue: { type: 'number' },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    language: {
      type: 'string',
      enum: [
        'en',
        'ar',
        'az',
        'bn',
        'cy',
        'he',
        'hi',
        'jp',
        'ka',
        'km',
        'ko',
        'my',
        'ne',
        'zh',
        'custom',
      ],
    },
    theme: {
      type: 'string',
      enum: ['light', 'dark'],
    },
    sortParameter: { oneOf: [{ type: 'string', enum: ['total'] }, { type: 'number' }] },
    maxBarThickness: { type: 'number' },
    minBarThickness: { type: 'number' },
    maxNumberOfBars: { type: 'number' },
    valueColor: { type: 'string' },
    barAxisTitle: { type: 'string' },
    noOfTicks: { type: 'number' },
    orientation: {
      type: 'string',
      enum: ['vertical', 'horizontal'],
    },
  },
  required: ['colorDomain'],
};

export const animatedSimpleBarChartSettingsSchema = {
  type: 'object',
  properties: {
    customLayers: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          position: {
            type: 'string',
            enum: ['before', 'after'],
          },
          layer: {
            type: 'object',
          },
        },
        required: ['layer', 'position'],
      },
    },
    precision: { type: 'number' },
    dimmedOpacity: { type: 'number', minimum: 0, maximum: 1 },
    detailsOnClick: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    styles: { type: 'object' },
    classNames: { type: 'object' },
    colors: { oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }] },
    ariaLabel: { type: 'string' },
    resetSelectionOnDoubleClick: { type: 'boolean' },
    graphTitle: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    graphDescription: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    footNote: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    width: { type: 'number' },
    height: { type: 'number' },
    suffix: { type: 'string' },
    prefix: { type: 'string' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    barPadding: { type: 'number' },
    showValues: { type: 'boolean' },
    showTicks: { type: 'boolean' },
    leftMargin: { type: 'number' },
    rightMargin: { type: 'number' },
    truncateBy: { type: 'number' },
    colorDomain: {
      type: 'array',
      items: { type: 'string' },
    },
    colorLegendTitle: { type: 'string' },
    backgroundColor: { oneOf: [{ type: 'string' }, { type: 'boolean' }] },
    padding: { type: 'string' },
    topMargin: { type: 'number' },
    bottomMargin: { type: 'number' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    showLabels: { type: 'boolean' },
    showColorScale: { type: 'boolean' },
    maxValue: { type: 'number' },
    minValue: { type: 'number' },
    tooltip: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    refValues: {
      type: 'array',
      items: {
        properties: {
          color: { type: 'string' },
          text: { type: 'string' },
          value: { type: 'number' },
          styles: {
            type: 'object',
            properties: {
              line: { type: 'object' },
              text: { type: 'object' },
            },
          },
          classNames: {
            type: 'object',
            properties: {
              line: { type: 'string' },
              text: { type: 'string' },
            },
          },
        },
        type: 'object',
        required: ['value', 'text'],
      },
    },
    graphID: { type: 'string' },
    highlightedDataPoints: {
      type: 'array',
      items: { oneOf: [{ type: 'string' }, { type: 'number' }] },
    },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    showNAColor: { type: 'boolean' },
    language: {
      type: 'string',
      enum: [
        'en',
        'ar',
        'az',
        'bn',
        'cy',
        'he',
        'hi',
        'jp',
        'ka',
        'km',
        'ko',
        'my',
        'ne',
        'zh',
        'custom',
      ],
    },
    autoPlay: { type: 'boolean' },
    autoSort: { type: 'boolean' },
    showOnlyActiveDate: { type: 'boolean' },
    dateFormat: { type: 'string' },
    theme: {
      type: 'string',
      enum: ['light', 'dark'],
    },
    maxBarThickness: { type: 'number' },
    minBarThickness: { type: 'number' },
    valueColor: { type: 'string' },
    barAxisTitle: { type: 'string' },
    noOfTicks: { type: 'number' },
    orientation: {
      type: 'string',
      enum: ['vertical', 'horizontal'],
    },
  },
};

export const animatedGroupedBarChartSettingsSchema = {
  type: 'object',
  properties: {
    customLayers: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          position: {
            type: 'string',
            enum: ['before', 'after'],
          },
          layer: {
            type: 'object',
          },
        },
        required: ['layer', 'position'],
      },
    },
    precision: { type: 'number' },
    styles: { type: 'object' },
    classNames: { type: 'object' },
    orientation: {
      type: 'string',
      enum: ['vertical', 'horizontal'],
    },
    detailsOnClick: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    colors: {
      type: 'array',
      items: { type: 'string' },
    },
    ariaLabel: { type: 'string' },
    resetSelectionOnDoubleClick: { type: 'boolean' },
    graphTitle: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    graphDescription: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    footNote: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    width: { type: 'number' },
    height: { type: 'number' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    barPadding: { type: 'number' },
    showTicks: { type: 'boolean' },
    truncateBy: { type: 'number' },
    colorDomain: {
      type: 'array',
      items: { type: 'string' },
    },
    colorLegendTitle: { type: 'string' },
    suffix: { type: 'string' },
    prefix: { type: 'string' },
    showValues: { type: 'boolean' },
    backgroundColor: { oneOf: [{ type: 'string' }, { type: 'boolean' }] },
    padding: { type: 'string' },
    leftMargin: { type: 'number' },
    rightMargin: { type: 'number' },
    topMargin: { type: 'number' },
    bottomMargin: { type: 'number' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    showLabels: { type: 'boolean' },
    tooltip: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    maxBarThickness: { type: 'number' },
    refValues: {
      type: 'array',
      items: {
        properties: {
          color: { type: 'string' },
          text: { type: 'string' },
          value: { type: 'number' },
          styles: {
            type: 'object',
            properties: {
              line: { type: 'object' },
              text: { type: 'object' },
            },
          },
          classNames: {
            type: 'object',
            properties: {
              line: { type: 'string' },
              text: { type: 'string' },
            },
          },
        },
        type: 'object',
        required: ['value', 'text'],
      },
    },
    graphID: { type: 'string' },
    maxValue: { type: 'number' },
    minValue: { type: 'number' },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    language: {
      type: 'string',
      enum: [
        'en',
        'ar',
        'az',
        'bn',
        'cy',
        'he',
        'hi',
        'jp',
        'ka',
        'km',
        'ko',
        'my',
        'ne',
        'zh',
        'custom',
      ],
    },
    autoPlay: { type: 'boolean' },
    showOnlyActiveDate: { type: 'boolean' },
    dateFormat: { type: 'string' },
    theme: {
      type: 'string',
      enum: ['light', 'dark'],
    },
    valueColor: { type: 'string' },
    barAxisTitle: { type: 'string' },
    noOfTicks: { type: 'number' },
  },
  required: ['colorDomain'],
};

export const animatedStackedBarChartSettingsSchema = {
  type: 'object',
  properties: {
    customLayers: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          position: {
            type: 'string',
            enum: ['before', 'after'],
          },
          layer: {
            type: 'object',
          },
        },
        required: ['layer', 'position'],
      },
    },
    precision: { type: 'number' },
    styles: { type: 'object' },
    classNames: { type: 'object' },
    orientation: {
      type: 'string',
      enum: ['vertical', 'horizontal'],
    },
    detailsOnClick: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    colors: {
      type: 'array',
      items: { type: 'string' },
    },
    ariaLabel: { type: 'string' },
    resetSelectionOnDoubleClick: { type: 'boolean' },
    graphTitle: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    graphDescription: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    footNote: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    width: { type: 'number' },
    height: { type: 'number' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    barPadding: { type: 'number' },
    showTicks: { type: 'boolean' },
    leftMargin: { type: 'number' },
    rightMargin: { type: 'number' },
    truncateBy: { type: 'number' },
    colorDomain: {
      type: 'array',
      items: { type: 'string' },
    },
    colorLegendTitle: { type: 'string' },
    backgroundColor: { oneOf: [{ type: 'string' }, { type: 'boolean' }] },
    padding: { type: 'string' },
    topMargin: { type: 'number' },
    bottomMargin: { type: 'number' },
    suffix: { type: 'string' },
    prefix: { type: 'string' },
    showValues: { type: 'boolean' },
    showLabels: { type: 'boolean' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    tooltip: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    refValues: {
      type: 'array',
      items: {
        properties: {
          color: { type: 'string' },
          text: { type: 'string' },
          value: { type: 'number' },
          styles: {
            type: 'object',
            properties: {
              line: { type: 'object' },
              text: { type: 'object' },
            },
          },
          classNames: {
            type: 'object',
            properties: {
              line: { type: 'string' },
              text: { type: 'string' },
            },
          },
        },
        type: 'object',
        required: ['value', 'text'],
      },
    },
    graphID: { type: 'string' },
    maxValue: { type: 'number' },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    language: {
      type: 'string',
      enum: [
        'en',
        'ar',
        'az',
        'bn',
        'cy',
        'he',
        'hi',
        'jp',
        'ka',
        'km',
        'ko',
        'my',
        'ne',
        'zh',
        'custom',
      ],
    },
    autoPlay: { type: 'boolean' },
    showOnlyActiveDate: { type: 'boolean' },
    dateFormat: { type: 'string' },
    theme: {
      type: 'string',
      enum: ['light', 'dark'],
    },
    autoSort: { type: 'boolean' },
    sortParameter: { oneOf: [{ type: 'string', enum: ['total'] }, { type: 'number' }] },
    maxBarThickness: { type: 'number' },
    minBarThickness: { type: 'number' },
    valueColor: { type: 'string' },
    barAxisTitle: { type: 'string' },
    noOfTicks: { type: 'number' },
  },
  required: ['colorDomain'],
};

export const beeSwarmChartSettingsSchema = {
  type: 'object',
  properties: {
    customLayers: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          position: {
            type: 'string',
            enum: ['before', 'after'],
          },
          layer: {
            type: 'object',
          },
        },
        required: ['layer', 'position'],
      },
    },
    precision: { type: 'number' },
    dimmedOpacity: { type: 'number', minimum: 0, maximum: 1 },
    animate: {
      oneOf: [
        {
          type: 'object',
          properties: {
            duration: {
              type: 'number',
            },
            once: {
              type: 'boolean',
            },
            amount: {
              anyOf: [
                {
                  type: 'string',
                  enum: ['some', 'all'],
                },
                {
                  type: 'number',
                },
              ],
            },
          },
          required: ['duration', 'once', 'amount'],
        },
        { type: 'boolean' },
      ],
    },
    styles: { type: 'object' },
    classNames: { type: 'object' },
    detailsOnClick: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    colors: { oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }] },
    orientation: {
      type: 'string',
      enum: ['vertical', 'horizontal'],
    },
    ariaLabel: { type: 'string' },
    resetSelectionOnDoubleClick: { type: 'boolean' },
    graphTitle: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    graphDescription: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    footNote: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    width: { type: 'number' },
    height: { type: 'number' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    showTicks: { type: 'boolean' },
    leftMargin: { type: 'number' },
    rightMargin: { type: 'number' },
    colorDomain: {
      type: 'array',
      items: { type: 'string' },
    },
    colorLegendTitle: { type: 'string' },
    backgroundColor: { oneOf: [{ type: 'string' }, { type: 'boolean' }] },
    padding: { type: 'string' },
    topMargin: { type: 'number' },
    bottomMargin: { type: 'number' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    showLabels: { type: 'boolean' },
    showColorScale: { type: 'boolean' },
    tooltip: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    refValues: {
      type: 'array',
      items: {
        properties: {
          color: { type: 'string' },
          text: { type: 'string' },
          value: { type: 'number' },
          styles: {
            type: 'object',
            properties: {
              line: { type: 'object' },
              text: { type: 'object' },
            },
          },
          classNames: {
            type: 'object',
            properties: {
              line: { type: 'string' },
              text: { type: 'string' },
            },
          },
        },
        type: 'object',
        required: ['value', 'text'],
      },
    },
    graphID: { type: 'string' },
    radius: { type: 'number' },
    maxRadiusValue: { type: 'number' },
    maxPositionValue: { type: 'number' },
    minPositionValue: { type: 'number' },
    highlightedDataPoints: {
      type: 'array',
      items: { oneOf: [{ type: 'string' }, { type: 'number' }] },
    },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    showNAColor: { type: 'boolean' },
    language: {
      type: 'string',
      enum: [
        'en',
        'ar',
        'az',
        'bn',
        'cy',
        'he',
        'hi',
        'jp',
        'ka',
        'km',
        'ko',
        'my',
        'ne',
        'zh',
        'custom',
      ],
    },
    theme: {
      type: 'string',
      enum: ['light', 'dark'],
    },
  },
};

export const butterflyChartSettingsSchema = {
  type: 'object',
  properties: {
    customLayers: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          position: {
            type: 'string',
            enum: ['before', 'after'],
          },
          layer: {
            type: 'object',
          },
        },
        required: ['layer', 'position'],
      },
    },
    precision: { type: 'number' },
    animate: {
      oneOf: [
        {
          type: 'object',
          properties: {
            duration: {
              type: 'number',
            },
            once: {
              type: 'boolean',
            },
            amount: {
              anyOf: [
                {
                  type: 'string',
                  enum: ['some', 'all'],
                },
                {
                  type: 'number',
                },
              ],
            },
          },
          required: ['duration', 'once', 'amount'],
        },
        { type: 'boolean' },
      ],
    },
    styles: { type: 'object' },
    classNames: { type: 'object' },
    detailsOnClick: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    graphTitle: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    resetSelectionOnDoubleClick: { type: 'boolean' },
    graphDescription: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    ariaLabel: { type: 'string' },
    leftBarTitle: { type: 'string' },
    rightBarTitle: { type: 'string' },
    footNote: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    width: { type: 'number' },
    height: { type: 'number' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    backgroundColor: { oneOf: [{ type: 'string' }, { type: 'boolean' }] },
    padding: { type: 'string' },
    leftMargin: { type: 'number' },
    rightMargin: { type: 'number' },
    topMargin: { type: 'number' },
    bottomMargin: { type: 'number' },
    barColors: {
      type: 'array',
      items: { type: 'string' },
      minItems: 2,
      maxItems: 2,
    },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    tooltip: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    graphID: { type: 'string' },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    barPadding: { type: 'number' },
    truncateBy: { type: 'number' },
    suffix: { type: 'string' },
    prefix: { type: 'string' },
    showTicks: { type: 'boolean' },
    showValues: { type: 'boolean' },
    centerGap: { type: 'number' },
    maxValue: { type: 'number' },
    minValue: { type: 'number' },
    showColorScale: { type: 'boolean' },
    refValues: {
      type: 'array',
      items: {
        properties: {
          color: { type: 'string' },
          text: { type: 'string' },
          value: { type: 'number' },
          styles: {
            type: 'object',
            properties: {
              line: { type: 'object' },
              text: { type: 'object' },
            },
          },
          classNames: {
            type: 'object',
            properties: {
              line: { type: 'string' },
              text: { type: 'string' },
            },
          },
        },
        type: 'object',
        required: ['value', 'text'],
      },
    },
    language: {
      type: 'string',
      enum: [
        'en',
        'ar',
        'az',
        'bn',
        'cy',
        'he',
        'hi',
        'jp',
        'ka',
        'km',
        'ko',
        'my',
        'ne',
        'zh',
        'custom',
      ],
    },
    theme: {
      type: 'string',
      enum: ['light', 'dark'],
    },
  },
};

export const animatedButterflyChartSettingsSchema = {
  type: 'object',
  properties: {
    customLayers: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          position: {
            type: 'string',
            enum: ['before', 'after'],
          },
          layer: {
            type: 'object',
          },
        },
        required: ['layer', 'position'],
      },
    },
    precision: { type: 'number' },
    styles: { type: 'object' },
    classNames: { type: 'object' },
    detailsOnClick: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    graphTitle: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    resetSelectionOnDoubleClick: { type: 'boolean' },
    ariaLabel: { type: 'string' },
    graphDescription: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    leftBarTitle: { type: 'string' },
    rightBarTitle: { type: 'string' },
    footNote: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    width: { type: 'number' },
    height: { type: 'number' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    backgroundColor: { oneOf: [{ type: 'string' }, { type: 'boolean' }] },
    padding: { type: 'string' },
    leftMargin: { type: 'number' },
    rightMargin: { type: 'number' },
    topMargin: { type: 'number' },
    bottomMargin: { type: 'number' },
    barColors: {
      type: 'array',
      items: { type: 'string' },
      minItems: 2,
      maxItems: 2,
    },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    tooltip: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    graphID: { type: 'string' },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    barPadding: { type: 'number' },
    truncateBy: { type: 'number' },
    suffix: { type: 'string' },
    prefix: { type: 'string' },
    showTicks: { type: 'boolean' },
    showValues: { type: 'boolean' },
    centerGap: { type: 'number' },
    maxValue: { type: 'number' },
    minValue: { type: 'number' },
    showColorScale: { type: 'boolean' },
    refValues: {
      type: 'array',
      items: {
        properties: {
          color: { type: 'string' },
          text: { type: 'string' },
          value: { type: 'number' },
          styles: {
            type: 'object',
            properties: {
              line: { type: 'object' },
              text: { type: 'object' },
            },
          },
          classNames: {
            type: 'object',
            properties: {
              line: { type: 'string' },
              text: { type: 'string' },
            },
          },
        },
        type: 'object',
        required: ['value', 'text'],
      },
    },
    language: {
      type: 'string',
      enum: [
        'en',
        'ar',
        'az',
        'bn',
        'cy',
        'he',
        'hi',
        'jp',
        'ka',
        'km',
        'ko',
        'my',
        'ne',
        'zh',
        'custom',
      ],
    },
    autoPlay: { type: 'boolean' },
    showOnlyActiveDate: { type: 'boolean' },
    dateFormat: { type: 'string' },
    theme: {
      type: 'string',
      enum: ['light', 'dark'],
    },
  },
};

export const circlePackingSettingsSchema = {
  type: 'object',
  properties: {
    precision: { type: 'number' },
    dimmedOpacity: { type: 'number', minimum: 0, maximum: 1 },
    animate: {
      oneOf: [
        {
          type: 'object',
          properties: {
            duration: {
              type: 'number',
            },
            once: {
              type: 'boolean',
            },
            amount: {
              anyOf: [
                {
                  type: 'string',
                  enum: ['some', 'all'],
                },
                {
                  type: 'number',
                },
              ],
            },
          },
          required: ['duration', 'once', 'amount'],
        },
        { type: 'boolean' },
      ],
    },
    styles: { type: 'object' },
    classNames: { type: 'object' },
    detailsOnClick: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    colors: {
      oneOf: [
        { type: 'string' },
        {
          type: 'array',
          items: { type: 'string' },
        },
      ],
    },
    resetSelectionOnDoubleClick: { type: 'boolean' },
    ariaLabel: { type: 'string' },
    graphTitle: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    graphDescription: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    footNote: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    width: { type: 'number' },
    height: { type: 'number' },
    suffix: { type: 'string' },
    prefix: { type: 'string' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    leftMargin: { type: 'number' },
    rightMargin: { type: 'number' },
    colorDomain: {
      type: 'array',
      items: { type: 'string' },
    },
    colorLegendTitle: { type: 'string' },
    backgroundColor: { oneOf: [{ type: 'string' }, { type: 'boolean' }] },
    padding: { type: 'string' },
    topMargin: { type: 'number' },
    bottomMargin: { type: 'number' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    showLabels: { type: 'boolean' },
    tooltip: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    showColorScale: { type: 'boolean' },
    showValues: { type: 'boolean' },
    graphID: { type: 'string' },
    showNAColor: { type: 'boolean' },
    highlightedDataPoints: {
      type: 'array',
      items: { oneOf: [{ type: 'string' }, { type: 'number' }] },
    },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    language: {
      type: 'string',
      enum: [
        'en',
        'ar',
        'az',
        'bn',
        'cy',
        'he',
        'hi',
        'jp',
        'ka',
        'km',
        'ko',
        'my',
        'ne',
        'zh',
        'custom',
      ],
    },
    theme: {
      type: 'string',
      enum: ['light', 'dark'],
    },
    radius: { type: 'number' },
    maxRadiusValue: { type: 'number' },
  },
};

export const dataTableSettingsSchema = {
  type: 'object',
  properties: {
    precision: { type: 'number' },
    styles: { type: 'object' },
    classNames: { type: 'object' },
    graphTitle: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    ariaLabel: { type: 'string' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    minWidth: { type: 'string' },
    graphDescription: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    footNote: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    graphID: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    language: {
      type: 'string',
      enum: [
        'en',
        'ar',
        'az',
        'bn',
        'cy',
        'he',
        'hi',
        'jp',
        'ka',
        'km',
        'ko',
        'my',
        'ne',
        'zh',
        'custom',
      ],
    },
    backgroundColor: { oneOf: [{ type: 'string' }, { type: 'boolean' }] },
    padding: { type: 'string' },
    theme: {
      type: 'string',
      enum: ['light', 'dark'],
    },
    columnData: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          columnTitle: { type: 'string' },
          columnId: { type: 'string' },
          sortable: { type: 'boolean' },
          filterOptions: {
            type: 'array',
            items: { type: 'string' },
          },
          chip: { type: 'boolean' },
          chipColors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                value: { type: 'string' },
                color: { type: 'string' },
              },
              required: ['value', 'color'],
            },
          },
          separator: { type: 'string' },
          align: {
            type: 'string',
            enum: ['left', 'right', 'center'],
          },
          suffix: { type: 'string' },
          prefix: { type: 'string' },
          columnWidth: { type: 'number' },
        },
        required: ['columnId'],
      },
    },
    resetSelectionOnDoubleClick: { type: 'boolean' },
  },
  required: ['columnData'],
};

export const dataCardListSettingsSchema = {
  type: 'object',
  properties: {
    styles: { type: 'object' },
    classNames: { type: 'object' },
    graphTitle: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    ariaLabel: { type: 'string' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    graphDescription: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    footNote: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    graphID: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    language: {
      type: 'string',
      enum: [
        'en',
        'ar',
        'az',
        'bn',
        'cy',
        'he',
        'hi',
        'jp',
        'ka',
        'km',
        'ko',
        'my',
        'ne',
        'zh',
        'custom',
      ],
    },
    theme: {
      type: 'string',
      enum: ['light', 'dark'],
    },
    uiMode: {
      type: 'string',
      enum: ['light', 'normal'],
    },
    cardTemplate: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    cardBackgroundColor: { type: 'string' },
    cardFilters: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          column: { type: 'string' },
          width: { type: 'string' },
          label: { type: 'string' },
          defaultValue: { oneOf: [{ type: 'string' }, { type: 'number' }] },
          excludeValues: { type: 'array', items: { type: 'string' } },
        },
        required: ['column'],
      },
    },
    cardSearchColumns: {
      type: 'array',
      items: { type: 'string' },
    },
    backgroundColor: { oneOf: [{ type: 'string' }, { type: 'boolean' }] },
    padding: { type: 'string' },
    cardSortingOptions: {
      type: 'object',
      properties: {
        defaultValue: { type: 'string' },
        width: { type: 'string' },
        options: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              value: { type: 'string' },
              label: { type: 'string' },
              type: { type: 'string', enum: ['asc', 'desc'] },
            },
            required: ['value', 'label', 'type'],
          },
          minItems: 1,
        },
      },
    },
    cardMinWidth: { type: 'number' },
    detailsOnClick: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    allowDataDownloadOnDetail: { oneOf: [{ type: 'string' }, { type: 'boolean' }] },
    noOfItemsInAPage: { type: 'number', minimum: 0 },
  },
  required: ['cardTemplate'],
};

export const radarChartSettingsSchema = {
  type: 'object',
  properties: {
    customLayers: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          position: {
            type: 'string',
            enum: ['before', 'after'],
          },
          layer: {
            type: 'object',
          },
        },
        required: ['layer', 'position'],
      },
    },
    precision: { type: 'number' },
    dimmedOpacity: { type: 'number', minimum: 0, maximum: 1 },
    animate: {
      oneOf: [
        {
          type: 'object',
          properties: {
            duration: {
              type: 'number',
            },
            once: {
              type: 'boolean',
            },
            amount: {
              anyOf: [
                {
                  type: 'string',
                  enum: ['some', 'all'],
                },
                {
                  type: 'number',
                },
              ],
            },
          },
          required: ['duration', 'once', 'amount'],
        },
        { type: 'boolean' },
      ],
    },
    styles: { type: 'object' },
    classNames: { type: 'object' },
    detailsOnClick: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    topMargin: { type: 'number' },
    bottomMargin: { type: 'number' },
    leftMargin: { type: 'number' },
    rightMargin: { type: 'number' },
    ariaLabel: { type: 'string' },
    legendMaxWidth: { type: 'string' },
    colors: {
      oneOf: [
        { type: 'string' },
        {
          type: 'array',
          items: { type: 'string' },
        },
      ],
    },
    graphTitle: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    graphDescription: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    footNote: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    radius: { type: 'number' },
    strokeWidth: { type: 'number' },
    showNAColor: { type: 'boolean' },
    showValues: { type: 'boolean' },
    showDots: { type: 'boolean' },
    fillShape: { type: 'boolean' },
    showColorScale: { type: 'boolean' },
    backgroundColor: { oneOf: [{ type: 'string' }, { type: 'boolean' }] },
    colorLegendTitle: { type: 'string' },
    padding: { type: 'string' },
    tooltip: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    graphID: { type: 'string' },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    colorDomain: {
      type: 'array',
      items: { type: 'string' },
    },
    axisLabels: {
      type: 'array',
      items: { oneOf: [{ type: 'string' }, { type: 'number' }] },
    },
    curveType: {
      type: 'string',
      enum: ['linear', 'curve'],
    },
    highlightedLines: {
      type: 'array',
      items: { oneOf: [{ type: 'string' }, { type: 'number' }] },
    },
    noOfTicks: { type: 'number' },
    maxValue: { type: 'number' },
    minValue: { type: 'number' },
    language: {
      type: 'string',
      enum: [
        'en',
        'ar',
        'az',
        'bn',
        'cy',
        'he',
        'hi',
        'jp',
        'ka',
        'km',
        'ko',
        'my',
        'ne',
        'zh',
        'custom',
      ],
    },
    theme: {
      type: 'string',
      enum: ['light', 'dark'],
    },
    width: { type: 'number' },
    height: { type: 'number' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    resetSelectionOnDoubleClick: { type: 'boolean' },
  },
  required: ['axisLabels'],
};

export const donutChartSettingsSchema = {
  type: 'object',
  properties: {
    precision: { type: 'number' },
    styles: { type: 'object' },
    classNames: { type: 'object' },
    detailsOnClick: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    mainText: {
      oneOf: [
        { type: 'string' },
        {
          type: 'object',
          properties: {
            label: { type: 'string' },
            suffix: { type: 'string' },
            prefix: { type: 'string' },
          },
          required: ['label'],
        },
      ],
    },
    topMargin: { type: 'number' },
    bottomMargin: { type: 'number' },
    ariaLabel: { type: 'string' },
    legendMaxWidth: { type: 'string' },
    colors: {
      type: 'array',
      items: { type: 'string' },
    },
    graphTitle: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    suffix: { type: 'string' },
    prefix: { type: 'string' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    graphDescription: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    subNote: { type: 'string' },
    footNote: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    radius: { type: 'number' },
    strokeWidth: { type: 'number' },
    showColorScale: { type: 'boolean' },
    backgroundColor: { oneOf: [{ type: 'string' }, { type: 'boolean' }] },
    padding: { type: 'string' },
    tooltip: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    graphID: { type: 'string' },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    colorDomain: {
      type: 'array',
      items: { type: 'string' },
    },
    sortData: {
      type: 'string',
      enum: ['asc', 'desc'],
    },
    language: {
      type: 'string',
      enum: [
        'en',
        'ar',
        'az',
        'bn',
        'cy',
        'he',
        'hi',
        'jp',
        'ka',
        'km',
        'ko',
        'my',
        'ne',
        'zh',
        'custom',
      ],
    },
    theme: {
      type: 'string',
      enum: ['light', 'dark'],
    },
    width: { type: 'number' },
    height: { type: 'number' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    resetSelectionOnDoubleClick: { type: 'boolean' },
  },
};

export const dumbbellChartSettingsSchema = {
  type: 'object',
  properties: {
    customLayers: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          position: {
            type: 'string',
            enum: ['before', 'after'],
          },
          layer: {
            type: 'object',
          },
        },
        required: ['layer', 'position'],
      },
    },
    precision: { type: 'number' },
    animate: {
      oneOf: [
        {
          type: 'object',
          properties: {
            duration: {
              type: 'number',
            },
            once: {
              type: 'boolean',
            },
            amount: {
              anyOf: [
                {
                  type: 'string',
                  enum: ['some', 'all'],
                },
                {
                  type: 'number',
                },
              ],
            },
          },
          required: ['duration', 'once', 'amount'],
        },
        { type: 'boolean' },
      ],
    },
    styles: { type: 'object' },
    classNames: { type: 'object' },
    detailsOnClick: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    ariaLabel: { type: 'string' },
    colors: {
      type: 'array',
      items: { type: 'string' },
    },
    refValues: {
      type: 'array',
      items: {
        properties: {
          color: { type: 'string' },
          text: { type: 'string' },
          value: { type: 'number' },
          styles: {
            type: 'object',
            properties: {
              line: { type: 'object' },
              text: { type: 'object' },
            },
          },
          classNames: {
            type: 'object',
            properties: {
              line: { type: 'string' },
              text: { type: 'string' },
            },
          },
        },
        type: 'object',
        required: ['value', 'text'],
      },
    },
    labelOrder: {
      type: 'array',
      items: { type: 'string' },
    },
    orientation: {
      type: 'string',
      enum: ['vertical', 'horizontal'],
    },
    graphTitle: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    graphDescription: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    footNote: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    width: { type: 'number' },
    height: { type: 'number' },
    suffix: { type: 'string' },
    prefix: { type: 'string' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    barPadding: { type: 'number' },
    showValues: { type: 'boolean' },
    showTicks: { type: 'boolean' },
    leftMargin: { type: 'number' },
    rightMargin: { type: 'number' },
    topMargin: { type: 'number' },
    bottomMargin: { type: 'number' },
    truncateBy: { type: 'number' },
    colorDomain: {
      type: 'array',
      items: { type: 'string' },
    },
    colorLegendTitle: { type: 'string' },
    backgroundColor: { oneOf: [{ type: 'string' }, { type: 'boolean' }] },
    padding: { type: 'string' },
    radius: { type: 'number' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    showLabels: { type: 'boolean' },
    tooltip: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    graphID: { type: 'string' },
    maxPositionValue: { type: 'number' },
    minPositionValue: { type: 'number' },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    language: {
      type: 'string',
      enum: [
        'en',
        'ar',
        'az',
        'bn',
        'cy',
        'he',
        'hi',
        'jp',
        'ka',
        'km',
        'ko',
        'my',
        'ne',
        'zh',
        'custom',
      ],
    },
    sortParameter: { oneOf: [{ type: 'string', enum: ['diff'] }, { type: 'number' }] },
    arrowConnector: { type: 'boolean' },
    connectorStrokeWidth: { type: 'number' },
    theme: {
      type: 'string',
      enum: ['light', 'dark'],
    },
    maxBarThickness: { type: 'number' },
    minBarThickness: { type: 'number' },
    maxNumberOfBars: { type: 'number' },
    resetSelectionOnDoubleClick: { type: 'boolean' },
    valueColor: { type: 'string' },
    axisTitle: { type: 'string' },
    noOfTicks: { type: 'number' },
  },
  required: ['colorDomain'],
};

export const animatedDumbbellChartSettingsSchema = {
  type: 'object',
  properties: {
    customLayers: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          position: {
            type: 'string',
            enum: ['before', 'after'],
          },
          layer: {
            type: 'object',
          },
        },
        required: ['layer', 'position'],
      },
    },
    precision: { type: 'number' },
    styles: { type: 'object' },
    classNames: { type: 'object' },
    detailsOnClick: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    ariaLabel: { type: 'string' },
    colors: {
      type: 'array',
      items: { type: 'string' },
    },
    refValues: {
      type: 'array',
      items: {
        properties: {
          color: { type: 'string' },
          text: { type: 'string' },
          value: { type: 'number' },
          styles: {
            type: 'object',
            properties: {
              line: { type: 'object' },
              text: { type: 'object' },
            },
          },
          classNames: {
            type: 'object',
            properties: {
              line: { type: 'string' },
              text: { type: 'string' },
            },
          },
        },
        type: 'object',
        required: ['value', 'text'],
      },
    },
    orientation: {
      type: 'string',
      enum: ['vertical', 'horizontal'],
    },
    graphTitle: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    graphDescription: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    footNote: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    width: { type: 'number' },
    height: { type: 'number' },
    suffix: { type: 'string' },
    prefix: { type: 'string' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    barPadding: { type: 'number' },
    showValues: { type: 'boolean' },
    showTicks: { type: 'boolean' },
    leftMargin: { type: 'number' },
    rightMargin: { type: 'number' },
    topMargin: { type: 'number' },
    bottomMargin: { type: 'number' },
    truncateBy: { type: 'number' },
    colorDomain: {
      type: 'array',
      items: { type: 'string' },
    },
    colorLegendTitle: { type: 'string' },
    backgroundColor: { oneOf: [{ type: 'string' }, { type: 'boolean' }] },
    padding: { type: 'string' },
    radius: { type: 'number' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    showLabels: { type: 'boolean' },
    tooltip: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    graphID: { type: 'string' },
    maxPositionValue: { type: 'number' },
    minPositionValue: { type: 'number' },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    language: {
      type: 'string',
      enum: [
        'en',
        'ar',
        'az',
        'bn',
        'cy',
        'he',
        'hi',
        'jp',
        'ka',
        'km',
        'ko',
        'my',
        'ne',
        'zh',
        'custom',
      ],
    },
    sortParameter: { oneOf: [{ type: 'string', enum: ['diff'] }, { type: 'number' }] },
    arrowConnector: { type: 'boolean' },
    connectorStrokeWidth: { type: 'number' },
    autoPlay: { type: 'boolean' },
    showOnlyActiveDate: { type: 'boolean' },
    dateFormat: { type: 'string' },
    theme: {
      type: 'string',
      enum: ['light', 'dark'],
    },
    maxBarThickness: { type: 'number' },
    minBarThickness: { type: 'number' },
    valueColor: { type: 'string' },
    axisTitle: { type: 'string' },
    noOfTicks: { type: 'number' },
    resetSelectionOnDoubleClick: { type: 'boolean' },
  },
  required: ['colorDomain'],
};

export const heatMapSettingsSchema = {
  type: 'object',
  properties: {
    precision: { type: 'number' },
    animate: {
      oneOf: [
        {
          type: 'object',
          properties: {
            duration: {
              type: 'number',
            },
            once: {
              type: 'boolean',
            },
            amount: {
              anyOf: [
                {
                  type: 'string',
                  enum: ['some', 'all'],
                },
                {
                  type: 'number',
                },
              ],
            },
          },
          required: ['duration', 'once', 'amount'],
        },
        { type: 'boolean' },
      ],
    },
    styles: { type: 'object' },
    classNames: { type: 'object' },
    detailsOnClick: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    ariaLabel: { type: 'string' },
    colors: {
      type: 'array',
      items: { type: 'string' },
    },
    graphTitle: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    graphDescription: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    footNote: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    width: { type: 'number' },
    height: { type: 'number' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    scaleType: { type: 'string', enum: ['linear', 'categorical', 'threshold'] },
    colorDomain: {
      oneOf: [
        {
          type: 'array',
          items: { type: 'number' },
        },
        {
          type: 'array',
          items: { type: 'string' },
        },
      ],
    },
    showColumnLabels: { type: 'boolean' },
    leftMargin: { type: 'number' },
    rightMargin: { type: 'number' },
    truncateBy: { type: 'number' },
    colorLegendTitle: { type: 'string' },
    backgroundColor: { oneOf: [{ type: 'string' }, { type: 'boolean' }] },
    padding: { type: 'string' },
    topMargin: { type: 'number' },
    bottomMargin: { type: 'number' },
    suffix: { type: 'string' },
    prefix: { type: 'string' },
    showValues: { type: 'boolean' },
    showRowLabels: { type: 'boolean' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    tooltip: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    graphID: { type: 'string' },
    noDataColor: { type: 'string' },
    showColorScale: { type: 'boolean' },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    fillContainer: { type: 'boolean' },
    showNAColor: { type: 'boolean' },
    language: {
      type: 'string',
      enum: [
        'en',
        'ar',
        'az',
        'bn',
        'cy',
        'he',
        'hi',
        'jp',
        'ka',
        'km',
        'ko',
        'my',
        'ne',
        'zh',
        'custom',
      ],
    },
    theme: {
      type: 'string',
      enum: ['light', 'dark'],
    },
    resetSelectionOnDoubleClick: { type: 'boolean' },
  },
  required: ['colorDomain'],
};

export const histogramSettingsSchema = {
  type: 'object',
  properties: {
    precision: { type: 'number' },
    styles: { type: 'object' },
    classNames: { type: 'object' },
    ariaLabel: { type: 'string' },
    colors: {
      oneOf: [
        { type: 'string' },
        {
          type: 'array',
          items: { type: 'string' },
        },
      ],
    },
    graphTitle: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    graphDescription: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    footNote: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    width: { type: 'number' },
    height: { type: 'number' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    barPadding: { type: 'number' },
    showValues: { type: 'boolean' },
    showTicks: { type: 'boolean' },
    leftMargin: { type: 'number' },
    rightMargin: { type: 'number' },
    backgroundColor: { oneOf: [{ type: 'string' }, { type: 'boolean' }] },
    padding: { type: 'string' },
    topMargin: { type: 'number' },
    bottomMargin: { type: 'number' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    showLabels: { type: 'boolean' },
    maxValue: { type: 'number' },
    tooltip: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    refValues: {
      type: 'array',
      items: {
        properties: {
          color: { type: 'string' },
          text: { type: 'string' },
          value: { type: 'number' },
          styles: {
            type: 'object',
            properties: {
              line: { type: 'object' },
              text: { type: 'object' },
            },
          },
          classNames: {
            type: 'object',
            properties: {
              line: { type: 'string' },
              text: { type: 'string' },
            },
          },
        },
        type: 'object',
        required: ['value', 'text'],
      },
    },
    graphID: { type: 'string' },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    numberOfBins: { type: 'number' },
    truncateBy: { type: 'number' },
    donutStrokeWidth: { type: 'number' },
    sortData: {
      type: 'string',
      enum: ['asc', 'desc'],
    },
    barGraphLayout: {
      type: 'string',
      enum: ['horizontal', 'vertical'],
    },
    graphType: {
      type: 'string',
      enum: ['circlePacking', 'treeMap', 'barGraph', 'donutChart'],
    },
    language: {
      type: 'string',
      enum: [
        'en',
        'ar',
        'az',
        'bn',
        'cy',
        'he',
        'hi',
        'jp',
        'ka',
        'km',
        'ko',
        'my',
        'ne',
        'zh',
        'custom',
      ],
    },
    theme: {
      type: 'string',
      enum: ['light', 'dark'],
    },
    maxBarThickness: { type: 'number' },
    detailsOnClick: { oneOf: [{ type: 'string' }, { type: 'object' }] },
  },
};

export const dualAxisLineChartSettingsSchema = {
  type: 'object',
  properties: {
    customLayers: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          position: {
            type: 'string',
            enum: ['before', 'after'],
          },
          layer: {
            type: 'object',
          },
        },
        required: ['layer', 'position'],
      },
    },
    precision: { type: 'number' },
    styles: { type: 'object' },
    classNames: { type: 'object' },
    ariaLabel: { type: 'string' },
    graphTitle: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    graphDescription: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    curveType: {
      type: 'string',
      enum: ['linear', 'curve', 'step', 'stepAfter', 'stepBefore'],
    },
    labels: {
      type: 'array',
      items: { type: 'string' },
      minItems: 2,
      maxItems: 2,
    },
    footNote: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    width: { type: 'number' },
    height: { type: 'number' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    noOfXTicks: { type: 'number' },
    dateFormat: { type: 'string' },
    showValues: { type: 'boolean' },
    showColorScale: { type: 'boolean' },
    backgroundColor: { oneOf: [{ type: 'string' }, { type: 'boolean' }] },
    padding: { type: 'string' },
    leftMargin: { type: 'number' },
    rightMargin: { type: 'number' },
    topMargin: { type: 'number' },
    bottomMargin: { type: 'number' },
    lineColors: {
      type: 'array',
      items: { type: 'string' },
      minItems: 2,
      maxItems: 2,
    },
    sameAxes: { type: 'boolean' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    tooltip: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    highlightAreaSettings: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          coordinates: {
            type: 'array',
            items: { oneOf: [{ type: 'number' }, { type: 'string' }, { type: 'null' }] },
            minItems: 2,
            maxItems: 2,
          },
          style: { type: 'object' },
          className: { type: 'string' },
          color: { type: 'string' },
          strokeWidth: { type: 'number' },
        },
        required: ['coordinates'],
      },
    },
    graphID: { type: 'string' },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    language: {
      type: 'string',
      enum: [
        'en',
        'ar',
        'az',
        'bn',
        'cy',
        'he',
        'hi',
        'jp',
        'ka',
        'km',
        'ko',
        'my',
        'ne',
        'zh',
        'custom',
      ],
    },
    animate: {
      oneOf: [
        {
          type: 'object',
          properties: {
            duration: {
              type: 'number',
            },
            once: {
              type: 'boolean',
            },
            amount: {
              anyOf: [
                {
                  type: 'string',
                  enum: ['some', 'all'],
                },
                {
                  type: 'number',
                },
              ],
            },
          },
          required: ['duration', 'once', 'amount'],
        },
        { type: 'boolean' },
      ],
    },
    strokeWidth: { type: 'number' },
    showDots: { type: 'boolean' },
    colorLegendTitle: { type: 'string' },
    theme: {
      type: 'string',
      enum: ['light', 'dark'],
    },
    noOfYTicks: { type: 'number' },
    minDate: { oneOf: [{ type: 'string' }, { type: 'number' }] },
    maxDate: { oneOf: [{ type: 'string' }, { type: 'number' }] },
    yAxisTitle: { type: 'string' },
    lineSuffixes: {
      type: 'array',
      items: { type: 'string' },
      minItems: 2,
      maxItems: 2,
    },
    linePrefixes: {
      type: 'array',
      items: { type: 'string' },
      minItems: 2,
      maxItems: 2,
    },
  },
};

export const lineChartSettingsSchema = {
  type: 'object',
  properties: {
    customLayers: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          position: {
            type: 'string',
            enum: ['before', 'after'],
          },
          layer: {
            type: 'object',
          },
        },
        required: ['layer', 'position'],
      },
    },
    precision: { type: 'number' },
    styles: { type: 'object' },
    classNames: { type: 'object' },
    curveType: {
      type: 'string',
      enum: ['linear', 'curve', 'step', 'stepAfter', 'stepBefore'],
    },
    ariaLabel: { type: 'string' },
    graphID: { type: 'string' },
    regressionLine: { oneOf: [{ type: 'string' }, { type: 'boolean' }] },
    lineColor: { type: 'string' },
    graphTitle: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    graphDescription: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    footNote: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    width: { type: 'number' },
    height: { type: 'number' },
    suffix: { type: 'string' },
    prefix: { type: 'string' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    noOfXTicks: { type: 'number' },
    dateFormat: { type: 'string' },
    showValues: { type: 'boolean' },
    backgroundColor: { oneOf: [{ type: 'string' }, { type: 'boolean' }] },
    padding: { type: 'string' },
    leftMargin: { type: 'number' },
    rightMargin: { type: 'number' },
    topMargin: { type: 'number' },
    bottomMargin: { type: 'number' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    tooltip: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    theme: {
      type: 'string',
      enum: ['light', 'dark'],
    },
    refValues: {
      type: 'array',
      items: {
        properties: {
          color: { type: 'string' },
          text: { type: 'string' },
          value: { type: 'number' },
          styles: {
            type: 'object',
            properties: {
              line: { type: 'object' },
              text: { type: 'object' },
            },
          },
          classNames: {
            type: 'object',
            properties: {
              line: { type: 'string' },
              text: { type: 'string' },
            },
          },
        },
        type: 'object',
        required: ['value', 'text'],
      },
    },
    annotations: {
      type: 'array',
      items: {
        properties: {
          color: { type: 'string' },
          text: { type: 'string' },
          xCoordinate: { oneOf: [{ type: 'string' }, { type: 'number' }] },
          yCoordinate: { oneOf: [{ type: 'string' }, { type: 'number' }] },
          xOffset: { type: 'number' },
          yOffset: { type: 'number' },
          align: {
            type: 'string',
            enum: ['center', 'left', 'right'],
          },
          fontWeight: {
            type: 'string',
            enum: ['regular', 'bold', 'medium'],
          },
          showConnector: { oneOf: [{ type: 'boolean' }, { type: 'number' }] },
          connectorRadius: { type: 'number' },
          maxWidth: { type: 'number' },
          styles: {
            type: 'object',
            properties: {
              connector: { type: 'object' },
              text: { type: 'object' },
            },
          },
          classNames: {
            type: 'object',
            properties: {
              connector: { type: 'string' },
              text: { type: 'string' },
            },
          },
        },
        type: 'object',
        required: ['text'],
      },
    },
    customHighlightAreaSettings: {
      type: 'array',
      items: {
        properties: {
          coordinates: {
            type: 'array',
            items: { oneOf: [{ type: 'string' }, { type: 'number' }] },
            minItems: 4,
          },
          color: { type: 'string' },
          strokeWidth: { type: 'number' },
          dashedStroke: { type: 'boolean' },
          closePath: { type: 'boolean' },
        },
        type: 'object',
        required: ['coordinates'],
      },
    },
    highlightAreaSettings: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          coordinates: {
            type: 'array',
            items: { oneOf: [{ type: 'number' }, { type: 'string' }, { type: 'null' }] },
            minItems: 2,
            maxItems: 2,
          },
          style: { type: 'object' },
          className: { type: 'string' },
          color: { type: 'string' },
          strokeWidth: { type: 'number' },
        },
        required: ['coordinates'],
      },
    },
    maxValue: { type: 'number' },
    minValue: { type: 'number' },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    language: {
      type: 'string',
      enum: [
        'en',
        'ar',
        'az',
        'bn',
        'cy',
        'he',
        'hi',
        'jp',
        'ka',
        'km',
        'ko',
        'my',
        'ne',
        'zh',
        'custom',
      ],
    },
    animate: {
      oneOf: [
        {
          type: 'object',
          properties: {
            duration: {
              type: 'number',
            },
            once: {
              type: 'boolean',
            },
            amount: {
              anyOf: [
                {
                  type: 'string',
                  enum: ['some', 'all'],
                },
                {
                  type: 'number',
                },
              ],
            },
          },
          required: ['duration', 'once', 'amount'],
        },
        { type: 'boolean' },
      ],
    },
    strokeWidth: { type: 'number' },
    showDots: { type: 'boolean' },
    noOfYTicks: { type: 'number' },
    minDate: { oneOf: [{ type: 'string' }, { type: 'number' }] },
    maxDate: { oneOf: [{ type: 'string' }, { type: 'number' }] },
    yAxisTitle: { type: 'string' },
  },
};

export const lineChartWithConfidenceIntervalSettingsSchema = {
  type: 'object',
  properties: {
    customLayers: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          position: {
            type: 'string',
            enum: ['before', 'after'],
          },
          layer: {
            type: 'object',
          },
        },
        required: ['layer', 'position'],
      },
    },
    precision: { type: 'number' },
    styles: { type: 'object' },
    classNames: { type: 'object' },
    curveType: {
      type: 'string',
      enum: ['linear', 'curve', 'step', 'stepAfter', 'stepBefore'],
    },
    ariaLabel: { type: 'string' },
    graphID: { type: 'string' },
    regressionLine: { oneOf: [{ type: 'string' }, { type: 'boolean' }] },
    lineColor: { type: 'string' },
    graphTitle: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    graphDescription: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    footNote: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    width: { type: 'number' },
    height: { type: 'number' },
    suffix: { type: 'string' },
    prefix: { type: 'string' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    noOfXTicks: { type: 'number' },
    dateFormat: { type: 'string' },
    showValues: { type: 'boolean' },
    backgroundColor: { oneOf: [{ type: 'string' }, { type: 'boolean' }] },
    padding: { type: 'string' },
    leftMargin: { type: 'number' },
    rightMargin: { type: 'number' },
    topMargin: { type: 'number' },
    bottomMargin: { type: 'number' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    tooltip: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    theme: {
      type: 'string',
      enum: ['light', 'dark'],
    },
    refValues: {
      type: 'array',
      items: {
        properties: {
          color: { type: 'string' },
          text: { type: 'string' },
          value: { type: 'number' },
          styles: {
            type: 'object',
            properties: {
              line: { type: 'object' },
              text: { type: 'object' },
            },
          },
          classNames: {
            type: 'object',
            properties: {
              line: { type: 'string' },
              text: { type: 'string' },
            },
          },
        },
        type: 'object',
        required: ['value', 'text'],
      },
    },
    annotations: {
      type: 'array',
      items: {
        properties: {
          color: { type: 'string' },
          text: { type: 'string' },
          xCoordinate: { oneOf: [{ type: 'string' }, { type: 'number' }] },
          yCoordinate: { oneOf: [{ type: 'string' }, { type: 'number' }] },
          xOffset: { type: 'number' },
          yOffset: { type: 'number' },
          align: {
            type: 'string',
            enum: ['center', 'left', 'right'],
          },
          fontWeight: {
            type: 'string',
            enum: ['regular', 'bold', 'medium'],
          },
          showConnector: { oneOf: [{ type: 'boolean' }, { type: 'number' }] },
          connectorRadius: { type: 'number' },
          maxWidth: { type: 'number' },
          styles: {
            type: 'object',
            properties: {
              connector: { type: 'object' },
              text: { type: 'object' },
            },
          },
          classNames: {
            type: 'object',
            properties: {
              connector: { type: 'string' },
              text: { type: 'string' },
            },
          },
        },
        type: 'object',
        required: ['text'],
      },
    },
    customHighlightAreaSettings: {
      type: 'array',
      items: {
        properties: {
          coordinates: {
            type: 'array',
            items: { oneOf: [{ type: 'string' }, { type: 'number' }] },
            minItems: 4,
          },
          color: { type: 'string' },
          strokeWidth: { type: 'number' },
          dashedStroke: { type: 'boolean' },
          closePath: { type: 'boolean' },
        },
        type: 'object',
        required: ['coordinates'],
      },
    },
    highlightAreaSettings: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          coordinates: {
            type: 'array',
            items: { oneOf: [{ type: 'number' }, { type: 'string' }, { type: 'null' }] },
            minItems: 2,
            maxItems: 2,
          },
          style: { type: 'object' },
          className: { type: 'string' },
          color: { type: 'string' },
          strokeWidth: { type: 'number' },
        },
        required: ['coordinates'],
      },
    },
    maxValue: { type: 'number' },
    minValue: { type: 'number' },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    language: {
      type: 'string',
      enum: [
        'en',
        'ar',
        'az',
        'bn',
        'cy',
        'he',
        'hi',
        'jp',
        'ka',
        'km',
        'ko',
        'my',
        'ne',
        'zh',
        'custom',
      ],
    },
    animate: {
      oneOf: [
        {
          type: 'object',
          properties: {
            duration: {
              type: 'number',
            },
            once: {
              type: 'boolean',
            },
            amount: {
              anyOf: [
                {
                  type: 'string',
                  enum: ['some', 'all'],
                },
                {
                  type: 'number',
                },
              ],
            },
          },
          required: ['duration', 'once', 'amount'],
        },
        { type: 'boolean' },
      ],
    },
    strokeWidth: { type: 'number' },
    showDots: { type: 'boolean' },
    showIntervalDots: { type: 'boolean' },
    showIntervalValues: { type: 'boolean' },
    intervalLineStrokeWidth: { type: 'number' },
    intervalLineColors: {
      type: 'array',
      items: { type: 'string' },
      minItems: 2,
      maxItems: 2,
    },
    intervalAreaColor: { type: 'string' },
    intervalAreaOpacity: { type: 'number' },
    noOfYTicks: { type: 'number' },
    minDate: { oneOf: [{ type: 'string' }, { type: 'number' }] },
    maxDate: { oneOf: [{ type: 'string' }, { type: 'number' }] },
    yAxisTitle: { type: 'string' },
    colorLegendTitle: { type: 'string' },
    colorLegendColors: {
      type: 'array',
      items: { type: 'string' },
    },
    colorLegendDomain: {
      type: 'array',
      items: { type: 'string' },
    },
  },
};

export const differenceLineChartSettingsSchema = {
  type: 'object',
  properties: {
    customLayers: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          position: {
            type: 'string',
            enum: ['before', 'after'],
          },
          layer: {
            type: 'object',
          },
        },
        required: ['layer', 'position'],
      },
    },
    precision: { type: 'number' },
    styles: { type: 'object' },
    classNames: { type: 'object' },
    curveType: {
      type: 'string',
      enum: ['linear', 'curve', 'step', 'stepAfter', 'stepBefore'],
    },
    ariaLabel: { type: 'string' },
    lineColors: {
      type: 'array',
      items: { type: 'string' },
      minItems: 2,
      maxItems: 2,
    },
    diffAreaColors: {
      type: 'array',
      items: { type: 'string' },
      minItems: 2,
      maxItems: 2,
    },
    graphTitle: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    graphDescription: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    footNote: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    width: { type: 'number' },
    height: { type: 'number' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    noOfXTicks: { type: 'number' },
    dateFormat: { type: 'string' },
    showValues: { type: 'boolean' },
    suffix: { type: 'string' },
    prefix: { type: 'string' },
    labels: {
      type: 'array',
      items: { type: 'string' },
      minItems: 2,
      maxItems: 2,
    },
    backgroundColor: { oneOf: [{ type: 'string' }, { type: 'boolean' }] },
    padding: { type: 'string' },
    leftMargin: { type: 'number' },
    rightMargin: { type: 'number' },
    topMargin: { type: 'number' },
    bottomMargin: { type: 'number' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    showColorLegendAtTop: { type: 'boolean' },
    tooltip: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    refValues: {
      type: 'array',
      items: {
        properties: {
          color: { type: 'string' },
          text: { type: 'string' },
          value: { type: 'number' },
          styles: {
            type: 'object',
            properties: {
              line: { type: 'object' },
              text: { type: 'object' },
            },
          },
          classNames: {
            type: 'object',
            properties: {
              line: { type: 'string' },
              text: { type: 'string' },
            },
          },
        },
        type: 'object',
        required: ['value', 'text'],
      },
    },
    annotations: {
      type: 'array',
      items: {
        properties: {
          color: { type: 'string' },
          text: { type: 'string' },
          xCoordinate: { oneOf: [{ type: 'string' }, { type: 'number' }] },
          yCoordinate: { oneOf: [{ type: 'string' }, { type: 'number' }] },
          xOffset: { type: 'number' },
          yOffset: { type: 'number' },
          align: {
            type: 'string',
            enum: ['center', 'left', 'right'],
          },
          fontWeight: {
            type: 'string',
            enum: ['regular', 'bold', 'medium'],
          },
          showConnector: { oneOf: [{ type: 'boolean' }, { type: 'number' }] },
          connectorRadius: { type: 'number' },
          maxWidth: { type: 'number' },
          styles: {
            type: 'object',
            properties: {
              connector: { type: 'object' },
              text: { type: 'object' },
            },
          },
          classNames: {
            type: 'object',
            properties: {
              connector: { type: 'string' },
              text: { type: 'string' },
            },
          },
        },
        type: 'object',
        required: ['text'],
      },
    },
    customHighlightAreaSettings: {
      type: 'array',
      items: {
        properties: {
          coordinates: {
            type: 'array',
            items: { oneOf: [{ type: 'string' }, { type: 'number' }] },
            minItems: 4,
          },
          color: { type: 'string' },
          strokeWidth: { type: 'number' },
          dashedStroke: { type: 'boolean' },
          closePath: { type: 'boolean' },
        },
        type: 'object',
        required: ['coordinates'],
      },
    },
    highlightAreaSettings: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          coordinates: {
            type: 'array',
            items: { oneOf: [{ type: 'number' }, { type: 'string' }, { type: 'null' }] },
            minItems: 2,
            maxItems: 2,
          },
          style: { type: 'object' },
          className: { type: 'string' },
          color: { type: 'string' },
          strokeWidth: { type: 'number' },
        },
        required: ['coordinates'],
      },
    },
    graphID: { type: 'string' },
    maxValue: { type: 'number' },
    minValue: { type: 'number' },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    language: {
      type: 'string',
      enum: [
        'en',
        'ar',
        'az',
        'bn',
        'cy',
        'he',
        'hi',
        'jp',
        'ka',
        'km',
        'ko',
        'my',
        'ne',
        'zh',
        'custom',
      ],
    },
    theme: {
      type: 'string',
      enum: ['light', 'dark'],
    },
    animate: {
      oneOf: [
        {
          type: 'object',
          properties: {
            duration: {
              type: 'number',
            },
            once: {
              type: 'boolean',
            },
            amount: {
              anyOf: [
                {
                  type: 'string',
                  enum: ['some', 'all'],
                },
                {
                  type: 'number',
                },
              ],
            },
          },
          required: ['duration', 'once', 'amount'],
        },
        { type: 'boolean' },
      ],
    },
    strokeWidth: { type: 'number' },
    showDots: { type: 'boolean' },
    colorLegendTitle: { type: 'string' },
    noOfYTicks: { type: 'number' },
    minDate: { oneOf: [{ type: 'string' }, { type: 'number' }] },
    maxDate: { oneOf: [{ type: 'string' }, { type: 'number' }] },
    yAxisTitle: { type: 'string' },
  },
  required: ['labels'],
};

export const multiLineChartSettingsSchema = {
  type: 'object',
  properties: {
    customLayers: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          position: {
            type: 'string',
            enum: ['before', 'after'],
          },
          layer: {
            type: 'object',
          },
        },
        required: ['layer', 'position'],
      },
    },
    precision: { type: 'number' },
    dimmedOpacity: { type: 'number', minimum: 0, maximum: 1 },
    styles: { type: 'object' },
    classNames: { type: 'object' },
    curveType: {
      type: 'string',
      enum: ['linear', 'curve', 'step', 'stepAfter', 'stepBefore'],
    },
    ariaLabel: { type: 'string' },
    lineColors: {
      type: 'array',
      items: { type: 'string' },
    },
    graphTitle: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    graphDescription: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    footNote: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    width: { type: 'number' },
    height: { type: 'number' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    noOfXTicks: { type: 'number' },
    dateFormat: { type: 'string' },
    suffix: { type: 'string' },
    prefix: { type: 'string' },
    labels: {
      type: 'array',
      items: { oneOf: [{ type: 'string' }, { type: 'number' }] },
      minItems: 1,
    },
    backgroundColor: { oneOf: [{ type: 'string' }, { type: 'boolean' }] },
    padding: { type: 'string' },
    leftMargin: { type: 'number' },
    rightMargin: { type: 'number' },
    topMargin: { type: 'number' },
    bottomMargin: { type: 'number' },
    showValues: { type: 'boolean' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    showColorLegendAtTop: { type: 'boolean' },
    tooltip: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    refValues: {
      type: 'array',
      items: {
        properties: {
          color: { type: 'string' },
          text: { type: 'string' },
          value: { type: 'number' },
          styles: {
            type: 'object',
            properties: {
              line: { type: 'object' },
              text: { type: 'object' },
            },
          },
          classNames: {
            type: 'object',
            properties: {
              line: { type: 'string' },
              text: { type: 'string' },
            },
          },
        },
        type: 'object',
        required: ['value', 'text'],
      },
    },
    annotations: {
      type: 'array',
      items: {
        properties: {
          color: { type: 'string' },
          text: { type: 'string' },
          xCoordinate: { oneOf: [{ type: 'string' }, { type: 'number' }] },
          yCoordinate: { oneOf: [{ type: 'string' }, { type: 'number' }] },
          xOffset: { type: 'number' },
          yOffset: { type: 'number' },
          align: {
            type: 'string',
            enum: ['center', 'left', 'right'],
          },
          fontWeight: {
            type: 'string',
            enum: ['regular', 'bold', 'medium'],
          },
          showConnector: { oneOf: [{ type: 'boolean' }, { type: 'number' }] },
          connectorRadius: { type: 'number' },
          maxWidth: { type: 'number' },
          styles: {
            type: 'object',
            properties: {
              connector: { type: 'object' },
              text: { type: 'object' },
            },
          },
          classNames: {
            type: 'object',
            properties: {
              connector: { type: 'string' },
              text: { type: 'string' },
            },
          },
        },
        type: 'object',
        required: ['text'],
      },
    },
    customHighlightAreaSettings: {
      type: 'array',
      items: {
        properties: {
          coordinates: {
            type: 'array',
            items: { oneOf: [{ type: 'string' }, { type: 'number' }] },
            minItems: 4,
          },
          color: { type: 'string' },
          strokeWidth: { type: 'number' },
          dashedStroke: { type: 'boolean' },
          closePath: { type: 'boolean' },
        },
        type: 'object',
        required: ['coordinates'],
      },
    },
    highlightAreaSettings: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          coordinates: {
            type: 'array',
            items: { oneOf: [{ type: 'number' }, { type: 'string' }, { type: 'null' }] },
            minItems: 2,
            maxItems: 2,
          },
          style: { type: 'object' },
          className: { type: 'string' },
          color: { type: 'string' },
          strokeWidth: { type: 'number' },
        },
        required: ['coordinates'],
      },
    },
    graphID: { type: 'string' },
    maxValue: { type: 'number' },
    minValue: { type: 'number' },
    highlightedLines: {
      type: 'array',
      items: { oneOf: [{ type: 'string' }, { type: 'number' }] },
    },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    language: {
      type: 'string',
      enum: [
        'en',
        'ar',
        'az',
        'bn',
        'cy',
        'he',
        'hi',
        'jp',
        'ka',
        'km',
        'ko',
        'my',
        'ne',
        'zh',
        'custom',
      ],
    },
    theme: {
      type: 'string',
      enum: ['light', 'dark'],
    },
    animate: {
      oneOf: [
        {
          type: 'object',
          properties: {
            duration: {
              type: 'number',
            },
            once: {
              type: 'boolean',
            },
            amount: {
              anyOf: [
                {
                  type: 'string',
                  enum: ['some', 'all'],
                },
                {
                  type: 'number',
                },
              ],
            },
          },
          required: ['duration', 'once', 'amount'],
        },
        { type: 'boolean' },
      ],
    },
    strokeWidth: { type: 'number' },
    showDots: { type: 'boolean' },
    colorLegendTitle: { type: 'string' },
    noOfYTicks: { type: 'number' },
    minDate: { oneOf: [{ type: 'string' }, { type: 'number' }] },
    maxDate: { oneOf: [{ type: 'string' }, { type: 'number' }] },
    yAxisTitle: { type: 'string' },
  },
  required: ['labels'],
};

export const multiLineAltChartSettingsSchema = {
  type: 'object',
  properties: {
    customLayers: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          position: {
            type: 'string',
            enum: ['before', 'after'],
          },
          layer: {
            type: 'object',
          },
        },
        required: ['layer', 'position'],
      },
    },
    precision: { type: 'number' },
    dimmedOpacity: { type: 'number', minimum: 0, maximum: 1 },
    styles: { type: 'object' },
    classNames: { type: 'object' },
    curveType: {
      type: 'string',
      enum: ['linear', 'curve', 'step', 'stepAfter', 'stepBefore'],
    },
    ariaLabel: { type: 'string' },
    colors: { oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }] },
    graphTitle: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    graphDescription: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    footNote: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    width: { type: 'number' },
    height: { type: 'number' },
    showLabels: { type: 'boolean' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    noOfXTicks: { type: 'number' },
    dateFormat: { type: 'string' },
    suffix: { type: 'string' },
    prefix: { type: 'string' },
    backgroundColor: { oneOf: [{ type: 'string' }, { type: 'boolean' }] },
    padding: { type: 'string' },
    leftMargin: { type: 'number' },
    rightMargin: { type: 'number' },
    topMargin: { type: 'number' },
    bottomMargin: { type: 'number' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    tooltip: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    refValues: {
      type: 'array',
      items: {
        properties: {
          color: { type: 'string' },
          text: { type: 'string' },
          value: { type: 'number' },
          styles: {
            type: 'object',
            properties: {
              line: { type: 'object' },
              text: { type: 'object' },
            },
          },
          classNames: {
            type: 'object',
            properties: {
              line: { type: 'string' },
              text: { type: 'string' },
            },
          },
        },
        type: 'object',
        required: ['value', 'text'],
      },
    },
    annotations: {
      type: 'array',
      items: {
        properties: {
          color: { type: 'string' },
          text: { type: 'string' },
          xCoordinate: { oneOf: [{ type: 'string' }, { type: 'number' }] },
          yCoordinate: { oneOf: [{ type: 'string' }, { type: 'number' }] },
          xOffset: { type: 'number' },
          yOffset: { type: 'number' },
          align: {
            type: 'string',
            enum: ['center', 'left', 'right'],
          },
          fontWeight: {
            type: 'string',
            enum: ['regular', 'bold', 'medium'],
          },
          showConnector: { oneOf: [{ type: 'boolean' }, { type: 'number' }] },
          connectorRadius: { type: 'number' },
          maxWidth: { type: 'number' },
          styles: {
            type: 'object',
            properties: {
              connector: { type: 'object' },
              text: { type: 'object' },
            },
          },
          classNames: {
            type: 'object',
            properties: {
              connector: { type: 'string' },
              text: { type: 'string' },
            },
          },
        },
        type: 'object',
        required: ['text'],
      },
    },
    customHighlightAreaSettings: {
      type: 'array',
      items: {
        properties: {
          coordinates: {
            type: 'array',
            items: { oneOf: [{ type: 'string' }, { type: 'number' }] },
            minItems: 4,
          },
          color: { type: 'string' },
          strokeWidth: { type: 'number' },
          dashedStroke: { type: 'boolean' },
          closePath: { type: 'boolean' },
        },
        type: 'object',
        required: ['coordinates'],
      },
    },
    highlightAreaSettings: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          coordinates: {
            type: 'array',
            items: { oneOf: [{ type: 'number' }, { type: 'string' }, { type: 'null' }] },
            minItems: 2,
            maxItems: 2,
          },
          style: { type: 'object' },
          className: { type: 'string' },
          color: { type: 'string' },
          strokeWidth: { type: 'number' },
        },
        required: ['coordinates'],
      },
    },
    graphID: { type: 'string' },
    maxValue: { type: 'number' },
    minValue: { type: 'number' },
    highlightedLines: {
      type: 'array',
      items: { oneOf: [{ type: 'number' }, { type: 'string' }] },
    },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    language: {
      type: 'string',
      enum: [
        'en',
        'ar',
        'az',
        'bn',
        'cy',
        'he',
        'hi',
        'jp',
        'ka',
        'km',
        'ko',
        'my',
        'ne',
        'zh',
        'custom',
      ],
    },
    theme: {
      type: 'string',
      enum: ['light', 'dark'],
    },
    animate: {
      oneOf: [
        {
          type: 'object',
          properties: {
            duration: {
              type: 'number',
            },
            once: {
              type: 'boolean',
            },
            amount: {
              anyOf: [
                {
                  type: 'string',
                  enum: ['some', 'all'],
                },
                {
                  type: 'number',
                },
              ],
            },
          },
          required: ['duration', 'once', 'amount'],
        },
        { type: 'boolean' },
      ],
    },
    strokeWidth: { type: 'number' },
    showDots: { type: 'boolean' },
    colorLegendTitle: { type: 'string' },
    noOfYTicks: { type: 'number' },
    minDate: { oneOf: [{ type: 'string' }, { type: 'number' }] },
    maxDate: { oneOf: [{ type: 'string' }, { type: 'number' }] },
    yAxisTitle: { type: 'string' },
  },
};

export const sparkLineSettingsSchema = {
  type: 'object',
  properties: {
    customLayers: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          position: {
            type: 'string',
            enum: ['before', 'after'],
          },
          layer: {
            type: 'object',
          },
        },
        required: ['layer', 'position'],
      },
    },
    styles: { type: 'object' },
    classNames: { type: 'object' },
    curveType: {
      type: 'string',
      enum: ['linear', 'curve', 'step', 'stepAfter', 'stepBefore'],
    },
    lineColor: { type: 'string' },
    ariaLabel: { type: 'string' },
    graphTitle: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    graphDescription: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    footNote: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    width: { type: 'number' },
    height: { type: 'number' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    dateFormat: { type: 'string' },
    area: { type: 'boolean' },
    backgroundColor: { oneOf: [{ type: 'string' }, { type: 'boolean' }] },
    padding: { type: 'string' },
    leftMargin: { type: 'number' },
    rightMargin: { type: 'number' },
    topMargin: { type: 'number' },
    bottomMargin: { type: 'number' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    tooltip: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    graphID: { type: 'string' },
    maxValue: { type: 'number' },
    minValue: { type: 'number' },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    language: {
      type: 'string',
      enum: [
        'en',
        'ar',
        'az',
        'bn',
        'cy',
        'he',
        'hi',
        'jp',
        'ka',
        'km',
        'ko',
        'my',
        'ne',
        'zh',
        'custom',
      ],
    },
    theme: {
      type: 'string',
      enum: ['light', 'dark'],
    },
  },
};

export const choroplethMapSettingsSchema = {
  type: 'object',
  properties: {
    customLayers: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          position: {
            type: 'string',
            enum: ['before', 'after'],
          },
          layer: {
            type: 'object',
          },
        },
        required: ['layer', 'position'],
      },
    },
    dimmedOpacity: { type: 'number', minimum: 0, maximum: 1 },
    animate: {
      oneOf: [
        {
          type: 'object',
          properties: {
            duration: {
              type: 'number',
            },
            once: {
              type: 'boolean',
            },
            amount: {
              anyOf: [
                {
                  type: 'string',
                  enum: ['some', 'all'],
                },
                {
                  type: 'number',
                },
              ],
            },
          },
          required: ['duration', 'once', 'amount'],
        },
        { type: 'boolean' },
      ],
    },
    styles: { type: 'object' },
    classNames: { type: 'object' },
    detailsOnClick: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    graphTitle: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    ariaLabel: { type: 'string' },
    mapData: { oneOf: [{ type: 'object' }, { type: 'string' }] },
    zoomInteraction: {
      type: 'string',
      enum: ['scroll', 'ctrlScroll', 'button', 'noZoom'],
    },
    mapProjection: {
      enum: ['mercator', 'equalEarth', 'naturalEarth', 'orthographic', 'albersUSA'],
      type: 'string',
    },
    graphDescription: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    footNote: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    width: { type: 'number' },
    height: { type: 'number' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    colorDomain: {
      oneOf: [
        {
          type: 'array',
          items: { type: 'number' },
          minItems: 1,
        },
        {
          type: 'array',
          items: { type: 'string' },
          minItems: 1,
        },
      ],
    },
    colors: {
      type: 'array',
      items: { type: 'string' },
    },
    colorLegendTitle: { type: 'string' },
    scaleType: { type: 'string', enum: ['categorical', 'threshold'] },
    scale: { type: 'number' },
    centerPoint: {
      type: 'array',
      items: { type: 'number' },
      minItems: 2,
      maxItems: 2,
    },
    backgroundColor: { oneOf: [{ type: 'string' }, { type: 'boolean' }] },
    mapBorderWidth: { type: 'number' },
    mapNoDataColor: { type: 'string' },
    mapBorderColor: { type: 'string' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    padding: { type: 'string' },
    isWorldMap: { type: 'boolean' },
    tooltip: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    showColorScale: { type: 'boolean' },
    zoomScaleExtend: {
      type: 'array',
      items: { type: 'number' },
      minItems: 2,
      maxItems: 2,
    },
    zoomTranslateExtend: {
      type: 'array',
      items: {
        type: 'array',
        items: { type: 'number' },
        minItems: 2,
        maxItems: 2,
      },
      minItems: 2,
      maxItems: 2,
    },
    graphID: { type: 'string' },
    highlightedIds: {
      type: 'array',
      items: { type: 'string' },
    },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    mapProperty: { type: 'string' },
    showAntarctica: { type: 'boolean' },
    language: {
      type: 'string',
      enum: [
        'en',
        'ar',
        'az',
        'bn',
        'cy',
        'he',
        'hi',
        'jp',
        'ka',
        'km',
        'ko',
        'my',
        'ne',
        'zh',
        'custom',
      ],
    },
    theme: {
      type: 'string',
      enum: ['light', 'dark'],
    },
    resetSelectionOnDoubleClick: { type: 'boolean' },
  },
};

export const biVariateChoroplethMapSettingsSchema = {
  type: 'object',
  properties: {
    customLayers: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          position: {
            type: 'string',
            enum: ['before', 'after'],
          },
          layer: {
            type: 'object',
          },
        },
        required: ['layer', 'position'],
      },
    },
    dimmedOpacity: { type: 'number', minimum: 0, maximum: 1 },
    animate: {
      oneOf: [
        {
          type: 'object',
          properties: {
            duration: {
              type: 'number',
            },
            once: {
              type: 'boolean',
            },
            amount: {
              anyOf: [
                {
                  type: 'string',
                  enum: ['some', 'all'],
                },
                {
                  type: 'number',
                },
              ],
            },
          },
          required: ['duration', 'once', 'amount'],
        },
        { type: 'boolean' },
      ],
    },
    styles: { type: 'object' },
    classNames: { type: 'object' },
    detailsOnClick: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    ariaLabel: { type: 'string' },
    mapData: { oneOf: [{ type: 'object' }, { type: 'string' }] },
    zoomInteraction: {
      type: 'string',
      enum: ['scroll', 'ctrlScroll', 'button', 'noZoom'],
    },
    mapProjection: {
      enum: ['mercator', 'equalEarth', 'naturalEarth', 'orthographic', 'albersUSA'],
      type: 'string',
    },
    graphTitle: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    graphDescription: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    footNote: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    width: { type: 'number' },
    height: { type: 'number' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    xColorLegendTitle: { type: 'string' },
    yColorLegendTitle: { type: 'string' },
    xDomain: {
      type: 'array',
      items: { type: 'number' },
    },
    yDomain: {
      type: 'array',
      items: { type: 'number' },
    },
    colors: {
      type: 'array',
      items: {
        type: 'array',
        items: { type: 'string' },
      },
    },
    scale: { type: 'number' },
    centerPoint: {
      type: 'array',
      items: { type: 'number' },
      minItems: 2,
      maxItems: 2,
    },
    backgroundColor: { oneOf: [{ type: 'string' }, { type: 'boolean' }] },
    mapBorderWidth: { type: 'number' },
    mapNoDataColor: { type: 'string' },
    padding: { type: 'string' },
    mapBorderColor: { type: 'string' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    tooltip: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    isWorldMap: { type: 'boolean' },
    zoomScaleExtend: {
      type: 'array',
      items: { type: 'number' },
      minItems: 2,
      maxItems: 2,
    },
    zoomTranslateExtend: {
      type: 'array',
      items: {
        type: 'array',
        items: { type: 'number' },
        minItems: 2,
        maxItems: 2,
      },
      minItems: 2,
      maxItems: 2,
    },
    graphID: { type: 'string' },
    highlightedIds: {
      type: 'array',
      items: { type: 'string' },
    },
    mapProperty: { type: 'string' },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    showAntarctica: { type: 'boolean' },
    language: {
      type: 'string',
      enum: [
        'en',
        'ar',
        'az',
        'bn',
        'cy',
        'he',
        'hi',
        'jp',
        'ka',
        'km',
        'ko',
        'my',
        'ne',
        'zh',
        'custom',
      ],
    },
    theme: {
      type: 'string',
      enum: ['light', 'dark'],
    },
    resetSelectionOnDoubleClick: { type: 'boolean' },
  },
};

export const dotDensityMapSettingsSchema = {
  type: 'object',
  properties: {
    customLayers: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          position: {
            type: 'string',
            enum: ['before', 'after'],
          },
          layer: {
            type: 'object',
          },
        },
        required: ['layer', 'position'],
      },
    },
    dimmedOpacity: { type: 'number', minimum: 0, maximum: 1 },
    animate: {
      oneOf: [
        {
          type: 'object',
          properties: {
            duration: {
              type: 'number',
            },
            once: {
              type: 'boolean',
            },
            amount: {
              anyOf: [
                {
                  type: 'string',
                  enum: ['some', 'all'],
                },
                {
                  type: 'number',
                },
              ],
            },
          },
          required: ['duration', 'once', 'amount'],
        },
        { type: 'boolean' },
      ],
    },
    styles: { type: 'object' },
    classNames: { type: 'object' },
    detailsOnClick: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    ariaLabel: { type: 'string' },
    graphTitle: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    mapData: { oneOf: [{ type: 'object' }, { type: 'string' }] },
    zoomInteraction: {
      type: 'string',
      enum: ['scroll', 'ctrlScroll', 'button', 'noZoom'],
    },
    mapProjection: {
      enum: ['mercator', 'equalEarth', 'naturalEarth', 'orthographic', 'albersUSA'],
      type: 'string',
    },
    graphDescription: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    footNote: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    width: { type: 'number' },
    height: { type: 'number' },
    radius: { type: 'number' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    colors: {
      oneOf: [
        { type: 'string' },
        {
          type: 'array',
          items: { type: 'string' },
        },
      ],
    },
    colorDomain: {
      type: 'array',
      items: { type: 'string' },
    },
    colorLegendTitle: { type: 'string' },
    scale: { type: 'number' },
    centerPoint: {
      type: 'array',
      items: { type: 'number' },
      minItems: 2,
      maxItems: 2,
    },
    backgroundColor: { oneOf: [{ type: 'string' }, { type: 'boolean' }] },
    mapBorderWidth: { type: 'number' },
    mapNoDataColor: { type: 'string' },
    mapBorderColor: { type: 'string' },
    padding: { type: 'string' },
    showLabels: { type: 'boolean' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    isWorldMap: { type: 'boolean' },
    tooltip: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    showColorScale: { type: 'boolean' },
    zoomScaleExtend: {
      type: 'array',
      items: { type: 'number' },
      minItems: 2,
      maxItems: 2,
    },
    zoomTranslateExtend: {
      type: 'array',
      items: {
        type: 'array',
        items: { type: 'number' },
        minItems: 2,
        maxItems: 2,
      },
      minItems: 2,
      maxItems: 2,
    },
    graphID: { type: 'string' },
    highlightedDataPoints: {
      type: 'array',
      items: { oneOf: [{ type: 'string' }, { type: 'number' }] },
    },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    showAntarctica: { type: 'boolean' },
    language: {
      type: 'string',
      enum: [
        'en',
        'ar',
        'az',
        'bn',
        'cy',
        'he',
        'hi',
        'jp',
        'ka',
        'km',
        'ko',
        'my',
        'ne',
        'zh',
        'custom',
      ],
    },
    theme: {
      type: 'string',
      enum: ['light', 'dark'],
    },
    resetSelectionOnDoubleClick: { type: 'boolean' },
  },
};

export const animatedChoroplethMapSettingsSchema = {
  type: 'object',
  properties: {
    customLayers: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          position: {
            type: 'string',
            enum: ['before', 'after'],
          },
          layer: {
            type: 'object',
          },
        },
        required: ['layer', 'position'],
      },
    },
    dimmedOpacity: { type: 'number', minimum: 0, maximum: 1 },
    styles: { type: 'object' },
    classNames: { type: 'object' },
    detailsOnClick: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    ariaLabel: { type: 'string' },
    graphTitle: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    mapData: { oneOf: [{ type: 'object' }, { type: 'string' }] },
    zoomInteraction: {
      type: 'string',
      enum: ['scroll', 'ctrlScroll', 'button', 'noZoom'],
    },
    mapProjection: {
      enum: ['mercator', 'equalEarth', 'naturalEarth', 'orthographic', 'albersUSA'],
      type: 'string',
    },
    graphDescription: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    footNote: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    width: { type: 'number' },
    height: { type: 'number' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    colorDomain: {
      oneOf: [
        {
          type: 'array',
          items: { type: 'number' },
          minItems: 1,
        },
        {
          type: 'array',
          items: { type: 'string' },
          minItems: 1,
        },
      ],
    },
    colors: {
      type: 'array',
      items: { type: 'string' },
    },
    colorLegendTitle: { type: 'string' },
    scaleType: { type: 'string', enum: ['categorical', 'threshold'] },
    scale: { type: 'number' },
    centerPoint: {
      type: 'array',
      items: { type: 'number' },
      minItems: 2,
      maxItems: 2,
    },
    backgroundColor: { oneOf: [{ type: 'string' }, { type: 'boolean' }] },
    mapBorderWidth: { type: 'number' },
    mapNoDataColor: { type: 'string' },
    mapBorderColor: { type: 'string' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    padding: { type: 'string' },
    isWorldMap: { type: 'boolean' },
    tooltip: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    showColorScale: { type: 'boolean' },
    zoomScaleExtend: {
      type: 'array',
      items: { type: 'number' },
      minItems: 2,
      maxItems: 2,
    },
    zoomTranslateExtend: {
      type: 'array',
      items: {
        type: 'array',
        items: { type: 'number' },
        minItems: 2,
        maxItems: 2,
      },
      minItems: 2,
      maxItems: 2,
    },
    graphID: { type: 'string' },
    highlightedIds: {
      type: 'array',
      items: { type: 'string' },
    },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    mapProperty: { type: 'string' },
    showAntarctica: { type: 'boolean' },
    language: {
      type: 'string',
      enum: [
        'en',
        'ar',
        'az',
        'bn',
        'cy',
        'he',
        'hi',
        'jp',
        'ka',
        'km',
        'ko',
        'my',
        'ne',
        'zh',
        'custom',
      ],
    },
    autoPlay: { type: 'boolean' },
    showOnlyActiveDate: { type: 'boolean' },
    dateFormat: { type: 'string' },
    theme: {
      type: 'string',
      enum: ['light', 'dark'],
    },
    resetSelectionOnDoubleClick: { type: 'boolean' },
  },
};

export const animatedBiVariateChoroplethMapSettingsSchema = {
  type: 'object',
  properties: {
    customLayers: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          position: {
            type: 'string',
            enum: ['before', 'after'],
          },
          layer: {
            type: 'object',
          },
        },
        required: ['layer', 'position'],
      },
    },
    dimmedOpacity: { type: 'number', minimum: 0, maximum: 1 },
    styles: { type: 'object' },
    classNames: { type: 'object' },
    detailsOnClick: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    mapData: { oneOf: [{ type: 'object' }, { type: 'string' }] },
    zoomInteraction: {
      type: 'string',
      enum: ['scroll', 'ctrlScroll', 'button', 'noZoom'],
    },
    mapProjection: {
      enum: ['mercator', 'equalEarth', 'naturalEarth', 'orthographic', 'albersUSA'],
      type: 'string',
    },
    ariaLabel: { type: 'string' },
    graphTitle: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    graphDescription: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    footNote: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    width: { type: 'number' },
    height: { type: 'number' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    xColorLegendTitle: { type: 'string' },
    yColorLegendTitle: { type: 'string' },
    xDomain: {
      type: 'array',
      items: { type: 'number' },
    },
    yDomain: {
      type: 'array',
      items: { type: 'number' },
    },
    colors: {
      type: 'array',
      items: {
        type: 'array',
        items: { type: 'string' },
      },
    },
    scale: { type: 'number' },
    centerPoint: {
      type: 'array',
      items: { type: 'number' },
      minItems: 2,
      maxItems: 2,
    },
    backgroundColor: { oneOf: [{ type: 'string' }, { type: 'boolean' }] },
    mapBorderWidth: { type: 'number' },
    mapNoDataColor: { type: 'string' },
    padding: { type: 'string' },
    mapBorderColor: { type: 'string' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    tooltip: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    isWorldMap: { type: 'boolean' },
    zoomScaleExtend: {
      type: 'array',
      items: { type: 'number' },
      minItems: 2,
      maxItems: 2,
    },
    zoomTranslateExtend: {
      type: 'array',
      items: {
        type: 'array',
        items: { type: 'number' },
        minItems: 2,
        maxItems: 2,
      },
      minItems: 2,
      maxItems: 2,
    },
    graphID: { type: 'string' },
    highlightedIds: {
      type: 'array',
      items: { type: 'string' },
    },
    mapProperty: { type: 'string' },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    showAntarctica: { type: 'boolean' },
    language: {
      type: 'string',
      enum: [
        'en',
        'ar',
        'az',
        'bn',
        'cy',
        'he',
        'hi',
        'jp',
        'ka',
        'km',
        'ko',
        'my',
        'ne',
        'zh',
        'custom',
      ],
    },
    autoPlay: { type: 'boolean' },
    showOnlyActiveDate: { type: 'boolean' },
    dateFormat: { type: 'string' },
    theme: {
      type: 'string',
      enum: ['light', 'dark'],
    },
    resetSelectionOnDoubleClick: { type: 'boolean' },
  },
};

export const animatedDotDensityMapSettingsSchema = {
  type: 'object',
  properties: {
    customLayers: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          position: {
            type: 'string',
            enum: ['before', 'after'],
          },
          layer: {
            type: 'object',
          },
        },
        required: ['layer', 'position'],
      },
    },
    dimmedOpacity: { type: 'number', minimum: 0, maximum: 1 },
    styles: { type: 'object' },
    classNames: { type: 'object' },
    detailsOnClick: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    graphTitle: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    ariaLabel: { type: 'string' },
    mapData: { oneOf: [{ type: 'object' }, { type: 'string' }] },
    zoomInteraction: {
      type: 'string',
      enum: ['scroll', 'ctrlScroll', 'button', 'noZoom'],
    },
    mapProjection: {
      enum: ['mercator', 'equalEarth', 'naturalEarth', 'orthographic', 'albersUSA'],
      type: 'string',
    },
    graphDescription: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    footNote: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    width: { type: 'number' },
    height: { type: 'number' },
    radius: { type: 'number' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    colors: {
      oneOf: [
        { type: 'string' },
        {
          type: 'array',
          items: { type: 'string' },
        },
      ],
    },
    colorDomain: {
      type: 'array',
      items: { type: 'string' },
    },
    colorLegendTitle: { type: 'string' },
    scale: { type: 'number' },
    centerPoint: {
      type: 'array',
      items: { type: 'number' },
      minItems: 2,
      maxItems: 2,
    },
    backgroundColor: { oneOf: [{ type: 'string' }, { type: 'boolean' }] },
    mapBorderWidth: { type: 'number' },
    mapNoDataColor: { type: 'string' },
    mapBorderColor: { type: 'string' },
    padding: { type: 'string' },
    showLabels: { type: 'boolean' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    isWorldMap: { type: 'boolean' },
    tooltip: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    showColorScale: { type: 'boolean' },
    zoomScaleExtend: {
      type: 'array',
      items: { type: 'number' },
      minItems: 2,
      maxItems: 2,
    },
    zoomTranslateExtend: {
      type: 'array',
      items: {
        type: 'array',
        items: { type: 'number' },
        minItems: 2,
        maxItems: 2,
      },
      minItems: 2,
      maxItems: 2,
    },
    graphID: { type: 'string' },
    highlightedDataPoints: {
      type: 'array',
      items: { oneOf: [{ type: 'string' }, { type: 'number' }] },
    },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    showAntarctica: { type: 'boolean' },
    language: {
      type: 'string',
      enum: [
        'en',
        'ar',
        'az',
        'bn',
        'cy',
        'he',
        'hi',
        'jp',
        'ka',
        'km',
        'ko',
        'my',
        'ne',
        'zh',
        'custom',
      ],
    },
    theme: {
      type: 'string',
      enum: ['light', 'dark'],
    },
    autoPlay: { type: 'boolean' },
    showOnlyActiveDate: { type: 'boolean' },
    dateFormat: { type: 'string' },
    resetSelectionOnDoubleClick: { type: 'boolean' },
  },
};

export const geoHubCompareMapSettingsSchema = {
  type: 'object',
  properties: {
    styles: { type: 'object' },
    classNames: { type: 'object' },
    graphTitle: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    ariaLabel: { type: 'string' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    graphDescription: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    footNote: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    backgroundColor: { oneOf: [{ type: 'string' }, { type: 'boolean' }] },
    padding: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    graphID: { type: 'string' },
    mapStyles: {
      type: 'array',
      items: { type: 'string' },
      minItems: 2,
      maxItems: 2,
    },
    mapLegend: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    center: {
      type: 'array',
      items: { type: 'number' },
      minItems: 2,
      maxItems: 2,
    },
    zoomLevel: { type: 'number' },
    language: {
      type: 'string',
      enum: [
        'en',
        'ar',
        'az',
        'bn',
        'cy',
        'he',
        'hi',
        'jp',
        'ka',
        'km',
        'ko',
        'my',
        'ne',
        'zh',
        'custom',
      ],
    },
    theme: {
      type: 'string',
      enum: ['light', 'dark'],
    },
  },
  required: ['mapStyles'],
};

export const geoHubMapSettingsSchema = {
  type: 'object',
  properties: {
    styles: { type: 'object' },
    classNames: { type: 'object' },
    mapStyle: {
      oneOf: [
        { type: 'string' },
        {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              style: { type: 'string' },
            },
            required: ['name', 'style'],
          },
          minItems: 1,
        },
      ],
    },
    mapLegend: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    center: {
      type: 'array',
      items: { type: 'number' },
      minItems: 2,
      maxItems: 2,
    },
    ariaLabel: { type: 'string' },
    zoomLevel: { type: 'number' },
    graphTitle: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    graphDescription: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    footNote: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    backgroundColor: { oneOf: [{ type: 'string' }, { type: 'boolean' }] },
    padding: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    graphID: { type: 'string' },
    language: {
      type: 'string',
      enum: [
        'en',
        'ar',
        'az',
        'bn',
        'cy',
        'he',
        'hi',
        'jp',
        'ka',
        'km',
        'ko',
        'my',
        'ne',
        'zh',
        'custom',
      ],
    },
    theme: {
      type: 'string',
      enum: ['light', 'dark'],
    },
    uiMode: {
      type: 'string',
      enum: ['light', 'normal'],
    },
    includeLayers: {
      type: 'array',
      items: { type: 'string' },
    },
    excludeLayers: {
      type: 'array',
      items: { type: 'string' },
    },
  },
  required: ['mapStyle'],
};

export const geoHubMapWithLayerSelectionSettingsSchema = {
  type: 'object',
  properties: {
    styles: { type: 'object' },
    classNames: { type: 'object' },
    mapStyle: { type: 'string' },
    mapLegend: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    center: {
      type: 'array',
      items: { type: 'number' },
      minItems: 2,
      maxItems: 2,
    },
    zoomLevel: { type: 'number' },
    graphTitle: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    ariaLabel: { type: 'string' },
    graphDescription: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    footNote: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    backgroundColor: { oneOf: [{ type: 'string' }, { type: 'boolean' }] },
    padding: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    graphID: { type: 'string' },
    language: {
      type: 'string',
      enum: [
        'en',
        'ar',
        'az',
        'bn',
        'cy',
        'he',
        'hi',
        'jp',
        'ka',
        'km',
        'ko',
        'my',
        'ne',
        'zh',
        'custom',
      ],
    },
    theme: {
      type: 'string',
      enum: ['light', 'dark'],
    },
    uiMode: {
      type: 'string',
      enum: ['light', 'normal'],
    },
    layerSelection: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          layerID: { type: 'array', items: { type: 'string' }, minItems: 1 },
        },
        required: ['name', 'layerID'],
      },
      minItems: 1,
    },
    excludeLayers: {
      type: 'array',
      items: { type: 'string' },
    },
  },
  required: ['mapStyle', 'layerSelection'],
};

export const paretoChartSettingsSchema = {
  type: 'object',
  properties: {
    customLayers: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          position: {
            type: 'string',
            enum: ['before', 'after'],
          },
          layer: {
            type: 'object',
          },
        },
        required: ['layer', 'position'],
      },
    },
    precision: { type: 'number' },
    animate: {
      oneOf: [
        {
          type: 'object',
          properties: {
            duration: {
              type: 'number',
            },
            once: {
              type: 'boolean',
            },
            amount: {
              anyOf: [
                {
                  type: 'string',
                  enum: ['some', 'all'],
                },
                {
                  type: 'number',
                },
              ],
            },
          },
          required: ['duration', 'once', 'amount'],
        },
        { type: 'boolean' },
      ],
    },
    styles: { type: 'object' },
    classNames: { type: 'object' },
    detailsOnClick: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    curveType: {
      type: 'string',
      enum: ['linear', 'curve', 'step', 'stepAfter', 'stepBefore'],
    },
    showValues: { type: 'boolean' },
    graphTitle: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    ariaLabel: { type: 'string' },
    graphDescription: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    barTitle: { type: 'string' },
    lineTitle: { type: 'string' },
    footNote: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    width: { type: 'number' },
    height: { type: 'number' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    backgroundColor: { oneOf: [{ type: 'string' }, { type: 'boolean' }] },
    padding: { type: 'string' },
    leftMargin: { type: 'number' },
    rightMargin: { type: 'number' },
    topMargin: { type: 'number' },
    bottomMargin: { type: 'number' },
    barColor: { type: 'string' },
    lineColor: { type: 'string' },
    sameAxes: { type: 'boolean' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    tooltip: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    graphID: { type: 'string' },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    barPadding: { type: 'number' },
    truncateBy: { type: 'number' },
    showLabels: { type: 'boolean' },
    language: {
      type: 'string',
      enum: [
        'en',
        'ar',
        'az',
        'bn',
        'cy',
        'he',
        'hi',
        'jp',
        'ka',
        'km',
        'ko',
        'my',
        'ne',
        'zh',
        'custom',
      ],
    },
    theme: {
      type: 'string',
      enum: ['light', 'dark'],
    },
    noOfTicks: { type: 'number' },
    lineSuffix: { type: 'string' },
    barSuffix: { type: 'string' },
    linePrefix: { type: 'string' },
    barPrefix: { type: 'string' },
    resetSelectionOnDoubleClick: { type: 'boolean' },
  },
};

export const scatterPlotSettingsSchema = {
  type: 'object',
  properties: {
    customLayers: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          position: {
            type: 'string',
            enum: ['before', 'after'],
          },
          layer: {
            type: 'object',
          },
        },
        required: ['layer', 'position'],
      },
    },
    precision: { type: 'number' },
    dimmedOpacity: { type: 'number', minimum: 0, maximum: 1 },
    animate: {
      oneOf: [
        {
          type: 'object',
          properties: {
            duration: {
              type: 'number',
            },
            once: {
              type: 'boolean',
            },
            amount: {
              anyOf: [
                {
                  type: 'string',
                  enum: ['some', 'all'],
                },
                {
                  type: 'number',
                },
              ],
            },
          },
          required: ['duration', 'once', 'amount'],
        },
        { type: 'boolean' },
      ],
    },
    styles: { type: 'object' },
    classNames: { type: 'object' },
    detailsOnClick: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    graphTitle: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    ariaLabel: { type: 'string' },
    regressionLine: { oneOf: [{ type: 'string' }, { type: 'boolean' }] },
    graphDescription: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    footNote: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    width: { type: 'number' },
    height: { type: 'number' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    showLabels: { type: 'boolean' },
    colors: {
      oneOf: [
        { type: 'string' },
        {
          type: 'array',
          items: { type: 'string' },
        },
      ],
    },
    colorDomain: {
      type: 'array',
      items: { type: 'string' },
    },
    colorLegendTitle: { type: 'string' },
    radius: { type: 'number' },
    xAxisTitle: { type: 'string' },
    yAxisTitle: { type: 'string' },
    backgroundColor: { oneOf: [{ type: 'string' }, { type: 'boolean' }] },
    padding: { type: 'string' },
    leftMargin: { type: 'number' },
    rightMargin: { type: 'number' },
    topMargin: { type: 'number' },
    bottomMargin: { type: 'number' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    tooltip: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    refXValues: {
      type: 'array',
      items: {
        properties: {
          color: { type: 'string' },
          text: { type: 'string' },
          value: { type: 'number' },
          styles: {
            type: 'object',
            properties: {
              line: { type: 'object' },
              text: { type: 'object' },
            },
          },
          classNames: {
            type: 'object',
            properties: {
              line: { type: 'string' },
              text: { type: 'string' },
            },
          },
        },
        type: 'object',
        required: ['value', 'text'],
      },
    },
    refYValues: {
      type: 'array',
      items: {
        properties: {
          color: { type: 'string' },
          text: { type: 'string' },
          value: { type: 'number' },
          styles: {
            type: 'object',
            properties: {
              line: { type: 'object' },
              text: { type: 'object' },
            },
          },
          classNames: {
            type: 'object',
            properties: {
              line: { type: 'string' },
              text: { type: 'string' },
            },
          },
        },
        type: 'object',
        required: ['value', 'text'],
      },
    },
    annotations: {
      type: 'array',
      items: {
        properties: {
          color: { type: 'string' },
          text: { type: 'string' },
          xCoordinate: { oneOf: [{ type: 'string' }, { type: 'number' }] },
          yCoordinate: { oneOf: [{ type: 'string' }, { type: 'number' }] },
          xOffset: { type: 'number' },
          yOffset: { type: 'number' },
          align: {
            type: 'string',
            enum: ['center', 'left', 'right'],
          },
          fontWeight: {
            type: 'string',
            enum: ['regular', 'bold', 'medium'],
          },
          showConnector: { oneOf: [{ type: 'boolean' }, { type: 'number' }] },
          connectorRadius: { type: 'number' },
          maxWidth: { type: 'number' },
          styles: {
            type: 'object',
            properties: {
              connector: { type: 'object' },
              text: { type: 'object' },
            },
          },
          classNames: {
            type: 'object',
            properties: {
              connector: { type: 'string' },
              text: { type: 'string' },
            },
          },
        },
        type: 'object',
        required: ['text'],
      },
    },
    highlightedDataPoints: {
      type: 'array',
      items: { oneOf: [{ type: 'string' }, { type: 'number' }] },
    },
    highlightAreaSettings: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          coordinates: {
            type: 'array',
            items: { oneOf: [{ type: 'number' }, { type: 'null' }] },
            minItems: 4,
            maxItems: 4,
          },
          style: { type: 'object' },
          className: { type: 'string' },
          color: { type: 'string' },
          strokeWidth: { type: 'number' },
        },
        required: ['coordinates'],
      },
    },
    showColorScale: { type: 'boolean' },
    graphID: { type: 'string' },
    maxRadiusValue: { type: 'number' },
    maxXValue: { type: 'number' },
    minXValue: { type: 'number' },
    maxYValue: { type: 'number' },
    minYValue: { type: 'number' },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    showNAColor: { type: 'boolean' },
    language: {
      type: 'string',
      enum: [
        'en',
        'ar',
        'az',
        'bn',
        'cy',
        'he',
        'hi',
        'jp',
        'ka',
        'km',
        'ko',
        'my',
        'ne',
        'zh',
        'custom',
      ],
    },
    theme: {
      type: 'string',
      enum: ['light', 'dark'],
    },
    customHighlightAreaSettings: {
      type: 'array',
      items: {
        properties: {
          coordinates: {
            type: 'array',
            items: { type: 'number' },
            minItems: 4,
          },
          color: { type: 'string' },
          strokeWidth: { type: 'number' },
          dashedStroke: { type: 'boolean' },
          closePath: { type: 'boolean' },
        },
        type: 'object',
        required: ['coordinates'],
      },
    },
    noOfXTicks: { type: 'number' },
    noOfYTicks: { type: 'number' },
    labelColor: { type: 'string' },
    xSuffix: { type: 'string' },
    ySuffix: { type: 'string' },
    xPrefix: { type: 'string' },
    yPrefix: { type: 'string' },
    resetSelectionOnDoubleClick: { type: 'boolean' },
  },
};

export const animatedScatterPlotSettingsSchema = {
  type: 'object',
  properties: {
    customLayers: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          position: {
            type: 'string',
            enum: ['before', 'after'],
          },
          layer: {
            type: 'object',
          },
        },
        required: ['layer', 'position'],
      },
    },
    precision: { type: 'number' },
    dimmedOpacity: { type: 'number', minimum: 0, maximum: 1 },
    styles: { type: 'object' },
    classNames: { type: 'object' },
    detailsOnClick: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    graphTitle: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    ariaLabel: { type: 'string' },
    graphDescription: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    footNote: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    width: { type: 'number' },
    height: { type: 'number' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    showLabels: { type: 'boolean' },
    colors: {
      oneOf: [
        { type: 'string' },
        {
          type: 'array',
          items: { type: 'string' },
        },
      ],
    },
    colorDomain: {
      type: 'array',
      items: { type: 'string' },
    },
    colorLegendTitle: { type: 'string' },
    radius: { type: 'number' },
    xAxisTitle: { type: 'string' },
    yAxisTitle: { type: 'string' },
    backgroundColor: { oneOf: [{ type: 'string' }, { type: 'boolean' }] },
    padding: { type: 'string' },
    leftMargin: { type: 'number' },
    rightMargin: { type: 'number' },
    topMargin: { type: 'number' },
    bottomMargin: { type: 'number' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    tooltip: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    refXValues: {
      type: 'array',
      items: {
        properties: {
          color: { type: 'string' },
          text: { type: 'string' },
          value: { type: 'number' },
          styles: {
            type: 'object',
            properties: {
              line: { type: 'object' },
              text: { type: 'object' },
            },
          },
          classNames: {
            type: 'object',
            properties: {
              line: { type: 'string' },
              text: { type: 'string' },
            },
          },
        },
        type: 'object',
        required: ['value', 'text'],
      },
    },
    refYValues: {
      type: 'array',
      items: {
        properties: {
          color: { type: 'string' },
          text: { type: 'string' },
          value: { type: 'number' },
          styles: {
            type: 'object',
            properties: {
              line: { type: 'object' },
              text: { type: 'object' },
            },
          },
          classNames: {
            type: 'object',
            properties: {
              line: { type: 'string' },
              text: { type: 'string' },
            },
          },
        },
        type: 'object',
        required: ['value', 'text'],
      },
    },
    annotations: {
      type: 'array',
      items: {
        properties: {
          color: { type: 'string' },
          text: { type: 'string' },
          xCoordinate: { oneOf: [{ type: 'string' }, { type: 'number' }] },
          yCoordinate: { oneOf: [{ type: 'string' }, { type: 'number' }] },
          xOffset: { type: 'number' },
          yOffset: { type: 'number' },
          align: {
            type: 'string',
            enum: ['center', 'left', 'right'],
          },
          fontWeight: {
            type: 'string',
            enum: ['regular', 'bold', 'medium'],
          },
          showConnector: { oneOf: [{ type: 'boolean' }, { type: 'number' }] },
          connectorRadius: { type: 'number' },
          maxWidth: { type: 'number' },
          styles: {
            type: 'object',
            properties: {
              connector: { type: 'object' },
              text: { type: 'object' },
            },
          },
          classNames: {
            type: 'object',
            properties: {
              connector: { type: 'string' },
              text: { type: 'string' },
            },
          },
        },
        type: 'object',
        required: ['text'],
      },
    },
    highlightedDataPoints: {
      type: 'array',
      items: { oneOf: [{ type: 'string' }, { type: 'number' }] },
    },
    highlightAreaSettings: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          coordinates: {
            type: 'array',
            items: { oneOf: [{ type: 'number' }, { type: 'null' }] },
            minItems: 4,
            maxItems: 4,
          },
          style: { type: 'object' },
          className: { type: 'string' },
          color: { type: 'string' },
          strokeWidth: { type: 'number' },
        },
        required: ['coordinates'],
      },
    },
    showColorScale: { type: 'boolean' },
    graphID: { type: 'string' },
    maxRadiusValue: { type: 'number' },
    maxXValue: { type: 'number' },
    minXValue: { type: 'number' },
    maxYValue: { type: 'number' },
    minYValue: { type: 'number' },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    showNAColor: { type: 'boolean' },
    language: {
      type: 'string',
      enum: [
        'en',
        'ar',
        'az',
        'bn',
        'cy',
        'he',
        'hi',
        'jp',
        'ka',
        'km',
        'ko',
        'my',
        'ne',
        'zh',
        'custom',
      ],
    },
    theme: {
      type: 'string',
      enum: ['light', 'dark'],
    },
    autoPlay: { type: 'boolean' },
    showOnlyActiveDate: { type: 'boolean' },
    dateFormat: { type: 'string' },
    customHighlightAreaSettings: {
      type: 'array',
      items: {
        properties: {
          coordinates: {
            type: 'array',
            items: { type: 'number' },
            minItems: 4,
          },
          color: { type: 'string' },
          strokeWidth: { type: 'number' },
          dashedStroke: { type: 'boolean' },
          closePath: { type: 'boolean' },
        },
        type: 'object',
        required: ['coordinates'],
      },
    },
    noOfXTicks: { type: 'number' },
    noOfYTicks: { type: 'number' },
    labelColor: { type: 'string' },
    xSuffix: { type: 'string' },
    ySuffix: { type: 'string' },
    xPrefix: { type: 'string' },
    yPrefix: { type: 'string' },
    resetSelectionOnDoubleClick: { type: 'boolean' },
  },
};

export const slopeChartSettingsSchema = {
  type: 'object',
  properties: {
    customLayers: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          position: {
            type: 'string',
            enum: ['before', 'after'],
          },
          layer: {
            type: 'object',
          },
        },
        required: ['layer', 'position'],
      },
    },
    dimmedOpacity: { type: 'number', minimum: 0, maximum: 1 },
    animate: {
      oneOf: [
        {
          type: 'object',
          properties: {
            duration: {
              type: 'number',
            },
            once: {
              type: 'boolean',
            },
            amount: {
              anyOf: [
                {
                  type: 'string',
                  enum: ['some', 'all'],
                },
                {
                  type: 'number',
                },
              ],
            },
          },
          required: ['duration', 'once', 'amount'],
        },
        { type: 'boolean' },
      ],
    },
    styles: { type: 'object' },
    classNames: { type: 'object' },
    detailsOnClick: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    graphTitle: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    ariaLabel: { type: 'string' },
    graphDescription: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    footNote: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    width: { type: 'number' },
    height: { type: 'number' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    showLabels: { type: 'boolean' },
    colors: {
      oneOf: [
        { type: 'string' },
        {
          type: 'array',
          items: { type: 'string' },
        },
      ],
    },
    colorDomain: {
      type: 'array',
      items: { type: 'string' },
    },
    colorLegendTitle: { type: 'string' },
    radius: { type: 'number' },
    axisTitles: {
      type: 'array',
      items: { type: 'string' },
      minItems: 2,
      maxItems: 2,
    },
    backgroundColor: { oneOf: [{ type: 'string' }, { type: 'boolean' }] },
    padding: { type: 'string' },
    leftMargin: { type: 'number' },
    rightMargin: { type: 'number' },
    topMargin: { type: 'number' },
    bottomMargin: { type: 'number' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    tooltip: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    highlightedDataPoints: {
      type: 'array',
      items: { oneOf: [{ type: 'string' }, { type: 'number' }] },
    },
    showColorScale: { type: 'boolean' },
    graphID: { type: 'string' },
    maxValue: { type: 'number' },
    minValue: { type: 'number' },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    fillContainer: { type: 'boolean' },
    language: {
      type: 'string',
      enum: [
        'en',
        'ar',
        'az',
        'bn',
        'cy',
        'he',
        'hi',
        'jp',
        'ka',
        'km',
        'ko',
        'my',
        'ne',
        'zh',
        'custom',
      ],
    },
    theme: {
      type: 'string',
      enum: ['light', 'dark'],
    },
    resetSelectionOnDoubleClick: { type: 'boolean' },
  },
};

export const stackedAreaChartSettingsSchema = {
  type: 'object',
  properties: {
    customLayers: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          position: {
            type: 'string',
            enum: ['before', 'after'],
          },
          layer: {
            type: 'object',
          },
        },
        required: ['layer', 'position'],
      },
    },
    precision: { type: 'number' },
    styles: { type: 'object' },
    classNames: { type: 'object' },
    colors: {
      type: 'array',
      items: { type: 'string' },
      minItems: 0,
    },
    curveType: {
      type: 'string',
      enum: ['linear', 'curve', 'step', 'stepAfter', 'stepBefore'],
    },
    ariaLabel: { type: 'string' },
    graphTitle: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    graphDescription: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    footNote: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    width: { type: 'number' },
    height: { type: 'number' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    noOfXTicks: { type: 'number' },
    dateFormat: { type: 'string' },
    colorDomain: {
      type: 'array',
      items: { type: 'string' },
      minItems: 1,
    },
    backgroundColor: { oneOf: [{ type: 'string' }, { type: 'boolean' }] },
    padding: { type: 'string' },
    colorLegendTitle: { type: 'string' },
    leftMargin: { type: 'number' },
    rightMargin: { type: 'number' },
    topMargin: { type: 'number' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    bottomMargin: { type: 'number' },
    tooltip: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    refValues: {
      type: 'array',
      items: {
        properties: {
          color: { type: 'string' },
          text: { type: 'string' },
          value: { type: 'number' },
          styles: {
            type: 'object',
            properties: {
              line: { type: 'object' },
              text: { type: 'object' },
            },
          },
          classNames: {
            type: 'object',
            properties: {
              line: { type: 'string' },
              text: { type: 'string' },
            },
          },
        },
        type: 'object',
        required: ['value', 'text'],
      },
    },
    annotations: {
      type: 'array',
      items: {
        properties: {
          color: { type: 'string' },
          text: { type: 'string' },
          xCoordinate: { oneOf: [{ type: 'string' }, { type: 'number' }] },
          yCoordinate: { oneOf: [{ type: 'string' }, { type: 'number' }] },
          xOffset: { type: 'number' },
          yOffset: { type: 'number' },
          align: {
            type: 'string',
            enum: ['center', 'left', 'right'],
          },
          fontWeight: {
            type: 'string',
            enum: ['regular', 'bold', 'medium'],
          },
          showConnector: { oneOf: [{ type: 'boolean' }, { type: 'number' }] },
          connectorRadius: { type: 'number' },
          maxWidth: { type: 'number' },
          styles: {
            type: 'object',
            properties: {
              connector: { type: 'object' },
              text: { type: 'object' },
            },
          },
          classNames: {
            type: 'object',
            properties: {
              connector: { type: 'string' },
              text: { type: 'string' },
            },
          },
        },
        type: 'object',
        required: ['text'],
      },
    },
    customHighlightAreaSettings: {
      type: 'array',
      items: {
        properties: {
          coordinates: {
            type: 'array',
            items: { oneOf: [{ type: 'string' }, { type: 'number' }] },
            minItems: 4,
          },
          color: { type: 'string' },
          strokeWidth: { type: 'number' },
          dashedStroke: { type: 'boolean' },
          closePath: { type: 'boolean' },
        },
        type: 'object',
        required: ['coordinates'],
      },
    },
    highlightAreaSettings: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          coordinates: {
            type: 'array',
            items: { oneOf: [{ type: 'number' }, { type: 'string' }, { type: 'null' }] },
            minItems: 2,
            maxItems: 2,
          },
          style: { type: 'object' },
          className: { type: 'string' },
          color: { type: 'string' },
          strokeWidth: { type: 'number' },
        },
        required: ['coordinates'],
      },
    },
    graphID: { type: 'string' },
    maxValue: { type: 'number' },
    minValue: { type: 'number' },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    showColorScale: { type: 'boolean' },
    language: {
      type: 'string',
      enum: [
        'en',
        'ar',
        'az',
        'bn',
        'cy',
        'he',
        'hi',
        'jp',
        'ka',
        'km',
        'ko',
        'my',
        'ne',
        'zh',
        'custom',
      ],
    },
    theme: {
      type: 'string',
      enum: ['light', 'dark'],
    },
    yAxisTitle: { type: 'string' },
    noOfYTicks: { type: 'number' },
    prefix: { type: 'string' },
    suffix: { type: 'string' },
  },
  required: ['colorDomain'],
};

export const statCardSettingsSchema = {
  type: 'object',
  properties: {
    precision: { type: 'number' },
    styles: { type: 'object' },
    classNames: { type: 'object' },
    year: { oneOf: [{ type: 'number' }, { type: 'string' }] },
    ariaLabel: { type: 'string' },
    textBackground: { type: 'boolean' },
    centerAlign: { type: 'boolean' },
    verticalAlign: {
      type: 'string',
      enum: ['center', 'top', 'bottom'],
    },
    layout: {
      type: 'string',
      enum: ['primary', 'secondary'],
    },
    headingFontSize: { type: 'string' },
    graphTitle: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    graphDescription: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    suffix: { type: 'string' },
    prefix: { type: 'string' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    footNote: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    backgroundColor: { oneOf: [{ type: 'string' }, { type: 'boolean' }] },
    padding: { type: 'string' },
    graphID: { type: 'string' },
    aggregationMethod: {
      type: 'string',
      enum: ['count', 'max', 'min', 'average', 'sum'],
    },
    language: {
      type: 'string',
      enum: [
        'en',
        'ar',
        'az',
        'bn',
        'cy',
        'he',
        'hi',
        'jp',
        'ka',
        'km',
        'ko',
        'my',
        'ne',
        'zh',
        'custom',
      ],
    },
    theme: {
      type: 'string',
      enum: ['light', 'dark'],
    },
    countOnly: {
      type: 'array',
      items: { oneOf: [{ type: 'string' }, { type: 'number' }] },
    },
  },
};

export const stripChartSettingsSchema = {
  type: 'object',
  properties: {
    customLayers: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          position: {
            type: 'string',
            enum: ['before', 'after'],
          },
          layer: {
            type: 'object',
          },
        },
        required: ['layer', 'position'],
      },
    },
    precision: { type: 'number' },
    dimmedOpacity: { type: 'number', minimum: 0, maximum: 1 },
    animate: {
      oneOf: [
        {
          type: 'object',
          properties: {
            duration: {
              type: 'number',
            },
            once: {
              type: 'boolean',
            },
            amount: {
              anyOf: [
                {
                  type: 'string',
                  enum: ['some', 'all'],
                },
                {
                  type: 'number',
                },
              ],
            },
          },
          required: ['duration', 'once', 'amount'],
        },
        { type: 'boolean' },
      ],
    },
    styles: { type: 'object' },
    classNames: { type: 'object' },
    detailsOnClick: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    graphTitle: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    valueColor: { type: 'string' },
    ariaLabel: { type: 'string' },
    graphDescription: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    footNote: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    width: { type: 'number' },
    height: { type: 'number' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    stripType: {
      type: 'string',
      enum: ['strip', 'dot'],
    },
    colors: {
      oneOf: [
        { type: 'string' },
        {
          type: 'array',
          items: { type: 'string' },
        },
      ],
    },
    colorDomain: {
      type: 'array',
      items: { type: 'string' },
    },
    colorLegendTitle: { type: 'string' },
    radius: { type: 'number' },
    backgroundColor: { oneOf: [{ type: 'string' }, { type: 'boolean' }] },
    padding: { type: 'string' },
    leftMargin: { type: 'number' },
    rightMargin: { type: 'number' },
    topMargin: { type: 'number' },
    bottomMargin: { type: 'number' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    tooltip: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    highlightedDataPoints: {
      type: 'array',
      items: { oneOf: [{ type: 'string' }, { type: 'number' }] },
    },
    showColorScale: { type: 'boolean' },
    graphID: { type: 'string' },
    maxValue: { type: 'number' },
    minValue: { type: 'number' },
    noOfTicks: { type: 'number' },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    prefix: { type: 'string' },
    suffix: { type: 'string' },
    showNAColor: { type: 'boolean' },
    language: {
      type: 'string',
      enum: [
        'en',
        'ar',
        'az',
        'bn',
        'cy',
        'he',
        'hi',
        'jp',
        'ka',
        'km',
        'ko',
        'my',
        'ne',
        'zh',
        'custom',
      ],
    },
    highlightColor: { type: 'string' },
    dotOpacity: { type: 'number' },
    theme: {
      type: 'string',
      enum: ['light', 'dark'],
    },
    orientation: {
      type: 'string',
      enum: ['vertical', 'horizontal'],
    },
    resetSelectionOnDoubleClick: { type: 'boolean' },
  },
};

export const treeMapSettingsSchema = {
  type: 'object',
  properties: {
    precision: { type: 'number' },
    dimmedOpacity: { type: 'number', minimum: 0, maximum: 1 },
    animate: {
      oneOf: [
        {
          type: 'object',
          properties: {
            duration: {
              type: 'number',
            },
            once: {
              type: 'boolean',
            },
            amount: {
              anyOf: [
                {
                  type: 'string',
                  enum: ['some', 'all'],
                },
                {
                  type: 'number',
                },
              ],
            },
          },
          required: ['duration', 'once', 'amount'],
        },
        { type: 'boolean' },
      ],
    },
    styles: { type: 'object' },
    classNames: { type: 'object' },
    detailsOnClick: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    colors: {
      oneOf: [
        { type: 'string' },
        {
          type: 'array',
          items: { type: 'string' },
        },
      ],
    },
    graphTitle: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    ariaLabel: { type: 'string' },
    graphDescription: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    footNote: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    width: { type: 'number' },
    height: { type: 'number' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    suffix: { type: 'string' },
    prefix: { type: 'string' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    leftMargin: { type: 'number' },
    rightMargin: { type: 'number' },
    colorDomain: {
      type: 'array',
      items: { type: 'string' },
    },
    colorLegendTitle: { type: 'string' },
    backgroundColor: { oneOf: [{ type: 'string' }, { type: 'boolean' }] },
    padding: { type: 'string' },
    topMargin: { type: 'number' },
    bottomMargin: { type: 'number' },
    showLabels: { type: 'boolean' },
    tooltip: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    showColorScale: { type: 'boolean' },
    showValues: { type: 'boolean' },
    graphID: { type: 'string' },
    highlightedDataPoints: {
      type: 'array',
      items: { oneOf: [{ type: 'string' }, { type: 'number' }] },
    },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    showNAColor: { type: 'boolean' },
    language: {
      type: 'string',
      enum: [
        'en',
        'ar',
        'az',
        'bn',
        'cy',
        'he',
        'hi',
        'jp',
        'ka',
        'km',
        'ko',
        'my',
        'ne',
        'zh',
        'custom',
      ],
    },
    theme: {
      type: 'string',
      enum: ['light', 'dark'],
    },
    resetSelectionOnDoubleClick: { type: 'boolean' },
  },
};

export const unitChartSettingsSchema = {
  type: 'object',
  properties: {
    precision: { type: 'number' },
    styles: { type: 'object' },
    classNames: { type: 'object' },
    totalNoOfDots: { type: 'number' },
    ariaLabel: { type: 'string' },
    gridSize: { type: 'number' },
    unitPadding: { type: 'number' },
    size: { type: 'number' },
    graphTitle: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    graphDescription: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    footNote: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    colors: {
      type: 'array',
      items: { type: 'string' },
    },
    backgroundColor: { oneOf: [{ type: 'string' }, { type: 'boolean' }] },
    padding: { type: 'string' },
    graphID: { type: 'string' },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    language: {
      type: 'string',
      enum: [
        'en',
        'ar',
        'az',
        'bn',
        'cy',
        'he',
        'hi',
        'jp',
        'ka',
        'km',
        'ko',
        'my',
        'ne',
        'zh',
        'custom',
      ],
    },
    showColorScale: { type: 'boolean' },
    showStrokeForWhiteDots: { type: 'boolean' },
    note: { type: 'string' },
    theme: {
      type: 'string',
      enum: ['light', 'dark'],
    },
    width: { type: 'number' },
    height: { type: 'number' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
  },
};

export const bulletChartSettingsSchema = {
  type: 'object',
  properties: {
    customLayers: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          position: {
            type: 'string',
            enum: ['before', 'after'],
          },
          layer: {
            type: 'object',
          },
        },
        required: ['layer', 'position'],
      },
    },
    precision: { type: 'number' },
    dimmedOpacity: { type: 'number', minimum: 0, maximum: 1 },
    animate: {
      oneOf: [
        {
          type: 'object',
          properties: {
            duration: {
              type: 'number',
            },
            once: {
              type: 'boolean',
            },
            amount: {
              anyOf: [
                {
                  type: 'string',
                  enum: ['some', 'all'],
                },
                {
                  type: 'number',
                },
              ],
            },
          },
          required: ['duration', 'once', 'amount'],
        },
        { type: 'boolean' },
      ],
    },
    detailsOnClick: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    styles: { type: 'object' },
    classNames: { type: 'object' },
    labelOrder: {
      type: 'array',
      items: { type: 'string' },
    },
    filterNA: { type: 'boolean' },
    graphTitle: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    resetSelectionOnDoubleClick: { type: 'boolean' },
    graphDescription: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    footNote: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    width: { type: 'number' },
    height: { type: 'number' },
    suffix: { type: 'string' },
    prefix: { type: 'string' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    barPadding: { type: 'number' },
    showValues: { type: 'boolean' },
    showTicks: { type: 'boolean' },
    leftMargin: { type: 'number' },
    rightMargin: { type: 'number' },
    truncateBy: { type: 'number' },
    colorDomain: {
      type: 'array',
      items: { type: 'string' },
    },
    barColor: { type: 'string' },
    qualitativeRangeColors: {
      type: 'array',
      items: { type: 'string' },
    },
    targetStyle: { type: 'string', enum: ['background', 'line'] },
    targetColor: { type: 'string' },
    measureBarWidthFactor: {
      type: 'number',
      minimum: 0,
      maximum: 1,
    },
    colorLegendTitle: { type: 'string' },
    backgroundColor: { oneOf: [{ type: 'string' }, { type: 'boolean' }] },
    padding: { type: 'string' },
    topMargin: { type: 'number' },
    bottomMargin: { type: 'number' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    showLabels: { type: 'boolean' },
    showColorScale: { type: 'boolean' },
    maxValue: { type: 'number' },
    minValue: { type: 'number' },
    tooltip: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    refValues: {
      type: 'array',
      items: {
        properties: {
          color: { type: 'string' },
          text: { type: 'string' },
          value: { type: 'number' },
          styles: {
            type: 'object',
            properties: {
              line: { type: 'object' },
              text: { type: 'object' },
            },
          },
          classNames: {
            type: 'object',
            properties: {
              line: { type: 'string' },
              text: { type: 'string' },
            },
          },
        },
        type: 'object',
        required: ['value', 'text'],
      },
    },
    graphID: { type: 'string' },
    highlightedDataPoints: {
      type: 'array',
      items: { oneOf: [{ type: 'string' }, { type: 'number' }] },
    },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    showNAColor: { type: 'boolean' },
    sortData: {
      type: 'string',
      enum: ['asc', 'desc'],
    },
    language: {
      type: 'string',
      enum: [
        'en',
        'ar',
        'az',
        'bn',
        'cy',
        'he',
        'hi',
        'jp',
        'ka',
        'km',
        'ko',
        'my',
        'ne',
        'zh',
        'custom',
      ],
    },
    theme: {
      type: 'string',
      enum: ['light', 'dark'],
    },
    maxBarThickness: { type: 'number' },
    minBarThickness: { type: 'number' },
    maxNumberOfBars: { type: 'number' },
    ariaLabel: { type: 'string' },
    valueColor: { type: 'string' },
    barAxisTitle: { type: 'string' },
    noOfTicks: { type: 'number' },
    orientation: {
      type: 'string',
      enum: ['vertical', 'horizontal'],
    },
  },
};

export const SettingsSchema = {
  type: 'object',
  properties: {
    precision: { type: 'number' },
    animate: {
      oneOf: [
        {
          type: 'object',
          properties: {
            duration: {
              type: 'number',
            },
            once: {
              type: 'boolean',
            },
            amount: {
              anyOf: [
                {
                  type: 'string',
                  enum: ['some', 'all'],
                },
                {
                  type: 'number',
                },
              ],
            },
          },
          required: ['duration', 'once', 'amount'],
        },
        { type: 'boolean' },
      ],
    },
    styles: { type: 'object' },
    classNames: { type: 'object' },
    curveType: {
      type: 'string',
      enum: ['linear', 'curve', 'step', 'stepAfter', 'stepBefore'],
    },
    axisTitle: { type: 'string' },
    theme: {
      type: 'string',
      enum: ['light', 'dark'],
    },
    textBackground: { type: 'boolean' },
    headingFontSize: { type: 'string' },
    centerAlign: { type: 'boolean' },
    verticalAlign: {
      type: 'string',
      enum: ['center', 'top', 'bottom'],
    },
    regressionLine: {
      oneOf: [{ type: 'string' }, { type: 'boolean' }],
    },
    ariaLabel: { type: 'string' },
    includeLayers: {
      type: 'array',
      items: { type: 'string' },
    },
    excludeLayers: {
      type: 'array',
      items: { type: 'string' },
    },
    layerSelection: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          layerID: {
            type: 'array',
            items: { type: 'string' },
            minItems: 1,
          },
        },
        required: ['name', 'layerID'],
      },
      minItems: 1,
    },
    maxBarThickness: { type: 'number' },
    minBarThickness: { type: 'number' },
    maxNumberOfBars: { type: 'number' },
    aggregationMethod: {
      type: 'string',
      enum: ['average', 'count', 'max', 'min', 'sum'],
    },
    mapProjection: {
      type: 'string',
      enum: ['mercator', 'equalEarth', 'naturalEarth', 'orthographic', 'albersUSA'],
    },
    annotations: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          color: { type: 'string' },
          text: { type: 'string' },
          xCoordinate: {
            oneOf: [{ type: 'string' }, { type: 'number' }],
          },
          yCoordinate: {
            oneOf: [{ type: 'string' }, { type: 'number' }],
          },
          xOffset: { type: 'number' },
          yOffset: { type: 'number' },
          align: {
            type: 'string',
            enum: ['center', 'left', 'right'],
          },
          fontWeight: {
            type: 'string',
            enum: ['regular', 'bold', 'medium'],
          },
          showConnector: {
            oneOf: [{ type: 'boolean' }, { type: 'number' }],
          },
          connectorRadius: { type: 'number' },
          maxWidth: { type: 'number' },
          styles: {
            type: 'object',
            properties: {
              connector: { type: 'object' },
              text: { type: 'object' },
            },
          },
          classNames: {
            type: 'object',
            properties: {
              connector: { type: 'string' },
              text: { type: 'string' },
            },
          },
        },
        required: ['text'],
      },
    },
    area: { type: 'boolean' },
    arrowConnector: { type: 'boolean' },
    autoPlay: { type: 'boolean' },
    autoSort: { type: 'boolean' },
    axisTitles: {
      type: 'array',
      items: { type: 'string' },
      minItems: 2,
      maxItems: 2,
    },
    backgroundColor: {
      oneOf: [{ type: 'string' }, { type: 'boolean' }],
    },
    barColor: { type: 'string' },
    barColors: {
      type: 'array',
      items: { type: 'string' },
      minItems: 2,
      maxItems: 2,
    },
    barGraphLayout: {
      type: 'string',
      enum: ['horizontal', 'vertical'],
    },
    barPadding: { type: 'number' },
    barTitle: { type: 'string' },
    bottomMargin: { type: 'number' },
    center: {
      type: 'array',
      items: { type: 'number' },
      minItems: 2,
      maxItems: 2,
    },
    centerGap: { type: 'number' },
    centerPoint: {
      type: 'array',
      items: { type: 'number' },
      minItems: 2,
      maxItems: 2,
    },
    color: {
      anyOf: [
        {
          type: 'array',
          items: { type: 'string' },
        },
        { type: 'string' },
      ],
    },
    colorDomain: {
      oneOf: [
        {
          type: 'array',
          items: { type: 'number' },
        },
        {
          type: 'array',
          items: { type: 'string' },
        },
      ],
    },
    colorLegendTitle: { type: 'string' },
    colors: {
      anyOf: [
        {
          type: 'array',
          items: { type: 'string' },
        },
        {
          type: 'array',
          items: {
            type: 'array',
            items: { type: 'string' },
          },
        },
        { type: 'string' },
      ],
    },
    columnData: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          align: {
            type: 'string',
            enum: ['center', 'left', 'right'],
          },
          chip: { type: 'boolean' },
          chipColors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                color: { type: 'string' },
                value: { type: 'string' },
              },
            },
          },
          columnId: { type: 'string' },
          columnTitle: { type: 'string' },
          columnWidth: { type: 'number' },
          filterOptions: {
            type: 'array',
            items: { type: 'string' },
          },
          prefix: { type: 'string' },
          separator: { type: 'string' },
          sortable: { type: 'boolean' },
          suffix: { type: 'string' },
        },
        required: ['columnId'],
      },
    },
    connectorStrokeWidth: { type: 'number' },
    countOnly: {
      type: 'array',
      items: {
        oneOf: [{ type: 'string' }, { type: 'number' }],
      },
    },
    dataDownload: { type: 'boolean' },
    dateFormat: { type: 'string' },
    donutColorDomain: {
      type: 'array',
      items: { type: 'string' },
    },
    donutStrokeWidth: { type: 'number' },
    dotOpacity: { type: 'number' },
    fillContainer: { type: 'boolean' },
    footNote: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    graphDescription: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    graphDownload: { type: 'boolean' },
    graphID: { type: 'string' },
    showColorScale: { type: 'boolean' },
    graphTitle: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    graphType: {
      type: 'string',
      enum: ['barGraph', 'circlePacking', 'donutChart', 'treeMap'],
    },
    gridSize: { type: 'number' },
    height: { type: 'number' },
    highlightAreaColor: { type: 'string' },
    highlightAreaSettings: {
      anyOf: [
        {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              coordinates: {
                type: 'array',
                items: {
                  oneOf: [{ type: 'number' }, { type: 'string' }, { type: 'null' }],
                },
                minItems: 2,
                maxItems: 2,
              },
              style: { type: 'object' },
              className: { type: 'string' },
              color: { type: 'string' },
              strokeWidth: { type: 'number' },
            },
            required: ['coordinates'],
          },
        },
        {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              coordinates: {
                type: 'array',
                items: {
                  oneOf: [{ type: 'number' }, { type: 'null' }],
                },
                minItems: 4,
                maxItems: 4,
              },
              style: { type: 'object' },
              className: { type: 'string' },
              color: { type: 'string' },
              strokeWidth: { type: 'number' },
            },
            required: ['coordinates'],
          },
        },
      ],
    },
    highlightColor: { type: 'string' },
    highlightedIds: {
      type: 'array',
      items: { type: 'string' },
    },
    highlightedDataPoints: {
      type: 'array',
      items: {
        oneOf: [{ type: 'string' }, { type: 'number' }],
      },
    },
    highlightedLines: {
      type: 'array',
      items: {
        oneOf: [{ type: 'string' }, { type: 'number' }],
      },
    },
    isWorldMap: { type: 'boolean' },
    labelOrder: {
      type: 'array',
      items: { type: 'string' },
    },
    labels: {
      type: 'array',
      items: {
        oneOf: [{ type: 'string' }, { type: 'number' }],
      },
    },
    language: {
      type: 'string',
      enum: ['ar', 'en', 'he'],
    },
    leftBarTitle: { type: 'string' },
    leftMargin: { type: 'number' },
    lineColor: { type: 'string' },
    lineColors: {
      type: 'array',
      items: { type: 'string' },
    },
    lineTitle: { type: 'string' },
    mainText: {
      oneOf: [
        { type: 'string' },
        {
          type: 'object',
          properties: {
            label: { type: 'string' },
            suffix: { type: 'string' },
            prefix: { type: 'string' },
          },
          required: ['label'],
        },
      ],
    },
    mapBorderColor: { type: 'string' },
    mapBorderWidth: { type: 'number' },
    mapData: {
      oneOf: [{ type: 'object' }, { type: 'string' }],
    },
    mapNoDataColor: { type: 'string' },
    mapProperty: { type: 'string' },
    mapStyle: {
      oneOf: [
        { type: 'string' },
        {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              style: { type: 'string' },
            },
            required: ['name', 'style'],
          },
          minItems: 1,
        },
      ],
    },
    mapStyles: {
      type: 'array',
      items: { type: 'string' },
      minItems: 2,
      maxItems: 2,
    },
    maxPositionValue: { type: 'number' },
    maxRadiusValue: { type: 'number' },
    maxValue: { type: 'number' },
    maxXValue: { type: 'number' },
    maxYValue: { type: 'number' },
    minHeight: { type: 'number' },
    minPositionValue: { type: 'number' },
    minValue: { type: 'number' },
    minXValue: { type: 'number' },
    minYValue: { type: 'number' },
    noDataColor: { type: 'string' },
    noOfXTicks: { type: 'number' },
    note: { type: 'string' },
    numberOfBins: { type: 'number' },
    padding: { type: 'string' },
    prefix: { type: 'string' },
    radius: { type: 'number' },
    refValues: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          color: { type: 'string' },
          text: { type: 'string' },
          value: { type: 'number' },
          styles: {
            type: 'object',
            properties: {
              line: { type: 'object' },
              text: { type: 'object' },
            },
          },
          classNames: {
            type: 'object',
            properties: {
              line: { type: 'string' },
              text: { type: 'string' },
            },
          },
        },
        required: ['value', 'text'],
      },
    },
    refXValues: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          color: { type: 'string' },
          text: { type: 'string' },
          value: { type: 'number' },
          styles: {
            type: 'object',
            properties: {
              line: { type: 'object' },
              text: { type: 'object' },
            },
          },
          classNames: {
            type: 'object',
            properties: {
              line: { type: 'string' },
              text: { type: 'string' },
            },
          },
        },
        required: ['value', 'text'],
      },
    },
    refYValues: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          color: { type: 'string' },
          text: { type: 'string' },
          value: { type: 'number' },
          styles: {
            type: 'object',
            properties: {
              line: { type: 'object' },
              text: { type: 'object' },
            },
          },
          classNames: {
            type: 'object',
            properties: {
              line: { type: 'string' },
              text: { type: 'string' },
            },
          },
        },
        required: ['value', 'text'],
      },
    },
    customHighlightAreaSettings: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          coordinates: {
            type: 'array',
            items: {
              oneOf: [{ type: 'string' }, { type: 'number' }],
            },
            minItems: 4,
          },
          color: { type: 'string' },
          strokeWidth: { type: 'number' },
          dashedStroke: { type: 'boolean' },
          closePath: { type: 'boolean' },
        },
        required: ['coordinates'],
      },
    },
    relativeHeight: { type: 'number' },
    rightBarTitle: { type: 'string' },
    rightMargin: { type: 'number' },
    sameAxes: { type: 'boolean' },
    scale: { type: 'number' },
    scaleType: {
      type: 'string',
      enum: ['categorical', 'linear', 'threshold'],
    },
    showAntarctica: { type: 'boolean' },
    noOfTicks: { type: 'boolean' },
    showColorLegendAtTop: { type: 'boolean' },
    showColumnLabels: { type: 'boolean' },
    showLabels: { type: 'boolean' },
    showNAColor: { type: 'boolean' },
    showOnlyActiveDate: { type: 'boolean' },
    showRowLabels: { type: 'boolean' },
    showStrokeForWhiteDots: { type: 'boolean' },
    showTicks: { type: 'boolean' },
    showValues: { type: 'boolean' },
    size: { type: 'number' },
    sortData: {
      type: 'string',
      enum: ['asc', 'desc'],
    },
    sortParameter: {
      anyOf: [
        {
          type: 'string',
          enum: ['diff', 'total'],
        },
        { type: 'number' },
      ],
    },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    stripType: {
      type: 'string',
      enum: ['dot', 'strip'],
    },
    strokeWidth: { type: 'number' },
    subNote: { type: 'string' },
    suffix: { type: 'string' },
    tooltip: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    topMargin: { type: 'number' },
    totalNoOfDots: { type: 'number' },
    truncateBy: { type: 'number' },
    unitPadding: { type: 'number' },
    value: { type: 'number' },
    width: { type: 'number' },
    xAxisTitle: { type: 'string' },
    xColorLegendTitle: { type: 'string' },
    xDomain: {
      type: 'array',
      items: { type: 'number' },
    },
    yAxisTitle: { type: 'string' },
    yColorLegendTitle: { type: 'string' },
    yDomain: {
      type: 'array',
      items: { type: 'number' },
    },
    year: {
      oneOf: [{ type: 'string' }, { type: 'number' }],
    },
    zoomLevel: { type: 'number' },
    zoomScaleExtend: {
      type: 'array',
      items: { type: 'number' },
      minItems: 2,
      maxItems: 2,
    },
    zoomTranslateExtend: {
      type: 'array',
      items: {
        type: 'array',
        items: { type: 'number' },
        minItems: 2,
        maxItems: 2,
      },
      minItems: 2,
      maxItems: 2,
    },
    sortNodes: {
      type: 'string',
      enum: ['asc', 'desc', 'mostReadable', 'none'],
    },
    nodePadding: { type: 'number' },
    nodeWidth: { type: 'number' },
    defaultLinkOpacity: {
      type: 'number',
      minimum: 0,
      maximum: 1,
    },
    sourceColors: {
      oneOf: [
        { type: 'string' },
        {
          type: 'array',
          items: { type: 'string' },
        },
      ],
    },
    targetColors: {
      oneOf: [
        { type: 'string' },
        {
          type: 'array',
          items: { type: 'string' },
        },
      ],
    },
    sourceColorDomain: {
      type: 'array',
      items: {
        oneOf: [{ type: 'string' }, { type: 'number' }],
      },
    },
    targetColorDomain: {
      type: 'array',
      items: {
        oneOf: [{ type: 'string' }, { type: 'number' }],
      },
    },
    sourceTitle: { type: 'string' },
    targetTitle: { type: 'string' },
    highlightedSourceDataPoints: {
      type: 'array',
      items: {
        oneOf: [{ type: 'string' }, { type: 'number' }],
      },
    },
    highlightedTargetDataPoints: {
      type: 'array',
      items: {
        oneOf: [{ type: 'string' }, { type: 'number' }],
      },
    },
    cardSearchColumns: {
      type: 'array',
      items: { type: 'string' },
    },
    cardTemplate: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    cardBackgroundColor: { type: 'string' },
    cardFilters: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          column: { type: 'string' },
          width: { type: 'string' },
          label: { type: 'string' },
          defaultValue: {
            oneOf: [{ type: 'string' }, { type: 'number' }],
          },
          excludeValues: {
            type: 'array',
            items: { type: 'string' },
          },
        },
        required: ['column'],
      },
    },
    cardSortingOptions: {
      type: 'object',
      properties: {
        defaultValue: { type: 'string' },
        width: { type: 'string' },
        options: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              value: { type: 'string' },
              label: { type: 'string' },
              type: {
                type: 'string',
                enum: ['asc', 'desc'],
              },
            },
            required: ['value', 'label', 'type'],
          },
          minItems: 1,
        },
      },
    },
    cardMinWidth: { type: 'number' },
    detailsOnClick: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    resetSelectionOnDoubleClick: { type: 'boolean' },
    legendMaxWidth: { type: 'string' },
    intervalAreaOpacity: { type: 'number' },
    valueColor: { type: 'string' },
    labelColor: { type: 'string' },
    noOfYTicks: { type: 'number' },
    zoomInteraction: {
      type: 'string',
      enum: ['scroll', 'ctrlScroll', 'button', 'noZoom'],
    },
    minDate: {
      oneOf: [{ type: 'string' }, { type: 'number' }],
    },
    maxDate: {
      oneOf: [{ type: 'string' }, { type: 'number' }],
    },
    colorLegendColors: {
      type: 'array',
      items: { type: 'string' },
    },
    colorLegendDomain: {
      type: 'array',
      items: { type: 'string' },
    },
    lineSuffixes: {
      type: 'array',
      items: { type: 'string' },
      minItems: 2,
      maxItems: 2,
    },
    linePrefixes: {
      type: 'array',
      items: { type: 'string' },
      minItems: 2,
      maxItems: 2,
    },
    barSuffix: { type: 'string' },
    barPrefix: { type: 'string' },
    lineSuffix: { type: 'string' },
    barAxisTitle: { type: 'string' },
    linePrefix: { type: 'string' },
    xSuffix: { type: 'string' },
    xPrefix: { type: 'string' },
    ySuffix: { type: 'string' },
    yPrefix: { type: 'string' },
    filterNA: { type: 'boolean' },
    uiMode: {
      type: 'string',
      enum: ['light', 'normal'],
    },
    allowDataDownloadOnDetail: {
      oneOf: [{ type: 'string' }, { type: 'boolean' }],
    },
    noOfItemsInAPage: {
      type: 'number',
      minimum: 0,
    },
    orientation: {
      type: 'string',
      enum: ['vertical', 'horizontal'],
    },
    showDots: { type: 'boolean' },
    fillShape: { type: 'boolean' },
    colorScaleMaxWidth: { type: 'string' },
    axisLabels: {
      type: 'array',
      items: { type: 'string' },
      minItems: 1,
    },
    minWidth: { type: 'string' },
    layout: {
      type: 'string',
      enum: ['primary', 'secondary'],
    },
    qualitativeRangeColors: {
      type: 'array',
      items: { type: 'string' },
    },
    targetStyle: { type: 'string', enum: ['background', 'line'] },
    targetColor: { type: 'string' },
    measureBarWidthFactor: {
      type: 'number',
      minimum: 0,
      maximum: 1,
    },
    mapLegend: { oneOf: [{ type: 'string' }, { type: 'object' }] },
    dimmedOpacity: { type: 'number', minimum: 0, maximum: 1 },
    customLayers: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          position: {
            type: 'string',
            enum: ['before', 'after'],
          },
          layer: {
            type: 'object',
          },
        },
        required: ['layer', 'position'],
      },
    },
  },
};
