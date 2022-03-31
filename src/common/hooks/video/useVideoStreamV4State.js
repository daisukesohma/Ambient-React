import { useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
// src
import {
  fetchMetadataRequested,
  cleanupVideoStreamControls,
  toggleMetadataCurveVisible,
} from 'redux/slices/videoStreamControls'
import getVideoStreamControlsState from 'selectors/videoStreamControls/getVideoStreamControlsState'

// NOTE: FUTURE will want another hook specifically for v4 video player, which won't have to useinterval and a lot of these state variables
// NOTE: 3/3/2021 Eric: may want to get rid of this hook. noticed some odd behavior where this hook is called over and over again on local dev in indeterminate situtations
//
const useVideoStreamV4State = ({
  accountSlug,
  siteSlug,
  videoStreamKey,
  streamId,
}) => {
  const dispatch = useDispatch()

  const startTimelineTS = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'startTimelineTS',
    }),
  )

  const selectedEntities = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'selectedEntities',
    }),
  )

  // SETTING CURVE VISIBLE
  // NOTE: This hopefully acts as a backstop for when metadataCurveVisible is empty or cleared out.
  // This *should*  set it when it's empty.
  //
  const curveVisible = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'metadataCurveVisible',
    }),
  )

  useEffect(() => {
    if (curveVisible === undefined) {
      dispatch(
        toggleMetadataCurveVisible({
          videoStreamKey,
          metadataKey: 'person',
          visible: true,
        }),
      )
    }
  }, [curveVisible])
  //
  // SETTING CURVE VISIBLE END

  const ready = useSelector(
    getVideoStreamControlsState({ videoStreamKey, property: 'ready' }),
  )

  const startDate = new Date()
  startDate.setHours(0, 0, 0, 0)

  const getMetadata = useCallback(
    (entitiesQuery, startTs, endTs) => {
      dispatch(
        fetchMetadataRequested({
          accountSlug,
          siteSlug,
          streamId,
          startTs,
          endTs,
          videoStreamKey,
          queryString: entitiesQuery, // array of strings ['entity_person', 'type_label'],
        }),
      )
    },
    [dispatch, accountSlug, siteSlug, streamId, videoStreamKey],
  )

  useEffect(() => {
    return function cleanup() {
      cleanupVideoStreamControls({
        videoStreamKey,
      })
    }
  }, [
    selectedEntities,
    accountSlug,
    dispatch,
    siteSlug,
    startTimelineTS,
    streamId,
    videoStreamKey,
  ])

  return {
    ready,
    getMetadata,
  }
}

export default useVideoStreamV4State
