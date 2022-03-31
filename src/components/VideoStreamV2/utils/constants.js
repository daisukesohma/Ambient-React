export const MIN_IN_DAY = 1440
export const SEC_IN_DAY = MIN_IN_DAY * 60 // 86400
export const ZOOM_LEVELS = {
  0: 1 / 120,
  1: 1 / 60,
  2: 1 / 30,
  3: 1 / 10,
  4: 1 / 5,
  5: 1,
  6: 5,
  7: 10,
  8: 30,
  9: 60,
  10: 120,
}

// material-ui slider requires you to go from 0 - 10 for L-to-R
// which is why we need to inverse it
// zoom level 10 is key 0, level 10 is key 10
export const INVERSE_ZOOM_LEVEL_LABELS = {
  0: '5s',
  1: '10s',
  2: '15s',
  3: '30s',
  4: '1m',
  5: '5m',
  6: '15m',
  7: '30m',
  8: '1h',
  9: '3h',
  10: '4h',
}

// array of values which will be displayed under teh zoom control persistently
export const VISIBLE_BOTTOM_LABELS_FOR_VALUES = [0, 5, 10]
export const BOTTOM_LABELS = {
  0: 'secs',
  5: 'mins',
  10: 'hrs',
}
