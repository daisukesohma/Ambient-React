import React from 'react'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'
import { createSelector } from '@reduxjs/toolkit'
import { CircularProgress } from 'ambient_ui'
import { DEFAULT_TIMEZONE } from 'utils/dateTime/formatTimeWithTZ'

import SimpleLabel from '../../components/Label/SimpleLabel'

export default selection =>
  createSelector(
    selection,
    sites => {
      return !isEmpty(sites)
        ? sites.map(site => {
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
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {site.name}
                  </span>
                  <SimpleLabel>Site</SimpleLabel>
                </span>
              ),
              value: site.slug,
              timezone: site.timezone,
              filterLabel: site.name,
              id: get(site, 'id'),
            }
          })
        : [
            {
              label: (
                <>
                  <CircularProgress />
                  <SimpleLabel>Sites</SimpleLabel>
                </>
              ),
              value: null,
              filterLabel: '',
              timezone: DEFAULT_TIMEZONE,
            },
          ]
    },
  )
