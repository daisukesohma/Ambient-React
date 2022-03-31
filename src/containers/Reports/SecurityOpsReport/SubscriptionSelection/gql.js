/*
 * author: rodaan@ambient.ai
 * All the GQL queries for the SubscriptionSelection
 */
import { gql } from 'apollo-boost'

export const GET_ACTIVITY_DIGESTS = gql`
  query {
    allActivityDigests {
      type
      id
    }
  }
`

export const GET_PROFILE_ACTIVITY_DIGESTS = gql`
  query GetProfileActivityDigests($profileId: Int!) {
    profile(profileId: $profileId) {
      id
      activityDigests {
        type
        id
      }
    }
  }
`

export const UPDATE_ACTIVITY_DIGESTS = gql`
  mutation UpdateActivityDigests($activityDigests: [Int], $profileId: Int!) {
    updateActivityDigests(
      activityDigests: $activityDigests
      profileId: $profileId
    ) {
      ok
      activityDigests {
        type
        id
      }
      profileId
    }
  }
`
