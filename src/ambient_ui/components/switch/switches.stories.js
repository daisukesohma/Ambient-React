// switches.stories.js
import React from 'react'
import { storiesOf } from '@storybook/react' // eslint-disable-line

import { boolean, text } from '@storybook/addon-knobs' // eslint-disable-line

import SliderSwitch from './index'
import LabelledSliderSwitch from './LabelledSliderSwitch'

storiesOf('SliderSwitch', module)
  .add('SliderSwitch', () => {
    const checkedKnob = boolean('checked', false)
    return <SliderSwitch checked={checkedKnob} />
  })
  .add('LabelledSliderSwitch', () => {
    const checkedKnob = boolean('checked', false)
    const darkIconContentKnob = text('darkIconContent', 'Dark')
    const lightIconContentKnob = text('lightIconContent', 'Light')
    return (
      <LabelledSliderSwitch
        darkIconContent={darkIconContentKnob}
        lightIconContent={lightIconContentKnob}
        checked={checkedKnob}
      />
    )
  })
