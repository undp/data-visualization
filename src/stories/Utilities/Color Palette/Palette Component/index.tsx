import { Colors } from '@/Components/ColorPalette';

const ColorsList = (theme: 'dark' | 'light') => ({
  categoricalColors: {
    colors: {
      colors: Colors[theme].categoricalColors.colors,
      name: `Colors.${theme}.categoricalColors`,
    },
  },
  sequentialColors: {
    Negative: {
      Colorsx04: {
        colors: Colors[theme].sequentialColors.negativeColorsx04,
        name: `Colors.${theme}.sequentialColors.negativeColorsx04`,
      },
      Colorsx05: {
        colors: Colors[theme].sequentialColors.negativeColorsx05,
        name: `Colors.${theme}.sequentialColors.negativeColorsx05`,
      },
      Colorsx06: {
        colors: Colors[theme].sequentialColors.negativeColorsx06,
        name: `Colors.${theme}.sequentialColors.negativeColorsx06`,
      },
      Colorsx07: {
        colors: Colors[theme].sequentialColors.negativeColorsx07,
        name: `Colors.${theme}.sequentialColors.negativeColorsx07`,
      },
      Colorsx08: {
        colors: Colors[theme].sequentialColors.negativeColorsx08,
        name: `Colors.${theme}.sequentialColors.negativeColorsx08`,
      },
      Colorsx09: {
        colors: Colors[theme].sequentialColors.negativeColorsx09,
        name: `Colors.${theme}.sequentialColors.negativeColorsx09`,
      },
      Colorsx10: {
        colors: Colors[theme].sequentialColors.negativeColorsx10,
        name: `Colors.${theme}.sequentialColors.negativeColorsx10`,
      },
    },
    Positive: {
      Colorsx04: {
        colors: Colors[theme].sequentialColors.positiveColorsx04,
        name: `Colors.${theme}.sequentialColors.positiveColorsx04`,
      },
      Colorsx05: {
        colors: Colors[theme].sequentialColors.positiveColorsx05,
        name: `Colors.${theme}.sequentialColors.positiveColorsx05`,
      },
      Colorsx06: {
        colors: Colors[theme].sequentialColors.positiveColorsx06,
        name: `Colors.${theme}.sequentialColors.positiveColorsx06`,
      },
      Colorsx07: {
        colors: Colors[theme].sequentialColors.positiveColorsx07,
        name: `Colors.${theme}.sequentialColors.positiveColorsx07`,
      },
      Colorsx08: {
        colors: Colors[theme].sequentialColors.positiveColorsx08,
        name: `Colors.${theme}.sequentialColors.positiveColorsx08`,
      },
      Colorsx09: {
        colors: Colors[theme].sequentialColors.positiveColorsx09,
        name: `Colors.${theme}.sequentialColors.positiveColorsx09`,
      },
      Colorsx10: {
        colors: Colors[theme].sequentialColors.positiveColorsx10,
        name: `Colors.${theme}.sequentialColors.positiveColorsx10`,
      },
    },
    Neutral: {
      Colorsx04: {
        colors: Colors[theme].sequentialColors.neutralColorsx04,
        name: `Colors.${theme}.sequentialColors.neutralColorsx04`,
      },
      Colorsx05: {
        colors: Colors[theme].sequentialColors.neutralColorsx05,
        name: `Colors.${theme}.sequentialColors.neutralColorsx05`,
      },
      Colorsx06: {
        colors: Colors[theme].sequentialColors.neutralColorsx06,
        name: `Colors.${theme}.sequentialColors.neutralColorsx06`,
      },
      Colorsx07: {
        colors: Colors[theme].sequentialColors.neutralColorsx07,
        name: `Colors.${theme}.sequentialColors.neutralColorsx07`,
      },
      Colorsx08: {
        colors: Colors[theme].sequentialColors.neutralColorsx08,
        name: `Colors.${theme}.sequentialColors.neutralColorsx08`,
      },
      Colorsx09: {
        colors: Colors[theme].sequentialColors.neutralColorsx09,
        name: `Colors.${theme}.sequentialColors.neutralColorsx09`,
      },
      Colorsx10: {
        colors: Colors[theme].sequentialColors.neutralColorsx10,
        name: `Colors.${theme}.sequentialColors.neutralColorsx10`,
      },
    },
  },
  divergentColors: {
    Colorsx04: {
      colors: Colors[theme].divergentColors.colorsx04,
      name: `Colors.${theme}.divergentColors.colorsx04`,
    },
    Colorsx05: {
      colors: Colors[theme].divergentColors.colorsx05,
      name: `Colors.${theme}.divergentColors.colorsx05`,
    },
    Colorsx06: {
      colors: Colors[theme].divergentColors.colorsx06,
      name: `Colors.${theme}.divergentColors.colorsx06`,
    },
    Colorsx07: {
      colors: Colors[theme].divergentColors.colorsx07,
      name: `Colors.${theme}.divergentColors.colorsx07`,
    },
    Colorsx08: {
      colors: Colors[theme].divergentColors.colorsx08,
      name: `Colors.${theme}.divergentColors.colorsx08`,
    },
    Colorsx09: {
      colors: Colors[theme].divergentColors.colorsx09,
      name: `Colors.${theme}.divergentColors.colorsx09`,
    },
    Colorsx10: {
      colors: Colors[theme].divergentColors.colorsx10,
      name: `Colors.${theme}.divergentColors.colorsx10`,
    },
    Colorsx11: {
      colors: Colors[theme].divergentColors.colorsx11,
      name: `Colors.${theme}.divergentColors.colorsx11`,
    },
  },
  bivariateColors: {
    Colors03x03: {
      colors: Colors[theme].bivariateColors.colors03x03,
      name: `Colors.${theme}.bivariateColors.colors03x03`,
    },
    Colors04x04: {
      colors: Colors[theme].bivariateColors.colors04x04,
      name: `Colors.${theme}.bivariateColors.colors04x04`,
    },
    Colors05x05: {
      colors: Colors[theme].bivariateColors.colors05x05,
      name: `Colors.${theme}.bivariateColors.colors05x05`,
    },
    Colors05x04: {
      colors: Colors[theme].bivariateColors.colors05x04,
      name: `Colors.${theme}.bivariateColors.colors05x04`,
    },
    Colors04x05: {
      colors: Colors[theme].bivariateColors.colors04x05,
      name: `Colors.${theme}.bivariateColors.colors04x05`,
    },
  },
});

function ColorRow({
  title,
  colors,
}: {
  title: string;
  colors: { colors: string[]; name: string };
}) {
  return (
    <div className='mb-6'>
      <div className='text-sm mb-1'>
        {title} <span className='text-xs text-gray-500 font-bold font-mono'>({colors.name})</span>
      </div>
      <div className='flex flex-wrap gap-1'>
        {colors.colors.map((color) => (
          <div
            key={color}
            className='w-8 h-8 rounded shadow'
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>
    </div>
  );
}

function ColorGrid({
  title,
  colors,
}: {
  title: string;
  colors: { colors: string[][]; name: string };
}) {
  return (
    <div className='mb-6'>
      <div className='text-sm mb-1'>
        {title} <span className='text-xs text-gray-500 font-bold font-mono'>({colors.name})</span>
      </div>
      <div className='flex flex-col gap-1'>
        {colors.colors.map((row, rowIndex) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: index is the unique identifier
          <div key={rowIndex} className='flex gap-1'>
            {row.map((color) => (
              <div
                key={color}
                className='w-8 h-8 rounded shadow'
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

interface Props {
  theme: 'dark' | 'light';
}

export function Palette({ theme }: Props) {
  return (
    <div className='p-6'>
      <section>
        <h2 className='text-xl font-semibold mb-2 mt-4'>Categorical</h2>
        <ColorRow title='Categorical Colors' colors={ColorsList(theme).categoricalColors.colors} />
      </section>
      <hr />
      <section>
        <h2 className='text-xl font-semibold mb-2 mt-4'>Sequential</h2>
        <h4 className='text-lg mb-2'>Neutral</h4>
        {Object.entries(ColorsList(theme).sequentialColors.Neutral).map(([key, value]) => (
          <ColorRow key={key} title={key} colors={value} />
        ))}
        <h4 className='text-lg mb-2'>Positive</h4>
        {Object.entries(ColorsList(theme).sequentialColors.Positive).map(([key, value]) => (
          <ColorRow key={key} title={key} colors={value} />
        ))}
        <h4 className='text-lg mb-2'>Negative</h4>
        {Object.entries(ColorsList(theme).sequentialColors.Negative).map(([key, value]) => (
          <ColorRow key={key} title={key} colors={value} />
        ))}
      </section>
      <hr />
      <section>
        <h2 className='text-xl font-semibold mb-2 mt-4'>Divergent</h2>
        {Object.entries(ColorsList(theme).divergentColors).map(([key, value]) => (
          <ColorRow key={key} title={key} colors={value} />
        ))}
      </section>
      <hr />
      <section>
        <h2 className='text-xl font-semibold mb-2 mt-4'>Bivariate</h2>
        {Object.entries(ColorsList(theme).bivariateColors).map(([key, value]) => (
          <ColorGrid key={key} title={key} colors={value} />
        ))}
      </section>
    </div>
  );
}
