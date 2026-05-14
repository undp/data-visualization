import { CSVLink } from 'react-csv';
import { Button } from '@undp/design-system-react/Button';
import { JSX } from 'react';
import { cn } from '@undp/design-system-react/cn';

import { FileDown } from '@/Components/Icons';

interface HeaderProps {
  label: string;
  key: string;
}

interface Props {
  buttonContent?: string | JSX.Element;
  buttonType?:
    | 'primary'
    | 'primary-without-icon'
    | 'secondary'
    | 'secondary-without-icon'
    | 'tertiary';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  csvData: any;
  fileName?: string;
  headers: HeaderProps[];
  separator?: ',' | ';';
  buttonSmall?: boolean;
  className?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const transformDataForCsv = (data: any) => {
  if (!data) return {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.map((obj: any) => {
    const newObj = { ...obj };

    Object.entries(newObj).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        newObj[key] = `${value.join(',')}`;
      }
      if (typeof value === 'string') {
        newObj[key] = `${value.replaceAll('"', "'")}`;
      }
    });

    return newObj;
  });
};
export function CsvDownloadButton(props: Props) {
  const {
    buttonContent,
    buttonType = 'tertiary',
    csvData,
    fileName = 'data',
    headers,
    separator = ',',
    buttonSmall = false,
    className,
  } = props;
  return (
    <CSVLink
      headers={headers}
      enclosingCharacter='"'
      separator={separator}
      data={transformDataForCsv(csvData)}
      filename={`${fileName}.csv`}
      asyncOnClick
      target='_blank'
      style={{ backgroundImage: 'none', textDecoration: 'none' }}
      aria-label='Click to download the data as csv'
    >
      <Button
        variant={buttonType}
        className={cn(
          'undp-viz-download-button no-underline border border-primary-gray-400 dark:border-primary-gray-550',
          buttonSmall ? 'p-2' : 'py-4 px-6',
          className,
        )}
      >
        {buttonContent || <FileDown />}
      </Button>
    </CSVLink>
  );
}
