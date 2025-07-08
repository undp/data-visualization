import { Modal } from '@undp/design-system-react';
import { useState } from 'react';

import { CsvDownloadButton } from '@/Components/Actions/CsvDownloadButton';
import { FileDown } from '@/Components/Icons';
import { StyleObject, ClassNameObject } from '@/Types';
import { string2HTML } from '@/Utils/string2HTML';

export type FilterDataType = {
  column: string;
  label?: string;
  defaultValue?: string;
  excludeValues?: string[];
  width?: string;
};

interface Props {
  data: object[];
  cardBackgroundColor?: string;
  styles?: StyleObject;
  classNames?: ClassNameObject;
  width?: number;
  height?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cardTemplate: string | ((_d: any) => React.ReactNode);
  cardMinWidth: number;
  noOfItemsInAPage?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  detailsOnClick?: string | ((_d: any) => React.ReactNode);
  allowDataDownloadOnDetail: boolean | string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseClick?: (_d: any) => void;
  page: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const csvData = (data: any) => {
  if (!data) return {};
  const dataForCsv = Object.entries(data).map(([key, value]) => {
    if (Array.isArray(value)) {
      return {
        ' ': key,
        value: `"${value.join('; ')}"`,
      };
    }
    return {
      ' ': key,
      value: `"${value}"`,
    };
  });
  return dataForCsv;
};

export function Graph(props: Props) {
  const {
    width,
    height,
    data,
    onSeriesMouseClick,
    cardTemplate,
    cardBackgroundColor,
    cardMinWidth = 320,
    detailsOnClick,
    noOfItemsInAPage,
    styles,
    classNames,
    page,
    allowDataDownloadOnDetail,
  } = props;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedData, setSelectedData] = useState<any>(undefined);
  return (
    <>
      <div
        className='undp-scrollbar w-full my-0 mx-auto grid gap-4 undp-viz-data-cards-container'
        style={{
          width: width ? `${width}px` : '100%',
          height: height ? `${height}px` : 'auto',
          gridTemplateColumns: `repeat(auto-fill, minmax(${cardMinWidth}px, 1fr))`,
        }}
      >
        {data
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .filter((_d: any, i: number) =>
            noOfItemsInAPage
              ? i < page * noOfItemsInAPage && i >= (page - 1) * noOfItemsInAPage
              : true,
          )
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((d: any, i: number) => (
            <div
              key={i}
              style={{
                ...(styles?.dataCards || {}),
                ...(cardBackgroundColor && { backgroundColor: cardBackgroundColor }),
              }}
              className={`w-full flex flex-col ${
                onSeriesMouseClick || detailsOnClick ? 'cursor-pointer' : 'cursor-auto'
              }${
                !cardBackgroundColor ? 'bg-primary-gray-200 dark:bg-primary-gray-600' : ''
              } ${classNames?.dataCards || ''}`}
              onClick={() => {
                onSeriesMouseClick?.(d);
                setSelectedData(d);
              }}
              dangerouslySetInnerHTML={
                typeof cardTemplate === 'string'
                  ? { __html: string2HTML(cardTemplate, d) }
                  : undefined
              }
            >
              {typeof cardTemplate === 'function' ? cardTemplate(d) : null}
            </div>
          ))}
      </div>
      {detailsOnClick && selectedData !== undefined ? (
        <Modal
          open={selectedData !== undefined}
          onClose={() => {
            setSelectedData(undefined);
          }}
        >
          <div
            className='graph-modal-content m-0'
            dangerouslySetInnerHTML={
              typeof detailsOnClick === 'string'
                ? { __html: string2HTML(detailsOnClick, selectedData) }
                : undefined
            }
          >
            {typeof detailsOnClick === 'function' ? detailsOnClick(selectedData) : null}
          </div>
          {allowDataDownloadOnDetail ? (
            <div className='flex'>
              <CsvDownloadButton
                csvData={csvData(selectedData)}
                headers={[
                  {
                    label: ' ',
                    key: ' ',
                  },
                  {
                    label: 'value',
                    key: 'value',
                  },
                ]}
                buttonContent={
                  <div className='flex items-center gap-4'>
                    {typeof allowDataDownloadOnDetail === 'string'
                      ? allowDataDownloadOnDetail
                      : null}
                    <FileDown />
                  </div>
                }
              />
            </div>
          ) : null}
        </Modal>
      ) : null}
    </>
  );
}
