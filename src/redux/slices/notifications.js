/* eslint-disable no-case-declarations, no-param-reassign, no-fallthrough */
import { createSlice } from '@reduxjs/toolkit'
import get from 'lodash/get'

export const NOTIFICATION_TYPES = {
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
  SUCCESS: 'success',
}

const initialState = {
  duration: 6000,
  isVisible: false,
  message: null,
  action: null,
  type: NOTIFICATION_TYPES.INFO,
}

const slice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    removeNotification: state => {
      state.isVisible = false
    },
    createNotification: (state, action) => {
      state.isVisible = true
      state.duration = get(action.payload, 'duration', initialState.duration)
      state.message = get(action.payload, 'message', initialState.message)
      state.action = get(action.payload, 'action', initialState.action)
      state.type = get(action.payload, 'type', initialState.type)
    },
  },
})

export const { createNotification, removeNotification } = slice.actions

export default slice.reducer
