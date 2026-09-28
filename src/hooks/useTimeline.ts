import { format } from 'date-fns/format';
import { parse } from 'date-fns/parse';
import { useEffect, useMemo, useState } from 'react';
import type { TimelineDataType } from '@/Types';
import { getSliderMarks } from '@/Utils/getSliderMarks';

export function useTimeline(data: { date?: string | number | null }[], timeline: TimelineDataType) {
  const dateFormat = timeline.dateFormat || 'yyyy';

  const uniqDatesSorted = useMemo(() => {
    const dates = [
      ...new Set(
        data.filter((d) => d.date).map((d) => parse(`${d.date}`, dateFormat, new Date()).getTime()),
      ),
    ];
    return dates.sort((a, b) => a - b);
  }, [data, dateFormat]);

  const [play, setPlay] = useState(timeline.autoplay);
  const [index, setIndex] = useState(timeline.autoplay ? 0 : uniqDatesSorted.length - 1);

  useEffect(() => {
    if (!play) return;
    const interval = setInterval(
      () => setIndex((i) => (i < uniqDatesSorted.length - 1 ? i + 1 : 0)),
      (timeline.speed || 2) * 1000,
    );
    return () => clearInterval(interval);
  }, [uniqDatesSorted, play, timeline.speed]);

  const markObj = getSliderMarks(uniqDatesSorted, index, timeline.showOnlyActiveDate, dateFormat);
  const activeDate =
    uniqDatesSorted.length > 0 ? format(new Date(uniqDatesSorted[index]), dateFormat) : undefined;

  return { uniqDatesSorted, index, setIndex, play, setPlay, markObj, activeDate, dateFormat };
}
