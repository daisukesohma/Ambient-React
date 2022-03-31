import React from 'react'
import { storiesOf } from '@storybook/react'
import {
  Legend,
  DrawerRow,
  CircularProgressPanel,
  ErrorPanel,
  CircularProgress,
} from '../index'
// TODO: should be used inside of component with useTheme hook OR ideally in makeStyles
import { light as palette } from 'theme'

import { legendData } from './mock-data'

storiesOf('Common', module).add('Legend', () => <Legend data={legendData} />)

storiesOf('Common', module).add('Drawer-Row', () => (
  <DrawerRow label='Home' icon='home' markColor={palette.primary.main} />
))

storiesOf('Common', module).add('Error-Panel', () => <ErrorPanel />)

storiesOf('Progress', module)
  .add('Circular-Progress-indeterminate-primary', () => (
    <CircularProgressPanel />
  ))
  .add('Circular-Progress-indeterminate-secondary', () => (
    <CircularProgressPanel color='secondary' />
  ))
  .add('Circular-Progress-without-panel', () => <CircularProgress />)
  .add('Circular-Progress-without-panel - modifying size', () => (
    <CircularProgress size={30} />
  ))
