import { cn } from '@undp/design-system-react';
import { motion } from 'motion/react';

import { AnimateDataType } from '@/Types';

interface Props {
  color?: string;
  connectorsSettings?: {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
    cx: number;
    cy: number;
    circleRadius: number;
    strokeWidth: number;
  };
  labelSettings: {
    x: number;
    y: number;
    width: number;
    maxWidth?: number;
    fontWeight?: 'regular' | 'bold' | 'medium';
    align?: 'center' | 'left' | 'right';
  };
  text: string;
  classNames?: {
    connector?: string;
    text?: string;
  };
  styles?: {
    connector?: React.CSSProperties;
    text?: React.CSSProperties;
  };
  animate: AnimateDataType;
}

export function Annotation(props: Props) {
  const { connectorsSettings, text, color, labelSettings, classNames, styles, animate } = props;
  return (
    <motion.g
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: animate.duration } }}
      transition={{ duration: animate.duration }}
      viewport={{ once: animate.once, amount: animate.amount }}
    >
      {connectorsSettings ? (
        <>
          <circle
            cy={connectorsSettings.cy}
            cx={connectorsSettings.cx}
            r={connectorsSettings.circleRadius}
            className={cn(
              !color ? 'stroke-primary-gray-700 dark:stroke-primary-gray-300' : '',
              classNames?.connector,
            )}
            style={{
              fill: 'none',
              strokeWidth: connectorsSettings.strokeWidth,
              ...(color ? { stroke: color } : {}),
              ...(styles?.connector || {}),
            }}
          />
          <line
            y1={connectorsSettings.y1}
            x1={connectorsSettings.x1}
            y2={connectorsSettings.y2}
            x2={connectorsSettings.x2}
            className={cn(
              !color ? 'stroke-primary-gray-700 dark:stroke-primary-gray-300' : '',
              classNames?.connector,
            )}
            style={{
              fill: 'none',
              strokeWidth: connectorsSettings.strokeWidth,
              ...(color ? { stroke: color } : {}),
              ...(styles?.connector || {}),
            }}
          />
        </>
      ) : null}
      <foreignObject
        y={labelSettings.y}
        x={labelSettings.x}
        width={labelSettings.width}
        height={1}
        style={{ overflow: 'visible' }}
      >
        <p
          className={cn(
            'text-sm leading-[1.25] m-0 whitespace-normal',
            labelSettings.fontWeight === 'bold'
              ? 'font-bold'
              : labelSettings.fontWeight === 'medium'
                ? 'font-medium'
                : 'font-normal',
            labelSettings.align === 'right'
              ? 'text-right'
              : labelSettings.align === 'center'
                ? 'text-center'
                : 'text-left',
            !color ? 'text-primary-gray-700 dark:text-primary-gray-300' : undefined,
            classNames?.text,
          )}
          style={{
            maxWidth: labelSettings.maxWidth || 'auto',
            ...(color ? { color } : {}),
            ...(styles?.text || {}),
          }}
        >
          {text}
        </p>
      </foreignObject>
    </motion.g>
  );
}
