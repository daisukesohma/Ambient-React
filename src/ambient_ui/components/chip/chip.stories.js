import React from 'react'
import { storiesOf } from '@storybook/react' // eslint-disable-line

import { Chip } from '../index'

storiesOf('Chip', module)
  .add('Chip-Default', () => <Chip primary='Primary' />)
  .add('Chip-with-Image-And-Secondary-Text', () => (
    <Chip
      primary='Primary'
      secondary='secondary'
      imgSrc='https://picsum.photos/200'
    />
  ))
