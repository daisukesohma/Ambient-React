import React, { useState, createRef } from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import { useSelector, useDispatch } from 'react-redux'
import clsx from 'clsx'
// src
import { SuggestionSearchTypeEnum } from 'enums'
import forensicAlternateImagePath from 'assets/logo_icon.png'
import ForensicsCard from 'components/ForensicsCard'
import {
  setActiveStream,
  setHoveredStream,
  snapshotsFetchRequested,
} from 'redux/forensics/actions'
import { useCursorStyles } from 'common/styles/commonStyles'

import useRegionSelection from '../ForensicsGraph/components/RegionNodeContainer/hooks/useRegionSelection'
import useForensicData from '../../hooks/useForensicData'

import useStyles from './styles'
import { msToUnix } from '../../../../utils'

const propTypes = {
  data: PropTypes.object,
}

function ForensicsCardContainer({ data }) {
  const classes = useStyles()
  const cursorClasses = useCursorStyles()
  const dispatch = useDispatch()
  const snapshots = useSelector(state => state.forensics.snapshots)
  const searchResultsType = useSelector(
    state => state.forensics.searchResultsType,
  )
  const loadingSnapshots = useSelector(
    state => state.forensics.loadingSnapshots,
  )
  const [snapshotToShow, setSnapshotToShow] = useState(data.snapshotUrl)
  const [currentSnapshotTs, setCurrentSnapshotTs] = useState(msToUnix(data.ts))
  const [percentHover, setPercentHover] = useState(0)
  const [didImageError, setDidImageError] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [elem] = useState(createRef())
  const [modalStartTs, setModalStartTs] = useState(msToUnix(data.ts))
  const { setSelectedRegion, getActiveRegions } = useRegionSelection()
  const [fetchRegionStats, fetchEntities] = useForensicData() //eslint-disable-line

  // FUTURE @ERIC detect ellipsis and show tooltip only when ellipsis is active
  // https://stackoverflow.com/questions/7738117/html-text-overflow-ellipsis-detection/10017343#10017343
  //  function isEllipsisActive(e) {
  //      return (e.offsetWidth < e.scrollWidth);
  // }
  //
  const handleImgError = e => {
    e.target.src = forensicAlternateImagePath
    e.target.style.width = 24
    e.target.style.opacity = 0.3
    setDidImageError(true)
  }

  const getPercentMouseHover = e => {
    const mouseX = e.pageX
    const currElem = elem.current
    const offsetLeft = Math.floor(currElem.getBoundingClientRect().x)
    const elemWidth = Math.floor(currElem.clientWidth)
    const percent = (mouseX - offsetLeft) / elemWidth
    setPercentHover(Math.floor(percent * 100))

    return percent
  }

  const handleMouseHover = e => {
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
    // NB: For Forensics mockData, we use negative streamIds to load hardcoded / mocked
    // snapshots.
    dispatch(
      snapshotsFetchRequested({
        streamId,
        startTs:
          streamId < 0 ? data.mockTs : startTs - timeBeforeSnapshotToFetch,
      }),
    )
    setIsHovering(true)
    setDidImageError(false)
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
    setDidImageError(false)
  }

  const handleMouseMove = e => {
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
  }

  const onStreamClick = (regionId, streamId) => {
    if (streamId) {
      dispatch(setActiveStream({ regionId, streamId }))
    }
  }

  const handleStreamClick = (regionId, streamId) => {
    fetchEntities({ regionIds: getActiveRegions(regionId) })
    setSelectedRegion(regionId)
    onStreamClick(regionId, streamId)
  }

  // <Tooltip content={data.stream.name} placement='bottom'></Tooltip>
  return (
    <div className={clsx(classes.streamContainer, cursorClasses.pointer)}>
      <ForensicsCard
        data={data}
        onMouseEnterName={() => dispatch(setHoveredStream(data.stream.id))}
        onMouseLeaveName={() => dispatch(setHoveredStream(null))}
        onClickName={() =>
          handleStreamClick(data.stream.region.id, data.stream.id)
        }
        name={data.stream.name}
        onClickSubtitle={() => {
          fetchEntities({
            regionIds: getActiveRegions(get(data, 'stream.region.id')),
          })
          setSelectedRegion(get(data, 'stream.region.id'))
        }}
        snapshotRef={elem}
        onMouseEnterSnapshot={handleMouseHover}
        onMouseLeaveSnapshot={handleMouseLeave}
        onMouseMoveSnapshot={handleMouseMove}
        isHovering={isHovering}
        percentHover={percentHover}
        snapshotToShow={snapshotToShow}
        didImageError={didImageError}
        setDidImageError={setDidImageError}
        handleImgError={handleImgError}
        currentSnapshotTs={currentSnapshotTs}
        modalStartTs={modalStartTs}
      />
    </div>
  )
}

ForensicsCardContainer.propTypes = propTypes
export default ForensicsCardContainer
