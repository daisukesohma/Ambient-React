import React from 'react'
import { createSelector } from '@reduxjs/toolkit'

import SimpleLabel from '../../components/Label/SimpleLabel'

export default createSelector(
  [state => state.analytics.dashboards],
  dashboards => {
    return dashboards.length > 0
      ? dashboards.map(dashboard => {
          return {
            label: (
              <span
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                {dashboard.name}
                <SimpleLabel>Dashboard</SimpleLabel>
              </span>
            ),
            value: dashboard.id,
          }
        })
      : []
  },
)
