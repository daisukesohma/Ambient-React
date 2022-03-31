import React from 'react'
import { storiesOf } from '@storybook/react' // eslint-disable-line

import { TextInput } from '../index'

storiesOf('Inputs', module)
  .add('Input-Text', () => (
    <TextInput
      label='Label'
      placeholder='Input Text'
      helperText='Assistive Text'
      onChange={() => {}}
    />
  ))
  .add('Input-Text-Disabled', () => (
    <TextInput
      disabled
      label='Label'
      placeholder='Input Text'
      helperText='Assistive Text'
      onChange={() => {}}
    />
  ))
  .add('Input-Text-Error', () => (
    <TextInput
      error
      label='Label'
      placeholder='Input Text'
      helperText='Assistive Text'
      onChange={() => {}}
    />
  ))
