import React, { useState, createRef, useCallback } from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import { useSelector, useDispatch } from 'react-redux'
import clsx from 'clsx'
import moment from 'moment'
// src
import { SuggestionSearchTypeEnum } from 'enums'
import forensicAlternateImagePath from 'assets/logo_icon.png'
import ForensicsCard from 'components/ForensicsCard'
import { fetchFilmstripSnapshotsRequested } from 'redux/slices/videoStreamControls'
import { useCursorStyles } from 'common/styles/commonStyles'
import getVideoStreamControlsState from 'selectors/videoStreamControls/getVideoStreamControlsState'

import useStyles from './styles'
import { msToUnix } from '../../../../../../../../utils'

const propTypes = {
  data: PropTypes.object,
  videoStreamKey: PropTypes.string,
  gotoPlaybackTime: PropTypes.func,
}

function VmsForensicsCardContainer({ data, gotoPlaybackTime, videoStreamKey }) {
  const classes = useStyles()
  const cursorClasses = useCursorStyles()
  const dispatch = useDispatch()

  const snapshots = useSelector(
    getVideoStreamControlsState({ videoStreamKey, property: 'snapshots' }),
  )

  const searchResultsType = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'searchResultsType',
    }),
  )

  const loadingSnapshots = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'loadingSnapshots',
    }),
  )

  const [snapshotToShow, setSnapshotToShow] = useState(data.snapshotUrl)
  const [currentSnapshotTs, setCurrentSnapshotTs] = useState(msToUnix(data.ts))
  const [percentHover, setPercentHover] = useState(0)
  const [didImageError, setDidImageError] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [elem] = useState(createRef())
  const [modalStartTs, setModalStartTs] = useState(msToUnix(data.ts))

  // FUTURE @ERIC To be simplified Everywhere, make a modal hook

  // FUTURE @ERIC detect ellipsis and show tooltip only when ellipsis is active
  // https://stackoverflow.com/questions/7738117/html-text-overflow-ellipsis-detection/10017343#10017343
  //  function isEllipsisActive(e) {
  //      return (e.offsetWidth < e.scrollWidth);
  // }
  //
  const handleImgError = useCallback(e => {
    e.target.src = forensicAlternateImagePath
    e.target.style.width = 24
    e.target.style.opacity = 0.3
    setDidImageError(true)
  }, [])

  const getPercentMouseHover = useCallback(
    e => {
      const mouseX = e.pageX
      const currElem = elem.current
      const offsetLeft = Math.floor(currElem.getBoundingClientRect().x)
      const elemWidth = Math.floor(currElem.clientWidth)
      const percent = (mouseX - offsetLeft) / elemWidth
      setPercentHover(Math.floor(percent * 100))
      return percent
    },
    [elem],
  )

  const handleMouseHover = useCallback(
    e => {
      const stream = get(data, 'stream')
      const streamId = get(stream, 'id')
      const startTs = msToUnix(data.ts)

      // The Fetch time is exactly on the found timestamp. This fetches 30 seconds before the incident timeout
      // to see a little before the event.
      // Since the snapshots are 20 3-second snapshots for the course of 1 minute, this makes the image snapshot shown
      // middle image and gives 30 seconds before and 30 seconds after to hover over and view.
      //
      let timeBeforeSnapshotToFetch = 0 // searchResultsType === SuggestionSearchTypeEnum.ENTITY
      if (
        searchResultsType === SuggestionSearchTypeEnum.THREAT_SIGNATURE ||
        searchResultsType === SuggestionSearchTypeEnum.ACCESS_ALARM ||
        searchResultsType === SuggestionSearchTypeEnum.REID
      ) {
        timeBeforeSnapshotToFetch = 30
      }

      getPercentMouseHover(e)

      dispatch(
        fetchFilmstripSnapshotsRequested({
          videoStreamKey,
          streamId,
          startTs: startTs - timeBeforeSnapshotToFetch,
        }),
      )
      setIsHovering(true)
      setDidImageError(false)
    },
    [data, dispatch, getPercentMouseHover, searchResultsType, videoStreamKey],
  )

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false)
    setDidImageError(false)
  }, [])

  const handleMouseMove = useCallback(
    e => {
      if (!loadingSnapshots) {
        const percent = getPercentMouseHover(e)

        const index = Math.floor((snapshots.length - 1) * percent)

        if (index > -1 && index < snapshots.length) {
          const currentSnapshot = snapshots[index]
          setSnapshotToShow(currentSnapshot.snapshotUrl)
          if (snapshotToShow != null) {
            const _currentSnapshotTs = msToUnix(currentSnapshot.snapshotTs)
            setCurrentSnapshotTs(_currentSnapshotTs)
            setModalStartTs(_currentSnapshotTs)
          } else {
            setSnapshotToShow(data.snapshotUrl)
            setModalStartTs(data.ts)
            setCurrentSnapshotTs(data.ts / 1000)
          }
        }
        setDidImageError(false)
      }
    },
    [data, getPercentMouseHover, loadingSnapshots, snapshotToShow, snapshots],
  )

  const handleStreamClick = (regionId, streamId) => {}

  return (
    <div className={clsx(classes.streamContainer, cursorClasses.pointer)}>
      <ForensicsCard
        showTitles={false}
        data={data}
        nameClasses={classes.cardName}
        onClickName={() =>
          handleStreamClick(data.stream.region.id, data.stream.id)
        }
        name={data.stream.name}
        onClickSubtitle={() => {}}
        snapshotRef={elem}
        onMouseEnterSnapshot={handleMouseHover}
        onMouseLeaveSnapshot={handleMouseLeave}
        onMouseMoveSnapshot={handleMouseMove}
        isHovering={isHovering}
        percentHover={percentHover}
        snapshotToShow={snapshotToShow}
        didImageError={didImageError}
        handleImgError={handleImgError}
        currentSnapshotTs={currentSnapshotTs}
        modalStartTs={modalStartTs}
        onClickSnapshot={() => {
          gotoPlaybackTime(moment.unix(currentSnapshotTs).toDate())
        }}
      />
    </div>
  )
}

VmsForensicsCardContainer.propTypes = propTypes
export default VmsForensicsCardContainer
