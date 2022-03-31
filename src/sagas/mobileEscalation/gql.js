import gql from 'graphql-tag'

export const FETCH_ESCALATION_CONTACT = gql`
  query EscalationContact($id: Int!) {
    escalationContact(id: $id) {
      id
      profile {
        id
      }
      contactMethods {
        method
        snooze {
          method
          tsEnd
          active
        }
      }
    }
  }
`

export const SNOOZE_ESCALATION_METHOD = gql`
  mutation SnoozeEscalationMethod(
    $profileId: Int!
    $method: String!
    $duration: Int!
  ) {
    snoozeEscalationMethod(
      profileId: $profileId
      method: $method
      duration: $duration
    ) {
      ok
      message
      escalationSnooze {
        method
        tsEnd
        active
      }
    }
  }
`

export const UNSNOOZE_ESCALATION_METHOD = gql`
  mutation UnsnoozeEscalationMethod($profileId: Int!, $method: String!) {
    unsnoozeEscalationMethod(profileId: $profileId, method: $method) {
      ok
      message
      escalationSnooze {
        method
      }
    }
  }
`
