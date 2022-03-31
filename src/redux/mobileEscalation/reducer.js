/* eslint-disable no-case-declarations, no-param-reassign, no-fallthrough */
import produce from 'immer'
import findIndex from 'lodash/findIndex'

import {
  ESCALATION_CONTACT_FETCH_REQUESTED,
  ESCALATION_CONTACT_FETCH_SUCCEEDED,
  ESCALATION_CONTACT_FETCH_FAILED,
  SNOOZE_ESCALATION_METHOD_REQUESTED,
  SNOOZE_ESCALATION_METHOD_SUCCEEDED,
  SNOOZE_ESCALATION_METHOD_FAILED,
  UNSNOOZE_ESCALATION_METHOD_REQUESTED,
  UNSNOOZE_ESCALATION_METHOD_SUCCEEDED,
  UNSNOOZE_ESCALATION_METHOD_FAILED,
} from './actionTypes'

const initialState = {
  escalationContact: null,
  escalationContactLoading: false,
  snoozeEscalationMethodLoading: false,
  unsnoozeEscalationMethodLoading: false,
}

const mobileEscalationReducer = produce((draft = initialState, action) => {
  switch (action.type) {
    case ESCALATION_CONTACT_FETCH_REQUESTED:
      draft.escalationContactLoading = true
      return draft

    case ESCALATION_CONTACT_FETCH_SUCCEEDED:
      draft.escalationContactLoading = false
      draft.escalationContact = action.payload.escalationContact
      return draft

    case ESCALATION_CONTACT_FETCH_FAILED:
      draft.escalationContactLoading = false
      return draft

    case SNOOZE_ESCALATION_METHOD_REQUESTED:
      draft.snoozeEscalationMethodLoading = true
      return draft

    case SNOOZE_ESCALATION_METHOD_SUCCEEDED:
      draft.snoozeEscalationMethodLoading = false
      if (draft.escalationContact) {
        const methodIndex = findIndex(draft.escalationContact.contactMethods, {
          method: action.payload.escalationSnooze.method,
        })
        draft.escalationContact.contactMethods[methodIndex].snooze =
          action.payload.escalationSnooze
      }
      return draft

    case SNOOZE_ESCALATION_METHOD_FAILED:
      draft.snoozeEscalationMethodLoading = false
      return draft

    case UNSNOOZE_ESCALATION_METHOD_REQUESTED:
      draft.unsnoozeEscalationMethodLoading = true
      return draft

    case UNSNOOZE_ESCALATION_METHOD_SUCCEEDED:
      draft.unsnoozeEscalationMethodLoading = false
      if (draft.escalationContact) {
        const methodIndex = findIndex(draft.escalationContact.contactMethods, {
          method: action.payload.escalationSnooze.method,
        })
        draft.escalationContact.contactMethods[methodIndex].snooze = null
      }
      return draft

    case UNSNOOZE_ESCALATION_METHOD_FAILED:
      draft.unsnoozeEscalationMethodLoading = false
      return draft

    default:
      return draft
  }
})

export default mobileEscalationReducer
