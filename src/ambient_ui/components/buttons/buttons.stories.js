import React from 'react'
import { storiesOf } from '@storybook/react' // eslint-disable-line
import { action } from '@storybook/addon-actions' // eslint-disable-line

import { Button } from '../index'
// TODO: should be used inside of component with useTheme hook OR ideally in makeStyles
import { light as palette } from 'theme'

storiesOf('Button', module)
  .add('Button-Contained-Primary', () => (
    <div>
      <Button variant='contained' color='primary' onClick={action('clicked')}>
        Enabled
      </Button>
      <Button
        variant='contained'
        color='primary'
        disabled
        onClick={action('clicked')}
      >
        Enabled
      </Button>
      <Button>Base</Button>
      <Button
        variant='contained'
        color='primary'
        onClick={action('clicked')}
        type='submit'
      >
        Enabled
      </Button>
    </div>
  ))
  .add('Button-Outlined-Primary', () => (
    <div>
      <Button variant='outlined' color='primary' onClick={action('clicked')}>
        Enabled
      </Button>
      <Button
        variant='outlined'
        color='primary'
        disabled
        onClick={action('clicked')}
      >
        Enabled
      </Button>
    </div>
  ))
  .add('Button-Text-Primary', () => (
    <div>
      <Button variant='text' color='primary' onClick={action('clicked')}>
        Enabled
      </Button>
      <Button
        variant='text'
        color='primary'
        disabled
        onClick={action('clicked')}
      >
        Enabled
      </Button>
    </div>
  ))
  .add('Button-Custom-Style', () => (
    <div>
      <Button
        variant='contained'
        customStyle={{
          color: palette.grey[100],
          backgroundColor: palette.warning.main,
        }}
        onClick={action('clicked')}
      >
        Custom
      </Button>
    </div>
  ))
