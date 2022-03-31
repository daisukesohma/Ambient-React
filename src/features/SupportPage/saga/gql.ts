import gql from 'graphql-tag'

export const CREATE_SUPPORT_TICKET = gql`
  mutation createSupportTicket($input: CreateSupportTicketInput!) {
    createSupportTicket(input: $input) {
      ok
      message
    }
  }
`
