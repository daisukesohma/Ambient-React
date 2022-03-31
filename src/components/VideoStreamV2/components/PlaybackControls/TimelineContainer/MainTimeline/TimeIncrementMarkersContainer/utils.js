import { getZoomTS } from '../../../../../utils'

const getIntervalToPxMap = secInPx => {
  const minuteInPx = secInPx * 60
  const hourInPx = minuteInPx * 60
  return {
    '0.5s': 0.5 * secInPx,
    '1s': secInPx,
    '5s': 5 * secInPx,
    '10s': 10 * secInPx,
    '15s': 15 * secInPx,
    '30s': 30 * secInPx,
    '1m': minuteInPx,
    '2m': 2 * minuteInPx,
    '5m': 5 * minuteInPx,
    '10m': 10 * minuteInPx,
    '15m': 15 * minuteInPx,
    '30m': 30 * minuteInPx,
    '1h': hourInPx,
    '2h': 2 * hourInPx,
    '3h': 3 * hourInPx,
    '4h': 4 * hourInPx,
    '6h': 6 * hourInPx,
  }
}

const getZoomToPxMap = intervalToPxMap => ({
  10: {
    major: intervalToPxMap['5s'],
    minor: intervalToPxMap['1s'],
  },
  9: {
    major: intervalToPxMap['10s'],
    minor: intervalToPxMap['1s'],
  },
  8: {
    major: intervalToPxMap['15s'],
    minor: intervalToPxMap['5s'],
  },
  7: {
    major: intervalToPxMap['30s'],
    minor: intervalToPxMap['10s'],
  },
  6: {
    major: intervalToPxMap['1m'],
    minor: intervalToPxMap['15s'],
  },
  5: {
    major: intervalToPxMap['5m'],
    minor: intervalToPxMap['1m'],
  },
  4: {
    major: intervalToPxMap['15m'],
    minor: intervalToPxMap['5m'],
  },
  3: {
    major: intervalToPxMap['30m'],
    minor: intervalToPxMap['10m'],
  },
  2: {
    major: intervalToPxMap['1h'],
    minor: intervalToPxMap['15m'],
  },
  1: {
    major: intervalToPxMap['3h'],
    minor: intervalToPxMap['1h'],
  },
  0: {
    major: intervalToPxMap['6h'],
    minor: intervalToPxMap['1h'],
  },
})

export const convertZoomToPx = zoomLevel => {
  const secInPx = getZoomTS(1, zoomLevel)
  const intervalToPxMap = getIntervalToPxMap(secInPx)
  const zoomToPxMap = getZoomToPxMap(intervalToPxMap)
  return zoomToPxMap[zoomLevel]
}

export const getLowestIncrementWithinRange = (
  minRange,
  maxRange,
  increment,
) => {
  let lowest
  for (let i = minRange; i <= maxRange; ++i) {
    if (i % increment === 0) {
      lowest = i
      break
    }
  }
  return lowest
}

export const getHighestIncrementWithinRange = (
  minRange,
  maxRange,
  increment,
) => {
  let highest
  for (let i = maxRange; i >= minRange; --i) {
    if (i % increment === 0) {
      highest = i
      break
    }
  }
  return highest
}
