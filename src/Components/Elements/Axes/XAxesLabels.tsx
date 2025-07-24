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
  alignment?: 'top' | 'bottom';
  animate: AnimateDataType;
}

export function XAxesLabels(props: Props) {
  const { value, y, x, style, className, width, height, alignment = 'top', animate } = props;
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
      <div
        className={`flex flex-col items-center h-inherit ${
          alignment === 'top' ? 'justify-start' : 'justify-end'
        }`}
      >
        <p
          className={cn(
            'fill-primary-gray-700 dark:fill-primary-gray-300 text-xs m-0 py-0 px-1.5 text-center leading-none',
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
