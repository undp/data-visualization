import { domToPng } from 'modern-screenshot';
/**
 * Downloads an image of a specified HTML element as a PNG file.
 *
 * Uses `modern-screenshot` to capture the content of the `node` and converts it to a downloadable PNG image.
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
  domToPng(node, {
    quality: 1,
    scale: 2,
    style: { margin: '0' },
    features: {
      copyScrollbar: false,
    },
    filter: node => {
      if (node instanceof Element) {
        return !node.classList.contains('undp-viz-download-button');
      }
      return true; // Include non-Element nodes
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
