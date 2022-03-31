import React from 'react'
import { createSelector } from '@reduxjs/toolkit'
import { CircularProgress } from 'ambient_ui'
import { InventoryStatusReadableEnum } from 'enums'

import SimpleLabel from '../../../components/Label/SimpleLabel'

export default selection =>
  createSelector(
    selection,
    statuses => {
      return statuses.length > 0
        ? statuses.map(status => {
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
                    {InventoryStatusReadableEnum[status.status]}
                  </span>
                  <SimpleLabel>Status</SimpleLabel>
                </span>
              ),
              value: status,
            }
          })
        : [
            {
              label: (
                <>
                  <CircularProgress />
                  <SimpleLabel>Status</SimpleLabel>
                </>
              ),
              value: {},
            },
          ]
    },
  )
