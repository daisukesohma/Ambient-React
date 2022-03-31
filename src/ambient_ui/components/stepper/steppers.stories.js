import React from 'react'
import { storiesOf } from '@storybook/react' // eslint-disable-line

import { Stepper } from '../index'

import { steps } from './mock-data'

storiesOf('Stepper', module)
  .add('Stepper-with-Navigator', () => (
    <Stepper steps={steps} activeStep={2} showNavigation />
  ))
  .add('Stepper-without-Navigator', () => (
    <Stepper steps={steps} activeStep={2} />
  ))
