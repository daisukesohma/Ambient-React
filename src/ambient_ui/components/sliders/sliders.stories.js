import React from 'react'
import { storiesOf } from '@storybook/react' // eslint-disable-line

import { Slider } from '../index'

storiesOf('Slider', module).add('Slider-Default', () => (
  <Slider
    min={10}
    max={110}
    step={10}
    defaultValue={40}
    onChange={val => console.log(val)}
  />
))
