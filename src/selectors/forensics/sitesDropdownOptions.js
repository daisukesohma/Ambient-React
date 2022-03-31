import React from 'react'
import { createSelector } from '@reduxjs/toolkit'
import { CircularProgress } from 'ambient_ui'

import SimpleLabel from '../../components/Label/SimpleLabel'

export default selection =>
  createSelector(selection, forensics => {
    const { sites } = forensics

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
              {site.name}
              <SimpleLabel>Site</SimpleLabel>
            </span>
          ),
          value: site.slug,
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
        value: null,
      },
    ]
  })
