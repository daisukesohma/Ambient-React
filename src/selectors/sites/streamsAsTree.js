import { createSelector } from '@reduxjs/toolkit'
import get from 'lodash/get'
import map from 'lodash/map'
import reduce from 'lodash/reduce'
import find from 'lodash/find'
import filter from 'lodash/filter'

export default createSelector(
  [
    state => get(state, 'site.collection', []),
    state => state.videoWallToolbar.search,
  ],
  (collection, search) => {
    return map(
      filter(collection, site => {
        if (
          get(site, 'name', '')
            .toLocaleLowerCase()
            .includes(search.toLocaleLowerCase())
        ) {
          return true
        }
        // we need to check if site contains streams with the filter text
        const streamFound = find(get(site, 'streams', []), stream =>
          get(stream, 'name', '')
            .toLocaleLowerCase()
            .includes(search.toLocaleLowerCase()),
        )
        return !!streamFound
      }),
      site => {
        let filteredNodes = []

        if (
          get(site, 'name', '')
            .toLocaleLowerCase()
            .includes(search.toLocaleLowerCase())
        ) {
          // site name filtered, so need to show all of the streams
          filteredNodes = filter(get(site, 'streams', []))
        } else {
          // filter only streams with search text
          filteredNodes = filter(get(site, 'streams', []), stream =>
            get(stream, 'name', '')
              .toLocaleLowerCase()
              .includes(search.toLocaleLowerCase()),
          )
        }

        return {
          ...site,
          icon: 'LocationOn',
          isStream: false, // this is to check if we need to add draggable
          children: reduce(
            filteredNodes,
            (acc, stream) => {
              if (stream && stream.active && !stream.incognito) {
                return acc.concat({
                  ...stream,
                  isStream: true,
                  icon: 'Videocam',
                })
              }
              return acc
            },
            [],
          ),
        }
      },
    )
  },
)
