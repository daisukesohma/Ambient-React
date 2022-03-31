/* eslint-disable no-case-declarations, no-param-reassign, no-fallthrough */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice } from '@reduxjs/toolkit'

export interface AlertSnackbarSliceProps {
  alertSnackbar: {
    message: string | null
    snackbarOpen: boolean
    threatSignaturePausePeriodId: number | null
  }
}

const initialState = {
  message: null,
  snackbarOpen: false,
  threatSignaturePausePeriodId: null,
}

const slice = createSlice({
  name: 'alertSnackbar',
  initialState,
  reducers: {
    setMessage: (state, action) => {
      state.message = action.payload.message
    },
    openAlertSnackbar: (state, action) => {
      state.snackbarOpen = true
      const { message, threatSignaturePausePeriodId } = action.payload
      state.message = message
      state.threatSignaturePausePeriodId = threatSignaturePausePeriodId
    },
    closeAlertSnackbar: state => {
      state.snackbarOpen = false
      state.message = null
      state.threatSignaturePausePeriodId = null
    },
  },
})

export const {
  setMessage,
  openAlertSnackbar,
  closeAlertSnackbar,
} = slice.actions

export default slice.reducer
