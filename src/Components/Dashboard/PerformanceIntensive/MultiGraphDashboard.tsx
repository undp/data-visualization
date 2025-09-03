import { useCallback, useEffect, useMemo, useState } from 'react';
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
  const [data, setData] = useState<any>(undefined);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [dataFromFile, setDataFromFile] = useState<any>(undefined);
  const [filterSettings, setFilterSettings] = useState<FilterSettingsDataType[]>([]);

  const threeDGraphs = ['threeDGlobe'];
  const geoHubMaps = ['geoHubCompareMap', 'geoHubMap', 'geoHubMapWithLayerSelection'];
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFilterChange = useCallback((filter: string, values: any) => {
    setFilterSettings(prev => prev.map(f => (f.filter === filter ? { ...f, value: values } : f)));
  }, []);
  return (
    <div
      className={`${theme || 'light'} flex grow`}
      dir={
        dashboardLayout.language === 'he' || dashboardLayout.language === 'ar' ? 'rtl' : undefined
      }
    >
      <div
        className={`${
          !dashboardLayout.backgroundColor
            ? 'bg-transparent '
            : dashboardLayout.backgroundColor === true
              ? 'bg-primary-gray-200 dark:bg-primary-gray-650 '
              : ''
        }ml-auto mr-auto gap-4 flex flex-col w-full grow h-inherit ${
          dashboardLayout.language || 'en'
        }`}
        style={{
          ...(dashboardLayout.backgroundColor && dashboardLayout.backgroundColor !== true
            ? { backgroundColor: dashboardLayout.backgroundColor }
            : {}),
        }}
        id={dashboardID}
      >
        <div
          style={{
            padding: dashboardLayout.backgroundColor
              ? dashboardLayout.padding || '1rem'
              : dashboardLayout.padding || 0,
            flexGrow: 1,
            display: 'flex',
          }}
        >
          <div className='flex flex-col w-full gap-4 grow justify-between'>
            {dashboardLayout.title || dashboardLayout.description ? (
              <GraphHeader
                graphTitle={dashboardLayout.title}
                graphDescription={dashboardLayout.description}
                isDashboard
              />
            ) : null}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {filterSettings.length !== 0 ? (
                <div
                  style={{
                    width: filterPosition === 'side' ? '280px' : '100%',
                    flexGrow: 1,
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      gap: '1rem',
                      flexWrap: 'wrap',
                      alignItems: 'flex-start',
                      width: '100%',
                      position: 'sticky',
                      top: '1rem',
                    }}
                  >
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
                style={{
                  width: filterPosition === 'side' ? 'calc(100% - 280px - 1rem)' : '100%',
                  minWidth: '280px',
                  flexGrow: 1,
                  display: 'flex',
                  gap: '1rem',
                  flexWrap: 'wrap',
                  flexShrink: '0',
                }}
              >
                {dashboardLayout.rows.map((d, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      gap: '1rem',
                      alignItems: 'stretch',
                      minHeight: `${d.height || 0}px`,
                      height: 'auto',
                      width: '100%',
                      flexWrap: 'wrap',
                    }}
                  >
                    {d.columns.map((el, j) => (
                      <div
                        key={j}
                        className='flex bg-transparent h-inherit grow min-w-60'
                        style={{
                          width: `calc(${
                            (100 * (el.columnWidth || 1)) / TotalWidth(d.columns)
                          }% - ${
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
                              radius:
                                el.graphType === 'donutChart' ? undefined : el.settings?.radius,
                              size: el.graphType === 'unitChart' ? el.settings?.size : undefined,
                              language: el.settings?.language || dashboardLayout.language,
                              theme: el.settings?.theme || theme,
                            }}
                            dataSettings={{
                              data: data ? filterData(data, dataFilters || []) : undefined,
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
                              radius:
                                el.graphType === 'donutChart' ? undefined : el.settings?.radius,
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
                              radius:
                                el.graphType === 'donutChart' ? undefined : el.settings?.radius,
                              size: el.graphType === 'unitChart' ? el.settings?.size : undefined,
                              language: el.settings?.language || dashboardLayout.language,
                              theme: el.settings?.theme || theme,
                            }}
                            dataSettings={{
                              data: data ? filterData(data, dataFilters || []) : undefined,
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
          </div>
        </div>
      </div>
    </div>
  );
}
