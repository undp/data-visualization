import type { FeatureCollection, Geometry } from 'geojson';
import { feature } from 'topojson-client';
import type { Topology } from 'topojson-specification';

/**
 * Converts a TopoJSON object to a GeoJSON object.
 * @param topoJson The TopoJSON object to convert.
 * @param key The key of the object to convert.
 * @returns The GeoJSON object.
 */
export function convertTopoJsonToGeoJson(
  topoJson: Topology,
  key: string,
): FeatureCollection<Geometry> {
  return feature(topoJson, topoJson.objects[key]) as FeatureCollection<Geometry>;
}

export function convertTopoJsonUrlToGeoJson(
  url: string,
  key: string,
): Promise<FeatureCollection<Geometry>> {
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch TopoJSON: ${response.status} ${response.statusText}`);
      }
      return response.json();
    })
    .then((topoJson: Topology) => {
      const geoJson = feature(topoJson, topoJson.objects[key]);
      return geoJson as FeatureCollection<Geometry>;
    });
}
