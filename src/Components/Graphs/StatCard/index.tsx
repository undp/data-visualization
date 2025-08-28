import { cn, H3 } from '@undp/design-system-react';

import { GraphFooter } from '@/Components/Elements/GraphFooter';
import { GraphHeader } from '@/Components/Elements/GraphHeader';
import { numberFormattingFunction } from '@/Utils/numberFormattingFunction';
import { ClassNameObject, Languages, SourcesDataType, StyleObject } from '@/Types';

interface Props {
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
  /** Background color of the graph */
  backgroundColor?: string | boolean;
  /** Defines the layout for the cards */
  layout?: 'primary' | 'secondary';
  /** Font size of the main text */
  headingFontSize?: string;
  /** Padding around the graph. Defaults to 0 if no backgroundColor is mentioned else defaults to 1rem */
  padding?: string;
  /** Toggle the fill color of the main text. */
  textBackground?: boolean;
  /** Toggle is the text is center aligned. */
  centerAlign?: boolean;
  /** Vertical alignment of the main text */
  verticalAlign?: 'center' | 'top' | 'bottom';
  /** Custom styles for the graph. Each object should be a valid React CSS style object. */
  styles?: StyleObject;
  /** Custom class names */
  classNames?: ClassNameObject;

  // Values and Ticks
  /** Prefix for values */
  prefix?: string;
  /** Suffix for values */
  suffix?: string;
  /** Specifies the number of decimal places to display in the value. */
  precision?: number;
  /** Main text */
  value: number | string;
  /** Sub text next to main text */
  year?: number | string;

  // Configuration and Options
  /** Language setting  */
  language?: Languages;
  /** Color theme */
  theme?: 'light' | 'dark';
  /** Unique ID for the graph */
  graphID?: string;
}

export function BasicStatCard(props: Props) {
  const {
    year,
    value,
    graphTitle,
    suffix = '',
    sources,
    prefix = '',
    graphDescription,
    footNote,
    padding,
    backgroundColor = false,
    graphID,
    language = 'en',
    theme = 'light',
    ariaLabel,
    textBackground = false,
    headingFontSize = '4.375rem',
    centerAlign = false,
    verticalAlign = 'center',
    layout = 'primary',
    styles,
    classNames,
    precision,
  } = props;
  return (
    <div
      className={`${theme || 'light'} flex w-full`}
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
          }flex flex-col w-full h-inherit ${language || 'en'}`,
          classNames?.graphContainer,
        )}
        style={{
          ...(styles?.graphContainer || {}),
          ...(backgroundColor && backgroundColor !== true ? { backgroundColor } : {}),
        }}
        id={graphID}
        aria-label={
          ariaLabel ||
          `${graphTitle ? `The graph shows ${graphTitle}. ` : ''}This is a statistic card.${
            graphDescription ? ` ${graphDescription}` : ''
          }`
        }
      >
        <div
          className='flex grow'
          style={{ padding: backgroundColor ? padding || '1rem' : padding || 0 }}
        >
          {layout !== 'secondary' ? (
            <div className='flex flex-col w-full gap-12 justify-between grow'>
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
                />
              ) : null}
              <div
                className={`flex flex-col justify-between grow ${
                  verticalAlign === 'top'
                    ? 'justify-start'
                    : verticalAlign === 'bottom'
                      ? 'justify-end'
                      : 'justify-center'
                }`}
              >
                <H3
                  marginBottom='base'
                  className={`leading-none text-outline font-heading ${
                    centerAlign
                      ? 'text-center'
                      : language === 'he' || language === 'ar'
                        ? 'text-right'
                        : 'text-left'
                  } ${textBackground ? 'text-primary-black dark:text-primary-white' : 'transparent'}`}
                  style={{
                    fontSize: headingFontSize,
                    letterSpacing: '0.05rem',
                  }}
                >
                  {numberFormattingFunction(value, 'NA', precision, prefix, suffix)}{' '}
                  {year ? (
                    <span
                      className='text-lg font-normal mt-0 mb-4 text-primary-gray-550 dark:text-primary-gray-400'
                      style={{
                        marginLeft: '-8px',
                        lineHeight: '1.09',
                        textShadow: 'none',
                        WebkitTextStrokeWidth: 0,
                      }}
                    >
                      ({year})
                    </span>
                  ) : null}
                </H3>
              </div>
              {sources || footNote ? (
                <GraphFooter
                  styles={{ footnote: styles?.footnote, source: styles?.source }}
                  classNames={{
                    footnote: classNames?.footnote,
                    source: classNames?.source,
                  }}
                  sources={sources}
                  footNote={footNote}
                />
              ) : null}
            </div>
          ) : (
            <div className='flex flex-col w-full gap-4 grow justify-center'>
              <H3
                marginBottom={layout === 'secondary' ? 'none' : 'base'}
                className={`leading-none text-outline font-heading ${
                  centerAlign
                    ? 'text-center'
                    : language === 'he' || language === 'ar'
                      ? 'text-right'
                      : 'text-left'
                } ${textBackground ? 'text-primary-black dark:text-primary-white' : 'transparent'}`}
                style={{
                  fontSize: headingFontSize,
                  letterSpacing: '0.05rem',
                }}
              >
                {numberFormattingFunction(value, 'NA', precision, prefix, suffix)}{' '}
                {year ? (
                  <span
                    className='text-lg font-normal mt-0 mb-4 text-primary-gray-550 dark:text-primary-gray-400'
                    style={{
                      marginLeft: '-8px',
                      lineHeight: '1.09',
                      textShadow: 'none',
                      WebkitTextStrokeWidth: 0,
                    }}
                  >
                    ({year})
                  </span>
                ) : null}
              </H3>
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
                />
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
