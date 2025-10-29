import { cn } from '@undp/design-system-react/cn';
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
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: alignment === 'top' ? 'flex-start' : 'flex-end',
            height: '100%',
          }}
        >
          <p
            className={cn(
              'fill-primary-gray-700 dark:fill-primary-gray-300 text-xs m-0 py-0 px-1.5 text-center leading-none',
              className,
            )}
            style={{
              textAlign: 'center',
              padding: '0 6px',
              fontSize: '12px',
              lineHeight: 1,
              ...style,
            }}
          >
            {value}
          </p>
        </div>
      </foreignObject>
    </motion.g>
  );
}
