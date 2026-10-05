interface CoordinatesProps {
  id: number;
  x: number;
  y: number;
  distanceFromCenter: number;
}

interface Props {
  noOfPoints: number;
  pointRadius?: number;
  outerRadius?: number;
  innerRadius?: number;
  padding?: number;
  noOfTicks?: number;
  random?: () => number;
  verticalRange?: [number, number];
  horizontalRange?: [number, number];
  angleRange?: [number, number];
}

export const getScatteredCircleCoordinates = ({
  outerRadius = 500,
  noOfPoints,
  pointRadius = 6,
  innerRadius = 0,
  padding = 1,
  noOfTicks = 1000,
  random = Math.random,
  verticalRange = [0, 1],
  horizontalRange = [0, 1],
  angleRange = [0, 2 * Math.PI],
}: Props): CoordinatesProps[] => {
  const rMin = innerRadius + pointRadius;
  const rMax = Math.max(rMin, outerRadius - pointRadius);
  const verticalRangePoint = [
    Math.max(verticalRange[0], 0) * outerRadius * 2,
    Math.min(verticalRange[1], 1) * outerRadius * 2,
  ];
  const horizontalRangePoint = [
    Math.max(horizontalRange[0], 0) * outerRadius * 2,
    Math.min(horizontalRange[1], 1) * outerRadius * 2,
  ];
  const xMin = horizontalRangePoint[0] - outerRadius + pointRadius;
  const xMax = horizontalRangePoint[1] - outerRadius - pointRadius;
  const yMin = verticalRangePoint[0] - outerRadius + pointRadius;
  const yMax = verticalRangePoint[1] - outerRadius - pointRadius;

  const minDist = 2 * pointRadius + padding;
  const minDistanceSquared = minDist * minDist;

  const grid = new Map<string, CoordinatesProps[]>();
  const getNearestDistanceSquared = (x: number, y: number) => {
    const cx = Math.floor(x / minDist);
    const cy = Math.floor(y / minDist);
    let best = minDistanceSquared;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const bucket = grid.get(`${cx + i},${cy + j}`);
        if (!bucket) continue;
        for (const p of bucket) {
          const dx = p.x - x;
          const dy = p.y - y;
          best = Math.min(best, dx * dx + dy * dy);
        }
      }
    }
    return best;
  };

  const sampleInRange = () => {
    const x = random() * (xMax - xMin) + xMin;
    const y = random() * (yMax - yMin) + yMin;
    return { x, y, d: Math.hypot(x, y) };
  };

  const points: CoordinatesProps[] = [];

  while (points.length < noOfPoints) {
    let best = {
      x: 0,
      y: 0,
      d: 0,
      nearestDistanceSquared: -Infinity,
    };

    for (let tick = 0; tick <= noOfTicks; tick++) {
      const angle = angleRange[0] + random() * (angleRange[1] - angleRange[0]);
      const d = random() * (rMax - rMin) + rMin;
      const x = d * Math.cos(angle);
      const y = d * Math.sin(angle);
      if (x < xMin || x > xMax || y < yMin || y > yMax) continue; // out of range, try again

      const nearestDistanceSquared = getNearestDistanceSquared(x, y);
      if (nearestDistanceSquared > best.nearestDistanceSquared)
        best = { x, y, d, nearestDistanceSquared };
      if (nearestDistanceSquared >= minDistanceSquared) break;
    }

    if (best.nearestDistanceSquared === -Infinity) {
      console.warn(
        'No valid positions found inside the given x/y range, therefore placing point inside the range only.',
      );
      const { x, y, d } = sampleInRange();
      best = { x, y, d, nearestDistanceSquared: getNearestDistanceSquared(x, y) };
    }
    const point = { id: points.length, x: best.x, y: best.y, distanceFromCenter: 0 };
    points.push(point);
    const k = `${Math.floor(point.x / minDist)},${Math.floor(point.y / minDist)}`;
    if (!grid.has(k)) grid.set(k, []);
    grid.get(k)?.push(point);
  }

  return points.map((p) => ({ ...p, x: p.x + outerRadius, y: p.y + outerRadius }));
};
