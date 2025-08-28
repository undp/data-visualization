import { cn } from '@undp/design-system-react';

import { numberFormattingFunction } from '@/Utils/numberFormattingFunction';

interface Props {
  values?: (number | string)[];
  x: number[];
  y2: number;
  y1: number;
  styles: { gridLines?: React.CSSProperties; labels?: React.CSSProperties };
  classNames: { gridLines?: string; labels?: string };
  prefix?: string;
  suffix?: string;
  labelType: 'primary' | 'secondary';
  showGridLines: boolean;
  leftLabel?: boolean;
  precision: number;
}

export function XTicksAndGridLines(props: Props) {
  const {
    values,
    x,
    y1,
    y2,
    styles,
    classNames,
    prefix,
    suffix,
    labelType,
    showGridLines,
    precision,
    leftLabel = false,
  } = props;
  if (!values && !showGridLines) return null;
  return (
    <>
      {x.map((d, i) => (
        <g key={i}>
          {showGridLines ? (
            <line
              x1={d}
              x2={d}
              y1={y1}
              y2={y2}
              className={cn(
                'undp-tick-line stroke-primary-gray-500 dark:stroke-primary-gray-550',
                classNames?.gridLines,
              )}
              style={styles?.gridLines}
            />
          ) : null}
          {values ? (
            <text
              x={d}
              y={labelType === 'primary' ? y2 : y1}
              dy={labelType === 'primary' ? '1em' : '0.75em'}
              dx={labelType === 'primary' ? 0 : d < 0 || leftLabel ? -3 : 3}
              style={{
                textAnchor:
                  labelType === 'primary' ? 'middle' : d < 0 || leftLabel ? 'end' : 'start',
                ...(styles?.labels || {}),
              }}
              className={cn(
                labelType === 'primary'
                  ? 'fill-primary-gray-700 dark:fill-primary-gray-300 text-xs'
                  : 'fill-primary-gray-550 dark:fill-primary-gray-500 text-xs',
                classNames?.labels,
              )}
            >
              {typeof values[i] === 'string'
                ? values[i]
                : numberFormattingFunction(values[i], 'NA', precision, prefix, suffix)}
            </text>
          ) : null}
        </g>
      ))}
    </>
  );
}
