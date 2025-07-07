import { useRef, useEffect, useState } from 'react';
import * as maplibreGl from 'maplibre-gl';
import * as pmtiles from 'pmtiles';
import 'maplibre-gl/dist/maplibre-gl.css';
import { select } from 'd3-selection';
import {
  DndContext,
  useDraggable,
  useSensor,
  useSensors,
  PointerSensor,
  DragMoveEvent,
} from '@dnd-kit/core';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import React from 'react';

import { ChevronLeftRight, X } from '@/Components/Icons';
import { string2HTML } from '@/Utils/string2HTML';

interface Props {
  width: number;
  height: number;
  mapStyles: [string, string];
  center: [number, number];
  mapLegend?: string | React.ReactNode;
  zoomLevel: number;
}

function synchronizeMap(map1: maplibreGl.Map, map2: maplibreGl.Map) {
  let isSyncing = false;
  function syncMap(sourceMap: maplibreGl.Map, targetMap: maplibreGl.Map) {
    if (!isSyncing) {
      isSyncing = true;
      const center = sourceMap.getCenter();
      const zoom = sourceMap.getZoom();
      const bearing = sourceMap.getBearing();
      const pitch = sourceMap.getPitch();
      targetMap.jumpTo({
        center,
        zoom,
        bearing,
        pitch,
      });
      isSyncing = false;
    }
  }

  // Event listeners for map1
  map1.on('move', () => {
    syncMap(map1, map2);
  });

  // Event listeners for map2
  map2.on('move', () => {
    syncMap(map2, map1);
  });
}

export function Graph(props: Props) {
  const { height, width, mapStyles, center, zoomLevel, mapLegend } = props;
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showLegend, setShowLegend] = useState(true);
  const dragStartPositionRef = useRef(50);
  const sliderWidthRef = useRef(0);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 0 } }));

  const handleDragStart = () => {
    setIsDragging(true);
    dragStartPositionRef.current = position;

    if (containerRef.current) {
      sliderWidthRef.current = containerRef.current.getBoundingClientRect().width;
    }
  };

  const handleDragMove = (event: DragMoveEvent) => {
    if (!containerRef.current || sliderWidthRef.current === 0) return;

    // Calculate position change as percentage of width
    const deltaPercentage = (event.delta.x / sliderWidthRef.current) * 100;
    const newPosition = Math.max(0, Math.min(100, dragStartPositionRef.current + deltaPercentage));

    setPosition(newPosition);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newPosition = (clickX / rect.width) * 100;

    setPosition(Math.max(0, Math.min(100, newPosition)));
  };
  const graphDiv = useRef<HTMLDivElement>(null);
  const leftMapRef = useRef<HTMLDivElement>(null);
  const rightMapRef = useRef<HTMLDivElement>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (mapContainer.current && leftMapRef.current && rightMapRef.current && width) {
      const mapDiv = select(mapContainer.current);
      mapDiv.selectAll('.maplibregl-compare').remove();
      const leftMapDiv = select(leftMapRef.current);
      leftMapDiv.selectAll('div').remove();
      const rightMapDiv = select(rightMapRef.current);
      rightMapDiv.selectAll('div').remove();
      const protocol = new pmtiles.Protocol();
      maplibreGl.addProtocol('pmtiles', protocol.tile);
      const leftMap = new maplibreGl.Map({
        container: leftMapRef.current,
        style: mapStyles[0],
        center: center || [0, 0],
        zoom: zoomLevel || 4,
      });

      const rightMap = new maplibreGl.Map({
        container: rightMapRef.current,
        style: mapStyles[1],
        center: center || [0, 0],
        zoom: zoomLevel || 4,
      });
      rightMap.addControl(
        new maplibreGl.NavigationControl({
          visualizePitch: true,
          showZoom: true,
          showCompass: true,
        }),
        'bottom-right',
      );
      leftMap.addControl(new maplibreGl.ScaleControl(), 'bottom-left');
      leftMap.addControl(
        new maplibreGl.NavigationControl({
          visualizePitch: true,
          showZoom: true,
          showCompass: true,
        }),
        'bottom-right',
      );
      rightMap.addControl(new maplibreGl.ScaleControl(), 'bottom-left');
      synchronizeMap(leftMap, rightMap);
    }
  }, [width, mapStyles, center, zoomLevel]);
  return (
    <div
      className='flex flex-col grow justify-center leading-0'
      ref={graphDiv}
      aria-label='Map area'
    >
      <div
        style={{
          width,
          height,
        }}
      >
        <div
          ref={mapContainer}
          className='map maplibre-show-control relative w-full h-full'
          style={{ inset: 0 }}
        >
          <DndContext
            sensors={sensors}
            modifiers={[restrictToHorizontalAxis]}
            onDragStart={handleDragStart}
            onDragMove={handleDragMove}
            onDragEnd={handleDragEnd}
          >
            <div
              ref={containerRef}
              style={{
                position: 'relative',
                width,
                height,
                overflow: 'hidden',
                cursor: isDragging ? 'grabbing' : 'col-resize',
                userSelect: 'none', // Prevent text selection during drag
              }}
              onClick={handleClick}
            >
              <div
                ref={rightMapRef}
                className='absolute h-full rightMap w-full'
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  clipPath: `polygon(${position}% 0%, ${position}% 100%, 100% 100%, 100% 0%)`,
                }}
              />
              <div
                ref={leftMapRef}
                className='absolute h-full leftMap w-full'
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  inset: 0,
                  clipPath: `polygon(0% 0%, ${position}% 0%, ${position}% 100%, 0% 100%)`,
                }}
              />

              <SliderHandle position={position} />
            </div>
          </DndContext>
        </div>
      </div>
      {mapLegend ? (
        <div className='absolute left-[22px] bottom-13'>
          {showLegend ? (
            <>
              <div
                style={{
                  backgroundColor: 'rgba(240,240,240, 0.7)',
                  border: '1px solid var(--gray-400)',
                  borderRadius: '999px',
                  width: '24px',
                  height: '24px',
                  padding: '3px',
                  cursor: 'pointer',
                  zIndex: 10,
                  position: 'absolute',
                  right: '-0.75rem',
                  top: '-0.75rem',
                }}
                onClick={() => {
                  setShowLegend(false);
                }}
              >
                <X />
              </div>
              <div
                className='p-2'
                style={{
                  backgroundColor: 'rgba(240,240,240, 0.7)',
                }}
                dangerouslySetInnerHTML={
                  typeof mapLegend === 'string' ? { __html: string2HTML(mapLegend) } : undefined
                }
              >
                {React.isValidElement(mapLegend) ? mapLegend : null}
              </div>
            </>
          ) : (
            <button
              type='button'
              className='mb-0 border-0 bg-transparent p-0 self-start'
              onClick={() => {
                setShowLegend(true);
              }}
            >
              <div className='items-start text-sm font-medium cursor-pointer p-2 mb-0 flex text-primary-black dark:text-primary-gray-300 bg-primary-gray-300 dark:bg-primary-gray-550 border-primary-gray-400 dark:border-primary-gray-500'>
                Show Legend
              </div>
            </button>
          )}
        </div>
      ) : null}
    </div>
  );
}

interface HandleProps {
  position: number;
}

function SliderHandle(props: HandleProps) {
  const { position } = props;
  const { attributes, listeners, setNodeRef } = useDraggable({ id: 'slider-handle' });

  return (
    <div
      ref={setNodeRef}
      style={{
        position: 'absolute',
        left: `${position}%`,
        top: 0,
        bottom: 0,
        width: '40px',
        transform: 'translateX(-50%)',
        cursor: 'col-resize',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        touchAction: 'none',
      }}
      {...listeners}
      {...attributes}
    >
      <div
        className='h-full bg-primary-blue-600 dark:bg-primary-blue-400'
        style={{ width: '2px' }}
      />
      <div
        className='flex bg-primary-blue-600 dark:bg-primary-blue-400 rounded-full absolute items-center justify-center text-primary-white font-primary-white'
        style={{
          boxShadow: 'inset 0 0 0 1px #fff',
          width: '42px',
          height: '42px',
          top: 'calc(50% - 21px)',
          left: '0',
          cursor: 'col-resize',
        }}
      >
        <ChevronLeftRight />
      </div>
    </div>
  );
}
