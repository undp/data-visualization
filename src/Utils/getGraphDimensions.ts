export function getGraphDimensions(
  dimensions: {
    width: number;
    height: number;
  },
  margin: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  },
) {
  const { width, height } = dimensions;
  const graphHeight = height - margin.top - margin.bottom;
  const graphWidth = width - margin.left - margin.right;
  return { graphHeight, graphWidth };
}
