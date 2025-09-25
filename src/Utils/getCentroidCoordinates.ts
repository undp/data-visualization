import area from '@turf/area';
import centerOfMass from '@turf/center-of-mass';
import { Feature, Polygon, MultiPolygon, GeoJsonProperties } from 'geojson';

export function getCentroidCoordinates(
  multiPolygonFeature: Feature<Polygon | MultiPolygon, GeoJsonProperties>,
  centerLargestPolygon = true,
) {
  if (multiPolygonFeature.geometry.type === 'Polygon' || centerLargestPolygon === false) {
    return centerOfMass(multiPolygonFeature).geometry.coordinates;
  }

  if (multiPolygonFeature.geometry.type === 'MultiPolygon') {
    let maxArea = 0;
    let largestPolygon: Feature<Polygon, GeoJsonProperties> | null = null;

    for (const coords of multiPolygonFeature.geometry.coordinates) {
      const poly: Feature<Polygon, GeoJsonProperties> = {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: coords,
        },
        properties: {},
      };

      const polyArea = area(poly);
      if (polyArea > maxArea) {
        maxArea = polyArea;
        largestPolygon = poly;
      }
    }

    return centerOfMass(largestPolygon).geometry.coordinates;
  }

  throw new Error('Unsupported geometry type');
}
