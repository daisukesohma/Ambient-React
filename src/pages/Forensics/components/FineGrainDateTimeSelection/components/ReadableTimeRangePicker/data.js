import moment from 'moment'

const secInHour = 60 * 60
const secInDay = secInHour * 24
const CUSTOM = 'Custom'

// value is number of seconds that we will go back from "now" to render the start date
const data = [
  {
    label: 'Past week',
    getValue: () => secInDay * 7,
  },
  {
    label: 'Past 5 days',
    getValue: () => secInDay * 5,
  },
  {
    label: 'Past 3 days',
    getValue: () => secInDay * 3,
  },
  {
    label: 'Past day',
    getValue: () => secInDay,
  },
  {
    label: 'Today since midnight',
    getValue: () =>
      moment().unix() -
      moment()
        .startOf('day')
        .unix(),
  },
  {
    label: 'Past 1 hour',
    getValue: () => secInHour,
  },
  {
    label: 'Past 3 hours',
    getValue: () => secInHour * 3,
  },
  {
    label: 'Past 6 hours',
    getValue: () => secInHour * 6,
  },
  {
    label: CUSTOM, // index 8
    getValue: () => null,
  },
]

export const getCustomIndex = () => {
  return data.findIndex(x => x.label === CUSTOM)
}

export const getLabelAtIndex = index => {
  return data[index].label
}

export default data
