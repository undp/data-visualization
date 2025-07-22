/**
 * Converts an array of strings or numbers into a tilde-separated string with spaces replaced by `+`.
 * Example: `['A B', 'C']` → `'A+B~C'`
 */
const ArrToString = (d: string[] | number[]) => {
  let stringValTemp = '';
  d.forEach(el => {
    stringValTemp += `~${`${el}`.replace(/ /g, '+')}`;
  });
  const stringVal = stringValTemp.substring(1);
  return stringVal;
};

/**
 * Represents a parameter to be embedded in a URL.
 */
interface ParamsProps {
  id: string;
  value: string | boolean | number | string[] | number[];
}

/**
 * Generates an embed link with custom query parameters.
 * @param link - The base URL.
 * @param params - An array of parameters to append.
 * @returns A URL string with encoded query parameters.
 */
export function generateEmbedLink(link: string, params: ParamsProps[]) {
  let queryParams = '';
  params.forEach(d => {
    let paramToString = '';
    switch (typeof d.value) {
      case 'number':
        paramToString = `${d.value}`;
        break;
      case 'boolean':
        paramToString = `${d.value}`;
        break;
      case 'object':
        paramToString = ArrToString(d.value as string[] | number[]);
        break;
      default:
        paramToString = `${d.value}`;
    }
    queryParams += `&${d.id}=${paramToString.replace(/ /g, '+').replaceAll("'", '_')}`;
  });
  return `${link}?${queryParams}`;
}

/**
 * Generates an iframe HTML string using a base link and parameters.
 * @param link - The base URL.
 * @param params - Parameters to convert into query string.
 * @returns A string of iframe HTML.
 */
export function generateIframeCode(link: string, params: ParamsProps[]) {
  return `<iframe src="${generateEmbedLink(
    link,
    params,
  )}" loading="lazy" style="width: 100%; border: 0px none"></iframe>`;
}
