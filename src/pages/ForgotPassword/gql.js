import gql from 'graphql-tag'

export const SET_PASSWORD_REQUEST = gql`
  mutation SetPasswordRequest($email: String!) {
    setPasswordRequest(email: $email) {
      email
      ok
      message
    }
  }
`
