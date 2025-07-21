import { cn } from '@undp/design-system-react';

import { numberFormattingFunction } from '@/Utils/numberFormattingFunction';

interface Props {
  values?: number[];
  y: number[];
  x1: number;
  x2: number;
  styles: { gridLines?: React.CSSProperties; labels?: React.CSSProperties };
  classNames: { gridLines?: string; labels?: string };
  prefix?: string;
  suffix?: string;
  labelType: 'primary' | 'secondary';
  showGridLines: boolean;
  labelPos: 'side' | 'vertical';
  precision: number;
}

export function YTicksAndGridLines(props: Props) {
  const {
    values,
    y,
    x1,
    x2,
    styles,
    classNames,
    prefix,
    suffix,
    labelType,
    showGridLines,
    labelPos = 'vertical',
    precision,
  } = props;
  if (!values && !showGridLines) return null;
  return (
    <>
      {y.map((d, i) => (
        <g key={i}>
          {showGridLines ? (
            <line
              x1={x1}
              x2={x2}
              y1={d}
              y2={d}
              className={cn(
                'undp-tick-line stroke-primary-gray-500 dark:stroke-primary-gray-550',
                classNames?.gridLines,
              )}
              style={styles?.gridLines}
            />
          ) : null}
          {values ? (
            <text
              x={x1}
              y={d}
              dy={labelPos === 'side' ? '0.33em' : values[i] < 0 ? '1em' : -5}
              dx={labelPos === 'side' ? -4 : 0}
              style={{
                textAnchor: labelPos === 'side' ? 'end' : 'start',
                ...(styles?.labels || {}),
              }}
              className={cn(
                labelType === 'primary'
                  ? 'fill-primary-gray-700 dark:fill-primary-gray-300 text-xs'
                  : 'fill-primary-gray-550 dark:fill-primary-gray-500 text-xs',
                classNames?.labels,
              )}
            >
              {numberFormattingFunction(values[i], precision, prefix, suffix)}
            </text>
          ) : null}
        </g>
      ))}
    </>
  );
}
