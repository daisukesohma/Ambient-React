import { useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { isEmpty, each } from 'lodash'
// src
import { setZoneData } from 'features/StreamConfiguration/streamConfigurationSlice'
import shapesFromBitMap from 'features/StreamConfiguration/utils/shapesFromBitMap'

const useZoneData = () => {
  const dispatch = useDispatch()
  const activeStream = useSelector(
    state => state.streamConfiguration.activeStream,
  )
  const zones = useSelector(state => state.streamConfiguration.zones)
  const zoneColors = useMemo(() => {
    const colorsMap = {}
    each(zones, zone => {
      colorsMap[zone.id] = zone.color
    })
    return colorsMap
  }, [zones])

  useEffect(() => {
    if (activeStream && !isEmpty(activeStream.bitMap) && !isEmpty(zoneColors)) {
      const bitmap = shapesFromBitMap(activeStream.bitMap, zoneColors)
      dispatch(setZoneData({ zoneData: bitmap.dataURL() }))
    }
  }, [activeStream, dispatch, zoneColors])
}

export default useZoneData
