const SLIDER_TO_SPEED = {
  0: {
    speed: 0.25,
    readable: '.25x',
  },
  1: {
    speed: 0.5,
    readable: '.50x',
  },
  2: {
    speed: 1.0,
    readable: '1.0x',
  },
  3: {
    speed: 2.0,
    readable: '2.0x',
  },
  4: {
    speed: 4.0,
    readable: '4.0x',
  },
  5: {
    speed: 8.0,
    readable: '8.0x',
  },
  6: {
    speed: 30.0,
    readable: '30.0x',
  },
}

const SLIDER_MARKS = Object.keys(SLIDER_TO_SPEED).map(v => ({
  value: Number(v),
}))

const DEFAULT_SLIDER_VALUE = 2
const SLIDER_MIN = Math.min(...Object.keys(SLIDER_TO_SPEED))
const SLIDER_MAX = Math.max(...Object.keys(SLIDER_TO_SPEED))

export {
  DEFAULT_SLIDER_VALUE,
  SLIDER_TO_SPEED,
  SLIDER_MARKS,
  SLIDER_MIN,
  SLIDER_MAX,
}
