import { cn } from '@undp/design-system-react/cn';
import React from 'react';

import { Languages } from '@/Types';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  width?: number;
  height?: number;
  backgroundColor: string | boolean;
  theme: 'light' | 'dark';
  language: Languages;
  relativeHeight?: number;
  minHeight?: number;
  padding?: string;
  graphID?: string;
  ariaLabel?: string;
}

export const GraphContainer = React.forwardRef<HTMLDivElement, Props>(
  (
    {
      className,
      width,
      height,
      backgroundColor,
      theme,
      language,
      relativeHeight,
      minHeight,
      padding,
      children,
      style,
      graphID,
      ariaLabel,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        {...props}
        className={cn(
          `${theme || 'light'} ${language || 'en'} mx-auto box-border flex ${width ? 'grow-0' : 'grow w-full'}${relativeHeight ? '' : ' h-full'} flex-col`,
          // Merge background color logic here
          !backgroundColor
            ? 'bg-transparent'
            : backgroundColor === true
              ? 'bg-primary-gray-200 dark:bg-primary-gray-650'
              : '',
          className,
        )}
        dir={language === 'he' || language === 'ar' ? 'rtl' : undefined}
        style={{
          ...(style || {}),
          ...(width ? { width: `${width}px` } : {}),
          ...(height ? { height: `${height}px` } : {}),
          minHeight: minHeight ? `${minHeight}px` : 'auto',
          ...(relativeHeight ? { aspectRatio: 1 / relativeHeight } : {}),
          // Merge padding and background color logic
          padding: backgroundColor ? padding || '1rem' : padding || 0,
          ...(backgroundColor && backgroundColor !== true ? { backgroundColor } : {}),
        }}
        id={graphID}
        ref={ref}
        aria-label={ariaLabel || 'This is a graph'}
      >
        <div className='flex flex-col w-full h-full grow justify-between'>{children}</div>
      </div>
    );
  },
);

export const GraphArea = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        {...props}
        className={cn('w-full grow min-h-0 leading-0', className)}
        ref={ref}
        aria-label='Graph area'
      >
        {children}
      </div>
    );
  },
);
