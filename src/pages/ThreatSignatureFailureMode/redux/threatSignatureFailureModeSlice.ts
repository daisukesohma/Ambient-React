/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice } from '@reduxjs/toolkit'
import getUnixTime from 'date-fns/getUnixTime'
import subDays from 'date-fns/subDays'

interface FailureMode {
  id: number
  name: string
  threatSignatures: {
    id: number
    name: string
  }[]
  validThreatSignatures: {
    id: number
    name: string
  }[]
}

interface ThreatSignature {
  id: number
  name: string
  validFailureModes: {
    id: number
  }
  performanceMetrics: {
    dismissedRatio: number
    numPositive: number
    numNegative: number
  }
}

export interface ThreatSignatureFailureModeSliceProps {
  threatSignatureFailureMode: {
    threatSignature: number
    threatSignatures: ThreatSignature[]
    threatSignaturesLoading: boolean
    failureModes: FailureMode[]
    failureModesLoading: boolean
    editFailureModesLoading: boolean
    tsStart: number
    tsEnd: number
  }
}

const threatSignatureFailureModeSlice = createSlice({
  name: 'threatSignatureFailureMode',
  initialState: {
    threatSignature: null,
    threatSignatures: [],
    threatSignaturesLoading: false,
    failureModes: [],
    failureModesLoading: false,
    editFailureModesLoading: false,
    tsStart: getUnixTime(subDays(new Date(), 7)),
    tsEnd: getUnixTime(new Date()),
  },

  reducers: {
    fetchFailureModesRequested: state => {
      state.failureModesLoading = true
    },
    fetchFailureModesSucceeded: (state, action) => {
      state.failureModesLoading = false
      state.failureModes = action.payload.failureModes
    },
    fetchFailureModesFailed: (state, action) => {
      state.failureModesLoading = false
    },
    fetchThreatSignaturesRequested: (state, action) => {
      state.threatSignaturesLoading = true
    },
    fetchThreatSignaturesSucceeded: (state, action) => {
      state.threatSignaturesLoading = false
      state.threatSignatures = action.payload.allThreatSignatures
    },
    fetchThreatSignaturesFailed: (state, action) => {
      state.threatSignaturesLoading = false
    },

    addFailureModeRequested: (state, action) => {
      state.editFailureModesLoading = true
    },
    addFailureModeSucceeded: (state, action) => {
      state.editFailureModesLoading = false
    },
    addFailureModeFailed: (state, action) => {
      state.editFailureModesLoading = false
    },

    deleteFailureModeRequested: (state, action) => {
      state.editFailureModesLoading = true
    },
    deleteFailureModeSucceeded: (state, action) => {
      state.editFailureModesLoading = false
    },
    deleteFailureModeFailed: (state, action) => {
      state.editFailureModesLoading = false
    },

    setSelectedThreatSignature: (state, action) => {
      if (state.threatSignature === action.payload) state.threatSignature = null
      else state.threatSignature = action.payload
    },

    setDates: (state, action) => {
      state.tsStart = action.payload.tsStart
      state.tsEnd = action.payload.tsEnd
    },
  },
})

export const {
  fetchFailureModesRequested,
  fetchFailureModesSucceeded,
  fetchFailureModesFailed,

  fetchThreatSignaturesRequested,
  fetchThreatSignaturesSucceeded,
  fetchThreatSignaturesFailed,

  addFailureModeRequested,
  addFailureModeSucceeded,
  addFailureModeFailed,

  deleteFailureModeRequested,
  deleteFailureModeSucceeded,
  deleteFailureModeFailed,

  setSelectedThreatSignature,
  setDates,
} = threatSignatureFailureModeSlice.actions

export default threatSignatureFailureModeSlice.reducer
