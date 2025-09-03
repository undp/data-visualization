import { Button } from '@undp/design-system-react/Button';
import { Toaster } from '@undp/design-system-react/Toaster';
import { useToast } from '@undp/design-system-react/ToasterHooks';

import { Copy } from '@/Components/Icons';

interface Props {
  text: string;
  successMessage?: string;
  buttonText?: string;
  buttonSmall?: boolean;
  className?: string;
}

export function CopyTextButton(props: Props) {
  const {
    text,
    successMessage = 'Text copied',
    buttonText,
    buttonSmall = false,
    className = '',
  } = props;
  const { toast } = useToast();
  return (
    <>
      <Button
        variant='tertiary'
        className={`${buttonSmall ? 'p-2' : 'py-4 px-6'} ${className}`}
        onClick={() => {
          navigator.clipboard.writeText(text);
          toast({
            variant: 'success',
            description: successMessage,
            duration: 1000,
          });
        }}
        aria-label='Click to copy the text'
      >
        <Copy />
        {buttonText || null}
      </Button>
      <Toaster />
    </>
  );
}
