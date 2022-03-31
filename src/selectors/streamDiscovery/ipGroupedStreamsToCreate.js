import { createSelector } from '@reduxjs/toolkit'
import each from 'lodash/each'
import get from 'lodash/get'

export default createSelector(
  [state => get(state, 'streamDiscovery.streamsToCreate', [])],
  streams => {
    const ips = {}
    each(streams, stream => {
      const { cameraIp } = stream
      // create
      if (ips[cameraIp] === undefined) {
        ips[cameraIp] = {
          streams: [stream],
          ip: cameraIp,
        }
      }
      // add
      else {
        ips[cameraIp].streams.push(stream)
      }
    })

    return ips
  },
)
