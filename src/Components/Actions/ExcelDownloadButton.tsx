import { Button } from '@undp/design-system-react/Button';
import { cn } from '@undp/design-system-react/cn';
import type { JSX } from 'react';
import { FileDown } from '@/Components/Icons';
import { excelDownload } from '@/Utils/excelDownload';

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
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  csvData: any;
  fileName?: string;
  headers: string[];
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
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
      className={cn(buttonSmall ? 'p-2' : 'py-4 px-6', className)}
      onClick={() => excelDownload(csvData, fileName, headers, xlsxHeader, wscols)}
      aria-label='Click to download the data as xlsx'
    >
      {buttonContent || <FileDown />}
    </Button>
  );
}
