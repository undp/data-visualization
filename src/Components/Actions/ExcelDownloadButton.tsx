import { Button } from '@undp/design-system-react/Button';
import { JSX } from 'react';

import { excelDownload } from '@/Utils/excelDownload';
import { FileDown } from '@/Components/Icons';

interface WsColInterface {
  wch: number;
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
  headers: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  xlsxHeader: any;
  wscols: WsColInterface[];
  buttonSmall?: boolean;
  className?: string;
}

export function ExcelDownloadButton(props: Props) {
  const {
    buttonContent,
    buttonType = 'tertiary',
    csvData,
    fileName = 'data',
    headers,
    xlsxHeader,
    wscols,
    buttonSmall,
    className = '',
  } = props;
  return (
    <Button
      variant={buttonType}
      className={`${buttonSmall ? 'p-2' : 'py-4 px-6'} ${className}`}
      onClick={() => excelDownload(csvData, fileName, headers, xlsxHeader, wscols)}
      aria-label='Click to download the data as xlsx'
    >
      {buttonContent || <FileDown />}
    </Button>
  );
}
