/* eslint-disable import/prefer-default-export */

import gql from 'graphql-tag'

export const GET_LOGIN_EVENTS = gql`
  query usersLoginEvents(
    $profileId: Int!
    $startTs: Int
    $endTs: Int
    $page: Int
    $limit: Int
    $desc: Boolean
    $searchQuery: String
  ) {
    usersLoginEvents(
      profileId: $profileId
      startTs: $startTs
      endTs: $endTs
      page: $page
      limit: $limit
      desc: $desc
      searchQuery: $searchQuery
    ) {
      pages
      currentPage
      totalCount
      instances {
        id
        type
        status
        ts
        description
      }
    }
  }
`
