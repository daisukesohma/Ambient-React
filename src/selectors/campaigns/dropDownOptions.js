import React from 'react'
import { createSelector } from '@reduxjs/toolkit'
import { CircularProgress } from 'ambient_ui'

import SimpleLabel from '../../components/Label/SimpleLabel'

export default selection =>
  createSelector(
    selection,
    campaigns => {
      return campaigns.length > 0
        ? campaigns.map(campaign => {
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
                    {campaign.name}
                  </span>
                  <SimpleLabel>Campaign</SimpleLabel>
                </span>
              ),
              value: campaign,
            }
          })
        : [
            {
              label: (
                <>
                  <CircularProgress />
                  <SimpleLabel>Campaigns</SimpleLabel>
                </>
              ),
              value: {},
            },
          ]
    },
  )
