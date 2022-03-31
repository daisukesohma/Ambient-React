/* eslint-disable no-case-declarations, no-param-reassign, no-fallthrough */
import { createSlice } from '@reduxjs/toolkit'
import extend from 'lodash/extend'

const videoInitialState = {
  streamId: null,
  ts: null,
  objectType: null,
  objectId: null,
}

const shareLink = createSlice({
  name: 'shareLink',
  initialState: {
    video: videoInitialState,
  },

  reducers: {
    setShareLink: (state, action) => {
      // takes type in case we want to expand this
      const { type, params } = action.payload
      if (type === 'video') {
        extend(state[type], params)
      }
    },
  },
})

export const { setShareLink } = shareLink.actions

export default shareLink.reducer
