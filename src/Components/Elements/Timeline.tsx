import { SliderUI } from '@undp/design-system-react/SliderUI';
import type { Color } from '@/Types';
import { Pause, Play } from '../Icons';

interface Props {
  play: boolean;
  setPlay: (_value: boolean) => void;
  uniqDatesSorted: number[];
  markObj: Record<number, string>;
  index: number;
  setIndex: (_value: number) => void;
  color?: Exclude<
    Color,
    | 'background'
    | 'surface'
    | 'surface-2xs'
    | 'surface-xs'
    | 'surface-sm'
    | 'surface-md'
    | 'surface-lg'
    | 'surface-xl'
    | 'surface-2xl'
    | 'surface-3xl'
    | 'surface-4xl'
    | 'foreground'
  >;
}

const fillClassNames = {
  primary: 'fill-primary',
  secondary: 'fill-secondary',
  tertiary: 'fill-tertiary',
  quaternary: 'fill-quaternary',
  foreground: 'fill-foreground',
  warning: 'fill-warning',
  success: 'fill-success',
  error: 'fill-error',
  info: 'fill-info',
  red: 'fill-accent-red',
  orange: 'fill-accent-orange',
  yellow: 'fill-accent-yellow',
  lime: 'fill-accent-lime',
  green: 'fill-accent-green',
  teal: 'fill-accent-teal',
  azure: 'fill-accent-azure',
  blue: 'fill-accent-blue',
  violet: 'fill-accent-violet',
  pink: 'fill-accent-pink',
  'sdg-1': 'fill-sdg-1',
  'sdg-2': 'fill-sdg-2',
  'sdg-3': 'fill-sdg-3',
  'sdg-4': 'fill-sdg-4',
  'sdg-5': 'fill-sdg-5',
  'sdg-6': 'fill-sdg-6',
  'sdg-7': 'fill-sdg-7',
  'sdg-8': 'fill-sdg-8',
  'sdg-9': 'fill-sdg-9',
  'sdg-10': 'fill-sdg-10',
  'sdg-11': 'fill-sdg-11',
  'sdg-12': 'fill-sdg-12',
  'sdg-13': 'fill-sdg-13',
  'sdg-14': 'fill-sdg-14',
  'sdg-15': 'fill-sdg-15',
  'sdg-16': 'fill-sdg-16',
  'sdg-17': 'fill-sdg-17',
  male: 'fill-categorical-male',
  female: 'fill-categorical-female',
  urban: 'fill-categorical-urban',
  rural: 'fill-categorical-rural',
  child: 'fill-categorical-child',
  adolescent: 'fill-categorical-adolescent',
  'young-adult': 'fill-categorical-young-adult',
  adult: 'fill-categorical-adult',
  'older-adult': 'fill-categorical-older-adult',
};

export function Timeline(props: Props) {
  const { play, setPlay, uniqDatesSorted, markObj, index, setIndex, color } = props;
  return (
    <div className='flex gap-6 items-center pb-4' dir='ltr'>
      <button
        type='button'
        onClick={() => {
          setPlay(!play);
        }}
        className='p-0 border-0 cursor-pointer bg-transparent'
        aria-label={play ? 'Click to pause animation' : 'Click to play animation'}
      >
        {play ? (
          <Pause fillClassName={fillClassNames[color || 'primary']} />
        ) : (
          <Play fillClassName={fillClassNames[color || 'primary']} />
        )}
      </button>
      <SliderUI
        min={uniqDatesSorted[0]}
        max={uniqDatesSorted[uniqDatesSorted.length - 1]}
        marks={markObj}
        step={null}
        defaultValue={uniqDatesSorted[uniqDatesSorted.length - 1]}
        value={uniqDatesSorted[index]}
        onChangeComplete={(nextValue) => {
          setIndex(uniqDatesSorted.indexOf(nextValue as number));
        }}
        onChange={(nextValue) => {
          setIndex(uniqDatesSorted.indexOf(nextValue as number));
        }}
        color={color}
        aria-label='Time slider. Use arrow keys to adjust selected time period.'
      />
    </div>
  );
}
