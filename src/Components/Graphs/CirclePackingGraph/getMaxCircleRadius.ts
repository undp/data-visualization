export function getMaxCircleRadius(
  values: (number | undefined | null)[],
  width: number,
  height: number,
) {
  const filteredValues = values.filter(d => d !== undefined && d !== null);
  const containerRadius = Math.min(width, height) / 2;
  const totalValue = filteredValues.reduce((sum, v) => sum + v, 0);
  const maxValue = Math.max(...filteredValues);
  const getPackingEfficiency = (n: number) => {
    if (n <= 5) return 0.9;
    if (n <= 10) return 0.85;
    if (n <= 20) return 0.8;
    return 0.7;
  };
  const getEfficiencyBecauseOfContainerRadius = (r: number) => {
    if (r <= 200) return 0.85;
    if (r <= 250) return 0.95;
    return 1;
  };
  return (
    containerRadius *
    Math.sqrt(maxValue / totalValue) *
    getEfficiencyBecauseOfContainerRadius(containerRadius) *
    getPackingEfficiency(filteredValues.length)
  );
}
