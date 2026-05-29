import { Modal } from '@undp/design-system-react/Modal';

import { string2HTML } from '@/Utils/string2HTML';

interface Props {
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  body: string | ((_d: any) => React.ReactNode);
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  setData: (_d: any) => void;
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  data: any;
  className?: string;
}

export function DetailsModal(props: Props) {
  const { body, data, setData, className } = props;
  if (
    (typeof body === 'function' && (body(data) === null || body(data) === undefined)) ||
    body === ''
  ) {
    return null;
  }
  return (
    <Modal
      open={data !== undefined}
      onClose={() => {
        setData(undefined);
      }}
      className={className}
    >
      <div
        className='graph-modal-content m-0'
        // biome-ignore lint/security/noDangerouslySetInnerHtmlWithChildren: Allow setInnerHTML here
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Allow setInnerHTML here
        dangerouslySetInnerHTML={
          typeof body === 'string' ? { __html: string2HTML(body, data) } : undefined
        }
      >
        {typeof body === 'function' ? body(data) : null}
      </div>
    </Modal>
  );
}
