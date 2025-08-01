import { cn } from '@undp/design-system-react';
import { AnimatePresence, motion } from 'motion/react';

import { AnimateDataType } from '@/Types';

interface Props {
  color?: string;
  y1: number;
  y2: number;
  x1: number;
  x2: number;
  className?: string;
  style?: React.CSSProperties;
  animate: AnimateDataType;
  isInView: boolean;
}

export function RegressionLine(props: Props) {
  const { color, x1, x2, y1, y2, className, style, animate, isInView } = props;
  return (
    <g>
      <AnimatePresence>
        <motion.line
          className={cn(
            'undp-ref-line',
            !color ? 'stroke-primary-gray-700 dark:stroke-primary-gray-300' : undefined,
            className,
          )}
          style={{
            ...(color && { stroke: color }),
            fill: 'none',
            ...(style || {}),
          }}
          exit={{ opacity: 0, transition: { duration: animate.duration } }}
          variants={{
            initial: {
              y1,
              y2: y1,
              x1,
              x2: x1,
            },
            whileInView: {
              y1,
              y2,
              x1,
              x2,
              transition: { duration: animate.duration },
            },
          }}
          initial='initial'
          animate={isInView ? 'whileInView' : 'initial'}
        />
      </AnimatePresence>
    </g>
  );
}
