import React from 'react'
import { storiesOf } from '@storybook/react' // eslint-disable-line

import { Tooltip } from '../index'

storiesOf('Tooltips', module)
  .add('Tooltip-Default', () => (
    <Tooltip title='I am tooltip'>
      <span>hover me</span>
    </Tooltip>
  ))
  .add('Tooltip-with-Position', () => (
    <Tooltip title='I am tooltip' placement='right'>
      <span>hover me</span>
    </Tooltip>
  ))
  .add('Tooltip-with-Custom-Style', () => (
    <Tooltip
      title='I am tooltip'
      customStyle={{
        color: 'yellow',
        backgroundColor: 'red',
      }}
    >
      <span>hover me</span>
    </Tooltip>
  ))
