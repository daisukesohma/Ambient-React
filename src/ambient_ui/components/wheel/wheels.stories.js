/* eslint-disable */
import React from 'react'
import { storiesOf, addDecorator } from '@storybook/react' // eslint-disable-line

import Wheel from './index'

const data = [
  {
    label: 'Last 24 hours',
    value: 1,
  },
  {
    label: 'Today since midnight',
    value: 1,
  },
  {
    label: 'Last 1 hour',
    value: 1,
  },
  {
    label: 'Last 3 hours',
    value: 1,
  },
  {
    label: 'Last 6 hours',
    value: 1,
  },
  {
    label: 'Last 3 days',
    value: 1,
  },
  {
    label: 'Last 5 days',
    value: 1,
  },
  {
    label: 'Last 7 days',
    value: 1,
  },
]

storiesOf('Wheel', module).add('Wheel', () => (
  <div
    style={{
      height: 175,
      padding: 20,
      display: 'flex',
      justifyContent: 'center',
      background: '#000',
    }}
  >
    <div style={{ width: 300 }}>
      <Wheel
        length={data.length}
        width={300}
        setValue={(_, idx) => {
          return data[idx].label
        }}
        onChange={s => console.log('onchange', s.details().relativeSlide)}
      />
    </div>
  </div>
))
