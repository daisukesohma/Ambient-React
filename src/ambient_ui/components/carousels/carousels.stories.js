import React from 'react'
import { storiesOf } from '@storybook/react' // eslint-disable-line

import { Carousel } from '../index'

const carouselItems = []
for (let i = 0; i < 10; i++) {
  carouselItems.push(
    <div key={i} style={{ height: 132, background: '#F2F4F7' }}>
      {i}
    </div>,
  )
}

storiesOf('Carousel', module)
  .add('Carousel-Default', () => <Carousel items={carouselItems} />)
  .add('Carousel-No-Data', () => (
    <Carousel
      items={[]}
      noDataMsg='There were no dispatched alerts at the selected Time Range.'
    />
  ))
