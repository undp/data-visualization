import { cn, P } from '@undp/design-system-react';
import React from 'react';

interface Props {
  text: string | React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export function GraphDescription(props: Props) {
  const { text, style, className } = props;
  if (typeof text === 'string')
    return (
      <P
        size='sm'
        marginBottom='none'
        className={cn('text-primary-gray-550 dark:text-primary-gray-400', className)}
        aria-label='Graph description'
        style={style}
      >
        {text}
      </P>
    );

  if (React.isValidElement(text))
    return (
      <div className={className} style={style}>
        {text}
      </div>
    );
  console.error('GraphDescription: Invalid text type. Expected string or React element.');
  return null;
}
