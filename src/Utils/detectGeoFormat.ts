type GeoFormat = 'topojson' | 'geojson' | 'unknown';

const GEOJSON_TYPES = new Set([
  'FeatureCollection',
  'Feature',
  'Point',
  'MultiPoint',
  'LineString',
  'MultiLineString',
  'Polygon',
  'MultiPolygon',
  'GeometryCollection',
]);

export function detectGeoFormat(data: unknown): GeoFormat {
  if (!data || typeof data !== 'object') return 'unknown';
  const d = data as Record<string, unknown>;

  if (
    d.type === 'Topology' &&
    d.objects &&
    typeof d.objects === 'object' &&
    Array.isArray(d.arcs)
  ) {
    return 'topojson';
  }

  if (typeof d.type === 'string' && GEOJSON_TYPES.has(d.type)) {
    return 'geojson';
  }

  return 'unknown';
}
