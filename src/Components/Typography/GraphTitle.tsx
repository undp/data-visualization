import { cn, H5, P } from '@undp/design-system-react';
import React from 'react';

interface Props {
  text: string | React.ReactNode;
  isDashboard?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export function GraphTitle(props: Props) {
  const { text, isDashboard, style, className } = props;
  if (typeof text === 'string') {
    if (isDashboard)
      return (
        <H5
          marginBottom='base'
          className={cn('font-bold pb-3 text-primary-black dark:text-primary-gray-100', className)}
          aria-label='Dashboard title'
          style={style}
        >
          {text}
        </H5>
      );
    return (
      <P
        marginBottom='none'
        className={cn('text-primary-black dark:text-primary-gray-100', className)}
        aria-label='Graph title'
        style={style}
      >
        {text}
      </P>
    );
  }
  return (
    <div className={className} style={style}>
      {text}
    </div>
  );
}
