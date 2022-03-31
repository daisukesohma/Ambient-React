// import { useState, useEffect, useCallback } from 'react'
// import { useSelector, useDispatch } from 'react-redux'
// // src
// import { StreamTypeUpdatedEnum, StreamStateEnum } from 'enums'
// import {
//   fetchStreamCatalogueDataRequested,
//   fetchMetadataRequested,
//   setVideoStreamValues,
//   cleanupVideoStreamControls,
// } from 'redux/slices/videoStreamControls'
// import useInterval from 'common/hooks/useInterval'
// import getVideoStreamControlsState from 'selectors/videoStreamControls/getVideoStreamControlsState'
// import getCurrUnixTimestamp from 'utils/dateTime/getCurrUnixTimestamp'
// import {
//   PROGRESS_BAR_WIDTH_INCREMENT,
//   PLAY_POINTER_POSITION_INCREMENT_HRS,
//   PLAY_POINTER_POSITION_INCREMENT_MINS,
//   SECONDS_IN_DAY,
// } from 'components/VideoStreamControls/constants'
// import { useParams } from 'react-router-dom'
//
// // NOTE: FUTURE will want another hook specifically for v4 video player, which won't have to useinterval and a lot of these state variables
// //
// const useVideoStreamControlState = ({
//   siteSlug,
//   videoStreamKey,
//   streamId,
//   nodeId,
// }) => {
//   const dispatch = useDispatch()
//
//   const { account } = useParams()
//
//   const streams = useSelector(state => state.webrtc.streams)
//   const videoStreamTS = useSelector(
//     getVideoStreamControlsState({ videoStreamKey, property: 'videoStreamTS' }),
//   )
//   const playPointerPosition = useSelector(
//     getVideoStreamControlsState({
//       videoStreamKey,
//       property: 'playPointerPosition',
//     }),
//   )
//   const isZoomIn = useSelector(
//     getVideoStreamControlsState({
//       videoStreamKey,
//       property: 'isZoomIn',
//     }),
//   )
//
//   const startTimelineTS = useSelector(
//     getVideoStreamControlsState({
//       videoStreamKey,
//       property: 'startTimelineTS',
//     }),
//   )
//
//   const subtractDays = useSelector(
//     getVideoStreamControlsState({
//       videoStreamKey,
//       property: 'subtractDays',
//       defaultValue: 0,
//     }),
//   )
//
//   const selectedEntities = useSelector(
//     getVideoStreamControlsState({
//       videoStreamKey,
//       property: 'selectedEntities',
//     }),
//   )
//
//   const ready = useSelector(
//     getVideoStreamControlsState({ videoStreamKey, property: 'ready' }),
//   )
//
//   const timelineWidth = useSelector(
//     getVideoStreamControlsState({ videoStreamKey, property: 'timelineWidth' }),
//   )
//
//   const streamData = streams ? streams[videoStreamKey] : null
//   const streamState = streamData ? streamData.status : null
//   const streamMode = streamData ? streamData.mode : null
//
//   const [datePickerSelection] = useState(getCurrUnixTimestamp())
//   const [progressBarWidth, setProgressBarWidth] = useState(100)
//
//   const startDate = new Date()
//   startDate.setHours(0, 0, 0, 0)
//
//   useInterval(() => {
//     const positionIncrement = isZoomIn
//       ? PLAY_POINTER_POSITION_INCREMENT_MINS
//       : PLAY_POINTER_POSITION_INCREMENT_HRS
//     if (streamState === StreamStateEnum.PLAYING) {
//       if (streamMode === StreamTypeUpdatedEnum.RECORDED) {
//         const props = {
//           videoStreamTS: videoStreamTS + 1,
//           playPointerPosition: playPointerPosition + positionIncrement,
//         }
//         if (subtractDays === 0) {
//           props.timelineWidth = timelineWidth + positionIncrement
//         }
//         dispatch(
//           setVideoStreamValues({
//             videoStreamKey,
//             props,
//           }),
//         )
//         setProgressBarWidth(progressBarWidth + PROGRESS_BAR_WIDTH_INCREMENT)
//       } else {
//         dispatch(
//           setVideoStreamValues({
//             videoStreamKey,
//             props: {
//               videoStreamTS: getCurrUnixTimestamp(),
//               playPointerPosition: playPointerPosition + positionIncrement,
//               endTimelineTS: getCurrUnixTimestamp(),
//               timelineWidth: timelineWidth + positionIncrement,
//             },
//           }),
//         )
//       }
//     }
//   }, 1000)
//
//   const isCurrentDay = useCallback(() => {
//     return getCurrUnixTimestamp() - datePickerSelection < 3600 * 24
//   }, [datePickerSelection])
//
//   useEffect(() => {
//     // Create model based on selections
//     const getMetadata = (startDateInput, endDate, callback) => {
//       const queryString = selectedEntities.map(el => {
//         return `${el.type}_${el.label}`
//       })
//
//       dispatch(
//         fetchMetadataRequested({
//           accountSlug: account,
//           siteSlug,
//           streamId,
//           startTs: startDateInput,
//           endTs: endDate,
//           videoStreamKey,
//           queryString,
//         }),
//       )
//     }
//     if (selectedEntities && selectedEntities.length > 0) {
//       getMetadata(startTimelineTS, startTimelineTS + SECONDS_IN_DAY, () => {})
//     }
//
//     return function cleanup() {
//       cleanupVideoStreamControls({
//         videoStreamKey,
//       })
//     }
//   }, [
//     selectedEntities,
//     account,
//     dispatch,
//     siteSlug,
//     startTimelineTS,
//     streamId,
//     videoStreamKey,
//   ])
//
//   useEffect(() => {
//     if (streamMode && streamState) {
//       const curr = new Date()
//       curr.setHours(0, 0, 0, 0)
//
//       const startTs =
//         Math.round(curr.getTime() / 1000) - 3600 * 24 * subtractDays
//       const endTs = isCurrentDay
//         ? getCurrUnixTimestamp()
//         : startTs + 3600 * 24 - 1
//
//       dispatch(
//         fetchStreamCatalogueDataRequested({
//           videoStreamKey,
//           accountSlug: account,
//           siteSlug,
//           streamId,
//           startTs,
//           endTs,
//           isInitial: true,
//         }),
//       )
//     }
//   }, [
//     streamMode,
//     streamState,
//     subtractDays,
//     account,
//     dispatch,
//     isCurrentDay,
//     siteSlug,
//     streamId,
//     videoStreamKey,
//   ])
//
//   return {
//     ready,
//   }
// }
//
// export default useVideoStreamControlState
