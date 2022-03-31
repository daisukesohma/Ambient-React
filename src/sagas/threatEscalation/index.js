import { call, put, takeLatest } from 'redux-saga/effects'
import get from 'lodash/get'
import isFunction from 'lodash/isFunction'
// src
import { createQuery, createMutation } from 'providers/apollo'
import { createNotification } from 'redux/slices/notifications'
import {
  FETCH_REQUESTED,
  FETCH_SITES_REQUESTED,
  CREATE_ESCALATION_LEVEL_REQUESTED,
  UPDATE_ESCALATION_LEVEL_REQUESTED,
  DELETE_ESCALATION_LEVEL_REQUESTED,
  UPDATE_ESCALATION_CONTACT_REQUESTED,
  DELETE_ESCALATION_CONTACT_REQUESTED,
  PROFILES_FETCH_REQUESTED,
  NOTIFICATION_METHODS_FETCH_REQUESTED,
  REARRANGE_CONTACT_REQUESTED,
  CREATE_ESCALATION_POLICY_FOR_SEV_REQUESTED,
  UPDATE_ESCALATION_POLICY_FOR_SEV_REQUESTED,
  GET_ESCALATION_POLICIES_REQUESTED,
  DELETE_ESCALATION_POLICY_REQUESTED,
  GET_ESCALATION_POLICY_REQUESTED,
} from 'redux/threatEscalation/actionTypes'
import {
  securityProfilesFetchSucceeded,
  securityProfilesFetchFailed,
  escalationLevelCreationSucceeded,
  escalationLevelCreationFailed,
  escalationLevelUpdateSucceeded,
  escalationLevelUpdateFailed,
  escalationLevelDeletionSucceeded,
  escalationLevelDeletionFailed,
  escalationContactUpdateSucceeded,
  escalationContactUpdateFailed,
  escalationContactDeletionSucceeded,
  escalationContactDeletionFailed,
  profilesFetchSucceeded,
  profilesFetchFailed,
  notificationMethodsFetchSucceeded,
  notificationMethodsFetchFailed,
  rearrangeContactSucceeded,
  rearrangeContactFailed,
  createEscalationPolicyForSevSucceeded,
  createEscalationPolicyForSevFailed,
  updateEscalationPolicyForSevSucceeded,
  updateEscalationPolicyForSevFailed,
  getEscalationPoliciesSucceeded,
  getEscalationPoliciesFailed,
  deleteEscalationPolicySucceeded,
  deleteEscalationPolicyFailed,
  getEscalationPolicySucceeded,
  getEscalationPolicyFailed,
  fetchSitesSucceeded,
  fetchSitesFailed,
} from 'redux/threatEscalation/actions'

import {
  GET_SECURITY_PROFILES,
  CREATE_ESCALATION_LEVEL,
  UPDATE_ESCALATION_LEVEL,
  DELETE_ESCALATION_LEVEL,
  UPDATE_ESCALATION_CONTACT,
  DELETE_ESCALATION_CONTACT,
  GET_NOTIFICATION_METHODS,
  GET_PROFILES,
  CREATE_ESCALATION_POLICY,
  UPDATE_ESCALATION_POLICY_FOR_SEV,
  GET_ESCALATION_POLICIES,
  DELETE_ESCALATION_POLICY,
  GET_ESCALATION_POLICY,
  GET_SITES_BY_ACCOUNT,
} from './gql'

function* fetchMethods() {
  try {
    const response = yield call(createQuery, GET_NOTIFICATION_METHODS)
    const { getNotificationMethods } = response.data
    yield put(
      notificationMethodsFetchSucceeded({ methods: getNotificationMethods }),
    )
  } catch (error) {
    const { message } = error
    yield put(notificationMethodsFetchFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* fetchProfiles(action) {
  try {
    const { accountSlug, siteSlug } = action.payload
    const response = yield call(createQuery, GET_PROFILES, {
      accountSlug,
      siteSlug,
      isActive: true,
    })
    const { getProfilesBySite } = response.data
    yield put(profilesFetchSucceeded({ profiles: getProfilesBySite }))
  } catch (error) {
    const { message } = error
    yield put(profilesFetchFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* fetchResources(action) {
  try {
    const { accountSlug, siteSlug } = action.payload
    const response = yield call(createQuery, GET_SECURITY_PROFILES, {
      accountSlug,
      siteSlug,
    })
    const { securityProfiles } = response.data
    yield put(securityProfilesFetchSucceeded({ securityProfiles }))
  } catch (error) {
    const { message } = error
    yield put(securityProfilesFetchFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* createEscalationLevel(action) {
  try {
    const { accountSlug, siteSlug, policyId, level } = action.payload
    const response = yield call(createMutation, CREATE_ESCALATION_LEVEL, {
      accountSlug,
      siteSlug,
      policyId,
      level,
      durationSecs: 5,
      speech: true,
      contacts: [],
    })
    const createdLevel = get(
      response,
      'data.createEscalationLevel.escalationLevel',
    )
    yield put(escalationLevelCreationSucceeded(createdLevel))
  } catch (error) {
    const { message } = error
    yield put(escalationLevelCreationFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* updateEscalationLevel(action) {
  try {
    const {
      accountSlug,
      siteSlug,
      policyId,
      levelId,
      durationSecs,
    } = action.payload
    yield call(createMutation, UPDATE_ESCALATION_LEVEL, {
      accountSlug,
      siteSlug,
      policyId,
      levelId,
      durationSecs,
    })
    yield put(escalationLevelUpdateSucceeded())
  } catch (error) {
    const { message } = error
    yield put(escalationLevelUpdateFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* deleteEscalationLevel(action) {
  try {
    const { accountSlug, siteSlug, levelId } = action.payload
    yield call(createMutation, DELETE_ESCALATION_LEVEL, {
      accountSlug,
      siteSlug,
      levelId,
    })
    yield put(escalationLevelDeletionSucceeded(levelId))
  } catch (error) {
    const { message } = error
    yield put(escalationLevelDeletionFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* updateEscalationContact(action) {
  try {
    const {
      methods,
      profileId,
      siteSlug,
      accountSlug,
      escalationLevelId,
    } = action.payload
    yield put(createNotification({ message: 'Adding...' }))
    const response = yield call(createMutation, UPDATE_ESCALATION_CONTACT, {
      methods,
      profileId,
      siteSlug,
      accountSlug,
      escalationLevelId,
    })
    const { addEscalationContactToLevel } = response.data
    yield put(createNotification({ message: 'Added successfully' }))
    yield put(escalationContactUpdateSucceeded(addEscalationContactToLevel))
  } catch (error) {
    const { message } = error
    yield put(escalationContactUpdateFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* deleteEscalationContact(action) {
  try {
    const { profileId, methods, escalationLevelId } = action.payload
    yield put(createNotification({ message: 'Removing...' }))
    const response = yield call(createMutation, DELETE_ESCALATION_CONTACT, {
      profileId,
      methods,
      escalationLevelId,
    })
    const { removeEscalationContactFromLevel } = response.data
    yield put(createNotification({ message: 'Removed successfully' }))
    yield put(
      escalationContactDeletionSucceeded({
        ...removeEscalationContactFromLevel,
        escalationLevelId,
      }),
    )
  } catch (error) {
    const { message } = error
    yield put(escalationContactDeletionFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* rearrangeContact(action) {
  try {
    const {
      source,
      destination,
      siteSlug,
      accountSlug,
      afterUpdate,
    } = action.payload
    yield put(
      rearrangeContactSucceeded({
        source,
        destination,
      }),
    )
    if (source.levelId !== destination.levelId) {
      const { profileId, methods } = source
      yield call(createMutation, DELETE_ESCALATION_CONTACT, {
        profileId,
        methods,
        escalationLevelId: source.levelId,
      })
      yield call(createMutation, UPDATE_ESCALATION_CONTACT, {
        methods,
        profileId,
        siteSlug,
        accountSlug,
        escalationLevelId: destination.levelId,
      })
    }
    if (isFunction(afterUpdate)) yield call(afterUpdate)
  } catch (error) {
    const { message } = error
    yield put(rearrangeContactFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* createEscalationPolicyForSev(action) {
  try {
    const { siteId, name } = action.payload
    const {
      data: {
        createEscalationPolicy: { escalationPolicy },
      },
    } = yield call(createMutation, CREATE_ESCALATION_POLICY, {
      siteId,
      name,
    })
    yield put(createEscalationPolicyForSevSucceeded({ escalationPolicy }))
  } catch (error) {
    const { message } = error
    yield put(createEscalationPolicyForSevFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* updateEscalationPolicyForSev(action) {
  try {
    const { index, securityProfileId, severity, policyId } = action.payload

    const response = yield call(
      createMutation,
      UPDATE_ESCALATION_POLICY_FOR_SEV,
      {
        securityProfileId,
        severity,
        policyId,
      },
    )
    const updated = get(
      response,
      'data.createOrUpdateEscalationPolicyForSev.escalationPolicyForSev',
    )

    yield put(
      updateEscalationPolicyForSevSucceeded({
        index,
        securityProfileId,
        escalationPolicyForSev: updated,
      }),
    )
  } catch (error) {
    const { message } = error
    yield put(updateEscalationPolicyForSevFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* getEscalationPolicies(action) {
  try {
    const { accountSlug, siteSlug } = action.payload
    const response = yield call(createQuery, GET_ESCALATION_POLICIES, {
      accountSlug,
      siteSlug,
    })
    const { escalationPolicies } = response.data
    yield put(getEscalationPoliciesSucceeded(escalationPolicies))
  } catch (error) {
    const { message } = error
    yield put(getEscalationPoliciesFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* deleteEscalationPolicy(action) {
  try {
    const { policyId } = action.payload
    yield call(createMutation, DELETE_ESCALATION_POLICY, {
      policyId,
    })
    yield put(deleteEscalationPolicySucceeded(policyId))
  } catch (error) {
    const { message } = error
    yield put(deleteEscalationPolicyFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* getEscalationPolicy(action) {
  try {
    const { policyId } = action.payload
    const res = yield call(createQuery, GET_ESCALATION_POLICY, {
      id: policyId,
    })
    yield put(
      getEscalationPolicySucceeded(get(res, 'data.getEscalationPolicy')),
    )
  } catch (error) {
    const { message } = error
    yield put(getEscalationPolicyFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* fetchSites(action) {
  try {
    const { accountSlug } = action.payload
    const response = yield call(createQuery, GET_SITES_BY_ACCOUNT, {
      accountSlug,
    })
    const sites = get(response, 'data.allSitesByAccount', [])
    yield put(fetchSitesSucceeded(sites))
  } catch (error) {
    const { message } = error
    yield put(fetchSitesFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* securityProfilesSaga() {
  yield takeLatest(FETCH_REQUESTED, fetchResources)
  yield takeLatest(CREATE_ESCALATION_LEVEL_REQUESTED, createEscalationLevel)
  yield takeLatest(UPDATE_ESCALATION_LEVEL_REQUESTED, updateEscalationLevel)
  yield takeLatest(DELETE_ESCALATION_LEVEL_REQUESTED, deleteEscalationLevel)
  yield takeLatest(UPDATE_ESCALATION_CONTACT_REQUESTED, updateEscalationContact)
  yield takeLatest(DELETE_ESCALATION_CONTACT_REQUESTED, deleteEscalationContact)
  yield takeLatest(PROFILES_FETCH_REQUESTED, fetchProfiles)
  yield takeLatest(NOTIFICATION_METHODS_FETCH_REQUESTED, fetchMethods)
  yield takeLatest(REARRANGE_CONTACT_REQUESTED, rearrangeContact)

  yield takeLatest(
    CREATE_ESCALATION_POLICY_FOR_SEV_REQUESTED,
    createEscalationPolicyForSev,
  )
  yield takeLatest(
    UPDATE_ESCALATION_POLICY_FOR_SEV_REQUESTED,
    updateEscalationPolicyForSev,
  )

  yield takeLatest(GET_ESCALATION_POLICIES_REQUESTED, getEscalationPolicies)
  yield takeLatest(DELETE_ESCALATION_POLICY_REQUESTED, deleteEscalationPolicy)
  yield takeLatest(GET_ESCALATION_POLICY_REQUESTED, getEscalationPolicy)
  yield takeLatest(FETCH_SITES_REQUESTED, fetchSites)
}

export default securityProfilesSaga
