import { toPng } from 'html-to-image';
/**
 * Downloads an image of a specified HTML element as a PNG file.
 *
 * Uses `html-to-image` to capture the content of the `node` and converts it to a downloadable PNG image.
 * It removes elements with the class `undp-viz-download-button` from the clone to prevent them from appearing in the screenshot.
 *
 * @param node - The HTMLElement to capture and convert into an image.
 * @param filename - The desired filename for the downloaded image (without extension).
 *
 * @example
 * const element = document.getElementById('myElement');
 * imageDownload(element, 'screenshot');
 */

export function imageDownload(node: HTMLElement, filename: string) {
  toPng(node, {
    quality: 1,
    pixelRatio: 2,
    skipAutoScale: true,
    style: { margin: '0' },
    filter: node => {
      return !node.classList?.contains('undp-viz-download-button');
    },
  })
    .then((dataUrl: string) => {
      const link = document.createElement('a');
      link.download = `${filename}.png`;
      link.href = dataUrl;
      link.click();
    })
    .catch(error => {
      console.error('Error generating image:', error);
    });
}
