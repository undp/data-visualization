// biome-ignore lint/suspicious/noExplicitAny: undefined data type
function standardizeId(data: any, idColumnName: string) {
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  return data.map((item: any) => {
    const newItem = { ...item };
    newItem['~id'] = newItem[idColumnName];
    return newItem;
  });
}
type Grouped<T> = {
  [key: string]: T[];
};

// biome-ignore lint/suspicious/noExplicitAny: undefined data type
function groupBy<T extends Record<string, any>>(array: T[], key: keyof T): Grouped<T> {
  return array.reduce(
    (acc, item) => {
      const k = String(item[key]);
      if (!acc[k]) acc[k] = [];
      acc[k].push(item);
      return acc;
    },
    {} as Grouped<T>,
  );
}

// biome-ignore lint/suspicious/noExplicitAny: undefined data type
function flattenArray(dataSets: any) {
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  const flattenedArray: any = [];
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  dataSets.forEach((dataSet: any) => {
    // biome-ignore lint/suspicious/noExplicitAny: undefined data type
    dataSet.forEach((item: any) => {
      flattenedArray.push(item);
    });
  });
  return flattenedArray;
}

// biome-ignore lint/suspicious/noExplicitAny: undefined data type
function mergeDataById(dataSets: any, idColumnTitle: string) {
  const uniqueId = groupBy(dataSets, '~id');
  const mergedArray = Object.keys(uniqueId).map((el) => {
    const merged = uniqueId[el].reduce((acc, obj) => {
      Object.assign(acc, obj);
      return acc;
    }, {});
    return merged;
  });
  const uniqueKeys = new Set();
  mergedArray.forEach((item) => {
    Object.keys(item).forEach((key) => {
      uniqueKeys.add(key);
    });
  });
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  const defaultStructure: any = {};
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  uniqueKeys.forEach((key: any) => {
    defaultStructure[key] = undefined;
  });
  const mergedArrayWithAllKeys = mergedArray.map((item) => {
    return { ...defaultStructure, ...item };
  });
  return mergedArrayWithAllKeys.map((el) => ({
    ...el,
    [idColumnTitle]: el['~id'],
  }));
}

export function mergeMultipleData(
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  dataList: { data: any; idColumn: string }[],
  idColumnTitle?: string,
) {
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  const dataListWithStandardizedId = dataList.map((d: any) => {
    const dataWithStandardizedId = standardizeId(d.data, d.idColumn);
    return dataWithStandardizedId;
  });
  const flattenedArray = flattenArray(dataListWithStandardizedId);
  return mergeDataById(flattenedArray, idColumnTitle || '~id');
}
