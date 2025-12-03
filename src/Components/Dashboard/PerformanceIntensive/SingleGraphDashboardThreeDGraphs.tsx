import { useEffect, useEffectEvent, useRef, useState } from 'react';
import intersection from 'lodash.intersection';
import flattenDeep from 'lodash.flattendeep';
import isEqual from 'fast-deep-equal';
import { createFilter, DropdownSelect } from '@undp/design-system-react/DropdownSelect';
import { CheckboxGroup, CheckboxGroupItem } from '@undp/design-system-react/CheckboxGroup';
import { RadioGroup, RadioGroupItem } from '@undp/design-system-react/RadioGroup';
import { Spinner } from '@undp/design-system-react/Spinner';
import { Label } from '@undp/design-system-react/Label';

import ThreeDGraphEl from './ThreeDGraphEl';

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
  HighlightDataPointSettingsDataType,
  ThreeDGraphType,
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
import { GraphContainer } from '@/Components/Elements/GraphContainer';

interface Props {
  graphSettings?: GraphSettingsDataType;
  readableHeader?: {
    value: string;
    label: string;
  }[];
  dataSettings: DataSettingsDataType;
  filters?: FilterUiSettingsDataType[];
  highlightDataPointSettings?: HighlightDataPointSettingsDataType;
  noOfFiltersPerRow?: number;
  graphType: ThreeDGraphType;
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

export function SingleGraphDashboardThreeDGraphs(props: Props) {
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
  const [filteredData, setFilteredData] = useState<any>(undefined);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(undefined);
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

  const filterConfig = {
    ignoreCase: true,
    ignoreAccents: true,
    trim: true,
  };

  const updateFiltersEvent = useEffectEvent(() => {
    const filterSettingsTemp = (filters || []).map(el => ({
      filter: el.column,
      label: el.label || `Filter by ${el.column}`,
      singleSelect: el.singleSelect,
      clearable: el.clearable,
      defaultValue: transformDefaultValue(el.defaultValue),
      value: transformDefaultValue(el.defaultValue),
      availableValues: getUniqValue(data, el.column)
        .filter(v => !el.excludeValues?.includes(`${v}`))
        .map(v => ({ value: v, label: v })),
      allowSelectAll: el.allowSelectAll,
      width: el.width,
    }));
    setFilterSettings(filterSettingsTemp);
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataFromFile = dataSettings.dataURL
          ? typeof dataSettings.dataURL === 'string'
            ? dataSettings.fileType === 'json'
              ? await fetchAndParseJSON(
                  dataSettings.dataURL,
                  dataSettings.columnsToArray,
                  dataSettings.dataTransformation,
                  debugMode,
                )
              : dataSettings.fileType === 'api'
                ? await fetchAndTransformDataFromAPI(
                    dataSettings.dataURL,
                    dataSettings.apiHeaders,
                    dataSettings.columnsToArray,
                    dataSettings.dataTransformation,
                    debugMode,
                  )
                : await fetchAndParseCSV(
                    dataSettings.dataURL,
                    dataSettings.dataTransformation,
                    dataSettings.columnsToArray,
                    debugMode,
                    dataSettings.delimiter,
                    true,
                  )
            : await fetchAndParseMultipleDataSources(
                dataSettings.dataURL,
                dataSettings.idColumnTitle,
              )
          : await transformColumnsToArray(dataSettings.data, dataSettings.columnsToArray);
        setData(dataFromFile);
      } catch (error) {
        console.error('Data fetching error:', error);
      }
    };
    fetchData();
    updateFiltersEvent();
  }, [dataSettings, debugMode]);

  useEffect(() => {
    updateFiltersEvent();
  }, [filters, data]);

  const filteredDataEvent = useEffectEvent(() => {
    if (!data || filterSettings.length === 0) setFilteredData(data);
    else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = data.filter((item: any) =>
        filterSettings.every(filter =>
          filter.value && flattenDeep([filter.value]).length > 0
            ? intersection(
                flattenDeep([item[filter.filter]]),
                flattenDeep([filter.value]).map(el => el.value),
              ).length > 0
            : true,
        ),
      );
      setFilteredData(result);
    }
  });

  useEffect(() => {
    filteredDataEvent();
  }, [filterSettings, data]);

  useEffect(() => {
    if (dataSelectionOptions)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAdvancedGraphSettings(getGraphSettings(dataSelectionOptions, graphDataConfiguration));
  }, [dataSelectionOptions, graphDataConfiguration]);

  const updateHighlightedDataPointOptions = useEffectEvent(() => {
    if (highlightDataPointSettings?.column && filteredData)
      setHighlightedDataPointOption(
        getUniqValue(filteredData, highlightDataPointSettings.column)
          .filter(v => !highlightDataPointSettings?.excludeValues?.includes(`${v}`))
          .map(d => ({ value: d, label: d })),
      );
  });

  useEffect(() => {
    updateHighlightedDataPointOptions();
  }, [highlightDataPointSettings]);

  useEffect(() => {
    if (!isEqual(prevGraphDataConfigRef.current, graphDataConfiguration)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setGraphConfig(graphDataConfiguration);
      prevGraphDataConfigRef.current = graphDataConfiguration;
    }
  }, [graphDataConfiguration]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFilterChange = (filter: string, values: any) => {
    setFilterSettings(prev => prev.map(f => (f.filter === filter ? { ...f, value: values } : f)));
  };

  const graphData = !data
    ? undefined
    : transformDataForGraph(
        dataTransform
          ? transformDataForAggregation(
              filterData(data, dataFilters || []),
              dataTransform.keyColumn,
              dataTransform.aggregationColumnsSetting,
            )
          : filterData(data, dataFilters || []),
        graphType,
        graphConfig,
      );
  return (
    <GraphContainer
      className={graphSettings?.classNames?.graphContainer}
      style={graphSettings?.styles?.graphContainer}
      id={graphSettings?.graphID}
      ref={graphParentDiv}
      aria-label={graphSettings?.ariaLabel}
      backgroundColor={graphSettings?.backgroundColor ?? false}
      theme={graphSettings?.theme || 'light'}
      language={graphSettings?.language || 'en'}
      width={graphSettings?.width}
      height={graphSettings?.height}
      padding={graphSettings?.padding}
      minHeight={graphSettings?.minHeight}
      relativeHeight={graphSettings?.relativeHeight}
    >
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
                  advancedGraphSettings?.styles?.description || graphSettings?.styles?.description,
              }}
              classNames={{
                title: advancedGraphSettings?.classNames?.title || graphSettings?.classNames?.title,
                description:
                  advancedGraphSettings?.classNames?.description ||
                  graphSettings?.classNames?.description,
              }}
              graphTitle={advancedGraphSettings?.graphTitle || graphSettings?.graphTitle}
              graphDescription={
                advancedGraphSettings?.graphDescription || graphSettings?.graphDescription
              }
              width={advancedGraphSettings?.width || graphSettings?.width}
              graphDownload={graphSettings?.graphDownload ? graphParentDiv : undefined}
              dataDownload={
                graphSettings?.dataDownload && data ? (data.length > 0 ? data : null) : null
              }
            />
          ) : null}
          {filterSettings.length !== 0 ||
          (dataSelectionOptions || []).length !== 0 ||
          (advancedDataSelectionOptions || []).length !== 0 ||
          highlightDataPointSettings ? (
            <div className='flex flex-wrap items-start gap-x-4 gap-y-0 w-full'>
              {advancedDataSelectionOptions?.map((d, i) => (
                <div
                  style={{
                    width:
                      d.width ||
                      `calc(${100 / noOfFiltersPerRow}% - ${
                        (noOfFiltersPerRow - 1) / noOfFiltersPerRow
                      }rem)`,
                    flexGrow: d.width ? 0 : 1,
                    flexShrink: d.ui !== 'radio' || d.width ? 0 : 1,
                    minWidth: '240px',
                  }}
                  key={i}
                  className='pb-4'
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
                    flexGrow: d.width ? 0 : 1,
                    flexShrink: d.ui !== 'radio' || d.width ? 0 : 1,
                    minWidth: '240px',
                  }}
                  key={i}
                  className='pb-4'
                >
                  <Label className='mb-2'>{d.label || `Visualize ${d.chartConfigId} by`}</Label>
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
                    flexGrow: d.width ? 0 : 1,
                    flexShrink: d.ui !== 'radio' || d.width ? 0 : 1,
                    minWidth: '240px',
                  }}
                  key={i}
                  className='pb-4'
                >
                  <Label className='mb-2'>{d.label}</Label>
                  {d.singleSelect ? (
                    d.ui !== 'radio' ? (
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
                      <RadioGroup
                        variant={uiMode}
                        defaultValue={(d.defaultValue as { value: string; label: string }).value}
                        onValueChange={el => {
                          handleFilterChange(
                            d.filter,
                            d.availableValues.filter(v => v.value === el),
                          );
                        }}
                      >
                        {d.availableValues.map((el, j) => (
                          <RadioGroupItem label={`${el.label}`} value={`${el.value}`} key={j} />
                        ))}
                      </RadioGroup>
                    )
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
                    flexGrow: highlightDataPointSettings.width ? 0 : 1,
                    flexShrink: 0,
                    minWidth: '240px',
                  }}
                  className='pb-4'
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
          <ThreeDGraphEl
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
              width: undefined,
              height: undefined,
              relativeHeight: undefined,
              minHeight: undefined,
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
    </GraphContainer>
  );
}
