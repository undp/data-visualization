export function wideToLongTransformation(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any,
  keyColumn: string,
  readableHeader: {
    value: string;
    label: string;
  }[],
  debugMode?: boolean,
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const transformedData: any = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data.forEach((row: any) => {
    Object.entries(row).forEach(([key, value]) => {
      if (key !== keyColumn) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const obj: any = {
          indicator:
            readableHeader.findIndex(d => d.value === key) !== -1
              ? readableHeader[readableHeader.findIndex(d => d.value === key)].label
              : key,
          value,
        };
        obj[keyColumn] = row[keyColumn];
        transformedData.push(obj);
      }
    });
  });
  if (debugMode) {
    // eslint-disable-next-line no-console
    console.log(transformedData);
  }
  return transformedData;
}
