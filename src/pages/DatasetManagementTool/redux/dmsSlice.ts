/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice } from '@reduxjs/toolkit'

export interface DatapointType {
  id: number
  dataFile: string
  dataType: string
  annotation: string
  annotationType: string
  dataSourcePrimary: string
  dataSourceSecondary: string
  streamId: number
  timestampCreated: string
  timezone: string
  timestampIndexed: string
  timestampUpdated: string
  presignedDataUrl: string
}

export interface DatasetType {
  id: number
  datasetName: string
  dataType: string
  annotationType: string
  infoUrl: string
  timestampCreated: string
  timestampUpdated: string
}

export interface DatasplitType {
  id: number
  datasplitName: string
  dataType: string
  annotationType: string
  infoUrl: string
  timestampCreated: string
  timestampUpdated: string
}

export interface DMSProps {
  dms: {
    loading: boolean
    imageLoading: boolean
    token: string
    page: number
    pages: number
    pageSize: number
    datasets: DatasetType[]
    datasetPointCount: number
    datasplits: DatasplitType[]
    datasplitCount: number
    allDatasplitCount: number
    datapoints: DatapointType[]
    datapointCount: number
    allDatapointCount: number
    selectedDataset: null
    selectedDatasplit: null
    selectedDatapoint: null
    modalOpen: boolean
  }
}

const initialState = {
  loading: false,
  imageLoading: false,
  token: '',
  page: 0,
  pages: 1,
  pageSize: 100,
  datasets: [],
  datasetPointCount: 0,
  datasplits: [],
  allDatasplitCount: 0,
  datasplitCount: 0,
  datapoints: [],
  allDatapointCount: 0,
  datapointCount: 0,
  selectedDataset: null,
  selectedDatasplit: null,
  selectedDatapoint: null,
  modalOpen: false,
}

const dmsSlice = createSlice({
  name: 'dms',
  initialState,
  reducers: {
    updateLoginRequested: (state, action) => {
      state.loading = true
    },
    updateLoginSucceeded: (state, action) => {
      state.loading = false
      state.token = action.payload.login.token
    },
    updateLoginFailed: (state, action) => {
      state.loading = false
    },

    getAllDatasetsRequested: (state, action) => {
      state.loading = true
    },
    getAllDatasetsSucceeded: (state, action) => {
      state.loading = false
      state.datasets = action.payload.allDatasets.datasets
    },
    getAllDatasetsFailed: (state, action) => {
      state.loading = false
    },

    getAllDatasplitsRequested: (state, action) => {
      state.loading = true
    },
    getAllDatasplitsSucceeded: (state, action) => {
      state.loading = false
      state.selectedDataset = null
      state.datasplits = action.payload.allDatasplits.datasplits
      state.datasplitCount = action.payload.allDatasplits.count
      state.allDatasplitCount = action.payload.allDatasplits.count
    },
    getAllDatasplitsFailed: (state, action) => {
      state.loading = false
    },

    getAllDatapointsRequested: (state, action) => {
      state.imageLoading = true
    },
    getAllDatapointsSucceeded: (state, action) => {
      state.imageLoading = false
      state.datapoints = action.payload.allDatapoints.datapoints
      state.allDatapointCount = action.payload.allDatapoints.count
      state.datapointCount = action.payload.allDatapoints.count
      state.page = action.payload.allDatapoints.page - 1
      state.pages = action.payload.allDatapoints.pages
    },
    getAllDatapointsFailed: (state, action) => {
      state.imageLoading = false
    },

    getDatasetRequested: (state, action) => {
      state.loading = true
    },
    getDatasetSucceeded: (state, action) => {
      state.loading = false
      state.selectedDataset = action.payload.selectedDataset
      state.datasplits = action.payload.datasplits
    },
    getDatasetFailed: (state, action) => {
      state.loading = false
    },

    getDatasplitRequested: (state, action) => {
      state.loading = true
    },
    getDatasplitSucceeded: (state, action) => {
      state.loading = false
      state.selectedDatasplit = action.payload.selectedDatasplit
      state.datapoints = action.payload.datapoints
    },
    getDatasplitFailed: (state, action) => {
      state.loading = false
    },

    getDatapointRequested: (state, action) => {
      state.imageLoading = true
    },
    getDatapointSucceeded: (state, action) => {
      state.imageLoading = false
      state.selectedDatapoint = action.payload.selectedDatapoint
    },
    getDatapointFailed: (state, action) => {
      state.imageLoading = false
    },

    getDatapointsByDatasetRequested: (state, action) => {
      state.imageLoading = true
    },
    getDatapointsByDatasetSucceeded: (state, action) => {
      state.imageLoading = false
      state.datapoints = action.payload.datapointsByDataset.datapoints
      state.selectedDatasplit = null
      state.datasetPointCount = action.payload.datapointsByDataset.count
      state.datapointCount = action.payload.datapointsByDataset.count
      state.page = action.payload.datapointsByDataset.page - 1
      state.pages = action.payload.datapointsByDataset.pages
    },
    getDatapointsByDatasetFailed: (state, action) => {
      state.imageLoading = false
    },

    getDatapointCountByDatasetRequested: (state, action) => {
      state.loading = true
    },
    getDatapointCountByDatasetSucceeded: (state, action) => {
      state.loading = false
      state.datasetPointCount = action.payload.datapointsByDataset.count
    },
    getDatapointCountByDatasetFailed: (state, action) => {
      state.loading = false
    },

    getDatasplitsByDatasetRequested: (state, action) => {
      state.loading = true
      state.selectedDataset = action.payload.name
    },
    getDatasplitsByDatasetSucceeded: (state, action) => {
      state.loading = false
      state.datasplits = action.payload.datasplitsByDataset.datasplits
      state.datasplitCount = action.payload.datasplitsByDataset.count
    },
    getDatasplitsByDatasetFailed: (state, action) => {
      state.loading = false
    },

    getDatapointsByDatasplitRequested: (state, action) => {
      state.imageLoading = true
      state.selectedDatasplit = action.payload.name
    },
    getDatapointsByDatasplitSucceeded: (state, action) => {
      state.imageLoading = false
      state.datapoints = action.payload.datapointsByDatasplit.datapoints
      state.datasplitCount = action.payload.datapointsByDatasplit.count
      state.datapointCount = action.payload.datapointsByDatasplit.count
      state.page = action.payload.datapointsByDatasplit.page - 1
      state.pages = action.payload.datapointsByDatasplit.pages
    },
    getDatapointsByDatasplitFailed: (state, action) => {
      state.imageLoading = false
    },

    selectSet: (state, action) => {
      state.selectedDataset = action.payload.value
    },
    selectSplit: (state, action) => {
      state.selectedDatasplit = action.payload.value
    },
    selectPoint: (state, action) => {
      state.selectedDatapoint = action.payload.value
    },

    modalToggle: state => {
      state.modalOpen = !state.modalOpen
    },
  },
})

export const {
  updateLoginRequested,
  updateLoginSucceeded,
  updateLoginFailed,

  getAllDatasetsRequested,
  getAllDatasetsSucceeded,
  getAllDatasetsFailed,

  getAllDatasplitsRequested,
  getAllDatasplitsSucceeded,
  getAllDatasplitsFailed,

  getAllDatapointsRequested,
  getAllDatapointsSucceeded,
  getAllDatapointsFailed,

  getDatasetRequested,
  getDatasetSucceeded,
  getDatasetFailed,

  getDatasplitRequested,
  getDatasplitSucceeded,
  getDatasplitFailed,

  getDatapointRequested,
  getDatapointSucceeded,
  getDatapointFailed,

  getDatasplitsByDatasetRequested,
  getDatasplitsByDatasetSucceeded,
  getDatasplitsByDatasetFailed,

  getDatapointsByDatasplitRequested,
  getDatapointsByDatasplitSucceeded,
  getDatapointsByDatasplitFailed,

  getDatapointsByDatasetRequested,
  getDatapointsByDatasetSucceeded,
  getDatapointsByDatasetFailed,

  getDatapointCountByDatasetRequested,
  getDatapointCountByDatasetSucceeded,
  getDatapointCountByDatasetFailed,

  selectSet,
  selectSplit,
  selectPoint,

  modalToggle,
} = dmsSlice.actions

export default dmsSlice.reducer
