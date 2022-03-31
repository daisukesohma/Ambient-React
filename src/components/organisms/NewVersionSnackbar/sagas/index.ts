/* eslint-disable no-console */
import { call, put, takeLatest } from 'redux-saga/effects'

// src
import {
  fetchProductInfoRequested,
  fetchProductInfoSucceeded,
  fetchProductInfoFailed,
} from '../redux/versionSlice'

interface FetchProductInfoProps {
  payload: {
    initialLoad: boolean
  }
}

function* fetchProductInfo(action: FetchProductInfoProps) {
  const { initialLoad } = action.payload
  const response = yield call(fetch, '/info.json', {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
  if (response.status === 200) {
    const info = yield call([response, 'json'])
    yield put(
      fetchProductInfoSucceeded({
        info,
        initialLoad,
      }),
    )
  } else {
    // const error = response.statusText
    yield put(fetchProductInfoFailed())
    // yield put(createNotification({ message: error }))
  }
}

export default function* saga(): Generator {
  yield takeLatest(fetchProductInfoRequested, fetchProductInfo)
}
