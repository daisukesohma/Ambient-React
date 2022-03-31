import React from 'react'

import { Icons } from '../index'

const { Gear } = Icons

export const tabs = [
  {
    label: 'Outstanding Alerts',
  },
  {
    label: 'Resolved Alerts',
  },
  {
    label: 'Ongoing Cases',
  },
  {
    label: 'Closed Cases',
  },
]

export const tabsWithIcon = [
  {
    label: 'Outstanding Alerts',
    icon: <Gear />,
  },
  {
    label: 'Resolved Alerts',
    icon: <Gear />,
  },
  {
    label: 'Ongoing Cases',
    icon: <Gear />,
  },
  {
    label: 'Closed Cases',
    icon: <Gear />,
  },
]
