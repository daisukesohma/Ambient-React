/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  open: false,
  data: null,
  type: null,
}

const slice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    hideModal: () => initialState,
    showModal: (state, action) => {
      state.open = true
      state.data = action.payload.content
      state.type = action.payload.type
    },
    confirm: state => {
      state.open = false
      state.data = { confirmed: true }
      state.type = null
    },
  },
})

export const { showModal, hideModal, confirm } = slice.actions

export default slice.reducer
