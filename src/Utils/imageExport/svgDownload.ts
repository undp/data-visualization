import { elementToSVG } from 'dom-to-svg';
/**
 * Downloads an SVG representation of a specified HTML element.
 *
 * Converts the HTML element into an SVG format using the `dom-to-svg` library, serializes it to a string,
 * and creates a downloadable `.svg` file.
 *
 * @param node - The HTMLElement to convert to SVG and download.
 * @param filename - The desired filename for the downloaded SVG file (without extension).
 *
 * @example
 * const element = document.getElementById('myElement');
 * svgDownload(element, 'downloaded-svg');
 */
export function svgDownload(node: HTMLElement, filename: string) {
  const svgDocument = elementToSVG(node);
  const serializer = new XMLSerializer();
  const xmlString = serializer.serializeToString(svgDocument);
  const blob = new Blob([xmlString], { type: 'application/xml' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = `${filename}.svg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
