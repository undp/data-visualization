export function wideToLongTransformation(
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  data: any,
  keyColumn: string,
  readableHeader: {
    value: string;
    label: string;
  }[],
  debugMode?: boolean,
) {
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  const transformedData: any = [];
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  data.forEach((row: any) => {
    Object.entries(row).forEach(([key, value]) => {
      if (key !== keyColumn) {
        // biome-ignore lint/suspicious/noExplicitAny: undefined data type
        const obj: any = {
          indicator:
            readableHeader.findIndex((d) => d.value === key) !== -1
              ? readableHeader[readableHeader.findIndex((d) => d.value === key)].label
              : key,
          value,
        };
        obj[keyColumn] = row[keyColumn];
        transformedData.push(obj);
      }
    });
  });
  if (debugMode) {
    // biome-ignore lint/suspicious/noConsole: This is for debug mode
    console.log(transformedData);
  }
  return transformedData;
}
