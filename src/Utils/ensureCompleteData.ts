import sortBy from 'lodash.sortby';
import { parse } from 'date-fns';

import {
  BarGraphWithDateDataType,
  ButterflyChartWithDateDataType,
  DumbbellChartWithDateDataType,
  GroupedBarGraphWithDateDataType,
  ScatterPlotWithDateDataType,
} from '@/Types';

export function ensureCompleteDataForBarChart(
  data: BarGraphWithDateDataType[],
  dateFormat: string,
) {
  // Extract unique labels and dates
  const labels = Array.from(new Set(data.map(d => d.label)));
  const dates = Array.from(new Set(data.map(d => d.date)));

  // Create a set of existing label-date combinations
  const existingCombinations = new Set(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data.map((d: any) => `${d.label}-${d.date}`),
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const colors = data.reduce((acc: any, curr: any) => {
    if (!acc[curr.label]) {
      acc[curr.label] = curr.color;
    }
    return acc;
  }, {});

  // Add missing label-date combinations with size as undefined
  const completeData = [...data];

  labels.forEach(label => {
    dates.forEach(date => {
      if (!existingCombinations.has(`${label}-${date}`)) {
        completeData.push({
          label,
          color: colors[label], // Keep the same color for the label
          size: undefined,
          date,
        });
      }
    });
  });

  return sortBy(completeData, d => parse(`${d.date}`, dateFormat || 'yyyy', new Date()));
}

export function ensureCompleteDataForStackedBarChart(
  data: GroupedBarGraphWithDateDataType[],
  dateFormat: string,
) {
  // Extract unique labels and dates
  const labels = Array.from(new Set(data.map(d => d.label)));
  const dates = Array.from(new Set(data.map(d => d.date)));

  // Create a set of existing label-date combinations
  const existingCombinations = new Set(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data.map((d: any) => `${d.label}-${d.date}`),
  );

  // Add missing label-date combinations with size as undefined
  const completeData = [...data];

  labels.forEach(label => {
    dates.forEach(date => {
      if (!existingCombinations.has(`${label}-${date}`)) {
        completeData.push({
          label,
          size: data[0].size.map(_d => null),
          date,
        });
      }
    });
  });

  return sortBy(completeData, d => parse(`${d.date}`, dateFormat || 'yyyy', new Date()));
}

export function ensureCompleteDataForButterFlyChart(
  data: ButterflyChartWithDateDataType[],
  dateFormat: string,
) {
  // Extract unique labels and dates
  const labels = Array.from(new Set(data.map(d => d.label)));
  const dates = Array.from(new Set(data.map(d => d.date)));

  // Create a set of existing label-date combinations
  const existingCombinations = new Set(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data.map((d: any) => `${d.label}-${d.date}`),
  );

  // Add missing label-date combinations with size as undefined
  const completeData = [...data];

  labels.forEach(label => {
    dates.forEach(date => {
      if (!existingCombinations.has(`${label}-${date}`)) {
        completeData.push({
          label,
          leftBar: undefined,
          rightBar: undefined,
          date,
        });
      }
    });
  });

  return sortBy(completeData, d => parse(`${d.date}`, dateFormat || 'yyyy', new Date()));
}

export function ensureCompleteDataForScatterPlot(
  data: ScatterPlotWithDateDataType[],
  dateFormat: string,
) {
  // Extract unique labels and dates
  const labels = Array.from(new Set(data.map(d => d.label)));
  const dates = Array.from(new Set(data.map(d => d.date)));

  // Create a set of existing label-date combinations
  const existingCombinations = new Set(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data.map((d: any) => `${d.label}-${d.date}`),
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const colors = data.reduce((acc: any, curr: any) => {
    if (!acc[curr.label]) {
      acc[curr.label] = curr.color;
    }
    return acc;
  }, {});

  // Add missing label-date combinations with size as undefined
  const completeData = [...data];

  labels.forEach(label => {
    dates.forEach(date => {
      if (!existingCombinations.has(`${label}-${date}`)) {
        completeData.push({
          label,
          color: colors[label], // Keep the same color for the label
          x: undefined,
          y: undefined,
          radius: undefined,
          date,
        });
      }
    });
  });

  return sortBy(completeData, d => parse(`${d.date}`, dateFormat || 'yyyy', new Date()));
}

export function ensureCompleteDataForDumbbellChart(
  data: DumbbellChartWithDateDataType[],
  dateFormat: string,
) {
  // Extract unique labels and dates
  const labels = Array.from(new Set(data.map(d => d.label)));
  const dates = Array.from(new Set(data.map(d => d.date)));

  // Create a set of existing label-date combinations
  const existingCombinations = new Set(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data.map((d: any) => `${d.label}-${d.date}`),
  );

  // Add missing label-date combinations with size as undefined
  const completeData = [...data];

  labels.forEach(label => {
    dates.forEach(date => {
      if (!existingCombinations.has(`${label}-${date}`)) {
        completeData.push({
          label,
          x: data[0].x.map(_d => null),
          date,
        });
      }
    });
  });

  return sortBy(completeData, d => parse(`${d.date}`, dateFormat || 'yyyy', new Date()));
}
