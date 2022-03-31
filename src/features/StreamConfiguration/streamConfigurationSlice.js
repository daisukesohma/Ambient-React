/* eslint-disable no-case-declarations, no-param-reassign, no-fallthrough */
import { createSlice } from '@reduxjs/toolkit'
import { findIndex, get, isNumber, extend } from 'lodash'

import { POINT_ANNOTATION_MODES } from './constants'

export const initialState = {
  createPointAnnotationLoading: false,
  sites: [],
  sitesLoading: false,
  activeSiteId: null,
  accessReadersForActiveSite: [],
  accessReadersOnStream: [],
  isAccessReaderModalOpen: false,
  selectedAccessReaderId: null,
  isStreamSelectionModalOpen: false,
  streams: [],
  streamsLoading: false,
  streamBitmapLoading: false,
  activeStreamSnapshotLoading: false,
  activeStream: null,
  auditLoading: false,
  editingPointAnnotationId: null,
  deletePointAnnotationLoading: false,
  deletingPointAnnotationId: null,
  deletingEntityConfigId: null,
  pointAnnotationMode: POINT_ANNOTATION_MODES.DEFAULT,
  selectedPointAnnotationId: null,
  streamUpdateLoading: false,
  updatePointAnnotationLoading: false,

  regions: [],
  zones: [],
  activeZone: null,
  zonesLoading: false,

  videoWall: null,
  videoWallLoading: false,

  shapes: [], // In 4-point annotation, this is the circles. in BoundingBox, this are the squares
  savingBoundingBox: false,
  deletionBoundingBox: false,
  selectedBoundingBoxEntityId: null,

  deletionEntityConfig: false,

  isHoveringOnAnnotationPoint: false,
  mode: null,
  tool: null,
  brushSize: 30,
  color: '#1881FF',

  search: '',
  accessReaderSearch: '',
  error: null,
  savingStreamNoteLoading: false,
  updatingStreamNoteLoading: false,
  updatingStreamNoteId: null,
  deletingStreamNoteLoading: false,
  deletingStreamNoteId: null,
  updatingStreamProblematicStatus: false,
}

const slice = createSlice({
  name: 'streamConfiguration',
  initialState,
  reducers: {
    createEntityAndPointAnnotationRequested: (state, action) => {
      state.createPointAnnotationLoading = true
    },
    createEntityAndPointAnnotationSucceeded: (state, action) => {
      state.createPointAnnotationLoading = false
    },
    createEntityAndPointAnnotationFailed: (state, action) => {
      state.error = action.payload.error
      state.createPointAnnotationLoading = false
    },
    deletePointAnnotationRequested: (state, action) => {
      state.deletePointAnnotationLoading = true
    },
    deletePointAnnotationSucceeded: (state, action) => {
      state.deletePointAnnotationLoading = false
    },
    deletePointAnnotationFailed: (state, action) => {
      state.error = action.payload.error
      state.deletePointAnnotationLoading = false
    },
    setActiveSiteId: (state, action) => {
      state.activeSiteId = action.payload.activeSiteId
    },
    saveEntityConfigRequested: (state, action) => {
      state.savingBoundingBox = true
    },
    saveEntityConfigSucceeded: (state, action) => {
      state.savingBoundingBox = false
    },
    saveEntityConfigFailed: (state, action) => {
      state.savingBoundingBox = false
      state.error = action.payload.error
    },
    deleteEntityConfigRequested: (state, action) => {
      state.deletionBoundingBox = true
      state.deletionEntityConfig = true
    },
    deleteEntityConfigSucceeded: (state, action) => {
      state.deletionBoundingBox = false
      state.deletionEntityConfig = false
    },
    deleteEntityConfigFailed: (state, action) => {
      state.deletionBoundingBox = false
      state.deletionEntityConfig = false
      state.error = action.payload.error
    },

    resetShapes: (state, action) => {
      state.shapes = []
    },
    fetchSitesRequested: (state, action) => {
      state.sitesLoading = true
    },
    fetchSitesSucceeded: (state, action) => {
      state.sites = action.payload.sites
      state.sitesLoading = false
    },
    fetchSitesFailed: (state, action) => {
      state.error = action.payload.error
      state.sitesLoading = false
    },

    fetchStreamsRequested: (state, action) => {
      state.streamsLoading = true
    },
    fetchStreamsSucceeded: (state, action) => {
      state.streams = action.payload.streams
      state.streamsLoading = false
    },
    fetchStreamsFailed: (state, action) => {
      state.error = action.payload.error
      state.streamsLoading = false
    },

    fetchStreamSnapShotRequested: (state, action) => {
      const { streamId } = action.payload
      const index = findIndex(state.streams, { id: streamId })
      extend(state.streams[index], { snapshotLoading: true })
    },
    fetchStreamSnapShotSucceeded: (state, action) => {
      const { stream } = action.payload
      const index = findIndex(state.streams, { id: stream.id })
      extend(state.streams[index], action.payload.stream, {
        snapshotLoading: false,
      })
    },
    fetchStreamSnapShotFailed: (state, action) => {
      state.error = action.payload.error
    },
    fetchActiveStreamSnapshotRequested: (state, action) => {
      state.activeStreamSnapshotLoading = true
    },
    fetchActiveStreamSnapshotSucceeded: (state, action) => {
      const { snapshot } = action.payload
      state.activeStreamSnapshotLoading = false
      const activeStream = get(state.activeStream, {})
      state.activeStream = extend(activeStream, {
        snapshot,
      })
    },
    fetchStreamZoneBitmapRequested: (state, action) => {
      state.streamBitmapLoading = true
    },
    fetchStreamZoneBitmapSucceeded: (state, action) => {
      const { stream } = action.payload
      state.streamBitmapLoading = false
      const index = findIndex(state.streams, { id: stream.id })
      extend(state.streams[index], stream)
      state.activeStream = extend(state.activeStream, state.streams[index])
      // may want to remove this from here to separate this `details` to just being bitmap
      state.shapes = []
      state.selectedBoundingBoxEntityId = null
      state.tool = null
    },
    fetchStreamZoneBitmapFailed: (state, action) => {
      state.streamBitmapLoading = false
      state.error = action.payload.error
    },

    fetchZonesRequested: (state, action) => {
      state.zonesLoading = true
    },
    fetchZonesSucceeded: (state, action) => {
      state.zones = action.payload.zones
      state.zonesLoading = false
    },
    fetchZonesFailed: (state, action) => {
      state.error = action.payload.error
      state.zonesLoading = false
    },
    fetchRegionsRequested: (state, action) => {
      state.regionsLoading = true
    },
    fetchRegionsSucceeded: (state, action) => {
      state.regions = action.payload.regions
      state.regionsLoading = false
    },
    fetchRegionsFailed: (state, action) => {
      state.error = action.payload.error
      state.regionsLoading = false
    },
    fetchStreamAuditRequested: (state, action) => {
      state.auditLoading = true
      state.shapes = []
      state.tool = null
    },
    fetchStreamAuditSucceeded: (state, action) => {
      state.auditLoading = false
      const { stream } = action.payload
      const index = findIndex(state.streams, { id: stream.id })
      extend(state.streams[index], stream)

      // To get visibilty on and off of the 4 point annotations, will need to add this
      // TODO ESC points.map(p => extend(p, { visible: true })) // map point annotations and extend with { visible: true}

      state.activeStream = extend(state.activeStream, state.streams[index])
    },
    fetchStreamAuditFailed: (state, action) => {
      state.error = action.payload.error
      state.auditLoading = false
    },
    fetchEntityOptionsRequested: (state, action) => {
      state.entityOptionsLoading = true
    },
    fetchEntiyOptionsSucceeded: (state, action) => {
      state.entities = action.payload.getEntities
      state.entityOptionsLoading = false
    },
    fetchEntityOptionsFailed: (state, action) => {
      state.error = action.payload.error
      state.entityOptionsLoading = false
    },
    updateStreamRegionRequested: (state, action) => {
      state.streamRegionLoading = true
    },
    updateStreamRegionSucceeded: (state, action) => {
      const { region } = action.payload
      state.streamRegionLoading = false
      state.activeStream.region = region
    },
    updateStreamRegionFailed: (state, action) => {
      state.streamRegionLoading = false
    },
    updateStreamRequested: (state, action) => {
      state.streamUpdateLoading = true
    },
    updateStreamSucceeded: (state, action) => {
      const { bitMap } = action.payload
      state.streamUpdateLoading = false
      state.activeStream.bitMap = bitMap
      state.shapes = []
    },
    updateStreamFailed: (state, action) => {
      state.streamUpdateLoading = false
    },
    setSearch: (state, action) => {
      state.search = action.payload.search
    },
    setAccessReaderSearch: (state, action) => {
      state.accessReaderSearch = action.payload.search
    },
    setZoneData: (state, action) => {
      state.activeStream.zoneData = action.payload.zoneData
    },
    addShape: (state, action) => {
      state.shapes.push(action.payload.shape)
    },
    removeShape: (state, action) => {
      const { index } = action.payload
      if (!isNumber(index)) return
      const shapeIdx = state.shapes.findIndex(s => s.meta.id === index)

      state.shapes.splice(shapeIdx, 1)
      if (state.selectedBoundingBoxEntityId === index)
        state.selectedBoundingBoxEntityId = null
    },

    setMode: (state, action) => {
      state.mode = action.payload.mode
      state.shapes = []
      state.selectedBoundingBoxEntityId = null
      state.tool = null
    },
    setTool: (state, action) => {
      const { tool } = action.payload
      state.tool = state.tool === tool ? null : tool
    },
    setShapeProps: (state, action) => {
      const { index, props, meta } = action.payload
      extend(state.shapes[index].props, props)
      extend(state.shapes[index].meta, meta)
    },
    setBrushSize: (state, action) => {
      state.brushSize = action.payload.brushSize
    },
    setColor: (state, action) => {
      state.color = action.payload.color
    },
    setActiveZone: (state, action) => {
      state.activeZone = action.payload.zone
    },
    selectShape: (state, action) => {
      state.selectedBoundingBoxEntityId = action.payload.index
    },
    selectAccessReader: (state, action) => {
      state.selectedAccessReaderId = action.payload.id
    },
    selectPointAnnotationId: (state, action) => {
      state.selectedPointAnnotationId = action.payload.id
    },
    // toggleVisibilityOnPointAnnotation: (state, action) => {
    //   const { id } = action.payload
    //   const index = state.allPointAnnotations.findIndex(a => a.id === id)
    //   state.allPointAnnotations[index].visible = !state.allPointAnnotations[
    //     index
    //   ].visible
    // },
    setDeletingEntityConfigId: (state, action) => {
      state.deletingEntityConfigId = action.payload.id
    },
    setEditingPointAnnotationId: (state, action) => {
      state.editingPointAnnotationId = action.payload.id
      if (action.payload.id) {
        state.pointAnnotationMode = POINT_ANNOTATION_MODES.EDIT
      } else {
        state.pointAnnotationMode = POINT_ANNOTATION_MODES.DEFAULT
      }
    },
    setDeletingPointAnnotationId: (state, action) => {
      state.deletingPointAnnotationId = action.payload.id
    },
    setPointAnnotationMode: (state, action) => {
      state.pointAnnotationMode = action.payload.pointAnnotationMode
    },
    setIsHoveringOnAnnotationPoint: (state, action) => {
      state.isHoveringOnAnnotationPoint =
        action.payload.isHoveringOnAnnotationPoint
    },
    setIsStreamSelectionModalOpen: (state, action) => {
      state.isStreamSelectionModalOpen = action.payload
    },
    setIsAccessReaderModalOpen: (state, action) => {
      state.isAccessReaderModalOpen = action.payload
    },
    updatePointAnnotationRequested: (state, action) => {
      state.updatePointAnnotationLoading = true
    },
    updatePointAnnotationSucceeded: (state, action) => {
      state.updatePointAnnotationLoading = false
    },
    updatePointAnnotationFailed: (state, action) => {
      state.updatePointAnnotationLoading = false
    },
    fetchAccessReadersForSiteRequested: (state, action) => {
      // state.accessReadersForActiveSite = action.payload.accessReaders
    },
    fetchAccessReadersForSiteSucceeded: (state, action) => {
      state.accessReadersForActiveSite = action.payload.accessReaders
    },
    fetchAccessReadersForStreamRequested: (state, action) => {},
    fetchAccessReadersForStreamSucceeded: (state, action) => {
      state.accessReadersOnStream = action.payload.accessReaders
    },
    updateAccessReaderRequested: (state, action) => {},
    resetActiveStream: state => {
      state.activeStream = null
      state.mode = null
    },
    createStreamNoteRequested: (state, action) => {
      state.savingStreamNoteLoading = true
    },
    createStreamNoteSucceeded: (state, action) => {
      state.savingStreamNoteLoading = false
    },
    createStreamNoteFailed: (state, action) => {
      state.savingStreamNoteLoading = false
    },
    updateStreamNoteRequested: (state, action) => {
      state.updatingStreamNoteLoading = true
    },
    updateStreamNoteSucceeded: (state, action) => {
      state.updatingStreamNoteLoading = false
    },
    updateStreamNoteFailed: (state, action) => {
      state.updatingStreamNoteLoading = false
    },
    setUpdatingStreamNoteId: (state, action) => {
      state.updatingStreamNoteId = action.payload.id
    },
    deleteStreamNoteRequested: (state, action) => {
      state.deletingStreamNoteLoading = true
    },
    deleteStreamNoteSucceeded: (state, action) => {
      state.deletingStreamNoteLoading = false
    },
    deleteStreamNoteFailed: (state, action) => {
      state.deletingStreamNoteLoading = false
    },
    setDeletingStreamNoteId: (state, action) => {
      state.deletingStreamNoteId = action.payload.id
    },
    updateStreamProblematicStatusRequested: (state, action) => {
      state.updatingStreamProblematicStatus = true
    },
    updateStreamProblematicStatusSucceeded: (state, action) => {
      state.updatingStreamProblematicStatus = false

      if (state.activeStream) {
        state.activeStream.isProblematic = action.payload.isProblematic
      }
    },
    updateStreamProblematicStatusFailed: (state, action) => {
      state.updatingStreamProblematicStatus = false
    },
  },
})

export const {
  addShape,
  createEntityAndPointAnnotationFailed,
  createEntityAndPointAnnotationRequested,
  createEntityAndPointAnnotationSucceeded,
  deleteEntityConfigFailed,
  deleteEntityConfigRequested,
  deleteEntityConfigSucceeded,
  deletePointAnnotationFailed,
  deletePointAnnotationRequested,
  deletePointAnnotationSucceeded,
  fetchActiveStreamSnapshotRequested,
  fetchActiveStreamSnapshotSucceeded,
  fetchEntityOptionsFailed,
  fetchEntityOptionsRequested,
  fetchEntiyOptionsSucceeded,
  fetchSitesFailed,
  fetchSitesRequested,
  fetchSitesSucceeded,
  fetchStreamAuditFailed,
  fetchStreamAuditRequested,
  fetchStreamAuditSucceeded,
  fetchStreamsFailed,
  fetchStreamSnapShotFailed,
  fetchStreamSnapShotRequested,
  fetchStreamSnapShotSucceeded,
  fetchStreamsRequested,
  fetchStreamsSucceeded,
  fetchStreamZoneBitmapFailed,
  fetchStreamZoneBitmapRequested,
  fetchStreamZoneBitmapSucceeded,
  updateStreamRegionRequested,
  updateStreamRegionSucceeded,
  updateStreamRegionFailed,
  fetchZonesFailed,
  fetchZonesRequested,
  fetchZonesSucceeded,
  fetchRegionsRequested,
  fetchRegionsSucceeded,
  fetchRegionsFailed,
  fetchAccessReadersForSiteRequested,
  fetchAccessReadersForSiteSucceeded,
  fetchAccessReadersForStreamRequested,
  fetchAccessReadersForStreamSucceeded,
  getStreamPointAnnotationsFailed,
  getStreamPointAnnotationsRequested,
  getStreamPointAnnotationsSucceeded,
  removeShape,
  resetShapes,
  resetActiveStream,
  saveEntityConfigFailed,
  saveEntityConfigRequested,
  saveEntityConfigSucceeded,
  selectAccessReader,
  selectPointAnnotationId,
  selectShape,
  selectVideoWallTemplate,
  setActiveZone,
  setBrushSize,
  setColor,
  setDeletingEntityConfigId,
  setDeletingPointAnnotationId,
  setEditingPointAnnotationId,
  setIsHoveringOnAnnotationPoint,
  setIsStreamSelectionModalOpen,
  setIsAccessReaderModalOpen,
  setMode,
  setPointAnnotationMode,
  setSearch,
  setAccessReaderSearch,
  setShapeProps,
  setTool,
  setActiveSiteId,
  setZoneData,
  toggleVisibilityOnPointAnnotation,
  updateAccessReaderRequested,
  updatePointAnnotationFailed,
  updatePointAnnotationRequested,
  updatePointAnnotationSucceeded,
  updateStreamFailed,
  updateStreamRequested,
  updateStreamSucceeded,
  createStreamNoteRequested,
  createStreamNoteSucceeded,
  createStreamNoteFailed,
  updateStreamNoteRequested,
  updateStreamNoteSucceeded,
  updateStreamNoteFailed,
  setUpdatingStreamNoteId,
  deleteStreamNoteRequested,
  deleteStreamNoteSucceeded,
  deleteStreamNoteFailed,
  setDeletingStreamNoteId,
  updateStreamProblematicStatusRequested,
  updateStreamProblematicStatusSucceeded,
  updateStreamProblematicStatusFailed,
} = slice.actions

export default slice.reducer
