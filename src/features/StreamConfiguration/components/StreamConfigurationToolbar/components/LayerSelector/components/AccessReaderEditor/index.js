import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { get, isEmpty } from 'lodash'
import {
  fetchAccessReadersForSiteRequested,
  fetchAccessReadersForStreamRequested,
  setIsAccessReaderModalOpen,
} from 'features/StreamConfiguration/streamConfigurationSlice'
import EmptyAccessReader from './components/EmptyAccessReader'
import AddAccessReaderModal from './components/AddAccessReaderModal'
import AttachedAccessReaders from './components/AttachedAccessReaders'
// Query.accessReadersForEntityConfig
// Mutation.updateAccessReader

export default function AccessReaderEditor() {
  const dispatch = useDispatch()
  const activeSite = useSelector(
    state => state.streamConfiguration.activeSiteId,
  )
  const activeStream = useSelector(
    state => state.streamConfiguration.activeStream,
  )
  const accessReadersOnStream = useSelector(
    state => state.streamConfiguration.accessReadersOnStream,
  )
  const isAccessReaderModalOpen = useSelector(
    state => state.streamConfiguration.isAccessReaderModalOpen,
  )
  useEffect(() => {
    if (activeSite) {
      dispatch(fetchAccessReadersForSiteRequested({ siteId: activeSite }))
    }
  }, [activeSite])

  useEffect(() => {
    if (get(activeStream, 'id')) {
      dispatch(
        fetchAccessReadersForStreamRequested({ streamId: activeStream.id }),
      )
    }
  }, [activeStream])

  return (
    <div>
      {isEmpty(accessReadersOnStream) && <EmptyAccessReader />}
      <AttachedAccessReaders />
      <AddAccessReaderModal
        open={isAccessReaderModalOpen}
        handleClose={() => dispatch(setIsAccessReaderModalOpen(false))}
      />
    </div>
  )
}
