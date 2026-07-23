import { cn } from '@undp/design-system-react/cn';
import { Modal } from '@undp/design-system-react/Modal';
import { useState } from 'react';
import { CsvDownloadButton } from '@/Components/Actions/CsvDownloadButton';
import { FileDown } from '@/Components/Icons';
import type { ClassNameObject, StyleObject } from '@/Types';
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
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  cardTemplate: string | ((_d: any) => React.ReactNode);
  cardMinWidth: number;
  noOfItemsInAPage?: number;
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  detailsOnClick?: string | ((_d: any) => React.ReactNode);
  allowDataDownloadOnDetail: boolean | string;
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  onSeriesMouseClick?: (_d: any) => void;
  page: number;
}

// biome-ignore lint/suspicious/noExplicitAny: undefined data type
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
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
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
          // biome-ignore lint/suspicious/noExplicitAny: undefined data type
          .filter((_d: any, i: number) =>
            noOfItemsInAPage
              ? i < page * noOfItemsInAPage && i >= (page - 1) * noOfItemsInAPage
              : true,
          )
          // biome-ignore lint/suspicious/noExplicitAny: undefined data type
          .map((d: any, i: number) => (
            // biome-ignore lint/a11y/noStaticElementInteractions: div is intentionally interactive as a clickable card container; keyboard and accessibility behavior is handled separately
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: index is the unique identifier
              key={i}
              style={{
                ...(styles?.dataCards || {}),
                ...(cardBackgroundColor && { backgroundColor: cardBackgroundColor }),
              }}
              className={cn(
                'w-full flex flex-col',
                onSeriesMouseClick || detailsOnClick ? 'cursor-pointer' : 'cursor-auto',
                !cardBackgroundColor ? 'bg-surface' : '',
                classNames?.dataCards,
              )}
              onClick={() => {
                onSeriesMouseClick?.(d);
                setSelectedData(d);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onSeriesMouseClick?.(d);
                  setSelectedData(d);
                }
              }}
              // biome-ignore lint/security/noDangerouslySetInnerHtmlWithChildren: Allow setInnerHTML here
              // biome-ignore lint/security/noDangerouslySetInnerHtml: Allow setInnerHTML here
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
            // biome-ignore lint/security/noDangerouslySetInnerHtmlWithChildren: Allow setInnerHTML here
            // biome-ignore lint/security/noDangerouslySetInnerHtml: Allow setInnerHTML here
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
