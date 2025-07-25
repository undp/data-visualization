import { NumberValue } from 'd3-scale';
import { cn } from '@undp/design-system-react';
import { motion } from 'motion/react';

import { getPathFromPoints } from '@/Utils/getPathFromPoints';
import { AnimateDataType } from '@/Types';

interface Props {
  areaSettings: {
    coordinates: (Date | number)[];
    closePath?: boolean;
    style?: React.CSSProperties;
    className?: string;
    color?: string;
    strokeWidth?: number;
  }[];
  scaleX: (value: Date | NumberValue) => number;
  scaleY: (value: Date | NumberValue) => number;
  animate: AnimateDataType;
  isInView: boolean;
}
export function CustomArea(props: Props) {
  const { areaSettings, scaleX, scaleY, animate, isInView } = props;
  return (
    <>
      {areaSettings.map(d => (
        <motion.g
          key={d.coordinates
            .map(item => (item instanceof Date ? item.toISOString() : item.toString()))
            .join('~')}
          variants={{
            initial: {
              opacity: 0,
            },
            whileInView: {
              opacity: 1,
              transition: { duration: animate.duration },
            },
          }}
          initial='initial'
          animate={isInView ? 'whileInView' : 'initial'}
        >
          {d.coordinates.length !== 4 ? (
            <path
              d={getPathFromPoints(
                d.coordinates.map((el, j) => (j % 2 === 0 ? scaleX(el) : scaleY(el as number))),
                d.closePath,
              )}
              style={{
                strokeWidth: d.strokeWidth || 0,
                ...(d.coordinates.length > 4 ? d.color && { fill: d.color } : { fill: 'none' }),
                ...(d.color && { stroke: d.color }),
                ...(d.style || {}),
              }}
              className={cn(
                !d.color
                  ? 'stroke-primary-gray-300 dark:stroke-primary-gray-550 fill-primary-gray-300 dark:fill-primary-gray-550'
                  : '',
                d.className,
              )}
            />
          ) : (
            <line
              x1={scaleX(d.coordinates[0])}
              y1={scaleY(d.coordinates[1] as number)}
              x2={scaleX(d.coordinates[2])}
              y2={scaleY(d.coordinates[3] as number)}
              style={{
                ...(d.color && { stroke: d.color }),
                fill: 'none',
                strokeWidth: d.strokeWidth || 1,
                ...(d.style || {}),
              }}
              className={cn(
                !d.color ? 'stroke-primary-gray-300 dark:stroke-primary-gray-550' : '',
                d.className,
              )}
            />
          )}
        </motion.g>
      ))}
    </>
  );
}
