/**
 * Parses query parameters from the current browser URL.
 *
 * @returns An array of objects containing each query parameter and its value.
 * If a value contains the `~` delimiter, it will be returned as a string array.
 *
 * - Replaces `+` with spaces and `_` with `'`.
 * - Splits values by `~` to support array-style data.
 *
 * @example
 * getQueryParamsFromLink();
 */
export function getQueryParamsFromLink() {
  const params: {
    param: string;
    value: string | string[];
  }[] = [];
  new URL(window.location.href).searchParams.forEach((value, param) => {
    params.push({
      param,
      value:
        value.replaceAll('+', ' ').replaceAll('_', "'").split('~').length > 1
          ? value.replaceAll('+', ' ').replaceAll('_', "'").split('~')
          : value.replaceAll('+', ' ').replaceAll('_', "'"),
    });
  });
  return params;
}
