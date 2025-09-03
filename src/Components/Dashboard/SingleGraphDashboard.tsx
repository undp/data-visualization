import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import intersection from 'lodash.intersection';
import flattenDeep from 'lodash.flattendeep';
import isEqual from 'fast-deep-equal';
import { createFilter, DropdownSelect } from '@undp/design-system-react/DropdownSelect';
import { cn } from '@undp/design-system-react/cn';
import { CheckboxGroup, CheckboxGroupItem } from '@undp/design-system-react/CheckboxGroup';
import { P } from '@undp/design-system-react/Typography';
import { RadioGroup, RadioGroupItem } from '@undp/design-system-react/RadioGroup';
import { Spinner } from '@undp/design-system-react/Spinner';
import { Label } from '@undp/design-system-react/Label';

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
  HighlightDataPointSettingsDataType,
} from '@/Types';
import {
  fetchAndParseCSV,
  fetchAndParseJSON,
  fetchAndParseMultipleDataSources,
  fetchAndTransformDataFromAPI,
} from '@/Utils/fetchAndParseData';
import { transformDataForGraph } from '@/Utils/transformData/transformDataForGraph';
import { getUniqValue } from '@/Utils/getUniqValue';
import { transformDataForAggregation } from '@/Utils/transformData/transformDataForAggregation';
import { GraphHeader } from '@/Components/Elements/GraphHeader';
import { filterData } from '@/Utils/transformData/filterData';
import { checkIfMultiple } from '@/Utils/checkIfMultiple';
import { transformColumnsToArray } from '@/Utils/transformData/transformColumnsToArray';
import { graphList } from '@/Utils/getGraphList';
import { transformDefaultValue } from '@/Utils/transformDataForSelect';

interface Props {
  graphSettings?: GraphSettingsDataType;
  readableHeader?: {
    value: string;
    label: string;
  }[];
  dataSettings?: DataSettingsDataType;
  filters?: FilterUiSettingsDataType[];
  highlightDataPointSettings?: HighlightDataPointSettingsDataType;
  noOfFiltersPerRow?: number;
  graphType: GraphType;
  dataTransform?: {
    keyColumn: string;
    aggregationColumnsSetting?: AggregationSettingsDataType[];
  };
  dataFilters?: DataFilterDataType[];
  graphDataConfiguration?: GraphConfigurationDataType[];
  dataSelectionOptions?: DataSelectionDataType[];
  advancedDataSelectionOptions?: AdvancedDataSelectionDataType[];
  debugMode?: boolean;
  uiMode?: 'light' | 'normal';
  updateFilters?: (_d: string) => void;
}

const addMinAndMax = (config: GraphConfigurationDataType[]) => {
  if (
    config.findIndex(d => d.chartConfigId === 'yMin') !== -1 &&
    config.findIndex(d => d.chartConfigId === 'yMax') !== -1
  )
    return config;
  const configTemp = [...config];
  if (config.findIndex(d => d.chartConfigId === 'yMin') === -1) {
    configTemp.push({
      chartConfigId: 'yMin',
      columnId: `${config[config.findIndex(d => d.chartConfigId === 'y')].columnId}Min`,
    });
  }
  if (config.findIndex(d => d.chartConfigId === 'yMax') === -1) {
    configTemp.push({
      chartConfigId: 'yMax',
      columnId: `${config[config.findIndex(d => d.chartConfigId === 'y')].columnId}Max`,
    });
  }
  return configTemp;
};

const getGraphSettings = (
  dataSelectionOptions: DataSelectionDataType[],
  updatedConfig?: GraphConfigurationDataType[],
) => {
  const updatedSettings =
    updatedConfig?.map(c => {
      const indx = dataSelectionOptions?.findIndex(opt => opt.chartConfigId === c.chartConfigId);
      if (indx === -1) return {};
      const allowedValIndx = dataSelectionOptions[indx]?.allowedColumnIds?.findIndex(
        col => col.value === c.columnId,
      );
      if (allowedValIndx === -1) return {};
      return dataSelectionOptions[indx].allowedColumnIds[allowedValIndx].graphSettings || {};
    }) || [];
  return Object.assign({}, ...updatedSettings);
};

export function SingleGraphDashboard(props: Props) {
  const {
    graphSettings,
    dataSettings,
    filters,
    graphType,
    dataTransform,
    graphDataConfiguration,
    dataFilters,
    debugMode,
    dataSelectionOptions,
    advancedDataSelectionOptions,
    readableHeader,
    noOfFiltersPerRow = 4,
    updateFilters,
    uiMode = 'normal',
    highlightDataPointSettings,
  } = props;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(undefined);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [dataFromFile, setDataFromFile] = useState<any>(undefined);
  const [graphConfig, setGraphConfig] = useState<GraphConfigurationDataType[] | undefined>(
    graphDataConfiguration,
  );
  const [advancedGraphSettings, setAdvancedGraphSettings] = useState<GraphSettingsDataType>({});
  const [highlightedDataPointList, setHighlightedDataPointList] = useState<
    (string | number)[] | undefined
  >(undefined);
  const [highlightedDataPointOptions, setHighlightedDataPointOption] = useState<
    { label: string | number; value: string | number }[]
  >([]);
  const graphParentDiv = useRef<HTMLDivElement>(null);

  const prevGraphDataConfigRef = useRef<GraphConfigurationDataType[] | undefined>(
    graphDataConfiguration,
  );
  const [filterSettings, setFilterSettings] = useState<FilterSettingsDataType[]>([]);

  const filterConfig = useMemo(
    () => ({
      ignoreCase: true,
      ignoreAccents: true,
      trim: true,
    }),
    [],
  );
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
  }, [dataSettings, filters, debugMode]);
  useEffect(() => {
    fetchDataHandler();
  }, [fetchDataHandler]);

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
    if (dataSelectionOptions)
      setAdvancedGraphSettings(getGraphSettings(dataSelectionOptions, graphDataConfiguration));
  }, [dataSelectionOptions, graphDataConfiguration]);

  useEffect(() => {
    if (dataFromFile) {
      setData(filteredData);
    }
  }, [filteredData, graphType, dataFromFile]);

  useEffect(() => {
    if (highlightDataPointSettings?.column && filteredData)
      setHighlightedDataPointOption(
        getUniqValue(filteredData, highlightDataPointSettings.column)
          .filter(v => !highlightDataPointSettings?.excludeValues?.includes(`${v}`))
          .map(d => ({ value: d, label: d })),
      );
  }, [filteredData, highlightDataPointSettings]);

  useEffect(() => {
    if (!isEqual(prevGraphDataConfigRef.current, graphDataConfiguration)) {
      setGraphConfig(graphDataConfiguration);
      prevGraphDataConfigRef.current = graphDataConfiguration;
    }
  }, [graphDataConfiguration]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFilterChange = useCallback((filter: string, values: any) => {
    setFilterSettings(prev => prev.map(f => (f.filter === filter ? { ...f, value: values } : f)));
  }, []);

  const graphData = useMemo(() => {
    if (!data) return undefined;
    const config =
      graphType === 'lineChartWithConfidenceInterval' && graphConfig
        ? addMinAndMax(graphConfig)
        : graphConfig;
    const d = transformDataForGraph(
      dataTransform
        ? transformDataForAggregation(
            filterData(data, dataFilters || []),
            dataTransform.keyColumn,
            dataTransform.aggregationColumnsSetting,
          )
        : filterData(data, dataFilters || []),
      graphType,
      config,
    );
    return d;
  }, [graphType, graphConfig, data, dataFilters, dataTransform]);
  if (!dataSettings)
    return (
      <P size='xs' className='text-center text-accent-dark-red dark:text-accent-red p-2'>
        Please make sure either `dataSettings` props are present as they are required for data.
      </P>
    );
  return (
    <div
      className={`${graphSettings?.theme || 'light'} flex ${
        graphSettings?.width ? 'w-fit grow-0' : 'w-full grow'
      }${graphSettings?.height ? '' : ' h-full'}`}
      dir={graphSettings?.language === 'he' || graphSettings?.language === 'ar' ? 'rtl' : undefined}
    >
      <div
        className={cn(
          `${
            !graphSettings?.backgroundColor
              ? 'bg-transparent '
              : graphSettings?.backgroundColor === true
                ? 'bg-primary-gray-200 dark:bg-primary-gray-650 '
                : ''
          }ml-auto mr-auto flex flex-col grow h-inherit ${graphSettings?.language || 'en'}`,
          graphSettings?.classNames?.graphContainer,
        )}
        style={{
          ...(graphSettings?.styles?.graphContainer || {}),
          ...(graphSettings?.backgroundColor && graphSettings?.backgroundColor !== true
            ? { backgroundColor: graphSettings?.backgroundColor }
            : {}),
        }}
        id={graphSettings?.graphID}
        ref={graphParentDiv}
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
            {data ||
            graphList
              .filter(el => el.geoHubMapPresentation)
              .map(el => el.graphID)
              .indexOf(graphType) !== -1 ? (
              <>
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
                        advancedGraphSettings?.classNames?.title ||
                        graphSettings?.classNames?.title,
                      description:
                        advancedGraphSettings?.classNames?.description ||
                        graphSettings?.classNames?.description,
                    }}
                    graphTitle={advancedGraphSettings?.graphTitle || graphSettings?.graphTitle}
                    graphDescription={
                      advancedGraphSettings?.graphDescription || graphSettings?.graphDescription
                    }
                    width={advancedGraphSettings?.width || graphSettings?.width}
                    graphDownload={
                      graphSettings?.graphDownload ? graphParentDiv.current : undefined
                    }
                    dataDownload={
                      graphSettings?.dataDownload && data ? (data.length > 0 ? data : null) : null
                    }
                  />
                ) : null}
                {filterSettings.length !== 0 ||
                (dataSelectionOptions || []).length !== 0 ||
                (advancedDataSelectionOptions || []).length !== 0 ||
                highlightDataPointSettings ? (
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
                            size='sm'
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
                              size='sm'
                              isClearable={false}
                              isSearchable
                              variant={uiMode}
                              controlShouldRenderValue
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
                                setAdvancedGraphSettings(
                                  getGraphSettings(dataSelectionOptions, updatedConfig),
                                );
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
                                setAdvancedGraphSettings(
                                  getGraphSettings(dataSelectionOptions, updatedConfig),
                                );
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
                            size='sm'
                            isMulti
                            isSearchable
                            variant={uiMode}
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
                                columnId: (el || []).map(
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
                          minWidth: '240px',
                        }}
                        key={i}
                      >
                        <Label className='mb-2'>{d.label}</Label>
                        {d.singleSelect ? (
                          <DropdownSelect
                            options={d.availableValues}
                            variant={uiMode}
                            isClearable={d.clearable === undefined ? true : d.clearable}
                            isSearchable
                            controlShouldRenderValue
                            filterOption={createFilter(filterConfig)}
                            onChange={el => {
                              handleFilterChange(d.filter, el);
                            }}
                            value={d.value}
                            defaultValue={d.defaultValue}
                          />
                        ) : (
                          <>
                            {d.ui !== 'radio' ? (
                              <DropdownSelect
                                options={d.availableValues}
                                variant={uiMode}
                                size='sm'
                                isMulti
                                isClearable={d.clearable === undefined ? true : d.clearable}
                                isSearchable
                                controlShouldRenderValue
                                filterOption={createFilter(filterConfig)}
                                onChange={el => {
                                  handleFilterChange(d.filter, el);
                                }}
                                value={d.value}
                                defaultValue={d.defaultValue}
                              />
                            ) : (
                              <CheckboxGroup
                                variant={uiMode}
                                defaultValue={
                                  d.defaultValue
                                    ? (
                                        d.defaultValue as {
                                          value: string | number;
                                          label: string | number;
                                        }[]
                                      ).map(el => `${el.value}`)
                                    : []
                                }
                                value={
                                  d.value
                                    ? (
                                        d.value as {
                                          value: string | number;
                                          label: string | number;
                                        }[]
                                      ).map(el => `${el.value}`)
                                    : undefined
                                }
                                onValueChange={el => {
                                  handleFilterChange(
                                    d.filter,
                                    d.availableValues.filter(v => el.indexOf(`${v.value}`) !== -1),
                                  );
                                }}
                              >
                                {d.availableValues.map((el, j) => (
                                  <CheckboxGroupItem
                                    label={`${el.label}`}
                                    value={`${el.value}`}
                                    key={j}
                                  />
                                ))}
                              </CheckboxGroup>
                            )}
                            {d.allowSelectAll ? (
                              <button
                                type='button'
                                className='bg-transparent border-0 p-0 mt-2 cursor-pointer text-primary-blue-600 dark:text-primary-blue-400'
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
                    {highlightDataPointSettings ? (
                      <div
                        style={{
                          width:
                            highlightDataPointSettings.width ||
                            `calc(${100 / noOfFiltersPerRow}% - ${
                              (noOfFiltersPerRow - 1) / noOfFiltersPerRow
                            }rem)`,
                          flexGrow: 1,
                          flexShrink: 0,
                          minWidth: '240px',
                        }}
                      >
                        <Label className='mb-2'>
                          {highlightDataPointSettings.label || 'Highlight data'}
                        </Label>
                        <DropdownSelect
                          options={highlightedDataPointOptions}
                          variant={uiMode}
                          size='sm'
                          isMulti
                          isClearable
                          isSearchable
                          controlShouldRenderValue
                          filterOption={createFilter(filterConfig)}
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          onChange={(el: any) => {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            setHighlightedDataPointList(el?.map((d: any) => d.value));
                          }}
                          value={highlightedDataPointList?.map(d => ({
                            label: d,
                            value: d,
                          }))}
                          defaultValue={highlightDataPointSettings.defaultValues?.map(d => ({
                            label: d,
                            value: d,
                          }))}
                        />
                      </div>
                    ) : null}
                  </div>
                ) : null}
                <GraphEl
                  graph={graphType}
                  graphData={graphData}
                  graphDataConfiguration={graphConfig}
                  debugMode={debugMode}
                  readableHeader={readableHeader || []}
                  updateFilters={updateFilters}
                  settings={{
                    ...(graphSettings || {}),
                    ...advancedGraphSettings,
                    graphTitle: undefined,
                    graphDescription: undefined,
                    graphDownload: false,
                    dataDownload: false,
                    backgroundColor: undefined,
                    padding: '0',
                    theme: graphSettings?.theme,
                    ...(highlightedDataPointList
                      ? {
                          highlightedDataPoints: highlightedDataPointList,
                          highlightedIds: highlightedDataPointList?.map(d => `${d}`),
                          highlightedLines: highlightedDataPointList?.map(d => d),
                        }
                      : {}),
                  }}
                />
              </>
            ) : (
              <div className='w-full flex justify-center p-4'>
                <Spinner />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
