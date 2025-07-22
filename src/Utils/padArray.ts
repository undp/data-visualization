export const padNumberArray = (arr: number[], noOfSteps: number) => {
  const arrTemp = [...arr];
  while (arrTemp.length < noOfSteps) {
    arrTemp.push(arrTemp[arrTemp.length - 1]);
  }
  return arrTemp;
};

export const padStringArray = (arr: string[], noOfSteps: number) => {
  const arrTemp = [...arr];
  while (arrTemp.length < noOfSteps) {
    arrTemp.push(arrTemp[arrTemp.length - 1]);
  }
  return arrTemp;
};
