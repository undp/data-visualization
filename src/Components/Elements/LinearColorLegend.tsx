import { cn, P } from '@undp/design-system-react';

import { numberFormattingFunction } from '@/Utils/numberFormattingFunction';

interface Props {
  colors: string[];
  colorDomain: number[];
  colorLegendTitle?: string;
  width?: number;
  className?: string;
}

export function LinearColorLegend(props: Props) {
  const { colorLegendTitle, colorDomain, colors, width, className } = props;
  return (
    <div
      className={cn('flex gap-0 flex-wrap justify-center leading-0', className)}
      style={{ maxWidth: width ? `${width}px` : 'none' }}
      aria-label='Color legend'
    >
      {colorLegendTitle && colorLegendTitle !== '' ? (
        <P size='sm' marginBottom='2xs' className='w-full text-center'>
          {colorLegendTitle}
        </P>
      ) : null}

      <div className='flex gap-0 flex-wrap justify-center w-full min-w-[360px] leading-0'>
        <div
          className='h-4 mb-1 w-full min-w-[360px]'
          style={{ background: `linear-gradient(90deg, ${colors[0]} 0%, ${colors[1]} 100%)` }}
        />
        <div className='flex justify-between w-full min-w-[360px]'>
          <P marginBottom='none' size='sm'>
            {numberFormattingFunction(colorDomain[0], 'NA', 2, '', '')}
          </P>
          <P marginBottom='none' size='sm'>
            {numberFormattingFunction(colorDomain[1], 'NA', 2, '', '')}
          </P>
        </div>
      </div>
    </div>
  );
}
