const polarToCartesian = (
  centerX: number,
  centerY: number,
  radius: number,
  angleInRadians: number,
) => {
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
};

export function describeArc(
  x: number,
  y: number,
  radius: number,
  startAngleInRadians: number,
  endAngleInRadians: number,
) {
  const start = polarToCartesian(x, y, radius, startAngleInRadians);
  const end = polarToCartesian(x, y, radius, endAngleInRadians);
  const largeArcFlag = endAngleInRadians - startAngleInRadians <= 180 ? '0' : '1';
  const d = ['M', start.x, start.y, 'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(
    ' ',
  );
  return d;
}
