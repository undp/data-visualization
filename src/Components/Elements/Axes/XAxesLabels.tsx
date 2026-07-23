import { cn } from '@undp/design-system-react/cn';
import { motion } from 'motion/react';

import type { AnimateDataType } from '@/Types';

interface Props {
  value: number | string | React.ReactNode;
  y: number;
  x: number;
  width: number;
  height: number;
  style?: React.CSSProperties;
  className?: string;
  alignment?: 'top' | 'bottom';
  animate: AnimateDataType;
  isInView: boolean;
}

export function XAxesLabels(props: Props) {
  const {
    value,
    y,
    x,
    style,
    className,
    width,
    height,
    alignment = 'top',
    animate,
    isInView,
  } = props;
  return (
    <motion.g
      key={y}
      variants={{
        initial: {
          x,
          y,
        },
        whileInView: {
          x,
          y,
          transition: { duration: animate.duration },
        },
      }}
      initial='initial'
      animate={isInView ? 'whileInView' : 'initial'}
      exit={{ opacity: 0, transition: { duration: animate.duration } }}
    >
      <foreignObject width={width} height={height} y={0} x={0}>
        <div
          className={`flex flex-col items-center h-full ${
            alignment === 'top' ? 'justify-start' : 'justify-end'
          }`}
        >
          {typeof value === 'string' || typeof value === 'number' ? (
            <p
              className={cn(
                'fill-content-primary text-xs m-0 py-0 px-1.5 text-center leading-xs',
                className,
              )}
              style={{
                ...style,
              }}
            >
              {value}
            </p>
          ) : (
            value
          )}
        </div>
      </foreignObject>
    </motion.g>
  );
}
