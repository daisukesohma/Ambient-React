import { TimeRangeEnum } from 'enums'

export default [
  {
    label: 'Within the Day',
    separator: true,
  },
  {
    label: 'Past 1 hour',
    getValue: () => TimeRangeEnum.HOUR,
  },
  {
    label: 'Past 6 hours',
    getValue: () => TimeRangeEnum.HOUR * 6,
  },
  {
    label: 'Past 12 hours',
    getValue: () => TimeRangeEnum.HOUR * 12,
  },
  {
    label: 'Past the Day',
    separator: true,
  },
  {
    label: 'Past 1 day',
    getValue: () => TimeRangeEnum.DAY,
  },
  {
    label: 'Past 1 Week',
    getValue: () => TimeRangeEnum.WEEK,
  },
  {
    label: 'Past 1 Month',
    getValue: () => TimeRangeEnum.MONTH,
  },
]
