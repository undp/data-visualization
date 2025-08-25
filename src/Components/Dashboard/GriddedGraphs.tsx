import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import intersection from 'lodash.intersection';
import flattenDeep from 'lodash.flattendeep';
import {
  CheckboxGroup,
  CheckboxGroupItem,
  createFilter,
  DropdownSelect,
  Label,
  RadioGroup,
  RadioGroupItem,
  Spinner,
} from '@undp/design-system-react';

import GraphEl from './GraphEl';

import {
  AdvancedDataSelectionDataType,
  AggregationSettingsDataType,
  DataFilterDataType,
  DataSelectionDataType,
  DataSettingsDataType,
  FilterSettingsDataType,
  FilterUiSettingsDataType,
  GraphConfigurationDataType,
  GraphSettingsDataType,
  GraphType,
} from '@/Types';
import {
  fetchAndParseCSV,
  fetchAndParseJSON,
  fetchAndParseMultipleDataSources,
  fetchAndTransformDataFromAPI,
} from '@/Utils/fetchAndParseData';
import { Colors } from '@/Components/ColorPalette';
import { transformColumnsToArray } from '@/Utils/transformData/transformColumnsToArray';
import { transformDataForGraph } from '@/Utils/transformData/transformDataForGraph';
import { getUniqValue } from '@/Utils/getUniqValue';
import { transformDataForAggregation } from '@/Utils/transformData/transformDataForAggregation';
import { GraphHeader } from '@/Components/Elements/GraphHeader';
import { GraphFooter } from '@/Components/Elements/GraphFooter';
import { filterData } from '@/Utils/transformData/filterData';
import { ColorLegend } from '@/Components/Elements/ColorLegend';
import { checkIfNullOrUndefined } from '@/Utils/checkIfNullOrUndefined';
import { checkIfMultiple } from '@/Utils/checkIfMultiple';
import { transformDefaultValue } from '@/Utils/transformDataForSelect';

interface Props {
  noOfColumns?: number;
  columnGridBy: string;
  graphSettings?: GraphSettingsDataType;
  dataSettings: DataSettingsDataType;
  filters?: FilterUiSettingsDataType[];
  noOfFiltersPerRow?: number;
  graphType: Exclude<GraphType, 'geoHubMap' | 'geoHubCompareMap' | 'geoHubMapWithLayerSelection'>;
  dataTransform?: {
    keyColumn: string;
    aggregationColumnsSetting?: AggregationSettingsDataType[];
  };
  showCommonColorScale?: boolean;
  dataFilters?: DataFilterDataType[];
  graphDataConfiguration?: GraphConfigurationDataType[];
  dataSelectionOptions?: DataSelectionDataType[];
  advancedDataSelectionOptions?: AdvancedDataSelectionDataType[];
  minGraphHeight?: number;
  minGraphWidth?: number;
  debugMode?: boolean;
  readableHeader?: {
    value: string;
    label: string;
  }[];
  uiMode?: 'light' | 'normal';
  theme?: 'dark' | 'light';
}

export function GriddedGraphs(props: Props) {
  const {
    graphSettings,
    dataSettings,
    filters,
    graphType,
    dataTransform,
    graphDataConfiguration,
    noOfColumns,
    columnGridBy,
    dataFilters,
    showCommonColorScale,
    minGraphHeight,
    minGraphWidth,
    debugMode,
    dataSelectionOptions,
    advancedDataSelectionOptions,
    readableHeader,
    noOfFiltersPerRow = 4,
    uiMode = 'normal',
    theme = 'light',
  } = props;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(undefined);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [dataFromFile, setDataFromFile] = useState<any>(undefined);
  const [gridOption, setGridOption] = useState<(string | number)[]>([]);
  const graphParentDiv = useRef<HTMLDivElement>(null);
  const [graphConfig, setGraphConfig] = useState<GraphConfigurationDataType[] | undefined>(
    graphDataConfiguration,
  );
  const [filterSettings, setFilterSettings] = useState<FilterSettingsDataType[]>([]);
  const [advancedGraphSettings, setAdvancedGraphSettings] = useState<GraphSettingsDataType>({});

  const filterConfig = useMemo(
    () => ({
      ignoreCase: true,
      ignoreAccents: true,
      trim: true,
    }),
    [],
  );

  const filteredData = useMemo(() => {
    if (!dataFromFile || filterSettings.length === 0) return dataFromFile;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = dataFromFile.filter((item: any) =>
      filterSettings.every(filter =>
        filter.value && flattenDeep([filter.value]).length > 0
          ? intersection(
              flattenDeep([item[filter.filter]]),
              flattenDeep([filter.value]).map(el => el.value),
            ).length > 0
          : true,
      ),
    );
    return result;
  }, [filterSettings, dataFromFile]);
  useEffect(() => {
    setData(filteredData);
  }, [filteredData]);

  const fetchDataHandler = useCallback(async () => {
    if (dataSettings) {
      try {
        const fetchData = dataSettings.dataURL
          ? typeof dataSettings.dataURL === 'string'
            ? dataSettings.fileType === 'json'
              ? fetchAndParseJSON(
                  dataSettings.dataURL,
                  dataSettings.columnsToArray,
                  dataSettings.dataTransformation,
                  debugMode,
                )
              : dataSettings.fileType === 'api'
                ? fetchAndTransformDataFromAPI(
                    dataSettings.dataURL,
                    dataSettings.apiHeaders,
                    dataSettings.columnsToArray,
                    dataSettings.dataTransformation,
                    debugMode,
                  )
                : fetchAndParseCSV(
                    dataSettings.dataURL,
                    dataSettings.dataTransformation,
                    dataSettings.columnsToArray,
                    debugMode,
                    dataSettings.delimiter,
                    true,
                  )
            : fetchAndParseMultipleDataSources(dataSettings.dataURL, dataSettings.idColumnTitle)
          : transformColumnsToArray(dataSettings.data, dataSettings.columnsToArray);

        const d = await fetchData;
        setDataFromFile(d);

        const gridValue = getUniqValue(d, columnGridBy) as (string | number)[];
        setGridOption(gridValue);
        // Optimize filter settings generation
        const newFilterSettings = (filters || []).map(el => ({
          filter: el.column,
          label: el.label || `Filter by ${el.column}`,
          singleSelect: el.singleSelect,
          clearable: el.clearable,
          defaultValue: transformDefaultValue(el.defaultValue),
          value: transformDefaultValue(el.defaultValue),
          availableValues: getUniqValue(d, el.column)
            .filter(v => !el.excludeValues?.includes(`${v}`))
            .map(v => ({ value: v, label: v })),
          allowSelectAll: el.allowSelectAll,
          width: el.width,
        }));

        setFilterSettings(newFilterSettings);
      } catch (error) {
        console.error('Data fetching error:', error);
      }
    }
  }, [dataSettings, debugMode, columnGridBy, filters]);
  useEffect(() => {
    fetchDataHandler();
  }, [fetchDataHandler]);
  useEffect(() => {
    setGraphConfig(graphDataConfiguration);
  }, [graphDataConfiguration]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFilterChange = useCallback((filter: string, values: any) => {
    setFilterSettings(prev => prev.map(f => (f.filter === filter ? { ...f, value: values } : f)));
  }, []);
  return (
    <div
      className={`${theme || graphSettings?.theme || 'light'} flex  ${
        graphSettings?.width ? 'w-fit grow-0' : 'w-full grow'
      }`}
      dir={graphSettings?.language === 'he' || graphSettings?.language === 'ar' ? 'rtl' : undefined}
    >
      <div
        className={`${
          !graphSettings?.backgroundColor
            ? 'bg-transparent '
            : graphSettings?.backgroundColor === true
              ? 'bg-primary-gray-200 dark:bg-primary-gray-650 '
              : ''
        }ml-auto mr-auto flex flex-col grow h-inherit ${graphSettings?.language || 'en'}`}
        style={{
          ...(graphSettings?.backgroundColor && graphSettings?.backgroundColor !== true
            ? { backgroundColor: graphSettings?.backgroundColor }
            : {}),
        }}
        id={graphSettings?.graphID}
        ref={graphParentDiv}
        aria-label={
          graphSettings?.ariaLabel ||
          `${
            graphSettings?.graphTitle ? `The graph shows ${graphSettings?.graphTitle}. ` : ''
          }This is a gridded chart.${
            graphSettings?.graphDescription ? ` ${graphSettings?.graphDescription}` : ''
          }`
        }
      >
        <div
          style={{
            padding: graphSettings?.backgroundColor
              ? graphSettings?.padding || '1rem'
              : graphSettings?.padding || 0,
            flexGrow: 1,
            display: 'flex',
          }}
        >
          <div className='flex flex-col w-full gap-4 grow justify-between'>
            {advancedGraphSettings?.graphTitle ||
            advancedGraphSettings?.graphDescription ||
            graphSettings?.graphTitle ||
            graphSettings?.graphDescription ||
            graphSettings?.graphDownload ||
            graphSettings?.dataDownload ? (
              <GraphHeader
                styles={{
                  title: advancedGraphSettings?.styles?.title || graphSettings?.styles?.title,
                  description:
                    advancedGraphSettings?.styles?.description ||
                    graphSettings?.styles?.description,
                }}
                classNames={{
                  title:
                    advancedGraphSettings?.classNames?.title || graphSettings?.classNames?.title,
                  description:
                    advancedGraphSettings?.classNames?.description ||
                    graphSettings?.classNames?.description,
                }}
                graphTitle={advancedGraphSettings?.graphTitle || graphSettings?.graphTitle}
                graphDescription={
                  advancedGraphSettings?.graphDescription || graphSettings?.graphDescription
                }
                width={advancedGraphSettings?.width || graphSettings?.width}
                graphDownload={graphSettings?.graphDownload ? graphParentDiv.current : undefined}
                dataDownload={
                  graphSettings?.dataDownload && data ? (data.length > 0 ? data : null) : null
                }
              />
            ) : null}
            {data && gridOption.length > 0 ? (
              <>
                {filterSettings.length !== 0 ||
                (dataSelectionOptions || []).length !== 0 ||
                (advancedDataSelectionOptions || []).length !== 0 ? (
                  <div
                    style={{
                      display: 'flex',
                      gap: '1rem',
                      flexWrap: 'wrap',
                      alignItems: 'flex-start',
                      width: '100%',
                    }}
                  >
                    {advancedDataSelectionOptions?.map((d, i) => (
                      <div
                        style={{
                          width:
                            d.width ||
                            `calc(${100 / noOfFiltersPerRow}% - ${
                              (noOfFiltersPerRow - 1) / noOfFiltersPerRow
                            }rem)`,
                          flexGrow: 1,
                          flexShrink: d.ui !== 'radio' ? 0 : 1,
                          minWidth: '240px',
                        }}
                        key={i}
                      >
                        <Label className='mb-2'>{d.label || 'Graph by'}</Label>
                        {d.ui !== 'radio' ? (
                          <DropdownSelect
                            options={d.options.map(opt => ({
                              ...opt,
                              value: opt.label,
                            }))}
                            isClearable={false}
                            isSearchable
                            variant={uiMode}
                            controlShouldRenderValue
                            defaultValue={
                              d.defaultValue
                                ? {
                                    ...d.defaultValue,
                                    value: d.defaultValue?.label,
                                  }
                                : {
                                    ...d.options[0],
                                    value: d.options[0].label,
                                  }
                            }
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            onChange={(el: any) => {
                              setAdvancedGraphSettings(el?.graphSettings || {});
                              setGraphConfig(el?.dataConfiguration);
                            }}
                          />
                        ) : (
                          <RadioGroup
                            defaultValue={d.defaultValue?.label || d.options[0].label}
                            variant={uiMode}
                            onValueChange={el => {
                              const selectedOption =
                                d.options[d.options.findIndex(opt => opt.label === el)];
                              setAdvancedGraphSettings(selectedOption.graphSettings || {});
                              setGraphConfig(selectedOption.dataConfiguration);
                            }}
                          >
                            {d.options.map((el, j) => (
                              <RadioGroupItem label={el.label} value={el.label} key={j} />
                            ))}
                          </RadioGroup>
                        )}
                      </div>
                    ))}
                    {dataSelectionOptions?.map((d, i) => (
                      <div
                        style={{
                          width:
                            d.width ||
                            `calc(${100 / noOfFiltersPerRow}% - ${
                              (noOfFiltersPerRow - 1) / noOfFiltersPerRow
                            }rem)`,
                          flexGrow: 1,
                          flexShrink: d.ui !== 'radio' ? 0 : 1,
                          minWidth: '240px',
                        }}
                        key={i}
                      >
                        <Label className='mb-2'>
                          {d.label || `Visualize ${d.chartConfigId} by`}
                        </Label>
                        {!checkIfMultiple(d.chartConfigId, graphConfig || []) ? (
                          d.ui !== 'radio' ? (
                            <DropdownSelect
                              options={d.allowedColumnIds}
                              isClearable={false}
                              isSearchable
                              variant={uiMode}
                              defaultValue={
                                graphDataConfiguration
                                  ? d.allowedColumnIds[
                                      d.allowedColumnIds.findIndex(
                                        j =>
                                          j.value ===
                                          (graphDataConfiguration[
                                            graphDataConfiguration.findIndex(
                                              el => el.chartConfigId === d.chartConfigId,
                                            )
                                          ].columnId as string),
                                      )
                                    ]
                                  : undefined
                              }
                              controlShouldRenderValue
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              onChange={(el: any) => {
                                const newGraphConfig = {
                                  columnId: el?.value as string,
                                  chartConfigId: d.chartConfigId,
                                };
                                const updatedConfig = graphConfig?.map(item =>
                                  item.chartConfigId === newGraphConfig.chartConfigId
                                    ? newGraphConfig
                                    : item,
                                );
                                setAdvancedGraphSettings(el?.graphSettings || {});
                                setGraphConfig(updatedConfig);
                              }}
                            />
                          ) : (
                            <RadioGroup
                              variant={uiMode}
                              defaultValue={
                                graphDataConfiguration
                                  ? d.allowedColumnIds[
                                      d.allowedColumnIds.findIndex(
                                        j =>
                                          j.value ===
                                          (graphDataConfiguration[
                                            graphDataConfiguration.findIndex(
                                              el => el.chartConfigId === d.chartConfigId,
                                            )
                                          ].columnId as string),
                                      )
                                    ].label
                                  : ''
                              }
                              onValueChange={el => {
                                const selectedOption =
                                  d.allowedColumnIds[
                                    d.allowedColumnIds.findIndex(opt => opt.label === el)
                                  ];
                                const newGraphConfig = {
                                  columnId: selectedOption.value,
                                  chartConfigId: d.chartConfigId,
                                };
                                const updatedConfig = graphConfig?.map(item =>
                                  item.chartConfigId === newGraphConfig.chartConfigId
                                    ? newGraphConfig
                                    : item,
                                );
                                setAdvancedGraphSettings(selectedOption.graphSettings || {});
                                setGraphConfig(updatedConfig);
                              }}
                            >
                              {d.allowedColumnIds.map((el, j) => (
                                <RadioGroupItem label={el.label} value={el.label} key={j} />
                              ))}
                            </RadioGroup>
                          )
                        ) : d.ui !== 'radio' ? (
                          <DropdownSelect
                            options={d.allowedColumnIds}
                            isMulti
                            variant={uiMode}
                            isSearchable
                            controlShouldRenderValue
                            defaultValue={
                              graphDataConfiguration
                                ? (
                                    graphDataConfiguration[
                                      graphDataConfiguration.findIndex(
                                        el => el.chartConfigId === d.chartConfigId,
                                      )
                                    ].columnId as string[]
                                  ).map(
                                    el =>
                                      d.allowedColumnIds[
                                        d.allowedColumnIds.findIndex(j => j.value === el)
                                      ],
                                  )
                                : undefined
                            }
                            filterOption={createFilter(filterConfig)}
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            onChange={(el: any) => {
                              const newGraphConfig = {
                                columnId: el.map(
                                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                  (item: any) => item.value,
                                ) as string[],
                                chartConfigId: d.chartConfigId,
                              };
                              const updatedConfig = graphConfig?.map(item =>
                                item.chartConfigId === newGraphConfig.chartConfigId
                                  ? newGraphConfig
                                  : item,
                              );
                              setGraphConfig(updatedConfig);
                            }}
                            isRtl={
                              graphSettings?.language === 'ar' || graphSettings?.language === 'he'
                            }
                          />
                        ) : (
                          <CheckboxGroup
                            variant={uiMode}
                            defaultValue={
                              graphDataConfiguration
                                ? (
                                    graphDataConfiguration[
                                      graphDataConfiguration.findIndex(
                                        el => el.chartConfigId === d.chartConfigId,
                                      )
                                    ].columnId as string[]
                                  )
                                    .map(
                                      el =>
                                        d.allowedColumnIds[
                                          d.allowedColumnIds.findIndex(j => j.value === el)
                                        ],
                                    )
                                    .map(el => el.value)
                                : []
                            }
                            onValueChange={el => {
                              const newGraphConfig = {
                                columnId: el || [],
                                chartConfigId: d.chartConfigId,
                              };
                              const updatedConfig = graphConfig?.map(item =>
                                item.chartConfigId === newGraphConfig.chartConfigId
                                  ? newGraphConfig
                                  : item,
                              );
                              setGraphConfig(updatedConfig);
                            }}
                          >
                            {d.allowedColumnIds.map((el, j) => (
                              <CheckboxGroupItem label={el.label} value={el.label} key={j} />
                            ))}
                          </CheckboxGroup>
                        )}
                      </div>
                    ))}
                    {filterSettings?.map((d, i) => (
                      <div
                        style={{
                          width:
                            d.width ||
                            `calc(${100 / noOfFiltersPerRow}% - ${
                              (noOfFiltersPerRow - 1) / noOfFiltersPerRow
                            }rem)`,
                          flexGrow: 1,
                          flexShrink: 0,
                          flexWrap: 'wrap',
                        }}
                        key={i}
                      >
                        <Label className='mb-2'>{d.label}</Label>
                        {d.singleSelect ? (
                          <DropdownSelect
                            variant={uiMode}
                            options={d.availableValues}
                            isClearable={d.clearable === undefined ? true : d.clearable}
                            isRtl={
                              graphSettings?.language === 'ar' || graphSettings?.language === 'he'
                            }
                            isSearchable
                            controlShouldRenderValue
                            filterOption={createFilter(filterConfig)}
                            onChange={el => {
                              handleFilterChange(d.filter, el);
                            }}
                            defaultValue={d.defaultValue}
                          />
                        ) : (
                          <>
                            <DropdownSelect
                              variant={uiMode}
                              options={d.availableValues}
                              isMulti
                              isClearable={d.clearable === undefined ? true : d.clearable}
                              isSearchable
                              controlShouldRenderValue
                              filterOption={createFilter(filterConfig)}
                              onChange={el => {
                                handleFilterChange(d.filter, el);
                              }}
                              defaultValue={d.defaultValue}
                              isRtl={
                                graphSettings?.language === 'ar' || graphSettings?.language === 'he'
                              }
                            />
                            {d.allowSelectAll ? (
                              <button
                                className='bg-transparent border-0 p-0 mt-2 cursor-pointer text-primary-blue-600 dark:text-primary-blue-400'
                                type='button'
                                onClick={() => {
                                  handleFilterChange(d.filter, d.availableValues);
                                }}
                              >
                                Select all options
                              </button>
                            ) : null}
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                ) : null}
                {showCommonColorScale !== false && graphSettings?.showColorScale !== false ? (
                  <ColorLegend
                    width={graphSettings?.width}
                    colorLegendTitle={graphSettings?.colorLegendTitle}
                    colors={
                      (graphSettings?.colors as string[] | undefined) ||
                      (graphSettings?.lineColors as string[] | undefined) ||
                      Colors[(graphSettings?.theme as 'light' | 'dark' | undefined) || 'light']
                        .categoricalColors.colors
                    }
                    colorDomain={graphSettings?.colorDomain || graphSettings?.labels || []}
                    showNAColor={
                      graphSettings?.showNAColor === undefined ||
                      graphSettings?.showNAColor === null
                        ? true
                        : graphSettings?.showNAColor
                    }
                  />
                ) : null}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    flexDirection:
                      graphSettings?.language === 'ar' || graphSettings?.language === 'he'
                        ? 'row-reverse'
                        : 'row',
                    justifyContent: 'center',
                  }}
                >
                  {gridOption.map((el, i) => (
                    <div
                      key={i}
                      style={{
                        width: `calc(${
                          100 /
                          (noOfColumns || (Math.min(...[4, gridOption.length || 0]) as number))
                        }% - ${
                          ((noOfColumns || (Math.min(...[4, gridOption.length || 0]) as number)) -
                            1) /
                          (noOfColumns || (Math.min(...[4, gridOption.length || 0]) as number))
                        }rem)`,
                        minWidth: checkIfNullOrUndefined(minGraphWidth)
                          ? '280px'
                          : `${minGraphWidth}px`,
                      }}
                    >
                      <GraphEl
                        graph={graphType}
                        graphDataConfiguration={graphConfig}
                        graphData={
                          transformDataForGraph(
                            dataTransform
                              ? transformDataForAggregation(
                                  filterData(data, dataFilters || []).filter(
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    (d: any) => d[columnGridBy] === el,
                                  ),
                                  dataTransform.keyColumn,
                                  dataTransform.aggregationColumnsSetting,
                                )
                              : filterData(data, dataFilters || []).filter(
                                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                  (d: any) => d[columnGridBy] === el,
                                ),
                            graphType,
                            graphConfig,
                          ) || []
                        }
                        debugMode={debugMode}
                        settings={{
                          ...(graphSettings || {}),
                          ...advancedGraphSettings,
                          theme: graphSettings?.theme || theme,
                          width: undefined,
                          height: undefined,
                          relativeHeight: graphSettings?.relativeHeight || 0.67,
                          minHeight: minGraphHeight,
                          graphTitle: `${el}`,
                          graphDescription: undefined,
                          graphDownload: false,
                          dataDownload: false,
                          backgroundColor: undefined,
                          padding: '0',
                          footNote: undefined,
                          sources: undefined,
                          showColorScale:
                            graphSettings?.showColorScale === false
                              ? false
                              : showCommonColorScale === false,
                        }}
                        readableHeader={readableHeader || []}
                      />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className='w-full flex justify-center p-4'>
                <Spinner />
              </div>
            )}
            {graphSettings?.sources || graphSettings?.footNote ? (
              <GraphFooter
                styles={{
                  footnote: graphSettings?.styles?.footnote,
                  source: graphSettings?.styles?.source,
                }}
                classNames={{
                  footnote: graphSettings?.classNames?.footnote,
                  source: graphSettings?.classNames?.source,
                }}
                sources={graphSettings?.sources}
                footNote={graphSettings?.footNote}
                width={graphSettings?.width}
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
