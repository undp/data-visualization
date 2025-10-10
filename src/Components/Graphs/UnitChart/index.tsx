import { useRef } from 'react';
import sum from 'lodash.sum';
import { H2, P } from '@undp/design-system-react/Typography';
import { AnimatePresence, motion, useInView } from 'motion/react';
import { cn } from '@undp/design-system-react/cn';

import { GraphFooter } from '@/Components/Elements/GraphFooter';
import { GraphHeader } from '@/Components/Elements/GraphHeader';
import { Colors } from '@/Components/ColorPalette';
import {
  UnitChartDataType,
  SourcesDataType,
  Languages,
  StyleObject,
  ClassNameObject,
  AnimateDataType,
} from '@/Types';
import { numberFormattingFunction } from '@/Utils/numberFormattingFunction';

interface Props {
  // Data
  /** Array of data objects */
  data: UnitChartDataType[];

  // Titles, Labels, and Sources
  /** Title of the graph */
  graphTitle?: string | React.ReactNode;
  /** Description of the graph */
  graphDescription?: string | React.ReactNode;
  /** Note with h2 tag just above the graph. Can be used to highlight text */
  note?: string;
  /** Footnote for the graph */
  footNote?: string | React.ReactNode;
  /** Source data for the graph */
  sources?: SourcesDataType[];
  /** Accessibility label */
  ariaLabel?: string;

  // Colors and Styling
  /** Colors of the highlighted circles */
  colors?: string[];
  /** Background color of the graph */
  backgroundColor?: string | boolean;
  /** Custom styles for the graph. Each object should be a valid React CSS style object. */
  styles?: StyleObject;
  /** Custom class names */
  classNames?: ClassNameObject;

  // Size and Spacing
  /** Width of the graph */
  width?: number;
  /** Height of the graph */
  height?: number;
  /** Minimum height of the graph */
  minHeight?: number;
  /** Relative height scaling factor. This overwrites the height props */
  relativeHeight?: number;
  /** Padding around the graph. Defaults to 0 if no backgroundColor is mentioned else defaults to 1rem */
  padding?: string;

  // Graph Parameters
  /** Size of the visualization */
  size?: number;
  /** No. of dots in a single row */
  gridSize?: number;
  /** Spacing between 2 dots */
  unitPadding?: number;
  /** Total no. of dot that are rendered in the chart */
  totalNoOfDots?: number;
  /** Toggle visibility of stroke for the unfilled dots */
  showStrokeForWhiteDots?: boolean;
  /** Toggles if the graph animates in when loaded.  */
  animate?: boolean | AnimateDataType;
  /** Toggle visibility of color scale */
  showColorScale?: boolean;
  /** Specifies the number of decimal places to display in the value. */
  precision?: number;
  /** Enable graph download option as png */
  graphDownload?: boolean;
  /** Enable data download option as a csv */
  dataDownload?: boolean;

  // Configuration and Options
  /** Language setting  */
  language?: Languages;
  /** Color theme */
  theme?: 'light' | 'dark';
  /** Unique ID for the graph */
  graphID?: string;
}

export function UnitChart(props: Props) {
  const {
    data,
    size = 200,
    graphTitle,
    sources,
    colors = Colors.light.categoricalColors.colors,
    graphDescription,
    totalNoOfDots = 100,
    unitPadding = 3,
    gridSize = 10,
    footNote,
    padding,
    backgroundColor = false,
    graphID,
    graphDownload = false,
    language = 'en',
    showColorScale = true,
    showStrokeForWhiteDots = true,
    note,
    dataDownload = false,
    theme = 'light',
    width,
    height,
    minHeight = 0,
    relativeHeight,
    ariaLabel,
    styles,
    classNames,
    animate = false,
    precision = 2,
  } = props;
  const svgRef = useRef(null);
  const animateValue =
    animate === true
      ? { duration: 0.5, once: true, amount: 0.5 }
      : animate || { duration: 0, once: true, amount: 0 };
  const isInView = useInView(svgRef, {
    once: animateValue.once,
    amount: animateValue.amount,
  });
  const totalValue = sum(data.map(d => d.value));
  const graphParentDiv = useRef<HTMLDivElement>(null);
  const gridDimension = size / gridSize;
  const radius = (gridDimension - unitPadding * 2) / 2;
  if (radius <= 0) {
    console.error(
      'The size of single unit is less than or equal to zero. Check values for ((dimension / gridSize) - (padding * 2)) / 2 is not less than or equal to 0.',
    );
    return null;
  }

  const cellsData: { color: string }[] = [];
  data.forEach((item, index) => {
    const count = Math.round((item.value / totalValue) * totalNoOfDots);
    for (let i = 0; i < count; i += 1) {
      cellsData.push({ color: colors[index] });
    }
  });
  return (
    <div
      className={`${theme || 'light'} flex  ${width ? 'w-fit grow-0' : 'w-full grow'}`}
      dir={language === 'he' || language === 'ar' ? 'rtl' : undefined}
    >
      <div
        className={cn(
          `${
            !backgroundColor
              ? 'bg-transparent '
              : backgroundColor === true
                ? 'bg-primary-gray-200 dark:bg-primary-gray-650 '
                : ''
          }ml-auto mr-auto flex flex-col grow h-inherit ${language || 'en'}`,
          width ? 'w-fit' : 'w-full',
          classNames?.graphContainer,
        )}
        style={{
          ...(styles?.graphContainer || {}),
          minHeight: 'inherit',
          ...(backgroundColor && backgroundColor !== true ? { backgroundColor } : {}),
        }}
        id={graphID}
        ref={graphParentDiv}
        aria-label={
          ariaLabel ||
          `${graphTitle ? `The graph shows ${graphTitle}. ` : ''}${
            graphDescription ? ` ${graphDescription}` : ''
          }`
        }
      >
        <div
          className='flex grow'
          style={{ padding: backgroundColor ? padding || '1rem' : padding || 0 }}
        >
          <div className='flex flex-col gap-3 w-full grow'>
            {graphTitle || graphDescription || graphDownload ? (
              <GraphHeader
                styles={{
                  title: styles?.title,
                  description: styles?.description,
                }}
                classNames={{
                  title: classNames?.title,
                  description: classNames?.description,
                }}
                graphTitle={graphTitle}
                graphDescription={graphDescription}
                width={width}
                graphDownload={graphDownload ? graphParentDiv.current : undefined}
                dataDownload={
                  dataDownload
                    ? data.map(d => d.data).filter(d => d !== undefined).length > 0
                      ? data.map(d => d.data).filter(d => d !== undefined)
                      : data.filter(d => d !== undefined)
                    : null
                }
              />
            ) : null}
            {note ? (
              <H2
                marginBottom='2xs'
                className='text-primary-gray-700 dark:text-primary-gray-100 font-bold'
                style={{ width: width ? `${width}px` : '100%' }}
              >
                {note}
              </H2>
            ) : null}
            <div className='flex grow flex-col gap-4 justify-between'>
              <div>
                {showColorScale ? (
                  <div
                    className='mb-4 leading-0'
                    style={{ width: width ? `${width}px` : '100%' }}
                    aria-label='Color legend'
                  >
                    <div className='flex mb-0 flex-wrap gap-x-4 gap-y-1'>
                      {data.map((d, i) => (
                        <div className='flex gap-2 items-center' key={i}>
                          <div
                            className='w-3 h-3 rounded-full'
                            style={{ backgroundColor: colors[i] }}
                          />
                          <P
                            marginBottom='none'
                            size='sm'
                            className='text-primary-gray-700 dark:text-primary-gray-100'
                          >
                            {d.label}:{' '}
                            <span className='font-bold'>
                              {numberFormattingFunction(d.value, 'NA', precision)}
                            </span>
                          </P>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
                <div aria-label='Graph area'>
                  <svg
                    width={`${width || size}px`}
                    height={`${Math.max(
                      minHeight,
                      height
                        ? relativeHeight && width
                          ? minHeight
                            ? width * relativeHeight > minHeight
                              ? width * relativeHeight
                              : minHeight
                            : width * relativeHeight
                          : height
                        : Math.floor((totalNoOfDots - 1) / gridSize) * gridDimension +
                            gridDimension / 2 +
                            radius +
                            5,
                    )}px`}
                    ref={svgRef}
                    direction='ltr'
                    viewBox={`0 0 ${width || size} ${Math.max(
                      minHeight,
                      height
                        ? relativeHeight && width
                          ? minHeight
                            ? width * relativeHeight > minHeight
                              ? width * relativeHeight
                              : minHeight
                            : width * relativeHeight
                          : height
                        : Math.floor((totalNoOfDots - 1) / gridSize) * gridDimension +
                            gridDimension / 2 +
                            radius +
                            5,
                    )}`}
                  >
                    <AnimatePresence>
                      <g>
                        {cellsData.map((d, i) => (
                          <motion.circle
                            key={i}
                            style={{
                              strokeWidth: 1,
                            }}
                            variants={{
                              initial: {
                                fill: '#fff',
                                opacity: 0,
                                ...(!showStrokeForWhiteDots ? { stroke: d.color } : {}),
                                strokeWidth: 1,
                              },
                              whileInView: {
                                fill: d.color,
                                opacity: 1,
                                ...(!showStrokeForWhiteDots ? { stroke: d.color } : {}),
                                strokeWidth: 1,
                                cx: (i % gridSize) * gridDimension + gridDimension / 2,
                                cy: Math.floor(i / gridSize) * gridDimension + gridDimension / 2,
                                transition: {
                                  duration: 0,
                                  delay: (animateValue.duration / cellsData.length) * i,
                                },
                              },
                            }}
                            initial='initial'
                            animate={isInView ? 'whileInView' : 'initial'}
                            className={
                              (d.color.toLowerCase() === '#fff' ||
                                d.color.toLowerCase() === '#ffffff' ||
                                d.color.toLowerCase() === 'white') &&
                              showStrokeForWhiteDots
                                ? 'stroke-primary-gray-400 dark:stroke-primary-gray-500'
                                : ''
                            }
                            r={radius}
                          />
                        ))}
                      </g>
                    </AnimatePresence>
                  </svg>
                </div>
              </div>
              {sources || footNote ? (
                <GraphFooter
                  styles={{
                    footnote: styles?.footnote,
                    source: styles?.source,
                  }}
                  sources={sources}
                  footNote={footNote}
                  width={width}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
