import React, { useEffect, useMemo, useState } from 'react';
import intersection from 'lodash.intersection';
import flattenDeep from 'lodash.flattendeep';
import { createFilter, DropdownSelect } from '@undp/design-system-react/DropdownSelect';
import { cn } from '@undp/design-system-react/cn';
import { P } from '@undp/design-system-react/Typography';
import { Pagination } from '@undp/design-system-react/Pagination';
import { Search } from '@undp/design-system-react/Search';
import orderBy from 'lodash.orderby';

import { Graph } from './Graph';

import { Languages, SourcesDataType, StyleObject, ClassNameObject } from '@/Types';
import { GraphFooter } from '@/Components/Elements/GraphFooter';
import { GraphHeader } from '@/Components/Elements/GraphHeader';
import { getUniqValue } from '@/Utils/getUniqValue';
import { transformDefaultValue } from '@/Utils/transformDataForSelect';

export type FilterDataType = {
  column: string;
  label?: string;
  defaultValue?: string;
  excludeValues?: string[];
  width?: string;
};

interface Props {
  // Data
  /** Array of data objects */
  data: object[];

  // Titles, Labels, and Sources
  /** Title of the graph */
  graphTitle?: string | React.ReactNode;
  /** Description of the graph */
  graphDescription?: string | React.ReactNode;
  /** Footnote for the graph */
  footNote?: string | React.ReactNode;
  /** Source data for the graph */
  sources?: SourcesDataType[];
  /** Accessibility label */
  ariaLabel?: string;

  // Colors and Styling
  /** Background color of each of the card */
  cardBackgroundColor?: string;
  /** Background color of the graph */
  backgroundColor?: string | boolean;
  /** Custom styles for the graph. Each object should be a valid React CSS style object. */
  styles?: StyleObject;
  /** Custom class names */
  classNames?: ClassNameObject;

  // Size and Spacing
  /** Width of the graph */
  width?: number;
  /** Height of the graph */
  height?: number;
  /** Padding around the graph. Defaults to 0 if no backgroundColor is mentioned else defaults to 1rem */
  padding?: string;

  // Graph Parameters
  /** Html for each card. If the type is string then this uses the [handlebar](../?path=/docs/misc-handlebars-templates-and-custom-helpers--docs) template to display the data. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cardTemplate: string | ((_d: any) => React.ReactNode);
  /** Allows users to add a dropdown menus, that can be used as filters in the graph. Each filter is an object that specifies the column to filter by, and the default value. All the filters are single select only.  */
  cardFilters?: FilterDataType[];
  /** Allows users to add a dropdown menus, that can be used to sort the cards based on different columns. */
  cardSortingOptions?: {
    defaultValue?: string;
    options: {
      value: string;
      label: string;
      type: 'asc' | 'desc';
    }[];
    width?: string;
  };
  /** Adds a search bar to search the cards list. The array defines all the columns from the data where text is used to search from. */
  cardSearchColumns?: string[];
  /** Min width of the cards for responsiveness. */
  cardMinWidth?: number;
  /** Add a button to download data object when viewing details. If true, data can be downloaded; if a string is provided, it specifies the button label. */
  allowDataDownloadOnDetail?: string | boolean;
  /** Defines the number of items displayed per page. */
  noOfItemsInAPage?: number;

  // Interactions and Callbacks
  /** Details displayed on the modal when user clicks of a data point. If the type is string then this uses the [handlebar](../?path=/docs/misc-handlebars-templates-and-custom-helpers--docs) template to display the data */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  detailsOnClick?: string | ((_d: any) => React.ReactNode);
  /** Callback for mouse click event */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseClick?: (_d: any) => void;

  // Configuration and Options
  /** Language setting  */
  language?: Languages;
  /** Color theme */
  theme?: 'light' | 'dark';
  /** Theme for the UI elements */
  uiMode?: 'light' | 'normal';
  /** Unique ID for the graph */
  graphID?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const filterByKeys = (jsonArray: any, keys: string[], substring: string) => {
  if (keys.length === 0) return jsonArray;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return jsonArray.filter((item: any) =>
    keys.some(key => item[key]?.toLowerCase().includes(substring.toLowerCase())),
  );
};

export function DataCards(props: Props) {
  const {
    width,
    height,
    graphTitle,
    sources,
    graphDescription,
    footNote,
    graphID,
    data,
    onSeriesMouseClick,
    language = 'en',
    theme = 'light',
    ariaLabel,
    cardTemplate,
    cardBackgroundColor,
    cardFilters,
    cardSortingOptions,
    cardSearchColumns,
    cardMinWidth = 320,
    backgroundColor = false,
    padding,
    detailsOnClick,
    allowDataDownloadOnDetail = false,
    noOfItemsInAPage,
    uiMode = 'normal',
    styles,
    classNames,
  } = props;

  const [cardData, setCardData] = useState(data);

  const [page, setPage] = useState(1);

  const [searchQuery, setSearchQuery] = useState('');
  const filterSettings = useMemo(
    () =>
      (cardFilters || []).map(el => ({
        filter: el.column,
        label: el.label || `Filter by ${el.column}`,
        singleSelect: true,
        clearable: true,
        defaultValue: transformDefaultValue(el.defaultValue),
        availableValues: getUniqValue(data, el.column)
          .filter(v => !el.excludeValues?.includes(`${v}`))
          .map(v => ({ value: v, label: v })),
        width: el.width,
      })),
    [cardFilters, data],
  );

  const [selectedFilters, setSelectedFilters] = useState(
    (cardFilters || []).map(el => ({
      filter: el.column,
      value: transformDefaultValue(el.defaultValue),
    })),
  );
  const [sortedBy, setSortedBy] = useState<
    | {
        value: string;
        label: string;
        type: 'asc' | 'desc';
      }
    | undefined
  >(
    cardSortingOptions
      ? !cardSortingOptions.defaultValue ||
        cardSortingOptions.options.findIndex(el => el.label === cardSortingOptions.defaultValue) ===
          -1
        ? cardSortingOptions.options[0]
        : cardSortingOptions.options[
            cardSortingOptions.options.findIndex(el => el.label === cardSortingOptions.defaultValue)
          ]
      : undefined,
  );

  const filterConfig = useMemo(
    () => ({
      ignoreCase: true,
      ignoreAccents: true,
      trim: true,
    }),
    [],
  );

  useEffect(() => {
    setSortedBy(
      cardSortingOptions
        ? !cardSortingOptions.defaultValue ||
          cardSortingOptions.options.findIndex(
            el => el.label === cardSortingOptions.defaultValue,
          ) === -1
          ? cardSortingOptions.options[0]
          : cardSortingOptions.options[
              cardSortingOptions.options.findIndex(
                el => el.label === cardSortingOptions.defaultValue,
              )
            ]
        : undefined,
    );
  }, [cardSortingOptions]);

  useEffect(() => {
    const filteredData = filterByKeys(data, cardSearchColumns || [], searchQuery).filter(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (item: any) =>
        selectedFilters.every(filter =>
          filter.value && flattenDeep([filter.value]).length > 0
            ? intersection(
                flattenDeep([item[filter.filter]]),
                flattenDeep([filter.value]).map(el => el.value),
              ).length > 0
            : true,
        ),
    );
    if (sortedBy) {
      setCardData(orderBy(filteredData, [sortedBy.value], [sortedBy.type]));
    } else {
      setCardData(filteredData);
    }
  }, [data, cardSearchColumns, searchQuery, selectedFilters, sortedBy]);

  useEffect(() => {
    setPage(1);
  }, [cardData]);

  return (
    <div
      className={`${theme || 'light'} flex  ${width ? 'w-fit grow-0' : 'w-full grow'}`}
      dir={language === 'he' || language === 'ar' ? 'rtl' : undefined}
    >
      <div
        className={cn(
          `${
            !backgroundColor
              ? 'bg-transparent '
              : backgroundColor === true
                ? 'bg-primary-gray-200 dark:bg-primary-gray-650 '
                : ''
          }ml-auto mr-auto flex flex-col grow h-inherit ${language || 'en'}`,
          width ? 'w-fit' : 'w-full',
          classNames?.graphContainer,
        )}
        style={{
          ...(styles?.graphContainer || {}),
          ...(backgroundColor && backgroundColor !== true ? { backgroundColor } : {}),
        }}
        id={graphID}
        aria-label={
          ariaLabel ||
          `${graphTitle ? `The graph shows ${graphTitle}. ` : ''}This is an list of cards. ${
            graphDescription ? ` ${graphDescription}` : ''
          }`
        }
      >
        <div
          className='flex grow'
          style={{ padding: backgroundColor ? padding || '1rem' : padding || 0 }}
        >
          <div className='flex flex-col grow gap-3 w-full justify-between'>
            {graphTitle || graphDescription ? (
              <GraphHeader
                styles={{
                  title: styles?.title,
                  description: styles?.description,
                }}
                classNames={{
                  title: classNames?.title,
                  description: classNames?.description,
                }}
                graphTitle={graphTitle}
                graphDescription={graphDescription}
                width={width}
              />
            ) : null}
            {cardSortingOptions || filterSettings.length > 0 ? (
              <div className='flex gap-4 flex-wrap items-start w-full'>
                {cardSortingOptions ? (
                  <div
                    className='grow shrink-0 min-w-[240px]'
                    style={{ width: cardSortingOptions.width || 'calc(25% - 0.75rem)' }}
                  >
                    <P
                      marginBottom='xs'
                      size='sm'
                      className='text-primary-gray-700 dark:text-primary-gray-100'
                    >
                      Sort by
                    </P>
                    <DropdownSelect
                      options={cardSortingOptions.options}
                      isRtl={language === 'he' || language === 'ar'}
                      isSearchable
                      filterOption={createFilter(filterConfig)}
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      onChange={(el: any) => {
                        setSortedBy(el || undefined);
                      }}
                      variant={uiMode}
                      size='sm'
                      defaultValue={
                        !cardSortingOptions.defaultValue ||
                        cardSortingOptions.options.findIndex(
                          el => el.label === cardSortingOptions.defaultValue,
                        ) === -1
                          ? cardSortingOptions.options[0]
                          : cardSortingOptions.options[
                              cardSortingOptions.options.findIndex(
                                el => el.label === cardSortingOptions.defaultValue,
                              )
                            ]
                      }
                    />
                  </div>
                ) : null}
                {filterSettings?.map((d, i) => (
                  <div
                    className='grow shrink-0 min-w-[240px]'
                    style={{ width: d.width || 'calc(25% - 0.75rem)' }}
                    key={i}
                  >
                    <P
                      marginBottom='xs'
                      size='sm'
                      className='text-primary-gray-700 dark:text-primary-gray-100'
                    >
                      {d.label}
                    </P>
                    <DropdownSelect
                      options={d.availableValues}
                      isClearable={d.clearable === undefined ? true : d.clearable}
                      isRtl={language === 'he' || language === 'ar'}
                      isSearchable
                      variant={uiMode}
                      size='sm'
                      controlShouldRenderValue
                      filterOption={createFilter(filterConfig)}
                      onChange={el => {
                        setSelectedFilters(prev =>
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          prev.map(f => (f.filter === d.filter ? { ...f, value: el as any } : f)),
                        );
                      }}
                      defaultValue={d.defaultValue}
                    />
                  </div>
                ))}
              </div>
            ) : null}
            {(cardSearchColumns || []).length > 0 ? (
              <div style={{ paddingTop: '1px' }}>
                <Search
                  placeholder='Search...'
                  onSearch={e => {
                    setSearchQuery(e || '');
                  }}
                  buttonVariant='icon'
                  inputVariant={uiMode}
                  showSearchButton={false}
                  inputSize='sm'
                />
              </div>
            ) : null}
            <Graph
              data={cardData}
              width={width}
              height={height}
              cardTemplate={cardTemplate}
              cardMinWidth={cardMinWidth}
              page={page}
              cardBackgroundColor={cardBackgroundColor}
              styles={styles}
              classNames={classNames}
              noOfItemsInAPage={noOfItemsInAPage}
              detailsOnClick={detailsOnClick}
              onSeriesMouseClick={onSeriesMouseClick}
              allowDataDownloadOnDetail={allowDataDownloadOnDetail}
            />
            {noOfItemsInAPage ? (
              <Pagination
                total={cardData.length}
                defaultPage={0}
                pageSize={noOfItemsInAPage}
                onChange={setPage}
              />
            ) : null}
            {sources || footNote ? (
              <GraphFooter
                styles={{ footnote: styles?.footnote, source: styles?.source }}
                classNames={{
                  footnote: classNames?.footnote,
                  source: classNames?.source,
                }}
                sources={sources}
                footNote={footNote}
                width={width}
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
