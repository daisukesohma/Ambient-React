import { createSelector } from '@reduxjs/toolkit'
import each from 'lodash/each'
import get from 'lodash/get'

const streamsDropDown = createSelector(
  state => state.operatorPage.streams,
  collection => {
    const streamsSet = []
    each(collection, stream => {
      streamsSet.push({
        idx: stream.id,
        id: stream.id,
        label: `${stream.name} @ ${stream.site.slug} ${
          stream.region ? `(${stream.region.name})` : ''
        }`,
        value: stream.id,
        regionName: stream.region ? stream.region.name : '',
        siteSlug: stream.site.slug,
        streamId: stream.id,
        nodeId: stream.node.identifier,
        timezone: stream.site.timezone,
        streamName: stream.name,
        siteName: stream.site.name,
        snapshot: get(stream, 'snapshot.dataStr'),
        snapshotLoading: stream.snapshotLoading,
      })
    })
    return streamsSet
  },
)

export default streamsDropDown
