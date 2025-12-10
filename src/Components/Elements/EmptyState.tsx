import { P } from '@undp/design-system-react/Typography';

import { Alert } from '@/Components/Icons';

export function EmptyState() {
  return (
    <div className='flex w-full flex-col justify-center grow items-center gap-2 p-6 h-full'>
      <Alert />
      <P
        marginBottom='none'
        leading='none'
        size='lg'
        className='text-primary-gray-550 dark:text-primary-gray-550'
      >
        No data available
      </P>
    </div>
  );
}
