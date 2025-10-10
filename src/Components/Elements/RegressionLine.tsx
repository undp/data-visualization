import { cn } from '@undp/design-system-react/cn';
import { AnimatePresence, motion } from 'motion/react';

import { AnimateDataType } from '@/Types';
import { generateRandomString } from '@/Utils/generateRandomString';

interface Props {
  color?: string;
  y1: number;
  y2: number;
  x1: number;
  x2: number;
  graphWidth: number;
  graphHeight: number;
  className?: string;
  style?: React.CSSProperties;
  animate: AnimateDataType;
  isInView: boolean;
}

export function RegressionLine(props: Props) {
  const { color, x1, x2, y1, y2, className, style, animate, isInView, graphWidth, graphHeight } =
    props;
  const id = generateRandomString(8);
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <rect x='0' y='0' width={graphWidth} height={graphHeight} />
        </clipPath>
      </defs>
      <AnimatePresence>
        <motion.line
          clipPath={`url(#${id})`}
          className={cn(
            'undp-ref-line',
            !color ? 'stroke-primary-gray-700 dark:stroke-primary-gray-300' : undefined,
            className,
          )}
          style={{
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
              ...(color && { stroke: color }),
            },
            whileInView: {
              y1,
              y2,
              x1,
              x2,
              ...(color && { stroke: color }),
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
