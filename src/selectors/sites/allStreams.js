import { createSelector } from '@reduxjs/toolkit'
import each from 'lodash/each'

const allStreams = createSelector(
  state => state.site.collection,
  collection => {
    const streamsSet = []
    each(collection, site => {
      each(site.streams, stream => {
        if (stream.active) {
          streamsSet.push({
            idx: stream.id,
            id: stream.id,
            label: `${stream.name} @ ${site.slug}`,
            value: stream.id,
            siteSlug: site.slug,
            streamId: stream.id,
            nodeId: stream.node.identifier,
            streamName: stream.name,
            siteName: site.name,
            timezone: site.timezone,
            regionName: stream.region ? stream.region.name : '',
          })
        }
      })
    })

    return streamsSet
  },
)

export default allStreams
