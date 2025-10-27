import { cn } from '@undp/design-system-react/cn';
import { P } from '@undp/design-system-react/Typography';

import { Colors } from '@/Components/ColorPalette';

interface Props {
  colors: string[];
  colorDomain: (string | number)[];
  colorLegendTitle?: string;
  showNAColor: boolean;
  setSelectedColor: (_d?: string) => void;
  width?: number;
  isCenter?: boolean;
  className?: string;
}

export function ColorLegendWithMouseOver(props: Props) {
  const {
    colorLegendTitle,
    colorDomain,
    colors,
    setSelectedColor,
    showNAColor,
    width,
    isCenter,
    className,
  } = props;

  return (
    <div
      className={cn('flex leading-0 pb-3', isCenter && 'justify-center', className)}
      style={{ maxWidth: width ? `${width}px` : 'none' }}
      aria-label='Color legend'
    >
      <div>
        {colorLegendTitle && colorLegendTitle !== '' ? (
          <P size='sm' marginBottom='2xs' className={isCenter ? 'text-center' : ''}>
            {colorLegendTitle}
          </P>
        ) : null}
        <div className='flex flex-wrap gap-3.5 mb-0'>
          {colorDomain.map((d, i) => (
            <div
              className='flex items-center gap-1 cursor-pointer'
              key={i}
              onMouseEnter={() => {
                setSelectedColor(colors[i % colors.length]);
              }}
              onMouseLeave={() => {
                setSelectedColor(undefined);
              }}
            >
              <div
                className='w-3 h-3 rounded-full'
                style={{ backgroundColor: colors[i % colors.length] }}
              />
              {d === '' ? null : (
                <P size='sm' marginBottom='none'>
                  {d}
                </P>
              )}
            </div>
          ))}
          {showNAColor ? (
            <div
              onMouseEnter={() => {
                setSelectedColor(Colors.gray);
              }}
              onMouseLeave={() => {
                setSelectedColor(undefined);
              }}
              className='flex items-center gap-1 cursor-pointer'
            >
              <div className='w-3 h-3 rounded-full' style={{ backgroundColor: Colors.gray }} />
              <P size='sm' marginBottom='none'>
                NA
              </P>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
