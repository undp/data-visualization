import { useEffect, useRef, useState } from 'react';

export function useElementSize<T extends HTMLElement = HTMLDivElement>(
  defaultWidth = 620,
  defaultHeight = 480,
) {
  const graphDiv = useRef<T>(null);
  const [size, setSize] = useState({
    width: defaultWidth,
    height: defaultHeight,
    radius: Math.min(defaultWidth, defaultHeight) / 2,
  });

  useEffect(() => {
    if (!graphDiv.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      const el = entries[0].target;
      setSize({
        width: el.clientWidth || defaultWidth,
        height: el.clientHeight || defaultHeight,
        radius: Math.min(el.clientWidth || defaultWidth, el.clientHeight || defaultHeight) / 2,
      });
    });
    resizeObserver.observe(graphDiv.current);
    return () => resizeObserver.disconnect();
  }, [defaultWidth, defaultHeight]);

  return { graphDiv, svgWidth: size.width, svgHeight: size.height, graphRadius: size.radius };
}
