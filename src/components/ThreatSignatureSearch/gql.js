import gql from 'graphql-tag'

export const GET_THREAT_SIGNATURES = gql`
  query allThreatSignatures {
    allThreatSignatures {
      id
      name
    }
  }
`
