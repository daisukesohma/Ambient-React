import { useEffect } from 'react'
import get from 'lodash/get'
import { useSelector, useDispatch } from 'react-redux'
// src
import { NodeRequestTypeEnum, SuggestionSearchTypeEnum } from 'enums'
import useForensicData from 'pages/Forensics/hooks/useForensicData'
import { fetchReIdVectorsRequested } from 'redux/slices/reId'
import { nodeCreateV2Requested } from 'redux/slices/appliances'
import { setSearchQuery } from 'redux/forensics/actions'

const useReIdData = () => {
  const dispatch = useDispatch()
  const data = useSelector(state => state.reId.snapshotData)
  const modalData = useSelector(state => get(state, 'modal.data'))
  const queryTs = useSelector(state => get(state, `reId.queryTs`))
  const selectedIndex = useSelector(state => state.reId.selectedIndex)
  const [fetchRegionStats, fetchEntities] = useForensicData()

  const searchForensics = overrideSelectedIndex => {
    const dataIndex = overrideSelectedIndex || selectedIndex
    const selectedData = data[dataIndex]

    if (selectedData) {
      const searchParams = {
        searchType: SuggestionSearchTypeEnum.REID,
        reidQueryEntityId: selectedData.entityId,
        reidQueryTsMs: selectedData.tsMs,
        reidQueryStreamId: selectedData.streamId,
      }
      dispatch(setSearchQuery(searchParams))
      fetchRegionStats({ query: searchParams })
      fetchEntities({ query: searchParams })
    }
  }

  // retrieves vectors based on stream and start time and lookback
  // endpoint uses lookback behind and forward from start time to find vectors
  //
  const fetchVectors = () => {
    const DELTA_SECS = 20

    dispatch(
      fetchReIdVectorsRequested({
        startTs: queryTs,
        streamId:
          get(modalData, 'streamId') || get(modalData, 'alertEvent.stream.id'),
        deltaSecs: DELTA_SECS,
      }),
    )
  }

  // sends request to Appliance to create a snapshot
  //
  const requestSnapshots = vectorData => {
    if (modalData) {
      const request = {
        stream_id: vectorData.streamId,
        timestamp_ms: Number(vectorData.tsMs),
        bbox: vectorData.bbox,
        entity_id: vectorData.entityId,
      }

      dispatch(
        nodeCreateV2Requested({
          nodeIdentifier: get(modalData, 'nodeId'),
          requestJson: JSON.stringify(request),
          requestType: NodeRequestTypeEnum.EXTRACT_CROP,
        }),
      )
    }
  }

  // search when modal data and ts is set
  useEffect(() => {
    if (modalData && queryTs) {
      fetchVectors()
    }
  }, [modalData, queryTs]) //eslint-disable-line

  return {
    fetchVectors,
    requestSnapshots,
    searchForensics,
  }
}

export default useReIdData
