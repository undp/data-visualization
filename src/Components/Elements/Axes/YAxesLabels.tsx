import { cn } from '@undp/design-system-react';
import { motion } from 'motion/react';

import { AnimateDataType } from '@/Types';

interface Props {
  value: number | string;
  y: number;
  x: number;
  width: number;
  height: number;
  style?: React.CSSProperties;
  className?: string;
  alignment?: 'left' | 'right' | 'center';
  animate: AnimateDataType;
}

export function YAxesLabels(props: Props) {
  const { value, y, x, style, className, width, height, alignment = 'right', animate } = props;
  return (
    <motion.foreignObject
      width={width}
      height={height}
      initial={{
        x,
        y,
      }}
      whileInView={{
        x,
        y,
      }}
      transition={{ duration: animate.duration }}
      viewport={{ once: animate.once, amount: animate.amount }}
    >
      <div className='flex flex-col justify-center h-inherit'>
        <p
          className={cn(
            'fill-primary-gray-700 dark:fill-primary-gray-300 text-xs m-0 py-0 px-1.5 leading-none',
            `text-${alignment}`,
            className,
          )}
          style={style}
        >
          {value}
        </p>
      </div>
    </motion.foreignObject>
  );
}
