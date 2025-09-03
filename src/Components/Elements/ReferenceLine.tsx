import { cn } from '@undp/design-system-react/cn';
import { motion } from 'motion/react';

import { AnimateDataType } from '@/Types';

interface RefLineYProps {
  text?: string;
  color?: string;
  y: number;
  x1: number;
  x2: number;
  classNames?: {
    line?: string;
    text?: string;
  };
  styles?: {
    line?: React.CSSProperties;
    text?: React.CSSProperties;
  };
  animate?: AnimateDataType;
  isInView: boolean;
}

export function RefLineY(props: RefLineYProps) {
  const { text, x1, x2, y, classNames, styles, color, animate, isInView } = props;
  if (!text) return null;
  return (
    <motion.g
      key={`${x1}-${x2}-${y}`}
      exit={{ opacity: 0, transition: { duration: animate?.duration || 0 } }}
      variants={{
        initial: {
          opacity: 0,
        },
        whileInView: {
          opacity: 1,
          transition: { duration: animate?.duration || 0 },
        },
      }}
      initial='initial'
      animate={isInView ? 'whileInView' : 'initial'}
    >
      <line
        className={cn(
          'undp-ref-line',
          !color ? 'stroke-primary-gray-700 dark:stroke-primary-gray-300' : undefined,
          classNames?.line,
        )}
        style={{
          ...(color && { stroke: color }),
          ...(styles?.line || {}),
        }}
        y1={y}
        y2={y}
        x1={x1}
        x2={x2}
      />
      <text
        x={x2}
        y={y}
        style={{
          ...(color && { fill: color }),
          textAnchor: 'end',
          ...(styles?.text || {}),
        }}
        className={cn(
          'text-xs font-bold',
          !color ? ' fill-primary-gray-700 dark:fill-primary-gray-300' : undefined,
          classNames?.text,
        )}
        dy={-5}
      >
        {text}
      </text>
    </motion.g>
  );
}

interface RefLineXProps {
  text?: string;
  color?: string;
  x: number;
  y1: number;
  y2: number;
  textSide: 'left' | 'right';
  classNames?: {
    line?: string;
    text?: string;
  };
  styles?: {
    line?: React.CSSProperties;
    text?: React.CSSProperties;
  };
  animate?: AnimateDataType;
  isInView: boolean;
}

export function RefLineX(props: RefLineXProps) {
  const { text, y1, y2, x, classNames, styles, color, textSide, animate, isInView } = props;
  if (!text) return null;
  return (
    <motion.g
      key={`${y1}-${y2}-${x}`}
      exit={{ opacity: 0, transition: { duration: animate?.duration || 0 } }}
      variants={{
        initial: {
          opacity: 0,
        },
        whileInView: {
          opacity: 1,
          transition: { duration: animate?.duration || 0 },
        },
      }}
      initial='initial'
      animate={isInView ? 'whileInView' : 'initial'}
    >
      <line
        className={cn(
          'undp-ref-line',
          !color ? 'stroke-primary-gray-700 dark:stroke-primary-gray-300' : undefined,
          classNames?.line,
        )}
        style={{
          ...(color && { stroke: color }),
          ...(styles?.line || {}),
        }}
        y1={y1}
        y2={y2}
        x1={x}
        x2={x}
      />
      <text
        x={x}
        y={y1}
        style={{
          ...(color && { fill: color }),
          textAnchor: textSide === 'left' ? 'end' : 'start',
          ...(styles?.text || {}),
        }}
        className={cn(
          'text-xs font-bold',
          !color ? 'fill-primary-gray-700 dark:fill-primary-gray-300' : undefined,
          classNames?.text,
        )}
        dy={12.5}
        dx={textSide === 'left' ? -5 : 5}
      >
        {text}
      </text>
    </motion.g>
  );
}
