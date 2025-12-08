import { parse } from 'date-fns/parse';
import orderBy from 'lodash.orderby';

import {
  BarGraphDataType,
  BulletChartDataType,
  ButterflyChartDataType,
  DumbbellChartDataType,
  GroupedBarGraphDataType,
  ScatterPlotDataType,
} from '@/Types';

export function ensureCompleteDataForBarChart(data: BarGraphDataType[], dateFormat: string) {
  // Extract unique labels and dates
  const labels = Array.from(new Set(data.map(d => d.label)));
  const dates = Array.from(new Set(data.map(d => d.date))).filter(d => d !== undefined);
  if (dates.length === 0) return data;

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

  return orderBy(
    completeData,
    [d => parse(`${d.date}`, dateFormat || 'yyyy', new Date())],
    ['asc'],
  );
}

export function ensureCompleteDataForStackedBarChart(
  data: GroupedBarGraphDataType[],
  dateFormat: string,
) {
  // Extract unique labels and dates
  const labels = Array.from(new Set(data.map(d => d.label)));
  const dates = Array.from(new Set(data.map(d => d.date))).filter(d => d !== undefined);
  if (dates.length === 0) return data;
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

  return orderBy(
    completeData,
    [d => parse(`${d.date}`, dateFormat || 'yyyy', new Date())],
    ['asc'],
  );
}

export function ensureCompleteDataForButterFlyChart(
  data: ButterflyChartDataType[],
  dateFormat: string,
) {
  // Extract unique labels and dates
  const labels = Array.from(new Set(data.map(d => d.label)));
  const dates = Array.from(new Set(data.map(d => d.date))).filter(d => d !== undefined);
  if (dates.length === 0) return data;

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

  return orderBy(
    completeData,
    [d => parse(`${d.date}`, dateFormat || 'yyyy', new Date())],
    ['asc'],
  );
}

export function ensureCompleteDataForScatterPlot(data: ScatterPlotDataType[], dateFormat: string) {
  // Extract unique labels and dates
  const labels = Array.from(new Set(data.map(d => d.label)));
  const dates = Array.from(new Set(data.map(d => d.date))).filter(d => d !== undefined);
  if (dates.length === 0) return data;

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

  return orderBy(
    completeData,
    [d => parse(`${d.date}`, dateFormat || 'yyyy', new Date())],
    ['asc'],
  );
}

export function ensureCompleteDataForDumbbellChart(
  data: DumbbellChartDataType[],
  dateFormat: string,
) {
  // Extract unique labels and dates
  const labels = Array.from(new Set(data.map(d => d.label)));
  const dates = Array.from(new Set(data.map(d => d.date))).filter(d => d !== undefined);
  if (dates.length === 0) return data;

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

  return orderBy(
    completeData,
    [d => parse(`${d.date}`, dateFormat || 'yyyy', new Date())],
    ['asc'],
  );
}

export function ensureCompleteDataForBulletChart(data: BulletChartDataType[], dateFormat: string) {
  // Extract unique labels and dates
  const labels = Array.from(new Set(data.map(d => d.label)));
  const dates = Array.from(new Set(data.map(d => d.date))).filter(d => d !== undefined);
  if (dates.length === 0) return data;

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
          size: null,
          target: null,
          qualitativeRange: null,
          date,
        });
      }
    });
  });

  return orderBy(
    completeData,
    [d => parse(`${d.date}`, dateFormat || 'yyyy', new Date())],
    ['asc'],
  );
}
