import { useEffect, useState } from 'react';
import { Spinner } from '@undp/design-system-react/Spinner';

import { SingleGraphDashboard } from './SingleGraphDashboard';

import {
  AdvancedDataSelectionDataType,
  AggregationSettingsDataType,
  DataFilterDataType,
  DataSelectionDataType,
  DataSettingsDataType,
  FilterUiSettingsDataType,
  GraphConfigurationDataType,
  GraphSettingsDataType,
  GraphType,
  HighlightDataPointSettingsDataType,
} from '@/Types';
import { fetchAndParseJSON } from '@/Utils/fetchAndParseData';

interface ConfigObject {
  graphSettings?: GraphSettingsDataType;
  dataSettings?: DataSettingsDataType;
  filters?: FilterUiSettingsDataType[];
  graphType: GraphType;
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

export function SingleGraphDashboardFromConfig(props: Props) {
  const { config } = props;
  const [configSettings, setConfigSettings] = useState<ConfigObject | undefined>(undefined);

  useEffect(() => {
    if (typeof config === 'string') {
      const fetchData = fetchAndParseJSON(config);
      fetchData.then(d => {
        setConfigSettings(d);
      });
    } else {
      setConfigSettings(config);
    }
  }, [config]);
  if (!configSettings)
    return (
      <div className='w-full flex justify-center p-4'>
        <Spinner />
      </div>
    );
  return (
    <SingleGraphDashboard
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
