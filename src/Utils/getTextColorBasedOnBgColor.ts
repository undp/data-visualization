function getRGB(rgbString: string) {
  const regex = /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/;
  const result = regex.exec(rgbString);
  if (result) {
    const r = parseInt(result[1], 10);
    const g = parseInt(result[2], 10);
    const b = parseInt(result[3], 10);
    return { r, g, b };
  }
  throw new Error('Invalid RGB string format');
}

function getRGBFromHex(hexValue: string) {
  const hex = hexValue.replace(/^#/, '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return { r, g, b };
}

function getLuminance(r: number, g: number, b: number) {
  const normalizedR = r / 255;
  const normalizedG = g / 255;
  const normalizedB = b / 255;

  const adjustedR =
    normalizedR <= 0.03928 ? normalizedR / 12.92 : ((normalizedR + 0.055) / 1.055) ** 2.4;
  const adjustedG =
    normalizedG <= 0.03928 ? normalizedG / 12.92 : ((normalizedG + 0.055) / 1.055) ** 2.4;
  const adjustedB =
    normalizedB <= 0.03928 ? normalizedB / 12.92 : ((normalizedB + 0.055) / 1.055) ** 2.4;

  return 0.2126 * adjustedR + 0.7152 * adjustedG + 0.0722 * adjustedB;
}

/**
 * Returns a contrasting text color (`#000` or `#fff`) based on the given background color.
 *
 * @param bgColor - A background color string in either hex (e.g., `#ffffff`) or RGB format (e.g., `rgb(255,255,255)`).
 * @returns `'#000'` for light backgrounds, `'#fff'` for dark backgrounds.
 *
 * @example
 * getTextColorBasedOnBgColor('#000000'); // "#fff"
 * getTextColorBasedOnBgColor('rgb(255,255,255)'); // "#000"
 */

export const getTextColorBasedOnBgColor = (bgColor: string) => {
  try {
    const rgb = bgColor[0] === 'r' ? getRGB(bgColor) : getRGBFromHex(bgColor);
    const luminance = getLuminance(rgb.r, rgb.g, rgb.b);
    return luminance > 0.4 ? '#000' : '#fff';
  } catch {
    return '#fff';
  }
};
