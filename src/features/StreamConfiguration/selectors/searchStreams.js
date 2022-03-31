import { createSelector } from '@reduxjs/toolkit'
import { get, filter } from 'lodash'

export default createSelector(
  [
    state => state.streamConfiguration.streams,
    state => state.streamConfiguration.search,
  ],
  (streams, search) =>
    filter(streams, stream =>
      get(stream, 'name', '')
        .toLocaleLowerCase()
        .includes(search.toLocaleLowerCase()),
    ),
)
