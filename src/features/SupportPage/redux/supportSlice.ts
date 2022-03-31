/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  modalOpened: false,
  createTicketLoading: false,
  error: null,
}

const slice = createSlice({
  name: 'support',
  initialState,

  reducers: {
    resetState: () => initialState,

    openModal: state => {
      state.modalOpened = true
    },

    closeModal: state => {
      state.modalOpened = false
    },

    createTicketRequested: (state, action) => {
      state.createTicketLoading = true
    },
    createTicketSucceeded: (state, action) => {
      state.createTicketLoading = false
      state.modalOpened = false
    },
    createTicketFailed: (state, action) => {
      state.createTicketLoading = false
      state.error = action.payload.error
    },
  },
})

export const {
  resetState,

  openModal,
  closeModal,

  createTicketRequested,
  createTicketSucceeded,
  createTicketFailed,

} = slice.actions

export default slice.reducer
