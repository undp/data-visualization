import { useState } from 'react';
import { cn, P } from '@undp/design-system-react';

import { numberFormattingFunction } from '@/Utils/numberFormattingFunction';

interface Props {
  colors: string[];
  colorDomain: number[];
  colorLegendTitle?: string;
  setSelectedColor: (_d?: string) => void;
  width?: number;
  naColor?: string;
  className?: string;
  showNAColor: boolean;
}

export function ThresholdColorLegendWithMouseOver(props: Props) {
  const {
    colorLegendTitle,
    colorDomain,
    colors,
    setSelectedColor,
    width,
    naColor,
    className,
    showNAColor,
  } = props;

  const [hoveredColor, setHoveredColor] = useState<string | undefined>(undefined);
  const mainColorWidth = naColor ? 320 : 360;
  return (
    <div
      className={cn('flex flex-wrap gap-0 justify-center leading-0', className)}
      style={{ maxWidth: width ? `${width}px` : 'none' }}
      aria-label='Color legend'
    >
      {colorLegendTitle && colorLegendTitle !== '' ? (
        <P size='sm' marginBottom='2xs' className='w-full text-center'>
          {colorLegendTitle}
        </P>
      ) : null}
      <svg width='100%' viewBox='0 0 360 30' style={{ maxWidth: '360px' }} direction='ltr'>
        <g>
          {colorDomain.map((d, i) => (
            <g
              key={i}
              onMouseOver={() => {
                setHoveredColor(colors[i]);
                setSelectedColor(colors[i]);
              }}
              onMouseLeave={() => {
                setHoveredColor(undefined);
                setSelectedColor(undefined);
              }}
              className='cursor-pointer'
            >
              <rect
                x={(i * mainColorWidth) / colors.length + 1}
                y={1}
                width={mainColorWidth / colors.length - 2}
                height={8}
                className={`stroke-1 ${
                  hoveredColor === colors[i]
                    ? 'stroke-primary-gray-700 dark:stroke-primary-gray-300'
                    : ''
                }`}
                style={{
                  fill: colors[i],
                  ...(hoveredColor !== colors[i] ? { stroke: colors[i] } : {}),
                }}
              />
              <text
                x={((i + 1) * mainColorWidth) / colors.length}
                y={25}
                className='fill-primary-gray-700 dark:fill-primary-gray-300 text-sm'
                style={{ textAnchor: 'middle' }}
              >
                {numberFormattingFunction(d as number, 'NA', 2, '', '')}
              </text>
            </g>
          ))}
          <g>
            <rect
              onMouseOver={() => {
                setHoveredColor(colors[colorDomain.length]);
                setSelectedColor(colors[colorDomain.length]);
              }}
              onMouseLeave={() => {
                setHoveredColor(undefined);
                setSelectedColor(undefined);
              }}
              x={(colorDomain.length * mainColorWidth) / colors.length + 1}
              y={1}
              width={mainColorWidth / colors.length - 2}
              height={8}
              className={`cursor-pointer stroke-1 ${
                hoveredColor === colors[colorDomain.length]
                  ? 'stroke-primary-gray-700 dark:stroke-primary-gray-300'
                  : ''
              }`}
              style={{
                fill: colors[colorDomain.length],
                ...(hoveredColor !== colors[colorDomain.length]
                  ? { stroke: colors[colorDomain.length] }
                  : {}),
              }}
            />
          </g>
          {showNAColor ? (
            <g
              onMouseOver={() => {
                setHoveredColor(naColor || '#D4D6D8');
                setSelectedColor(naColor || '#D4D6D8');
              }}
              onMouseLeave={() => {
                setHoveredColor(undefined);
                setSelectedColor(undefined);
              }}
              className='cursor-pointer'
            >
              <rect
                x={335}
                y={1}
                width={24}
                height={8}
                className={`stroke-1 ${
                  hoveredColor === naColor
                    ? 'stroke-primary-gray-700 dark:stroke-primary-gray-300'
                    : ''
                }`}
                style={{
                  fill: naColor || '#D4D6D8',
                  ...(hoveredColor !== naColor ? { stroke: naColor } : {}),
                  strokeWidth: 1,
                }}
              />
              <text
                x={337.5}
                y={25}
                className='fill-primary-gray-700 dark:fill-primary-gray-300 text-sm'
                style={{ textAnchor: 'start' }}
              >
                NA
              </text>
            </g>
          ) : null}
        </g>
      </svg>
    </div>
  );
}
