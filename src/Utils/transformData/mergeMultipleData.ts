/* eslint-disable @typescript-eslint/no-explicit-any */

function standardizeId(data: any, idColumnName: string) {
  return data.map((item: any) => {
    const newItem = { ...item };
    newItem['~id'] = newItem[idColumnName];
    return newItem;
  });
}
type Grouped<T> = {
  [key: string]: T[];
};

function groupBy<T extends Record<string, any>>(array: T[], key: keyof T): Grouped<T> {
  return array.reduce((acc, item) => {
    const k = String(item[key]);
    if (!acc[k]) acc[k] = [];
    acc[k].push(item);
    return acc;
  }, {} as Grouped<T>);
}

function flattenArray(dataSets: any) {
  const flattenedArray: any = [];
  dataSets.forEach((dataSet: any) => {
    dataSet.forEach((item: any) => {
      flattenedArray.push(item);
    });
  });
  return flattenedArray;
}

function mergeDataById(dataSets: any, idColumnTitle: string) {
  const uniqueId = groupBy(dataSets, '~id');
  const mergedArray = Object.keys(uniqueId).map(el => {
    const merged = uniqueId[el].reduce((acc, obj) => {
      Object.assign(acc, obj);
      return acc;
    }, {});
    return merged;
  });
  const uniqueKeys = new Set();
  mergedArray.forEach(item => {
    Object.keys(item).forEach(key => {
      uniqueKeys.add(key);
    });
  });
  const defaultStructure: any = {};
  uniqueKeys.forEach((key: any) => {
    defaultStructure[key] = undefined;
  });
  const mergedArrayWithAllKeys = mergedArray.map(item => {
    return { ...defaultStructure, ...item };
  });
  return mergedArrayWithAllKeys.map(el => ({
    ...el,
    [idColumnTitle]: el['~id'],
  }));
}

export function mergeMultipleData(
  dataList: { data: any; idColumn: string }[],
  idColumnTitle?: string,
) {
  const dataListWithStandardizedId = dataList.map((d: any) => {
    const dataWithStandardizedId = standardizeId(d.data, d.idColumn);
    return dataWithStandardizedId;
  });
  const flattenedArray = flattenArray(dataListWithStandardizedId);
  return mergeDataById(flattenedArray, idColumnTitle || '~id');
}
