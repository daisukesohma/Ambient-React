import moment from 'moment'
import get from 'lodash/get'

import useMetadataGroups from './useMetadataGroups'

const useInstanceContext = ({ videoStreamKey, metadataKey }) => {
  const { metadataGroups } = useMetadataGroups({ videoStreamKey, metadataKey })
  const total = metadataGroups.length
  metadataGroups.reverse() // metadataGroups  is in descending order, ie, higher index is more in the past

  const getInstanceContext = time => {
    const afterEndIndex = metadataGroups.findIndex(g => {
      return moment(time).isAfter(g.end) || moment(time).isSame(g.end)
    })

    // if given time is within the timestamps of start and end of an event, return the index
    const withinIndex = metadataGroups.findIndex(g => {
      if (moment(time).isAfter(g.start) && moment(time).isBefore(g.end)) {
        return true
      }
      return false
    })

    const previousIndex = () => {
      if (withinIndex > -1) {
        return withinIndex + 1
      }

      return afterEndIndex
    }

    const nextIndex = () => {
      if (withinIndex > -1) {
        return withinIndex - 1
      }

      return afterEndIndex - 1
    }

    const currentIndex = () => {
      if (withinIndex > -1) {
        return withinIndex
      }

      return null
    }

    const instanceContext = {
      total,
      withinIndex, // if time is within this index
      previous: {
        start: get(metadataGroups, `[${previousIndex()}].start`),
        end: get(metadataGroups, `[${previousIndex()}].end`),
      },
      current: {
        start: get(metadataGroups, `[${currentIndex()}].start`),
        end: get(metadataGroups, `[${currentIndex()}].end`),
      },
      next: {
        start: get(metadataGroups, `[${nextIndex()}].start`),
        end: get(metadataGroups, `[${nextIndex()}].end`),
      },
    }

    return instanceContext
  }

  return {
    getInstanceContext,
  }
}

export default useInstanceContext
