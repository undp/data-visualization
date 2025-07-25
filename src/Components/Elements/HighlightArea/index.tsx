import { NumberValue } from 'd3-scale';
import { motion } from 'motion/react';

import { Colors } from '@/Components/ColorPalette';
import { AnimateDataType } from '@/Types';

interface Props {
  areaSettings: {
    coordinates: (Date | null | number)[];
    style?: React.CSSProperties;
    className?: string;
    color?: string;
    strokeWidth?: number;
  }[];
  width: number;
  height: number;
  scale: (value: Date | NumberValue) => number;
  animate: AnimateDataType;
  isInView: boolean;
}

export function HighlightArea(props: Props) {
  const { areaSettings, width, height, scale, animate, isInView } = props;
  return (
    <>
      {areaSettings.map((d, i) => (
        <motion.g key={i}>
          {d.coordinates[0] === null && d.coordinates[1] === null ? null : (
            <motion.g>
              <motion.rect
                style={{
                  fill: d.color || Colors.light.grays['gray-300'],
                  strokeWidth: d.strokeWidth,
                  ...(d.style || {}),
                }}
                className={d.className}
                y={0}
                height={height}
                variants={{
                  initial: {
                    width: 0,
                    x: d.coordinates[0] ? scale(d.coordinates[0]) : 0,
                    opacity: 1,
                  },
                  whileInView: {
                    width: d.coordinates[1]
                      ? scale(d.coordinates[1]) - (d.coordinates[0] ? scale(d.coordinates[0]) : 0)
                      : width - (d.coordinates[0] ? scale(d.coordinates[0]) : 0),
                    x: d.coordinates[0] ? scale(d.coordinates[0]) : 0,
                    opacity: 1,
                    transition: { duration: animate.duration },
                  },
                }}
                initial='initial'
                animate={isInView ? 'whileInView' : 'initial'}
                exit={{ opacity: 0, width: 0, transition: { duration: animate.duration } }}
              />
            </motion.g>
          )}
        </motion.g>
      ))}
    </>
  );
}

interface ScatterPlotProps {
  areaSettings: {
    coordinates: (Date | null | number)[];
    style?: React.CSSProperties;
    className?: string;
    color?: string;
    strokeWidth?: number;
  }[];
  width: number;
  height: number;
  scaleX: (value: Date | NumberValue) => number;
  scaleY: (value: Date | NumberValue) => number;
  animate: AnimateDataType;
  isInView: boolean;
}

export function HighlightAreaForScatterPlot(props: ScatterPlotProps) {
  const { areaSettings, width, height, scaleX, scaleY, animate, isInView } = props;
  return (
    <>
      {areaSettings.map((d, i) => (
        <motion.g key={`${i}`}>
          {d.coordinates.filter(el => el === null).length === 4 ? null : (
            <motion.g>
              <motion.rect
                style={{
                  fill: d.color || Colors.light.grays['gray-300'],
                  strokeWidth: d.strokeWidth,
                  ...(d.style || {}),
                }}
                className={d.className}
                variants={{
                  initial: {
                    x: d.coordinates[0] ? scaleX(d.coordinates[0] as number) : 0,
                    width: 0,
                    y: d.coordinates[3] ? scaleY(d.coordinates[3] as number) : 0,
                    height: 0,
                  },
                  whileInView: {
                    x: d.coordinates[0] ? scaleX(d.coordinates[0] as number) : 0,
                    width: d.coordinates[1]
                      ? scaleX(d.coordinates[1] as number) -
                        (d.coordinates[0] ? scaleX(d.coordinates[0] as number) : 0)
                      : width - (d.coordinates[0] ? scaleX(d.coordinates[0] as number) : 0),
                    y: d.coordinates[3] ? scaleY(d.coordinates[3] as number) : 0,
                    height:
                      d.coordinates[2] !== null
                        ? scaleY(d.coordinates[2] as number) -
                          (d.coordinates[3] ? scaleY(d.coordinates[3] as number) : 0)
                        : height -
                          (d.coordinates[3] ? height - scaleY(d.coordinates[3] as number) : 0),
                    transition: { duration: animate.duration },
                  },
                }}
                initial='initial'
                animate={isInView ? 'whileInView' : 'initial'}
                exit={{
                  opacity: 0,
                  width: 0,
                  height: 0,
                  transition: { duration: animate.duration },
                }}
              />
            </motion.g>
          )}
        </motion.g>
      ))}
    </>
  );
}
