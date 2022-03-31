import { useSelector } from 'react-redux'
import moment from 'moment'
import get from 'lodash/get'
// src
import getVideoStreamControlsState from 'selectors/videoStreamControls/getVideoStreamControlsState'

const useMetadataGroups = ({ videoStreamKey, metadataKey }) => {
  const metadataAll = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'metadata',
    }),
  )

  const metadataOfKey = metadataAll && metadataAll[metadataKey]

  const getGroupsFromMetadata = metadata => {
    if (!metadata) return []

    const metadataStartEnd = metadata.map(m => ({
      start: moment(m.date).unix(),
      end: moment(m.date)
        .add(10, 'seconds')
        .unix(),
    }))

    const groups = []
    let group = { start: undefined, end: undefined }
    let i = 0
    const { length } = metadataStartEnd

    while (i < length) {
      if (!group.start) {
        group.start = metadataStartEnd[i].start
      }
      while (
        metadataStartEnd[i].end === get(metadataStartEnd[i + 1], 'start')
      ) {
        group.end = get(metadataStartEnd[i + 1], 'end')
        i += 1
      }

      if (!group.end) {
        group.end = group.start + 10
      }
      groups.push(group)
      group = { start: undefined, end: undefined }
      i += 1
    }

    // aggregates metadata into blocks of time
    // should return [
    //   {start: "2020-09-29T19:33:50.000Z", end: "2020-09-29T19:34:20.000Z"},
    //   {start: "2020-09-29T19:34:30.000Z", end: "2020-09-29T19:34:50.000Z"},
    //   {start: "2020-09-29T19:35:00.000Z", end: "2020-09-29T19:35:0.000Z"},
    //   {start: "2020-09-29T19:40:00.000Z", end: "2020-09-29T19:40:10.000Z"}
    // ]

    return groups.map(g => ({
      start: moment.unix(g.start).toDate(),
      end: moment.unix(g.end).toDate(),
    }))
  }

  return {
    metadataGroups: getGroupsFromMetadata(metadataOfKey),
  }
}

export default useMetadataGroups
