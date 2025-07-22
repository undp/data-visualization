interface Coordinates {
  x: number;
  y: number;
}

export function getLineEndPoint(startPoint: Coordinates, targetPoint: Coordinates, radius: number) {
  const circleCenter = { x: targetPoint.x, y: targetPoint.y };
  const directionVector = {
    x: startPoint.x - circleCenter.x,
    y: startPoint.y - circleCenter.y,
  };
  const magnitude = Math.sqrt(directionVector.x ** 2 + directionVector.y ** 2);
  const unitVector = {
    x: directionVector.x / magnitude,
    y: directionVector.y / magnitude,
  };
  return {
    x: circleCenter.x + radius * unitVector.x,
    y: circleCenter.y + radius * unitVector.y,
  };
}
