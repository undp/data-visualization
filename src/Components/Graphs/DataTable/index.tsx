/* eslint-disable @typescript-eslint/no-explicit-any */
import isEqual from 'fast-deep-equal';
import { useEffect, useState } from 'react';
import sortBy from 'lodash.sortby';
import intersection from 'lodash.intersection';
import { cn, P } from '@undp/design-system-react';

import {
  DataTableColumnDataType,
  Languages,
  SourcesDataType,
  StyleObject,
  ClassNameObject,
} from '@/Types';
import { numberFormattingFunction } from '@/Utils/numberFormattingFunction';
import { GraphFooter } from '@/Components/Elements/GraphFooter';
import { GraphHeader } from '@/Components/Elements/GraphHeader';
import {
  FilterIcon,
  FilterIconApplied,
  SortingIcon,
  SortingIconAscending,
  SortingIconDescending,
} from '@/Components/Icons';
import { getTextColorBasedOnBgColor } from '@/Utils/getTextColorBasedOnBgColor';

interface Props {
  // Data
  /** Array of data objects. If the data have a object for ket `rowStyle` then that is use to style the row of the table. */
  data: object[];

  // Titles, Labels, and Sources
  /** Title of the graph */
  graphTitle?: string | React.ReactNode;
  /** Description of the graph */
  graphDescription?: string | React.ReactNode;
  /** Footnote for the graph */
  footNote?: string | React.ReactNode;
  /** Source data for the graph */
  sources?: SourcesDataType[];
  /** Accessibility label */
  ariaLabel?: string;

  // Colors and Styling
  /** Background color of the graph */
  backgroundColor?: string | boolean;
  /** Custom styles for the graph. Each object should be a valid React CSS style object. */
  styles?: StyleObject;
  /** Custom class names */
  classNames?: ClassNameObject;

  // Size and Spacing
  /** Width of the graph */
  width?: number;
  /** Minimum width of the table as string in px */
  minWidth?: string;
  /** Height of the graph */
  height?: number;
  /** Padding around the graph. Defaults to 0 if no backgroundColor is mentioned else defaults to 1rem */
  padding?: string;

  // Graph Parameters
  /** Column settings for each column shown in the table. */
  columnData: DataTableColumnDataType[];
  /** Specifies the number of decimal places to display in the value. */
  precision?: number;
  /** Defines how “NA” values should be displayed/labelled in the graph */
  naLabel?: string;
  /** Reset selection on double-click. Only applicable when used in a dashboard context with filters. */
  resetSelectionOnDoubleClick?: boolean;

  // Interactions and Callbacks
  /** Callback for mouse click event */
  onSeriesMouseClick?: (_d: any) => void;

  // Configuration and Options
  /** Language setting  */
  language?: Languages;
  /** Color theme */
  theme?: 'light' | 'dark';
  /** Unique ID for the graph */
  graphID?: string;
}

const TotalWidth = (columns: (number | undefined)[]) => {
  const columnWidth = columns.map(d => d || 1);
  const sum = columnWidth.reduce((acc, cur) => acc + cur, 0);
  return sum;
};

export function DataTable(props: Props) {
  const {
    width,
    height,
    graphTitle,
    sources,
    graphDescription,
    footNote,
    graphID,
    data,
    columnData,
    onSeriesMouseClick,
    language = 'en',
    theme = 'light',
    ariaLabel,
    backgroundColor = false,
    padding,
    resetSelectionOnDoubleClick = true,
    styles,
    classNames,
    minWidth,
    naLabel = 'NA',
    precision = 2,
  } = props;
  const [columnSortBy, setColumnSortBy] = useState<string | undefined>(undefined);

  const [mouseClickData, setMouseClickData] = useState<any>(undefined);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [popupVisible, setPopupVisible] = useState<string | undefined>(undefined);
  const [popupStyle, setPopupStyle] = useState({});
  const [filterOption, setFilterOption] = useState(
    columnData
      .filter(d => d.filterOptions && d.filterOptions.length > 0)
      .map(d => ({ id: d.columnId, option: d.filterOptions as string[] })),
  );
  const [sortedData, setSortedData] = useState(data);
  useEffect(() => {
    const dataFiltered: any = [];

    data.forEach((d: any) => {
      let filter = true;
      filterOption.forEach(el => {
        if (
          typeof d[el.id] !== 'object' &&
          typeof d[el.id] !== 'function' &&
          typeof d[el.id] !== 'symbol'
        ) {
          if (columnData[columnData.findIndex(cd => cd.columnId === el.id)].separator) {
            const arr = d[el.id].split(
              columnData[columnData.findIndex(cd => cd.columnId === el.id)].separator,
            );
            if (intersection(arr, el.option).length === 0) filter = false;
          } else if (el.option.indexOf(d[el.id]) === -1) filter = false;
        }
      });
      if (filter) dataFiltered.push(d);
    });
    if (columnSortBy && data) {
      setSortedData(
        sortDirection === 'asc'
          ? sortBy(dataFiltered, [columnSortBy])
          : sortBy(dataFiltered, [columnSortBy]).reverse(),
      );
    } else {
      setSortedData(dataFiltered);
    }
  }, [columnSortBy, sortDirection, data, filterOption, columnData]);
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
          }ml-auto mr-auto flex flex-col grow h-inherit ${language || 'en'} w-full`,
          classNames?.graphContainer,
        )}
        style={{
          ...(styles?.graphContainer || {}),
          ...(backgroundColor && backgroundColor !== true ? { backgroundColor } : {}),
        }}
        id={graphID}
        aria-label={
          ariaLabel ||
          `${graphTitle ? `The graph shows ${graphTitle}. ` : ''}This is an data table. ${
            graphDescription ? ` ${graphDescription}` : ''
          }`
        }
      >
        <div
          className='flex grow'
          style={{ padding: backgroundColor ? padding || '1rem' : padding || 0 }}
        >
          <div className='flex flex-col gap-3 w-full justify-between grow'>
            {graphTitle || graphDescription ? (
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
              />
            ) : null}
            <div className='grow flex flex-col justify-center'>
              <div
                className='undp-scrollbar'
                style={{
                  width: width ? `${width}px` : '100%',
                  height: height ? `${height}px` : 'auto',
                }}
              >
                <div style={minWidth ? { minWidth } : undefined}>
                  {data ? (
                    <table className='w-full' style={{ borderCollapse: 'collapse' }}>
                      <thead className='text-left bg-primary-gray-300 dark:bg-primary-gray-550'>
                        <tr>
                          {columnData?.map((d, i) => (
                            <th
                              className='text-primary-gray-700 dark:text-primary-gray-100 text-sm'
                              style={{
                                width: `calc(${
                                  (100 * (d.columnWidth || 1)) /
                                  TotalWidth(columnData.map(cd => cd.columnWidth || 1))
                                }%`,
                              }}
                              key={i}
                            >
                              <div className='flex gap-2 justify-between items-center p-4'>
                                <P
                                  size='sm'
                                  marginBottom='none'
                                  className={`w-fit grow text-${d.align || 'left'} font-bold`}
                                >
                                  {d.columnTitle || d.columnId}
                                </P>
                                {d.sortable ? (
                                  <button
                                    type='button'
                                    className='bg-transparent cursor-pointer p-0 m-0 border-0'
                                    onClick={() => {
                                      if (columnSortBy === d.columnId) {
                                        if (sortDirection === 'asc') {
                                          setSortDirection('desc');
                                        }
                                        if (sortDirection === 'desc') {
                                          setColumnSortBy(undefined);
                                        }
                                      } else {
                                        setColumnSortBy(d.columnId);
                                        setSortDirection('asc');
                                      }
                                    }}
                                  >
                                    {columnSortBy === d.columnId ? (
                                      sortDirection === 'asc' ? (
                                        <SortingIconAscending />
                                      ) : (
                                        <SortingIconDescending />
                                      )
                                    ) : (
                                      <SortingIcon />
                                    )}
                                  </button>
                                ) : null}
                                {d.filterOptions && d.filterOptions.length ? (
                                  <button
                                    type='button'
                                    className='bg-transparent cursor-pointer m-0 p-0 border-0'
                                    onClick={event => {
                                      if (popupVisible === d.columnId) {
                                        setPopupVisible(undefined);
                                      } else if (event.currentTarget) {
                                        setPopupVisible(d.columnId);
                                        const rect = event.currentTarget.getBoundingClientRect();
                                        setPopupStyle({
                                          top: rect.bottom + window.scrollY,
                                          left:
                                            rect.left + window.scrollX - 160 < 0
                                              ? rect.left + window.scrollX
                                              : rect.left + window.scrollX - 160,
                                          width: '10rem',
                                        });
                                      }
                                    }}
                                  >
                                    {filterOption[
                                      filterOption.findIndex(el => el.id === d.columnId)
                                    ].option.length === d.filterOptions?.length ? (
                                      <FilterIcon />
                                    ) : (
                                      <FilterIconApplied />
                                    )}
                                  </button>
                                ) : null}
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {sortedData?.map((d: any, i: number) => (
                          <tr
                            key={i}
                            className={`cursor-${
                              onSeriesMouseClick ? 'pointer' : 'auto'
                            } border-b border-b-primary-gray-400 dark:border-b-primary-gray-500 ${
                              isEqual(mouseClickData, d)
                                ? 'bg-primary-gray-200 dark:bg-primary-gray-600'
                                : 'bg-transparent'
                            }`}
                            style={d.rowStyle}
                            onClick={() => {
                              if (onSeriesMouseClick) {
                                if (isEqual(mouseClickData, d) && resetSelectionOnDoubleClick) {
                                  setMouseClickData(undefined);
                                  onSeriesMouseClick(undefined);
                                } else {
                                  setMouseClickData(d);
                                  onSeriesMouseClick(d);
                                }
                              }
                            }}
                          >
                            {columnData.map((el, j) => (
                              <td
                                key={j}
                                className={`text-primary-gray-700 dark:text-primary-gray-100 text-sm text-${
                                  el.align || 'left'
                                }`}
                                style={{
                                  width: `calc(${
                                    (100 * (d.columnWidth || 1)) /
                                    TotalWidth(columnData.map(cd => cd.columnWidth || 1))
                                  }%`,
                                }}
                              >
                                <div
                                  className={`text-primary-gray-700 dark:text-primary-gray-100 flex p-4 ${
                                    el.align === 'right'
                                      ? 'justify-end'
                                      : el.align === 'center'
                                        ? 'justify-center'
                                        : 'justify-start'
                                  }`}
                                >
                                  {typeof d[el.columnId] === 'number' ? (
                                    <P
                                      marginBottom='none'
                                      size='sm'
                                      className={`text-primary-gray-700 dark:text-primary-gray-100 w-fit ${
                                        el.chip ? 'grow-0 rounded-sm p-2' : 'grow rounded-none p-0'
                                      } text-${el.align || 'left'} ${
                                        el.chip
                                          ? !el.chipColors
                                            ? 'bg-primary-gray-300 dark:bg-primary-gray-500'
                                            : ''
                                          : 'bg-transparent'
                                      }`}
                                      style={{
                                        ...(el.chip && el.chipColors
                                          ? {
                                              backgroundColor:
                                                el.chipColors[
                                                  el.chipColors.findIndex(
                                                    c =>
                                                      c.value === d[el.chipColumnId || el.columnId],
                                                  )
                                                ].color,
                                              color: getTextColorBasedOnBgColor(
                                                el.chipColors[
                                                  el.chipColors.findIndex(
                                                    c =>
                                                      c.value === d[el.chipColumnId || el.columnId],
                                                  )
                                                ].color,
                                              ),
                                            }
                                          : {}),
                                      }}
                                    >
                                      {numberFormattingFunction(
                                        d[el.columnId],
                                        naLabel,
                                        precision,
                                        el.prefix,
                                        el.suffix,
                                      )}
                                    </P>
                                  ) : typeof d[el.columnId] === 'string' ? (
                                    el.separator ? (
                                      <div className='text-primary-gray-700 dark:text-primary-gray-100 flex flex-wrap gap-2'>
                                        {d[el.columnId]
                                          .split(el.separator)
                                          .map((element: string, indx: number) => (
                                            <P
                                              key={indx}
                                              marginBottom='none'
                                              size='sm'
                                              className={`text-primary-gray-700 dark:text-primary-gray-100 w-fit ${
                                                el.chip
                                                  ? 'grow-0 rounded-sm p-2'
                                                  : 'grow rounded-none p-0'
                                              } text-${el.align || 'left'} ${
                                                el.chip
                                                  ? !el.chipColors
                                                    ? 'bg-primary-gray-300 dark:bg-primary-gray-500'
                                                    : ''
                                                  : 'bg-transparent'
                                              }`}
                                              style={{
                                                ...(el.chip && el.chipColors
                                                  ? {
                                                      backgroundColor:
                                                        el.chipColors[
                                                          el.chipColors.findIndex(
                                                            c =>
                                                              c.value ===
                                                              (el.chipColumnId
                                                                ? d[el.chipColumnId]
                                                                : element),
                                                          )
                                                        ].color,
                                                      color: getTextColorBasedOnBgColor(
                                                        el.chipColors[
                                                          el.chipColors.findIndex(
                                                            c =>
                                                              c.value ===
                                                              (el.chipColumnId
                                                                ? d[el.chipColumnId]
                                                                : element),
                                                          )
                                                        ].color,
                                                      ),
                                                    }
                                                  : {}),
                                              }}
                                            >
                                              {numberFormattingFunction(
                                                element,
                                                naLabel,
                                                precision,
                                                el.prefix,
                                                el.suffix,
                                              )}
                                            </P>
                                          ))}
                                      </div>
                                    ) : (
                                      <P
                                        marginBottom='none'
                                        size='sm'
                                        className={`text-primary-gray-700 dark:text-primary-gray-100 w-fit ${
                                          el.chip
                                            ? 'grow-0 rounded-sm p-2'
                                            : 'grow rounded-none p-0'
                                        } text-${el.align || 'left'} ${
                                          el.chip
                                            ? !el.chipColors
                                              ? 'bg-primary-gray-300 dark:bg-primary-gray-500'
                                              : ''
                                            : 'bg-transparent'
                                        }`}
                                        style={{
                                          ...(el.chip && el.chipColors
                                            ? {
                                                backgroundColor:
                                                  el.chipColors[
                                                    el.chipColors.findIndex(
                                                      c =>
                                                        c.value ===
                                                        d[el.chipColumnId || el.columnId],
                                                    )
                                                  ].color,
                                                color: getTextColorBasedOnBgColor(
                                                  el.chipColors[
                                                    el.chipColors.findIndex(
                                                      c =>
                                                        c.value ===
                                                        d[el.chipColumnId || el.columnId],
                                                    )
                                                  ].color,
                                                ),
                                              }
                                            : {}),
                                        }}
                                      >
                                        {numberFormattingFunction(
                                          d[el.columnId],
                                          naLabel,
                                          precision,
                                          el.prefix,
                                          el.suffix,
                                        )}
                                      </P>
                                    )
                                  ) : (
                                    <div>
                                      {numberFormattingFunction(
                                        d[el.columnId],
                                        naLabel,
                                        precision,
                                        el.prefix,
                                        el.suffix,
                                      )}
                                    </div>
                                  )}
                                </div>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : null}
                </div>
              </div>
            </div>
            {sources || footNote ? (
              <GraphFooter
                styles={{ footnote: styles?.footnote, source: styles?.source }}
                classNames={{
                  footnote: classNames?.footnote,
                  source: classNames?.source,
                }}
                sources={sources}
                footNote={footNote}
                width={width}
              />
            ) : null}
          </div>
          {popupVisible && (
            <div
              style={popupStyle}
              className='absolute p-3 border z-[1000] rounded-sm bg-primary-white dark:bg-primary-gray-700 border-primary-gray-300 dark:border-primary-gray-550'
            >
              <div className='max-w-60'>
                <P size='sm' marginBottom='2xs' className='font-bold'>
                  Filter data by
                </P>
                <div className='flex flex-col gap-2'>
                  {columnData[
                    columnData.findIndex(d => d.columnId === popupVisible)
                  ].filterOptions?.map((el, i) => (
                    <div key={i}>
                      <label key={i} className='undp-viz-label'>
                        <input
                          type='checkbox'
                          className='undp-viz-checkbox'
                          checked={
                            filterOption[
                              filterOption.findIndex(d => d.id === popupVisible)
                            ].option.indexOf(el) !== -1
                          }
                          onChange={() => {
                            const indx = filterOption.findIndex(d => d.id === popupVisible);
                            const opt = [...filterOption[indx].option];
                            if (opt.indexOf(el) !== -1) {
                              opt.splice(opt.indexOf(el), 1);
                              const filterOptionDuplicate = [...filterOption];
                              filterOptionDuplicate[indx].option = opt;
                              setFilterOption(filterOptionDuplicate);
                            } else {
                              opt.push(el);
                              const filterOptionDuplicate = [...filterOption];
                              filterOptionDuplicate[indx].option = opt;
                              setFilterOption(filterOptionDuplicate);
                            }
                          }}
                        />
                        {el}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
