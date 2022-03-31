import {
  FETCH_REQUESTED,
  FETCH_SUCCEEDED,
  FETCH_FAILED,
  FETCH_SITES_REQUESTED,
  FETCH_SITES_SUCCEEDED,
  FETCH_SITES_FAILED,
  TOGGLE_SEV0_ESCALATION,
  CREATE_ESCALATION_LEVEL_REQUESTED,
  CREATE_ESCALATION_LEVEL_SUCCEEDED,
  CREATE_ESCALATION_LEVEL_FAILED,
  DELETE_ESCALATION_LEVEL_REQUESTED,
  DELETE_ESCALATION_LEVEL_SUCCEEDED,
  DELETE_ESCALATION_LEVEL_FAILED,
  UPDATE_ESCALATION_LEVEL_REQUESTED,
  UPDATE_ESCALATION_LEVEL_SUCCEEDED,
  UPDATE_ESCALATION_LEVEL_FAILED,
  CREATE_ESCALATION_CONTACT_REQUESTED,
  DELETE_ESCALATION_CONTACT_REQUESTED,
  DELETE_ESCALATION_CONTACT_SUCCEEDED,
  DELETE_ESCALATION_CONTACT_FAILED,
  UPDATE_ESCALATION_CONTACT_REQUESTED,
  UPDATE_ESCALATION_CONTACT_SUCCEEDED,
  UPDATE_ESCALATION_CONTACT_FAILED,
  NOTIFICATION_METHODS_FETCH_REQUESTED,
  NOTIFICATION_METHODS_FETCH_SUCCEEDED,
  NOTIFICATION_METHODS_FETCH_FAILED,
  PROFILES_FETCH_REQUESTED,
  PROFILES_FETCH_SUCCEEDED,
  PROFILES_FETCH_FAILED,
  REARRANGE_CONTACT_REQUESTED,
  REARRANGE_CONTACT_SUCCEEDED,
  REARRANGE_CONTACT_FAILED,
  CREATE_ESCALATION_POLICY_FOR_SEV_REQUESTED,
  CREATE_ESCALATION_POLICY_FOR_SEV_SUCCEEDED,
  CREATE_ESCALATION_POLICY_FOR_SEV_FAILED,
  UPDATE_ESCALATION_POLICY_FOR_SEV_REQUESTED,
  UPDATE_ESCALATION_POLICY_FOR_SEV_SUCCEEDED,
  UPDATE_ESCALATION_POLICY_FOR_SEV_FAILED,
  GET_ESCALATION_POLICIES_REQUESTED,
  GET_ESCALATION_POLICIES_SUCCEEDED,
  GET_ESCALATION_POLICIES_FAILED,
  DELETE_ESCALATION_POLICY_REQUESTED,
  DELETE_ESCALATION_POLICY_SUCCEEDED,
  DELETE_ESCALATION_POLICY_FAILED,
  GET_ESCALATION_POLICY_REQUESTED,
  GET_ESCALATION_POLICY_SUCCEEDED,
  GET_ESCALATION_POLICY_FAILED,
} from './actionTypes'

// START - COLLECTION FETCH
export const securityProfilesFetchRequested = ({ accountSlug, siteSlug }) => {
  return {
    type: FETCH_REQUESTED,
    payload: {
      accountSlug,
      siteSlug,
    },
  }
}

export const securityProfilesFetchSucceeded = ({ securityProfiles }) => {
  return {
    type: FETCH_SUCCEEDED,
    payload: {
      securityProfiles,
    },
  }
}

export const securityProfilesFetchFailed = payload => {
  return {
    type: FETCH_FAILED,
    payload: payload.error,
    error: true,
  }
}
// END - COLLECTION FETCH

export const toggleSEV0Escalation = payload => {
  return {
    type: TOGGLE_SEV0_ESCALATION,
  }
}

export const escalationLevelCreation = ({
  accountSlug,
  siteSlug,
  policyId,
  level,
}) => {
  return {
    type: CREATE_ESCALATION_LEVEL_REQUESTED,
    payload: {
      accountSlug,
      siteSlug,
      policyId,
      level,
    },
  }
}

export const escalationLevelCreationSucceeded = createdLevel => {
  return {
    type: CREATE_ESCALATION_LEVEL_SUCCEEDED,
    payload: {
      createdLevel,
    },
  }
}

export const escalationLevelCreationFailed = payload => {
  return {
    type: CREATE_ESCALATION_LEVEL_FAILED,
    payload: payload.error,
    error: true,
  }
}

export const escalationLevelDeletion = ({ accountSlug, siteSlug, levelId }) => {
  return {
    type: DELETE_ESCALATION_LEVEL_REQUESTED,
    payload: {
      accountSlug,
      siteSlug,
      levelId,
    },
  }
}

export const escalationLevelDeletionSucceeded = levelId => {
  return {
    type: DELETE_ESCALATION_LEVEL_SUCCEEDED,
    payload: {
      levelId,
    },
  }
}

export const escalationLevelDeletionFailed = payload => {
  return {
    type: DELETE_ESCALATION_LEVEL_FAILED,
    payload: payload.error,
    error: true,
  }
}

export const escalationLevelUpdate = ({
  accountSlug,
  siteSlug,
  levelId,
  durationSecs,
}) => {
  return {
    type: UPDATE_ESCALATION_LEVEL_REQUESTED,
    payload: {
      accountSlug,
      siteSlug,
      levelId,
      durationSecs,
    },
  }
}

export const escalationLevelUpdateSucceeded = () => {
  return {
    type: UPDATE_ESCALATION_LEVEL_SUCCEEDED,
  }
}

export const escalationLevelUpdateFailed = payload => {
  return {
    type: UPDATE_ESCALATION_LEVEL_FAILED,
    payload: payload.error,
    error: true,
  }
}

export const escalationContactUpdate = ({
  methods,
  profileId,
  siteSlug,
  accountSlug,
  escalationLevelId,
}) => {
  return {
    type: UPDATE_ESCALATION_CONTACT_REQUESTED,
    payload: {
      methods,
      profileId,
      siteSlug,
      accountSlug,
      escalationLevelId,
    },
  }
}

export const escalationContactUpdateSucceeded = ({ escalationLevel }) => {
  const { contacts } = escalationLevel
  const levelId = escalationLevel.id
  const policyId = escalationLevel.policy.id
  return {
    type: UPDATE_ESCALATION_CONTACT_SUCCEEDED,
    payload: {
      contacts,
      levelId,
      policyId,
    },
  }
}

export const escalationContactUpdateFailed = payload => {
  return {
    type: UPDATE_ESCALATION_CONTACT_FAILED,
    payload: payload.error,
    error: true,
  }
}

export const escalationContactCreation = () => {
  return {
    type: CREATE_ESCALATION_CONTACT_REQUESTED,
  }
}

export const escalationContactDeletion = ({
  profileId,
  methods,
  escalationLevelId,
}) => {
  return {
    type: DELETE_ESCALATION_CONTACT_REQUESTED,
    payload: {
      profileId,
      methods,
      escalationLevelId,
    },
  }
}

export const escalationContactDeletionSucceeded = ({
  escalationLevelId,
  escalationContacts,
}) => {
  return {
    type: DELETE_ESCALATION_CONTACT_SUCCEEDED,
    payload: {
      contacts: escalationContacts,
      escalationLevelId,
    },
  }
}

export const escalationContactDeletionFailed = payload => {
  return {
    type: DELETE_ESCALATION_CONTACT_FAILED,
    payload: payload.error,
    error: true,
  }
}

export const notificationMethodsFetchRequested = () => {
  return {
    type: NOTIFICATION_METHODS_FETCH_REQUESTED,
  }
}

export const notificationMethodsFetchSucceeded = ({ methods }) => {
  return {
    type: NOTIFICATION_METHODS_FETCH_SUCCEEDED,
    payload: {
      methods,
    },
  }
}

export const notificationMethodsFetchFailed = payload => {
  return {
    type: NOTIFICATION_METHODS_FETCH_FAILED,
    payload: payload.error,
    error: true,
  }
}

export const profilesFetchRequested = payload => {
  return {
    type: PROFILES_FETCH_REQUESTED,
    payload,
  }
}

export const profilesFetchSucceeded = ({ profiles }) => {
  return {
    type: PROFILES_FETCH_SUCCEEDED,
    payload: {
      profiles,
    },
  }
}

export const profilesFetchFailed = payload => {
  return {
    type: PROFILES_FETCH_FAILED,
    payload: payload.error,
    error: true,
  }
}

export const rearrangeContactRequested = ({
  source,
  destination,
  siteSlug,
  accountSlug,
  afterUpdate,
}) => {
  return {
    type: REARRANGE_CONTACT_REQUESTED,
    payload: {
      source,
      destination,
      siteSlug,
      accountSlug,
      afterUpdate,
    },
  }
}

export const rearrangeContactSucceeded = ({ source, destination }) => {
  return {
    type: REARRANGE_CONTACT_SUCCEEDED,
    payload: {
      source,
      destination,
    },
  }
}

export const rearrangeContactFailed = payload => {
  return {
    type: REARRANGE_CONTACT_FAILED,
    payload: payload.error,
    error: true,
  }
}

export const createEscalationPolicyForSevRequested = ({ siteId, name }) => {
  return {
    type: CREATE_ESCALATION_POLICY_FOR_SEV_REQUESTED,
    payload: {
      siteId,
      name,
    },
  }
}

export const createEscalationPolicyForSevSucceeded = ({ escalationPolicy }) => {
  return {
    type: CREATE_ESCALATION_POLICY_FOR_SEV_SUCCEEDED,
    payload: {
      escalationPolicy,
    },
  }
}

export const createEscalationPolicyForSevFailed = ({ error }) => {
  return {
    type: CREATE_ESCALATION_POLICY_FOR_SEV_FAILED,
    payload: {
      error,
    },
  }
}

export const updateEscalationPolicyForSevRequested = ({
  index,
  securityProfileId,
  severity,
  policyId,
  siteId,
  policyName,
}) => {
  return {
    type: UPDATE_ESCALATION_POLICY_FOR_SEV_REQUESTED,
    payload: {
      index,
      securityProfileId,
      severity,
      policyId,
      siteId,
      policyName,
    },
  }
}

export const updateEscalationPolicyForSevSucceeded = ({
  index,
  securityProfileId,
  escalationPolicyForSev,
}) => {
  return {
    type: UPDATE_ESCALATION_POLICY_FOR_SEV_SUCCEEDED,
    payload: {
      index,
      securityProfileId,
      escalationPolicyForSev,
    },
  }
}

export const updateEscalationPolicyForSevFailed = payload => {
  return {
    type: UPDATE_ESCALATION_POLICY_FOR_SEV_FAILED,
    payload: payload.error,
    error: true,
  }
}

export const getEscalationPoliciesRequested = ({ accountSlug, siteSlug }) => {
  return {
    type: GET_ESCALATION_POLICIES_REQUESTED,
    payload: {
      accountSlug,
      siteSlug,
    },
  }
}

export const getEscalationPoliciesSucceeded = escalationPolicies => {
  return {
    type: GET_ESCALATION_POLICIES_SUCCEEDED,
    payload: {
      escalationPolicies,
    },
  }
}

export const getEscalationPoliciesFailed = payload => {
  return {
    type: GET_ESCALATION_POLICIES_FAILED,
    payload: payload.error,
    error: true,
  }
}

export const deleteEscalationPolicyRequested = policyId => {
  return {
    type: DELETE_ESCALATION_POLICY_REQUESTED,
    payload: {
      policyId,
    },
  }
}

export const deleteEscalationPolicySucceeded = policyId => {
  return {
    type: DELETE_ESCALATION_POLICY_SUCCEEDED,
    payload: {
      policyId,
    },
  }
}

export const deleteEscalationPolicyFailed = payload => {
  return {
    type: DELETE_ESCALATION_POLICY_FAILED,
    payload: payload.error,
    error: true,
  }
}

export const getEscalationPolicyRequested = policyId => {
  return {
    type: GET_ESCALATION_POLICY_REQUESTED,
    payload: {
      policyId,
    },
  }
}

export const getEscalationPolicySucceeded = policy => {
  return {
    type: GET_ESCALATION_POLICY_SUCCEEDED,
    payload: {
      policy,
    },
  }
}

export const getEscalationPolicyFailed = payload => {
  return {
    type: GET_ESCALATION_POLICY_FAILED,
    payload: payload.error,
    error: true,
  }
}

// SITES +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
export const fetchSitesRequested = payload => {
  return {
    type: FETCH_SITES_REQUESTED,
    payload,
  }
}

export const fetchSitesSucceeded = sites => {
  return {
    type: FETCH_SITES_SUCCEEDED,
    payload: {
      sites,
    },
  }
}

export const fetchSitesFailed = payload => {
  return {
    type: FETCH_SITES_FAILED,
    payload: payload.error,
    error: true,
  }
}
