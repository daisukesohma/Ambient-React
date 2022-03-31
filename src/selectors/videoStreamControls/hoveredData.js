import { createSelector } from '@reduxjs/toolkit'
import get from 'lodash/get'
import moment from 'moment'
import { msToUnix } from '../../utils'

export default ({ videoStreamKey, time }) => {
  return createSelector(
    [state => state.videoStreamControls],
    streams => {
      const catalog = get(streams, `[${videoStreamKey}].catalogue`)
      const metadata = get(streams, `[${videoStreamKey}].metadata`)
      const metadataKeys = Object.keys(metadata)
      // const forensicsResults = get(streams, `[${videoStreamKey}].results`)
      const snapshotUrl = get(streams, `[${videoStreamKey}].snapshotUrl`)
      const snapshotLoading = get(
        streams,
        `[${videoStreamKey}].snapshotLoading`,
      )

      // CHECKS CATALOG
      // returns true/false
      //
      const isInCatalog =
        catalog.findIndex(c => {
          return (
            moment(time).isAfter(moment.unix(msToUnix(c.startTs))) &&
            moment(time).isBefore(moment.unix(msToUnix(c.endTs)))
          )
        }) >= 0

      // CHECKS METADATA
      // returns {
      //    person: {},
      //    car: { date, value }
      // }
      //
      const isInMetadata = {}
      metadataKeys.forEach(k => {
        const selectedMetadata = metadata[k].find(d => {
          return (
            moment(time).isAfter(moment(d.date)) &&
            moment(time).isBefore(moment(d.date).add(10, 'seconds'))
          )
        })
        if (selectedMetadata) {
          isInMetadata[k] = selectedMetadata
        } else {
          isInMetadata[k] = {}
        }
      })

      // const result = forensicsResults.find(r => {
      //   return (
      //     moment(time).isAfter(moment.unix(r.ts / 1000)) &&
      //     moment(time).isBefore(moment.unix(r.ts / 1000).add(30, 'seconds'))
      //   )
      // })

      return {
        isInCatalog,
        // isInRetentionDays: true,
        isInFuture: time > new Date(),
        metadata: isInMetadata,
        // result: result || {},
        snapshotUrl,
        snapshotLoading,
      }
    },
  )
}
