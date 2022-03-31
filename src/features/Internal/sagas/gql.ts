/* eslint-disable import/prefer-default-export */

import gql from 'graphql-tag'

export const REQUEST_SUPPORT_ACCESS = gql`
  mutation RequestSupportAccess($input: RequestSupportAccessInput!) {
    requestSupportAccess(input: $input) {
      ok
      message
      request {
        id
        status
      }
    }
  }
`

export const GRANT_SUPPORT_ACCESS = gql`
  mutation GrantSupportAccess($input: SupportAccessActionInput!) {
    grantSupportAccessRequest(input: $input) {
      ok
      message
      action {
        request {
          id
          status
        }
      }
    }
  }
`

export const DENY_SUPPORT_ACCESS = gql`
  mutation DenySupportAccess($input: SupportAccessActionInput!) {
    denySupportAccessRequest(input: $input) {
      ok
      message
      action {
        request {
          id
          status
        }
      }
    }
  }
`

export const WITHDRAW_SUPPORT_ACCESS = gql`
  mutation WithdrawSupportAccess($input: SupportAccessActionInput!) {
    withdrawSupportAccessRequest(input: $input) {
      ok
      message
      action {
        request {
          id
          status
        }
      }
    }
  }
`

export const REVOKE_SUPPORT_ACCESS = gql`
  mutation RevokeSupportAccess($input: SupportAccessActionInput!) {
    revokeSupportAccessRequest(input: $input) {
      ok
      message
      action {
        request {
          id
          status
        }
      }
    }
  }
`

export const RELEASE_SUPPORT_ACCESS = gql`
  mutation ReleaseSupportAccess($input: SupportAccessActionInput!) {
    releaseSupportAccessRequest(input: $input) {
      ok
      message
      action {
        request {
          id
          status
        }
      }
    }
  }
`

export const ACCOUNT_SUPPORT_ACCESS_REQUESTS_PAGINATED = gql`
  query SupportAccessRequestsForAccountPaginated(
    $accountSlug: String!
    $filters: SupportAccessRequestsForAccountFilterInput
    $orderDesc: Boolean
    $page: Int
    $limit: Int
  ) {
    supportAccessRequestsForAccountPaginated(
      accountSlug: $accountSlug
      filters: $filters
      orderDesc: $orderDesc
      page: $page
      limit: $limit
    ) {
      pages
      currentPage
      totalCount
      instances {
        id
        user {
          id
          username
          firstName
          lastName
          email
          profile {
            id
            img
          }
        }
        tsCreated
        tsStartRequested
        tsEndRequested
        reason
        tsStartActive
        tsEndActive
        status
        allowedActions {
          key
          label
        }
        isActive
        isExpired
      }
    }
  }
`

export const USER_SUPPORT_ACCESS_REQUESTS_PAGINATED = gql`
  query SupportAccessRequestsByMePaginated(
    $filters: SupportAccessRequestsForUserFilterInput
    $orderDesc: Boolean
    $page: Int
    $limit: Int
  ) {
    supportAccessRequestsByMePaginated(
      filters: $filters
      orderDesc: $orderDesc
      page: $page
      limit: $limit
    ) {
      pages
      currentPage
      totalCount
      instances {
        id
        account {
          slug
          name
        }
        tsCreated
        tsStartRequested
        tsEndRequested
        reason
        tsStartActive
        tsEndActive
        status
        allowedActions {
          key
          label
        }
        isActive
        isExpired
      }
    }
  }
`

export const ADMIN_SUPPORT_ACCESS_REQUESTS_PAGINATED = gql`
  query SupportAccessRequestsForAdminPaginated(
    $filters: SupportAccessRequestsForAdminFilterInput
    $orderDesc: Boolean
    $page: Int
    $limit: Int
  ) {
    supportAccessRequestsForAdminPaginated(
      filters: $filters
      orderDesc: $orderDesc
      page: $page
      limit: $limit
    ) {
      pages
      currentPage
      totalCount
      instances {
        id
        user {
          id
          username
          firstName
          lastName
          email
          profile {
            id
            img
          }
        }
        account {
          slug
          name
        }
        tsCreated
        tsStartRequested
        tsEndRequested
        reason
        tsStartActive
        tsEndActive
        status
        allowedActions {
          key
          label
        }
        isActive
        isExpired
      }
    }
  }
`

export const GET_ACCOUNTS = gql`
  query AccountsForSupportAccess {
    accountsForSupportAccess {
      slug
    }
  }
`
