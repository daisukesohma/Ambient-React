/*
 * author: rodaan@ambient.ai
 * The primary storybook file
 * Will separate this out in future
 */
import React from 'react'
import { storiesOf } from '@storybook/react' // eslint-disable-line
import Grid from '@material-ui/core/Grid'

import { RingGauge, BarGauge, DropdownMenu } from '../index'

// TODO: should be used inside of component with useTheme hook OR ideally in makeStyles
import { light as palette } from 'theme'

import { ringGaugeData, menuItems } from './mock-data'

const newColorMap = {
  primary: palette.primary.main,
  secondary: palette.secondary.main,
  error: palette.error.main,
}

storiesOf('Gauge', module)
  .add('Gauge-with-Ring', () => (
    <Grid container>
      <RingGauge title='Total Alerts' data={ringGaugeData} />
    </Grid>
  ))
  .add('Gauge-with-Ring-Click', () => (
    <Grid container>
      <RingGauge
        title='Total Alerts'
        data={ringGaugeData}
        onRingClick={val => {
          // eslint-disable-next-line
          console.log('clicked: ', val)
        }}
      />
    </Grid>
  ))
  .add('Gauge-with-Ring- New Color', () => (
    <Grid container>
      <RingGauge
        title='Total Alerts'
        data={ringGaugeData}
        colorMap={newColorMap}
      />
    </Grid>
  ))
  .add('Gauge-with-Bar', () => (
    <Grid container>
      <BarGauge
        title='Resolved'
        description='All alerts that were resolved or attended to'
        value={23}
        total={40}
        color='primary'
      />
    </Grid>
  ))
  .add('Gauge-with-Bar-Click', () => (
    <Grid container>
      <BarGauge
        title='Resolved'
        description='All alerts that were resolved or attended to'
        value={23}
        total={40}
        color='primary'
        onBarClick={val => {
          // eslint-disable-next-line
          console.log('clicked: ', val)
        }}
      />
    </Grid>
  ))
  .add('Gauge-with-Bar-More', () => (
    <Grid container>
      <BarGauge
        title='Resolved'
        description='All alerts that were resolved or attended to'
        value={23}
        total={40}
        color='primary'
        moreComponent={
          <DropdownMenu
            menuItems={menuItems}
            handleSelection={val => {
              // eslint-disable-next-line
              console.log(val)
            }}
          />
        }
        isMoreCompShown={false}
      />
    </Grid>
  ))
  .add('Gauge-with-Bar-More-Inline', () => (
    <Grid container>
      <BarGauge
        title='Resolved'
        description='All alerts that were resolved or attended to'
        value={23}
        total={40}
        color='primary'
        moreComponent={
          <DropdownMenu menuItems={menuItems} handleSelection={() => {}} />
        }
        isMoreCompShown={false}
        inlineShow
      />
    </Grid>
  ))
