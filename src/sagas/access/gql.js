import gql from 'graphql-tag'

export const CREATE_ACCESS_ALARM = gql`
  mutation CreateAccessAlarm($accessReaderId: Int!, $name: String!, $ts: Int) {
    createAccessAlarm(accessReaderId: $accessReaderId, name: $name, ts: $ts) {
      ok
      message
      accessAlarm {
        id
      }
    }
  }
`
