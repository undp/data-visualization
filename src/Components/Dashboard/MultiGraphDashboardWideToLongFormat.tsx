import { useEffect, useEffectEvent, useState } from 'react';
import { createFilter, DropdownSelect } from '@undp/design-system-react/DropdownSelect';
import { Label } from '@undp/design-system-react/Label';
import { Spinner } from '@undp/design-system-react/Spinner';

import { SingleGraphDashboard } from './SingleGraphDashboard';

import {
  ClassNameObject,
  DashboardFromWideToLongFormatColumnDataType,
  DashboardFromWideToLongFormatLayoutDataType,
  DataFilterDataType,
  DataSettingsWideToLongDataType,
  StyleObject,
} from '@/Types';
import {
  fetchAndParseCSV,
  fetchAndParseJSON,
  fetchAndParseMultipleDataSources,
  fetchAndTransformDataFromAPI,
} from '@/Utils/fetchAndParseData';
import { GraphHeader } from '@/Components/Elements/GraphHeader';
import { wideToLongTransformation } from '@/Utils/wideToLongTranformation';
import { filterData } from '@/Utils/transformData/filterData';
import { transformColumnsToArray } from '@/Utils/transformData/transformColumnsToArray';

interface Props {
  dashboardID?: string;
  dashboardLayout: DashboardFromWideToLongFormatLayoutDataType;
  dataSettings: DataSettingsWideToLongDataType;
  debugMode?: boolean;
  theme?: 'dark' | 'light';
  readableHeader?: {
    value: string;
    label: string;
  }[];
  dataFilters?: DataFilterDataType[];
  uiMode?: 'light' | 'normal';
  graphStyles?: StyleObject;
  graphClassNames?: ClassNameObject;
}

const TotalWidth = (columns: DashboardFromWideToLongFormatColumnDataType[]) => {
  const columnWidth = columns.map(d => d.columnWidth || 1);
  const sum = columnWidth.reduce((acc, cur) => acc + cur, 0);
  return sum;
};

export function MultiGraphDashboardWideToLongFormat(props: Props) {
  const {
    dashboardID,
    dashboardLayout,
    dataSettings,
    debugMode,
    theme = 'light',
    readableHeader,
    dataFilters,
    uiMode = 'normal',
    graphStyles,
    graphClassNames,
  } = props;

  const filterConfig = {
    ignoreCase: true,
    ignoreAccents: true,
    trim: true,
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [filteredData, setFilteredData] = useState<any>(undefined);
  const [filterValues, setFilterValues] = useState<string[]>([]);
  const [selectedFilterValues, setSelectedFilterValues] = useState<string | undefined>(undefined);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(undefined);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [unformattedData, setUnformattedData] = useState<any>(undefined);

  const updateDataAndFilterValueEvent = useEffectEvent(() => {
    const filteredData = filterData(unformattedData, dataFilters || []);
    setFilterValues(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      filteredData.map((el: any) => el[dataSettings.keyColumn]),
    );
    setSelectedFilterValues(filteredData[0][dataSettings.keyColumn]);
    const tempData = wideToLongTransformation(
      filteredData,
      dataSettings.keyColumn,
      readableHeader || [],
      debugMode,
    );
    setData(tempData);
  });

  const updateFilteredDataEvent = useEffectEvent(() => {
    if (data) {
      const filteredDataTemp = data.filter(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (item: any) => item[dataSettings.keyColumn] === selectedFilterValues,
      );
      setFilteredData(filteredDataTemp);
    }
  });

  useEffect(() => {
    updateFilteredDataEvent();
  }, [selectedFilterValues, dataSettings.keyColumn]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataFromFile = dataSettings.dataURL
          ? typeof dataSettings.dataURL === 'string'
            ? dataSettings.fileType === 'json'
              ? await fetchAndParseJSON(
                  dataSettings.dataURL,
                  undefined,
                  dataSettings.dataTransformation,
                  debugMode,
                )
              : dataSettings.fileType === 'api'
                ? await fetchAndTransformDataFromAPI(
                    dataSettings.dataURL,
                    dataSettings.apiHeaders,
                    undefined,
                    dataSettings.dataTransformation,
                    debugMode,
                  )
                : await fetchAndParseCSV(
                    dataSettings.dataURL,
                    dataSettings.dataTransformation,
                    undefined,
                    debugMode,
                    dataSettings.delimiter,
                    true,
                  )
            : await fetchAndParseMultipleDataSources(
                dataSettings.dataURL,
                dataSettings.idColumnTitle,
              )
          : await transformColumnsToArray(dataSettings.data, undefined);
        setUnformattedData(dataFromFile);
        updateDataAndFilterValueEvent();
      } catch (error) {
        console.error('Data fetching error:', error);
      }
    };
    fetchData();
  }, [dataSettings, debugMode]);

  useEffect(() => {
    updateDataAndFilterValueEvent();
  }, [dataFilters, readableHeader]);
  return (
    <div
      className={`${theme || 'light'} flex grow`}
      dir={
        dashboardLayout.language === 'he' || dashboardLayout.language === 'ar' ? 'rtl' : undefined
      }
    >
      <div
        className={`${
          !dashboardLayout?.backgroundColor
            ? 'bg-transparent '
            : dashboardLayout?.backgroundColor === true
              ? 'bg-primary-gray-200 dark:bg-primary-gray-650 '
              : ''
        }flex flex-col h-inherit w-full ml-auto mr-auto grow gap-4 ${
          dashboardLayout?.language || 'en'
        }`}
        style={{
          ...(dashboardLayout?.backgroundColor && dashboardLayout?.backgroundColor !== true
            ? { backgroundColor: dashboardLayout?.backgroundColor }
            : {}),
        }}
        id={dashboardID}
      >
        <div
          className='flex grow'
          style={{
            padding: dashboardLayout.backgroundColor
              ? dashboardLayout.padding || '1rem'
              : dashboardLayout.padding || 0,
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
            {filteredData ? (
              <>
                <div
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    flexWrap: 'wrap',
                    alignItems: 'flex-start',
                    width: '100%',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      flexGrow: 1,
                      flexShrink: 0,
                      minWidth: '240px',
                    }}
                  >
                    {dashboardLayout.dropdownLabel ? (
                      <Label className='mb-2'>{dashboardLayout.dropdownLabel}</Label>
                    ) : null}
                    <DropdownSelect
                      options={filterValues.map(d => ({
                        value: d,
                        label: d,
                      }))}
                      size='sm'
                      variant={uiMode}
                      isClearable={false}
                      isSearchable
                      controlShouldRenderValue
                      filterOption={createFilter(filterConfig)}
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      onChange={(el: any) => {
                        setSelectedFilterValues(el?.value);
                      }}
                      defaultValue={{
                        value: selectedFilterValues as string,
                        label: selectedFilterValues as string,
                      }}
                    />
                  </div>
                </div>
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
                        <SingleGraphDashboard
                          graphType={el.graphType}
                          dataFilters={el.dataFilters}
                          uiMode={uiMode}
                          graphSettings={{
                            ...(el.settings || {}),
                            width: undefined,
                            height: undefined,
                            radius: el.graphType === 'donutChart' ? undefined : el.settings?.radius,
                            size: el.graphType === 'unitChart' ? el.settings.size : undefined,
                            language: el.settings?.language || dashboardLayout.language,
                            theme: el.settings?.theme || theme,
                            styles: el.settings?.styles || graphStyles,
                            classNames: el.settings?.classNames || graphClassNames,
                          }}
                          dataSettings={{ data: filteredData }}
                          graphDataConfiguration={
                            el.graphDataConfiguration
                              ? el.graphDataConfiguration
                              : el.graphType === 'unitChart'
                                ? [
                                    {
                                      columnId: 'indicator',
                                      chartConfigId: 'label',
                                    },
                                    { columnId: 'value', chartConfigId: 'value' },
                                  ]
                                : [
                                    {
                                      columnId: 'indicator',
                                      chartConfigId: 'label',
                                    },
                                    { columnId: 'value', chartConfigId: 'size' },
                                  ]
                          }
                          debugMode={debugMode}
                          readableHeader={readableHeader || []}
                        />
                      </div>
                    ))}
                  </div>
                ))}
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
