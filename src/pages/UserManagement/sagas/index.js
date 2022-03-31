import { call, put, takeLatest } from 'redux-saga/effects'
// src
import { createQuery, createMutation } from 'providers/apollo'
import { createNotification } from 'redux/slices/notifications'
import isEmpty from 'lodash/isEmpty'
import first from 'lodash/first'

import { trimUser } from '../utils'
import {
  fetchUserRolesRequested,
  fetchUserRolesSucceeded,
  fetchUserRolesFailed,
  fetchIdSourceTypesRequested,
  fetchIdSourceTypesSucceeded,
  fetchIdSourceTypesFailed,
  fetchIdentitySourcesRequested,
  fetchIdentitySourcesSucceeded,
  fetchIdentitySourcesFailed,
  fetchUsersRequested,
  fetchUsersSucceeded,
  fetchUsersFailed,
  createUserRequested,
  createUserSucceeded,
  createUserFailed,
  editUserRequested,
  editUserSucceeded,
  editUserFailed,
  deleteUserRequested,
  deleteUserSucceeded,
  deleteUserFailed,
  syncIdentitySourcesRequested,
  syncIdentitySourcesSucceeded,
  syncIdentitySourcesFailed,
  createIdentitySourceRequested,
  createIdentitySourceSucceeded,
  createIdentitySourceFailed,
  updateIdentitySourceRequested,
  updateIdentitySourceSucceeded,
  updateIdentitySourceFailed,
  activateIdentitySourceRequested,
  activateIdentitySourceSucceeded,
  activateIdentitySourceFailed,
  deactivateUnfederatedUsersRequested,
  deactivateUnfederatedUsersSucceeded,
  deactivateUnfederatedUsersFailed,
  deleteIdentitySourceRequested,
  deleteIdentitySourceSucceeded,
  deleteIdentitySourceFailed,
} from '../redux/userManagementSlice'
import { trimIdentitySource } from '../IdentitySources/utils'

import {
  GET_USERS_PAGINATED,
  CREATE_USER,
  UPDATE_USER,
  DEACTIVATE_USER,
  GET_ROLES,
  GET_IDENTITY_SOURCE_TYPES,
  GET_IDENTITY_SOURCES,
  ACTIVATE_IDENTITY_SOURCE,
  DEACTIVATE_IDENTITY_SOURCE,
  CREATE_IDENTITY_SOURCE,
  UPDATE_IDENTITY_SOURCE,
  CREATE_IDENTITY_SOURCE_REQUESTS,
  DEACTIVATE_UNFEDERATED_USERS,
  GET_LOGIN_EVENTS,
} from './gql'
import { NOTIFICATION_TYPES } from '../../../redux/slices/notifications'

function* fetchUserRoles(action) {
  try {
    const { accountSlug } = action.payload
    const { data } = yield call(createQuery, GET_ROLES, {
      accountSlug,
    })
    yield put(fetchUserRolesSucceeded({ userRoles: data.getUserRoles }))
  } catch (error) {
    const { message } = error
    yield put(fetchUserRolesFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* fetchIdSourceTypes(action) {
  try {
    const { accountSlug } = action.payload
    const { data } = yield call(createQuery, GET_IDENTITY_SOURCE_TYPES, {
      accountSlug,
    })
    yield put(
      fetchIdSourceTypesSucceeded({ idSourceTypes: data.identitySourceTypes }),
    )
  } catch (error) {
    const { message } = error
    yield put(fetchIdSourceTypesFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* fetchIdentitySources(action) {
  try {
    const { accountSlug } = action.payload
    const { data } = yield call(createQuery, GET_IDENTITY_SOURCES, {
      accountSlug,
    })
    yield put(
      fetchIdentitySourcesSucceeded({
        identitySources: data.getIdentitySourcesForAccount
          .filter(source => source.active)
          .map(identitySource => trimIdentitySource(identitySource)),
      }),
    )
  } catch (error) {
    const { message } = error
    yield put(fetchIdentitySourcesFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* fetchUsers(action) {
  try {
    const {
      accountSlug,
      page,
      limit,
      searchQuery,
      siteSlugs,
      roleIds,
    } = action.payload
    const { data } = yield call(createQuery, GET_USERS_PAGINATED, {
      accountSlug,
      page,
      limit,
      searchQuery,
      siteSlugs,
      roleIds,
    })
    const {
      instances,
      pages,
      currentPage,
      totalCount,
    } = data.allActiveOrNewUsersByAccountPaginated
    const users = (instances || []).map(user => trimUser(user, accountSlug))
    yield put(
      fetchUsersSucceeded({
        users,
        pages,
        currentPage: currentPage - 1,
        totalCount,
      }),
    )
  } catch (error) {
    const { message } = error
    yield put(fetchUsersFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* createUser(action) {
  try {
    const { user, accountSlug } = action.payload
    const { data, errors } = yield call(createMutation, CREATE_USER, user)

    if (!isEmpty(errors)) throw Error(first(errors).message)

    yield put(
      createUserSucceeded({
        user: trimUser(data.createUser.user, accountSlug),
      }),
    )
    yield put(createNotification({ message: data.createUser.message }))
  } catch (error) {
    const { message } = error
    yield put(createUserFailed({ error: message }))
    yield put(createNotification({ message, type: NOTIFICATION_TYPES.ERROR }))
  }
}

function* editUser(action) {
  try {
    const { user, accountSlug } = action.payload
    const { data, errors } = yield call(createMutation, UPDATE_USER, user)
    if (!isEmpty(errors)) throw Error(first(errors).message)
    yield put(
      editUserSucceeded({
        user: trimUser(data.updateProfile.user, accountSlug),
      }),
    )
    yield put(createNotification({ message: data.updateProfile.message }))
  } catch (error) {
    const { message } = error
    yield put(editUserFailed({ error: message }))
    yield put(createNotification({ message, type: NOTIFICATION_TYPES.ERROR }))
  }
}

function* deleteUser(action) {
  try {
    const { accountSlug, userId } = action.payload
    const { data } = yield call(createMutation, DEACTIVATE_USER, {
      accountSlug,
      userId,
    })
    yield put(deleteUserSucceeded({ userId }))
    yield put(createNotification({ message: data.deactivateUser.message }))
  } catch (error) {
    const { message } = error
    yield put(deleteUserFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* syncIdentitySources(action) {
  try {
    const { identitySourceIds } = action.payload
    yield call(createMutation, CREATE_IDENTITY_SOURCE_REQUESTS, {
      identitySourceIds,
    })
    yield put(syncIdentitySourcesSucceeded())
  } catch (error) {
    const { message } = error
    yield put(syncIdentitySourcesFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* createIdentitySource(action) {
  try {
    const { identitySource } = action.payload
    const { data } = yield call(
      createMutation,
      CREATE_IDENTITY_SOURCE,
      identitySource,
    )
    yield put(
      createIdentitySourceSucceeded({
        identitySource: trimIdentitySource(
          data.createIdentitySource.identitySource,
        ),
      }),
    )
  } catch (error) {
    const { message } = error
    yield put(createIdentitySourceFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* updateIdentitySource(action) {
  try {
    const { identitySource } = action.payload
    const { data } = yield call(
      createMutation,
      UPDATE_IDENTITY_SOURCE,
      identitySource,
    )
    yield put(
      updateIdentitySourceSucceeded({
        identitySource: trimIdentitySource(
          data.updateIdentitySource.identitySource,
        ),
      }),
    )
  } catch (error) {
    const { message } = error
    yield put(updateIdentitySourceFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* deactivateUnfederatedUsers(action) {
  try {
    const { accountSlug } = action.payload
    yield call(createMutation, DEACTIVATE_UNFEDERATED_USERS, { accountSlug })
    yield put(deactivateUnfederatedUsersSucceeded())
  } catch (error) {
    const { message } = error
    yield put(deactivateUnfederatedUsersFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* deleteIdentitySource(action) {
  try {
    const { accountSlug, identitySourceId } = action.payload
    yield call(createMutation, DEACTIVATE_IDENTITY_SOURCE, {
      accountSlug,
      identitySourceId,
    })
    yield put(deleteIdentitySourceSucceeded({ identitySourceId }))
  } catch (error) {
    const { message } = error
    yield put(deleteIdentitySourceFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* activateIdentitySource(action) {
  try {
    const { accountSlug, identitySourceId } = action.payload
    yield call(createMutation, ACTIVATE_IDENTITY_SOURCE, {
      accountSlug,
      identitySourceId,
    })
    yield put(activateIdentitySourceSucceeded({ identitySourceId }))
  } catch (error) {
    const { message } = error
    yield put(activateIdentitySourceFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* userManagementSaga() {
  yield takeLatest(fetchUserRolesRequested, fetchUserRoles)
  yield takeLatest(fetchIdSourceTypesRequested, fetchIdSourceTypes)
  yield takeLatest(fetchIdentitySourcesRequested, fetchIdentitySources)
  yield takeLatest(fetchUsersRequested, fetchUsers)
  yield takeLatest(createUserRequested, createUser)
  yield takeLatest(editUserRequested, editUser)
  yield takeLatest(deleteUserRequested, deleteUser)
  yield takeLatest(syncIdentitySourcesRequested, syncIdentitySources)
  yield takeLatest(createIdentitySourceRequested, createIdentitySource)
  yield takeLatest(updateIdentitySourceRequested, updateIdentitySource)
  yield takeLatest(
    deactivateUnfederatedUsersRequested,
    deactivateUnfederatedUsers,
  )
  yield takeLatest(deleteIdentitySourceRequested, deleteIdentitySource)
  yield takeLatest(activateIdentitySourceRequested, activateIdentitySource)
}

export default userManagementSaga
