import { useEffect, useState } from 'react';
import { Spinner } from '@undp/design-system-react/Spinner';

import { SingleGraphDashboardGeoHubMaps } from './SingleGraphDashboardGeoHubMaps';

import { GeoHubGraphType, GraphSettingsDataType } from '@/Types';
import { fetchAndParseJSON } from '@/Utils/fetchAndParseData';

interface ConfigObject {
  graphSettings?: GraphSettingsDataType;
  graphType: GeoHubGraphType;
  debugMode?: boolean;
  uiMode?: 'light' | 'normal';
}

interface Props {
  config: string | ConfigObject;
}

export function SingleGraphDashboardGeoHubMapsFromConfig(props: Props) {
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
    <SingleGraphDashboardGeoHubMaps
      graphSettings={configSettings.graphSettings}
      graphType={configSettings.graphType}
      debugMode={configSettings.debugMode}
      uiMode={configSettings.uiMode}
    />
  );
}
