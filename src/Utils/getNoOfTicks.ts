export function getNoOfTicks(width: number) {
  if (width < 360) return 2;
  if (width < 520) return 5;
  return 10;
}
