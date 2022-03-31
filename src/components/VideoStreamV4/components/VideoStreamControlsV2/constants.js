import { hexRgba } from 'utils'
// TODO: should be used inside of component with useTheme hook OR ideally in makeStyles
import { light as palette } from 'theme'

const FILMSTRIP_HEIGHT = 80
const TOOLTIP_ABOVE_FILMSTRIP = 32

const TIMELINE = {
  container: {
    height: 80,
    width: '100%',
  },
  tooltip: {
    width: 88,
    imageWidth: 192,
  },
  timeline: {
    height: 50,
    width: '100%',
  },
  playhead: {
    hoverColor: hexRgba(palette.grey[500], 0.5),
    nowColor: hexRgba(palette.primary[400], 0.7),
    playingColor: hexRgba(palette.error.main, 0.7),
    alertDispatchColor: hexRgba(palette.common.greenNeon, 0.7),
    textOpacityOnHoveringTimeline: 0.3,
    width: 1,
  },
  controls: {
    height: 50,
  },
  axis: {
    height: 25,
  },
  curve: {
    height: 32,
  },
}

const SLIDER_TO_MINUTES = {
  9: {
    mins: 1,
    readable: '1 min',
    unitValue: 1,
    unit: 'm',
  },
  8: {
    mins: 5,
    readable: '5 mins',
    unitValue: 5,
    unit: 'm',
  },
  7: {
    mins: 15,
    readable: '15 mins',
    unitValue: 15,
    unit: 'm',
  },
  6: {
    mins: 30,
    readable: '30 mins',
    unitValue: 30,
    unit: 'm',
  },
  5: {
    mins: 60,
    readable: '1 hr',
    unitValue: 1,
    unit: 'h',
  },
  4: {
    mins: 4 * 60,
    readable: '4 hrs',
    unitValue: 4,
    unit: 'h',
  },
  3: {
    mins: 12 * 60,
    readable: '12 hrs',
    unitValue: 12,
    unit: 'h',
  },
  // Hiding below because it was causing potential DDOS on Timescale DB
  // 2: {
  //   mins: 24 * 60,
  //   readable: '1 day',
  //   unitValue: 1,
  //   unit: 'd',
  // },
  // 1: {
  //   mins: 24 * 60 * 3,
  //   readable: '3 days',
  //   unitValue: 3,
  //   unit: 'd',
  // },
  // 0: {
  //   mins: 24 * 60 * 7,
  //   readable: '7 days',
  //   unitValue: 7,
  //   unit: 'd',
  // },
}

const DEFAULT_SLIDER_VALUE = 6
const SLIDER_MARKS = Object.keys(SLIDER_TO_MINUTES).map(v => ({
  value: Number(v),
}))
const SLIDER_MIN = Math.min(...Object.keys(SLIDER_TO_MINUTES))
const SLIDER_MAX = Math.max(...Object.keys(SLIDER_TO_MINUTES))

// activeColor is hex color
const CURVE_ICONS = [
  {
    query: ['entity_person'],
    key: 'person',
    iconKey: 'Person',
    activeColor: palette.common.greenPastel,
  },
  {
    query: ['entity_car'],
    key: 'car',
    iconKey: 'Car',
    activeColor: palette.common.magenta,
  },
  {
    query: ['entity_bicycle'],
    key: 'bicycle',
    iconKey: 'Bike',
    activeColor: palette.warning.main,
  },
  {
    query: ['entity_box'],
    key: 'box',
    iconKey: 'Box',
    activeColor: palette.error.main,
  },
  {
    query: ['entity_laptop'],
    key: 'laptop',
    iconKey: 'Laptop',
    activeColor: palette.common.neonYellow,
  },
  {
    query: ['entity_backpack'],
    key: 'backpack',
    iconKey: 'Backpack',
    activeColor: palette.error.light,
  },
]

const DEFAULT_KEYS = [
  // 'meta', // drag timeline speed modifier
  // 'alt', // drag timeline speed modifier
  'space', // video play & pause
  'k', // video play & pause alternate
  'left', // back 10
  'right', // forward 10
  'j', // back 30
  'l', // forward 30
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
]

// currently disable keys press listeners
// when calendar is open, and when forensics searching
const DISABLED_KEYS = []

const PLAY_SPEED_MENU_ITEMS = [
  {
    label: '0.25x',
    value: 0.25,
  },
  {
    label: '0.5x',
    value: 0.5,
  },
  {
    label: 'Normal',
    value: 1,
  },
  {
    label: '2x',
    value: 2,
  },
  {
    label: '4x',
    value: 4,
  },
  {
    label: '6x',
    value: 6,
  },
  {
    label: '8x',
    value: 8,
  },
]

export {
  CURVE_ICONS,
  DEFAULT_SLIDER_VALUE,
  DEFAULT_KEYS,
  DISABLED_KEYS,
  FILMSTRIP_HEIGHT,
  PLAY_SPEED_MENU_ITEMS,
  TOOLTIP_ABOVE_FILMSTRIP,
  TIMELINE,
  SLIDER_TO_MINUTES,
  SLIDER_MARKS,
  SLIDER_MIN,
  SLIDER_MAX,
}
