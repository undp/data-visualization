import { Modal } from '@undp/design-system-react/Modal';

interface Props {
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  body: (_d: any) => React.ReactNode;
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  setData: (_d: any) => void;
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  data: any;
  className?: string;
}

export function DetailsModal(props: Props) {
  const { body, data, setData, className } = props;
  if (body(data) === null || body(data) === undefined) {
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
      <div className='graph-modal-content m-0'>{body(data)}</div>
    </Modal>
  );
}
