/* eslint-disable no-case-declarations, no-param-reassign, no-fallthrough */
import { createSlice } from '@reduxjs/toolkit'

export interface NoFacialRecognitionModalSliceType {
  noFacialRecognitionModal: {
    isOpen: boolean
  }
}

export const initialState = {
  isOpen: false,
}

const slice = createSlice({
  name: 'noFacialRecognitionModal',
  initialState,
  reducers: {
    openModal: state => {
      state.isOpen = true
    },
    closeModal: state => {
      state.isOpen = false
    },
  },
})

export const { closeModal, openModal } = slice.actions

export default slice.reducer
