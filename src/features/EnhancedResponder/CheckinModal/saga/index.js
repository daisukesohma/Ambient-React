import get from 'lodash/get'
import { call, put, takeLatest } from 'redux-saga/effects'
import { createQuery, createMutation } from 'providers/apollo'
import { createNotification } from 'redux/slices/notifications'
import { updateSiteCheckedinProfiles } from 'redux/slices/operatorPage'
import { updateAssignment } from 'features/EnhancedResponder/ContactResources/contactResourcesSlice'
import { updateLastWorkShift } from 'redux/slices/auth'
import { updateUserCheckinAssignment } from 'pages/UserManagement/redux/userManagementSlice'

import {
  fetchContactResourcesRequested,
  fetchContactResourcesSucceeded,
  fetchContactResourcesFailed,
  createWorkShiftRequested,
  createWorkShiftSucceeded,
  createWorkShiftFailed,
  fetchUsersRequested,
  fetchUsersSucceeded,
  fetchUsersFailed,
} from '../redux/checkinModalSlice'

import { GET_CONTACT_RESOURCES, CREATE_WORKSHIFT, GET_USERS } from './gql'

function* fetchUsers(action) {
  try {
    const { accountSlug } = action.payload
    const { data } = yield call(createQuery, GET_USERS, {
      accountSlug,
    })

    yield put(
      fetchUsersSucceeded({
        users: data.allActiveOrNewUsersByAccount.map(user => {
          const edges = get(user, 'profile.sites.edges')
          const sitesArr = edges
            ? edges
                .filter(({ node }) => node.account.slug === accountSlug)
                .map(({ node }) => {
                  return {
                    name: node.name,
                    slug: node.slug,
                  }
                })
            : []

          return { ...user, sites: sitesArr }
        }),
      }),
    )
  } catch (error) {
    const { message } = error
    yield put(fetchUsersFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* fetchContactResources(action) {
  try {
    const { accountSlug } = action.payload
    const { data } = yield call(createQuery, GET_CONTACT_RESOURCES, {
      accountSlug,
    })
    yield put(
      fetchContactResourcesSucceeded({
        contactResources: data.contactResources.map(contactResource => ({
          ...contactResource,
          id: Number(contactResource.id),
          used:
            get(contactResource, 'lastWorkShiftPeriod') !== null &&
            get(contactResource, 'lastWorkShiftPeriod.endWorkShift', false) ===
              null,
        })),
      }),
    )
  } catch (error) {
    const { message } = error
    yield put(fetchContactResourcesFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* createWorkshift(action) {
  try {
    const {
      accountSlug,
      siteSlug,
      signIn,
      contactResourceId,
      userProfileId,
      refreshContactResources,
      refreshUsers,
      checkInThemself,
    } = action.payload
    const { data } = yield call(createMutation, CREATE_WORKSHIFT, {
      input: {
        accountSlug,
        siteSlug,
        signIn,
        contactResourceId,
        userProfileId,
      },
    })
    yield put(
      createWorkShiftSucceeded({
        userProfileId,
        contactResourceId,
        signIn,
        data,
      }),
    )
    if (refreshContactResources) {
      yield put(
        updateAssignment({
          data,
          contactResourceId,
        }),
      )
    }
    if (refreshUsers) {
      yield put(
        updateUserCheckinAssignment({
          lastWorkShiftPeriod: data.createOrEndWorkShift.workShiftPeriod,
        }),
      )
    }
    yield put(
      createNotification({
        message: data.createOrEndWorkShift.message,
      }),
    )
    // update operator page sites
    yield put(
      updateSiteCheckedinProfiles({
        workShiftPeriod: data.createOrEndWorkShift.workShiftPeriod,
        signIn,
      }),
    )
    if (checkInThemself) {
      yield put(
        updateLastWorkShift({
          data,
          signIn,
        }),
      )
    }
  } catch (error) {
    const { message } = error
    yield put(createWorkShiftFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* checkinModalSaga() {
  yield takeLatest(fetchUsersRequested, fetchUsers)
  yield takeLatest(fetchContactResourcesRequested, fetchContactResources)
  yield takeLatest(createWorkShiftRequested, createWorkshift)
}

export default checkinModalSaga
