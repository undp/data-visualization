import { SourcesDataType } from '@/Types';
import { FootNote } from '@/Components/Typography/FootNote';
import { Source } from '@/Components/Typography/Source';

interface Props {
  footNote?: string | React.ReactNode;
  sources?: SourcesDataType[];
  width?: number;
  styles?: { footnote?: React.CSSProperties; source?: React.CSSProperties };
  classNames?: { footnote?: string; source?: string };
}

export function GraphFooter(props: Props) {
  const { sources, footNote, width, styles, classNames } = props;
  if ((sources === undefined || (sources || []).length === 0) && footNote === undefined)
    return null;
  return (
    <div
      className='flex gap-2 flex-col'
      style={{ maxWidth: width ? `${width}px` : 'none' }}
      aria-label='Graph footer'
    >
      {sources ? (
        <Source sources={sources} style={styles?.source} className={classNames?.source} />
      ) : null}
      {footNote ? (
        <FootNote text={footNote} style={styles?.footnote} className={classNames?.footnote} />
      ) : null}
    </div>
  );
}
