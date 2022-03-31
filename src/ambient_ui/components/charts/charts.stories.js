import React from 'react'
import { storiesOf } from '@storybook/react' // eslint-disable-line

import { PieChart, BarChart, StackedBarChart } from '../index'

import { barData, pieData, stackedBarData } from './mock-data'

//
// Pie Chart
//

storiesOf('Chart', module)
  .add('PieChart-with-unclean-data', () => (
    <PieChart title='Alerts by Type' data={pieData} id='pie-1' />
  ))
  .add('PieChart-with-clean-data', () => (
    <PieChart title='Alerts by Type' data={pieData} id='pie-1' clean />
  ))
  .add('PieChart-with-Click', () => (
    <PieChart
      title='Alerts by Type'
      data={pieData}
      id='pie-1'
      onPieClick={val => {
        // eslint-disable-next-line
        console.log('clicked: ', val)
      }}
    />
  ))
  .add('PieChart-with-Legend', () => (
    <PieChart
      title='Alerts by Type'
      data={pieData}
      id='pie-1'
      clean
      isLegendShown
    />
  ))
  .add('PieChart-with-no-data', () => (
    <PieChart title='Alerts by Type' data={[]} id='pie-1' clean />
  ))

//
// Bar Chart
//

storiesOf('Chart', module)
  .add('BarChart-Default', () => (
    <BarChart title='Alert to Dispatch Time' data={barData} />
  ))
  .add('BarChart-with-Legend', () => (
    <BarChart title='Alert to Dispatch Time' data={barData} isLegendShown />
  ))
  .add('BarChart-with-Description', () => (
    <BarChart
      title='Alert to Dispatch Time'
      data={barData}
      description='Cool chart man'
    />
  ))
  .add('BarChart-with-Click', () => (
    <BarChart
      title='Alert to Dispatch Time'
      data={barData}
      onBarClick={val => {
        // eslint-disable-next-line
        console.log('clicked: ', val)
      }}
    />
  ))
  .add('BarChart-with-No-Data', () => (
    <BarChart title='Alert to Dispatch Time' data={[]} />
  ))

//
// Stacked Bar Chart
//

storiesOf('Chart', module).add('StackedBarChart-Default', () => (
  <StackedBarChart
    data={stackedBarData}
    labels={['one', 'two', 'three', 'four']}
  />
))
