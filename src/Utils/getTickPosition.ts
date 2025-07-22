export function getTickPositions(count: number, width: number) {
  if (count < 2) return [];
  const step = width / (count - 1);
  return Array.from({ length: count }, (_, i) => i * step);
}
