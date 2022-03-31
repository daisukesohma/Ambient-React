/* eslint-disable */
import React from 'react'

import { storiesOf } from '@storybook/react'

import { Tabs } from '../index'

import { tabs, tabsWithIcon } from './mock-data'

storiesOf('Tabs', module)
  .add('Tabs-Default', () => (
    <Tabs tabs={tabs} onChange={val => console.log(val)} />
  ))
  .add('Tabs-Default Value', () => (
    <div>
      This tabs has a default value of 2 being set. Order starts at 0
      <Tabs tabs={tabs} onChange={val => console.log(val)} value={2} />
    </div>
  ))
  .add('Tabs-with-Icon', () => (
    <Tabs tabs={tabsWithIcon} onChange={val => console.log(val)} />
  ))
