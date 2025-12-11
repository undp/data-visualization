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

export function getArc(
  x: number,
  y: number,
  radius: number,
  startAngleInRadians: number,
  endAngleInRadians: number,
) {
  const start = polarToCartesian(x, y, radius, startAngleInRadians);
  const end = polarToCartesian(
    x,
    y,
    radius,
    endAngleInRadians === 2 * Math.PI ? 1.9999999999 * Math.PI : endAngleInRadians,
  );
  const largeArcFlag = endAngleInRadians - startAngleInRadians <= Math.PI ? '0' : '1';
  const d = ['M', start.x, start.y, 'A', radius, radius, 0, largeArcFlag, 1, end.x, end.y].join(
    ' ',
  );
  return d;
}
