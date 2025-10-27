import { useEffect, useState } from 'react';
import { Spinner } from '@undp/design-system-react/Spinner';

import { SingleGraphDashboardThreeDGraphs } from './SingleGraphDashboardThreeDGraphs';

import {
  AdvancedDataSelectionDataType,
  AggregationSettingsDataType,
  DataFilterDataType,
  DataSelectionDataType,
  DataSettingsDataType,
  FilterUiSettingsDataType,
  GraphConfigurationDataType,
  GraphSettingsDataType,
  HighlightDataPointSettingsDataType,
  ThreeDGraphType,
} from '@/Types';
import { fetchAndParseJSON } from '@/Utils/fetchAndParseData';

interface ConfigObject {
  graphSettings?: GraphSettingsDataType;
  dataSettings: DataSettingsDataType;
  filters?: FilterUiSettingsDataType[];
  graphType: ThreeDGraphType;
  noOfFiltersPerRow?: number;
  dataTransform?: {
    keyColumn: string;
    aggregationColumnsSetting?: AggregationSettingsDataType[];
  };
  dataFilters?: DataFilterDataType[];
  graphDataConfiguration?: GraphConfigurationDataType[];
  debugMode?: boolean;
  dataSelectionOptions?: DataSelectionDataType[];
  advancedDataSelectionOptions?: AdvancedDataSelectionDataType[];
  highlightDataPointSettings?: HighlightDataPointSettingsDataType;
  readableHeader?: {
    value: string;
    label: string;
  }[];
  uiMode?: 'light' | 'normal';
}

interface Props {
  config: string | ConfigObject;
}

export function SingleGraphDashboardThreeDGraphsFromConfig(props: Props) {
  const { config } = props;
  const [configSettings, setConfigSettings] = useState<ConfigObject | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      if (typeof config === 'string') {
        const data = await fetchAndParseJSON(config);
        setConfigSettings(data);
      } else {
        setConfigSettings(config);
      }
    };
    fetchData();
  }, [config]);
  if (!configSettings)
    return (
      <div className='w-full flex justify-center p-4'>
        <Spinner />
      </div>
    );
  return (
    <SingleGraphDashboardThreeDGraphs
      graphSettings={configSettings.graphSettings}
      dataSettings={configSettings.dataSettings}
      filters={configSettings.filters}
      graphType={configSettings.graphType}
      dataTransform={configSettings.dataTransform}
      graphDataConfiguration={configSettings.graphDataConfiguration}
      dataFilters={configSettings.dataFilters}
      debugMode={configSettings.debugMode}
      dataSelectionOptions={configSettings.dataSelectionOptions}
      advancedDataSelectionOptions={configSettings.advancedDataSelectionOptions}
      readableHeader={configSettings.readableHeader}
      noOfFiltersPerRow={configSettings.noOfFiltersPerRow}
      uiMode={configSettings.uiMode}
      highlightDataPointSettings={configSettings.highlightDataPointSettings}
    />
  );
}
