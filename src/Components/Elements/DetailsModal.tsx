import { Modal } from '@undp/design-system-react/Modal';

import { string2HTML } from '@/Utils/string2HTML';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: string | ((_d: any) => React.ReactNode);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setData: (_d: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        dangerouslySetInnerHTML={
          typeof body === 'string' ? { __html: string2HTML(body, data) } : undefined
        }
      >
        {typeof body === 'function' ? body(data) : null}
      </div>
    </Modal>
  );
}
