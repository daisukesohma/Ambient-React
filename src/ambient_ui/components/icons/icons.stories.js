import React from 'react'
import { storiesOf } from '@storybook/react' // eslint-disable-line
import { Icons } from '../index'
import { light as palette } from 'theme'

import { back10, code } from './addons/notes'

const {
  Activity,
  AlertCircle,
  Aperture,
  ArrowDown,
  ArrowUp,
  Back,
  Back1,
  Back5,
  Back10,
  Backpack,
  Bookmark,
  Bag,
  Bell,
  Bike,
  Box,
  Calendar,
  Camera,
  Car,
  Caution,
  Chair,
  Chart,
  Check,
  CheckCircle,
  Circle,
  Clock,
  Close,
  CloseOctagon,
  Cloud,
  Comment,
  Door,
  Edit,
  ExternalLink,
  Fence,
  FileText,
  Folder,
  Forward,
  Forward1,
  Forward5,
  Forward10,
  Gear,
  Grid,
  Gun,
  Help,
  Home,
  Info,
  Investigate,
  Knife,
  Laptop,
  List,
  LongArrow,
  Maximize,
  Moon,
  Pause,
  Person,
  Phone,
  Play,
  Polygon,
  Rect,
  Refresh,
  Send,
  Sites,
  Slash,
  Sofa,
  Suitcase,
  Table,
  Trash,
  Umbrella,
  UserCheck,
  Video,
  Zap,
} = Icons

let displayColorName
const setDisplayColorName = colorName => {
  displayColorName = colorName
}

let displaySize
const setDisplaySize = size => {
  displaySize = size
}

const generateMoreIcons = Icon => {
  const SIZES = [12, 16, 20, 24, 30, 36, 48, 60]
  return (
    <>
      <div>
        <Icon />
        <Icon stroke={palette.error.main} width={36} height={36} />
        <Icon stroke={palette.secondary.main} width={48} height={48} />
      </div>
      <div
        style={{
          position: 'fixed',
          right: 20,
          top: '50%',
          border: '1px solid lightgray',
          borderRadius: 5,
          padding: 20,
          width: 275,
        }}
      >
        <div style={{ color: palette.grey[500] }}>{'<...'}</div>
        {displayColorName && displaySize && (
          <div style={{ marginLeft: 10 }}>
            <div>{`stroke={Colors.${displayColorName}}`}</div>
            <div>{`width={${displaySize}}`}</div>
            <div>{`height={${displaySize}}`}</div>
          </div>
        )}
        <div style={{ color: palette.grey[500] }}>{'...>'}</div>
      </div>
      <div>
        {/* {Object.entries(Colors).map(([colorName, colorHex]) => { */}
        {/*   return ( */}
        {/*     <div */}
        {/*       style={{ display: 'flex', alignItems: 'center' }} */}
        {/*       key={colorName} */}
        {/*     > */}
        {/*       {SIZES.map((size, index) => { */}
        {/*         return ( */}
        {/*           <div */}
        {/*             key={`${colorName}-${index}`} */}
        {/*             onMouseOver={() => { */}
        {/*               setDisplayColorName(colorName) */}
        {/*               setDisplaySize(size) */}
        {/*             }} */}
        {/*           > */}
        {/*             <Icon */}
        {/*               stroke={colorHex} */}
        {/*               fill={colorHex} */}
        {/*               width={size} */}
        {/*               height={size} */}
        {/*             /> */}
        {/*           </div> */}
        {/*         ) */}
        {/*       })} */}
        {/*     </div> */}
        {/*   ) */}
        {/* })} */}
      </div>
    </>
  )
}

storiesOf('Icons', module)
  .add('Activity', () => generateMoreIcons(Activity), {
    notes: {
      Code: code,
      Designer: 'You can have different notes for different folks.',
    },
  })
  .add('AlertCircle', () => generateMoreIcons(AlertCircle), {
    notes: { Code: code },
  })
  .add('Aperture', () => generateMoreIcons(Aperture), {
    notes: { Code: code },
  })
  .add('ArrowDown', () => generateMoreIcons(ArrowDown), {
    notes: { Code: code },
  })
  .add('ArrowUp', () => generateMoreIcons(ArrowUp), {
    notes: { Code: code },
  })
  .add('Back', () => generateMoreIcons(Back), {
    notes: {
      Code: code,
      Props: back10,
    },
  })
  .add('Back1', () => generateMoreIcons(Back1), {
    notes: {
      Code: code,
      Props: back10,
    },
  })
  .add('Back5', () => generateMoreIcons(Back5), {
    notes: {
      Code: code,
      Props: back10,
    },
  })
  .add('Back10', () => generateMoreIcons(Back10), {
    notes: {
      Code: code,
      Props: back10,
    },
  })
  .add('Backpack', () => generateMoreIcons(Backpack), {
    notes: { Code: code },
  })
  .add('Bag', () => generateMoreIcons(Bag), {
    notes: { Code: code },
  })
  .add('Bell', () => generateMoreIcons(Bell), {
    notes: { Code: code },
  })
  .add('Bike', () => generateMoreIcons(Bike), {
    notes: { Code: code },
  })
  .add('Bookmark', () => generateMoreIcons(Bookmark), {
    notes: { Code: code },
  })
  .add('Box', () => generateMoreIcons(Box), {
    notes: { Code: code },
  })
  .add('Calendar', () => generateMoreIcons(Calendar), {
    notes: { Code: code },
  })
  .add('Camera', () => generateMoreIcons(Camera), {
    notes: { Code: code },
  })
  .add('Car', () => generateMoreIcons(Car), {
    notes: { Code: code },
  })
  .add('Caution', () => generateMoreIcons(Caution), {
    notes: { Code: code },
  })
  .add('Chair', () => generateMoreIcons(Chair), {
    notes: { Code: code },
  })
  .add('Chart', () => generateMoreIcons(Chart), {
    notes: { Code: code },
  })
  .add('CheckCircle', () => generateMoreIcons(CheckCircle), {
    notes: { Code: code },
  })
  .add('Check', () => generateMoreIcons(Check), {
    notes: { Code: code },
  })
  .add('Circle', () => generateMoreIcons(Circle), {
    notes: { Code: code },
  })
  .add('Clock', () => generateMoreIcons(Clock), {
    notes: { Code: code },
  })
  .add('Close', () => generateMoreIcons(Close), {
    notes: { Code: code },
  })
  .add('CloseOctagon', () => generateMoreIcons(CloseOctagon), {
    notes: { Code: code },
  })
  .add('Cloud', () => generateMoreIcons(Cloud), {
    notes: { Code: code },
  })
  .add('Comment', () => generateMoreIcons(Comment), {
    notes: { Code: code },
  })
  .add('Door', () => generateMoreIcons(Door), {
    notes: { Code: code },
  })
  .add('ExternalLink', () => generateMoreIcons(ExternalLink), {
    notes: { Code: code },
  })
  .add('Edit', () => generateMoreIcons(Edit), {
    notes: { Code: code },
  })
  .add('FileText', () => generateMoreIcons(FileText), {
    notes: { Code: code },
  })
  .add('Fence', () => generateMoreIcons(Fence), {
    notes: { Code: code },
  })
  .add('Forward', () => generateMoreIcons(Forward), {
    notes: {
      Code: code,
      Props: back10,
    },
  })
  .add('Forward1', () => generateMoreIcons(Forward1), {
    notes: {
      Code: code,
      Props: back10,
    },
  })
  .add('Forward5', () => generateMoreIcons(Forward5), {
    notes: {
      Code: code,
      Props: back10,
    },
  })
  .add('Forward10', () => generateMoreIcons(Forward10), {
    notes: {
      Code: code,
      Props: back10,
    },
  })
  .add('Gear', () => generateMoreIcons(Gear), {
    notes: { Code: code },
  })
  .add('Grid', () => generateMoreIcons(Grid), {
    notes: { Code: code },
  })
  .add('Gun', () => generateMoreIcons(Gun), {
    notes: { Code: code },
  })
  .add('Help', () => generateMoreIcons(Help), {
    notes: { Code: code },
  })
  .add('Home', () => generateMoreIcons(Home), {
    notes: { Code: code },
  })
  .add('Investigate', () => generateMoreIcons(Investigate), {
    notes: { Code: code },
  })
  .add('Knife', () => generateMoreIcons(Knife), {
    notes: { Code: code },
  })
  .add('Laptop', () => generateMoreIcons(Laptop), {
    notes: { Code: code },
  })
  .add('List', () => generateMoreIcons(List), {
    notes: { Code: code },
  })
  .add('LongArrow', () => generateMoreIcons(LongArrow), {
    notes: { Code: code },
  })
  .add('Maximize', () => generateMoreIcons(Maximize), {
    notes: { Code: code },
  })
  .add('Moon', () => generateMoreIcons(Moon), {
    notes: { Code: code },
  })
  .add('Pause', () => generateMoreIcons(Pause), {
    notes: { Code: code },
  })
  .add('Person', () => generateMoreIcons(Person), {
    notes: { Code: code },
  })
  .add('Phone', () => generateMoreIcons(Phone), {
    notes: { Code: code },
  })
  .add('Play', () => generateMoreIcons(Play), {
    notes: { Code: code },
  })
  .add('Polygon', () => generateMoreIcons(Polygon), {
    notes: { Code: code },
  })
  .add('Rect', () => generateMoreIcons(Rect), {
    notes: { Code: code },
  })
  .add('Refresh', () => generateMoreIcons(Refresh), {
    notes: { Code: code },
  })
  .add('Send', () => generateMoreIcons(Send), {
    notes: { Code: code },
  })
  .add('Sites', () => generateMoreIcons(Sites), {
    notes: { Code: code },
  })
  .add('Slash', () => generateMoreIcons(Slash), {
    notes: { Code: code },
  })
  .add('Sofa', () => generateMoreIcons(Sofa), {
    notes: { Code: code },
  })
  .add('Suitecase', () => generateMoreIcons(Suitcase), {
    notes: { Code: code },
  })
  .add('Table', () => generateMoreIcons(Table), {
    notes: { Code: code },
  })
  .add('Umbrella', () => generateMoreIcons(Umbrella), {
    notes: { Code: code },
  })
  .add('UserCheck', () => generateMoreIcons(UserCheck), {
    notes: { Code: code },
  })
  .add('Video', () => generateMoreIcons(Video), {
    notes: { Code: code },
  })
  .add('Info', () => generateMoreIcons(Info), {
    notes: { Code: code },
  })
  .add('Folder', () => generateMoreIcons(Folder), {
    notes: { Code: code },
  })
  .add('Trash', () => generateMoreIcons(Trash), {
    notes: { Code: code },
  })
  .add('Zap', () => generateMoreIcons(Zap), {
    notes: { Code: code },
  })
