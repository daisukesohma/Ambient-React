import { call, select, put, takeLatest, takeEvery } from 'redux-saga/effects'
import { get, isFunction, set } from 'lodash'
// src
import { createMutation, createQuery } from 'providers/apollo'
import { createNotification } from 'redux/slices/notifications'
import { POINT_ANNOTATION_MODES } from 'features/StreamConfiguration/constants'

import {
  resetShapes,
  createEntityAndPointAnnotationRequested,
  createEntityAndPointAnnotationSucceeded,
  createEntityAndPointAnnotationFailed,
  saveEntityConfigRequested,
  saveEntityConfigSucceeded,
  saveEntityConfigFailed,
  deleteEntityConfigRequested,
  deleteEntityConfigSucceeded,
  deleteEntityConfigFailed,
  fetchSitesRequested,
  fetchSitesSucceeded,
  fetchSitesFailed,
  fetchStreamsRequested,
  fetchStreamsSucceeded,
  fetchStreamsFailed,
  fetchZonesRequested,
  fetchZonesSucceeded,
  fetchZonesFailed,
  fetchRegionsRequested,
  fetchRegionsSucceeded,
  fetchRegionsFailed,
  fetchEntityOptionsRequested,
  fetchEntiyOptionsSucceeded,
  fetchEntityOptionsFailed,
  fetchActiveStreamSnapshotRequested,
  fetchActiveStreamSnapshotSucceeded,
  fetchStreamAuditRequested,
  fetchStreamAuditSucceeded,
  fetchStreamAuditFailed,
  fetchStreamZoneBitmapRequested,
  fetchStreamZoneBitmapSucceeded,
  fetchStreamZoneBitmapFailed,
  fetchStreamSnapShotRequested,
  fetchStreamSnapShotSucceeded,
  fetchStreamSnapShotFailed,
  deletePointAnnotationRequested,
  deletePointAnnotationSucceeded,
  setPointAnnotationMode,
  setEditingPointAnnotationId,
  setDeletingEntityConfigId,
  setDeletingPointAnnotationId,
  updateStreamRegionRequested,
  updateStreamRegionSucceeded,
  updateStreamRegionFailed,
  updateStreamRequested,
  updateStreamSucceeded,
  updateStreamFailed,
  updatePointAnnotationRequested,
  updatePointAnnotationSucceeded,
  updatePointAnnotationFailed,
  removeShape,
  fetchAccessReadersForSiteRequested,
  fetchAccessReadersForSiteSucceeded,
  fetchAccessReadersForStreamRequested,
  fetchAccessReadersForStreamSucceeded,
  updateAccessReaderRequested,
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
} from '../streamConfigurationSlice'

import {
  GET_STREAMS_BY_ACCOUNT,
  GET_SITES_BY_ACCOUNT,
  GET_ZONES,
  UPDATE_STREAM,
  UPDATE_REGION_ON_STREAM,
  GET_STREAM_SNAPSHOT,
  GET_STREAM_AUDIT,
  GET_STREAM_ZONE_BITMAP,
  CREATE_POINT_ANNOTATION,
  UPDATE_POINT_ANNOTATION,
  DELETE_POINT_ANNOTATION,
  GET_ENTITIES,
  CREATE_ENTITY_CONFIG,
  UPDATE_ENTITY_CONFIG,
  DELETE_ENTITY_CONFIG,
  GET_ALL_REGIONS,
  GET_ACCESS_READERS_FOR_STREAM,
  GET_ACCESS_READERS_FOR_SITE,
  GET_ACCESS_READERS_FOR_ACCOUNT,
  UPDATE_ACCESS_READER,
  CREATE_STREAM_NOTE,
  UPDATE_STREAM_NOTE,
  DELETE_STREAM_NOTE,
  UPDATE_STREAM_PROBLEMATIC_STATUS,
} from './gql'

function* updateAccessReader(action) {
  const { streamId, id, entityConfigId } = action.payload
  const activeStream = yield select(
    state => state.streamConfiguration.activeStream,
  )
  const activeSiteId = yield select(
    state => state.streamConfiguration.activeSiteId,
  )

  const params = { id }
  if (streamId) {
    set(params, 'streamId', streamId)
  }
  if (entityConfigId) {
    set(params, 'entityConfigId', entityConfigId)
  }

  const response = yield call(createMutation, UPDATE_ACCESS_READER, params)

  // refetch data for access readers after mutation completes successfully
  if (get(response, 'data.updateAccessReader.ok')) {
    yield put(fetchAccessReadersForSiteRequested({ siteId: activeSiteId }))
    yield put(
      fetchAccessReadersForStreamRequested({
        streamId: get(activeStream, 'id'),
      }),
    )
    yield put(fetchStreamAuditRequested({ id: get(activeStream, 'id') }))
  }
  // yield put(
  //   updateAccessReaderSucceeded({
  //     accessReaders: response.data.accessReadersForStream,
  //   }),
  // )
}

function* fetchAccessReadersForStream(action) {
  const { streamId } = action.payload
  const response = yield call(createQuery, GET_ACCESS_READERS_FOR_STREAM, {
    streamId,
  })
  yield put(
    fetchAccessReadersForStreamSucceeded({
      accessReaders: response.data.accessReadersForStream,
    }),
  )
}

function* fetchAccessReadersForSite(action) {
  const { siteId } = action.payload
  const response = yield call(createQuery, GET_ACCESS_READERS_FOR_SITE, {
    siteId,
  })
  yield put(
    fetchAccessReadersForSiteSucceeded({
      accessReaders: response.data.accessReadersForSite,
    }),
  )
}

function* fetchSites(action) {
  try {
    const { accountSlug } = action.payload
    const response = yield call(createQuery, GET_SITES_BY_ACCOUNT, {
      accountSlug,
    })
    const sites = get(response, 'data.allSitesByAccount', [])
    yield put(fetchSitesSucceeded({ sites }))
  } catch (error) {
    const { message } = error
    yield put(fetchSitesFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* fetchStreams(action) {
  try {
    const { accountSlug, siteSlug } = action.payload
    const response = yield call(createQuery, GET_STREAMS_BY_ACCOUNT, {
      accountSlug,
      siteSlug,
    })
    yield put(
      fetchStreamsSucceeded({ streams: response.data.findStreamsByAccount }),
    )
  } catch (error) {
    const { message } = error
    yield put(fetchStreamsFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* fetchZones() {
  try {
    const response = yield call(createQuery, GET_ZONES)
    yield put(fetchZonesSucceeded(response.data))
  } catch (error) {
    const { message } = error
    yield put(fetchZonesFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* fetchRegions(action) {
  try {
    const { accountSlug, siteSlug } = action.payload
    const response = yield call(createQuery, GET_ALL_REGIONS, {
      accountSlug,
      siteSlug,
    })
    yield put(fetchRegionsSucceeded({ regions: response.data.allRegions }))
  } catch (error) {
    const { message } = error
    yield put(fetchRegionsFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* fetchEntities() {
  try {
    const response = yield call(createQuery, GET_ENTITIES)
    yield put(fetchEntiyOptionsSucceeded(response.data))
  } catch (error) {
    const { message } = error
    yield put(fetchEntityOptionsFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* fetchStreamSnapShot(action) {
  try {
    const { streamId } = action.payload
    const { data } = yield call(createQuery, GET_STREAM_SNAPSHOT, { streamId })
    yield put(fetchStreamSnapShotSucceeded({ stream: data.getStream }))
  } catch (error) {
    const { message } = error
    yield put(fetchStreamSnapShotFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

// fetchActiveStreamSnapshot:  this refetches the stream snapshot url and the slice places it in in `activeStream`
// since fetchStreamSnapshot already grabs the dataStr and places it in `state.streams`
// we can just add the id of the selected stream to activeStream and pull from the state.streams
// list.
// However, this extra fetch here doesn't rely on the data structure of `state.streams`
// so it's a redundancy which makes it independent, but it may also be unneccessary.

// This is a candidate for optimization.
// The optimization would be - save activeStream.id on fetchStreamDetails,
//
function* fetchActiveStreamSnapshot(action) {
  try {
    const { streamId } = action.payload
    const { data } = yield call(createQuery, GET_STREAM_SNAPSHOT, { streamId })
    yield put(
      fetchActiveStreamSnapshotSucceeded({ snapshot: data.getStream.snapshot }),
    )
  } catch (error) {
    const { message } = error
    yield put(createNotification({ message }))
  }
}

function* fetchStreamZoneBitmap(action) {
  try {
    const { stream, afterFetch } = action.payload
    const { data } = yield call(createQuery, GET_STREAM_ZONE_BITMAP, {
      streamId: stream.id,
    })
    yield put(fetchStreamZoneBitmapSucceeded({ stream: data.getStream }))
    yield call(afterFetch, data.getStream)
  } catch (error) {
    const { message } = error
    yield put(fetchStreamZoneBitmapFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* updateStream(action) {
  try {
    const { id, bitMap, afterUpdate } = action.payload
    const response = yield call(createMutation, UPDATE_STREAM, {
      data: {
        id,
        bitMap,
      },
    })
    yield put(updateStreamSucceeded(response.data.updateStream.stream))
    yield put(resetShapes())
    if (isFunction(afterUpdate)) yield call(afterUpdate)
  } catch (error) {
    const { message } = error
    yield put(updateStreamFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* updateStreamRegion(action) {
  try {
    const { streamId, regionId } = action.payload
    const response = yield call(createMutation, UPDATE_REGION_ON_STREAM, {
      input: {
        streamId,
        regionId,
      },
    })
    yield put(
      updateStreamRegionSucceeded(response.data.updateRegionOnStream.stream),
    )
  } catch (error) {
    const { message } = error
    yield put(updateStreamRegionFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* createEntityAndPointAnnotation(action) {
  try {
    const { entity, annotation, streamId } = action.payload

    // create entity config first, get the id
    const entityConfigId = yield* createEntity({
      ...entity,
      bbox: '',
      config: '{}',
    })

    // associate id with point annotation during create
    yield* createPointAnnotation({
      payload: {
        input: {
          ...annotation,
          entityConfigId,
        },
      },
    })

    // refetch all point annotations to display in UI
    yield put(fetchStreamAuditRequested({ id: streamId }))
    yield put(createEntityAndPointAnnotationSucceeded())
  } catch (error) {
    const { message } = error
    yield put(createEntityAndPointAnnotationFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* createEntity(input) {
  // input is an object of type: {
  //   bbox,
  //   config,
  //   annotationType,
  //   entityId,
  //   streamId,
  // }

  try {
    const response = yield call(createMutation, CREATE_ENTITY_CONFIG, { input })

    yield put(
      createNotification({
        message: get(response, `data.createEntityConfig.message`),
      }),
    )

    yield put(
      saveEntityConfigSucceeded({
        entity: get(response, `data.createEntityConfig.entityConfig`),
      }),
    )

    // return new id
    return response.data.createEntityConfig.entityConfig.id
  } catch (error) {
    const { message } = error
    yield put(saveEntityConfigFailed({ error: message }))
    yield put(createNotification({ message }))
  }

  return null
}

function* createPointAnnotation(action) {
  try {
    const { input } = action.payload
    yield put(
      setPointAnnotationMode({
        pointAnnotationMode: POINT_ANNOTATION_MODES.DEFAULT,
      }),
    )
    const response = yield call(createMutation, CREATE_POINT_ANNOTATION, {
      input,
    })

    return response.data.createPointAnnotation.pointAnnotation.id
  } catch (error) {
    const { message } = error
    yield put(createNotification({ message }))
  }

  return null
}

function* updatePointAnnotation(action) {
  try {
    const { input, streamId } = action.payload
    yield put(
      setPointAnnotationMode({
        pointAnnotationMode: POINT_ANNOTATION_MODES.DEFAULT,
      }),
    )

    const response = yield call(createMutation, UPDATE_POINT_ANNOTATION, {
      input,
    })

    yield put(
      updatePointAnnotationSucceeded({
        points: response.data.updatePointAnnotation.pointAnnotation,
      }),
    )
    yield put(setEditingPointAnnotationId({ id: null }))

    // refetch point annotations after the save, so UI is updated
    yield put(fetchStreamAuditRequested({ id: streamId }))
  } catch (error) {
    const { message } = error
    yield put(updatePointAnnotationFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* deletePointAnnotation(action) {
  try {
    const { id, entityId } = action.payload
    yield put(setDeletingPointAnnotationId({ id }))
    yield call(createMutation, DELETE_POINT_ANNOTATION, {
      input: {
        pointAnnotationId: id,
      },
    })

    yield put(deletePointAnnotationSucceeded())
    yield put(setDeletingPointAnnotationId({ id: null })) // a bit hacky, to show, could create setDeletingPointId
    yield put(deleteEntityConfigRequested({ id: entityId }))
  } catch (error) {
    yield put(createEntityAndPointAnnotationFailed({ error }))
  }
}

function* saveEntityConfig(action) {
  try {
    const {
      bbox,
      config,
      annotationType,
      entityId,
      id,
      streamId,
    } = action.payload

    // if it has "id", then it is an update on that id, else it creates with
    const mutation = id ? UPDATE_ENTITY_CONFIG : CREATE_ENTITY_CONFIG
    const inputParams = id
      ? {
          // update
          bbox,
          config,
          annotationType,
          id,
        }
      : {
          // create
          bbox,
          config,
          annotationType,
          entityId,
          streamId,
        }

    const selectedBoundingBoxEntityId = yield select(
      state => state.streamConfiguration.selectedBoundingBoxEntityId,
    )

    const responseKey = id ? 'updateEntityConfig' : 'createEntityConfig'
    const response = yield call(createMutation, mutation, {
      input: inputParams,
    })

    yield put(
      createNotification({
        message: get(response, `data.${responseKey}.message`),
      }),
    )
    yield put(
      saveEntityConfigSucceeded({
        index: selectedBoundingBoxEntityId,
        entity: get(response, `data.${responseKey}.entityConfig`),
      }),
    )

    // refetch entityConfigs to display in UI
    yield put(fetchStreamAuditRequested({ id: streamId }))
  } catch (error) {
    const { message } = error
    yield put(saveEntityConfigFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* deleteEntityConfig(action) {
  try {
    const { id } = action.payload
    const selectedBoundingBoxEntityId = yield select(
      state => state.streamConfiguration.selectedBoundingBoxEntityId,
    )
    yield put(setDeletingEntityConfigId({ id }))
    const response = yield call(createMutation, DELETE_ENTITY_CONFIG, {
      input: {
        id,
      },
    })
    yield put(deleteEntityConfigSucceeded())
    yield put(removeShape({ index: selectedBoundingBoxEntityId }))
    yield put(
      createNotification({
        message: get(response, 'data.deleteEntityConfig.message'),
      }),
    )
    yield put(setDeletingEntityConfigId({ id: null }))
    const activeStream = yield select(
      state => state.streamConfiguration.activeStream,
    )
    yield put(fetchStreamAuditRequested({ id: get(activeStream, 'id') }))
  } catch (error) {
    yield put(deleteEntityConfigFailed({ error }))
  }
}

function* fetchStreamAudit(action) {
  try {
    const { id } = action.payload
    const response = yield call(createMutation, GET_STREAM_AUDIT, {
      id,
    })

    yield put(
      fetchStreamAuditSucceeded({
        stream: response.data.findStreamById,
      }),
    )
  } catch (error) {
    const { message } = error
    yield put(fetchStreamAuditFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* createStreamNote(action) {
  try {
    const { streamId, content } = action.payload
    const response = yield call(createMutation, CREATE_STREAM_NOTE, {
      data: {
        streamId,
        content,
      },
    })

    yield put(
      createStreamNoteSucceeded({
        streamNote: response.data.createStreamNote.streamNote,
      }),
    )
    yield put(fetchStreamAuditRequested({ id: streamId }))
  } catch (error) {
    const { message } = error
    yield put(createStreamNoteFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* updateStreamNote(action) {
  try {
    const { streamNoteId, content } = action.payload
    const response = yield call(createMutation, UPDATE_STREAM_NOTE, {
      data: {
        streamNoteId,
        content,
      },
    })

    yield put(updateStreamNoteSucceeded({}))
    yield put(setUpdatingStreamNoteId({ id: null }))
    const activeStream = yield select(
      state => state.streamConfiguration.activeStream,
    )
    yield put(fetchStreamAuditRequested({ id: get(activeStream, 'id') }))
  } catch (error) {
    const { message } = error
    yield put(updateStreamNoteFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* deleteStreamNote(action) {
  try {
    const { streamNoteId } = action.payload
    yield put(setDeletingStreamNoteId({ id: streamNoteId }))
    const response = yield call(createMutation, DELETE_STREAM_NOTE, {
      data: {
        streamNoteId,
      },
    })

    yield put(deleteStreamNoteSucceeded({}))
    const activeStream = yield select(
      state => state.streamConfiguration.activeStream,
    )
    yield put(fetchStreamAuditRequested({ id: get(activeStream, 'id') }))
    yield put(setDeletingStreamNoteId({ id: null }))
  } catch (error) {
    const { message } = error
    yield put(deleteStreamNoteFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* updateStreamProblematicStatus(action) {
  try {
    const { streamId, content, isProblematic } = action.payload
    const response = yield call(
      createMutation,
      UPDATE_STREAM_PROBLEMATIC_STATUS,
      {
        data: {
          streamId,
          content,
          isProblematic,
        },
      },
    )

    yield put(
      updateStreamProblematicStatusSucceeded({
        isProblematic,
      }),
    )
    yield put(fetchStreamAuditRequested({ id: streamId }))
  } catch (error) {
    const { message } = error
    yield put(updateStreamProblematicStatusFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* saga() {
  yield takeLatest(fetchSitesRequested, fetchSites)
  yield takeLatest(fetchStreamsRequested, fetchStreams)
  yield takeLatest(
    fetchActiveStreamSnapshotRequested,
    fetchActiveStreamSnapshot,
  )
  yield takeLatest(fetchRegionsRequested, fetchRegions)
  yield takeLatest(fetchStreamZoneBitmapRequested, fetchStreamZoneBitmap) // change
  yield takeEvery(fetchStreamSnapShotRequested, fetchStreamSnapShot)
  yield takeLatest(fetchStreamAuditRequested, fetchStreamAudit)
  yield takeLatest(fetchZonesRequested, fetchZones)
  yield takeLatest(fetchEntityOptionsRequested, fetchEntities)
  yield takeLatest(updateStreamRequested, updateStream)
  yield takeLatest(updateStreamRegionRequested, updateStreamRegion)
  yield takeLatest(saveEntityConfigRequested, saveEntityConfig)
  yield takeLatest(deleteEntityConfigRequested, deleteEntityConfig)
  yield takeLatest(deletePointAnnotationRequested, deletePointAnnotation)
  yield takeLatest(updatePointAnnotationRequested, updatePointAnnotation)
  yield takeLatest(
    createEntityAndPointAnnotationRequested,
    createEntityAndPointAnnotation,
  )
  yield takeLatest(
    fetchAccessReadersForSiteRequested,
    fetchAccessReadersForSite,
  )
  yield takeLatest(
    fetchAccessReadersForStreamRequested,
    fetchAccessReadersForStream,
  )
  yield takeLatest(updateAccessReaderRequested, updateAccessReader)
  yield takeLatest(createStreamNoteRequested, createStreamNote)
  yield takeLatest(updateStreamNoteRequested, updateStreamNote)
  yield takeLatest(deleteStreamNoteRequested, deleteStreamNote)
  yield takeLatest(
    updateStreamProblematicStatusRequested,
    updateStreamProblematicStatus,
  )
}

export default saga
