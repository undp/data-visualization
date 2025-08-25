import { format } from 'date-fns/format';

export function getSliderMarks(
  dates: number[],
  activeIndex: number,
  showOnlyActiveDate: boolean,
  dateFormat: string,
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markObj: any = {};

  dates.forEach((d, i) => {
    markObj[`${d}`] = {
      style: {
        color: i === activeIndex ? '#232E3D' : '#A9B1B7', // Active text color vs. inactive
        fontWeight: i === activeIndex ? 'bold' : 'normal', // Active font weight vs. inactive
        display: i === activeIndex || !showOnlyActiveDate ? 'inline' : 'none', // Active font weight vs. inactive
      },
      label: format(new Date(d), dateFormat || 'yyyy'),
    };
  });
  return markObj;
}
