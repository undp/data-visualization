import { useEffect, useState } from 'react';
import { Spinner } from '@undp/design-system-react/Spinner';

import { MultiGraphDashboardWideToLongFormat } from './MultiGraphDashboardWideToLongFormat';

import {
  ClassNameObject,
  DashboardFromWideToLongFormatLayoutDataType,
  DataFilterDataType,
  DataSettingsWideToLongDataType,
  StyleObject,
} from '@/Types';
import { fetchAndParseJSON } from '@/Utils/fetchAndParseData';

interface ConfigObject {
  validateDataAndSettings?: boolean;
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

interface Props {
  config: string | ConfigObject;
}

export function MultiGraphDashboardWideToLongFormatFromConfig(props: Props) {
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
    <MultiGraphDashboardWideToLongFormat
      dashboardID={configSettings.dashboardID}
      dashboardLayout={configSettings.dashboardLayout}
      dataSettings={configSettings.dataSettings}
      debugMode={configSettings.debugMode}
      theme={configSettings.theme}
      readableHeader={configSettings.readableHeader}
      dataFilters={configSettings.dataFilters}
      uiMode={configSettings.uiMode}
      graphStyles={configSettings.graphStyles}
      graphClassNames={configSettings.graphClassNames}
    />
  );
}
