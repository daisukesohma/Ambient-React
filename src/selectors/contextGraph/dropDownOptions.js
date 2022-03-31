import React from 'react'
import { createSelector } from '@reduxjs/toolkit'

import SimpleLabel from '../../components/Label/SimpleLabel'

export default createSelector(
  [state => state.contextGraph.securityProfiles],
  securityProfiles => {
    return securityProfiles.length > 0
      ? securityProfiles.map(securityProfile => {
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
                {securityProfile.name}
                <SimpleLabel>Security Profile</SimpleLabel>
              </span>
            ),
            value: securityProfile.id,
          }
        })
      : []
  },
)
