import gql from 'graphql-tag'

export const SET_PASSWORD = gql`
  mutation SetPassword(
    $inviteCode: String!
    $password: String!
    $confirmPassword: String!
  ) {
    setPassword(
      inviteCode: $inviteCode
      password: $password
      confirmPassword: $confirmPassword
    ) {
      ok
      message
    }
  }
`
