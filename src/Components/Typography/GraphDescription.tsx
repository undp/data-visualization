import { cn, P } from '@undp/design-system-react';

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

  return (
    <div className={className} style={style}>
      {text}
    </div>
  );
}
