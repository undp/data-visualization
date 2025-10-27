import { useEffect, useEffectEvent, useState } from 'react';
import intersection from 'lodash.intersection';
import flattenDeep from 'lodash.flattendeep';
import { createFilter, DropdownSelect } from '@undp/design-system-react/DropdownSelect';
import { Label } from '@undp/design-system-react/Label';

import { SingleGraphDashboard } from '../SingleGraphDashboard';

import { SingleGraphDashboardThreeDGraphs } from './SingleGraphDashboardThreeDGraphs';
import { SingleGraphDashboardGeoHubMaps } from './SingleGraphDashboardGeoHubMaps';

import {
  ClassNameObject,
  PerformanceIntensiveDashboardLayoutDataType,
  DataFilterDataType,
  DataSettingsDataType,
  FilterSettingsDataType,
  FilterUiSettingsDataType,
  GraphType,
  StyleObject,
  PerformanceIntensiveDashboardColumnDataType,
  ThreeDGraphType,
  GeoHubGraphType,
} from '@/Types';
import {
  fetchAndParseCSV,
  fetchAndParseJSON,
  fetchAndParseMultipleDataSources,
  fetchAndTransformDataFromAPI,
} from '@/Utils/fetchAndParseData';
import { getUniqValue } from '@/Utils/getUniqValue';
import { GraphHeader } from '@/Components/Elements/GraphHeader';
import { transformColumnsToArray } from '@/Utils/transformData/transformColumnsToArray';
import { filterData } from '@/Utils/transformData/filterData';
import { transformDefaultValue } from '@/Utils/transformDataForSelect';
import { GraphContainer } from '@/Components/Elements/GraphContainer';

interface Props {
  dashboardID?: string;
  dashboardLayout: PerformanceIntensiveDashboardLayoutDataType;
  dataSettings: DataSettingsDataType;
  filters?: FilterUiSettingsDataType[];
  noOfFiltersPerRow?: number;
  dataFilters?: DataFilterDataType[];
  debugMode?: boolean;
  theme?: 'dark' | 'light';
  filterPosition?: 'top' | 'side';
  readableHeader?: {
    value: string;
    label: string;
  }[];
  uiMode?: 'light' | 'normal';
  graphStyles?: StyleObject;
  graphClassNames?: ClassNameObject;
}

const TotalWidth = (columns: PerformanceIntensiveDashboardColumnDataType[]) => {
  const columnWidth = columns.map(d => d.columnWidth || 1);
  const sum = columnWidth.reduce((acc, cur) => acc + cur, 0);
  return sum;
};

const GraphWithAttachedFilter: GraphType[] = [
  'barChart',
  'choroplethMap',
  'biVariateChoroplethMap',
  'circlePacking',
  'treeMap',
];

export function PerformanceIntensiveMultiGraphDashboard(props: Props) {
  const {
    dashboardID,
    dashboardLayout,
    dataSettings,
    filters,
    debugMode,
    theme = 'light',
    readableHeader,
    dataFilters,
    noOfFiltersPerRow = 4,
    filterPosition,
    uiMode = 'normal',
    graphStyles,
    graphClassNames,
  } = props;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [filteredData, setFilteredData] = useState<any>(undefined);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(undefined);
  const [filterSettings, setFilterSettings] = useState<FilterSettingsDataType[]>([]);

  const threeDGraphs = ['threeDGlobe'];
  const geoHubMaps = ['geoHubCompareMap', 'geoHubMap', 'geoHubMapWithLayerSelection'];
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
  }, [filters]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFilterChange = (filter: string, values: any) => {
    setFilterSettings(prev => prev.map(f => (f.filter === filter ? { ...f, value: values } : f)));
  };
  return (
    <GraphContainer
      id={dashboardID}
      aria-label='This is a dashboard'
      backgroundColor={dashboardLayout.backgroundColor ?? false}
      theme={theme || 'light'}
      language={dashboardLayout.language || 'en'}
      padding={dashboardLayout.padding}
    >
      {dashboardLayout.title || dashboardLayout.description ? (
        <GraphHeader
          graphTitle={dashboardLayout.title}
          graphDescription={dashboardLayout.description}
          isDashboard
        />
      ) : null}
      <div className='flex gap-4 flex-wrap'>
        {filterSettings.length !== 0 ? (
          <div
            className='flex-grow flex-shrink-0'
            style={{
              width: filterPosition === 'side' ? '280px' : '100%',
            }}
          >
            <div className='flex flex-wrap items-start gap-4 w-full sticky top-4'>
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
                      isClearable={d.clearable === undefined ? true : d.clearable}
                      size='sm'
                      variant={uiMode}
                      isMulti={false}
                      isSearchable
                      filterOption={createFilter(filterConfig)}
                      onChange={el => {
                        handleFilterChange(d.filter, el);
                      }}
                      defaultValue={d.defaultValue}
                      value={d.value}
                    />
                  ) : (
                    <>
                      <DropdownSelect
                        options={d.availableValues}
                        isMulti
                        size='sm'
                        isClearable={d.clearable === undefined ? true : d.clearable}
                        variant={uiMode}
                        isSearchable
                        controlShouldRenderValue
                        closeMenuOnSelect={false}
                        hideSelectedOptions={false}
                        filterOption={createFilter(filterConfig)}
                        onChange={el => {
                          handleFilterChange(d.filter, el);
                        }}
                        value={d.value}
                        defaultValue={d.defaultValue}
                      />
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
            </div>
          </div>
        ) : null}
        <div
          className='flex flex-wrap gap-4 flex-grow flex-shrink-0 min-w-[280px]'
          style={{
            width: filterPosition === 'side' ? 'calc(100% - 280px - 1rem)' : '100%',
          }}
        >
          {dashboardLayout.rows.map((d, i) => (
            <div
              key={i}
              className='flex flex-wrap items-stretch gap-4 w-full h-auto'
              style={{
                minHeight: `${d.height || 0}px`,
              }}
            >
              {d.columns.map((el, j) => (
                <div
                  key={j}
                  className='flex bg-transparent h-inherit grow min-w-60'
                  style={{
                    width: `calc(${(100 * (el.columnWidth || 1)) / TotalWidth(d.columns)}% - ${
                      (TotalWidth(d.columns) - (el.columnWidth || 1)) / TotalWidth(d.columns)
                    }rem)`,
                    minHeight: 'inherit',
                  }}
                >
                  {threeDGraphs.includes(el.graphType) ? (
                    <SingleGraphDashboardThreeDGraphs
                      graphType={el.graphType as ThreeDGraphType}
                      dataFilters={el.dataFilters}
                      uiMode={uiMode}
                      graphSettings={{
                        ...(el.settings || {}),
                        width: undefined,
                        height: undefined,
                        resetSelectionOnDoubleClick: el.attachedFilter
                          ? false
                          : el.settings?.resetSelectionOnDoubleClick,
                        styles: el.settings?.styles || graphStyles,
                        classNames: el.settings?.classNames || graphClassNames,
                        radius: el.graphType === 'donutChart' ? undefined : el.settings?.radius,
                        size: el.graphType === 'unitChart' ? el.settings?.size : undefined,
                        language: el.settings?.language || dashboardLayout.language,
                        theme: el.settings?.theme || theme,
                      }}
                      dataSettings={{
                        data: filteredData
                          ? filterData(filteredData, dataFilters || [])
                          : undefined,
                      }}
                      dataTransform={el.dataTransform}
                      dataSelectionOptions={el.dataSelectionOptions}
                      advancedDataSelectionOptions={el.advancedDataSelectionOptions}
                      graphDataConfiguration={el.graphDataConfiguration}
                      debugMode={debugMode}
                      readableHeader={readableHeader || []}
                    />
                  ) : geoHubMaps.includes(el.graphType) ? (
                    <SingleGraphDashboardGeoHubMaps
                      graphType={el.graphType as GeoHubGraphType}
                      uiMode={uiMode}
                      graphSettings={{
                        ...(el.settings || {}),
                        width: undefined,
                        height: undefined,
                        resetSelectionOnDoubleClick: el.attachedFilter
                          ? false
                          : el.settings?.resetSelectionOnDoubleClick,
                        styles: el.settings?.styles || graphStyles,
                        classNames: el.settings?.classNames || graphClassNames,
                        radius: el.graphType === 'donutChart' ? undefined : el.settings?.radius,
                        size: el.graphType === 'unitChart' ? el.settings?.size : undefined,
                        language: el.settings?.language || dashboardLayout.language,
                        theme: el.settings?.theme || theme,
                      }}
                      debugMode={debugMode}
                    />
                  ) : (
                    <SingleGraphDashboard
                      graphType={el.graphType as GraphType}
                      dataFilters={el.dataFilters}
                      uiMode={uiMode}
                      graphSettings={{
                        ...(el.settings || {}),
                        width: undefined,
                        height: undefined,
                        resetSelectionOnDoubleClick: el.attachedFilter
                          ? false
                          : el.settings?.resetSelectionOnDoubleClick,
                        styles: el.settings?.styles || graphStyles,
                        classNames: el.settings?.classNames || graphClassNames,
                        radius: el.graphType === 'donutChart' ? undefined : el.settings?.radius,
                        size: el.graphType === 'unitChart' ? el.settings?.size : undefined,
                        language: el.settings?.language || dashboardLayout.language,
                        theme: el.settings?.theme || theme,
                      }}
                      dataSettings={{
                        data: filteredData
                          ? filterData(filteredData, dataFilters || [])
                          : undefined,
                      }}
                      updateFilters={
                        el.attachedFilter &&
                        GraphWithAttachedFilter.indexOf(el.graphType as GraphType) !== -1 &&
                        filterSettings.findIndex(f => f.filter === el.attachedFilter) !== -1
                          ? dClicked => {
                              const indx = filterSettings.findIndex(
                                f => f.filter === el.attachedFilter,
                              );
                              const value = dClicked
                                ? filterSettings[indx].singleSelect
                                  ? { value: dClicked, label: dClicked }
                                  : [{ value: dClicked, label: dClicked }]
                                : undefined;
                              handleFilterChange(el.attachedFilter as string, value);
                            }
                          : undefined
                      }
                      dataTransform={el.dataTransform}
                      dataSelectionOptions={el.dataSelectionOptions}
                      advancedDataSelectionOptions={el.advancedDataSelectionOptions}
                      graphDataConfiguration={el.graphDataConfiguration}
                      debugMode={debugMode}
                      readableHeader={readableHeader || []}
                    />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </GraphContainer>
  );
}
