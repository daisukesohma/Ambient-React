import { createSelector } from '@reduxjs/toolkit'
import each from 'lodash/each'
import get from 'lodash/get'

export default createSelector(
  [state => get(state, 'streamDiscovery.nodeRequest.streamRequests', [])],
  streamRequests => {
    const ips = {}
    each(streamRequests, streamRequest => {
      const { cameraIp } = streamRequest
      if (ips[cameraIp] === undefined) {
        ips[cameraIp] = {
          streamRequests: [streamRequest],
          ip: cameraIp,
        }
      } else {
        ips[cameraIp].streamRequests.push(streamRequest)
      }
    })
    return ips
  },
)
