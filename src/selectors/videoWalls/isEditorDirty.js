import { createSelector } from '@reduxjs/toolkit'
import find from 'lodash/find'
import isEqual from 'lodash/isEqual'
import isEmpty from 'lodash/isEmpty'

export default ({ isEdit }) =>
  createSelector(
    [
      state => state.videoWallToolbar.videoWalls,
      state => state.videoWall.activeVideoWall,
      state => state.videoWallPlayer.isPlayed,
    ],
    (collection, activeVideoWall, isPlayed) => {
      if (isEmpty(activeVideoWall) || !isEdit || isPlayed) return false
      const origin = find(collection, { id: activeVideoWall.id })
      return !isEqual(origin, activeVideoWall)
    },
  )
