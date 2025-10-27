import { A, P } from '@undp/design-system-react/Typography';
import { cn } from '@undp/design-system-react/cn';
import { Spacer } from '@undp/design-system-react/Spacer';

import { SourcesDataType } from '@/Types';

interface SourceProps {
  sources: SourcesDataType[];
  style?: React.CSSProperties;
  className?: string;
}

export function Source(props: SourceProps) {
  const { sources, style = {}, className } = props;
  return (
    <>
      <P
        size='sm'
        marginBottom='none'
        aria-label='Data sources'
        className={cn('text-primary-gray-550 dark:text-primary-gray-400', className)}
        style={style}
      >
        Source:{' '}
        {sources.map((d, i) => (
          <span
            key={i}
            className={cn('text-primary-gray-550 dark:text-primary-gray-400', className)}
            style={{ fontFamily: 'inherit' }}
          >
            {d.link ? (
              <A
                className={cn('text-primary-gray-550 dark:text-primary-gray-400', className)}
                href={d.link}
                target='_blank'
                rel='noreferrer'
              >
                {d.source}
              </A>
            ) : (
              d.source
            )}
          </span>
        ))}
      </P>
      <Spacer size='base' />
    </>
  );
}
