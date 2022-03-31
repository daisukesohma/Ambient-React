import gql from 'graphql-tag'

export const CREATE_THREAT_SIGNATURE_PAUSE_PERIOD = gql`
  mutation CreateThreatSignaturePausePeriod(
    $input: CreateThreatSignaturePausePeriodInput!
  ) {
    createThreatSignaturePausePeriod(input: $input) {
      ok
      message
      threatSignaturePausePeriod {
        id
        startTs
        endTs
        cancelledTs
        site {
          id
          name
        }
        threatSignature {
          id
          name
        }
        createdBy {
          id
          user {
            email
            firstName
            lastName
          }
        }
        streams {
          id
          name
          region {
            id
            name
          }
        }
        description
      }
    }
  }
`

export const GET_THREAT_SIGNATURE_PAUSE_PERIODS = gql`
  query GetThreatSignaturePausePeriods($accountSlug: String!) {
    getThreatSignaturePausePeriods(accountSlug: $accountSlug) {
      id
      startTs
      endTs
      cancelledTs
      site {
        id
        name
      }
      threatSignature {
        id
        name
      }
      createdBy {
        id
        user {
          email
          firstName
          lastName
        }
      }
      streams {
        id
        name
        region {
          id
          name
        }
      }
      description
    }
  }
`

export const GET_THREAT_SIGNATURE_PAUSE_PERIOD = gql`
  query GetThreatSignaturePausePeriod($threatSignaturePausePeriodId: Int!) {
    getThreatSignaturePausePeriod(
      threatSignaturePausePeriodId: $threatSignaturePausePeriodId
    ) {
      id
      startTs
      endTs
      cancelledTs
      threatSignature {
        id
        name
      }
      createdBy {
        id
        user {
          email
          firstName
          lastName
        }
      }
      streams {
        id
        name
        region {
          id
          name
        }
      }
      description
    }
  }
`

export const CANCEL_THREAT_SIGNATURE_PAUSE_PERIOD = gql`
  mutation CancelThreatSignaturePausePeriod(
    $input: CancelThreatSignaturePausePeriodInput!
  ) {
    cancelThreatSignaturePausePeriod(input: $input) {
      ok
      message
      threatSignaturePausePeriod {
        id
        startTs
        endTs
      }
    }
  }
`

export const GET_STREAMS_WITH_THREAT_SIGNATURE = gql`
  query GetStreamsWithThreatSignature(
    $threatSignatureId: Int!
    $accountSlug: String!
    $siteSlugs: [String]
  ) {
    getStreamsWithThreatSignature(
      threatSignatureId: $threatSignatureId
      accountSlug: $accountSlug
      siteSlugs: $siteSlugs
    ) {
      name
      id
      region {
        id
        name
      }
      streamFeeds {
        id
        videoWall {
          id
          name
          isOperator
        }
      }
    }
  }
`

export const GET_DEPLOYED_THREAT_SIGNATURES = gql`
  query GetDeployedThreatSignatures($accountSlug: String!, $siteSlug: String) {
    getDeployedThreatSignatures(
      accountSlug: $accountSlug
      siteSlug: $siteSlug
    ) {
      name
      id
      alerts {
        id
        name
      }
    }
  }
`
