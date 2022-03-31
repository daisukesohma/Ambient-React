import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'

import {
  streamDiscoveryFetchRequested,
  setIsSelectorDirty,
  collapseIp,
} from '../../redux/streamDiscovery/actions'
import { getAccountSlug } from 'utils'

import StreamDiscoverySelectorContainer from './StreamDiscoverySelectorContainer'

export default function StreamDiscoverySelector() {
  const dispatch = useDispatch()
  const { job } = useParams()

  const resetSelector = () => {
    dispatch(collapseIp())
    dispatch(setIsSelectorDirty(false))
  }

  useEffect(() => {
    return function cleanup() {
      resetSelector()
    }
  })

  useEffect(() => {
    dispatch(
      streamDiscoveryFetchRequested({
        nodeRequestId: Number(job),
        accountSlug: getAccountSlug(),
      }),
    )
  }, [dispatch, job])

  return <StreamDiscoverySelectorContainer />
}
