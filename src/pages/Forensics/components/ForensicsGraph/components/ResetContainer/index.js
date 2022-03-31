import React from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch, batch } from 'react-redux'
import { min } from 'lodash'
// src
import {
  setActiveRegions,
  clearSelectedRegion,
  resetSearch,
} from 'redux/forensics/actions'

import { CIRCLE_STEP } from '../../constants'
import useForensicData from '../../../../hooks/useForensicData'

import ResetCenter from './components/ResetCenter'
import ResetOutsideGraph from './components/ResetOutsideGraph'

const propTypes = {
  graphSize: PropTypes.array,
  centerX: PropTypes.number,
  centerY: PropTypes.number,
}

const RESET_BUTTON_X_OFFSET = 102

const ResetContainer = ({ graphSize, centerX, centerY }) => {
  const dispatch = useDispatch()
  const regionStats = useSelector(state => state.forensics.regionStats)
  const [_, fetchEntities] = useForensicData()

  const getAllRegionsIds = () => {
    // Note: getting all region ids here from regionStats is essential, because reducer logic
    // uses this fact to determine that "all are selected" (and changes logic from reductive to additive)
    return regionStats.map(rs => rs.regionPk)
  }

  const handleRegionSwitchAll = () => {
    batch(() => {
      const allRegionIds = getAllRegionsIds()
      dispatch(setActiveRegions(allRegionIds))
      dispatch(clearSelectedRegion())
      fetchEntities({ regionIds: allRegionIds, streamIds: null })
    })
  }

  const handleReset = () => {
    dispatch(resetSearch())
  }

  const resetCenterX = graphSize[1] - RESET_BUTTON_X_OFFSET

  return (
    regionStats.length !== 0 && (
      <>
        <ResetOutsideGraph
          graphSize={graphSize}
          centerX={centerX}
          centerY={centerY}
          r={(min(graphSize) / 2) * (CIRCLE_STEP.REGION + 0.02)}
          handleClick={handleRegionSwitchAll}
        />
        <ResetCenter x={resetCenterX} y={76} handleClick={handleReset} r={32} />
      </>
    )
  )
}

ResetContainer.propTypes = propTypes

export default ResetContainer
