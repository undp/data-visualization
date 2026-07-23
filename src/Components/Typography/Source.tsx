import { cn } from '@undp/design-system-react/cn';
import { Spacer } from '@undp/design-system-react/Spacer';
import { A, P } from '@undp/design-system-react/Typography';

import type { SourcesDataType } from '@/Types';

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
        className={cn('text-content-secondary', className)}
        style={style}
      >
        Source:{' '}
        {sources.map((d) => (
          <span
            key={d.source}
            className={cn('text-content-secondary', className)}
            style={{ fontFamily: 'inherit' }}
          >
            {d.link ? (
              <A
                className={cn('text-content-secondary', className)}
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
