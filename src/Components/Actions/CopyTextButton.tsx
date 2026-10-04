import { Button } from '@undp/design-system-react/Button';
import { cn } from '@undp/design-system-react/cn';
import { Toaster } from '@undp/design-system-react/Toaster';
import { useToast } from '@undp/design-system-react/ToasterHooks';

import { Copy } from '@/Components/Icons';
import type { Color } from '@/Types';

interface Props {
  text: string;
  successMessage?: string;
  buttonColor?: Color;
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
    buttonColor = 'surface-sm',
    className = '',
  } = props;
  const { toast } = useToast();
  return (
    <>
      <Button
        variant='primary'
        className={cn(buttonSmall ? 'p-2' : 'py-4 px-6', className)}
        endIcon='none'
        color={buttonColor}
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
