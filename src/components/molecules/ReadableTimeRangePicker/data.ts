import moment from 'moment'
import findIndex from 'lodash/findIndex'

const secInHour = 60 * 60
const secInDay = secInHour * 24
const CUSTOM = 'Custom'
export const TODAY_SINCE_MIDNIGHT = 'Since midnight'
// value is number of seconds that we will go back from "now" to render the start date
const data = [
  {
    label: 'Within the Day',
    separator: true,
  },
  {
    label: TODAY_SINCE_MIDNIGHT,
    getValue: (): number =>
      moment().unix() -
      moment()
        .startOf('day')
        .unix(),
  },
  {
    label: 'Past 1 hour',
    getValue: (): number => secInHour,
  },
  {
    label: 'Past 3 hours',
    getValue: (): number => secInHour * 3,
  },
  {
    label: 'Past 6 hours',
    getValue: (): number => secInHour * 6,
  },
  {
    label: 'Past Today',
    separator: true,
  },
  {
    label: 'Past 1 day',
    getValue: (): number => secInDay,
  },
  {
    label: 'Past 3 days',
    getValue: (): number => secInDay * 3,
  },
  {
    label: 'Past 5 days',
    getValue: (): number => secInDay * 5,
  },
  {
    label: 'Past week',
    getValue: (): number => secInDay * 7,
  },
]

export const getCustomIndex = (): number => {
  return findIndex(data, { label: CUSTOM })
}

export const getLabelAtIndex = (index: number): string => {
  return data[index].label
}

export default data
