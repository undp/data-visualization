// Scrollytelling.tsx
import { motion, useInView } from 'motion/react';
import { useRef, useState } from 'react';

import { SingleGraphDashboard } from './SingleGraphDashboard';

import { ChaptersDataType, InfoBoxDataType, SectionsArrDataType } from '@/Types';

interface Props {
  /** Defines if the information is shown as overlay or on the side */
  mode?: 'overlay' | 'side';
  /** Defines the width of the info section */
  infoWidth?: string;
  /** Defined the different chapters for the story and different sections within the story  */
  chapters: ChaptersDataType[];
  /** Position of info on the page */
  infoPosition?: 'left' | 'right' | 'center';
  /** Sets how much of the element (from 0 to 1) must be visible before it's considered in view and it trigger the animation in the scrollytelling */
  visibilityThreshold?: number;
  /** Sets background color of the info box. */
  infoBackgroundColor?: string;
}

/** ScrollStory is a scrollytelling container component that reveals content step-by-step as the user scrolls through the page. */
export function ScrollStory(props: Props) {
  const {
    chapters,
    visibilityThreshold = 0.5,
    mode = 'overlay',
    infoWidth = '320px',
    infoPosition = 'left',
    infoBackgroundColor = 'rgba(255,255,255,0.8)',
  } = props;
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionsArr: SectionsArrDataType[] = [];
  chapters.forEach((d, i) => {
    d.sections.forEach((s, j) => {
      sectionsArr.push({
        chapter: i,
        dataSettings: d.dataSettings,
        section: j,
        graphType: d.graphType,
        infoBox: s.infoBox,
        graphSettings: { ...d.graphSettings, ...(s.graphSettings || {}), animate: true },
        graphDataConfiguration: s.graphDataConfiguration || d.graphDataConfiguration || [],
      });
    });
  });
  return (
    <div className='relative w-full h-full'>
      {/* Background Layer */}
      <motion.div
        key={sectionsArr[activeIndex].chapter}
        className='fixed top-0 h-full -z-10'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          left: mode === 'overlay' ? 0 : infoPosition === 'right' ? 0 : infoWidth,
          width: mode === 'overlay' ? '100%' : `calc(100% - ${infoWidth})`,
        }}
      >
        <SingleGraphDashboard
          graphType={sectionsArr[activeIndex].graphType}
          dataSettings={sectionsArr[activeIndex].dataSettings}
          graphSettings={sectionsArr[activeIndex].graphSettings}
          graphDataConfiguration={sectionsArr[activeIndex].graphDataConfiguration}
        />
      </motion.div>
      <div>
        {sectionsArr.map((section, idx) => (
          <ScrollySection
            width={infoWidth}
            key={`${section.chapter}-${section.section}`}
            index={idx}
            infoBox={section.infoBox}
            setActiveIndex={setActiveIndex}
            position={infoPosition}
            mode={mode}
            visibilityThreshold={visibilityThreshold}
            backgroundColor={infoBackgroundColor}
          />
        ))}
      </div>
    </div>
  );
}

function ScrollySection({
  infoBox,
  index,
  setActiveIndex,
  position,
  mode,
  visibilityThreshold,
  backgroundColor,
  width,
}: {
  infoBox: InfoBoxDataType;
  index: number;
  setActiveIndex: (idx: number) => void;
  position: 'left' | 'right' | 'center';
  mode: 'overlay' | 'side';
  visibilityThreshold: number;
  backgroundColor: string;
  width: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: false,
    amount: visibilityThreshold,
  });
  if (isInView) setActiveIndex(index);
  return (
    <section
      ref={ref}
      className={`min-h-screen flex ${position === 'center' ? 'justify-center' : position === 'right' ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`p-8 ${mode === 'overlay' ? 'h-fit mx-10 ' : ''}`}
        style={{
          backgroundColor,
          width,
        }}
      >
        {infoBox.title}
        {infoBox.description}
      </div>
    </section>
  );
}
