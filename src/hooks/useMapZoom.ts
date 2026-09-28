import { select } from 'd3-selection';
import { type D3ZoomEvent, type ZoomBehavior, zoom } from 'd3-zoom';
import { type RefObject, useCallback, useEffect, useRef } from 'react';
import type { ZoomInteractionTypes } from '@/Types';

interface UseMapZoomOptions {
  mapSvg: RefObject<SVGSVGElement | null>;
  mapG: RefObject<SVGGElement | null>;
  width: number;
  height: number;
  zoomInteraction: ZoomInteractionTypes;
  zoomScaleExtend: [number, number];
  zoomTranslateExtend?: [[number, number], [number, number]];
}

export function useMapZoom({
  mapSvg,
  mapG,
  width,
  height,
  zoomInteraction,
  zoomScaleExtend,
  zoomTranslateExtend,
}: UseMapZoomOptions) {
  const zoomRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const [minScale, maxScale] = zoomScaleExtend;
  const translateExtentKey = zoomTranslateExtend?.flat().join(',') ?? '';
  useEffect(() => {
    if (!mapSvg.current || !mapG.current) return;

    const svgSelect = select<SVGSVGElement, unknown>(mapSvg.current);
    const gSelect = select(mapG.current);

    const zoomFilter = (e: D3ZoomEvent<SVGSVGElement, unknown>['sourceEvent']) => {
      if (zoomInteraction === 'noZoom') return false;
      if (zoomInteraction === 'button') return !e.type.includes('wheel');
      const isWheel = e.type === 'wheel';
      const isTouch = e.type.startsWith('touch');
      const isDrag = e.type === 'mousedown' || e.type === 'mousemove';

      if (isTouch) return true;
      if (isWheel) {
        if (zoomInteraction === 'scroll') return true;
        return e.ctrlKey;
      }
      return isDrag && !e.button && !e.ctrlKey;
    };

    const zoomBehavior = zoom<SVGSVGElement, unknown>()
      .scaleExtent([minScale, maxScale])
      .translateExtent(
        zoomTranslateExtend || [
          [-20, -20],
          [width + 20, height + 20],
        ],
      )
      .filter(zoomFilter)
      .on('zoom', ({ transform }) => {
        gSelect.attr('transform', transform.toString());
      });

    svgSelect.call(zoomBehavior);
    zoomRef.current = zoomBehavior;

    return () => {
      svgSelect.on('.zoom', null);
      zoomRef.current = null;
    };
  }, [mapSvg, mapG, width, height, zoomInteraction, minScale, maxScale, translateExtentKey]);

  const handleZoom = useCallback(
    (direction: 'in' | 'out') => {
      if (!mapSvg.current || !zoomRef.current) return;
      select<SVGSVGElement, unknown>(mapSvg.current).call(
        zoomRef.current.scaleBy,
        direction === 'in' ? 1.2 : 1 / 1.2,
      );
    },
    [mapSvg],
  );

  return { zoomRef, handleZoom };
}
