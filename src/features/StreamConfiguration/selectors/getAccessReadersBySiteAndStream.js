import { createSelector } from '@reduxjs/toolkit'
import { get, map, filter } from 'lodash'

export default createSelector(
  [
    state => state.streamConfiguration.activeStream,
    state => state.streamConfiguration.accessReadersForActiveSite,
    state => state.streamConfiguration.accessReaderSearch,
  ],
  (activeStream, readers, search) => {
    const filteredReaders = filter(readers, reader =>
      get(reader, 'deviceId', '')
        .toLocaleLowerCase()
        .includes(search.toLocaleLowerCase()),
    )
    return map(filteredReaders, reader => ({
      ...reader,
      isOnActiveStream: get(reader, 'stream.id') === get(activeStream, 'id'),
    }))
  },
)
