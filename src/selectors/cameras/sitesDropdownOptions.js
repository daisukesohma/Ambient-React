import React from 'react'
import { createSelector } from '@reduxjs/toolkit'
import { CircularProgress } from 'ambient_ui'
// src
import SimpleLabel from 'components/Label/SimpleLabel'

export default createSelector(
  [state => state.cameras.sites],
  sites => {
    if (sites && sites.length > 0) {
      return sites.map(site => {
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
              <span
                style={{
                  flex: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {site.name}
              </span>
              <SimpleLabel>Site</SimpleLabel>
            </span>
          ),
          value: site.slug,
          filterLabel: site.name,
        }
      })
    }

    return [
      {
        label: (
          <>
            <CircularProgress />
            <SimpleLabel>Sites</SimpleLabel>
          </>
        ),
        filterLabel: '',
        value: null,
      },
    ]
  },
)
