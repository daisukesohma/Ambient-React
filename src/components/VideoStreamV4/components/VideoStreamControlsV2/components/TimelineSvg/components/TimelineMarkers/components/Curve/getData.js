import moment from 'moment'
// TODO: should be used inside of component with useTheme hook OR ideally in makeStyles
import { light as palette } from 'theme'

const lineCount = 2 // how many lines are graphed

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max))
}

// This is how we control colors of the curve based on index.
// This is a temporary workaround for something more extensible or declarative
const getColor = i => {
  switch (i) {
    case 0:
      return palette.common.greenPastel
    case 1:
      return palette.secondary[500]
    case 2:
      return palette.common.tertiary
    case 3:
      return palette.common.greenBluePastel
    case 4:
      return palette.error.light
    default:
      return palette.warning.light
  }
}

const getMoreZeroes = value => {
  if (getRandomInt(10) < 9) {
    return 0
  }

  return value
}
// generateDateValue will generate an array of
// objects each with {date: , }, decrementing by duration/totalPoints for each subsequent step
const generateDateValue = (
  initTime = new Date(),
  duration = moment.duration(24, 'hour'),
  totalPoints = (60 * 60 * 24) / 10, // could be like 15000/day in production
  offsetFromLive = moment.duration(0, 'minute'), // if you want it to go past live time by x minutes just to see
) => {
  const decrement = duration / totalPoints
  return new Array(totalPoints).fill(null).map((_, i) => ({
    date: moment(initTime)
      .add(offsetFromLive)
      .subtract(decrement * i)
      .toDate(),
    value: getMoreZeroes(getRandomInt(100)).toString(),
  })) // can be more interesting with this random data
}

// duration is a moment.duration
// startTime is a date obj
const generateMockData = () => {
  return new Array(lineCount).fill(null).map((_, i) => ({
    data: generateDateValue(),
    color: getColor(i),
    visible: true,
  }))
}

export { lineCount, generateMockData }
