/* eslint-disable no-case-declarations, no-param-reassign, no-fallthrough */
import produce from 'immer'
import get from 'lodash/get'

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
  UPDATE_ESCALATION_CONTACT_REQUESTED,
  UPDATE_ESCALATION_CONTACT_SUCCEEDED,
  UPDATE_ESCALATION_CONTACT_FAILED,
  DELETE_ESCALATION_CONTACT_REQUESTED,
  DELETE_ESCALATION_CONTACT_SUCCEEDED,
  DELETE_ESCALATION_CONTACT_FAILED,
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

const initialState = {
  securityProfiles: [],
  error: null,
  loading: false,
  escalationPolicies: [],
  loadingEscalationPolicies: false,
  loadingSites: false,
  pages: 0,
  showSEV0Escalation: true,
  methods: [],
  profiles: [],
  sites: [],
  selectedSite: null,
  // TODO: Remove redundant selectedSiteSlug
  selectedSiteSlug: null,
  deletingPolicy: false,
  gettingPolicy: false,
  selectedPolicy: null,
  lastPage: null,
}

const threatEscalationReducer = produce((draft = initialState, action) => {
  switch (action.type) {
    // fetch
    case FETCH_REQUESTED:
      draft.loading = true
      return draft

    case FETCH_SUCCEEDED:
      draft.securityProfiles = action.payload.securityProfiles
      draft.loading = false
      return draft

    case FETCH_FAILED:
      draft.error = action.payload.error
      draft.loading = false
      return draft

    case FETCH_SITES_REQUESTED:
      draft.loadingSites = true
      return draft

    case FETCH_SITES_SUCCEEDED:
      draft.loadingSites = false
      draft.sites = action.payload.sites
      return draft

    case FETCH_SITES_FAILED:
      draft.loadingSites = false
      return draft

    case TOGGLE_SEV0_ESCALATION:
      draft.showSEV0Escalation = !draft.showSEV0Escalation
      return draft

    case CREATE_ESCALATION_LEVEL_REQUESTED:
      return draft

    case CREATE_ESCALATION_LEVEL_SUCCEEDED:
      const { createdLevel } = action.payload
      draft.securityProfiles.forEach(securityProfile => {
        if (securityProfile.escalationPoliciesForSev) {
          securityProfile.escalationPoliciesForSev.forEach(item => {
            if (
              get(item, 'escalationPolicy.id', '') === createdLevel.policy.id
            ) {
              item.escalationPolicy.levels.push(createdLevel)
            }
          })
        }
      })
      draft.selectedPolicy.levels.push(createdLevel)
      draft.loading = false
      return draft

    case CREATE_ESCALATION_LEVEL_FAILED:
      draft.error = action.payload.error
      draft.loading = false
      return draft

    case UPDATE_ESCALATION_LEVEL_REQUESTED:
      return draft

    case UPDATE_ESCALATION_LEVEL_SUCCEEDED:
      draft.loading = false
      return draft

    case UPDATE_ESCALATION_LEVEL_FAILED:
      draft.error = action.payload.error
      draft.loading = false
      return draft

    case DELETE_ESCALATION_LEVEL_REQUESTED:
      return draft

    case DELETE_ESCALATION_LEVEL_SUCCEEDED:
      const { levelId } = action.payload
      draft.securityProfiles.forEach(securityProfile => {
        if (securityProfile.escalationPoliciesForSev) {
          securityProfile.escalationPoliciesForSev.forEach(item => {
            if (get(item, 'escalationPolicy', null)) {
              item.escalationPolicy.levels = item.escalationPolicy.levels.filter(
                ({ id }) => id !== levelId,
              )
            }
          })
        }
      })
      draft.selectedPolicy.levels = draft.selectedPolicy.levels.filter(
        ({ id }) => id !== levelId,
      )
      draft.loading = false
      return draft

    case DELETE_ESCALATION_LEVEL_FAILED:
      draft.error = action.payload.error
      draft.loading = false
      return draft

    case UPDATE_ESCALATION_CONTACT_REQUESTED:
      return draft

    case UPDATE_ESCALATION_CONTACT_SUCCEEDED:
      draft.loading = false
      const { contacts, levelId: contactLevelId, policyId } = action.payload
      draft.securityProfiles.forEach(securityProfile => {
        if (securityProfile.escalationPoliciesForSev) {
          securityProfile.escalationPoliciesForSev.forEach(item => {
            if (get(item, 'escalationPolicy.id', '') === policyId) {
              item.escalationPolicy.levels.forEach(level => {
                if (level.id === contactLevelId) {
                  level.contacts = contacts
                }
              })
            }
          })
        }
      })
      draft.selectedPolicy.levels.forEach(level => {
        if (level.id === contactLevelId) {
          level.contacts = contacts
        }
      })
      return draft

    case UPDATE_ESCALATION_CONTACT_FAILED:
      draft.error = action.payload.error
      draft.loading = false
      return draft

    case DELETE_ESCALATION_CONTACT_REQUESTED:
      return draft

    case DELETE_ESCALATION_CONTACT_SUCCEEDED:
      draft.loading = false
      const { contacts: deleted, escalationLevelId } = action.payload
      draft.securityProfiles.forEach(securityProfile => {
        if (securityProfile.escalationPoliciesForSev) {
          securityProfile.escalationPoliciesForSev.forEach(item => {
            if (get(item, 'escalationPolicy', null)) {
              item.escalationPolicy.levels.forEach(level => {
                const newContacts = []
                level.contacts.forEach(it => {
                  const isBlackList =
                    escalationLevelId === level.id &&
                    deleted.some(({ id }) => id === it.id)
                  if (!isBlackList) {
                    newContacts.push(it)
                  }
                })
                level.contacts = newContacts
              })
            }
          })
        }
      })
      draft.selectedPolicy.levels.forEach(level => {
        const newContacts = []
        level.contacts.forEach(it => {
          const isBlackList =
            escalationLevelId === level.id &&
            deleted.some(({ id }) => id === it.id)
          if (!isBlackList) {
            newContacts.push(it)
          }
        })
        level.contacts = newContacts
      })
      return draft

    case DELETE_ESCALATION_CONTACT_FAILED:
      draft.error = action.payload.error
      draft.loading = false
      return draft

    case NOTIFICATION_METHODS_FETCH_REQUESTED:
      return draft

    case NOTIFICATION_METHODS_FETCH_SUCCEEDED:
      draft.methods = action.payload.methods
      return draft

    case NOTIFICATION_METHODS_FETCH_FAILED:
      draft.error = action.payload.error
      return draft

    case PROFILES_FETCH_REQUESTED:
      return draft

    case PROFILES_FETCH_SUCCEEDED:
      draft.profiles = action.payload.profiles
      return draft

    case PROFILES_FETCH_FAILED:
      draft.error = action.payload.error
      return draft

    case REARRANGE_CONTACT_REQUESTED:
      return draft

    case REARRANGE_CONTACT_SUCCEEDED:
      const { source, destination } = action.payload
      const sourceContacts = []
      draft.securityProfiles.forEach(securityProfile => {
        if (securityProfile.escalationPoliciesForSev) {
          securityProfile.escalationPoliciesForSev.forEach(item => {
            if (item.escalationPolicy) {
              item.escalationPolicy.levels.forEach(level => {
                if (level.id === source.levelId) {
                  level.contacts = level.contacts.filter(contact => {
                    const toMove =
                      contact.profile.id === Number(source.profileId)
                    if (toMove) {
                      sourceContacts.push(contact)
                    }
                    return !toMove
                  })
                }
              })
            }
          })
        }
      })
      draft.securityProfiles.forEach(securityProfile => {
        if (securityProfile.escalationPoliciesForSev) {
          securityProfile.escalationPoliciesForSev.forEach(item => {
            if (item.escalationPolicy) {
              item.escalationPolicy.levels.forEach(level => {
                if (level.id === destination.levelId) {
                  const profileIds = level.contacts.map(contact => {
                    return contact.profile.id
                  })
                  const profileList = [...new Set(profileIds)]
                  profileList.splice(
                    destination.position,
                    0,
                    sourceContacts[0].profile.id,
                  )
                  const totalContacts = [...level.contacts, ...sourceContacts]
                  const resultContacts = []
                  profileList.forEach(profileId => {
                    resultContacts.push(
                      ...totalContacts.filter(
                        con => profileId === con.profile.id,
                      ),
                    )
                  })
                  level.contacts = resultContacts
                }
              })
            }
          })
        }
      })
      draft.selectedPolicy.levels.forEach(level => {
        if (level.id === source.levelId) {
          level.contacts = level.contacts.filter(contact => {
            const toMove = contact.profile.id === Number(source.profileId)
            if (toMove) {
              sourceContacts.push(contact)
            }
            return !toMove
          })
        }
      })
      draft.selectedPolicy.levels.forEach(level => {
        if (level.id === destination.levelId) {
          const profileIds = level.contacts.map(contact => {
            return contact.profile.id
          })
          const profileList = [...new Set(profileIds)]
          profileList.splice(
            destination.position,
            0,
            sourceContacts[0].profile.id,
          )
          const totalContacts = [...level.contacts, ...sourceContacts]
          const resultContacts = []
          profileList.forEach(profileId => {
            resultContacts.push(
              ...totalContacts.filter(con => profileId === con.profile.id),
            )
          })
          level.contacts = resultContacts
        }
      })
      return draft

    case REARRANGE_CONTACT_FAILED:
      draft.error = action.payload.error
      return draft

    case UPDATE_ESCALATION_POLICY_FOR_SEV_REQUESTED:
      return draft

    case CREATE_ESCALATION_POLICY_FOR_SEV_REQUESTED:
      return draft
    case CREATE_ESCALATION_POLICY_FOR_SEV_SUCCEEDED:
      draft.escalationPolicies.push(action.payload.escalationPolicy)
      return draft
    case CREATE_ESCALATION_POLICY_FOR_SEV_FAILED:
      return draft

    case UPDATE_ESCALATION_POLICY_FOR_SEV_SUCCEEDED:
      const {
        index,
        securityProfileId,
        escalationPolicyForSev,
      } = action.payload
      draft.securityProfiles.forEach(securityProfile => {
        if (securityProfile.id === securityProfileId) {
          if (index === 1 && !securityProfile.escalationPoliciesForSev[0]) {
            securityProfile.escalationPoliciesForSev[0] = {
              severity:
                escalationPolicyForSev.severity === 'sev0' ? 'sev1' : 'sev0',
            }
          }
          securityProfile.escalationPoliciesForSev[
            index
          ] = escalationPolicyForSev
        }
      })
      return draft

    case UPDATE_ESCALATION_POLICY_FOR_SEV_FAILED:
      draft.error = action.payload.error
      return draft

    case GET_ESCALATION_POLICIES_REQUESTED:
      draft.loadingEscalationPolicies = true
      return draft

    case GET_ESCALATION_POLICIES_SUCCEEDED:
      draft.escalationPolicies = action.payload.escalationPolicies
      draft.loadingEscalationPolicies = false
      return draft

    case GET_ESCALATION_POLICIES_FAILED:
      draft.error = action.payload.error
      draft.loadingEscalationPolicies = false
      return draft

    case DELETE_ESCALATION_POLICY_REQUESTED:
      draft.deletingPolicy = true
      return draft

    case DELETE_ESCALATION_POLICY_SUCCEEDED:
      draft.escalationPolicies = draft.escalationPolicies.filter(policy => {
        return policy.id !== action.payload.policyId
      })
      draft.deletingPolicy = false
      return draft

    case DELETE_ESCALATION_POLICY_FAILED:
      draft.error = action.payload.error
      draft.deletingPolicy = false
      return draft

    case GET_ESCALATION_POLICY_REQUESTED:
      draft.gettingPolicy = true
      return draft

    case GET_ESCALATION_POLICY_SUCCEEDED:
      draft.selectedPolicy = action.payload.policy
      draft.gettingPolicy = false
      return draft

    case GET_ESCALATION_POLICY_FAILED:
      draft.error = action.payload.error
      draft.gettingPolicy = false
      return draft

    default:
      return draft
  }
})

export default threatEscalationReducer
