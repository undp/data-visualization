import { cn } from '@undp/design-system-react/cn';

interface Props {
  text?: string;
  y: number;
  x: number;
  className?: string;
  style?: React.CSSProperties;
  rotate90?: boolean;
}

export function AxisTitle(props: Props) {
  const { text, x, y, className, style, rotate90 } = props;
  if (!text) return null;
  return (
    <text
      transform={`translate(${x}, ${y})${rotate90 ? ' rotate(-90)' : ''}`}
      style={{
        textAnchor: 'middle',
        ...(style || {}),
      }}
      className={cn('fill-primary-gray-700 dark:fill-primary-gray-300 text-xs', className)}
    >
      {text}
    </text>
  );
}
