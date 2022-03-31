import React from 'react'
import moment from 'moment'
import { storiesOf } from '@storybook/react' // eslint-disable-line

import { DateTimeRangePicker, DateTimeRangePickerWithPopover } from '../index'

let startTs = moment()
  .startOf('day')
  .unix()
let endTs = moment().unix()

storiesOf('DateTimeRangePicker', module)
  .add('DateTimeRangePicker-Default', () => (
    <DateTimeRangePicker onChange={val => console.log(val)} />
  ))
  .add('DateTimeRangePicker-Inline', () => (
    <DateTimeRangePicker inline onChange={val => console.log(val)} />
  ))
  .add('DateTimeRangePicker-Disabled', () => <DateTimeRangePicker disabled />)
  .add('DateTimeRangeWithPopover', () => (
    <DateTimeRangePickerWithPopover
      onChange={val => {
        console.log('storey')
        console.log(val)
        startTs = val[0]
        endTs = val[1]
      }}
      startTs={startTs}
      endTs={endTs}
    />
  ))
