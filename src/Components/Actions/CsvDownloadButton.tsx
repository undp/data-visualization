import { Button } from '@undp/design-system-react/Button';
import { cn } from '@undp/design-system-react/cn';
import type { JSX } from 'react';
import { CSVLink } from 'react-csv';

import { FileDown } from '@/Components/Icons';
import type { Color } from '@/Types';

interface HeaderProps {
  label: string;
  key: string;
}

interface Props {
  buttonContent?: string | JSX.Element;
  buttonColor?: Color;
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  csvData: any;
  fileName?: string;
  headers: HeaderProps[];
  separator?: ',' | ';';
  buttonSmall?: boolean;
  className?: string;
}

// biome-ignore lint/suspicious/noExplicitAny: undefined data type
const transformDataForCsv = (data: any) => {
  if (!data) return {};
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
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
    buttonColor = 'surface-sm',
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
        variant='primary'
        className={cn(
          'undp-viz-download-button no-underline border border-stroke',
          buttonSmall ? 'p-2' : 'py-4 px-6',
          className,
        )}
        endIcon='none'
        color={buttonColor}
      >
        {buttonContent || <FileDown />}
      </Button>
    </CSVLink>
  );
}
