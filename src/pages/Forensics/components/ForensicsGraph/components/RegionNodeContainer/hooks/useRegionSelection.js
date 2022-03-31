import { useSelector, useDispatch } from 'react-redux'
import { toggleFromArraySingle } from 'utils/toggleFromArraySingleMulti'
import {
  clearSelectedRegion,
  regionsToggleActive,
  selectRegion,
  setActiveRegions,
} from 'redux/forensics/actions'

function useRegionSelection() {
  const dispatch = useDispatch()
  const activeRegions = useSelector(state => state.forensics.activeRegions)
  const regionStats = useSelector(state => state.forensics.regionStats)
  const selectedRegion = useSelector(state => state.forensics.selectedRegion)

  const getActiveRegions = id => {
    return toggleFromArraySingle(
      activeRegions,
      id,
      regionStats.map(st => st.regionPk),
    )
  }

  // toggle is mainly used for graph
  const toggleSelectedRegion = regionId => {
    dispatch(regionsToggleActive(regionId))

    // if selected, when clicked again, clear it.
    if (selectedRegion && regionId === selectedRegion.id) {
      dispatch(clearSelectedRegion())
    } else {
      setSelectedRegion(regionId)
    }
  }

  // set is used for search result card, where we don't want to toggle, but hard set it
  const setSelectedRegion = regionId => {
    dispatch(setActiveRegions([regionId]))
    dispatch(selectRegion(regionId))
  }

  return {
    getActiveRegions,
    toggleSelectedRegion,
    setSelectedRegion,
  }
}

export default useRegionSelection
