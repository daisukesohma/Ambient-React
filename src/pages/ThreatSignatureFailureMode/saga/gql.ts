/* eslint-disable import/prefer-default-export */

import gql from 'graphql-tag'

export const GET_FAILURE_MODES = gql`
  query failureModes {
    failureModes {
      id
      name
      threatSignatures {
        id
        name
      }
      validThreatSignatures {
        id
        name
      }
    }
  }
`

export const GET_ALL_THREAT_SIGNATURES = gql`
  query allThreatSignatures($tsStart: Int, $tsEnd: Int) {
    allThreatSignatures {
      id
      name
      validFailureModes {
        id
      }
      performanceMetrics(tsStart: $tsStart, tsEnd: $tsEnd) {
        dismissedRatio
        numPositive
        numNegative
      }
    }
  }
`

export const ADD_FAILURE_MODE = gql`
  mutation addFailureModeToSignature(
    $input: UpdateFailureModeForSignatureInput!
  ) {
    addFailureModeToSignature(input: $input) {
      ok
      message
      threatSignature {
        id
        name
        validFailureModes {
          id
        }
      }
    }
  }
`

export const DELETE_FAILURE_MODE = gql`
  mutation deleteFailureModeFromSignature(
    $input: UpdateFailureModeForSignatureInput!
  ) {
    deleteFailureModeFromSignature(input: $input) {
      ok
      message
      threatSignature {
        id
        name
        validFailureModes {
          id
        }
      }
    }
  }
`
