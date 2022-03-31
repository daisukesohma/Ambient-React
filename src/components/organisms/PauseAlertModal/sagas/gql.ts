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
      }
    }
  }
`
